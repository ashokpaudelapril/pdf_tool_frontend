import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function OCRTranslate() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [ocrLanguage, setOcrLanguage] = useState('eng');
  const [translateToLanguage, setTranslateToLanguage] = useState('');
  const [outputFilename, setOutputFilename] = useState('extracted_text.txt');

  const handleOcrTranslate = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a PDF file.');
      return;
    }
    const fileToProcess = files[0];

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', fileToProcess);
    formData.append('ocr_language', ocrLanguage);
    if (translateToLanguage.trim()) {
      formData.append('translate_to_language', translateToLanguage.trim());
    }
    formData.append('output_filename', outputFilename);

    try {
      const response = await fetch(`${BACKEND_URL}/api/pdf/ocr_translate`, {
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
      console.error('Error during OCR/Translation:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">OCR & Translate PDF</h1>
      <p className="text-lg text-gray-600 mb-8">
        Extract text from a PDF using OCR, and optionally translate it.
      </p>
      
      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="ocr-lang" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          OCR Language (e.g., eng, spa):
        </label>
        <input
          type="text"
          id="ocr-lang"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="eng"
          value={ocrLanguage}
          onChange={(e) => setOcrLanguage(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1 text-left">
          Requires Tesseract language packs on the backend.
        </p>

        <label htmlFor="translate-lang" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Translate To Language (Optional, e.g., es, fr):
        </label>
        <input
          type="text"
          id="translate-lang"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Leave blank for no translation"
          value={translateToLanguage}
          onChange={(e) => setTranslateToLanguage(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1 text-left">
          Target language for translation.
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

      <FileUploader onFilesSelected={handleOcrTranslate} multiple={false} accept=".pdf" disabled={loading} />

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

export default OCRTranslate;