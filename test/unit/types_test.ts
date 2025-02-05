/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GenerateContentResponse,
  Candidate,
  Content,
  Language,
  Outcome,
  Part,
  createPartFromUri,
  createPartFromText,
  createPartFromFunctionCall,
  createPartFromFunctionResponse,
  createPartFromBase64,
  createPartFromVideoMetadata,
  createPartFromCodeExecutionResult,
  createPartFromExecutableCode,
} from '../../src/types';

describe('GenerateContentResponse.text', () => {
  it('should return null when candidates is undefined', () => {
    const response = new GenerateContentResponse();
    expect(response.text()).toBeNull();
  });

  it('should return null when candidates is an empty array', () => {
    const response = new GenerateContentResponse();
    response.candidates = [];
    expect(response.text()).toBeNull();
  });

  it('should return null when content is undefined', () => {
    const response = new GenerateContentResponse();
    response.candidates = [{} as Candidate];
    expect(response.text()).toBeNull();
  });

  it('should return null when content.parts is undefined', () => {
    const response = new GenerateContentResponse();
    response.candidates = [{content: {} as Content} as Candidate];
    expect(response.text()).toBeNull();
  });

  it('should return null when content.parts is empty array', () => {
    const response = new GenerateContentResponse();
    response.candidates = [{content: {parts: []}} as Candidate];
    expect(response.text()).toBeNull();
  });

  it('should use first candidate when there are multiple candidates', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {content: {parts: [{text: 'First candidate'}]}} as Candidate,
      {content: {parts: [{text: 'Second candidate'}]}} as Candidate,
    ];
    expect(response.text()).toBe('First candidate');
  });

  it('should return concatenated text from valid text parts', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {
        content: {
          parts: [{text: 'Hello '}, {text: 'world!'}],
        },
      } as Candidate,
    ];
    expect(response.text()).toBe('Hello world!');
  });

  it('should throw an error when parts contain invalid fields', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {
        content: {
          parts: [
            {text: 'Hello '},
            {
              inlineData: {
                data: 'world!',
                mimeType: 'text/plain',
              },
            },
          ],
        },
      } as Candidate,
    ];
    expect(() => response.text()).toThrow(
      new Error(
        'GenerateContentResponse.text only supports text parts, but got inlineData part {"inlineData":{"data":"world!","mimeType":"text/plain"}}',
      ),
    );
  });

  it('should skip parts with thought set to true', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {
        content: {
          parts: [{text: 'Hello '}, {text: 'world!', thought: true}],
        },
      } as Candidate,
    ];
    expect(response.text()).toBe('Hello ');
  });
});

describe('GenerateContentResponse.functionCalls', () => {
  it('should return undefined when candidates is undefined', () => {
    const response = new GenerateContentResponse();
    expect(response.functionCalls()).toBeUndefined();
  });

  it('should return undefined when candidates is an empty array', () => {
    const response = new GenerateContentResponse();
    response.candidates = [];
    expect(response.functionCalls()).toBeUndefined();
  });

  it('should return undefined when candidates[0].content.parts is an empty array', () => {
    const response = new GenerateContentResponse();
    response.candidates = [{content: {parts: []}}];
    expect(response.functionCalls()).toBeUndefined();
  });

  it('should use the first candidate when there are multiple candidates', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {content: {parts: [{functionCall: {name: 'func1'}}]}},
      {content: {parts: [{functionCall: {name: 'func2'}}]}},
    ];
    expect(response.functionCalls()).toEqual([{name: 'func1'}]);
  });

  it('should return an array of function calls when candidates[0].content.parts contains valid function calls', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {
        content: {
          parts: [
            {functionCall: {name: 'func1'}},
            {functionCall: {name: 'func2'}},
          ],
        },
      },
    ];
    expect(response.functionCalls()).toEqual([
      {name: 'func1'},
      {name: 'func2'},
    ]);
  });

  it('should return an empty array when candidates[0].content.parts contains no function calls', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {content: {parts: [{text: 'text1'}, {text: 'text2'}]}},
    ];
    expect(response.functionCalls()).toEqual([]);
  });
  it('should filter out filter out undefined function calls', () => {
    const response = new GenerateContentResponse();
    response.candidates = [
      {
        content: {
          parts: [{functionCall: {name: 'func1'}}, {functionCall: undefined}],
        },
      },
    ];
    expect(response.functionCalls()).toEqual([{name: 'func1'}]);
  });
});

describe('createPart usability functions', () => {
  it('createPartFromText should create a text part', () => {
    const part = createPartFromText('Hello world!');
    const expectedPart: Part = {
      text: 'Hello world!',
    };

    expect(part).toEqual(expectedPart);
  });

  it('createPartFromUri should create a file data part', () => {
    const part = createPartFromUri('gs://bucket/file.txt', 'text/plain');
    const expectedPart: Part = {
      fileData: {
        fileUri: 'gs://bucket/file.txt',
        mimeType: 'text/plain',
      },
    };

    expect(part).toEqual(expectedPart);
  });

  it('createPartFromFunctionCall should create a function call part', () => {
    const part = createPartFromFunctionCall('func1', {
      param1: 'value1',
      param2: 'value2',
    });
    const expectedPart: Part = {
      functionCall: {
        name: 'func1',
        args: {
          param1: 'value1',
          param2: 'value2',
        },
      },
    };

    expect(part).toEqual(expectedPart);
  });

  it('createPartFromFunctionResponse should create a function response part', () => {
    const part = createPartFromFunctionResponse('id1', 'func1', {
      output: 'value1',
    });
    const expectedPart: Part = {
      functionResponse: {
        id: 'id1',
        name: 'func1',
        response: {
          output: 'value1',
        },
      },
    };

    expect(part).toEqual(expectedPart);
  });

  it('createPartFromBase64 should create an inline data part', () => {
    const part = createPartFromBase64('dGVzdA==', 'text/plain');
    const expectedPart: Part = {
      inlineData: {
        data: 'dGVzdA==',
        mimeType: 'text/plain',
      },
    };

    expect(part).toEqual(expectedPart);
  });

  it('createPartFromVideoMetadata should create a video metadata part', () => {
    const part = createPartFromVideoMetadata('0:00:01', '0:00:02');
    const expectedPart: Part = {
      videoMetadata: {
        startOffset: '0:00:01',
        endOffset: '0:00:02',
      },
    };

    expect(part).toEqual(expectedPart);
  });

  it('createPartFromCodeExecutionResult should create a code execution result part', () => {
    const part = createPartFromCodeExecutionResult(
      Outcome.OUTCOME_OK,
      'Hello world!',
    );
    const expectedPart: Part = {
      codeExecutionResult: {
        outcome: Outcome.OUTCOME_OK,
        output: 'Hello world!',
      },
    };

    expect(part).toEqual(expectedPart);
  });

  it('createPartFromExecutableCode should create an executable code part', () => {
    const part = createPartFromExecutableCode(
      'print("Hello world!")',
      Language.PYTHON,
    );
    const expectedPart: Part = {
      executableCode: {
        code: 'print("Hello world!")',
        language: Language.PYTHON,
      },
    };

    expect(part).toEqual(expectedPart);
  });
});
