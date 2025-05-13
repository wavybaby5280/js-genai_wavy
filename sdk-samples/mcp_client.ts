/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  FunctionCallingConfigMode,
  FunctionDeclaration,
  GoogleGenAI,
  Tool,
  Type,
} from '@google/genai';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {InMemoryTransport} from '@modelcontextprotocol/sdk/inMemory.js';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  ListToolsResult,
  Tool as McpTool,
} from '@modelcontextprotocol/sdk/types.js';
import {z} from 'zod';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;
const GOOGLE_GENAI_USE_VERTEXAI = process.env.GOOGLE_GENAI_USE_VERTEXAI;

async function mcpSample(ai: GoogleGenAI) {
  const printingClient = await spinUpPrintingServer();
  const beepingClient = await spinUpBeepingServer();

  const mcpTools = [
    ...(await printingClient.listTools()).tools,
    // TODO(b/417514940): this currently fails
    // ...(await beepingClient.listTools()).tools,
  ];

  const tools = mcpTools.map((t) => mcpToGeminiTool(t));

  const allowedFunctionNames = mcpTools.map((t) => t.name);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents:
      'Use the printer to print a simple math question in red and the answer in blue, and beep with the beeper',
    config: {
      tools: tools,
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY,
          allowedFunctionNames: allowedFunctionNames,
        },
      },
    },
  });

  for (const part of response.candidates![0].content!.parts!) {
    if (part.functionCall) {
      const name = part.functionCall.name!;
      const args = part.functionCall.args;

      if (name === 'print') {
        printingClient.callTool({
          name: name,
          arguments: args,
        });
      }
      if (name === 'beep') {
        beepingClient.callTool({name: name});
      }
    }
  }
}

async function spinUpPrintingServer(): Promise<Client> {
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

  const client = new Client({
    name: 'printer',
    version: '1.0.0',
  });
  client.connect(transports[1]);

  return client;
}

async function spinUpBeepingServer(): Promise<Client> {
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

  const client = new Client({
    name: 'beeper',
    version: '1.0.0',
  });
  client.connect(transports[1]);

  return client;
}

async function main() {
  let ai;
  if (GOOGLE_GENAI_USE_VERTEXAI) {
    ai = new GoogleGenAI({
      vertexai: true,
      project: GOOGLE_CLOUD_PROJECT,
      location: GOOGLE_CLOUD_LOCATION,
    });
  } else {
    ai = new GoogleGenAI({vertexai: false, apiKey: GEMINI_API_KEY});
  }

  mcpSample(ai);
}

main();

export function mcpToGeminiTool(mcpTool: McpTool): Tool {
  const mcpToolSchema = mcpTool as Record<string, unknown>;
  const functionDeclaration = {
    name: mcpToolSchema['name'],
    description: mcpToolSchema['description'],
    parameters: filterToJsonSchema(
      mcpToolSchema['inputSchema'] as Record<string, unknown>,
    ),
  };

  const geminiTool = {
    functionDeclarations: [
      functionDeclaration as unknown as FunctionDeclaration,
    ],
  };

  return geminiTool;
}

export function mcpToGeminiTools(listToolsResult: ListToolsResult): Tool[] {
  return listToolsResult.tools.map(mcpToGeminiTool);
}

// Filters the list schema field to only include fields that are supported by
// JSONSchema.
function filterListSchemaField(fieldValue: unknown): Record<string, unknown>[] {
  const listSchemaFieldValue: Record<string, unknown>[] = [];
  for (const listFieldValue of fieldValue as Record<string, unknown>[]) {
    listSchemaFieldValue.push(filterToJsonSchema(listFieldValue));
  }
  return listSchemaFieldValue;
}

// Filters the dict schema field to only include fields that are supported by
// JSONSchema.
function filterDictSchemaField(fieldValue: unknown): Record<string, unknown> {
  const dictSchemaFieldValue: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(
    fieldValue as Record<string, unknown>,
  )) {
    const valueRecord = value as Record<string, unknown>;
    dictSchemaFieldValue[key] = filterToJsonSchema(valueRecord);
  }
  return dictSchemaFieldValue;
}

// Filters the schema to only include fields that are supported by JSONSchema.
function filterToJsonSchema(
  schema: Record<string, unknown>,
): Record<string, unknown> {
  const schemaFieldNames: Set<string> = new Set(['items']); // 'additional_properties' to come
  const listSchemaFieldNames: Set<string> = new Set(['anyOf']); // 'one_of', 'all_of', 'not' to come
  const dictSchemaFieldNames: Set<string> = new Set(['properties']); // 'defs' to come
  const filteredSchema: Record<string, unknown> = {};

  for (const [fieldName, fieldValue] of Object.entries(schema)) {
    if (schemaFieldNames.has(fieldName)) {
      filteredSchema[fieldName] = filterToJsonSchema(
        fieldValue as Record<string, unknown>,
      );
    } else if (listSchemaFieldNames.has(fieldName)) {
      filteredSchema[fieldName] = filterListSchemaField(fieldValue);
    } else if (dictSchemaFieldNames.has(fieldName)) {
      filteredSchema[fieldName] = filterDictSchemaField(fieldValue);
    } else if (fieldName === 'type') {
      const typeValue = (fieldValue as string).toUpperCase();
      filteredSchema[fieldName] = Object.keys(Type).includes(typeValue)
        ? (typeValue as Type)
        : Type.TYPE_UNSPECIFIED;
    } else if (supportedJsonSchemaFields.has(fieldName)) {
      filteredSchema[fieldName] = fieldValue;
    }
  }

  return filteredSchema;
}

export const supportedJsonSchemaFields = new Set<string>([
  'type',
  'format',
  'title',
  'description',
  'default',
  'items',
  'minItems',
  'maxItems',
  'enum',
  'properties',
  'required',
  'minProperties',
  'maxProperties',
  'minimum',
  'maximum',
  'minLength',
  'maxLength',
  'pattern',
  'anyOf',
]);
