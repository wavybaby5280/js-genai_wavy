/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {shouldAppendAfcHistory, shouldDisableAfc} from '../../src/_afc.js';
import * as types from '../../src/types.js';

describe('afc_test', () => {
  it('should default to false when there is no config', () => {
    expect(shouldDisableAfc(undefined)).toBeFalse();
  });
  it('should default to false when there is no automaticFunctionCalling config', () => {
    const config: types.GenerateContentConfig = {};
    expect(shouldDisableAfc(config)).toBeFalse();
  });
  it('should default to false when there is no disable config', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {},
    };
    expect(shouldDisableAfc(config)).toBeFalse();
  });
  it('should be set to false when provided valid maximumRemoteCalls value', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        maximumRemoteCalls: 5,
      },
    };
    expect(shouldDisableAfc(config)).toBeFalse();
  });
  it('should be set to false when provided valid maximumRemoteCalls value integer as float', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        maximumRemoteCalls: 5.0,
      },
    };
    expect(shouldDisableAfc(config)).toBeFalse();
  });
  it('should be set to true when user provied disable true', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        disable: true,
      },
    };
    expect(shouldDisableAfc(config)).toBeTrue();
  });
  it('should be set to true when user provied disable true with valid maximumRemoteCalls value', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        disable: true,
        maximumRemoteCalls: 5,
      },
    };
    expect(shouldDisableAfc(config)).toBeTrue();
  });
  it('should be set to true when provided negative maximumRemoteCalls value', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        maximumRemoteCalls: -1,
      },
    };
    expect(shouldDisableAfc(config)).toBeTrue();
  });
  it('should be set to true when user set disable false and provided negative maximumRemoteCalls value', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        disable: false,
        maximumRemoteCalls: -1,
      },
    };
    expect(shouldDisableAfc(config)).toBeTrue();
  });
  it('should be set to true when provided zero maximumRemoteCalls value', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        maximumRemoteCalls: 0,
      },
    };
    expect(shouldDisableAfc(config)).toBeTrue();
  });
  it('should be set to true when provided non integer maximumRemoteCalls value', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        maximumRemoteCalls: 7.2,
      },
    };
    expect(shouldDisableAfc(config)).toBeTrue();
  });
  it('shouldAppendAfcHistory should default to true when there is no config', () => {
    expect(shouldAppendAfcHistory({})).toBeTrue();
  });
  it('shouldAppendAfcHistory should default to true when there is no automaticFunctionCalling config', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {},
    };
    expect(shouldAppendAfcHistory(config)).toBeTrue();
  });
  it('shouldAppendAfcHistory should default to true when there is no ignoreCallHistory config', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        disable: false,
      },
    };
    expect(shouldAppendAfcHistory(config)).toBeTrue();
  });
  it('should be set to false when the ignoreCallHistory is true in config', () => {
    const config: types.GenerateContentConfig = {
      automaticFunctionCalling: {
        ignoreCallHistory: true,
      },
    };
    expect(shouldAppendAfcHistory(config)).toBeFalse();
  });
});
