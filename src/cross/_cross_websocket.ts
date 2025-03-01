/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  WebSocketCallbacks,
  WebSocketFactory,
  WebSocket as Ws,
} from '../_websocket';
import {crossError} from './_cross_error';

export class CrossWebSocketFactory implements WebSocketFactory {
  create(
    url: string,
    headers: Record<string, string>,
    callbacks: WebSocketCallbacks,
  ): Ws {
    throw crossError();
  }
}
