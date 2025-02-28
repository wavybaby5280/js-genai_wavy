import { useState, ChangeEvent } from 'react'
import './App.css'
import GenerateContentText from './GenerateContentText';

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
      <GenerateContentText apiKey={apiKey} />
    </>
  )
}

export default App
