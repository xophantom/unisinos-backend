import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from '../config/env';
import { ClientModule } from './client.module';
import { InvoiceModule } from './invoice.module';
import { OrderProductModule } from './order-product.module';
import { OrderModule } from './order.module';
import { PrintLabelsModule } from './print-labels.module';
import { ProductModule } from './product.module';
import { RepositoryModule } from './repository.module';
import { StoreModule } from './store.module';
import { TagModule } from './tag.module';
import { WarehouseModule } from './warehouse.module';
import { RecaptchaModule } from './recaptcha.module';
import { AuthModule } from './auth.module';
import { StockModule } from './stock.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { ApiServicesModule } from './api-services.module';
import { UploadModule } from './upload.module';
import { DivergenceModule } from './divergence.module';
import { ProductMetricsModule } from './product-metrics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: ENV.DB_TYPE as any,
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      logging: ['query', 'error', 'schema'],
      username: ENV.DB_USERNAME,
      password: ENV.DB_PASSWORD,
      database: ENV.DB_NAME,
      autoLoadEntities: true,
      ...(process.env.NODE_ENV !== 'production' && {
        extra: {
          trustServerCertificate: true,
        },
      }),
      requestTimeout: ENV.DB_TIMEOUT,
    }),
    RecaptchaModule,
    AuthModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      signOptions: { expiresIn: '60m' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RepositoryModule,
    TagModule,
    ClientModule,
    OrderModule,
    StoreModule,
    ProductModule,
    WarehouseModule,
    PrintLabelsModule,
    InvoiceModule,
    OrderProductModule,
    StockModule,
    ApiServicesModule,
    UploadModule,
    DivergenceModule,
    ProductMetricsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'verify-recaptcha', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'tags/:antennaId/check', method: RequestMethod.POST },
        { path: '/', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
