import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:5173', // ou '*' para liberar tudo em dev
    credentials: true,
  });

   app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // retorna erro se receber propriedade extra
    transform: true,        // transforma payload para a classe DTO
  }));

  await app.listen(3000);
}
bootstrap();
