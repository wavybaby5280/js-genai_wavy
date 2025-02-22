/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ApiClient} from '../../src/_api_client';
import {FakeAuth} from '../../src/_fake_auth';
import {tContents, tModel, tSchema, tSpeechConfig, tTool} from '../../src/_transformers';

describe('tModel', () => {
  it('empty string', () => {
    expect(() => {
      tModel(new ApiClient({auth: new FakeAuth()}), '');
    }).toThrowError('model is required');
  });
  it('returns model name for MLDev starting with models', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth()}),
        'models/gemini-1.5-flash-exp',
      ),
    ).toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns model name for MLDev starting with tunedModels', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth()}),
        'tunedModels/gemini-1.5-flash-exp',
      ),
    ).toEqual('tunedModels/gemini-1.5-flash-exp');
  });
  it('returns model prefix for MLDev', () => {
    expect(
      tModel(new ApiClient({auth: new FakeAuth()}), 'gemini-1.5-flash-exp'),
    ).toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with publishers', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), vertexai: true}),
        'publishers/gemini-1.5-flash-exp',
      ),
    ).toEqual('publishers/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with projects', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), vertexai: true}),
        'projects/gemini-1.5-flash-exp',
      ),
    ).toEqual('projects/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with models', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), vertexai: true}),
        'models/gemini-1.5-flash-exp',
      ),
    ).toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns publisher prefix for Vertex with slash', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), vertexai: true}),
        'google/gemini-1.5-flash-exp',
      ),
    ).toEqual('publishers/google/models/gemini-1.5-flash-exp');
  });
  it('returns publisher prefix for Vertex', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), vertexai: true}),
        'gemini-1.5-flash-exp',
      ),
    ).toEqual('publishers/google/models/gemini-1.5-flash-exp');
  });
});

describe('tSpeechConfig', () => {
  it('string to speechConfig', () => {
    const speechConfig = {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'voice-name',
        },
      },
    };
    expect(
      tSpeechConfig(new ApiClient({auth: new FakeAuth()}), 'voice-name'),
    ).toEqual(speechConfig);
  });
});

describe('tTool', () => {
  it('no change', () => {
    const tool = {functionDeclarations: [{name: 'function-name'}]};
    expect(tTool(new ApiClient({auth: new FakeAuth()}), tool)).toEqual(tool);
  });
});

describe('tSchema', () => {
  it('no change', () => {
    const schema = {title: 'title'};
    expect(
      tSchema(new ApiClient({auth: new FakeAuth(), vertexai: true}), schema),
    ).toEqual(schema);
  });
  it('removes title for MLDev', () => {
    const schema = {title: 'title'};
    expect(
      tSchema(new ApiClient({auth: new FakeAuth(), vertexai: false}), schema),
    ).toEqual({});
  });
  it('throws error if default value is present for MLDev', () => {
    const schema = {default: 'default'};
    expect(() => {
      tSchema(new ApiClient({auth: new FakeAuth(), vertexai: false}), schema);
    }).toThrowError(
      'Default value is not supported in the response schema for the Gemini API.',
    );
  });
  it('throws error if anyOf value is present for MLDev', () => {
    const schema = {anyOf: []};
    expect(() => {
      tSchema(new ApiClient({auth: new FakeAuth(), vertexai: false}), schema);
    }).toThrowError(
      'AnyOf is not supported in the response schema for the Gemini API.',
    );
  });
  it('processes anyOf', () => {
    const schema = {
      title: 'title',
      anyOf: [{title: 'subSchemaTitle1'}, {title: 'subSchemaTitle2'}],
    };
    expect(
      tSchema(new ApiClient({auth: new FakeAuth(), vertexai: true}), schema),
    ).toEqual(schema);
  });
});

describe('tContents', () => {
  it('contents null', () => {
    expect(() => {
      // @ts-expect-error: escaping to test error
      tContents(new ApiClient({auth: new FakeAuth()}), null);
    }).toThrowError('contents are required');
  });

  it('contents empty list', () => {
    expect(() => {
      tContents(new ApiClient({auth: new FakeAuth()}), []);
    }).toThrowError('contents are required');
  });

  it('single content', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth()}),
        {parts: [{text: 'What is your name?'}]},
      ),
    ).toEqual([{parts: [{text: 'What is your name?'}]}]);
  })

  it('single part', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth()}),
        {text: 'What is your name?'},
      ),
    ).toEqual([{role: 'user', parts: [{text: 'What is your name?'}]}]);
  });

  it('single string', () => {
    expect(
      tContents(new ApiClient({auth: new FakeAuth()}), 'What is your name?'),
    ).toEqual([{role: 'user', parts: [{text: 'What is your name?'}]}]);
  });

  it('list of parts and strings', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth()}),
        [
          'What is your name?',
          {text: 'How do I call you?'},
          'How is the weather?',
        ],
      ),
    ).toEqual([
      {
        role: 'user',
        parts: [
          {text: 'What is your name?'},
          {text: 'How do I call you?'},
          {text: 'How is the weather?'}
        ]
      },
    ]);
  });

  it('list of contents', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth()}),
        [
          {parts: [{text: 'What is your name?'}]},
          {role: 'user', parts: [{text: 'How do I call you?'}]},
        ],
      ),
    ).toEqual([
      {parts: [{text: 'What is your name?'}]},
      {
        role: 'user',
        parts: [
          {text: 'How do I call you?'},
        ],
      },
    ]);
  });

  it('list of part union in list', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth()}),
        [
          {parts: [{text: 'What is your name?'}]},
          {text: 'How do I call you?'},
          'How is the weather?',
          [
            'Why is the sky blue?',
            {text: 'How high is the sky?'},
          ],
          'Is moon a sphere?',
          {text: 'What is the other side of the moon?'},
        ],
      )
    ).toEqual([
      {parts: [{text: 'What is your name?'}]},
      {
        role: 'user',
        parts: [
          {text: 'How do I call you?'},
          {text: 'How is the weather?'},
        ]
      },
      {
        role: 'user',
        parts: [
          {text: 'Why is the sky blue?'},
          {text: 'How high is the sky?'},
        ]
      },
      {
        role: 'user',
        parts: [
          {text: 'Is moon a sphere?'},
          {text: 'What is the other side of the moon?'},
        ],
      }
    ]);
  });

  it('unsupported type in list', () => {
    expect(() => {
      // @ts-expect-error: escaping to test error
      tContents(new ApiClient({auth: new FakeAuth()}), [123]);
    }).toThrowError('Unsupported content type: number');
  });

  it('Unsupported single type', () => {
    expect(() => {
      // @ts-expect-error: escaping to test error
      tContents(new ApiClient({auth: new FakeAuth()}), 123);
    }).toThrowError('Unsupported part type: number');
  });
});
