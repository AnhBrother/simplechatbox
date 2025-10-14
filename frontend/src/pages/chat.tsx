// src/pages/chat.tsx
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import io, { Socket } from 'socket.io-client';
import '../styles/globals.css';

const userList = [
  { id: 'u1', username: 'Alex' },
  { id: 'u2', username: 'Ben' },
  { id: 'u3', username: 'Charlie' },
];

let socket: Socket;

const Chat = () => {
  interface Message {
    senderId: string;
    text?: string;
    image?: string;
  }
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [receiver, setReceiver] = useState<{ id: string; username: string } | null>(null);

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ [userId: string]: Message[] }>({});
  const [connectedUsers, setConnectedUsers] = useState<{ id: string; username: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Setup socket connection
  useEffect(() => {
    socket = io('http://localhost:3001');

    socket.on('privateMessage', (data: { from: string; message: string, image: string }) => {
      const sender = data.from;
      setChatHistory((prev) => {
        const existing = prev[sender] || [];
        const newMessage = {
          senderId: sender,
          text: data.message ? `${userList.find((u) => u.id === sender)?.username || sender}: ${data.message}` : undefined,
          image: data.image,
        };
        return {
          ...prev,
          [sender]: [...existing, newMessage],
        };
      });
    });

    socket.on('connectedUsers', (users: { id: string; username: string }[]) => {
      setConnectedUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Emit login event after selecting currentUser
  useEffect(() => {
    if (currentUser) {
      socket.emit('login', currentUser);
    }
  }, [currentUser]);

  const sendMessage = () => {
    console.log(`Sending message from ${currentUser?.id} to ${receiver?.id}: ${ message ?? selectedImage }`);
    if ((!message.trim() && !selectedImage) || !currentUser || !receiver) return;

    const newMessage = {
      senderId: currentUser.id,
      text: message.trim(),
      image: selectedImage || undefined,
    };

    socket.emit('privateMessage', {
      from: currentUser.id,
      to: receiver.id,
      message: newMessage.text,
      image: newMessage.image,
    });

    setChatHistory((prev) => {
      const existing = prev[receiver.id] || [];
      return {
        ...prev,
        [receiver.id]: [...existing, newMessage],
      };
    });

    setMessage('');
    setSelectedImage(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // First step: select your user
  if (!currentUser) {
    return (
      <div>
        <h2>Select your user</h2>
        {userList.map((u) => (
          <button key={u.id} onClick={() => setCurrentUser(u)} style={{ marginRight: '10px' }}>
            {u.username}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ margin: 0, display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: '#2f3136',
        color: '#fff',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Logged in as: {currentUser.username}
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {userList
            .filter((u) => u.id !== currentUser.id)
            .map((u) => (
              <li
                key={u.id}
                onClick={() => setReceiver(u)}
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  background: receiver?.id === u.id ? '#40444b' : 'transparent',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: '0.2s',
                }}
              >
                🧑 {u.username}
              </li>
            ))}
        </ul>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#e5ddd5',
      }}>
        {receiver ? (
          <>
            {/* Header */}
            <div style={{
              padding: '15px 20px',
              backgroundColor: '#f0f0f0',
              borderBottom: '1px solid #ccc',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              Chat with {receiver.username}
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {(chatHistory[receiver.id] || []).map((msg, idx) => {
                const isOwnMessage = msg.senderId === currentUser.id;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{
                      backgroundColor: isOwnMessage ? '#d1f1a6ff' : '#fff',
                      color: '#000',
                      borderRadius: '20px',
                      padding: '10px 15px',
                      maxWidth: '60%',
                      position: 'relative',
                      wordBreak: 'break-word',
                    }}>
                      {msg.image && (
                        <Image
                          src={msg.image}
                          unoptimized
                          alt="sent"
                          style={{
                            maxWidth: '100%',
                            borderRadius: '12px',
                            marginBottom: msg.text ? '4px' : '0',
                          }}
                          width={300}
                          height={200}
                        />
                      )}
                      {msg.text && <div>{msg.text}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div style={{
              padding: '15px 20px',
              borderTop: '1px solid #ccc',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  fontSize: '14px'
                }}
                disabled={!!selectedImage}
              />

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        setSelectedImage(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                    setMessage('');
                  }
                }}
                style={{ display: 'none' }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  marginLeft: '10px',
                  padding: '10px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                title="Send image"
              >
                📷
              </button>

              <button
                onClick={sendMessage}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#00c3ffff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{
            padding: '20px',
            fontSize: '16px',
            color: '#555'
          }}>
            Please select a user to chat with.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
