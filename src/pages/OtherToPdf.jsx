// frontend/src/pages/OtherToPdf.jsx
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function OtherToPdf() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [conversionType, setConversionType] = useState('images'); // 'images', 'text', 'csv', 'docx', 'pptx', 'xlsx'
  const [outputFilename, setOutputFilename] = useState('converted_to_pdf.pdf');

  const handleConversion = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select file(s) for conversion.');
      return;
    }

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    let endpoint = '';

    // If converting multiple images, use the specific images_to_pdf endpoint
    if (conversionType === 'images') {
      endpoint = `${BACKEND_URL}/api/convert/images_to_pdf`;
      files.forEach(file => {
        formData.append('files', file);
      });
    } else {
      // For single file conversions (text, csv, docx, pptx, xlsx, etc.), use generic any_to_pdf
      endpoint = `${BACKEND_URL}/api/convert/any_to_pdf`;
      formData.append('file', files[0]);
    }
    
    formData.append('output_filename', outputFilename);

    try {
      const response = await fetch(endpoint, {
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
      console.error('Error during conversion to PDF:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getFileUploaderProps = () => {
    if (conversionType === 'images') {
      return { multiple: true, accept: "image/jpeg,image/png" };
    } else if (conversionType === 'text') {
      return { multiple: false, accept: ".txt" };
    } else if (conversionType === 'csv') {
      return { multiple: false, accept: ".csv" };
    } else if (conversionType === 'docx') {
      return { multiple: false, accept: ".docx,.doc" };
    } else if (conversionType === 'pptx') {
      return { multiple: false, accept: ".pptx,.ppt" };
    } else if (conversionType === 'xlsx') {
        return { multiple: false, accept: ".xlsx,.xls" };
    }
    return { multiple: false, accept: "*" }; // Fallback
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Convert Other Formats To PDF</h1>
      <p className="text-lg text-gray-600 mb-8">
        Convert various file types into a PDF document. Requires LibreOffice on the server for
        office documents (DOCX, PPTX, XLSX).
      </p>

      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="conversion-type" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Convert From:
        </label>
        <select
          id="conversion-type"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={conversionType}
          onChange={(e) => {
            setConversionType(e.target.value);
            setOutputFilename('converted_to_pdf.pdf'); // Reset output filename
          }}
        >
          <option value="images">Images (JPG/PNG)</option>
          <option value="text">Text (TXT)</option>
          <option value="csv">CSV</option>
          <option value="docx">Word (DOCX/DOC)</option>
          <option value="pptx">PowerPoint (PPTX/PPT)</option>
          <option value="xlsx">Excel (XLSX/XLS)</option>
          {/* Add more as needed and supported by LibreOffice */}
        </select>

        <label htmlFor="output-filename" className="block text-gray-700 text-sm font-bold mb-2 text-left mt-4">
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

      <FileUploader onFilesSelected={handleConversion} disabled={loading} {...getFileUploaderProps()} />

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Converting to PDF, please wait...</p>
      )}

      {responseMessage && (
        <p className={`mt-4 text-lg ${responseMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default OtherToPdf;