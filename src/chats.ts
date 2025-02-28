/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ApiClient} from './_api_client';
import * as t from './_transformers';
import {Models} from './models';
import * as types from './types';

/**
 * Returns true if the response is valid, false otherwise.
 */
function isValidResponse(response: types.GenerateContentResponse): boolean {
  if (response.candidates == undefined || response.candidates.length === 0) {
    return false;
  }
  const content = response.candidates[0]?.content;
  if (content === undefined) {
    return false;
  }
  if (content.parts === undefined || content.parts.length === 0) {
    return false;
  }
  for (const part of content.parts) {
    if (part === undefined || Object.keys(part).length === 0) {
      return false;
    }
    if (part.text !== undefined && part.text === '') {
      return false;
    }
  }
  return true;
}

/**
 * Processes the stream response and appends the valid contents to the history.
 */
async function* processStreamResponse(
  streamResponse: AsyncGenerator<types.GenerateContentResponse>,
  curatedHistory: types.Content[],
  inputContent: types.Content,
) {
  const outputContent: types.Content[] = [];
  let finishReason: types.FinishReason | undefined = undefined;
  for await (const chunk of streamResponse) {
    if (isValidResponse(chunk)) {
      const content = chunk?.candidates?.[0]?.content;
      if (content !== undefined) {
        outputContent.push(content);
      }
      if (chunk?.candidates?.[0]?.finishReason !== undefined) {
        finishReason = chunk.candidates[0].finishReason;
      }
    }
    if (outputContent.length && finishReason !== undefined) {
      curatedHistory.push(inputContent);
      curatedHistory.push(...outputContent);
    }
    yield chunk;
  }
}

/**
 * A utility class to create a chat session.
 */
export class Chats {
  private readonly modelsModule: Models;
  private readonly apiClient: ApiClient;

  constructor(modelsModule: Models, apiClient: ApiClient) {
    this.modelsModule = modelsModule;
    this.apiClient = apiClient;
  }

  /**
   * Creates a new chat session.
   *
   * @param params - Parameters for creating a chat session.
   * @returns A new chat session.
   */
  create(params: types.CreateChatParameters) {
    return new Chat(
      this.apiClient,
      this.modelsModule,
      params.model,
      params.config,
      params.history,
    );
  }
}

/**
 * Chat session that enables sending messages and stores the chat history so
 * far.
 */
export class Chat {
  // A promise to represent the current state of the message being sent to the
  // model.
  private sendPromise: Promise<void> = Promise.resolve();

  constructor(
    private readonly apiClient: ApiClient,
    private readonly modelsModule: Models,
    private readonly model: string,
    private readonly config: types.GenerateContentConfig = {},
    private readonly curatedHistory: types.Content[] = [],
  ) {}

  /**
   * Sends a message to the model and returns the response.
   *
   * This method will wait for the previous message to be processed before
   * sending the next message.
   *
   * @see {@link Chat#sendMessageStream} for streaming method.
   * @param params - parameters for sending messages within a chat session.
   * @returns The model's response.
   */
  async sendMessage(
    params: types.SendMessageParameters,
  ): Promise<types.GenerateContentResponse> {
    await this.sendPromise;
    const inputContent = t.tContent(this.apiClient, params.message);
    const responsePromise = this.modelsModule.generateContent({
      model: this.model,
      contents: this.curatedHistory.concat(inputContent),
      config: params.config ?? this.config,
    });
    this.sendPromise = (async () => {
      const response = await responsePromise;
      if (isValidResponse(response)) {
        this.curatedHistory.push(inputContent);
        const outputContent = response?.candidates?.[0]?.content;
        if (outputContent !== undefined) {
          this.curatedHistory.push(outputContent);
        }
      }
      return;
    })();
    await this.sendPromise;
    return responsePromise;
  }

  /**
   * Sends a message to the model and returns the response in chunks.
   *
   * This method will wait for the previous message to be processed before
   * sending the next message.
   *
   * @see {@link Chat#sendMessage} for non-streaming method.
   * @param params - parameters for sending the message.
   * @returns The model's response.
   */
  async sendMessageStream(
    params: types.SendMessageParameters,
  ): Promise<AsyncGenerator<types.GenerateContentResponse>> {
    await this.sendPromise;
    const inputContent = t.tContent(this.apiClient, params.message);
    const streamResponse = this.modelsModule.generateContentStream({
      model: this.model,
      contents: this.curatedHistory.concat(inputContent),
      config: params.config ?? this.config,
    });
    this.sendPromise = streamResponse.then(() => undefined);
    const response = await streamResponse;
    const result = processStreamResponse(
      response,
      this.curatedHistory,
      inputContent,
    );
    return result;
  }
}
