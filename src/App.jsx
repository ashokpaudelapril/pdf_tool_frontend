// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Merge from './pages/Merge';
import Split from './pages/Split';
import Redact from './pages/Redact';
import OCRTranslate from './pages/OCRTranslate';
import ScrubMetadata from './pages/ScrubMetadata';
import FillForm from './pages/FillForm';
import BatchRedact from './pages/BatchRedact';
import BatchOCRTranslate from './pages/BatchOCRTranslate';
import BatchScrubMetadata from './pages/BatchScrubMetadata';
import PdfToOther from './pages/PdfToOther'; 
import OtherToPdf from './pages/OtherToPdf'; 
import PptxToPdf from './pages/PptxToPdf'; // Existing from previous step
import PdfToPptx from './pages/PdfToPptx'; // Existing from previous step

// New placeholder pages for direct DOCX conversion
import PdfToDocx from './pages/PdfToDocx'; 
import DocxToPdf from './pages/DocxToPdf'; 

function App() {
  const navLinkClasses = "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap text-sm lg:text-base";
  const navListItemClasses = "mr-2 mb-2 lg:mr-4 lg:mb-0"; // Added margin for spacing

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">

        <main className="flex-grow container mx-auto p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/merge" element={<Merge />} />
            <Route path="/split" element={<Split />} />
            <Route path="/redact" element={<Redact />} />
            <Route path="/ocr-translate" element={<OCRTranslate />} />
            <Route path="/scrub-metadata" element={<ScrubMetadata />} />
            <Route path="/fill-form" element={<FillForm />} />
            <Route path="/batch-redact" element={<BatchRedact />} />
            <Route path="/batch-ocr-translate" element={<BatchOCRTranslate />} />
            <Route path="/batch-scrub-metadata" element={<BatchScrubMetadata />} />
            <Route path="/pdf-to-other" element={<PdfToOther />} />
            <Route path="/other-to-pdf" element={<OtherToPdf />} />
            <Route path="/pptx-to-pdf" element={<PptxToPdf />} />
            <Route path="/pdf-to-pptx" element={<PdfToPptx />} />
            <Route path="/pdf-to-docx" element={<PdfToDocx />} /> {/* New */}
            <Route path="/docx-to-pdf" element={<DocxToPdf />} /> {/* New */}
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
          <p>&copy; {new Date().getFullYear()} Secure PDF Toolkit. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;