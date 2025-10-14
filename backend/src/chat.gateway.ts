// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // allow all origins (for demo).
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // Save userId -> socketId
  private userSocketMap: Map<string, string> = new Map();
  private socketUserMap: Map<string, string> = new Map();
  private userInfoMap: Map<string, { id: string; username: string }> =
    new Map();

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  /**
   * When user logs in, map userId to socketId
   */
  @SubscribeMessage('login')
  handleLogin(
    @MessageBody()
    user: { id: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.userSocketMap.set(user.id, client.id);
    this.socketUserMap.set(client.id, user.id);
    this.userInfoMap.set(user.id, user);

    console.log(`User ${user.username} logged in`);

    // Send updated user list to all clients
    this.emitConnectedUsers();

    // ✅ Send pending messages if any
    const pending = this.pendingMessages.get(user.id);
    if (pending && pending.length > 0) {
      pending.forEach((msg) => {
        client.emit('privateMessage', {
          from: msg.from,
          message: msg.message,
          image: msg.image,
        });
      });

      // ✅ Remove pending messages after sending
      this.pendingMessages.delete(user.id);

      console.log(
        `Delivered ${pending.length} pending message(s) to ${user.username}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUserMap.get(client.id);
    if (userId) {
      this.userSocketMap.delete(userId);
      this.socketUserMap.delete(client.id);
      this.userInfoMap.delete(userId);

      console.log(`User ${userId} disconnected`);
      this.emitConnectedUsers();
    }
  }

  private emitConnectedUsers() {
    const users = Array.from(this.userInfoMap.values());
    this.server.emit('connectedUsers', users);
  }

  // Map<userId, Message[]>
  private pendingMessages: Map<
    string,
    { from: string; message?: string; image?: string }[]
  > = new Map();

  /**
   * Handle private message
   */
  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @MessageBody()
    data: {
      from: string;
      to: string;
      message?: string;
      image?: string;
    },
  ) {
    this.sendDirectMessage(data.from, data.to, data.message, data.image);
  }

  /**
   * Send direct message from one user to another
   */
  sendDirectMessage(
    from: string,
    to: string,
    message?: string,
    image?: string,
  ) {
    const toSocketId = this.userSocketMap.get(to);

    if (toSocketId) {
      this.server.to(toSocketId).emit('privateMessage', {
        from,
        message,
        image,
      });
      console.log(`Message from ${from} to ${to}: ${message ?? image}`);
    } else {
      console.log(`User ${to} is not connected. Saving to pending messages.`);

      const existing = this.pendingMessages.get(to) || [];
      existing.push({ from, message, image });
      this.pendingMessages.set(to, existing);
    }
  }
}
