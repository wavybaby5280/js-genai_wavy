/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Client as McpClient} from '@modelcontextprotocol/sdk/client/index.js';
import {Tool as McpTool} from '@modelcontextprotocol/sdk/types.js';

import {GOOGLE_API_CLIENT_HEADER} from '../_api_client.js';
import {mcpToolsToGeminiTool} from '../_transformers.js';
import {
  CallableTool,
  CallableToolConfig,
  FunctionCall,
  GenerateContentParameters,
  Part,
  Tool,
  ToolListUnion,
} from '../types.js';

// TODO: b/416041229 - Determine how to retrieve the MCP package version.
export const MCP_LABEL = 'mcp_used/unknown';

// Checks whether the list of tools contains any MCP tools.
export function hasMcpToolUsage(tools: ToolListUnion): boolean {
  for (const tool of tools) {
    if (isMcpCallableTool(tool)) {
      return true;
    }
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

// Checks whether the list of tools contains any MCP clients. Will return true
// if there is at least one MCP client.
export function hasMcpClientTools(params: GenerateContentParameters): boolean {
  return params.config?.tools?.some((tool) => isMcpCallableTool(tool)) ?? false;
}

// Checks whether the list of tools contains any non-MCP tools. Will return true
// if there is at least one non-MCP tool.
export function hasNonMcpTools(params: GenerateContentParameters): boolean {
  return (
    params.config?.tools?.some((tool) => !isMcpCallableTool(tool)) ?? false
  );
}

// Returns true if the object is a MCP CallableTool, otherwise false.
function isMcpCallableTool(object: unknown): boolean {
  // TODO: b/418266406 - Add a more robust check for the MCP CallableTool.
  return (
    object !== null &&
    typeof object === 'object' &&
    'tool' in object &&
    'callTool' in object
  );
}

/**
 * McpCallableTool can be used for model inference and invoking MCP clients with
 * given function call arguments.
 *
 * @experimental Built-in MCP support is a preview feature, may change in future
 * versions.
 */
export class McpCallableTool implements CallableTool {
  private readonly mcpClients;
  private mcpTools: McpTool[] = [];
  private functionNameToMcpClient: Record<string, McpClient> = {};
  private readonly config: CallableToolConfig;

  private constructor(
    mcpClients: McpClient[] = [],
    config: CallableToolConfig,
  ) {
    this.mcpClients = mcpClients;
    this.config = config;
  }

  /**
   * Creates a McpCallableTool.
   */
  public static create(
    mcpClients: McpClient[],
    config: CallableToolConfig,
  ): McpCallableTool {
    return new McpCallableTool(mcpClients, config);
  }

  /**
   * Validates the function names are not duplicate and initialize the function
   * name to MCP client mapping.
   *
   * @throws {Error} if the MCP tools from the MCP clients have duplicate tool
   *     names.
   */
  async initialize() {
    if (this.mcpTools.length > 0) {
      return;
    }

    const functionMap: Record<string, McpClient> = {};
    const mcpTools: McpTool[] = [];
    for (const mcpClient of this.mcpClients) {
      const mcpToolList = await mcpClient.listTools();
      mcpTools.push(...mcpToolList.tools);
      for (const mcpTool of mcpToolList.tools) {
        const mcpToolName = mcpTool.name as string;
        if (functionMap[mcpToolName]) {
          throw new Error(
            `Duplicate function name ${
              mcpToolName
            } found in MCP tools. Please ensure function names are unique.`,
          );
        }
        functionMap[mcpToolName] = mcpClient;
      }
    }
    this.mcpTools = mcpTools;
    this.functionNameToMcpClient = functionMap;
  }

  public async tool(): Promise<Tool> {
    await this.initialize();
    return mcpToolsToGeminiTool(this.mcpTools, this.config);
  }

  public async callTool(functionCalls: FunctionCall[]): Promise<Part[]> {
    await this.initialize();
    const functionCallResponseParts: Part[] = [];
    for (const functionCall of functionCalls) {
      if (functionCall.name! in this.functionNameToMcpClient) {
        const mcpClient = this.functionNameToMcpClient[functionCall.name!];
        const callToolResponse = await mcpClient.callTool({
          name: functionCall.name!,
          arguments: functionCall.args,
        });
        functionCallResponseParts.push({
          functionResponse: {
            name: functionCall.name,
            response: callToolResponse.isError
              ? {error: callToolResponse}
              : (callToolResponse as Record<string, unknown>),
          },
        });
      }
    }
    return functionCallResponseParts;
  }
}

/**
 * Creates a McpCallableTool from an array of MCP client
 *
 * The callable tool can invoke the MCP clients with given function call
 * arguments. (often for automatic function calling).
 *
 * @experimental Built-in MCP support is a preview feature, may change in future
 * versions.
 */
export function mcpToTool(
  clients: McpClient[],
  config: CallableToolConfig = {},
): CallableTool {
  return McpCallableTool.create(clients, config);
}
