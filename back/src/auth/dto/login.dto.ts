import { IsEmail, IsString } from 'class-validator'; // LABORATORIO 2

// LABORATORIO 2: DTO para login de usuario con validaciones
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}