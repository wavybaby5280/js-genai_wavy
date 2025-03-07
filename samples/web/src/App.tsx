import { useState, ChangeEvent } from 'react'
import './App.css'
import GenerateContentText from './GenerateContentText';
import UploadFile from './UploadFile';

function App() {
  const [apiKey, setApiKey] = useState('');

  const handleKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  }

  return (
    <>
      <h1>Google GenAI TypeScript SDK demo</h1>
      <div className="card">
        <span>API key: </span>
        <input type='password' onChange={handleKeyChange} value={apiKey} />
      </div>
      <h2>Text generation sample</h2>
      <GenerateContentText apiKey={apiKey} />
      <h2>File upload sample</h2>
      <UploadFile apiKey={apiKey} />
    </>
  )
}

export default App
