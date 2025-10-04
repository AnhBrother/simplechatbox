import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomIoAdapter } from './custom-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'], // Replace with your Next.js frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap()
  .then(() => {
    console.log('App has started successfully!');
  })
  .catch((error) => {
    console.error('Error starting app:', error);
  });
