/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GOOGLE_API_CLIENT_HEADER} from '../_api_client.js';
import {ToolListUnion} from '../types.js';

// TODO: b/416041229 - Determine how to retrieve the MCP package version.
export const MCP_LABEL = 'mcp_used/unknown';

// Checks whether the list of tools contains any MCP tools.
export function hasMcpToolUsage(tools: ToolListUnion): boolean {
  for (const tool of tools) {
    if (typeof tool === 'object' && 'inputSchema' in tool) {
      return true;
    }
  }

  return false;
}

// Sets the MCP version label in the Google API client header.
export function setMcpUsageHeader(headers: Record<string, string>) {
  headers[GOOGLE_API_CLIENT_HEADER] = (
    (headers[GOOGLE_API_CLIENT_HEADER] ?? '') + ` ${MCP_LABEL}`
  ).trimStart();
}
