import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from '../config/env';
import { RepositoryModule } from './repository.module';
import { AuthModule } from './auth.module';
import { TotemModule } from './totem.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

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
    AuthModule,
    TotemModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RepositoryModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'totem/:totemId/analyze-colors', method: RequestMethod.POST },
        { path: 'totem/:totemId/register-interaction', method: RequestMethod.POST },
        { path: '/', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
