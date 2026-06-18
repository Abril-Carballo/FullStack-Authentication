import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service'; // LABORATORIO 2
import { RegisterDto } from './dto/register.dto'; // LABORATORIO 2
import { LoginDto } from './dto/login.dto'; // LABORATORIO 2

// LABORATORIO 2: rutas públicas de autenticación
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}