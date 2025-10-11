import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors();

    const PORT = process.env.PORT ?? 3001;
    await app.listen(PORT);
    logger.log(`Server started on PORT ${PORT}`);
  } catch (error) {
    logger.error('Failed to start server', error);
  }
}

void bootstrap();
