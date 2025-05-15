/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Client as McpClient} from '@modelcontextprotocol/sdk/client/index.js';
import {Tool as McpTool} from '@modelcontextprotocol/sdk/types.js';

import {ApiClient, GOOGLE_API_CLIENT_HEADER} from '../_api_client.js';
import {tTools} from '../_transformers.js';
import {
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
    if (tool instanceof McpClient) {
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
  return (
    params.config?.tools?.some((tool) => tool instanceof McpClient) ?? false
  );
}

// Checks whether the list of tools contains any non-MCP tools. Will return true
// if there is at least one non-MCP tool.
export function hasNonMcpTools(params: GenerateContentParameters): boolean {
  return (
    params.config?.tools?.some((tool) => !(tool instanceof McpClient)) ?? false
  );
}

export class McpToGenAIToolAdapter {
  private readonly functionNameToMcpClient: Record<string, McpClient>;
  private readonly tools: Tool[];

  private constructor(
    functionNameToMcpClient: Record<string, McpClient>,
    tools: Tool[],
  ) {
    this.functionNameToMcpClient = functionNameToMcpClient;
    this.tools = tools;
  }

  /**
   * Asynchronously creates and initializes an McpToGenAIToolAdapter instance.
   * @param mcpClientsList - A list of McpClient instances.
   * @return A Promise that resolves to a fully initialized
   *     McpToGenAIToolAdapter instance.
   */
  public static async create(
    apiClient: ApiClient,
    mcpClientsList: ToolListUnion,
  ): Promise<McpToGenAIToolAdapter> {
    const functionMap: Record<string, McpClient> = {};
    const allTools: Tool[] = [];

    for (const mcpClient of mcpClientsList) {
      const toolListFromMcpClient = await (mcpClient as McpClient).listTools();

      const toolsFromCurrentClient = tTools(
        apiClient,
        toolListFromMcpClient.tools as McpTool[],
      );
      allTools.push(...toolsFromCurrentClient);

      for (const tool of toolListFromMcpClient.tools) {
        const toolName = tool.name as string;
        if (functionMap[toolName]) {
          throw new Error(
            `Duplicate function name ${
              toolName
            } found in MCP tools. Please ensure function names are unique.`,
          );
        }
        functionMap[toolName] = mcpClient as McpClient;
      }
    }

    return new McpToGenAIToolAdapter(functionMap, allTools);
  }

  listTools(): Tool[] {
    return this.tools;
  }

  async callTool(functionCalls: FunctionCall[]): Promise<Part[]> {
    const functionCallResponseParts: Part[] = [];
    for (const functionCall of functionCalls) {
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
    return functionCallResponseParts;
  }
}
