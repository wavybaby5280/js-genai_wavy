/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {ApiClient} from '../_api_client';
import {FileStat, Uploader} from '../_uploader';
import {File} from '../types';

export class BrowserUploader implements Uploader {
  upload(
    file: string | Blob,
    uploadUrl: string,
    apiClient: ApiClient,
  ): Promise<File> {
    throw new Error('Not implemented');
  }

  async stat(file: string | Blob): Promise<FileStat> {
    throw new Error('Not implemented');
  }
}
