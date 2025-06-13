// frontend/src/pages/PdfToOther.jsx
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function PdfToOther() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [conversionType, setConversionType] = useState('images'); // 'images', 'text', 'docx', 'pptx', 'xlsx', 'html' etc.
  const [outputFormat, setOutputFormat] = useState('png'); // for images
  const [outputFilename, setOutputFilename] = useState('converted_output'); // Base name, extension will be added

  const handleConversion = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a PDF file.');
      return;
    }
    const fileToConvert = files[0];

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', fileToConvert);

    let endpoint = '';
    let finalOutputFilename = '';
    let expectedMediaType = '';

    // Handle generic "pdf_to_any" for various formats
    if (['docx', 'pptx', 'xlsx', 'txt', 'html', 'rtf', 'csv', 'odt', 'ods', 'odp'].includes(conversionType)) {
      endpoint = `${BACKEND_URL}/api/convert/pdf_to_any`;
      formData.append('target_format', conversionType); // e.g., 'docx', 'pptx'
      finalOutputFilename = `${outputFilename}.${conversionType}`; // Use desired extension
      expectedMediaType = `application/${conversionType}`; // A generic guess for media type
      if (conversionType === 'txt') expectedMediaType = 'text/plain';
      if (conversionType === 'csv') expectedMediaType = 'text/csv';
      if (conversionType === 'html') expectedMediaType = 'text/html';
      if (conversionType === 'docx') expectedMediaType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (conversionType === 'pptx') expectedMediaType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      if (conversionType === 'xlsx') expectedMediaType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    } else if (conversionType === 'images') {
        endpoint = `${BACKEND_URL}/api/convert/pdf_to_images`;
        formData.append('output_format', outputFormat);
        finalOutputFilename = `${outputFilename}_images.zip`;
        formData.append('output_zip_filename', finalOutputFilename);
        expectedMediaType = 'application/zip';
    } else {
      setResponseMessage('Invalid conversion type selected.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await handleApiResponse(response, finalOutputFilename, expectedMediaType);
      if (result.success) {
        setResponseMessage(result.message);
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }

    } catch (error) {
      console.error('Error during PDF conversion:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Convert PDF To Other Formats</h1>
      <p className="text-lg text-gray-600 mb-8">
        Convert your PDF document into various formats. Quality for editable formats like DOCX/PPTX
        can vary and requires LibreOffice on the server.
      </p>

      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="conversion-type" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Convert To:
        </label>
        <select
          id="conversion-type"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={conversionType}
          onChange={(e) => {
            setConversionType(e.target.value);
            // Reset output filename suggestion based on new type
            const newType = e.target.value;
            if (newType === 'images') {
              setOutputFilename('converted_images');
            } else if (newType === 'text') {
              setOutputFilename('extracted_text');
            } else if (['docx', 'pptx', 'xlsx', 'html', 'rtf', 'csv'].includes(newType)) {
                setOutputFilename(`converted_document`);
            } else {
                setOutputFilename('converted_output');
            }
          }}
        >
          <option value="images">Images (PNG/JPG)</option>
          <option value="text">Text (TXT)</option>
          <option value="pptx">PowerPoint (PPTX) - Experimental</option>
          <option value="docx">Word (DOCX) - Experimental</option>
          <option value="xlsx">Excel (XLSX) - Experimental</option>
          <option value="html">HTML - Experimental</option>
          {/* Add more as needed and supported by LibreOffice */}
        </select>

        {conversionType === 'images' && (
          <div>
            <label htmlFor="output-image-format" className="block text-gray-700 text-sm font-bold mb-2 text-left mt-4">
              Image Format:
            </label>
            <select
              id="output-image-format"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
        )}

        <label htmlFor="output-filename" className="block text-gray-700 text-sm font-bold mb-2 text-left mt-4">
          Output Base Filename:
        </label>
        <input
          type="text"
          id="output-filename"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={outputFilename}
          onChange={(e) => setOutputFilename(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1 text-left">
          {conversionType === 'images' ? 'Will be a ZIP of images.' : `Extension will be .${conversionType}`}
        </p>
      </div>

      <FileUploader onFilesSelected={handleConversion} multiple={false} accept=".pdf" disabled={loading} />

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Converting PDF, please wait...</p>
      )}

      {responseMessage && (
        <p className={`mt-4 text-lg ${responseMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default PdfToOther;