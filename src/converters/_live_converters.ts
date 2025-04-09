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

  const fromUsageMetadata = common.getValueByPath(fromObject, [
    'usageMetadata',
  ]);
  if (fromUsageMetadata != undefined && fromUsageMetadata != null) {
    common.setValueByPath(
      toObject,
      ['usageMetadata'],
      usageMetadataFromMldev(apiClient, fromUsageMetadata),
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

  const fromUsageMetadata = common.getValueByPath(fromObject, [
    'usageMetadata',
  ]);
  if (fromUsageMetadata != undefined && fromUsageMetadata != null) {
    common.setValueByPath(
      toObject,
      ['usageMetadata'],
      usageMetadataFromVertex(apiClient, fromUsageMetadata),
    );
  }

  return toObject;
}

function slidingWindowToMldev(
  fromObject: types.SlidingWindow,
): types.SlidingWindow {
  const toObject: Record<string, unknown> = {};

  const fromTargetTokens = common.getValueByPath(fromObject, ['targetTokens']);
  if (fromTargetTokens !== undefined && fromTargetTokens !== null) {
    common.setValueByPath(toObject, ['targetTokens'], fromTargetTokens);
  }

  return toObject;
}

function slidingWindowToVertex(
  fromObject: types.SlidingWindow,
): types.SlidingWindow {
  const toObject: Record<string, unknown> = {};

  const fromTargetTokens = common.getValueByPath(fromObject, ['targetTokens']);
  if (fromTargetTokens !== undefined && fromTargetTokens !== null) {
    common.setValueByPath(toObject, ['targetTokens'], fromTargetTokens);
  }

  return toObject;
}

function contextWindowCompressionToMldev(
  fromObject: types.ContextWindowCompressionConfig,
): types.ContextWindowCompressionConfig {
  const toObject: Record<string, unknown> = {};

  const fromTriggerTokens = common.getValueByPath(fromObject, [
    'triggerTokens',
  ]);
  if (fromTriggerTokens !== undefined && fromTriggerTokens !== null) {
    common.setValueByPath(toObject, ['triggerTokens'], fromTriggerTokens);
  }

  const fromSlidingWindow = common.getValueByPath(fromObject, [
    'slidingWindow',
  ]);
  if (fromSlidingWindow !== undefined && fromSlidingWindow !== null) {
    common.setValueByPath(
      toObject,
      ['slidingWindow'],
      slidingWindowToMldev(fromSlidingWindow),
    );
  }

  return toObject;
}

function contextWindowCompressionToVertex(
  fromObject: types.ContextWindowCompressionConfig,
): types.ContextWindowCompressionConfig {
  const toObject: Record<string, unknown> = {};

  const fromTriggerTokens = common.getValueByPath(fromObject, [
    'triggerTokens',
  ]);
  if (fromTriggerTokens !== undefined && fromTriggerTokens !== null) {
    common.setValueByPath(toObject, ['triggerTokens'], fromTriggerTokens);
  }

  const fromSlidingWindow = common.getValueByPath(fromObject, [
    'slidingWindow',
  ]);
  if (fromSlidingWindow !== undefined && fromSlidingWindow !== null) {
    common.setValueByPath(
      toObject,
      ['slidingWindow'],
      slidingWindowToVertex(fromSlidingWindow),
    );
  }

  return toObject;
}

function automaticActivityDetectionToMldev(
  fromObject: types.AutomaticActivityDetection,
): types.AutomaticActivityDetection {
  const toObject: Record<string, unknown> = {};

  const fromDisabled = common.getValueByPath(fromObject, ['disabled']);
  if (fromDisabled !== undefined && fromDisabled !== null) {
    common.setValueByPath(toObject, ['disabled'], fromDisabled);
  }

  const fromStartOfSpeechSensitivity = common.getValueByPath(fromObject, [
    'startOfSpeechSensitivity',
  ]);
  if (
    fromStartOfSpeechSensitivity !== undefined &&
    fromStartOfSpeechSensitivity !== null
  ) {
    common.setValueByPath(
      toObject,
      ['startOfSpeechSensitivity'],
      fromStartOfSpeechSensitivity,
    );
  }

  const fromEndOfSpeechSensitivity = common.getValueByPath(fromObject, [
    'endOfSpeechSensitivity',
  ]);
  if (
    fromEndOfSpeechSensitivity !== undefined &&
    fromEndOfSpeechSensitivity !== null
  ) {
    common.setValueByPath(
      toObject,
      ['endOfSpeechSensitivity'],
      fromEndOfSpeechSensitivity,
    );
  }

  const fromPrefixPaddingMs = common.getValueByPath(fromObject, [
    'prefixPaddingMs',
  ]);
  if (fromPrefixPaddingMs !== undefined && fromPrefixPaddingMs !== null) {
    common.setValueByPath(toObject, ['prefixPaddingMs'], fromPrefixPaddingMs);
  }

  const fromSilenceDurationMs = common.getValueByPath(fromObject, [
    'silenceDurationMs',
  ]);
  if (fromSilenceDurationMs !== undefined && fromSilenceDurationMs !== null) {
    common.setValueByPath(
      toObject,
      ['silenceDurationMs'],
      fromSilenceDurationMs,
    );
  }

  return toObject;
}

function automaticActivityDetectionToVertex(
  fromObject: types.AutomaticActivityDetection,
): types.AutomaticActivityDetection {
  const toObject: Record<string, unknown> = {};

  const fromDisabled = common.getValueByPath(fromObject, ['disabled']);
  if (fromDisabled !== undefined && fromDisabled !== null) {
    common.setValueByPath(toObject, ['disabled'], fromDisabled);
  }

  const fromStartOfSpeechSensitivity = common.getValueByPath(fromObject, [
    'startOfSpeechSensitivity',
  ]);
  if (
    fromStartOfSpeechSensitivity !== undefined &&
    fromStartOfSpeechSensitivity !== null
  ) {
    common.setValueByPath(
      toObject,
      ['startOfSpeechSensitivity'],
      fromStartOfSpeechSensitivity,
    );
  }

  const fromEndOfSpeechSensitivity = common.getValueByPath(fromObject, [
    'endOfSpeechSensitivity',
  ]);
  if (
    fromEndOfSpeechSensitivity !== undefined &&
    fromEndOfSpeechSensitivity !== null
  ) {
    common.setValueByPath(
      toObject,
      ['endOfSpeechSensitivity'],
      fromEndOfSpeechSensitivity,
    );
  }

  const fromPrefixPaddingMs = common.getValueByPath(fromObject, [
    'prefixPaddingMs',
  ]);
  if (fromPrefixPaddingMs !== undefined && fromPrefixPaddingMs !== null) {
    common.setValueByPath(toObject, ['prefixPaddingMs'], fromPrefixPaddingMs);
  }

  const fromSilenceDurationMs = common.getValueByPath(fromObject, [
    'silenceDurationMs',
  ]);
  if (fromSilenceDurationMs !== undefined && fromSilenceDurationMs !== null) {
    common.setValueByPath(
      toObject,
      ['silenceDurationMs'],
      fromSilenceDurationMs,
    );
  }

  return toObject;
}

function realtimeInputConfigToMldev(
  fromObject: types.RealtimeInputConfig,
): types.RealtimeInputConfig {
  const toObject: Record<string, unknown> = {};

  const fromAutomaticActivityDetection = common.getValueByPath(fromObject, [
    'automaticActivityDetection',
  ]);
  if (
    fromAutomaticActivityDetection !== undefined &&
    fromAutomaticActivityDetection !== null
  ) {
    common.setValueByPath(
      toObject,
      ['automaticActivityDetection'],
      automaticActivityDetectionToMldev(fromAutomaticActivityDetection),
    );
  }

  const fromActivityHandling = common.getValueByPath(fromObject, [
    'activityHandling',
  ]);
  if (fromActivityHandling !== undefined && fromActivityHandling !== null) {
    common.setValueByPath(toObject, ['activityHandling'], fromActivityHandling);
  }

  const fromTurnCoverage = common.getValueByPath(fromObject, ['turnCoverage']);
  if (fromTurnCoverage !== undefined && fromTurnCoverage !== null) {
    common.setValueByPath(toObject, ['turnCoverage'], fromTurnCoverage);
  }

  return toObject;
}

function realtimeInputConfigToVertex(
  fromObject: types.RealtimeInputConfig,
): types.RealtimeInputConfig {
  const toObject: Record<string, unknown> = {};

  const fromAutomaticActivityDetection = common.getValueByPath(fromObject, [
    'automaticActivityDetection',
  ]);
  if (
    fromAutomaticActivityDetection !== undefined &&
    fromAutomaticActivityDetection !== null
  ) {
    common.setValueByPath(
      toObject,
      ['automaticActivityDetection'],
      automaticActivityDetectionToVertex(fromAutomaticActivityDetection),
    );
  }

  const fromActivityHandling = common.getValueByPath(fromObject, [
    'activityHandling',
  ]);
  if (fromActivityHandling !== undefined && fromActivityHandling !== null) {
    common.setValueByPath(toObject, ['activityHandling'], fromActivityHandling);
  }

  const fromTurnCoverage = common.getValueByPath(fromObject, ['turnCoverage']);
  if (fromTurnCoverage !== undefined && fromTurnCoverage !== null) {
    common.setValueByPath(toObject, ['turnCoverage'], fromTurnCoverage);
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

  const fromContextWindowCompression = common.getValueByPath(fromObject, [
    'contextWindowCompression',
  ]);
  if (
    fromContextWindowCompression !== undefined &&
    fromContextWindowCompression !== null
  ) {
    common.setValueByPath(
      toObject,
      ['contextWindowCompression'],
      contextWindowCompressionToMldev(fromContextWindowCompression),
    );
  }

  const fromRealtimeInputConfig = common.getValueByPath(fromObject, [
    'realtimeInputConfig',
  ]);
  if (
    fromRealtimeInputConfig !== undefined &&
    fromRealtimeInputConfig !== null
  ) {
    common.setValueByPath(
      toObject,
      ['realtimeInputConfig'],
      realtimeInputConfigToMldev(fromRealtimeInputConfig),
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

  const fromContextWindowCompression = common.getValueByPath(fromObject, [
    'contextWindowCompression',
  ]);
  if (
    fromContextWindowCompression !== undefined &&
    fromContextWindowCompression !== null
  ) {
    common.setValueByPath(
      toObject,
      ['contextWindowCompression'],
      contextWindowCompressionToVertex(fromContextWindowCompression),
    );
  }

  const fromRealtimeInputConfig = common.getValueByPath(fromObject, [
    'realtimeInputConfig',
  ]);
  if (
    fromRealtimeInputConfig !== undefined &&
    fromRealtimeInputConfig !== null
  ) {
    common.setValueByPath(
      toObject,
      ['realtimeInputConfig'],
      realtimeInputConfigToVertex(fromRealtimeInputConfig),
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

  const fromGenerationComplete = common.getValueByPath(fromObject, [
    'generationComplete',
  ]);
  if (fromGenerationComplete != null) {
    common.setValueByPath(
      toObject,
      ['generationComplete'],
      fromGenerationComplete,
    );
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

  const fromGenerationComplete = common.getValueByPath(fromObject, [
    'generationComplete',
  ]);
  if (fromGenerationComplete != null) {
    common.setValueByPath(
      toObject,
      ['generationComplete'],
      fromGenerationComplete,
    );
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

export function modalityTokenCountFromMldev(
  apiClient: ApiClient,
  fromObject: types.ModalityTokenCount,
): types.ModalityTokenCount {
  const toObject: Record<string, unknown> = {};

  const fromModality = common.getValueByPath(fromObject, ['modality']);
  if (fromModality != null) {
    common.setValueByPath(toObject, ['modality'], fromModality);
  }

  const fromTokenCount = common.getValueByPath(fromObject, ['tokenCount']);
  if (fromTokenCount != null) {
    common.setValueByPath(toObject, ['tokenCount'], fromTokenCount);
  }

  return toObject;
}

export function usageMetadataFromMldev(
  apiClient: ApiClient,
  fromObject: types.UsageMetadata,
): types.UsageMetadata {
  const toObject: Record<string, unknown> = {};

  const fromPromptTokenCount = common.getValueByPath(fromObject, [
    'promptTokenCount',
  ]);
  if (fromPromptTokenCount != null) {
    common.setValueByPath(toObject, ['promptTokenCount'], fromPromptTokenCount);
  }

  const fromCachedContentTokenCount = common.getValueByPath(fromObject, [
    'cachedContentTokenCount',
  ]);
  if (fromCachedContentTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['cachedContentTokenCount'],
      fromCachedContentTokenCount,
    );
  }

  const fromResponseTokenCount = common.getValueByPath(fromObject, [
    'responseTokenCount',
  ]);
  if (fromResponseTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['responseTokenCount'],
      fromResponseTokenCount,
    );
  }

  const fromToolUsePromptTokenCount = common.getValueByPath(fromObject, [
    'toolUsePromptTokenCount',
  ]);
  if (fromToolUsePromptTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['toolUsePromptTokenCount'],
      fromToolUsePromptTokenCount,
    );
  }

  const fromThoughtsTokenCount = common.getValueByPath(fromObject, [
    'thoughtsTokenCount',
  ]);
  if (fromThoughtsTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['thoughtsTokenCount'],
      fromThoughtsTokenCount,
    );
  }

  const fromTotalTokenCount = common.getValueByPath(fromObject, [
    'totalTokenCount',
  ]);
  if (fromTotalTokenCount != null) {
    common.setValueByPath(toObject, ['totalTokenCount'], fromTotalTokenCount);
  }

  const fromPromptTokensDetails = common.getValueByPath(fromObject, [
    'promptTokensDetails',
  ]);
  if (fromPromptTokensDetails != null) {
    if (Array.isArray(fromPromptTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['promptTokensDetails'],
        fromPromptTokensDetails.map((item) => {
          return modalityTokenCountFromMldev(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['promptTokensDetails'],
        fromPromptTokensDetails,
      );
    }
  }

  const fromCacheTokensDetails = common.getValueByPath(fromObject, [
    'cacheTokensDetails',
  ]);
  if (fromCacheTokensDetails != null) {
    if (Array.isArray(fromCacheTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['cacheTokensDetails'],
        fromCacheTokensDetails.map((item) => {
          return modalityTokenCountFromMldev(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['cacheTokensDetails'],
        fromCacheTokensDetails,
      );
    }
  }

  const fromResponseTokensDetails = common.getValueByPath(fromObject, [
    'responseTokensDetails',
  ]);
  if (fromResponseTokensDetails != null) {
    if (Array.isArray(fromResponseTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['responseTokensDetails'],
        fromResponseTokensDetails.map((item) => {
          return modalityTokenCountFromMldev(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['responseTokensDetails'],
        fromResponseTokensDetails,
      );
    }
  }

  const fromToolUsePromptTokensDetails = common.getValueByPath(fromObject, [
    'toolUsePromptTokensDetails',
  ]);
  if (fromToolUsePromptTokensDetails != null) {
    if (Array.isArray(fromToolUsePromptTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['toolUsePromptTokensDetails'],
        fromToolUsePromptTokensDetails.map((item) => {
          return modalityTokenCountFromMldev(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['toolUsePromptTokensDetails'],
        fromToolUsePromptTokensDetails,
      );
    }
  }

  return toObject;
}

export function modalityTokenCountFromVertex(
  apiClient: ApiClient,
  fromObject: types.ModalityTokenCount,
): types.ModalityTokenCount {
  const toObject: Record<string, unknown> = {};

  const fromModality = common.getValueByPath(fromObject, ['modality']);
  if (fromModality != null) {
    common.setValueByPath(toObject, ['modality'], fromModality);
  }

  const fromTokenCount = common.getValueByPath(fromObject, ['tokenCount']);
  if (fromTokenCount != null) {
    common.setValueByPath(toObject, ['tokenCount'], fromTokenCount);
  }

  return toObject;
}

export function usageMetadataFromVertex(
  apiClient: ApiClient,
  fromObject: types.UsageMetadata,
): types.UsageMetadata {
  const toObject: Record<string, unknown> = {};

  const fromPromptTokenCount = common.getValueByPath(fromObject, [
    'promptTokenCount',
  ]);
  if (fromPromptTokenCount != null) {
    common.setValueByPath(toObject, ['promptTokenCount'], fromPromptTokenCount);
  }

  const fromCachedContentTokenCount = common.getValueByPath(fromObject, [
    'cachedContentTokenCount',
  ]);
  if (fromCachedContentTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['cachedContentTokenCount'],
      fromCachedContentTokenCount,
    );
  }

  const fromResponseTokenCount = common.getValueByPath(fromObject, [
    'candidatesTokenCount',
  ]);
  if (fromResponseTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['responseTokenCount'],
      fromResponseTokenCount,
    );
  }

  const fromToolUsePromptTokenCount = common.getValueByPath(fromObject, [
    'toolUsePromptTokenCount',
  ]);
  if (fromToolUsePromptTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['toolUsePromptTokenCount'],
      fromToolUsePromptTokenCount,
    );
  }

  const fromThoughtsTokenCount = common.getValueByPath(fromObject, [
    'thoughtsTokenCount',
  ]);
  if (fromThoughtsTokenCount != null) {
    common.setValueByPath(
      toObject,
      ['thoughtsTokenCount'],
      fromThoughtsTokenCount,
    );
  }

  const fromTotalTokenCount = common.getValueByPath(fromObject, [
    'totalTokenCount',
  ]);
  if (fromTotalTokenCount != null) {
    common.setValueByPath(toObject, ['totalTokenCount'], fromTotalTokenCount);
  }

  const fromPromptTokensDetails = common.getValueByPath(fromObject, [
    'promptTokensDetails',
  ]);
  if (fromPromptTokensDetails != null) {
    if (Array.isArray(fromPromptTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['promptTokensDetails'],
        fromPromptTokensDetails.map((item) => {
          return modalityTokenCountFromVertex(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['promptTokensDetails'],
        fromPromptTokensDetails,
      );
    }
  }

  const fromCacheTokensDetails = common.getValueByPath(fromObject, [
    'cacheTokensDetails',
  ]);
  if (fromCacheTokensDetails != null) {
    if (Array.isArray(fromCacheTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['cacheTokensDetails'],
        fromCacheTokensDetails.map((item) => {
          return modalityTokenCountFromVertex(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['cacheTokensDetails'],
        fromCacheTokensDetails,
      );
    }
  }

  const fromToolUsePromptTokensDetails = common.getValueByPath(fromObject, [
    'toolUsePromptTokensDetails',
  ]);
  if (fromToolUsePromptTokensDetails != null) {
    if (Array.isArray(fromToolUsePromptTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['toolUsePromptTokensDetails'],
        fromToolUsePromptTokensDetails.map((item) => {
          return modalityTokenCountFromVertex(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['toolUsePromptTokensDetails'],
        fromToolUsePromptTokensDetails,
      );
    }
  }

  const fromResponseTokensDetails = common.getValueByPath(fromObject, [
    'candidatesTokensDetails',
  ]);
  if (fromResponseTokensDetails != null) {
    if (Array.isArray(fromResponseTokensDetails)) {
      common.setValueByPath(
        toObject,
        ['responseTokensDetails'],
        fromResponseTokensDetails.map((item) => {
          return modalityTokenCountFromVertex(apiClient, item);
        }),
      );
    } else {
      common.setValueByPath(
        toObject,
        ['responseTokensDetails'],
        fromResponseTokensDetails,
      );
    }
  }

  const fromTrafficType = common.getValueByPath(fromObject, ['trafficType']);
  if (fromTrafficType != null) {
    common.setValueByPath(toObject, ['trafficType'], fromTrafficType);
  }

  return toObject;
}
