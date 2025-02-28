import {Client} from '@google/genai/web';
import { useState, ChangeEvent } from 'react';
import './App.css';

export default function GenerateContentText({ apiKey } : {apiKey: string }) {
  const [prompt, setPrompt] = useState('');
  const [modelResponse, setModelResponse] = useState('');

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  }

  const handleSend = async () => {
    const client = new Client({vertexai: false, apiKey: apiKey});
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    })
    setModelResponse(response.text() ?? "Empty response");
  }

  return (
    <>
      <div className="card">
        <p>
          Prompt the model:
        </p>
        <textarea onChange={handlePromptChange} />
        <button onClick={handleSend}>Send</button>
      </div>
      <div className="card">
        {modelResponse}
      </div>
    </>
  )
}
