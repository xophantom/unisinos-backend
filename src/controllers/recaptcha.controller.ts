import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { ValidateRecaptchaDTO } from 'src/domain/dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('verify-recaptcha')
export class RecaptchaController {
  constructor(private configService: ConfigService) {}

  @Post()
  async validateRecaptcha(@Body() body: ValidateRecaptchaDTO) {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${body.token}`;

    try {
      const response = await fetch(verificationUrl, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        return { message: 'Verification successful' };
      }
      throw new BadRequestException('Verification failed');
    } catch (error) {
      throw new BadRequestException('Verification failed');
    }
  }
}
