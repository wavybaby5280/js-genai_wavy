/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ApiClient} from '../../src/_api_client';
import {FakeAuth} from '../../src/_fake_auth';
import {tModel, tSchema, tSpeechConfig, tTool} from '../../src/_transformers';
import {Schema, SpeechConfig, Tool} from '../../src/types';

describe('tModel', () => {
  it('empty string', () => {
    expect(() => {tModel(new ApiClient({auth: new FakeAuth()}), '')})
        .toThrowError('model is required');
  });
  it('returns model name for MLDev starting with models', () => {
    expect(tModel(
               new ApiClient({auth: new FakeAuth()}),
               'models/gemini-1.5-flash-exp'))
        .toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns model name for MLDev starting with tunedModels', () => {
    expect(tModel(
               new ApiClient({auth: new FakeAuth()}),
               'tunedModels/gemini-1.5-flash-exp'))
        .toEqual('tunedModels/gemini-1.5-flash-exp');
  });
  it('returns model prefix for MLDev', () => {
    expect(
        tModel(new ApiClient({auth: new FakeAuth()}), 'gemini-1.5-flash-exp'))
        .toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with publishers', () => {
    expect(tModel(
               new ApiClient({auth: new FakeAuth(), vertexai: true}),
               'publishers/gemini-1.5-flash-exp'))
        .toEqual('publishers/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with projects', () => {
    expect(tModel(
               new ApiClient({auth: new FakeAuth(), vertexai: true}),
               'projects/gemini-1.5-flash-exp'))
        .toEqual('projects/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with models', () => {
    expect(tModel(
               new ApiClient({auth: new FakeAuth(), vertexai: true}),
               'models/gemini-1.5-flash-exp'))
        .toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns publisher prefix for Vertex with slash', () => {
    expect(tModel(
               new ApiClient({auth: new FakeAuth(), vertexai: true}),
               'google/gemini-1.5-flash-exp'))
        .toEqual('publishers/google/models/gemini-1.5-flash-exp');
  });
  it('returns publisher prefix for Vertex', () => {
    expect(tModel(
               new ApiClient({auth: new FakeAuth(), vertexai: true}),
               'gemini-1.5-flash-exp'))
        .toEqual('publishers/google/models/gemini-1.5-flash-exp');
  });
});

describe(
    'tSchema', () => {it('no change', () => {
                 const schema = {title: 'title'};
                 expect(tSchema(new ApiClient({auth: new FakeAuth()}), schema))
                     .toEqual(schema);
               })});

describe('tSpeechConfig', () => {
  it('string to speechConfig', () => {
    const speechConfig = {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'voice-name',
        },
      },
    };
    expect(tSpeechConfig(new ApiClient({auth: new FakeAuth()}), 'voice-name'))
        .toEqual(speechConfig);
  });
});

describe('tTool', () => {
  it('no change', () => {
    const tool = {functionDeclarations: [{name: 'function-name'}]};
    expect(tTool(new ApiClient({auth: new FakeAuth()}), tool)).toEqual(tool);
  });
});
