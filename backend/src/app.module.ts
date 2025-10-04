import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';

@Module({
  imports: [],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
