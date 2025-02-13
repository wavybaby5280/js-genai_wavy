/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {WebSocket as Ws, WebSocketCallbacks, WebSocketFactory} from './_websocket';

export class BrowserWebSocketFactory implements WebSocketFactory {
  create(
      url: string, headers: Record<string, string>,
      callbacks: WebSocketCallbacks): Ws {
    return new BrowserWebSocket(url, headers, callbacks);
  }
}

export class BrowserWebSocket implements Ws {
  private ws?: WebSocket;

  constructor(
      private readonly url: string,
      private readonly headers: Record<string, string>,
      private readonly callbacks: WebSocketCallbacks) {}

  connect(): void {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = this.callbacks.onopen;
    this.ws.onerror = this.callbacks.onerror;
    this.ws.onclose = this.callbacks.onclose;
    this.ws.onmessage = this.callbacks.onmessage;
  }

  send(message: string) {
    if (this.ws === undefined) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(message);
  }

  close() {
    if (this.ws === undefined) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.close();
  }

  setOnMessageCallback(callback: any) {
    if (this.ws === undefined) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.onmessage = callback;
  }
}