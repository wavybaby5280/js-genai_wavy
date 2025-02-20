/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {Client} from '@google/genai/node';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;
const GOOGLE_GENAI_USE_VERTEXAI = process.env.GOOGLE_GENAI_USE_VERTEXAI;

async function generateContentFromMLDev() {
  const client = new Client({vertexai: false, apiKey: GOOGLE_API_KEY});
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: 'can you generate an image of a cat?',
    config: {responseModalities: ['IMAGE']},
  });
  console.debug(JSON.stringify(response));
}

async function generateContentFromVertexAI() {
  const client = new Client({
    vertexai: true,
    project: GOOGLE_CLOUD_PROJECT,
    location: GOOGLE_CLOUD_LOCATION,
  });
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: 'can you generate an image of a cat?',
    config: {responseModalities: ['IMAGE']},
  });
  console.debug(JSON.stringify(response));
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
