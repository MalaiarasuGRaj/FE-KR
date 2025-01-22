import React, { useState, useEffect } from "react";
import AIChat from "./chat";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative rounded-lg w-full max-w-8xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-grey-700 bg-gradient-to-r from-blue-300 via-purple-200 to-blue-300 rounded-full p-1 hover:bg-gray-700 hover:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const AIChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-6xl bg-white shadow-lg shadow-gray-500/50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Empower Your Data with IQRA AI</h2>
        <p className="text-lg text-gray-600 mb-6">
          Provides users with concise summaries, key insights, and actionable recommendations, empowering decision-makers to efficiently extract value from their data.
        </p>
        <div className="flex justify-between gap-2">
          <div className="feature-container">
            <h3 className="feature-title">Enterprise Knowledge</h3>
            <p className="feature-description">
              Enables users to ask questions about content and receive answers from uploaded data.
            </p>
          </div>
          <div className="feature-container">
            <h3 className="feature-title">Document Summarization</h3>
            <p className="feature-description">
              Delivers accurate and contextually relevant summaries of the uploaded documents.
            </p>
          </div>
          <div className="feature-container">
            <h3 className="feature-title">Multi-format Compatibility</h3>
            <p className="feature-description">
              Support for processing various file formats including PDF, DOCX, CSV, Excel, PPT, and TXT files.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
            />
          </svg>
          Launch IQRA AI
        </button>

        <button
          onClick={() => alert("The 'Know More' feature is currently under development. Stay tuned for updates!")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M20 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
            />
          </svg>
          Know More
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <AIChat onClose={() => setIsOpen(false)} />
        </div>
      </Modal>
    </div>
  );
};

function App() {
  return (
    <div className="app-container relative">
      {/* Fixed Logo Section */}
      <img
        src="logo1.png" // Replace with the actual path to your logo
        alt="Company Logo"
        className="fixed-logo"
        onClick={() => window.open("https://www.digitalt3.com", "_blank")}
      />

      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="/BG-Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Modal Component */}
      <AIChatModal />
    </div>
  );
}

export default App;
