// frontend/src/pages/Split.jsx
import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import { BACKEND_URL } from '../config';
import { handleApiResponse } from '../utils/api'; // Use our updated API helper

function Split() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [outputFilename, setOutputFilename] = useState('split_output.zip'); // Default for split
  const [pageNumbers, setPageNumbers] = useState('');

  // New state variables for displaying the file
  const [displayedFileUrl, setDisplayedFileUrl] = useState(null);
  const [displayedFileType, setDisplayedFileType] = useState(null);
  const [displayedFileName, setDisplayedFileName] = useState('');


  // Effect hook for cleaning up Blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      // This cleanup runs when the component unmounts OR when displayedFileUrl changes
      // If the URL is a blob: URL, revoke it. External URLs (like S3) do not need revoking.
      if (displayedFileUrl && displayedFileUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(displayedFileUrl);
      }
    };
  }, [displayedFileUrl]); // Re-run this effect when displayedFileUrl changes

  const handleSplit = async (files) => {
    if (files.length === 0) {
      setResponseMessage('Please select a PDF file.');
      return;
    }
    if (!pageNumbers.trim()) {
      setResponseMessage('Please specify page numbers/ranges.');
      return;
    }

    const fileToSplit = files[0];

    setLoading(true);
    setResponseMessage('');
    setDisplayedFileUrl(null); // Clear any previous display
    setDisplayedFileType(null);
    setDisplayedFileName('');

    const formData = new FormData();
    formData.append('file', fileToSplit);
    formData.append('page_numbers', pageNumbers);
    // Remove .zip from prefix as backend will add the appropriate extension(s)
    formData.append('output_filename_prefix', outputFilename.replace(/\.zip$/i, '')); 

    try {
      const response = await fetch(`${BACKEND_URL}/api/pdf/split`, {
        method: 'POST',
        body: formData,
      });

      // Split endpoint usually returns a ZIP of PDFs/images, so expect application/zip
      const result = await handleApiResponse(response, outputFilename, 'application/zip'); 

      if (result.success) {
        setResponseMessage(result.message);
        if (result.fileUrl && result.fileType) {
            setDisplayedFileUrl(result.fileUrl);
            setDisplayedFileType(result.fileType);
            // Use outputFilename as the display name, or parse from result if backend provides
            setDisplayedFileName(outputFilename); 
        }
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }

    } catch (error) {
      console.error('Error splitting PDF:', error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the explicit download button click
  const handleDownloadDisplayedFile = () => {
    if (displayedFileUrl) {
      const a = document.createElement('a'); // Create a temporary anchor element
      a.href = displayedFileUrl;             // Set its href to the file URL
      a.download = displayedFileName || 'download'; // Use the displayed filename or a default
      document.body.appendChild(a);          // Append it to the body (briefly)
      a.click();                             // Programmatically click it to trigger download
      a.remove();                            // Remove the temporary element
      // For blob URLs, the useEffect cleanup will handle revoking when needed.
    }
  };


  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Split PDF</h1>
      <p className="text-lg text-gray-600 mb-8">
        Extract specific pages or page ranges from your PDF document. This tool will usually return a ZIP file containing the split pages.
      </p>

      <div className="mb-6 max-w-xl mx-auto space-y-4">
        <label htmlFor="page-numbers" className="block text-gray-700 text-sm font-bold mb-2 text-left">
          Pages to Extract (e.g., 1,3-5,8):
        </label>
        <input
          type="text"
          id="page-numbers"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={pageNumbers}
          onChange={(e) => setPageNumbers(e.target.value)}
          placeholder="e.g., 1, 3-5, 8"
        />

        <label htmlFor="output-filename" className="block text-gray-700 text-sm font-bold mb-2 text-left mt-4">
          Output Filename (for ZIP):
        </label>
        <input
          type="text"
          id="output-filename"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={outputFilename}
          onChange={(e) => setOutputFilename(e.target.value)}
          placeholder="e.g., my_split_document.zip"
        />
      </div>

      <FileUploader onFilesSelected={handleSplit} multiple={false} accept=".pdf" disabled={loading} />

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Splitting PDF, please wait...</p>
      )}

      {responseMessage && (
        <p className={`mt-4 text-lg ${responseMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {responseMessage}
        </p>
      )}

      {/* --- Display Area for Processed File --- */}
      {displayedFileUrl && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-xl max-w-4xl mx-auto border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Processed File Preview:</h2>
          
          {/* Display logic based on file type */}
          {displayedFileType?.includes('application/pdf') && (
            // Note: For multi-file outputs like split (which usually returns a ZIP),
            // you might not directly display a single PDF here unless the backend
            // provides a URL to a *single* PDF from the split. If it's a ZIP,
            // the iframe won't work, and the user will rely on the download button.
            <iframe 
              src={displayedFileUrl} 
              title="PDF Preview" 
              className="w-full h-96 border rounded-md" 
              style={{ minHeight: '600px' }} // Ensure a good height for PDF viewer
            >
              This browser does not support PDFs. <a href={displayedFileUrl} download={displayedFileName}>Download the PDF</a>.
            </iframe>
          )}

          {displayedFileType?.includes('image/') && (
            <img 
              src={displayedFileUrl} 
              alt="Processed Image Preview" 
              className="max-w-full h-auto mx-auto rounded-md border border-gray-300" 
            />
          )}

          {displayedFileType?.includes('text/plain') && (
            <div className="bg-gray-100 p-4 border rounded-md text-left whitespace-pre-wrap overflow-auto max-h-96">
              <h3 className="font-semibold mb-2">Extracted Text:</h3>
              {/* For large text files, you might need to fetch the content and display it */}
              <a href={displayedFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Raw Text File</a>
            </div>
          )}
          
          {/* Fallback for file types that cannot be directly displayed (like ZIP files for Split PDF) */}
          {!displayedFileType?.includes('application/pdf') && 
           !displayedFileType?.includes('image/') && 
           !displayedFileType?.includes('text/plain') && (
            <p className="text-gray-600 text-lg">
              File processed successfully. Preview not available for this file type ({displayedFileType}).
              Please use the download button below.
            </p>
          )}

          {/* Always provide a download button */}
          <button 
            onClick={handleDownloadDisplayedFile}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 shadow-md"
          >
            Download Processed File ({displayedFileName || 'file'})
          </button>
        </div>
      )}
    </div>
  );
}

export default Split;