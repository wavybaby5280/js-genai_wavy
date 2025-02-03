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

function websafeEncode(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_');
}

function isBase64Encoded(str: string): boolean {
  try {
    const decoded = atob(str);
    return btoa(decoded) === str;
  } catch (err) {
    return false;
  }
}

function isObjectEmpty(obj: any) {
  if (obj === undefined) {
    return true;
  }
  if (typeof obj !== 'object') {
    return false;
  }
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object') {
      if (!isObjectEmpty(obj[key])) {
        return false;
      }
    } else if (obj[key] !== undefined) {
      return false;
    }
  }
  return true;
}

function assertMessagesEqual(
  actual: any,
  expected: any,
  options?: {ignoreKeys?: string[]},
) {
  const {ignoreKeys = []} = options || {};

  function assertDeepEqual(a: any, b: any) {
    if (typeof a !== typeof b) {
      // Possible that the type is bytes, which is represented in NodeJS as a
      // string.
      if (typeof a === 'string' && typeof b === 'number') {
        if (a !== b.toString()) {
          throw new Error(
            `Unequal string and number values:\n a: ${a}\n b: ${b}`,
          );
        }
        return;
      } else if (a === undefined && typeof b === 'object') {
        if (!isObjectEmpty(b)) {
          throw new Error(`Object should be empty:\n a: ${a}\n b: ${b}`);
        }
        return;
      } else {
        throw new Error(`Invalid type: ${typeof a} !== ${typeof b}`);
      }
    }

    if (typeof a === 'object') {
      const aKeys = Object.keys(a).filter((key) => !ignoreKeys.includes(key));
      const bKeys = Object.keys(b).filter((key) => !ignoreKeys.includes(key));

      if (aKeys.length !== bKeys.length) {
        throw new Error(`Unequal keys: ${aKeys} !== ${bKeys}`);
      }

      for (const key of aKeys) {
        if (key == 'usageMetadata') {
          continue;
        }
        try {
          assertDeepEqual(a[key], b[key]);
        } catch (e) {
          let message = (e as Error).message;
          if (
            !message.includes('Unequal key value') &&
            !message.includes('Unequal key trace')
          ) {
            message = `Unequal key value:\n a[${key}]: ${JSON.stringify(
              a[key],
              null,
              2,
            )}\n b[${key}]: ${JSON.stringify(b[key], null, 2)}`;
          } else {
            message = `Unequal key trace (see cause for detals): ${key}`;
          }

          throw new Error(message, {cause: e});
        }
      }

      return;
    }

    if (typeof a === 'string' && isBase64Encoded(a)) {
      const aEncoded = snakeToCamel(websafeEncode(a));
      const bEncoded = snakeToCamel(websafeEncode(b));
      if (aEncoded !== bEncoded) {
        throw new Error(
          `Unequal base64 encoded strings:\n a: ${aEncoded}\n b: ${bEncoded}`,
        );
      }
      return;
    }

    if (Date.parse(a)) {
      if (Date.parse(a) !== Date.parse(b)) {
        throw new Error(`Unequal dates:\n a: ${a}\n b: ${b}`);
      }
      return;
    }

    if (a !== b) {
      throw new Error(`Unequal values:\n a: ${a}\n b: ${b}`);
    }
  }

  assertDeepEqual(actual, expected);
}

function redactVersionNumber(versionNumber: string) {
  return versionNumber.replace(/v*\d+\.\d+\.\d+/g, '{VERSION_NUMBER}');
}

function redactLanguageLabel(languageLabel: string) {
  return languageLabel.replace(/gl-node/g, '{LANGUAGE_LABEL}');
}

function redactHeader(headerKey: string, headerValue: string) {
  if (headerKey.toLowerCase() === 'x-goog-api-key') {
    return '{REDACTED}';
  } else if (headerKey.toLowerCase() === 'user-agent') {
    return redactLanguageLabel(redactVersionNumber(headerValue));
  } else if (headerKey.toLowerCase() === 'x-goog-api-client') {
    return redactLanguageLabel(redactVersionNumber(headerValue));
  } else {
    return headerValue;
  }
}

function redactUrl(url: string) {
  // Redact all the url parts before the resource name, so the test can work
  // against any project, location, version, or whether it's EasyGCP.
  url = url.replace(
    /.*\/projects\/[^/]+\/locations\/[^/]+\//,
    '{VERTEX_URL_PREFIX}/',
  );
  url = url.replace(
    /.*-aiplatform.googleapis.com\/[^/]+\//,
    '{VERTEX_URL_PREFIX}/',
  );
  url = url.replace(
    /https:\/\/generativelanguage.googleapis.com\/[^/]+/,
    '{MLDEV_URL_PREFIX}',
  );
  return url;
}

function normalizeKey(key: string) {
  if (key === 'content-type') {
    return 'Content-Type';
  } else if (key === 'authorization') {
    return null;
  } else {
    return key;
  }
}

function normalizeHeaders(headers?: Headers, ignoreAuthorizationHeader = true) {
  let headersObject: {[key: string]: string} = {};
  if (headers) {
    for (const [key, value] of headers) {
      const normalizedKey = normalizeKey(key);
      if (normalizedKey === null) {
        continue;
      }
      headersObject[normalizedKey] = redactHeader(normalizedKey, value);
    }
  }
  return headersObject;
}

function redactProjectAndLocationPath(path: string) {
  return path.replace(
    /projects\/[^/]+\/locations\/[^/]+\//,
    '{PROJECT_AND_LOCATION_PATH}/',
  );
}

function normalizeBody(body: string) {
  try {
    if (body === undefined) {
      return body;
    }
    let parsedBody = JSON.parse(body);
    if (typeof parsedBody === 'object' && parsedBody !== null) {
      for (const key of Object.keys(parsedBody as object)) {
        let value = (parsedBody as any)[key];
        if (typeof value === 'string') {
          (parsedBody as any)[key] = redactProjectAndLocationPath(value);
        }
      }
      parsedBody = [parsedBody];
    }
    return parsedBody;
  } catch (e) {
    console.log('    === Failed to parse body: ', e);
    console.log('    === body: ', body);
    return body;
  }
}

function normalizeRequest(request: RequestInit, url: string) {
  return {
    method: request.method?.toLowerCase(),
    url: redactUrl(url),
    headers: normalizeHeaders(request.headers as Headers),
    bodySegments: normalizeBody(request.body as string),
  };
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
  let apiKey = process.env['GOOGLE_GENAI_API_KEY'];
  if (apiKey === undefined || apiKey === null || apiKey === '') {
    apiKey = 'This is not the key you are looking for';
  }
  const replayClient = new ReplayAPIClient({
    vertexai: vertexai,
    apiKey: apiKey,
  });
  return replayClient;
}

async function runTestTable(
  filePath: string,
  client: ReplayAPIClient,
  fetchSpy: any,
) {
  const data = await fs.promises.readFile(filePath, 'utf8');
  const testTableFile = JSON.parse(data) as types.TestTableFile;
  const parts = testTableFile.testMethod!.split('.');
  const moduleName: string = snakeToCamel(parts[0]);
  let methodName: string = snakeToCamel(parts[1]);
  // Test the _list method since the replay files expect the list response
  // instead of the Pager wrapper.
  if (methodName === 'list') {
    methodName = '_list';
  }
  const module: object = (client as any)[moduleName];
  if (!module) {
    console.log(
      `    === Skipping method: ${testTableFile.testMethod}. Module "${
        moduleName
      }" is not supported in NodeJS`,
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
      client.vertexai ? 'vertex' : 'mldev'
    }`;
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

    const parameters = JSON.parse(
      snakeToCamel(JSON.stringify(Object.values(testTableItem.parameters!))),
    );

    // TODO(b/392700953): Remove once this test works.
    if (
      testName.startsWith('models.embedContent.test_multi_texts_with_config')
    ) {
      continue;
    }
    console.log(
      `   === Calling method: ${testName} on test mode: ${getTestMode()}`,
    );

    try {
      if (getTestMode() === 'replay') {
        client.getReplayFilename(
          filePath,
          testTableItem,
          `${testTableItem.name}.${client.vertexai ? 'vertex' : 'mldev'}`,
        );

        const numInteractions = client.getNumInteractions();

        for (let i = 0; i < numInteractions; i++) {
          // Set the response for the mock server
          client.mockReplayEndpoint(i, fetchSpy);

          const response = await method.apply(client, parameters);
          const expectedResponse = client.getExpectedResponseFromReplayFile(i);
          const expectedRequest = client.getExpectedRequestFromReplayFile(i);
          const responseCamelCase = JSON.parse(
            snakeToCamel(JSON.stringify(response)),
          );
          const expectedResponseCamelCase = JSON.parse(
            snakeToCamel(JSON.stringify(expectedResponse)),
          );
          const expectedRequestCamelCase = JSON.parse(
            snakeToCamel(JSON.stringify(expectedRequest)),
          );
          const requestArgs = fetchSpy.calls.mostRecent();
          const request = requestArgs.args[1];
          const url = requestArgs.args[0];

          assertMessagesEqual(responseCamelCase, expectedResponseCamelCase);
          assertMessagesEqual(
            normalizeRequest(request, url),
            expectedRequestCamelCase,
          );
        }
      } else {
        const response = await method.apply(client, parameters);
        console.log('response: ', response);
      }
      console.log(`      === Success: ${testName}`);
    } catch (e) {
      if (e instanceof Error) {
        console.log(`      === Error: ${e.stack}`);
      } else {
        console.log(`      === Error: ${e}`);
      }
      console.log(
        `      === Parameters: ${JSON.stringify(parameters, null, 2)}`,
      );
      process.exit(1); // Exit the process.
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
      files
        .filter((file: string) => file.endsWith('/_test_table.json'))
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
        spyOn(vertexClient.apiClient, 'fetchToken').and.returnValue(
          Promise.resolve('token'),
        );
      }
      for (const file of testFiles) {
        await runTestTable(file, mlDevClient, fetchSpy);
        await runTestTable(file, vertexClient, fetchSpy);
      }
    })
    .catch((err) => console.error(err));
}

describe('TableTest', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // 30 seconds
  it('runs table tests', async () => {
    await main();
  });
});
