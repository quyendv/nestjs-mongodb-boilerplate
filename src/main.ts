import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configSwagger } from '~configs/api-docs.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Middleware
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // clear property not in dto class-validator
    }),
  );

  configSwagger(app);

  const PORT = process.env.PORT || 8000;
  await app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
bootstrap();
