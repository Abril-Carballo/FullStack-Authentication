import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // LABORATORIO 3
import { PassportModule } from '@nestjs/passport'; // LABORATORIO 3
import { AuthController } from './auth.controller'; // LABORATORIO 2
import { AuthService } from './auth.service'; // LABORATORIO 2
import { JwtStrategy } from './jwt.strategy'; // LABORATORIO 3
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; // LABORATORIO 3
import { RolesGuard } from '../common/guards/roles.guard'; // LABORATORIO 3
import { UserEntity } from '../users/user.entity'; // LABORATORIO 2

// LABORATORIO 2 - MODIFICADO LABORATORIO 3: agrega JWT, Passport y guards
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // LABORATORIO 2
    PassportModule.register({ defaultStrategy: 'jwt' }), // LABORATORIO 3
    JwtModule.registerAsync({ // LABORATORIO 3: lee JWT_SECRET y JWT_EXPIRES_SEC del .env
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(cfg.get<string>('JWT_EXPIRES_SEC') ?? '3600'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // LABORATORIO 3
    JwtAuthGuard, // LABORATORIO 3
    RolesGuard, // LABORATORIO 3
  ],
  exports: [
    JwtModule, // LABORATORIO 3: exportamos para que otros módulos puedan usar JwtService
    JwtAuthGuard, // LABORATORIO 3
    RolesGuard, // LABORATORIO 3
  ],
})
export class AuthModule {}