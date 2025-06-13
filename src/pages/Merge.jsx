import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function Merge() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [outputFilename, setOutputFilename] = useState('merged_document.pdf');
  const [encryptOutput, setEncryptOutput] = useState(false);
  const [password, setPassword] = useState('');

  const handleMerge = async (files) => {
    if (files.length < 2) {
      setResponseMessage('Please select at least two PDF files to merge.');
      return;
    }

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file); // 'files' matches FastAPI's List[UploadFile]
    });
    formData.append('output_filename', outputFilename);
    formData.append('encrypt_output', encryptOutput.toString()); // Boolean as string
    if (encryptOutput && password) {
      formData.append('password', password);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/pdf/merge`, {
        method: 'POST',
        body: formData,
      });

      const result = await handleApiResponse(response, outputFilename, response.headers.get('Content-Type'));
      if (result.success) {
        setResponseMessage(result.message);
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }

    } catch (error) {
      console.error('Error merging PDFs:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Merge PDF Files</h1>
      <p className="text-lg text-gray-600 mb-8">
        Select multiple PDF files to combine them into a single document.
      </p>

      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="output-filename" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Output Filename:
        </label>
        <input
          type="text"
          id="output-filename"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={outputFilename}
          onChange={(e) => setOutputFilename(e.target.value)}
        />
        
        <div className="flex items-center justify-start mt-4">
          <input
            type="checkbox"
            id="encrypt-output"
            className="mr-2"
            checked={encryptOutput}
            onChange={(e) => setEncryptOutput(e.target.checked)}
          />
          <label htmlFor="encrypt-output" className="text-gray-700">Encrypt Output PDF (Backend Placeholder)</label>
        </div>
        
        {encryptOutput && (
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
            placeholder="Enter password for encryption"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </div>

      <FileUploader onFilesSelected={handleMerge} multiple={true} accept=".pdf" disabled={loading} />

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Processing PDF, please wait...</p>
      )}

      {responseMessage && (
        <p className={`mt-4 text-lg ${responseMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default Merge;