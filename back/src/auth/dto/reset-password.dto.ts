import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token!: string; // App plantas: token recibido desde el link de recuperación

  @IsString()
  @MinLength(8)
  password!: string; // App plantas: nueva contraseña del usuario, mínimo 8 caracteres
}