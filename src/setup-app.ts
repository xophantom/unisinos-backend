import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import { logger } from './tools';
import { AppModule } from './modules/app.module';
import { ErrorFilter } from './filters';
import { ENV } from './config/env';
import 'multer';

export const setupApp = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.use(bodyParser.json({ limit: ENV.BODY_SIZE_LIMIT }));

  app.enableCors({
    origin: [ENV.CORS_ALLOWED_HOST_PAINEL, ENV.CORS_ALLOWED_HOST_COLETOR, 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false, transform: true }));

  app.useGlobalFilters(new ErrorFilter());

  app.use(logger.expressLogger());

  return app;
};
