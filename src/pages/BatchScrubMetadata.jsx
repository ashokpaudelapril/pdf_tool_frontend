import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function BatchScrubMetadata() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [outputZipFilename, setOutputZipFilename] = useState('scrubbed_pdfs.zip');

  const handleBatchScrubMetadata = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a ZIP file containing PDFs.');
      return;
    }
    const zipFile = files[0];

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('zip_file', zipFile);
    formData.append('output_zip_filename', outputZipFilename);

    try {
      const response = await fetch(`${BACKEND_URL}/api/pdf/batch_scrub_metadata`, {
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
      console.error('Error during batch metadata scrubbing:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Batch Scrub PDF Metadata (ZIP)</h1>
      <p className="text-lg text-gray-600 mb-8">
        Remove all metadata from multiple PDF files contained in a ZIP archive.
      </p>
      
      <div className="mb-6 max-w-xl mx-auto">
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

      <FileUploader onFilesSelected={handleBatchScrubMetadata} multiple={false} accept=".zip" disabled={loading} />

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

export default BatchScrubMetadata;
