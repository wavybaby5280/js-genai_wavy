/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';

import {ApiClient} from './_api_client';
import {Client, ClientInitOptions} from './node/client';

/**
 * Configuration options for initializing a `ReplayClient`.
 *
 * This interface extends the base {@link ./_api_client.ClientInitOptions} and
 * private fields to hold the replay file's path or its JSON format.
 *
 * @interface
 * @extends ClientInitOptions
 */
export interface ReplayClientInitOpts extends ClientInitOptions {
  replayFile?: string;
  replayFileJson?: object;
}

/**
 * The ReplayAPIClient class is used to execute intergration tests in replay
 * mode, where the API responses are loaded and constructed from recorded files.
 */
export class ReplayAPIClient extends Client {
  private replayFile: any;
  private replayFileJson: any;

  constructor(opts: ReplayClientInitOpts) {
    super(opts);
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
