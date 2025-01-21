import React, { useState } from "react";
import PropTypes from "prop-types";

const Sidebar = ({ isOpen, toggleSidebar, onNewChat }) => {
  const [conversationHistory, setConversationHistory] = useState([
    "Advanced Knowledge Retrieval",
    "Extensibility & Integration",
    "R&D User Experience Refinement",
    "Advanced Querying and Contextual Understanding",
    "Project architecture design",
  ]);
  const [showOptions, setShowOptions] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const toggleOptions = (index) => {
    setShowOptions(showOptions === index ? null : index);
  };

  const handleDelete = (index) => {
    const updatedHistory = conversationHistory.filter((_, i) => i !== index);
    setConversationHistory(updatedHistory);
    setShowOptions(null);
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setNewTitle(conversationHistory[index]);
    setShowOptions(null);
  };

  const handleEditConfirm = (index) => {
    const updatedHistory = [...conversationHistory];
    updatedHistory[index] = newTitle;
    setConversationHistory(updatedHistory);
    setIsEditing(null);
    setNewTitle("");
  };

  return (
    <>
      <div
        className={`sidebar ${isOpen ? "open" : "closed"}`}
        style={{ width: "250px" }}
      >
        <button className="sidebar-close-button" onClick={toggleSidebar}>
          ← Close Sidebar
        </button>
        <div className="sidebar-content">
          {/* New Chat Button */}
          <button className="new-chat-button" onClick={onNewChat}>
            + New Chat
          </button>

          <h2 className="sidebar-title">Conversation History</h2>

          <ul className="sidebar-history-list">
            {conversationHistory.map((item, index) => (
              <li key={index} className="sidebar-history-item">
                <div className="history-item-container">
                  {isEditing === index ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="edit-input"
                      />
                      <button
                        className="edit-confirm-button"
                        onClick={() => handleEditConfirm(index)}
                      >
                        ✔️
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="history-title">{item}</span>
                      <div className="three-dot-menu">
                        <button
                          className="three-dot-button"
                          onClick={() => toggleOptions(index)}
                        >
                          ⋮
                        </button>
                        {showOptions === index && (
                          <div className="options-menu">
                            <button
                              className="options-menu-item"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </button>
                            <button
                              className="options-menu-item"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      {!isOpen && (
        <button className="sidebar-toggle-button" onClick={toggleSidebar}>
          ≡
        </button>
      )}
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired, // New Prop for handling new chat
};

export default Sidebar;