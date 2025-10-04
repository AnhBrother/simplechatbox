// src/components/ChatInput.tsx
'use client';
import React, { useState } from 'react';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sent message:', message); // Gửi tin nhắn (Ở đây bạn có thể thay thế bằng API call)
      setMessage('');
    }
  };

  return (
    <div className="chatInputContainer">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="chatInput"
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage} className="sendButton">
        Send
      </button>
    </div>
  );
};

export default ChatInput;
