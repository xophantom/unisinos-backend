import { Module } from '@nestjs/common';
import { RecaptchaController } from 'src/controllers/recaptcha.controller';

@Module({
  controllers: [RecaptchaController],
})
export class RecaptchaModule {}
