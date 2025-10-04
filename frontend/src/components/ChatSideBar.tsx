// src/components/ChatSidebar.tsx
import React from 'react';

const ChatSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebarHeader">Chats</div>
      <div className="chatList">
        <div className="chatItem">Alex</div>
        <div className="chatItem">Ben</div>
        <div className="chatItem">Charlie</div>
      </div>
    </div>
  );
};

export default ChatSidebar;
