/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleAuthOptions} from 'google-auth-library';

import {NodeAuth} from './node/_node_auth';
import {ApiClient} from './_api_client';
import {Caches} from './caches';
import {Chats} from './chats';
import {Files} from './files';
import {Live} from './live';
import {Models} from './models';
import {Tunings} from './tunings';
import {HttpOptions} from './types';

/**
 * Options for initializing the Client. The Client uses the parameters
 * for authentication purposes as well as to infer if SDK should send the
 * request to Vertex AI or Gemini API.
 */
export interface ClientInitOptions {
  /**
   * Optional. The Google Cloud project ID for Vertex AI users.
   * It is not the numeric project name.
   * If not provided, SDK will try to resolve it from runtime environment.
   */
  project?: string;
  /**
   * Optional. The Google Cloud project location for Vertex AI users.
   * If not provided, SDK will try to resolve it from runtime environment.
   */
  location?: string;
  /**
   * The API Key. This is required for Gemini API users.
   */
  apiKey?: string;
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
   * Optional. These are the authentication options provided by google-auth-library for Vertex AI users.
   * Complete list of authentication options are documented in the
   * GoogleAuthOptions interface:
   * https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
   */
  googleAuthOptions?: GoogleAuthOptions;
  /**
   * Optional. A set of customizable configuration for HTTP requests.
   */
  httpOptions?: HttpOptions;
}

export class Client {
  protected readonly apiClient: ApiClient;
  private readonly apiKey?: string;
  public readonly vertexai?: boolean;
  private readonly googleAuthOptions?: GoogleAuthOptions;
  private readonly project?: string;
  private readonly location?: string;
  private readonly apiVersion?: string;
  readonly models: Models;
  readonly live: Live;
  readonly tunings: Tunings;
  readonly chats: Chats;
  readonly caches: Caches;
  readonly files: Files;

  constructor(options: ClientInitOptions) {
    this.apiKey = options.apiKey;
    this.vertexai = options.vertexai;
    this.project = options.project;
    this.location = options.location;
    this.apiVersion = options.apiVersion;
    this.apiClient = new ApiClient({
      auth: new NodeAuth(),
      project: this.project,
      location: this.location,
      apiVersion: this.apiVersion,
      googleAuthOptions: options.googleAuthOptions,
      apiKey: this.apiKey,
      vertexai: this.vertexai,
      httpOptions: options.httpOptions,
    });
    this.models = new Models(this.apiClient);
    this.live = new Live(this.apiClient);
    this.tunings = new Tunings(this.apiClient);
    this.chats = new Chats(this.models, this.apiClient);
    this.caches = new Caches(this.apiClient);
    this.files = new Files(this.apiClient);
  }
}
