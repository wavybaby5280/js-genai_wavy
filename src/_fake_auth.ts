/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Auth } from '../src/_auth';
import { AUTHORIZATION_HEADER } from '../src/node/_node_auth';

export class FakeAuth implements Auth {
  async addAuthHeaders(headers: Headers): Promise<void> {
    if (headers.get(AUTHORIZATION_HEADER) !== null) {
      return;
    }
    headers.append(AUTHORIZATION_HEADER, `Bearer token`);
  }
}
