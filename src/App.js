// export default AIChat;
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
      {/* <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      ></div> */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative rounded-lg w-full max-w-8xl">
          {/* Close Button */}
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
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center gap-2"
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
        Chat with AI
      </button>

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
    <div className="min-h-screen flex items-center justify-center">
      <AIChatModal />
    </div>
  );
}

export default App;
