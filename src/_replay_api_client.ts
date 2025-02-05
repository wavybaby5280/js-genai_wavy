/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as http from 'http';
import {URL} from 'url';

import {ApiClient} from './_api_client';
import {Client, ClientInitOptions} from './client';
import {Live} from './live';
import {Models} from './models';

export interface ReplayClientInitOpts extends ClientInitOptions {
  replaysDirectory?: string;
  replayFile?: string;
  replayFileJson?: object;
  server?: any;
}

export class ReplayAPIClient extends Client {
  public readonly server: any;
  private readonly replaysDirectory: any;
  private replayFile: any;
  private replayFileJson: any;

  constructor(opts: ReplayClientInitOpts) {
    super(opts);
    this.replaysDirectory = process.env['GOOGLE_GENAI_REPLAYS_DIRECTORY'];
    this.replayFile = null;
    this.replayFileJson = null;
  }

  loadReplayFilename(
    replayFilePath: string,
    testTableItem: any,
    testName: string,
  ) {
    const responseFilePath = replayFilePath.replace('_test_table', testName);
    let responseJson: any;

    // Get the response filename from the test name if it exists, otherwise get
    // it from the override replay ID.
    if (fs.existsSync(responseFilePath)) {
      this.replayFile = responseFilePath;
    } else {
      const replayId = testTableItem['overrideReplayId'];
      this.replayFile = replayFilePath.replace(
        '_test_table',
        `${replayId}.${this.vertexai ? 'vertex' : 'mldev'}`,
      );
    }
    this.replayFileJson =
        JSON.parse(fs.readFileSync(this.replayFile, {encoding: 'utf8'}));
  }

  getNumInteractions() {
    return this.replayFileJson?.interactions.length;
  }

  getExpectedResponseFromReplayFile(interactionIndex: number) {
    return this.replayFileJson.interactions[interactionIndex]?.response
      ?.sdk_response_segments[0];
  }

  getExpectedRequestFromReplayFile(interactionIndex: number) {
    return this.replayFileJson.interactions[interactionIndex]?.request;
  }

  /**
   * Sets all the interaction responses on the replay client using the fetch
   * spy.
   */

  setupReplayResponses(fetchSpy: any) {
    const responseJson: any =
        JSON.parse(fs.readFileSync(this.replayFile, {encoding: 'utf8'}));

    const responses: Promise<Response>[] = [];
    for (const interaction of responseJson.interactions) {
      const responseStatusCode = interaction?.response?.status_code ?? 200;
      const interactionResponse = interaction?.response;
      const headers = interaction?.response?.headers;
      const responseBody = JSON.stringify(interactionResponse.body_segments[0]);
      responses.push(
        Promise.resolve(
          new Response(responseBody, {
            status: responseStatusCode,
            headers: headers,
          }),
        ),
      );
    }

    fetchSpy.calls.reset();
    fetchSpy.and.returnValues(...responses);
  }
}
