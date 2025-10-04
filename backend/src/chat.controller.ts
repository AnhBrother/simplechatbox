// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Post('send-message')
  sendMessage(@Body() body: { clientId: string; message: string }) {
    const { clientId, message } = body;
    this.chatGateway.handleMessage({ id: clientId } as any, message);
    return { status: 'Message sent' };
  }
}
