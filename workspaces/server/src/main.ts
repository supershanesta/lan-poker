import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GameIoAdapter } from '@app/websocket/game-io.adapter';
import { AppModule } from '@app/app.module';
import { application } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useWebSocketAdapter(new GameIoAdapter(app));

  console.log('SOCKET PATH', process.env.SOCKET_PATH);
  console.log('CORS_ALLOW_ORIGIN', process.env.CORS_ALLOW_ORIGIN);
  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.disable('x-powered-by');
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  await app.listen(4100);
  console.log(`Application is running on: ${await app.getUrl()} | Port: 4100`);
}

bootstrap();
