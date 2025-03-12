import {GoogleGenAI} from '@google/genai';
import { useState, ChangeEvent } from 'react';
import './App.css';

export default function GenerateContentText({ apiKey } : {apiKey: string }) {
  const [prompt, setPrompt] = useState('');
  const [modelResponse, setModelResponse] = useState('');

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  }

  const handleSend = async () => {
    const ai = new GoogleGenAI({vertexai: false, apiKey: apiKey});
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    setModelResponse(response.text ?? "Empty response");
  }

  return (
    <>
      <div className="card">
        <h2 className="card-title">Text generation sample</h2>
        <form>
          <label htmlFor="prompt" className="form-label">Prompt:</label>
          <textarea className="form-control"  id="prompt" onChange={handlePromptChange} />
          <button type="button" className="btn btn-primary" onClick={handleSend}>Send</button>
          <div className="card">
            {modelResponse}
          </div>
        </form>
      </div>
    </>
  )
}
