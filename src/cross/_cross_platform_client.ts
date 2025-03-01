/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleAuthOptions} from 'google-auth-library';
import {Auth} from '../_auth';
import {HttpOptions} from '../types';
import { ApiClient } from '../_api_client';
import { Models } from '../models';
import { Live } from '../live';
import { Tunings } from '../tunings';
import { Chats } from '../chats';
import { Caches } from '../caches';
import { Files } from '../files';
import { WebAuth } from '../web/_web_auth';
import { CrossWebSocketFactory } from './_cross_websocket';
import { crossError } from './_cross_error';

const LANGUAGE_LABEL_PREFIX = 'gl-node/';

/**
 * Client configuration options.
 *
 * See {@link Client} for usage samples.
 */

export interface ClientInitOptions {
  /**
   * Optional. Determines whether to create a Vertex AI or a Gemini Client.
   *
   * When true, a Vertex AI client will be created, using the [Google Vertex AI API](https://cloud.google.com/vertex-ai/docs/reference/rest).
   * When false, a Gemini client will be created, using the [Google Gemini API](https://ai.google.dev/gemini-api/docs#rest)
   * Set to true if you intend to call Vertex AI endpoints.
   * If unset, default SDK behavior is to use the Gemini API service.
   */
  vertexai?: boolean;
  /**
   * Optional. The Google Cloud project ID for Vertex AI clients.
   *
   * Only supported on Node runtimes, ignored on browser runtimes.
   */
  project?: string;
  /**
   * Optional. The Google Cloud project region for Vertex AI clients.
   *
   * Only supported on Node runtimes, ignored on browser runtimes.
   *
   */
  location?: string;
  /**
   * The API Key, required for Gemini API clients.
   *
   * Required on browser runtimes.
   */
  apiKey?: string;
  /**
   * Optional. The API version to use.
   * If unset, SDK will choose a default api version.
   */
  apiVersion?: string;
  /**
   * Optional. These are the authentication options provided by google-auth-library for Vertex AI clients.
   *
   * Complete list of authentication options are documented in the
   * GoogleAuthOptions interface:
   * https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
   *
   * Only supported on Node runtimes, ignored on browser runtimes.
   *
   */
  googleAuthOptions?: GoogleAuthOptions;
  /**
   * Optional. A set of customizable configuration for HTTP requests.
   */
  httpOptions?: HttpOptions;
  // This is currently needed for teh table_tests.
  // TODO: remove this once we refactor the table_test.
  /**
   * The object used for adding authentication headers to API requests.
   */
  auth?: Auth;
}


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
      throw new Error(`An API Key must be set when running in an unspecified environment.\n + ${crossError().message}`);
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
    this.live = new Live(this.apiClient, auth, new CrossWebSocketFactory());
    this.tunings = new Tunings(this.apiClient);
    this.chats = new Chats(this.models, this.apiClient);
    this.caches = new Caches(this.apiClient);
    this.files = new Files(this.apiClient);
  }
}
