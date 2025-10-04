// src/pages/index.tsx
import ChatSidebar from '../components/ChatSideBar';
import ChatBox from '../components/ChatBox';
import ChatInput from '../components/ChatInput';

import '../styles/Chat.module.css';
import '../styles/globals.css';


const Home = () => {
  return (
    <div className="chatContainer">
      <ChatSidebar />
      <div className="chatContent">
        <ChatBox />
        <ChatInput />
      </div>
    </div>
  );
};

export default Home;
