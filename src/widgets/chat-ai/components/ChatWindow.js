import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const WELCOME_MESSAGE =
  "👋 Hello! I'm your AI assistant. How can I help you today?";

const ChatWindow = ({ messages = [], onAddMessage }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const welcomeMessageShownRef = useRef(false);
  const lastScrollTimeRef = useRef(Date.now());
  const pendingScrollRef = useRef(false);

  // Show welcome message when component mounts if messages are empty
  useEffect(() => {
    if (messages.length === 0 && !welcomeMessageShownRef.current) {
      welcomeMessageShownRef.current = true;
      if (onAddMessage) {
        onAddMessage({
          type: "ai",
          content: WELCOME_MESSAGE,
          isWelcomeMessage: true,
        });
      }
    }
  }, [messages.length, onAddMessage]);

  // Ensure welcome message is shown even if onAddMessage is not provided
  const displayMessages =
    messages.length === 0 && !onAddMessage
      ? [
          {
            type: "ai",
            content: WELCOME_MESSAGE,
            isWelcomeMessage: true,
          },
        ]
      : messages;

  const isNearBottom = () => {
    if (!containerRef.current) return true;
    const container = containerRef.current;
    const threshold = 150; // pixels from bottom
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold
    );
  };

  const scrollToBottom = (force = false) => {
    if (!containerRef.current || !messagesEndRef.current) return;

    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;

    // Always scroll on force, otherwise check conditions
    if (force || (shouldAutoScroll && !isUserScrolling)) {
      try {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
        lastScrollTimeRef.current = now;
      } catch (error) {
        console.warn("ScrollIntoView failed:", error);
        // Fallback scrolling method
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    setIsUserScrolling(true);

    // Set a new timeout
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      setShouldAutoScroll(isNearBottom());
    }, 150);
  };

  // Effect for initial render
  useEffect(() => {
    scrollToBottom(true);
  }, []); // Only run once on mount

  // Effect for message changes
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]); // Run when messages change

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-[500px] overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-lg p-4 space-y-4 shadow-lg border border-blue-200"
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Chat messages"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(147, 197, 253, 0.5) transparent",
      }}
    >
      {displayMessages.map((message, index) => (
        <div
          key={`${message.type}-${index}`}
          className={`flex ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`
              max-w-[80%] p-3 rounded-lg
              ${
                message.type === "user"
                  ? "bg-blue-700 text-white rounded-br-none"
                  : message.isWelcomeMessage
                  ? "bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500 p-6 rounded-lg text-white shadow-lg border border-blue-300"
                  : "bg-white text-gray-800 shadow-lg rounded-bl-none border border-grey-700"
              }
            `}
            role="article"
            aria-label={`${
              message.type === "user" ? "Your message" : "AI response"
            }`}
          >
            <p className="break-words whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
};

ChatWindow.propTypes = {
  /**
   * Array of message objects to display in the chat window
   */
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      /** Type of message - either 'user' or 'ai' */
      type: PropTypes.oneOf(["user", "ai"]).isRequired,
      /** Content of the message */
      content: PropTypes.string.isRequired,
      /** Flag to indicate if this is the welcome message */
      isWelcomeMessage: PropTypes.bool,
    })
  ),
  /**
   * Callback function to add a new message
   * @param {Object} message - The message object to add
   * @param {('user'|'ai')} message.type - Type of the message
   * @param {string} message.content - Content of the message
   * @param {boolean} [message.isWelcomeMessage] - Whether this is a welcome message
   */
  onAddMessage: PropTypes.func,
};

ChatWindow.defaultProps = {
  messages: [],
  onAddMessage: undefined,
};

export default ChatWindow;
