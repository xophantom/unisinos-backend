import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { logger } from '../tools';
import { BaseError, InternalServerError, NotFoundError } from '../errors';
import { sqlErrorMapper } from '../tools/sql-error-mapper';

@Catch()
export class ErrorFilter<T extends Error> implements ExceptionFilter {
  catch(error: T, host: ArgumentsHost) {
    const http = host.switchToHttp();

    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    logger.error('Error filter', {
      url: req.url,
      method: req.method,
      exception: error,
    });

    if (error instanceof BaseError) {
      return res.status(error.statusCode).send(this.errorResponseMapper(error));
    }

    if (error instanceof TypeORMError) {
      logger.error('Erro na query do TypeORM', {
        title: error.name,
        detail: error.message,
      });

      logger.debug('Causa do erro SQL', {
        cause: sqlErrorMapper(error),
      });

      return res.status(400).send(
        this.errorResponseMapper({
          code: 'BAD_REQUEST',
          title: 'Dados inválidos',
          detail: 'Os dados enviados estão inválidos ou ocorreu um erro ao acessar o recurso',
        }),
      );
    }

    if (error instanceof BadRequestException) {
      const errorObj = error.getResponse() as Record<string, any>;
      const code = error.getStatus();

      return res.status(code).send(
        this.errorResponseMapper({
          code: 'VALIDATION_ERROR',
          title: 'Parâmetros inválidos',
          detail: typeof errorObj.message !== 'string' ? errorObj.message.join(',') : errorObj.message,
        }),
      );
    }

    if (error instanceof NotFoundException) {
      const code = error.getStatus();

      return res.status(code).json(this.errorResponseMapper(new NotFoundError()));
    }

    if (error instanceof UnauthorizedException) {
      const code = error.getStatus();
      return res.status(code).json(
        this.errorResponseMapper({
          code: 'UNAUTHORIZED',
          title: 'Unauthorized',
          detail: error.message,
        }),
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(
        this.errorResponseMapper({
          code: 'TOKEN_EXPIRED',
          title: 'Token expired',
          detail: 'The token has expired',
        }),
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(
        this.errorResponseMapper({
          code: 'INVALID_TOKEN',
          title: 'Invalid token',
          detail: 'The token is invalid',
        }),
      );
    }

    return res.status(500).json(this.errorResponseMapper(new InternalServerError()));
  }

  private errorResponseMapper(error: Pick<BaseError, 'code' | 'title' | 'detail'>) {
    return {
      code: error.code,
      title: error.title,
      detail: error.detail,
    };
  }
}
