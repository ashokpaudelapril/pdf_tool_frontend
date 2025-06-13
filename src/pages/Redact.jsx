import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function Redact() {
  const [termsToRedact, setTermsToRedact] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [outputFilename, setOutputFilename] = useState('redacted_document.pdf');

  const handleRedact = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a PDF file.');
      return;
    }
    const fileToRedact = files[0];

    const termsArray = termsToRedact.split(',').map(term => term.trim()).filter(term => term !== '');
    if (termsArray.length === 0) {
      setResponseMessage('Please enter terms to redact.');
      return;
    }

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', fileToRedact);
    formData.append('terms_to_redact_json', JSON.stringify(termsArray)); // Send as JSON string
    formData.append('output_filename', outputFilename);

    try {
      const response = await fetch(`${BACKEND_URL}/api/pdf/redact`, {
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
      console.error('Error redacting PDF:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Redact PDF Content</h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload a PDF and specify terms to permanently remove sensitive information.
      </p>
      
      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="redaction-terms" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Terms to Redact (comma-separated):
        </label>
        <input
          type="text"
          id="redaction-terms"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g., sensitive data, email@example.com"
          value={termsToRedact}
          onChange={(e) => setTermsToRedact(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1 text-left">
          Enter words or phrases separated by commas.
        </p>

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
      </div>

      <FileUploader onFilesSelected={handleRedact} multiple={false} accept=".pdf" disabled={loading} />

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

export default Redact;