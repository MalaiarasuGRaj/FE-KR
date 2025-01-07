import React, { useState } from "react";
import "./App.css";
import "./animations.css";
import InputBox from "./widgets/chat-ai/components/InputBox";
import SubmitButton from "./widgets/chat-ai/components/SubmitButton";
import FileUploadButton from "./widgets/chat-ai/components/FileUploadButton";
import ChatWindow from "./widgets/chat-ai/components/ChatWindow";
import LoadingIndicator from "./widgets/chat-ai/components/LoadingIndicator";
import APIService from "./widgets/chat-ai/APIService";

// Initialize API service
const apiService = new APIService();

function AIChat() {
  // State management
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  // Handle input change
  const handleChange = (value) => {
    setInputValue(value);
    setError(null);
  };

  // Clear input
  const clearInput = () => {
    setInputValue("");
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a message");
      return;
    }

    // Add user message to chat
    const userMessage = { type: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input and set loading state
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Send query to API
      const response = await apiService.sendQuery(userMessage.content);

      // Add AI response to chat
      const aiMessage = {
        type: "ai",
        content: response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      let errorMessage = "An error occurred while processing your request.";

      if (error.message.includes("Invalid response format")) {
        errorMessage =
          "Received an invalid response from the AI service. Please try again.";
      } else if (error.message.includes("No response received")) {
        errorMessage =
          "Unable to connect to the AI service. Please check your connection and try again.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.response?.status === 503) {
        errorMessage =
          "AI service is temporarily unavailable. Please try again later.";
      }

      setError(errorMessage);
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Ask AI
        </h1>

        {/* Chat Window */}
        <ChatWindow messages={messages} />

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center" role="alert">
            {error}
          </div>
        )}

        {/* Input Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4 items-start">
            <div className="flex-1">
              <InputBox
                inputValue={inputValue}
                handleChange={handleChange}
                clearInput={clearInput}
              />
            </div>
            <FileUploadButton
              onFileSelect={handleFileSelect}
              acceptedFileTypes=".txt,.pdf,.doc,.docx"
              maxFileSize={10485760} // 10MB
              buttonText={selectedFile ? selectedFile.name : "Attach File"}
              disabled={isLoading}
              className="mr-2"
            />
            <SubmitButton
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!inputValue.trim()}
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center">
            <LoadingIndicator size="sm" text="AI is thinking..." />
          </div>
        )}
      </div>
    </div>
  );
}

export default AIChat;
