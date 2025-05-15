/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Client as McpClient} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {z} from 'zod';

import {GoogleGenAI} from '../../../src/node/node_client.js';
import {FunctionCallingConfigMode} from '../../../src/types.js';
import {setupTestServer, shutdownTestServer} from '../test_server.js';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;

describe('MCP related client Tests', () => {
  beforeAll(async () => {
    await setupTestServer();
  });

  afterAll(async () => {
    await shutdownTestServer();
  });

  describe('generateContent', () => {
    it('ML Dev should take a list of MCPClients and conduct automated function calling', async () => {
      const ai = new GoogleGenAI({vertexai: false, apiKey: GOOGLE_API_KEY});
      const mcpClientList = [
        await spinUpPrintingServer(),
        await spinUpBeepingServer(),
      ];
      const consoleLogSpy = spyOn(console, 'log').and.callThrough();
      const consoleBeepSpy = spyOn(process.stdout, 'write').and.callThrough();
      await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents:
          'Use the printer to print a simple word: hello in blue, and beep with the beeper',
        config: {
          tools: mcpClientList,
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
        },
      });
      expect(consoleLogSpy).toHaveBeenCalledWith('\x1b[34mhello');
      expect(consoleBeepSpy).toHaveBeenCalledWith('\u0007');
    });
    it('Vertex AI should take a list of MCPClients and conduct automated function calling', async () => {
      const ai = new GoogleGenAI({
        vertexai: true,
        project: GOOGLE_CLOUD_PROJECT,
        location: GOOGLE_CLOUD_LOCATION,
      });
      const mcpClientList = [await spinUpPrintingServer()];
      const consoleLogSpy = spyOn(console, 'log').and.callThrough();
      await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 'Use the printer to print a simple word: hello in red',
        config: {
          tools: mcpClientList,
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
              // allowedFunctionNames: ['print', 'beep'],
            },
          },
        },
      });
      expect(consoleLogSpy).toHaveBeenCalledWith('\x1b[31mhello');
    });
  });
});

async function spinUpPrintingServer(): Promise<McpClient> {
  const server = new McpServer({
    name: 'printer',
    version: '1.0.0',
  });

  const colorMap: {[key: string]: string} = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    reset: '\x1b[0m', // Resets all text attributes to default
  };

  server.tool(
    'print',
    {
      text: z.string(),
      color: z.string().regex(/red|blue|green|white/),
    },
    async ({text, color}) => {
      if (colorMap[color]) {
        console.log(colorMap[color] + text);
        console.log(colorMap.reset);
      } else {
        console.log(text);
      }

      return {
        content: [],
      };
    },
  );

  const transports = InMemoryTransport.createLinkedPair();
  await server.connect(transports[0]);

  const client = new McpClient({
    name: 'printer',
    version: '1.0.0',
  });
  client.connect(transports[1]);

  return client;
}

async function spinUpBeepingServer(): Promise<McpClient> {
  const server = new McpServer({
    name: 'beeper',
    version: '1.0.0',
  });

  server.tool('beep', async () => {
    process.stdout.write('\u0007');
    return {
      content: [],
    };
  });

  const transports = InMemoryTransport.createLinkedPair();
  await server.connect(transports[0]);

  const client = new McpClient({
    name: 'beeper',
    version: '1.0.0',
  });
  client.connect(transports[1]);

  return client;
}
