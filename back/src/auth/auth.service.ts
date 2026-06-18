import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'; // LABORATORIO 3
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity'; // LABORATORIO 2
import { UserRole } from '../users/user-role.enum'; // LABORATORIO 2
import { RegisterDto } from './dto/register.dto'; // LABORATORIO 2
import { LoginDto } from './dto/login.dto'; // LABORATORIO 2

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService, // LABORATORIO 2: para leer BCRYPT_COST del .env
    private readonly jwtService: JwtService, // LABORATORIO 3: para firmar el token
  ) {}

  // LABORATORIO 2: registro con hash bcrypt y rol automático
  async register(dto: RegisterDto): Promise<{ id: string; email: string; role: UserRole }> {
    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    // LABORATORIO 2: primer usuario es admin, los demás son user
    const countUsers = await this.usersRepo.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    const entity = this.usersRepo.create({
      email: dto.email.trim().toLowerCase(),
      passwordHash,
      role,
    });

    await this.usersRepo.save(entity);
    return { id: entity.id, email: entity.email, role: entity.role };
  }

  // LABORATORIO 2 - MODIFICADO LABORATORIO 3: login devuelve access_token JWT
  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash') // LABORATORIO 2: traemos el hash explícitamente
      .where('u.email = :email', { email })
      .getOne();

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    // LABORATORIO 3: firmamos el token con sub y role
    const accessToken = this.jwtService.sign({ sub: user.id, role: user.role });
    return { access_token: accessToken };
  }
}