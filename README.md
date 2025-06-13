# 🌐 Frontend (React)

This part of the repository contains the React-based user interface for the Secure PDF Toolkit. It allows users to easily interact with the FastAPI backend, upload files, select operations, and view or download the processed results.

## Technologies Used

- **React**: A popular JavaScript library for building dynamic and interactive user interfaces.
- **Vite**: A next-generation frontend tooling that provides an extremely fast development server and optimized build process.
- **Tailwind CSS**: A utility-first CSS framework used for rapidly building custom designs directly in your JSX, ensuring a responsive and appealing user interface.
- **React Router DOM**: The standard library for client-side routing in React applications, enabling seamless navigation between different tool pages without full page reloads.

## Setup (Local Development)

To get the frontend running on your local machine:

### Navigate to the frontend directory:
If you are in the project's root directory, execute:
```bash
cd frontend
```

### Install Node.js dependencies:
This command will install all the required npm packages listed in package.json:
```bash
npm install
# Alternatively, if you use Yarn:
yarn install
```

### Configure Backend URL:
Open the file `frontend/src/config.js` and verify that the `BACKEND_URL` constant points to your running backend instance.

For local development, it should typically be:
```js
// frontend/src/config.js
export const BACKEND_URL = 'http://localhost:8000'; // Adjust if your backend runs on a different port
```

When you deploy your frontend, this `BACKEND_URL` should be updated to point to your live, deployed backend API (e.g., `https://web-production-111e.up.railway.app`).

## Running the Frontend (Local Development)

Ensure you are in the frontend directory in your terminal.

Start the Vite development server:
```bash
npm run dev
# Alternatively, if you use Yarn:
yarn dev
```

The frontend application will typically open automatically in your web browser at `http://localhost:3000` (or another available port).

## Frontend Structure

- **src/App.jsx**: This is the main React component responsible for setting up the application's routing using React Router DOM. It also defines the global navigation structure with links to various PDF tools.
- **src/pages/**: This directory contains all the individual page components, each dedicated to a specific PDF manipulation or conversion tool. Examples include `Merge.jsx`, `Split.jsx`, `Redact.jsx`, the `Home.jsx` dashboard, `PdfToDocx.jsx`, and many more.
- **src/components/FileUploader.jsx**: A reusable React component that provides a standardized interface for users to select and upload files to the backend.
- **src/utils/api.js**: A utility file containing the `handleApiResponse` helper function. This function standardizes how the frontend processes responses from the backend API, including managing file downloads and preparing file URLs for direct display on the webpage.
- **src/config.js**: A simple configuration file primarily used to store the `BACKEND_URL`, making it easy to switch between development and production backend endpoints.
- **src/index.css**: This file contains the primary Tailwind CSS imports and any custom global CSS styles applied throughout the application.

## Key Frontend Features

- **Dynamic Home Page**: The application's landing page (`Home.jsx`) features a visually engaging grid layout, presenting each PDF tool with a clear name and a brief description, making it easy for users to discover functionality.
- **Responsive Navigation**: The top navigation bar is designed with appealing red-themed buttons that include improved spacing and interactive hover effects, ensuring a consistent and user-friendly experience across different screen sizes.
- **Direct File Display**: For supported output formats (such as PDFs, common image types like PNG/JPG, and plain text files), the processed results from the backend are displayed directly within the web page, offering immediate visual feedback to the user.
- **Dedicated Download Option**: After a file has been processed and optionally displayed, a clear "Download" button appears, allowing users to save the output file(s) to their local machine.
- **Robust Error Handling**: The frontend incorporates user-friendly error messages for various scenarios, including API communication failures, server errors, and input validation issues, guiding users when something goes wrong.
