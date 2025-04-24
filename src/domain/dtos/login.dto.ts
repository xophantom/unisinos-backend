import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ description: 'Email de acesso' })
  email: string;

  @ApiProperty({ description: 'Senha de acesso' })
  password: string;
}

export class ValidateRecaptchaDTO {
  @ApiProperty({ description: 'Token para refresh' })
  token: string;
}
