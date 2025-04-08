/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ApiClient} from '../_api_client';
import * as common from '../_common';
import * as types from '../types';
import {
  contentFromMldev,
  contentFromVertex,
  contentToMldev,
  contentToVertex,
  toolToMldev,
  toolToVertex,
} from './_models_converters';

/**
 * Converters for live client.
 */

export function liveConnectParametersToMldev(
  apiClient: ApiClient,
  fromObject: types.LiveConnectParameters,
): types.LiveClientMessage {
  const toObject: Record<string, unknown> = {};

  const fromConfig = common.getValueByPath(fromObject, ['config']);
  if (fromConfig !== undefined && fromConfig !== null) {
    common.setValueByPath(
      toObject,
      ['setup'],
      liveConnectConfigToMldev(apiClient, fromConfig),
    );
  }

  const fromModel = common.getValueByPath(fromObject, ['model']);
  if (fromModel !== undefined) {
    common.setValueByPath(toObject, ['setup', 'model'], fromModel);
  }

  return toObject;
}

export function liveConnectParametersToVertex(
  apiClient: ApiClient,
  fromObject: types.LiveConnectParameters,
): types.LiveClientMessage {
  const toObject: Record<string, unknown> = {};

  const fromConfig = common.getValueByPath(fromObject, ['config']);
  if (fromConfig !== undefined && fromConfig !== null) {
    common.setValueByPath(
      toObject,
      ['setup'],
      liveConnectConfigToVertex(apiClient, fromConfig),
    );
  }

  const fromModel = common.getValueByPath(fromObject, ['model']);
  if (fromModel !== undefined) {
    common.setValueByPath(toObject, ['setup', 'model'], fromModel);
  }

  return toObject;
}

export function liveServerMessageFromMldev(
  apiClient: ApiClient,
  fromObject: types.LiveServerMessage,
): types.LiveServerMessage {
  const toObject: Record<string, unknown> = {};

  const fromSetupComplete = common.getValueByPath(fromObject, [
    'setupComplete',
  ]);
  if (fromSetupComplete !== undefined) {
    common.setValueByPath(toObject, ['setupComplete'], fromSetupComplete);
  }

  const fromServerContent = common.getValueByPath(fromObject, [
    'serverContent',
  ]);
  if (fromServerContent !== undefined && fromServerContent !== null) {
    common.setValueByPath(
      toObject,
      ['serverContent'],
      liveServerContentFromMldev(apiClient, fromServerContent),
    );
  }

  const fromToolCall = common.getValueByPath(fromObject, ['toolCall']);
  if (fromToolCall !== undefined && fromToolCall !== null) {
    common.setValueByPath(
      toObject,
      ['toolCall'],
      liveServerToolCallFromMldev(apiClient, fromToolCall),
    );
  }

  const fromToolCallCancellation = common.getValueByPath(fromObject, [
    'toolCallCancellation',
  ]);
  if (
    fromToolCallCancellation !== undefined &&
    fromToolCallCancellation !== null
  ) {
    common.setValueByPath(
      toObject,
      ['toolCallCancellation'],
      liveServerToolCallCancellationFromMldev(
        apiClient,
        fromToolCallCancellation,
      ),
    );
  }

  const fromGoAway = common.getValueByPath(fromObject, ['goAway']);
  if (fromGoAway !== undefined && fromGoAway !== null) {
    common.setValueByPath(
      toObject,
      ['goAway'],
      liveServerGoAwayFromMldev(fromGoAway),
    );
  }

  const fromSessionResumptionUpdate = common.getValueByPath(fromObject, [
    'sessionResumptionUpdate',
  ]);
  if (
    fromSessionResumptionUpdate !== undefined &&
    fromSessionResumptionUpdate !== null
  ) {
    common.setValueByPath(
      toObject,
      ['sessionResumptionUpdate'],
      liveServerSessionResumptionUpdateFromMldev(fromSessionResumptionUpdate),
    );
  }

  return toObject;
}

export function liveServerMessageFromVertex(
  apiClient: ApiClient,
  fromObject: types.LiveServerMessage,
): types.LiveServerMessage {
  const toObject: Record<string, unknown> = {};

  const fromSetupComplete = common.getValueByPath(fromObject, [
    'setupComplete',
  ]);
  if (fromSetupComplete !== undefined) {
    common.setValueByPath(toObject, ['setupComplete'], fromSetupComplete);
  }

  const fromServerContent = common.getValueByPath(fromObject, [
    'serverContent',
  ]);
  if (fromServerContent !== undefined && fromServerContent !== null) {
    common.setValueByPath(
      toObject,
      ['serverContent'],
      liveServerContentFromVertex(apiClient, fromServerContent),
    );
  }

  const fromToolCall = common.getValueByPath(fromObject, ['toolCall']);
  if (fromToolCall !== undefined && fromToolCall !== null) {
    common.setValueByPath(
      toObject,
      ['toolCall'],
      liveServerToolCallFromVertex(apiClient, fromToolCall),
    );
  }

  const fromToolCallCancellation = common.getValueByPath(fromObject, [
    'toolCallCancellation',
  ]);
  if (
    fromToolCallCancellation !== undefined &&
    fromToolCallCancellation !== null
  ) {
    common.setValueByPath(
      toObject,
      ['toolCallCancellation'],
      liveServerToolCallCancellationFromVertex(
        apiClient,
        fromToolCallCancellation,
      ),
    );
  }

  const fromGoAway = common.getValueByPath(fromObject, ['goAway']);
  if (fromGoAway !== undefined && fromGoAway !== null) {
    common.setValueByPath(
      toObject,
      ['goAway'],
      liveServerGoAwayFromVertex(fromGoAway),
    );
  }

  const fromSessionResumptionUpdate = common.getValueByPath(fromObject, [
    'sessionResumptionUpdate',
  ]);
  if (
    fromSessionResumptionUpdate !== undefined &&
    fromSessionResumptionUpdate !== null
  ) {
    common.setValueByPath(
      toObject,
      ['sessionResumptionUpdate'],
      liveServerSessionResumptionUpdateFromVertex(fromSessionResumptionUpdate),
    );
  }

  return toObject;
}

function liveConnectConfigToMldev(
  apiClient: ApiClient,
  fromObject: types.LiveConnectConfig,
): types.LiveClientSetup {
  const toObject: Record<string, unknown> = {};

  const fromGenerationConfig = common.getValueByPath(fromObject, [
    'generationConfig',
  ]);
  if (fromGenerationConfig !== undefined) {
    common.setValueByPath(toObject, ['generationConfig'], fromGenerationConfig);
  }

  const fromResponseModalities = common.getValueByPath(fromObject, [
    'responseModalities',
  ]);
  if (fromResponseModalities !== undefined) {
    common.setValueByPath(
      toObject,
      ['generationConfig', 'responseModalities'],
      fromResponseModalities,
    );
  }

  const fromSpeechConfig = common.getValueByPath(fromObject, ['speechConfig']);
  if (fromSpeechConfig !== undefined) {
    common.setValueByPath(
      toObject,
      ['generationConfig', 'speechConfig'],
      fromSpeechConfig,
    );
  }

  const fromSystemInstruction = common.getValueByPath(fromObject, [
    'systemInstruction',
  ]);
  if (fromSystemInstruction !== undefined && fromSystemInstruction !== null) {
    common.setValueByPath(
      toObject,
      ['systemInstruction'],
      contentToMldev(apiClient, fromSystemInstruction),
    );
  }

  const fromTools = common.getValueByPath(fromObject, ['tools']);
  if (
    fromTools !== undefined &&
    fromTools !== null &&
    Array.isArray(fromTools)
  ) {
    common.setValueByPath(
      toObject,
      ['tools'],
      fromTools.map((item: types.Tool) => {
        return toolToMldev(apiClient, item);
      }),
    );
  }

  const fromSessionResumption = common.getValueByPath(fromObject, [
    'sessionResumption',
  ]);
  if (fromSessionResumption !== undefined && fromSessionResumption !== null) {
    common.setValueByPath(
      toObject,
      ['sessionResumption'],
      liveClientSessionResumptionConfigToMldev(fromSessionResumption),
    );
  }

  return toObject;
}

function liveConnectConfigToVertex(
  apiClient: ApiClient,
  fromObject: types.LiveConnectConfig,
): types.LiveClientSetup {
  const toObject: Record<string, unknown> = {};

  const fromGenerationConfig = common.getValueByPath(fromObject, [
    'generationConfig',
  ]);
  if (fromGenerationConfig !== undefined) {
    common.setValueByPath(toObject, ['generationConfig'], fromGenerationConfig);
  }

  const fromResponseModalities = common.getValueByPath(fromObject, [
    'responseModalities',
  ]);
  if (fromResponseModalities !== undefined) {
    common.setValueByPath(
      toObject,
      ['generationConfig', 'responseModalities'],
      fromResponseModalities,
    );
  } else {
    // Set default to AUDIO to align with MLDev API.
    common.setValueByPath(
      toObject,
      ['generationConfig', 'responseModalities'],
      ['AUDIO'],
    );
  }

  const fromSpeechConfig = common.getValueByPath(fromObject, ['speechConfig']);
  if (fromSpeechConfig !== undefined) {
    common.setValueByPath(
      toObject,
      ['generationConfig', 'speechConfig'],
      fromSpeechConfig,
    );
  }

  const fromSystemInstruction = common.getValueByPath(fromObject, [
    'systemInstruction',
  ]);
  if (fromSystemInstruction !== undefined && fromSystemInstruction !== null) {
    common.setValueByPath(
      toObject,
      ['systemInstruction'],
      contentToVertex(apiClient, fromSystemInstruction),
    );
  }

  const fromTools = common.getValueByPath(fromObject, ['tools']);
  if (
    fromTools !== undefined &&
    fromTools !== null &&
    Array.isArray(fromTools)
  ) {
    common.setValueByPath(
      toObject,
      ['tools'],
      fromTools.map((item: types.Tool) => {
        return toolToVertex(apiClient, item);
      }),
    );
  }

  const fromSessionResumption = common.getValueByPath(fromObject, [
    'sessionResumption',
  ]);
  if (fromSessionResumption !== undefined && fromSessionResumption !== null) {
    common.setValueByPath(
      toObject,
      ['sessionResumption'],
      liveClientSessionResumptionConfigToVertex(fromSessionResumption),
    );
  }

  return toObject;
}

function liveServerContentFromMldev(
  apiClient: ApiClient,
  fromObject: types.LiveServerContent,
): types.LiveServerContent {
  const toObject: Record<string, unknown> = {};

  const fromModelTurn = common.getValueByPath(fromObject, ['modelTurn']);
  if (fromModelTurn !== undefined && fromModelTurn !== null) {
    common.setValueByPath(
      toObject,
      ['modelTurn'],
      contentFromMldev(apiClient, fromModelTurn),
    );
  }

  const fromTurnComplete = common.getValueByPath(fromObject, ['turnComplete']);
  if (fromTurnComplete !== undefined) {
    common.setValueByPath(toObject, ['turnComplete'], fromTurnComplete);
  }

  const fromInterrupted = common.getValueByPath(fromObject, ['interrupted']);
  if (fromInterrupted !== undefined) {
    common.setValueByPath(toObject, ['interrupted'], fromInterrupted);
  }

  return toObject;
}

function liveServerContentFromVertex(
  apiClient: ApiClient,
  fromObject: types.LiveServerContent,
): types.LiveServerContent {
  const toObject: Record<string, unknown> = {};

  const fromModelTurn = common.getValueByPath(fromObject, ['modelTurn']);
  if (fromModelTurn !== undefined && fromModelTurn !== null) {
    common.setValueByPath(
      toObject,
      ['modelTurn'],
      contentFromVertex(apiClient, fromModelTurn),
    );
  }

  const fromTurnComplete = common.getValueByPath(fromObject, ['turnComplete']);
  if (fromTurnComplete !== undefined) {
    common.setValueByPath(toObject, ['turnComplete'], fromTurnComplete);
  }

  const fromInterrupted = common.getValueByPath(fromObject, ['interrupted']);
  if (fromInterrupted !== undefined) {
    common.setValueByPath(toObject, ['interrupted'], fromInterrupted);
  }

  return toObject;
}

function functionCallFromMldev(
  apiClient: ApiClient,
  fromObject: types.FunctionCall,
): types.FunctionCall {
  const toObject: Record<string, unknown> = {};

  const fromId = common.getValueByPath(fromObject, ['id']);
  if (fromId !== undefined) {
    common.setValueByPath(toObject, ['id'], fromId);
  }

  const fromArgs = common.getValueByPath(fromObject, ['args']);
  if (fromArgs !== undefined) {
    common.setValueByPath(toObject, ['args'], fromArgs);
  }

  const fromName = common.getValueByPath(fromObject, ['name']);
  if (fromName !== undefined) {
    common.setValueByPath(toObject, ['name'], fromName);
  }

  return toObject;
}

function functionCallFromVertex(
  apiClient: ApiClient,
  fromObject: types.FunctionCall,
): types.FunctionCall {
  const toObject: Record<string, unknown> = {};

  const fromArgs = common.getValueByPath(fromObject, ['args']);
  if (fromArgs !== undefined) {
    common.setValueByPath(toObject, ['args'], fromArgs);
  }

  const fromName = common.getValueByPath(fromObject, ['name']);
  if (fromName !== undefined) {
    common.setValueByPath(toObject, ['name'], fromName);
  }

  return toObject;
}

function liveServerToolCallFromMldev(
  apiClient: ApiClient,
  fromObject: types.LiveServerToolCall,
): types.LiveServerToolCall {
  const toObject: Record<string, unknown> = {};

  const fromFunctionCalls = common.getValueByPath(fromObject, [
    'functionCalls',
  ]);
  if (
    fromFunctionCalls !== undefined &&
    fromFunctionCalls !== null &&
    Array.isArray(fromFunctionCalls)
  ) {
    common.setValueByPath(
      toObject,
      ['functionCalls'],
      fromFunctionCalls.map((item: types.FunctionCall) => {
        return functionCallFromMldev(apiClient, item);
      }),
    );
  }

  return toObject;
}

function liveServerToolCallFromVertex(
  apiClient: ApiClient,
  fromObject: types.LiveServerToolCall,
): types.LiveServerToolCall {
  const toObject: Record<string, unknown> = {};

  const fromFunctionCalls = common.getValueByPath(fromObject, [
    'functionCalls',
  ]);
  if (
    fromFunctionCalls !== undefined &&
    fromFunctionCalls !== null &&
    Array.isArray(fromFunctionCalls)
  ) {
    common.setValueByPath(
      toObject,
      ['functionCalls'],
      fromFunctionCalls.map((item: types.FunctionCall) => {
        return functionCallFromVertex(apiClient, item);
      }),
    );
  }

  return toObject;
}

function liveServerToolCallCancellationFromMldev(
  apiClient: ApiClient,
  fromObject: types.LiveServerToolCallCancellation,
): types.LiveServerToolCallCancellation {
  const toObject: Record<string, unknown> = {};

  const fromIds = common.getValueByPath(fromObject, ['ids']);
  if (fromIds !== undefined) {
    common.setValueByPath(toObject, ['ids'], fromIds);
  }

  return toObject;
}

function liveServerToolCallCancellationFromVertex(
  apiClient: ApiClient,
  fromObject: types.LiveServerToolCallCancellation,
): types.LiveServerToolCallCancellation {
  const toObject: Record<string, unknown> = {};

  const fromIds = common.getValueByPath(fromObject, ['ids']);
  if (fromIds !== undefined) {
    common.setValueByPath(toObject, ['ids'], fromIds);
  }

  return toObject;
}

function liveServerGoAwayFromMldev(
  fromObject: types.LiveServerGoAway,
): types.LiveServerGoAway {
  const toObject: Record<string, unknown> = {};

  const fromTimeLeft = common.getValueByPath(fromObject, ['timeLeft']);
  if (fromTimeLeft !== undefined) {
    common.setValueByPath(toObject, ['timeLeft'], fromTimeLeft);
  }

  return toObject;
}

function liveServerGoAwayFromVertex(
  fromObject: types.LiveServerGoAway,
): types.LiveServerGoAway {
  const toObject: Record<string, unknown> = {};

  const fromTimeLeft = common.getValueByPath(fromObject, ['timeLeft']);
  if (fromTimeLeft !== undefined) {
    common.setValueByPath(toObject, ['timeLeft'], fromTimeLeft);
  }

  return toObject;
}

function liveServerSessionResumptionUpdateFromMldev(
  fromObject: types.LiveServerSessionResumptionUpdate,
): types.LiveServerSessionResumptionUpdate {
  const toObject: Record<string, unknown> = {};

  const fromNewHandle = common.getValueByPath(fromObject, ['newHandle']);
  if (fromNewHandle !== undefined) {
    common.setValueByPath(toObject, ['newHandle'], fromNewHandle);
  }

  const fromResumable = common.getValueByPath(fromObject, ['resumable']);
  if (fromResumable !== undefined) {
    common.setValueByPath(toObject, ['resumable'], fromResumable);
  }

  const fromLastConsumedClientMessageIndex = common.getValueByPath(fromObject, [
    'lastConsumedClientMessageIndex',
  ]);
  if (fromLastConsumedClientMessageIndex !== undefined) {
    common.setValueByPath(
      toObject,
      ['lastConsumedClientMessageIndex'],
      fromLastConsumedClientMessageIndex,
    );
  }

  return toObject;
}

function liveServerSessionResumptionUpdateFromVertex(
  fromObject: types.LiveServerSessionResumptionUpdate,
): types.LiveServerSessionResumptionUpdate {
  const toObject: Record<string, unknown> = {};

  const fromNewHandle = common.getValueByPath(fromObject, ['newHandle']);
  if (fromNewHandle !== undefined) {
    common.setValueByPath(toObject, ['newHandle'], fromNewHandle);
  }

  const fromResumable = common.getValueByPath(fromObject, ['resumable']);
  if (fromResumable !== undefined) {
    common.setValueByPath(toObject, ['resumable'], fromResumable);
  }

  const fromLastConsumedClientMessageIndex = common.getValueByPath(fromObject, [
    'lastConsumedClientMessageIndex',
  ]);
  if (fromLastConsumedClientMessageIndex !== undefined) {
    common.setValueByPath(
      toObject,
      ['lastConsumedClientMessageIndex'],
      fromLastConsumedClientMessageIndex,
    );
  }

  return toObject;
}

function liveClientSessionResumptionConfigToMldev(
  fromObject: types.SessionResumptionConfig,
): types.SessionResumptionConfig {
  const toObject: Record<string, unknown> = {};

  const fromHandle = common.getValueByPath(fromObject, ['handle']);
  if (fromHandle !== undefined) {
    common.setValueByPath(toObject, ['handle'], fromHandle);
  }

  if (common.getValueByPath(fromObject, ['transparent']) !== undefined) {
    throw new Error('transparent parameter is not supported in Gemini API.');
  }

  return toObject;
}

function liveClientSessionResumptionConfigToVertex(
  fromObject: types.SessionResumptionConfig,
): types.SessionResumptionConfig {
  const toObject: Record<string, unknown> = {};

  const fromHandle = common.getValueByPath(fromObject, ['handle']);
  if (fromHandle !== undefined) {
    common.setValueByPath(toObject, ['handle'], fromHandle);
  }

  const fromTransparent = common.getValueByPath(fromObject, ['transparent']);
  if (fromTransparent !== undefined) {
    common.setValueByPath(toObject, ['transparent'], fromTransparent);
  }

  return toObject;
}
