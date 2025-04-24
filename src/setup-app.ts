import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import { Client } from '@/entities/client.entity';
import { Order } from '@/entities/order.entity';
import { ProductGridView } from '@/entities/product-grid-view.entity';
import { Store } from '@/entities/store.entity';
import { logger } from './tools';
import { AppModule } from './modules/app.module';
import { ErrorFilter } from './filters';
import { ENV } from './config/env';
import { AddMovementBillingDateDto, CreateOrdersDto, TagEventBodyDto } from './domain';
import { StoreOrdersSchema } from './openapi';
import 'multer';
import { Devolution, DevolutionProductIten } from './entities';

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

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setVersion('1.2.0')
      .setDescription('API')
      .addTag('Auth')
      .addTag('Clientes')
      .addTag('Lojas')
      .addTag('Pedidos')
      .addTag('Produtos')
      .addTag('Tag')
      .addSecurity('ApiKeyAuth', {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      })
      .addSecurityRequirements('ApiKeyAuth')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [
        Client,
        Store,
        Order,
        ProductGridView,
        CreateOrdersDto,
        TagEventBodyDto,
        AddMovementBillingDateDto,
        StoreOrdersSchema,
        DevolutionProductIten,
        Devolution,
      ],
    });

    SwaggerModule.setup('api-docs', app, document);
  }

  app.use(logger.expressLogger());

  return app;
};
