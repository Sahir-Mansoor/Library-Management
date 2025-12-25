import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors(); // Allow frontend (port 3000) to call backend (port 5000)
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
