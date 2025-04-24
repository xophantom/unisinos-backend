/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwksRsa from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);
  private jwksClient: jwksRsa.JwksClient;

  constructor() {
    this.jwksClient = new jwksRsa.JwksClient({
      jwksUri: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_X95e7Ioa3/.well-known/jwks.json',
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      this.logger.error('No token provided');
      return next(new UnauthorizedException('No token provided'));
    }

    if (token === ENV.FIXED_TOKEN) {
      this.logger.log('Fixed token used for authentication');
      req['user'] = { fixed: true };
      return next();
    }

    try {
      const decodedToken: any = jwt.decode(token, { complete: true });
      const { kid } = decodedToken.header;
      const key = await this.getSigningKey(kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      this.logger.log('Token:', token);
      this.logger.log('Token payload:', payload);
      req['user'] = payload;
      next();
    } catch (error) {
      this.logger.error('Token verification failed:', error);

      if (error instanceof jwt.TokenExpiredError) {
        return next(new UnauthorizedException('Token expired'));
      } else if (error instanceof jwt.JsonWebTokenError) {
        return next(new UnauthorizedException('Invalid token'));
      } else {
        return next(new UnauthorizedException('Unauthorized'));
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private getSigningKey(kid: string): Promise<jwksRsa.SigningKey> {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(key);
      });
    });
  }
}
