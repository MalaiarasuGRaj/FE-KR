import React, { useState } from "react";
import "./App.css";
import "./animations.css";
import "./Sidebar.css";
import InputBox from "./widgets/chat-ai/components/InputBox";
import SubmitButton from "./widgets/chat-ai/components/SubmitButton";
import FileUploadButton from "./widgets/chat-ai/components/FileUploadButton";
import ChatWindow from "./widgets/chat-ai/components/ChatWindow";
import LoadingIndicator from "./widgets/chat-ai/components/LoadingIndicator";
import APIService from "./widgets/chat-ai/APIService";
import Sidebar from "./widgets/chat-ai/components/Sidebar";

const apiService = new APIService();

function AIChat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleChange = (value) => {
    setInputValue(value);
    setError(null);
  };

  const clearInput = () => {
    setInputValue("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a message");
      return;
    }

    const userMessage = { type: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);

    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendQuery(userMessage.content);
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // New Chat Functionality
  const handleNewChat = () => {
    setMessages([]);
    setSelectedFile(null);
    setError(null);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onNewChat={handleNewChat} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-[250px]" : "ml-0"
        }`}
      >
        <div className="w-full max-w-6xl h-[calc(100vh-32px)] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-6 mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            IQRA AI
          </h1>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto">
            <ChatWindow messages={messages} />
          </div>

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
            <div className="loading-indicator">
              <LoadingIndicator size="md" text="🤖 AI is thinking..." />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          className="sidebar-toggle-button"
          onClick={toggleSidebar}
        >
          ≡
        </button>
      )}
    </div>
  );
}

export default AIChat;