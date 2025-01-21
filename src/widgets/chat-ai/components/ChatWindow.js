import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import jsPDF from 'jspdf';
import PDFPreviewModal from './PDFPreviewModal';

const WELCOME_MESSAGE =
  "👋 Hello! I'm your AI assistant. How can I help you today?";

const ChatWindow = ({ messages = [], onAddMessage }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const welcomeMessageShownRef = useRef(false);
  const lastScrollTimeRef = useRef(Date.now());
  const pendingScrollRef = useRef(false);

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
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    setIsUserScrolling(true);

    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      setShouldAutoScroll(isNearBottom());
    }, 150);
  };

  useEffect(() => {
    scrollToBottom(true);
  }, []); // Only run once on mount

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]); // Run when messages change

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
  const exportToPDF = () => {
    const doc = new jsPDF();
    const lineHeight = 10;
    let yPosition = 20;

    doc.setFontSize(16);
    doc.text('Chat Conversation', 20, yPosition);
    yPosition += lineHeight * 2;

    doc.setFontSize(12);
    displayMessages.forEach((message) => {
      const sender = message.type === 'ai' ? 'AI: ' : 'You: ';
      const text = sender + message.content;
      
      const splitText = doc.splitTextToSize(text, 170);
      
      if (yPosition + (splitText.length * lineHeight) > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      splitText.forEach(line => {
        doc.text(line, 20, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight/2;
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    doc.save(`chat-export-${timestamp}.pdf`);
    setIsPreviewOpen(false);
  };

  const handlePreviewClick = () => {
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col h-[500px] overflow-y-auto bg-white rounded-lg p-4 space-y-4 shadow-lg border"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Chat messages"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#1976d2 transparent",
        }}
      >
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          zIndex: 1000,
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={handlePreviewClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1565c0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
          >
            <span role="img" aria-label="preview">🔎</span>
            Preview
          </button>
          <button
            onClick={exportToPDF}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease',
              boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#43a047'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
          >
            <span role="img" aria-label="export">📤</span>
            Export
          </button>
        </div>
        {displayMessages.map((message, index) => (
          <div
            key={`${message.type}-${index}`}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === "user"
                  ? "bg-[#1976d2] text-white"
                  : "bg-white border border-[#1976d2] text-[#1976d2]"
              }`}
              style={{
                boxShadow: message.type === "user" 
                  ? '0 2px 4px rgba(25, 118, 210, 0.2)'
                  : '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              {message.isFile ? (
                <div className="prose">
                  {message.content.split('\n').map((line, i) => {
                    const cleanLine = line.replace(/\*/g, '');
                    
                    if (cleanLine.match(/Heading:/i)) {
                      return <strong key={i} className="block text-xl my-3">{cleanLine}</strong>;
                    }
                    if (cleanLine.match(/Subheading:/i)) {
                      return <strong key={i} className="block text-lg my-2">{cleanLine}</strong>;
                    }
                    return <div key={i} className="my-1">{cleanLine}</div>;
                  })}
                </div>
              ) : (
                <p className="break-words whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
      <PDFPreviewModal
        messages={displayMessages}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={exportToPDF}
      />
    </>
  );
};

ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["user", "ai"]).isRequired,
      content: PropTypes.string.isRequired,
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