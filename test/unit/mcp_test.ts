/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ListToolsResultSchema,
  Tool as McpTool,
} from '@modelcontextprotocol/sdk/types.js';

import {
  mcpToGeminiTools,
  mcpToolsToGeminiTool,
} from '../../src/_transformers.js';
import {
  hasMcpToolUsage,
  mcpToTool,
  setMcpUsageHeader,
} from '../../src/mcp/_mcp.js';
import * as types from '../../src/types.js';

import {spinUpPrintingServer} from './test_mcp_server.js';

describe('mcpToGeminiTools', () => {
  it('return empty array from empty tools list', () => {
    expect(mcpToGeminiTools({tools: []})).toEqual([]);
  });

  it('should filter unknown JsonSchema fields', () => {
    const mcpTools = {
      tools: [
        {
          name: 'tool',
          description: 'tool-description',
          inputSchema: {
            type: 'object',
            properties: {},
            unknownField: 'unknownField',
            unknownObject: {},
          },
        },
      ],
    };

    const parsedMcpTools = ListToolsResultSchema.parse(mcpTools);
    expect(mcpToGeminiTools(parsedMcpTools)).toEqual([
      {
        functionDeclarations: [
          {
            name: 'tool',
            description: 'tool-description',
            parameters: {
              type: types.Type.OBJECT,
              properties: {},
            },
          },
        ],
      },
    ]);
  });

  it('should process items', () => {
    const mcpTools = {
      tools: [
        {
          name: 'tool',
          description: 'tool-description',
          inputSchema: {
            type: 'object',
            properties: {
              property: {
                type: 'object',
                items: {
                  type: 'string',
                  description: 'item-description',
                  unknownField: 'unknownField',
                  unknownObject: {},
                },
              },
            },
          },
        },
      ],
    };

    const parsedMcpTools = ListToolsResultSchema.parse(mcpTools);
    expect(mcpToGeminiTools(parsedMcpTools)).toEqual([
      {
        functionDeclarations: [
          {
            name: 'tool',
            description: 'tool-description',
            parameters: {
              type: types.Type.OBJECT,
              properties: {
                property: {
                  type: types.Type.OBJECT,
                  items: {
                    type: types.Type.STRING,
                    description: 'item-description',
                  },
                },
              },
            },
          },
        ],
      },
    ]);
  });

  it('should process anyOf', () => {
    const mcpTools = {
      tools: [
        {
          name: 'tool',
          description: 'tool-description',
          inputSchema: {
            type: 'object',
            properties: {
              property: {
                anyOf: [
                  {
                    type: 'string',
                    description: 'anyOf-description-1',
                    unknownField: 'unknownField',
                    unknownObject: {},
                  },
                  {
                    type: 'number',
                    description: 'anyOf-description-2',
                    unknownField: 'unknownField',
                    unknownObject: {},
                  },
                ],
              },
            },
          },
        },
      ],
    };

    const parsedMcpTools = ListToolsResultSchema.parse(mcpTools);
    expect(mcpToGeminiTools(parsedMcpTools)).toEqual([
      {
        functionDeclarations: [
          {
            name: 'tool',
            description: 'tool-description',
            parameters: {
              type: types.Type.OBJECT,
              properties: {
                property: {
                  anyOf: [
                    {
                      type: types.Type.STRING,
                      description: 'anyOf-description-1',
                    },
                    {
                      type: types.Type.NUMBER,
                      description: 'anyOf-description-2',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    ]);
  });

  it('should process properties', () => {
    const mcpTools = {
      tools: [
        {
          name: 'tool',
          description: 'tool-description',
          inputSchema: {
            type: 'object',
            properties: {
              property: {
                type: 'object',
                properties: {
                  parameter1: {
                    type: 'string',
                    description: 'parameter1-description',
                    unknownField: 'unknownField',
                    unknownObject: {},
                  },
                  parameter2: {
                    type: 'string',
                    description: 'parameter2-description',
                    unknownField: 'unknownField',
                    unknownObject: {},
                  },
                },
              },
            },
          },
        },
      ],
    };

    const parsedMcpTools = ListToolsResultSchema.parse(mcpTools);
    expect(mcpToGeminiTools(parsedMcpTools)).toEqual([
      {
        functionDeclarations: [
          {
            name: 'tool',
            description: 'tool-description',
            parameters: {
              type: types.Type.OBJECT,
              properties: {
                property: {
                  type: types.Type.OBJECT,
                  properties: {
                    parameter1: {
                      type: types.Type.STRING,
                      description: 'parameter1-description',
                    },
                    parameter2: {
                      type: types.Type.STRING,
                      description: 'parameter2-description',
                    },
                  },
                },
              },
            },
          },
        ],
      },
    ]);
  });
});

describe('mcpToolsToGeminiTool', () => {
  const mcpTool1: McpTool = {
    name: 'tool-1',
    description: 'tool-1-description',
    inputSchema: {
      type: 'object',
      properties: {
        property: {
          type: 'object',
          items: {
            type: 'string',
            description: 'item-description',
          },
        },
      },
    },
  };
  const mcpTool2: McpTool = {
    name: 'tool-2',
    description: 'tool-2-description',
    inputSchema: {
      type: 'object',
      properties: {
        property: {
          type: 'object',
          items: {
            type: 'string',
            description: 'item-description',
          },
        },
      },
    },
  };

  it('return empty array from empty tools list', () => {
    expect(mcpToolsToGeminiTool([])).toEqual({functionDeclarations: []});
  });

  it('should process multiple MCP tools to single Gemini tool', () => {
    const mcpTools: McpTool[] = [mcpTool1, mcpTool2];

    expect(mcpToolsToGeminiTool(mcpTools)).toEqual({
      functionDeclarations: [
        {
          name: 'tool-1',
          description: 'tool-1-description',
          parameters: {
            type: types.Type.OBJECT,
            properties: {
              property: {
                type: types.Type.OBJECT,
                items: {
                  type: types.Type.STRING,
                  description: 'item-description',
                },
              },
            },
          },
        },
        {
          name: 'tool-2',
          description: 'tool-2-description',
          parameters: {
            type: types.Type.OBJECT,
            properties: {
              property: {
                type: types.Type.OBJECT,
                items: {
                  type: types.Type.STRING,
                  description: 'item-description',
                },
              },
            },
          },
        },
      ],
    });
  });
});

describe('hasMcpToolUsage', () => {
  it('should return true for McpCallableTool', async () => {
    const mcpCallableTool = mcpToTool([await spinUpPrintingServer()]);

    expect(hasMcpToolUsage([mcpCallableTool])).toBeTrue();
  });

  it('should return false for Gemini tools', () => {
    const tools = [
      {
        functionDeclarations: [
          {
            name: 'tool',
            description: 'tool-description',
            parameters: {
              type: types.Type.OBJECT,
              properties: {
                property: {
                  type: types.Type.OBJECT,
                  items: {
                    type: types.Type.STRING,
                    description: 'item-description',
                  },
                },
              },
            },
          },
        ],
      },
    ];
    expect(hasMcpToolUsage(tools)).toBeFalse();
  });
});

describe('setMcpUsageHeader', () => {
  it('should set the MCP version label in the Google API client header', () => {
    const headers: Record<string, string> = {};
    setMcpUsageHeader(headers);
    expect(headers['x-goog-api-client']).toEqual('mcp_used/unknown');
  });
});

describe('mcpToTool', () => {
  it('throw error when MCP clients have duplicate function names', async () => {
    const mcpClient = await spinUpPrintingServer();

    try {
      mcpToTool([mcpClient, mcpClient]);
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Duplicate function name print found in MCP tools. Please ensure function names are unique.',
      );
    }
  });
});
