import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors(); // Allow frontend (port 3000) to call backend (port 5000)
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Library Management System API')
    .setDescription('API documentation for Library Management System')
    .setVersion('1.0')
    .addBearerAuth() // for future JWT
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
