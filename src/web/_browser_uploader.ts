/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {ApiClient} from '../_api_client';
import {FileStat, Uploader} from '../_uploader';
import {CrossUploader} from '../cross/_cross_uploader';
import {File} from '../types';

export class BrowserUploader implements Uploader {
  async upload(
    file: string | Blob,
    uploadUrl: string,
    apiClient: ApiClient,
  ): Promise<File> {
    if (typeof file === 'string') {
      throw new Error('File path is not supported in browser uploader.');
    }

    const crossUploader = new CrossUploader();
    return await crossUploader.uploadBlob(file, uploadUrl, apiClient);
  }

  async stat(file: string | Blob): Promise<FileStat> {
    if (typeof file === 'string') {
      throw new Error('File path is not supported in browser uploader.');
    } else {
      const fileStat: FileStat = {size: file.size, type: file.type};
      return fileStat;
    }
  }
}
