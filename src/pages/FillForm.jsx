import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api';

function FillForm() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [formDataJson, setFormDataJson] = useState('{}'); // JSON string for form data
  const [flattenForm, setFlattenForm] = useState(true);
  const [outputFilename, setOutputFilename] = useState('filled_form.pdf');

  const handleFillForm = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a PDF form file.');
      return;
    }
    const fileToProcess = files[0];

    try {
      // Validate JSON input
      JSON.parse(formDataJson);
    } catch (e) {
      setResponseMessage('Error: Invalid JSON format for form data.');
      return;
    }

    setLoading(true);
    setResponseMessage('');

    const formData = new FormData();
    formData.append('file', fileToProcess);
    formData.append('form_data_json', formDataJson);
    formData.append('flatten_form', flattenForm.toString()); // Boolean as string
    formData.append('output_filename', outputFilename);

    try {
      const response = await fetch(`${BACKEND_URL}/api/pdf/fill_form`, {
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
      console.error('Error filling PDF form:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Fill PDF Form</h1>
      <p className="text-lg text-gray-600 mb-8">
        Upload a PDF form and fill its fields using JSON data, then optionally flatten it.
      </p>
      
      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="form-data-json" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Form Data (JSON):
        </label>
        <textarea
          id="form-data-json"
          rows="5"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder='{"field_name_1": "value 1", "checkbox_field": "Yes"}'
          value={formDataJson}
          onChange={(e) => setFormDataJson(e.target.value)}
        ></textarea>
        <p className="text-xs text-gray-500 mt-1 text-left">
          Enter form field names and their values as a JSON object. For checkboxes, "Yes" or "On" might work.
        </p>

        <div className="flex items-center justify-start mt-4">
          <input
            type="checkbox"
            id="flatten-form"
            className="mr-2"
            checked={flattenForm}
            onChange={(e) => setFlattenForm(e.target.checked)}
          />
          <label htmlFor="flatten-form" className="text-gray-700">Flatten Form (fields become uneditable)</label>
        </div>

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

      <FileUploader onFilesSelected={handleFillForm} multiple={false} accept=".pdf" disabled={loading} />

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

export default FillForm;