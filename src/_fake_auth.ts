/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Auth} from '../src/_auth';
import {
  AUTHORIZATION_HEADER,
  GOOGLE_API_KEY_HEADER,
} from '../src/node/_node_auth';

/**
 * A mock implementation of the Auth interface for testing purposes.
 */
export class FakeAuth implements Auth {
  constructor(private readonly apiKey?: string) {}

  async addAuthHeaders(headers: Headers): Promise<void> {
    if (this.apiKey !== undefined) {
      if (headers.get(GOOGLE_API_KEY_HEADER) !== null) {
        return;
      }
      headers.append(GOOGLE_API_KEY_HEADER, this.apiKey);
      return;
    }

    if (headers.get(AUTHORIZATION_HEADER) !== null) {
      return;
    }
    headers.append(AUTHORIZATION_HEADER, `Bearer token`);
  }
}
