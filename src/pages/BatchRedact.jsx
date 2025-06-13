import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function BatchRedact() {
  const [termsToRedact, setTermsToRedact] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [outputZipFilename, setOutputZipFilename] = useState('redacted_pdfs.zip');

  const handleBatchRedact = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a ZIP file containing PDFs.');
      return;
    }
    const zipFile = files[0];

    const termsArray = termsToRedact.split(',').map(term => term.trim()).filter(term => term !== '');
    if (termsArray.length === 0) {
      setResponseMessage('Please enter terms to redact.');
      return;
    }

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('zip_file', zipFile);
    formData.append('terms_to_redact_json', JSON.stringify(termsArray));
    formData.append('output_zip_filename', outputZipFilename);

    try {
      const response = await fetch(`${BACKEND_URL}/api/pdf/batch_redact`, {
        method: 'POST',
        body: formData,
      });

      const result = await handleApiResponse(response, outputZipFilename, response.headers.get('Content-Type'));
      if (result.success) {
        setResponseMessage(result.message);
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }

    } catch (error) {
      console.error('Error during batch redaction:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Batch Redact PDFs (ZIP)</h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload a ZIP file containing PDFs and redact sensitive information from all of them.
      </p>
      
      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="batch-redaction-terms" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Terms to Redact (comma-separated):
        </label>
        <input
          type="text"
          id="batch-redaction-terms"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g., secret, personal ID"
          value={termsToRedact}
          onChange={(e) => setTermsToRedact(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1 text-left">
          Enter words or phrases separated by commas.
        </p>

        <label htmlFor="output-zip-filename" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Output ZIP Filename:
        </label>
        <input
          type="text"
          id="output-zip-filename"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={outputZipFilename}
          onChange={(e) => setOutputZipFilename(e.target.value)}
        />
      </div>

      <FileUploader onFilesSelected={handleBatchRedact} multiple={false} accept=".zip" disabled={loading} />

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Processing ZIP file, please wait...</p>
      )}

      {responseMessage && (
        <p className={`mt-4 text-lg ${responseMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default BatchRedact;