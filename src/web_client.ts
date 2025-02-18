/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ApiClient} from './_api_client';
import {BrowserWebSocketFactory} from './_browser_websocket';
import {WebAuth} from './_web_auth';
import {Caches} from './caches';
import {Chats} from './chats';
import {Files} from './files';
import {Live} from './live';
import {Models} from './models';
import {Tunings} from './tunings';
import {HttpOptions} from './types';

const LANGUAGE_LABEL_PREFIX = 'gl-node/';

/**
 * Options for initializing the WebClient. The client uses the parameters
 * for authentication purposes as well as to infer if SDK should send the
 * request to Vertex AI or Gemini API.
 */
export interface WebClientInitOptions {
  /**
   * The API Key.
   */
  apiKey: string;
  /**
   * Optional. Set to true if you intend to call Vertex AI endpoints.
   * If unset, default SDK behavior is to call Gemini API.
   */
  vertexai?: boolean;
  /**
   * Optional. The API version for the endpoint.
   * If unset, SDK will choose a default api version.
   */
  apiVersion?: string;
  /**
   * Optional. A set of customizable configuration for HTTP requests.
   */
  httpOptions?: HttpOptions;
}

/**
  Client for making requests in a browser-compatible environment.

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
export class WebClient {
  protected readonly apiClient: ApiClient;
  private readonly apiKey: string;
  public readonly vertexai: boolean;
  private readonly apiVersion?: string;
  readonly models: Models;
  readonly live: Live;
  readonly tunings: Tunings;
  readonly chats: Chats;
  readonly caches: Caches;
  readonly files: Files;

  constructor(options: WebClientInitOptions) {
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
