/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';

import { Auth } from '../_auth';

export const AUTHORIZATION_HEADER = 'Authorization';
const REQUIRED_VERTEX_AI_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';

export class NodeAuth implements Auth {
  private readonly googleAuth: GoogleAuth;

  constructor(authOptions?: GoogleAuthOptions) {
    let vertexAuthOptions = buildGoogleAuthOptions(authOptions);
    this.googleAuth = new GoogleAuth(vertexAuthOptions);
  }

  async addAuthHeaders(headers: Headers): Promise<void> {
    if (headers.get(AUTHORIZATION_HEADER) !== null) {
      return;
    }
    const token = await this.googleAuth.getAccessToken();
    headers.append(AUTHORIZATION_HEADER, `Bearer ${token}`);
  }
}

function buildGoogleAuthOptions(googleAuthOptions?: GoogleAuthOptions): GoogleAuthOptions {
  let authOptions: GoogleAuthOptions;
  if (!googleAuthOptions) {
    authOptions = {
      scopes: [REQUIRED_VERTEX_AI_SCOPE],
    };
    return authOptions;
  } else {
    authOptions = googleAuthOptions;
    if (!authOptions.scopes) {
      authOptions.scopes = [REQUIRED_VERTEX_AI_SCOPE];
      return authOptions;
    } else if (
      (typeof authOptions.scopes === 'string' && authOptions.scopes !== REQUIRED_VERTEX_AI_SCOPE) ||
      (Array.isArray(authOptions.scopes) && authOptions.scopes.indexOf(REQUIRED_VERTEX_AI_SCOPE) < 0)
    ) {
      throw new Error(`Invalid auth scopes. Scopes must include: ${REQUIRED_VERTEX_AI_SCOPE}`);
    }
    return authOptions;
  }
}
