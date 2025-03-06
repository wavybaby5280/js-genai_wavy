/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {ApiClient} from '../_api_client';
import {FileStat, Uploader} from '../_uploader';
import {File} from '../types';

import {crossError} from './_cross_error';

// TODO(b/401271082): re-enable lint once CrossUploader is implemented.
/*  eslint-disable @typescript-eslint/no-unused-vars */
export class CrossUploader implements Uploader {
  async upload(
    file: string | Blob,
    uploadUrl: string,
    apiClient: ApiClient,
  ): Promise<File> {
    throw crossError();
  }

  async stat(file: string | Blob): Promise<FileStat> {
    throw crossError();
  }
}
