// frontend/src/pages/PptxToPdf.jsx
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function PptxToPdf() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [outputFilename, setOutputFilename] = useState('presentation.pdf');

  const handlePptxToPdf = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a PPTX file.');
      return;
    }
    const fileToConvert = files[0];

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', fileToConvert);
    formData.append('output_filename', outputFilename);

    try {
      const response = await fetch(`${BACKEND_URL}/api/convert/pptx_to_pdf`, {
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
      console.error('Error converting PPTX to PDF:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Convert PowerPoint (PPTX) To PDF</h1>
      <p className="text-lg text-gray-600 mb-8">
        Convert your PowerPoint presentation into a PDF document. Requires LibreOffice on the server.
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
      </div>

      <FileUploader onFilesSelected={handlePptxToPdf} multiple={false} accept=".pptx,.ppt" disabled={loading} />

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Converting, please wait...</p>
      )}

      {responseMessage && (
        <p className={`mt-4 text-lg ${responseMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default PptxToPdf;