import { ExternalUser } from '../user.types';
import { USERS_GATEWAY, UsersGateway } from '../gateways/users.gateway';
import { BadGatewayException, BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'; // 1.6: agregamos BadRequestException y UnauthorizedException
import { InjectRepository } from '@nestjs/typeorm'; // 1.6: para inyectar el repositorio de TypeORM
import { Repository } from 'typeorm'; // 1.6: tipo del repositorio
import { UserEntity } from '../user.entity'; // 1.6: entidad de usuario de la base de datos
import * as bcrypt from 'bcrypt'; // 1.6: para verificar y hashear contraseñas
import { ConfigService } from '@nestjs/config'; // 1.6: para leer BCRYPT_COST del .env

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>, // 1.6: repositorio para acceder a la base de datos
    private readonly cfg: ConfigService, // 1.6: para leer BCRYPT_COST del .env
  ) {}

  async findAll(): Promise<ExternalUser[]> {
    try {
      return await this.usersGateway.fetchAll();
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async findOne(id: number): Promise<ExternalUser> {
    try {
      const user = await this.usersGateway.fetchById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  // 1.6: cambia la contraseña del usuario autenticado verificando la contraseña actual
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash') // 1.6: necesario porque passwordHash tiene select:false
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new BadRequestException('La contraseña actual es incorrecta');

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(newPassword, rounds); // 1.6: hashea la nueva contraseña antes de guardarla

    await this.usersRepo.save(user);

    return { message: 'Password updated' };
  }

  // 1.6: cambia el email del usuario autenticado verificando la contraseña actual
  async updateEmail(userId: string, newEmail: string, password: string): Promise<{ message: string }> {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash') // 1.6: necesario porque passwordHash tiene select:false
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new BadRequestException('La contraseña es incorrecta');

    user.email = newEmail.trim().toLowerCase(); // 1.6: guarda el nuevo email en minúsculas

    await this.usersRepo.save(user);

    return { message: 'Email updated' };
  }
}

