/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {FileHandle, open, stat} from 'fs/promises';

import {ApiClient} from '../_api_client';
import {FileStat, Uploader} from '../_uploader';
import {File, HttpResponse} from '../types';

const MAX_CHUNK_SIZE = 1024 * 1024 * 8; // bytes

export class NodeUploader implements Uploader {
  async stat(file: string | Blob): Promise<FileStat> {
    const fileStat: FileStat = {size: 0, type: undefined};
    if (typeof file === 'string') {
      const originalStat = await stat(file);
      fileStat.size = originalStat.size;
      fileStat.type = this.inferMimeType(file);
      return fileStat;
    } else {
      fileStat.type = file.type;
      fileStat.size = file.size;
      return fileStat;
    }
  }

  async upload(
    file: string | Blob,
    uploadUrl: string,
    apiClient: ApiClient,
  ): Promise<File> {
    let response: HttpResponse|undefined;
    if (typeof file === 'string') {
      response = await this.uploadFileFromPath(
          file,
          uploadUrl,
          apiClient,
      );
    } else {
      response = await this.uploadBlob(
          file,
          uploadUrl,
          apiClient,
      );
    }

    const responseJson = await response?.json();
    if (response?.headers?.['x-goog-upload-status'] !== 'final') {
      throw new Error(
        'Failed to upload file: Upload status is not finalized.'
      );
    }
    return responseJson as File;
  }

  /**
   * Infers the MIME type of a file based on its extension.
   *
   * @param filePath The path to the file.
   * @returns The MIME type of the file, or undefined if it cannot be inferred.
   */
  private inferMimeType(filePath: string): string | undefined {
    // Get the file extension.
    const fileExtension = filePath.slice(filePath.lastIndexOf('.') + 1);

    // Create a map of file extensions to MIME types.
    const mimeTypes: {[key: string]: string} = {
      'aac': 'audio/aac',
      'abw': 'application/x-abiword',
      'arc': 'application/x-freearc',
      'avi': 'video/x-msvideo',
      'azw': 'application/vnd.amazon.ebook',
      'bin': 'application/octet-stream',
      'bmp': 'image/bmp',
      'bz': 'application/x-bzip',
      'bz2': 'application/x-bzip2',
      'csh': 'application/x-csh',
      'css': 'text/css',
      'csv': 'text/csv',
      'doc': 'application/msword',
      'docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'eot': 'application/vnd.ms-fontobject',
      'epub': 'application/epub+zip',
      'gz': 'application/gzip',
      'gif': 'image/gif',
      'htm': 'text/html',
      'html': 'text/html',
      'ico': 'image/vnd.microsoft.icon',
      'ics': 'text/calendar',
      'jar': 'application/java-archive',
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'js': 'text/javascript',
      'json': 'application/json',
      'jsonld': 'application/ld+json',
      'kml': 'application/vnd.google-earth.kml+xml',
      'kmz': 'application/vnd.google-earth.kmz+xml',
      'mjs': 'text/javascript',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'mpeg': 'video/mpeg',
      'mpkg': 'application/vnd.apple.installer+xml',
      'odt': 'application/vnd.oasis.opendocument.text',
      'oga': 'audio/ogg',
      'ogv': 'video/ogg',
      'ogx': 'application/ogg',
      'opus': 'audio/opus',
      'otf': 'font/otf',
      'png': 'image/png',
      'pdf': 'application/pdf',
      'php': 'application/x-httpd-php',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'rar': 'application/vnd.rar',
      'rtf': 'application/rtf',
      'sh': 'application/x-sh',
      'svg': 'image/svg+xml',
      'swf': 'application/x-shockwave-flash',
      'tar': 'application/x-tar',
      'tif': 'image/tiff',
      'tiff': 'image/tiff',
      'ts': 'video/mp2t',
      'ttf': 'font/ttf',
      'txt': 'text/plain',
      'vsd': 'application/vnd.visio',
      'wav': 'audio/wav',
      'weba': 'audio/webm',
      'webm': 'video/webm',
      'webp': 'image/webp',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'xhtml': 'application/xhtml+xml',
      'xls': 'application/vnd.ms-excel',
      'xlsx':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'xml': 'application/xml',
      'xul': 'application/vnd.mozilla.xul+xml',
      'zip': 'application/zip',
      '3gp': 'video/3gpp',
      '3g2': 'video/3gpp2',
      '7z': 'application/x-7z-compressed',
    };

    // Look up the MIME type based on the file extension.
    const mimeType = mimeTypes[fileExtension.toLowerCase()];

    // Return the MIME type.
    return mimeType;
  }

  /**
   * Uploads a chunk of data to the specified URL using the specified upload
   * command.
   *
   * @param chunk The chunk of data as a Blob to upload.
   * @param uploadUrl The URL to upload the chunk to.
   * @param uploadCommand The upload command to use.
   * @param apiClient The API client to use.
   * @param offset The number of bytes read so far.
   * @param bytesRead The number of bytes contained in the chunk.
   * @return A promise that resolves to the HTTP response from the upload
   *     request.
   */
  private async uploadChunk(
    chunk: Blob,
    uploadUrl: string,
    uploadCommand: string,
    apiClient: ApiClient,
    offset: number,
    bytesRead: number,
  ): Promise<HttpResponse | undefined> {
    return await apiClient.request({
      path: '',
      body: chunk,
      httpMethod: 'POST',
      httpOptions: {
        apiVersion: '',
        baseUrl: uploadUrl,
        headers: {
          'X-Goog-Upload-Command': uploadCommand,
          'X-Goog-Upload-Offset': String(offset),
          'Content-Length': String(bytesRead),
        },
      },
    });
  }

  private async uploadFileFromPath(
      file: string,
      uploadUrl: string,
      apiClient: ApiClient,
      ): Promise<HttpResponse|undefined> {
    let fileSize = 0;
    let offset = 0;
    let response: HttpResponse | undefined;
    let uploadCommand = 'upload';
    let fileHandle: FileHandle | undefined;
    try {
      fileHandle = await open(file, 'r');
      if (!fileHandle) {
        throw new Error(`Failed to open file`);
      }
      fileSize = (await fileHandle.stat()).size;
      while (offset < fileSize) {
        const chunkSize = Math.min(MAX_CHUNK_SIZE, fileSize - offset);
        if (offset + chunkSize >= fileSize) {
          uploadCommand += ', finalize';
        }
        const buffer = new Uint8Array(chunkSize);
        const {bytesRead: bytesRead} = await fileHandle.read(
            buffer,
            0,
            chunkSize,
            offset,
        );

        if (bytesRead !== chunkSize) {
          throw new Error(
            `Failed to read ${chunkSize} bytes from file at offset ${
              offset
            }. bytes actually read: ${bytesRead}`,
          );
        }

        const chunk = new Blob([buffer]);
        response = await this.uploadChunk(
          chunk,
          uploadUrl,
          uploadCommand,
          apiClient,
          offset,
          bytesRead,
        );
        offset += bytesRead;
        // The `x-goog-upload-status` header field can be `active`, `final` and
        //`cancelled` in resposne.
        if (response?.headers?.['x-goog-upload-status'] !== 'active') {
          return response;
        }
        if (fileSize <= offset) {
          throw new Error(
            'All content has been uploaded, but the upload status is not finalized.'
          );
        }
      }
      return response;
    } finally {
      // Ensure the file handle is always closed
      if (fileHandle) {
        await fileHandle.close();
      }
    }
  }

  private async uploadBlob(
      file: Blob,
      uploadUrl: string,
      apiClient: ApiClient,
      ): Promise<HttpResponse|undefined> {
    let fileSize = 0;
    let offset = 0;
    let response: HttpResponse | undefined;
    let uploadCommand = 'upload';
    fileSize = file.size;
    while (offset < fileSize) {
      const chunkSize = Math.min(MAX_CHUNK_SIZE, fileSize - offset);
      const chunk = file.slice(offset, offset + chunkSize);
      if (offset + chunkSize >= fileSize) {
        uploadCommand += ', finalize';
      }
      response = await this.uploadChunk(
        chunk,
        uploadUrl,
        uploadCommand,
        apiClient,
        offset,
        chunkSize,
      );
      offset += chunkSize;
      // The `x-goog-upload-status` header field can be `active`, `final` and
      //`cancelled` in resposne.
      if (response?.headers?.['x-goog-upload-status'] !== 'active') {
        break;
      }
      if (fileSize <= offset) {
        throw new Error(
          'All content has been uploaded, but the upload status is not finalized.'
        );
      }
    }
    return response;
  }
}
