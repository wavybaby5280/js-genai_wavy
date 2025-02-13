/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WebSocketCallbacks {
  onopen: () => void;
  onerror: (e: any) => void;
  onmessage: (e: any) => void;
  onclose: (e: any) => void;
}

export interface WebSocket {
  /**
   * Connects the socket to the server.
   */
  connect(): void;
  /**
   * Sends a message to the server.
   */
  send(message: string): void;
  /**
   * Closes the socket connection.
   */
  close(): void;
  /**
   * Sets the callback function for message events.
   */
  // TODO: b/395958466 - Update WebSocket implementations to be callback based
  // and remove this method.
  setOnMessageCallback(callback: any): void;
}

export interface WebSocketFactory {
  /**
   * Returns a new WebSocket instance.
   */
  create(
      url: string, headers: Record<string, string>,
      callbacks: WebSocketCallbacks): WebSocket;
}