💬 Simple Chatbox
A real-time chat application built with NestJS for the backend and Next.js for the frontend, using Socket.IO for seamless communication between users.
🚀 Features

Real-time messaging with Socket.IO
Multi-user chat interface
Backend powered by NestJS
Frontend built with Next.js
No page reloads required

📦 Project Structure
simplechatbox/
├── backend/   # NestJS server
└── frontend/  # Next.js client

🛠️ Getting Started
1️⃣ Backend Setup (NestJS)
Follow these steps to set up the backend server:
```bash
git clone this repo
cd simplechatbox/backend
npm install
npm run start:dev
```
2️⃣ Frontend Setup (Next.js)
Set up the frontend client:
```bash
cd ../frontend
npm install
npm run dev
```
🧑‍💻 How to Use


Connect to the backend:
Open your browser and go to http://localhost:3000 to load the chat interface.


Send a message:
Type a message in the input box and click Send to deliver it.


View messages:
Other users in the same room will receive the message instantly without refreshing the page.


📚 Documentation & Guides
🔧 Backend (NestJS)

Manages user connections
Handles chat room creation and management
Broadcasts messages to users in the same room

🎨 Frontend (Next.js)

Provides a clean and simple user interface
Allows users to send and receive messages in real-time

🔌 Socket.IO

Enables real-time communication between frontend and backend
Ensures fast and reliable message delivery

📄 License
This project is licensed under the MIT License.
