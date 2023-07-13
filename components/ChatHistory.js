import React from 'react';

const ChatHistory = ({ conversation }) => {
  return (
    <div className="chat-history">
      {conversation.map((message, index) => (
        <div
          key={index}
          className={`chat-message p-2 mb-2 rounded-lg ${message.user ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-700 self-start'}`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;