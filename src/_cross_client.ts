/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleAuthOptions} from 'google-auth-library';
import {Auth} from './_auth';
import {HttpOptions} from './types';

// TODO: bring back the client link once cross client lands
/**
 * Client configuration options.
 *
 * See link Client for usage samples.
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
   * Only supported on Node runtimes, ignored on browser runtimes and for Gemini client.
   *
   */
  googleAuthOptions?: GoogleAuthOptions;
  /**
   * Optional. A set of customizable configuration for HTTP requests.
   */
  httpOptions?: HttpOptions;
  // This is currently needed for teh table_tests.
  // TODO(b/399727178): remove this once we refactor the table_test.
  /**
   * The object used for adding authentication headers to API requests.
   */
  auth?: Auth;
}
