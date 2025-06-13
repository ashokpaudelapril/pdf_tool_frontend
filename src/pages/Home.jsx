// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Optional: If you want to add icons, install a library like Heroicons: npm install @heroicons/react
// import { DocumentDuplicateIcon, DocumentTextIcon, LockClosedIcon, LanguageIcon, EyeSlashIcon, ClipboardDocumentListIcon, FolderIcon, ArrowRightCircleIcon, ArrowLeftCircleIcon, PresentationChartBarIcon } from '@heroicons/react/24/solid';

function Home() {
  const tools = [
    { name: 'Merge PDF', path: '/merge', description: 'Combine multiple PDF files into one single document.' /*, icon: DocumentDuplicateIcon*/ },
    { name: 'Split PDF', path: '/split', description: 'Extract specific pages or ranges from a PDF.' /*, icon: DocumentTextIcon*/ },
    { name: 'Redact PDF', path: '/redact', description: 'Securely hide or black out sensitive information in your PDF.' /*, icon: LockClosedIcon*/ },
    { name: 'OCR & Translate', path: '/ocr-translate', description: 'Recognize text in scanned PDFs and translate it to another language.' /*, icon: LanguageIcon*/ },
    { name: 'Scrub Metadata', path: '/scrub-metadata', description: 'Remove hidden authors, dates, and other sensitive metadata.' /*, icon: EyeSlashIcon*/ },
    { name: 'Fill Form', path: '/fill-form', description: 'Fill out interactive PDF forms with your data.' /*, icon: ClipboardDocumentListIcon*/ },
    { name: 'Batch Redact', path: '/batch-redact', description: 'Apply redactions to multiple PDF files at once.' /*, icon: FolderIcon*/ },
    { name: 'Batch OCR/Translate', path: '/batch-ocr-translate', description: 'Perform OCR and translation on a batch of PDF documents.' /*, icon: FolderIcon*/ },
    { name: 'Batch Scrub Metadata', path: '/batch-scrub-metadata', description: 'Clean metadata from multiple PDFs simultaneously.' /*, icon: FolderIcon*/ },
    { name: 'PDF to Other', path: '/pdf-to-other', description: 'Convert PDF files to various formats like images, text, or office documents.' /*, icon: ArrowRightCircleIcon*/ },
    { name: 'Other to PDF', path: '/other-to-pdf', description: 'Transform different file types (images, documents) into PDFs.' /*, icon: ArrowLeftCircleIcon*/ },
    { name: 'PPTX to PDF', path: '/pptx-to-pdf', description: 'Quickly convert PowerPoint presentations to PDF format.' /*, icon: PresentationChartBarIcon*/ },
    { name: 'PDF to PPTX', path: '/pdf-to-pptx', description: 'Convert PDFs into editable PowerPoint presentations (experimental).' /*, icon: PresentationChartBarIcon*/ },
    { name: 'PDF to DOCX', path: '/pdf-to-docx', description: 'Convert PDFs into editable Word documents (experimental).' /*, icon: DocumentTextIcon*/ },
    { name: 'DOCX to PDF', path: '/docx-to-pdf', description: 'Convert Word documents to PDF format.' /*, icon: DocumentTextIcon*/ },
  ];

  return (
    <div className="text-center py-10">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6 drop-shadow-lg">
        Welcome to the <span className="text-red-600">Secure PDF Toolkit</span>
      </h1>
      <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
        Your all-in-one solution for powerful PDF manipulation, security, and conversion.
        Explore our tools below to get started.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {tools.map(tool => (
          <Link 
            key={tool.name} 
            to={tool.path} 
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-between 
                       hover:shadow-2xl transition duration-300 ease-in-out transform 
                       hover:-translate-y-1 hover:scale-102 border-b-4 border-red-600"
          >
            {/* {tool.icon && <tool.icon className="h-12 w-12 text-red-600 mb-4" />} */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{tool.name}</h2>
            <p className="text-gray-600 text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;