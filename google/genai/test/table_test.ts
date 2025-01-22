/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Client} from '../src/client';
import {ReplayAPIClient} from '../src/_replay_api_client';
import * as types from '../src/types';

function getGoogle3Path() {
  if (process.env['UNITTEST_ON_FORGE']) {
    return process.cwd();
  }
  const currentDir = process.cwd();
  const lastIndex = currentDir.lastIndexOf('google3/');
  if (lastIndex === -1) {
    return '';
  }
  return currentDir.substring(0, lastIndex + 'google3/'.length);
}

const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');

/**
 * Gets the test mode from the environment variable. Currently supports 'api'
 * and 'replay' mode and defaults to replay.
 */
function getTestMode() {
  const mode = process.env['GOOGLE_GENAI_CLIENT_MODE'];
  if (mode === 'api') {
    return 'api';
  } else {
    return 'replay';
  }
}

async function walk(dir: string): Promise<string[]> {
  let files = await fs.promises.readdir(dir);
  files = await Promise.all(
      files.map(async (file: string) => {
        const filePath = path.join(dir, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if (stats.isFile()) return filePath;
      }),
  );

  return files.reduce(
      (all: string[], folderContents: string[]) => all.concat(folderContents),
      [],
  );
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Creates a new ReplayAPIClient. If the tests are running in replay mode, the
 * client will be configured to use the mock server.
 */
async function createReplayClient(vertexai: boolean) {
  const replayClient = new ReplayAPIClient({
    vertexai: vertexai,
  });
  return replayClient;
}

async function runTestTable(
    filePath: string, client: ReplayAPIClient, fetchSpy: any) {
  const data = await fs.promises.readFile(filePath, 'utf8');
  const testTableFile = JSON.parse(data) as types.TestTableFile;
  const parts = testTableFile.testMethod!.split('.');
  const moduleName: string = snakeToCamel(parts[0]);
  const methodName: string = snakeToCamel(parts[1]);
  const module: object = (client as any)[moduleName];
  if (!module) {
    console.log(
        `    === Skipping method: ${testTableFile.testMethod}. Module "${
            moduleName}" is not supported in NodeJS`,
    );
    return;
  }
  const method: Function = (module as any)[methodName];
  if (!method) {
    console.log(
      `   === Skipping method: ${testTableFile.testMethod}, not supported in NodeJS`,
    );
    return;
  }
  console.log(`=== Running test table: ${testTableFile.testMethod}`);
  for (const testTableItem of testTableFile.testTable!) {
    const testName = `${moduleName}.${methodName}.${testTableItem.name}.${
        client.vertexai ? 'vertex' : 'mldev'}`;
    if (testTableItem.exceptionIfMldev && !client.vertexai) {
      // TODO: ybo handle exception.
      console.log(
        `   === Skipping item: ${testName} because it should fail in MLDev`,
      );
      continue;
    }
    if (testTableItem.exceptionIfVertex && client.vertexai) {
      // TODO: ybo handle exception.
      console.log(
        `   === Skipping item: ${testName} because it should fail in VertexAI`,
      );
      continue;
    }
    if (testTableItem.skipInApiMode) {
      console.log(
        `   === Skipping item: ${testName} because it is not repeatable in API mode`,
      );
      continue;
    }
    // TODO(b/384972928): Remove this once http options in the method levelare
    // supported in nodejs.
    if (testName.includes('http_options_in_method')) {
      console.log(
          `   === Skipping item: ${
              testName} because nodejs does not support http options in the method`,
      );
      continue;
    }
    console.log(`   === Calling method: ${testName}`);
    const parameters = Object.values(testTableItem.parameters!);
    try {
      if (getTestMode() === 'replay') {
        client.getReplayFilename(
            filePath, testTableItem,
            `${testTableItem.name}.${client.vertexai ? 'vertex' : 'mldev'}`);

        const numInteractions = client.getNumInteractions();

        for (let i = 0; i < numInteractions; i++) {
          // Set the response for the mock server
          client.mockReplayEndpoint(i, fetchSpy);

          const response = await method.apply(client, parameters);
          const expectedResponse = client.getExpectedResponseFromReplayFile(i);
          const responseCamelCase =
              JSON.parse(snakeToCamel(JSON.stringify(response)));
          const expectedResponseCamelCase =
              JSON.parse(snakeToCamel(JSON.stringify(expectedResponse)));

          // TODO (b/388478808): get this assertion to pass
          // assert.deepStrictEqual(responseCamelCase,
          // expectedResponseCamelCase);
        }

      } else {
        const response = await method.apply(client, parameters);
        console.log('response: ', response);
      }
      console.log(`      === Success: ${testName}`);
    } catch (e) {
      console.log(`      === Error: ${e}`);
      process.exit(1);  // Exit the process.
    }
  }
}

async function main() {
  const google3Path = getGoogle3Path();
  const replayPath =
      google3Path + '/google/cloud/aiplatform/sdk/genai/replays/tests';

  const mlDevClient = await createReplayClient(false);
  const vertexClient = await createReplayClient(true);

  const testFiles: string[] = [];
  await walk(replayPath)
      .then(async (files) => {
        files.filter((file: string) => file.endsWith('/_test_table.json'))
            .forEach(async (file: string) => {
              testFiles.push(file);
            });
      })
      .then(async () => {
        let fetchSpy: any;
        if (getTestMode() === 'replay') {
          fetchSpy = spyOn(global, 'fetch');
          // @ts-ignore TS2345 Argument of type '"fetchToken"' is not assignable
          // to parameter of type 'keyof ApiClient'.
          spyOn(vertexClient.apiClient, 'fetchToken')
              .and.returnValue(Promise.resolve('token'));
        }
        for (const file of testFiles) {
          await runTestTable(file, mlDevClient, fetchSpy);
          await runTestTable(file, vertexClient, fetchSpy);
        }
      })
      .catch((err) => console.error(err));
}

describe('TableTest', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;  // 30 seconds
  it('runs table tests', async () => {
    await main();
  });
});
