import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email!: string; // App plantas: email del usuario que solicita recuperar la contraseña
}