import React from 'react';
import { Link } from 'react-router-dom';

function ToolSelector() {
  const tools = [
    { name: "Merge PDF", description: "Combine multiple PDF files.", path: "/merge" },
    { name: "Split PDF", description: "Divide a PDF into smaller files.", path: "/split" },
    { name: "Redact PDF", description: "Remove sensitive information from PDFs.", path: "/redact" },
    // Add more tools here
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
      {tools.map((tool) => (
        <Link to={tool.path} key={tool.name} className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer h-full flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2">{tool.name}</h2>
              <p className="text-gray-700">{tool.description}</p>
            </div>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg self-start">
              Use Tool
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ToolSelector;