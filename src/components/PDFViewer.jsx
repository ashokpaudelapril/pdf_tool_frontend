import React from 'react';

function PDFViewer({ pdfUrl }) {
  if (!pdfUrl) {
    return <div className="text-center text-gray-500 py-10">No PDF to display.</div>;
  }

  return (
    <div className="my-8 border border-gray-300 rounded-lg overflow-hidden">
      <h3 className="text-xl font-semibold p-4 bg-gray-200 text-gray-800">PDF Preview</h3>
      <div className="w-full h-[600px] bg-gray-50 flex items-center justify-center">
        {/* Placeholder for an actual PDF viewer */}
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        ></iframe>
        <p className="text-gray-500 p-4">
          (A full PDF viewer component would be integrated here, possibly using a library like react-pdf or a simple iframe.)
        </p>
      </div>
    </div>
  );
}

export default PDFViewer;