// src/pages/chat.tsx
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const [room, setRoom] = useState('room1');

  useEffect(() => {
    socket = io('http://localhost:3001');

    socket.on('message', (newMessage: string) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('clients', (newClients: string[]) => {
      setClients(newClients);
    });

    socket.emit('joinRoom', room);

    return () => {
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };

  return (
    <div>
      <h1>Chat Box</h1>

      <div>
        <input
          type="text"
          value={room}
          onChange={handleRoomChange}
          placeholder="Enter Room"
        />
        <button onClick={() => socket.emit('joinRoom', room)}>Join Room</button>
      </div>

      <div>
        {clients.length > 0 && (
          <div>
            <h2>Connected Clients:</h2>
            <ul>
              {clients.map((client, idx) => (
                <li key={idx}>{client}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
