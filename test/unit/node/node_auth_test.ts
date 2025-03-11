/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';

import {
  AUTHORIZATION_HEADER,
  GOOGLE_API_KEY_HEADER,
  NodeAuth,
} from '../../../src/node/_node_auth';

const REQUIRED_VERTEX_AI_SCOPE =
  'https://www.googleapis.com/auth/cloud-platform';

describe('NodeAuth', () => {
  it('should throw an error if the scopes do not include the required scope when custom scopes are provided', () => {
    const customScope = 'https://www.googleapis.com/auth/other-scope';
    const authOptions: GoogleAuthOptions = {scopes: [customScope]};
    expect(() => new NodeAuth({googleAuthOptions: authOptions})).toThrowError(
      `Invalid auth scopes. Scopes must include: ${REQUIRED_VERTEX_AI_SCOPE}`,
    );
  });
});

interface NodeAuthWithGoogleAuth {
  googleAuth: jasmine.SpyObj<GoogleAuth>;
}

describe('addAuthHeaders', () => {
  let googleAuthMock: jasmine.SpyObj<GoogleAuth>;

  beforeEach(() => {
    googleAuthMock = jasmine.createSpyObj('GoogleAuth', ['getAccessToken']);
  });

  it('should add an Authorization header with a Bearer token to the headers if it does not already exist', async () => {
    const nodeAuth = new NodeAuth({});
    (nodeAuth as unknown as NodeAuthWithGoogleAuth).googleAuth = googleAuthMock; // Inject the mock
    const mockToken = 'test-token';
    googleAuthMock.getAccessToken.and.resolveTo(mockToken);
    const headers = new Headers();

    await nodeAuth.addAuthHeaders(headers);

    expect(headers.get(AUTHORIZATION_HEADER)).toBe(`Bearer ${mockToken}`);
    expect(googleAuthMock.getAccessToken).toHaveBeenCalled();
  });

  it('should not add an Authorization header if it already exists', async () => {
    const nodeAuth = new NodeAuth({});
    const headers = new Headers();
    headers.append(AUTHORIZATION_HEADER, 'Existing Token');

    await nodeAuth.addAuthHeaders(headers);

    expect(googleAuthMock.getAccessToken).not.toHaveBeenCalled();
    expect(headers.get(AUTHORIZATION_HEADER)).toBe('Existing Token');
  });

  it('should add an x-goog-api-key header if apiKey is provided', async () => {
    const apiKey = 'test-api-key';
    const nodeAuth = new NodeAuth({apiKey: apiKey});
    const headers = new Headers();

    await nodeAuth.addAuthHeaders(headers);

    expect(headers.get(GOOGLE_API_KEY_HEADER)).toBe(apiKey);
  });

  it('should not add an x-goog-api-key header if it already exists', async () => {
    const apiKey = 'test-api-key';
    const nodeAuth = new NodeAuth({apiKey: apiKey});
    const headers = new Headers();
    headers.append(GOOGLE_API_KEY_HEADER, 'Existing Key');

    await nodeAuth.addAuthHeaders(headers);

    expect(headers.get(GOOGLE_API_KEY_HEADER)).toBe('Existing Key');
  });

  it('should not call googleAuth.getAccessToken if apiKey is provided', async () => {
    const apiKey = 'test-api-key';
    const nodeAuth = new NodeAuth({apiKey: apiKey});
    const headers = new Headers();

    await nodeAuth.addAuthHeaders(headers);

    expect(googleAuthMock.getAccessToken).not.toHaveBeenCalled();
  });
});
