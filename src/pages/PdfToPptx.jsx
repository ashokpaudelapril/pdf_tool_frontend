// frontend/src/pages/PdfToPptx.jsx
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function PdfToPptx() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [outputFilename, setOutputFilename] = useState('converted_slides.pptx');

  const handlePdfToPptx = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a PDF file.');
      return;
    }
    const fileToConvert = files[0];

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', fileToConvert);
    formData.append('output_filename', outputFilename);

    try {
      const response = await fetch(`${BACKEND_URL}/api/convert/pdf_to_pptx`, {
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
      console.error('Error converting PDF to PPTX:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Convert PDF To PowerPoint (PPTX)</h1>
      <p className="text-lg text-gray-600 mb-8">
        Convert your PDF document into a PowerPoint presentation.
        <br/>
        <span className="font-bold text-red-700">Note:</span> High-fidelity conversion from PDF to editable PPTX is
        extremely challenging and results may vary significantly. Requires LibreOffice on the server.
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

      <FileUploader onFilesSelected={handlePdfToPptx} multiple={false} accept=".pdf" disabled={loading} />

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

export default PdfToPptx;