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
        className={`inline-flex items-center justify-center p-3 rounded-full shadow-lg transform transition-transform duration-200 ease-out focus:outline-none
          ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : `bg-gradient-to-r from-blue-500 to-purple-600 text-white
                hover:from-purple-600 hover:to-blue-500
                hover:scale-110 hover:shadow-[0_4px_20px_rgba(96,165,250,0.5)]
                active:scale-100 active:shadow-inner`
          }
        `}
        aria-label="Upload file"
        aria-disabled={disabled}
      >
        <svg
          className="w-6 h-6"
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
