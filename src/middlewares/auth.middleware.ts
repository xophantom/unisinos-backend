import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    this.logger.debug(`Token recebido: ${token}`);

    // Verifica se é o token fixo
    const fixedToken = this.configService.get<string>('FIXED_TOKEN');
    this.logger.debug(`Token fixo: ${fixedToken}`);

    if (token === fixedToken) {
      this.logger.debug('Token fixo válido');
      req['user'] = { type: 'totem' };
      return next();
    }

    try {
      this.logger.debug('Tentando validar como JWT');
      const payload = await this.jwtService.verifyAsync(token);
      this.logger.debug(`Payload JWT: ${JSON.stringify(payload)}`);
      req['user'] = payload;
      next();
    } catch (error) {
      this.logger.error(`Erro ao validar JWT: ${error.message}`);
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
