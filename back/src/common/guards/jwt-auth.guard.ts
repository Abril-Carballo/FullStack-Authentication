import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // LABORATORIO 3

// LABORATORIO 3: guard que verifica el token JWT usando la estrategia 'jwt' de Passport
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}