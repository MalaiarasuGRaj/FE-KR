import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  timestamp: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 20,
  },
});

const PDFPreviewModal = ({ messages, isOpen, onClose, onDownload }) => {
  if (!isOpen) return null;

  const PDFDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Chat Conversation</Text>
        {messages.map((message, index) => (
          <View key={index}>
            <Text style={styles.message}>
              {message.type === 'ai' ? 'AI: ' : 'You: '}
              {message.content}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-[80vw] h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">PDF Preview</h2>
          <div className="flex gap-4">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <span role="img" aria-label="download">📥</span>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 border border-gray-200 rounded">
          <PDFViewer width="100%" height="100%" className="rounded">
            <PDFDocument />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

PDFPreviewModal.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['user', 'ai']).isRequired,
      content: PropTypes.string.isRequired,
      isWelcomeMessage: PropTypes.bool,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default PDFPreviewModal;
