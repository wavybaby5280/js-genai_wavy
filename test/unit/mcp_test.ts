/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ListToolsResultSchema} from '@modelcontextprotocol/sdk/types.js';

import {mcpToGeminiTools} from '../../src/_transformers';
import * as types from '../../src/types';

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
