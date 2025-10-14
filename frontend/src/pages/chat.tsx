// src/pages/chat.tsx
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const userList = [
  { id: 'u1', username: 'Alex' },
  { id: 'u2', username: 'Ben' },
  { id: 'u3', username: 'Charlie' },
];

let socket: Socket;

const Chat = () => {
  interface Message {
    senderId: string;
    text: string;
  }
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [receiver, setReceiver] = useState<{ id: string; username: string } | null>(null);

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ [userId: string]: Message[] }>({});
  const [connectedUsers, setConnectedUsers] = useState<{ id: string; username: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  // Setup socket connection
  useEffect(() => {
    socket = io('http://localhost:3001');

    socket.on('privateMessage', (data: { from: string; message: string }) => {
      const sender = data.from;
      setChatHistory((prev) => {
        const existing = prev[sender] || [];
        const newMessage = {
          senderId: sender,
          text: `${userList.find((u) => u.id === sender)?.username || sender}: ${data.message}`,
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
    console.log('Sending message:', { from: currentUser?.id, to: receiver?.id, message });
    if (message.trim() && currentUser && receiver) {
      socket.emit('privateMessage', {
        from: currentUser.id,
        to: receiver.id,
        message,
      });

      setChatHistory((prev) => {
        const existing = prev[receiver.id] || [];
        const senderId = currentUser.id;
        const newMessage = {
          text: message,
          senderId,
        }
        return {
          ...prev,
          [receiver.id]: [...existing, newMessage],
        };
      });

      setMessage('');
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
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar: List users */}
      <div style={{ width: '250px', background: '#f4f4f4', padding: '10px' }}>
        <h3>
          Logged in as: {currentUser.username}
        </h3>
        <ul>
          {userList
            .filter((u) => u.id !== currentUser.id)
            .map((u) => (
              <li
                key={u.id}
                onClick={() => setReceiver(u)}
                style={{
                  padding: '6px',
                  marginBottom: '5px',
                  background: receiver?.id === u.id ? '#ddd' : '#fff',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                {u.username}
              </li>
            ))}
        </ul>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {receiver ? (
          <>
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '18px' }}>
              Chat with {receiver.username}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {(chatHistory[receiver.id] || []).map((msg, idx) => {
                const isOwnMessage = msg.senderId === currentUser.id;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '60%',
                        padding: '10px 14px',
                        borderRadius: '16px',
                        backgroundColor: isOwnMessage ? '#DCF8C6' : '#f1f0f0',
                        color: '#000',
                        textAlign: 'left',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                disabled={!!selectedImage}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        setSelectedImage(reader.result); // base64 string
                      }
                    };
                    reader.readAsDataURL(file);
                    setMessage(''); // Clear text input khi chọn ảnh
                  }
                }}
                style={{ marginLeft: 10 }}
              />

              <button
                onClick={sendMessage}
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div>Please select a user to chat with.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
