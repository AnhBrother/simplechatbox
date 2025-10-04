import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

@Injectable()
export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server: import('socket.io').Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: ['http://localhost:3000'], // Replace with your Next.js frontend URL
        methods: ['GET', 'POST'],
        credentials: true,
      },
    }) as import('socket.io').Server;
    return server;
  }
}
