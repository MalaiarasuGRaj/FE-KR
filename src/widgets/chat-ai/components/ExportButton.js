import React from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
const ExportButton = ({ isLoading, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform focus:outline-none
        ${
          disabled || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-teal-600 hover:to-green-500 hover:scale-105 hover:shadow-[0_4px_15px_rgba(72,211,129,0.5)] active:scale-100 active:shadow-inner"
        }
        focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
      `}
      aria-label={isLoading ? "Exporting..." : "Export data"}
      aria-disabled={disabled || isLoading}
    >
      <div className="flex items-center justify-center space-x-2">
        {isLoading ? (
          <>
            <EnhancedLoadingSpinner />
            <span>Exporting...</span>
          </>
        ) : (
          <span>Export</span>
        )}
      </div>
    </button>
  );
};

const EnhancedLoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

ExportButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ExportButton.defaultProps = {
  isLoading: false,
  disabled: false,
};

export default ExportButton;