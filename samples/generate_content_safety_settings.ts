/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {HarmBlockMethod, HarmBlockThreshold, HarmCategory} from '@google/genai';
import {Client} from '@google/genai/node';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;
const GOOGLE_GENAI_USE_VERTEXAI = process.env.GOOGLE_GENAI_USE_VERTEXAI;

async function generateContentFromMLDev() {
  const client = new Client({vertexai: false, apiKey: GOOGLE_API_KEY});
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: 'say something bad',
    config: {
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    },
  });
  console.debug(response.text());
}

async function generateContentFromVertexAI() {
  const client = new Client({
    vertexai: true,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: 'say something bad',
    config: {
      safetySettings: [
        {
          method: HarmBlockMethod.SEVERITY,
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          method: HarmBlockMethod.SEVERITY,
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    },
  });
  console.debug(response.text());
}

async function main() {
  if (GOOGLE_GENAI_USE_VERTEXAI) {
    await generateContentFromVertexAI().catch((e) =>
      console.error('got error', e),
    );
  } else {
    await generateContentFromMLDev().catch((e) =>
      console.error('got error', e),
    );
  }
}

main();
