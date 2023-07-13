import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatHistory from './ChatHistory';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faTimes, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChatModal = () => {
  const [active, setActive] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const persistedConversation = localStorage.getItem('conversation');
    if (persistedConversation) {
      setConversation(JSON.parse(persistedConversation));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversation', JSON.stringify(conversation));
  }, [conversation]);

  const handleToggle = () => {
    if (active) {
      setMinimized(true);
      setActive(false);
    } else {
      setMinimized(false);
      setActive(true);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim() !== '') {
      setError('');
    }
  };

  const handleSendMessage = async () => {
    if (message.trim().length === 0) {
      setError('Please fill the input.');
      return;
    }

    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        { message }
      );

      setTimeout(() => {
        setConversation([
          ...conversation,
          { user: true, text: message },
          { user: false, text: response.data.message }, 
        ]);
      }, 1000);

      setMessage('');
      setError('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClearChat = () => {
    setConversation([]);
  };

  const handleClose = () => {
    setMinimized(true);
    setActive(false);
  };

  const chatContentRef = useRef(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className={`chat-modal fixed bottom-20 right-20 w-350 max-h-350 overflow-y-auto border border-gray-300 bg-gray-100 shadow-lg rounded-lg flex flex-col transition-all duration-300 ${active ? 'h-96' : 'h-20'} ${minimized ? 'w-40' : 'w-96'}`}>
      {minimized ? (
        <div className="chat-open-symbol fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition-colors" onClick={handleToggle}>
          <FontAwesomeIcon icon={faComment} className="w-5 h-5" />
        </div>
      ) : (
        <>
          <div className="chat-header px-4 py-2 border-b border-gray-300 flex items-center justify-between">
            <h2 className="text-lg font-bold">Chat with GPT</h2>
            <button className="text-gray-500 hover:text-gray-700" onClick={handleClose}>
              Close
            </button>
          </div>
          <div className="chat-content flex flex-col flex-grow overflow-y-auto min-h-100 px-4 py-2 bg-white rounded-lg">
            <div className="chat-history flex-grow">
              <ChatHistory conversation={conversation} />
            </div>
            <div className="chat-input flex items-center mt-4">
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={message}
                onChange={handleChange}
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2" onClick={handleSendMessage}>
                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
              </button>
              <button className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2" onClick={handleClearChat}>
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </div>
            {error && active && <div className="error text-red-500 mt-2">{error}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatModal;