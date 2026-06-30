import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


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

  @Post('verify-email') // App plantas: crea la ruta POST /auth/verify-email para verificar el email
  verifyEmail(@Body('token') token: string) {
    // App plantas: toma el token recibido en el body y se lo pasa al service
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(200) 
  @UseGuards(JwtAuthGuard)
  resendVerification(@Req() req: any) {
    return this.authService.resendVerification(req.user.id);
  }

  @Post('forgot-password') // App plantas: ruta pública para pedir recuperación de contraseña
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password') // App plantas: ruta pública para cambiar la contraseña con el token
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return this.authService.me(req.user.id);
  }

}