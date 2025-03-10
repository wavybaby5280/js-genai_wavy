import {File, GoogleGenAI, Part} from '@google/genai';
import {ChangeEvent, useState} from 'react';
import './App.css';

export default function UploadFile({apiKey}: {apiKey: string}) {
  const [modelResponse, setModelResponse] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // Use File type

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // Update uploaded file
      const client = new GoogleGenAI({vertexai: false, apiKey: apiKey});
      const response = client.files.upload(event.target.files[0]);
      setUploadedFile(response);
    }
  };

  const handleDescribe = async () => {
    try {
      const client = new GoogleGenAI({vertexai: false, apiKey: apiKey});
      const contents = ['Describe the file'];

      if (uploadedFile) {
        const resolvedFile = await uploadedFile;
        const fileContent: Part = {
          fileData: {
            fileUri: resolvedFile.uri,
            mimeType: resolvedFile.mimeType,
          },
        };
        contents.push(fileContent);

        let getFile = await client.files.get({
          name: resolvedFile.name as string,
        });
        while (getFile.state === 'PROCESSING') {
          getFile = await client.files.get({name: resolvedFile.name as string});
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

      const response = await client.models.generateContent({
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
