import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity'; // LABORATORIO 3

// LABORATORIO 3: estrategia JWT que valida el token y carga el usuario en req.user
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    cfg: ConfigService,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // LABORATORIO 3: extrae el token del header Authorization: Bearer
      ignoreExpiration: false,
      secretOrKey: cfg.getOrThrow<string>('JWT_SECRET'), // LABORATORIO 3: lee el secreto del .env
    });
  }

  // LABORATORIO 3: se ejecuta tras verificar la firma — popula req.user
  async validate(payload: { sub: string }) {
    const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
    if (!user) return null;
    return { id: user.id, role: user.role, email: user.email };
  }
}