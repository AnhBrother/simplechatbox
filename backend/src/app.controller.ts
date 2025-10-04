import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('chat')
  // getChat(): object {
  //   console.log('Chat endpoint hit');
  //   return { message: 'This is the chat endpoint' };
  // }
}
