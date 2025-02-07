/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiClient } from './_api_client';
import { WebAuth } from './_web_auth';
import { Caches } from './caches';
import { Chats } from './chats';
import { Files } from './files';
// TODO: bring this back when live is web compatible
// import {Live} from './live';
import { Models } from './models';
import { Tunings } from './tunings';
import { HttpOptions } from './types';

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

export class WebClient {
  protected readonly apiClient: ApiClient;
  private readonly apiKey: string;
  public readonly vertexai: boolean;
  private readonly apiVersion?: string;
  readonly models: Models;
  // TODO: bring this back when live is web compatible
  // readonly live: Live;
  readonly tunings: Tunings;
  readonly chats: Chats;
  readonly caches: Caches;
  readonly files: Files;

  constructor(options: WebClientInitOptions) {
    this.vertexai = options.vertexai ?? false;
    this.apiKey = options.apiKey;
    this.apiVersion = options.apiVersion;
    this.apiClient = new ApiClient({
      auth: new WebAuth(options.apiKey),
      apiVersion: this.apiVersion,
      apiKey: this.apiKey,
      vertexai: this.vertexai,
      httpOptions: options.httpOptions,
      userAgentExtra: LANGUAGE_LABEL_PREFIX + 'web',
    });
    this.models = new Models(this.apiClient);
    // TODO: bring this back when live is web compatible
    // this.live = new Live(this.apiClient);
    this.tunings = new Tunings(this.apiClient);
    this.chats = new Chats(this.models, this.apiClient);
    this.caches = new Caches(this.apiClient);
    this.files = new Files(this.apiClient);
  }
}
