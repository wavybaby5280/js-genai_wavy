import {
  ContentListUnion,
  File,
  GoogleGenAI,
  createPartFromUri,
} from '@google/genai';
import {ChangeEvent, useState} from 'react';
import './App.css';

export default function UploadFile({apiKey}: {apiKey: string}) {
  const [modelResponse, setModelResponse] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // Use File type

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // Update uploaded file
      const ai = new GoogleGenAI({vertexai: false, apiKey: apiKey});
      const response = await ai.files.upload({file: event.target.files[0]});

      setUploadedFile(response);
    }
  };

  const handleDescribe = async () => {
    try {
      const ai = new GoogleGenAI({vertexai: false, apiKey: apiKey});
      const contents: ContentListUnion = ['Describe the file'];

      if (uploadedFile) {
        const resolvedFile = await uploadedFile;
        if (resolvedFile.uri && resolvedFile.mimeType) {
          const fileContent = createPartFromUri(
            resolvedFile.uri,
            resolvedFile.mimeType,
          );
          contents.push(fileContent);
        }

        let getFile = await ai.files.get({
          name: resolvedFile.name as string,
        });
        while (getFile.state === 'PROCESSING') {
          getFile = await ai.files.get({name: resolvedFile.name as string});
          console.log(getFile);
          console.log('File is still processing, retrying in 5 seconds');

          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
        if (resolvedFile.state === 'FAILED') {
          setModelResponse('File processing failed.');
          return;
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: contents,
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      setModelResponse(text ?? 'Empty response');
    } catch (error) {
      console.error('Describe error:', error);
      setModelResponse('Description failed.');
    }
  };

  return (
    <>
      <div className="card" style={{display: 'flex', alignItems: 'center'}}>
        <label style={{marginRight: '10px'}}>Upload file:</label>
        <input
          type="file"
          onChange={handleFileUpload}
          style={{marginRight: '10px'}}
        />
        <button onClick={handleDescribe}>Describe</button>
      </div>
      <div className="card">{modelResponse ?? 'Response'}</div>
    </>
  );
}
