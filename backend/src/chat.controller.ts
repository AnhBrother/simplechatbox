// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}

  /**
   * Send message via REST API
   * Body: { from: string, to: string, message: string }
   */
  @Post('send')
  sendMessage(
    @Body()
    body: {
      from: string;
      to: string;
      message: string;
    },
  ) {
    const { from, to, message } = body;
    this.chatGateway.handlePrivateMessage({ from, to, message });
    return { status: 'Message sent' };
  }
}
