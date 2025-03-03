/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ApiClient} from '../_api_client';
import {Caches} from '../caches';
import {Chats} from '../chats';
import {ClientInitOptions} from '../client';
import {Files} from '../files';
import {Live} from '../live';
import {Models} from '../models';
import {Tunings} from '../tunings';
import {BrowserWebSocketFactory} from './_browser_websocket';
import {WebAuth} from './_web_auth';

const LANGUAGE_LABEL_PREFIX = 'gl-node/';

/**
  Use this client to make a request to the Gemini Developer API or Vertex AI
  API and then wait for the response.

  To initialize the client, Gemini API users can provide API key by providing
  input argument `apiKey="your-api-key"`.

  Vertex AI API users can provide inputs argument as `vertexai=true.

  Attributes:
    options: See ClientInitOptions for usage.

  Usage for the Gemini Developer API:

  ```ts
    import * as genai from ("@google/genai");

    const client = genai.Client({apiKey: 'my-api-key'})
  ```

  Usage for the Vertex AI API:

  ```ts
    import * as genai from ("@google/genai");

    const client = genai.Client({
        vertexai: true, project: 'my-project-id', location: 'us-central1'
    })
  ```
  */
export class Client {
  protected readonly apiClient: ApiClient;
  private readonly apiKey?: string;
  public readonly vertexai: boolean;
  private readonly apiVersion?: string;
  readonly models: Models;
  readonly live: Live;
  readonly tunings: Tunings;
  readonly chats: Chats;
  readonly caches: Caches;
  readonly files: Files;

  constructor(options: ClientInitOptions) {
    if (options.apiKey == null) {
      throw new Error('An API Key must be set when running in a browser');
    }
    this.vertexai = options.vertexai ?? false;
    this.apiKey = options.apiKey;
    this.apiVersion = options.apiVersion;
    const auth = new WebAuth(this.apiKey);
    this.apiClient = new ApiClient({
      auth: auth,
      apiVersion: this.apiVersion,
      apiKey: this.apiKey,
      vertexai: this.vertexai,
      httpOptions: options.httpOptions,
      userAgentExtra: LANGUAGE_LABEL_PREFIX + 'web',
    });
    this.models = new Models(this.apiClient);
    this.live = new Live(this.apiClient, auth, new BrowserWebSocketFactory());
    this.tunings = new Tunings(this.apiClient);
    this.chats = new Chats(this.models, this.apiClient);
    this.caches = new Caches(this.apiClient);
    this.files = new Files(this.apiClient);
  }
}
