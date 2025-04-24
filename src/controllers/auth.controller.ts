import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from 'src/domain/dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    const { email, password } = body;
    try {
      const tokens = await this.authService.authenticateUser(email, password);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
