import { IsEmail, IsString, MinLength } from 'class-validator'; // LABORATORIO 2

// LABORATORIO 2: DTO para registro de usuario con validaciones
export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}