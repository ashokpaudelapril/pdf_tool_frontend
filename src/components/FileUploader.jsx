import React, { useRef } from 'react';

function FileUploader({ onFilesSelected, multiple = false, accept = "*", disabled = false }) { // Add disabled prop
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
      // Clear the input after selection to allow re-uploading the same file
      event.target.value = ''; 
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 p-8 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'} transition duration-200 ease-in-out max-w-xl mx-auto`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
        className="hidden"
        disabled={disabled} // Apply disabled prop
      />
      <button
        onClick={() => !disabled && fileInputRef.current.click()} // Prevent click if disabled
        className={`font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
        disabled={disabled} // Apply disabled prop to button
      >
        {multiple ? "Select PDF Files" : "Select PDF File"}
      </button>
      <p className="mt-4 text-gray-600">
        {multiple ? "Drag & drop your PDFs here, or click to browse." : "Drag & drop your PDF here, or click to browse."}
      </p>
      {accept === ".pdf" && <p className="text-sm text-gray-500 mt-1">Only PDF files are allowed.</p>}
      {accept === ".zip" && <p className="text-sm text-gray-500 mt-1">Only ZIP archives are allowed.</p>}
    </div>
  );
}

export default FileUploader;