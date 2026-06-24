import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', // App plantas: permite que Angular pueda llamar al backend NestJS
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // App plantas: métodos HTTP permitidos desde el frontend
    allowedHeaders: ['Content-Type', 'Authorization'], // App plantas: headers permitidos para JSON y JWT
  });

  await app.listen(3000);
}
bootstrap();