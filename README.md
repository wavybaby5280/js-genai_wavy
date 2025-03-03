# Google Gen AI SDK for JavaScript

The Google Gen AI JavaScript SDK is an **experimental SDK** designed for
JavaScript developers to build applications powered by Gemini. The SDK
supports both the [Gemini Developer API](https://ai.google.dev/gemini-api/docs)
and [Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/overview).

The Google Gen AI SDK is designed to work with Gemini 2.0 features.

> [!CAUTION] **Experimental SDK:** This SDK is under active development and may
  experience breaking changes.

> [!CAUTION] **API Key Security:** Avoid exposing API keys in client-side code.
  Use server-side implementations in production environments.


## Prerequisites

* Node.js version 18 or later
* `pnpm` or `npm`

## Installation

To install the SDK, run the following command:

```shell
npm install @google/genai
```

## Quickstart

The simplest way to get started is to using an API key from
[Google AI Studio](https://aistudio.google.com/apikey):

```typescript
import {Client} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new Client({apiKey: GEMINI_API_KEY});

async function main() {
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: 'Why is the sky blue?',
  });
  console.log(response.text());
}

main();
```

## Client Initialization

The Google Gen AI SDK provides support for both the
[Google AI Studio](https://ai.google.dev/gemini-api/docs) and
[Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/overview)
 implementations of the Gemini API.

### Gemini Developer API

For server-side applications, initialize the client using an API key, which can
be acquired from [Google AI Studio](https://aistudio.google.com/apikey):

```typescript
import { Client } from '@google/genai';
const client = new Client({apiKey: 'GEMINI_API_KEY'});
```

#### Browser

> [!CAUTION] **API Key Security:** Avoid exposing API keys in client-side code.
   Use server-side implementations in production environments.

In the browser the initialization code is identical:


```typescript
import { Client } from '@google/genai';
const client = new Client({apiKey: 'GEMINI_API_KEY'});
```

### Vertex AI

To initialize the client for Vertex AI, use the following code:

```typescript
import { Client } from '@google/genai';

const client = new Client({
    vertexai: true,
    project: 'your_project',
    location: 'your_location',
});
```

## Client overview

All API features are accessed through an instance of the `Client` classes.
The submodules bundle together related API methods:

- `client.models`: Use `models` to query models (`generateContent`,
  `generateImages`, ...), or examine their metadata.
- `client.caches`: Create and manage `caches` to reduce costs when repeatedly
  using the same large prompt prefix.
- `client.chats`: Create local stateful `chat` objects to simplify multiturn
  interactions.
- `client.files`: Upload `files` to the API and reference them in your prompts.
  This reduces bandwidth if you use a file many times, and handles files too
  large to fit inline with your prompt.
- `client.live`: Start a `live` session for realtime interaction, allows text +
  audio + video input, and text or audio output.
- `client.tunings` - Use `tunings` to create and manage tuned models.

## Samples

### Streaming

For quicker more responsive API, use the `generateContentStream` method which
yields chunks of text as they're generated:

```typescript
import {Client} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new Client({apiKey: GEMINI_API_KEY});

async function main() {
  const response = await client.models.generateContentStream({
    model: 'gemini-2.0-flash-001',
    contents: 'Write a 100-word poem.',
  });
  for await (const chunk of response) {
    console.log(chunk.text());
  }
}

main();
```

### Function Calling

To let Gemini to interact with external systems, you can provide provide
`functionDeclaration` objects as `tools`. To use these tools it's a 4 step

1. **Declare the function name, description, and parameters**
2. **Call `generateContent` with function calling enabled**
3. **Use the returned `FunctionCall` parameters to call your actual function**
3. **Send the result back to the model (with history, easier in `client.chat`)
   as a `FunctionResponse`**

```typescript
import {Client, FunctionCallingConfigMode, FunctionDeclaration, Type} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function main() {
  const controlLightDeclaration: FunctionDeclaration = {
    name: 'controlLight',
    parameters: {
      type: Type.OBJECT,
      description: 'Set the brightness and color temperature of a room light.',
      properties: {
        brightness: {
          type: Type.NUMBER,
          description:
              'Light level from 0 to 100. Zero is off and 100 is full brightness.',
        },
        colorTemperature: {
          type: Type.STRING,
          description:
              'Color temperature of the light fixture which can be `daylight`, `cool`, or `warm`.',
        },
      },
      required: ['brightness', 'colorTemperature'],
    },
  };

  const client = new Client({apiKey: GEMINI_API_KEY});
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: 'Dim the lights so the room feels cozy and warm.',
    config: {
      toolConfig: {
        functionCallingConfig: {
          // Force it to call any function
          mode: FunctionCallingConfigMode.ANY,
          allowedFunctionNames: ['controlLight'],
        }
      },
      tools: [{functionDeclarations: [controlLightDeclaration]}]
    }
  });

  console.log(response.functionCalls());
}

main();
```
