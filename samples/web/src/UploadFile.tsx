import {Client} from '@google/genai';
import { useState, ChangeEvent } from 'react';
import './App.css';

export default function UploadFile({ apiKey } : {apiKey: string }) {
  const [prompt, setPrompt] = useState('');
  const [modelResponse, setModelResponse] = useState('');

  const handleFileUpload = (event: ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Not implemented");
  }

  return (
    <>
      <div className="card">
        <label>
          Upload file:
        </label>
        <input type="file" onChange={handleFileUpload} />
      </div>
    </>
  )
}
