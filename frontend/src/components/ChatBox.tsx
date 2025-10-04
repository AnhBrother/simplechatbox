// src/components/ChatBox.tsx
import React from 'react';

interface Message {
  sender: string;
  text: string;
}

const ChatBox = () => {
  const messages: Message[] = [
    { sender: 'Alex', text: 'Hello, how are you?' },
    { sender: 'You', text: 'I am fine, thanks!' },
    { sender: 'Alex', text: 'That\'s great!' },
  ];

  return (
    <div className="chatBox">
      <div className="chatHeader">Chat with Alex</div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'You' ? 'yourMessage' : 'otherMessage'}`}>
            <div className="sender">{msg.sender}:</div>
            <div className="text">{msg.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
