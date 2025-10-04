// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Map<string, string> = new Map();

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    client.on('joinRoom', async (room: string) => {
      await this.joinRoom(client, room);
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    const room = this.clients.get(client.id);
    if (room) {
      this.server.to(room).emit('message', `${client.id} has left the chat.`);
      this.clients.delete(client.id);
    }
  }

  async joinRoom(client: Socket, room: string) {
    await client.join(room);
    this.clients.set(client.id, room);
    console.log(`${client.id} joined room ${room}`);
  }

  sendMessageToRoom(room: string, message: string) {
    this.server.to(room).emit('message', message);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    const room = this.clients.get(client.id);
    if (room) {
      this.sendMessageToRoom(room, message);
    } else {
      console.log('Client not in a room');
    }
  }
}
