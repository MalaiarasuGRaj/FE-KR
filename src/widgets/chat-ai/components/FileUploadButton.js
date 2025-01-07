import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
const FileUploadButton = ({
  onFileSelect,
  acceptedFileTypes = "*",
  maxFileSize = 5242880, // 5MB default
  disabled = false,
}) => {
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const validateFile = (file) => {
    if (!file) return "Please select a file";

    if (
      acceptedFileTypes !== "*" &&
      !acceptedFileTypes
        .split(",")
        .some((type) =>
          file.type.match(new RegExp(type.trim().replace("*", ".*")))
        )
    ) {
      return `Invalid file type. Accepted types: ${acceptedFileTypes}`;
    }

    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(
        maxFileSize / 1024 / 1024
      )}MB limit`;
    }

    return "";
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validationError = validateFile(file);

    setError(validationError);

    if (!validationError) {
      onFileSelect(file);
    }

    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
        aria-label="File upload input"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`
          inline-flex items-center p-2 border border-transparent 
          rounded-full shadow-sm
          transition-all duration-300 ease-in-out transform
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-blue-400 active:bg-blue-800 active:scale-100 active:shadow-inner transition-transform duration-200 ease-out"
          }
        `}
        aria-label="Upload file"
        aria-disabled={disabled}
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      </button>
      {error && (
        <div
          className="absolute top-full mt-2 left-0 right-0 p-2 bg-red-50 rounded-md border border-red-100 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};

FileUploadButton.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  acceptedFileTypes: PropTypes.string,
  maxFileSize: PropTypes.number,
  disabled: PropTypes.bool,
};

export default FileUploadButton;
