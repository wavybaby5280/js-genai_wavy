/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI} from '../../../src/node/node_client.js';
import {
  CallableTool,
  FunctionCall,
  FunctionCallingConfigMode,
  GenerateContentResponse,
  Part,
  Type,
} from '../../../src/types.js';
import {setupTestServer, shutdownTestServer} from '../test_server.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;

const customDivideCallableTool: CallableTool = {
  tool: async () =>
    Promise.resolve({
      functionDeclarations: [
        {
          description: 'Custom divide function',
          name: 'customDivide',
          parameters: {
            type: Type.OBJECT,
            properties: {
              numerator: {
                type: Type.NUMBER,
              },
              denominator: {
                type: Type.NUMBER,
              },
            },
          },
        },
      ],
    }),

  callTool: async (functionCalls: FunctionCall[]) => {
    if (functionCalls[0].name === 'customDivide') {
      const numerator = Number.parseFloat(functionCalls[0].args![0] as string);
      const denominator = Number.parseFloat(
        functionCalls[0].args![1] as string,
      );
      const response: Part = {
        functionResponse: {
          name: 'customDivide',
          response: {
            result: numerator / denominator,
          },
        },
      };
      return [response];
    } else {
      throw new Error('Unknown function call');
    }
  },
};

describe('AFC Streaming Tests', () => {
  beforeAll(async () => {
    await setupTestServer();
  });

  afterAll(async () => {
    await shutdownTestServer();
  });

  describe('generateContentStream afc enabled', () => {
    const testCases = [
      {
        name: 'Google AI AFC enabled',
        clientParams: {vertexai: false, apiKey: GEMINI_API_KEY},
        model: 'gemini-2.0-flash',
        config: {
          tools: [customDivideCallableTool],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
          automaticFunctionCalling: {
            maximumRemoteCalls: 1,
          },
        },
        messages: ['Divide 10 by 2 using the customDivide function'],
      },
      {
        name: 'Vertex AI AFC enabled',
        clientParams: {vertexai: true, project: GOOGLE_CLOUD_PROJECT},
        model: 'gemini-2.0-flash',
        config: {
          tools: [customDivideCallableTool],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
          automaticFunctionCalling: {
            maximumRemoteCalls: 1,
          },
        },
        messages: ['Divide 10 by 2 using the customDivide function'],
      },
    ];

    for (const testCase of testCases) {
      it(testCase.name, async () => {
        const client = new GoogleGenAI(testCase.clientParams);
        const response = await client.models.generateContentStream({
          model: testCase.model,
          contents: testCase.messages,
          config: testCase.config,
        });
        const chunks: GenerateContentResponse[] = [];
        for await (const chunk of response) {
          chunks.push(chunk);
        }
        expect(chunks.length).toBeGreaterThan(2);
        expect(
          chunks[0].candidates![0].content!.parts![0].functionCall!.name,
        ).toBe('customDivide');
        expect(
          chunks[1].candidates![0].content!.parts![0].functionResponse!.name,
        ).toBe('customDivide');
        expect(chunks[2].text).not.toBeNull();
      });
    }
  });

  describe('generateContentStream afc disabled', () => {
    const testCases = [
      {
        name: 'Google AI AFC disabled',
        clientParams: {vertexai: false, apiKey: GEMINI_API_KEY},
        model: 'gemini-2.0-flash',
        config: {
          tools: [customDivideCallableTool],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
          automaticFunctionCalling: {
            disable: true,
          },
        },
        messages: ['Divide 10 by 2 using the customDivide function'],
      },
      {
        name: 'Vertex AI AFC disabled',
        clientParams: {vertexai: true, project: GOOGLE_CLOUD_PROJECT},
        model: 'gemini-2.0-flash',
        config: {
          tools: [customDivideCallableTool],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
          automaticFunctionCalling: {
            disable: true,
          },
        },
        messages: ['Divide 10 by 2 using the customDivide function'],
      },
    ];

    for (const testCase of testCases) {
      it(testCase.name, async () => {
        const client = new GoogleGenAI(testCase.clientParams);
        const response = await client.models.generateContentStream({
          model: testCase.model,
          contents: testCase.messages,
          config: testCase.config,
        });
        const chunks: GenerateContentResponse[] = [];
        for await (const chunk of response) {
          chunks.push(chunk);
        }
        expect(chunks.length).toEqual(1);
        expect(
          chunks[0].candidates![0].content!.parts![0].functionCall!.name,
        ).toBe('customDivide');
      });
    }
  });
});
