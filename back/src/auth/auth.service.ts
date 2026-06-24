import {
  BadRequestException, // App plantas: permite devolver error 400 cuando el token de verificación no existe o no sirve
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'; // LABORATORIO 3
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity'; // LABORATORIO 2
import { UserRole } from '../users/user-role.enum'; // LABORATORIO 2
import { RegisterDto } from './dto/register.dto'; // LABORATORIO 2
import { LoginDto } from './dto/login.dto'; // LABORATORIO 2
import { randomUUID } from 'crypto'; // App plantas: genera tokens únicos para verificar el email

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService, // LABORATORIO 2: para leer BCRYPT_COST del .env
    private readonly jwtService: JwtService, // LABORATORIO 3: para firmar el token
  ) {}

  // LABORATORIO 2: registro con hash bcrypt y rol automático
  async register(
    dto: RegisterDto,
  ): Promise<{
    access_token: string;
    user: { id: string; email: string; role: UserRole; isVerified: boolean };
  }> {
    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    // LABORATORIO 2: primer usuario es admin, los demás son user
    const countUsers = await this.usersRepo.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    const verificationToken = randomUUID(); // App plantas: crea un token único para este usuario recién registrado

    const entity = this.usersRepo.create({
      email: dto.email.trim().toLowerCase(),
      passwordHash,
      role,
      isVerified: false, // App plantas: el usuario arranca como no verificado
      verificationToken, // App plantas: guarda el token para poder validar el link del email después
    });

    await this.usersRepo.save(entity);

    const verificationLink = `http://localhost:4200/verify-email?token=${verificationToken}`; // App plantas: link que se enviará por email al usuario

    // App plantas: por ahora solo dejamos armado el link; después lo enviamos con un servicio de email real
    console.log('Link de verificación:', verificationLink);

    const accessToken = this.jwtService.sign({ sub: entity.id, role: entity.role }); // App plantas: genera un JWT para que el usuario quede logueado después de registrarse

    return {
      access_token: accessToken, // App plantas: devuelve el token al frontend para poder llamar endpoints protegidos como resend-verification
      user: {
        id: entity.id,
        email: entity.email,
        role: entity.role,
        isVerified: entity.isVerified, // App plantas: devuelve al front si el usuario está verificado
      },
    };
  }

  // App plantas: verifica el email usando el token recibido desde el frontend
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersRepo.findOne({
      where: { verificationToken: token }, // App plantas: busca el usuario que tenga guardado ese token
    });

    if (!user) {
      throw new BadRequestException('Token inválido o expirado'); // App plantas: si no existe usuario con ese token, devuelve error 400
    }

    user.isVerified = true; // App plantas: marca el email del usuario como verificado
    user.verificationToken = null; // App plantas: borra el token para que no pueda reutilizarse

    await this.usersRepo.save(user); // App plantas: guarda los cambios en la base de datos

    return { message: 'Email verificado' }; // App plantas: respuesta que recibe Angular cuando todo salió bien
  }

    // App plantas: reenvía el email de verificación para el usuario logueado
  async resendVerification(userId: string): Promise<{ message: string }> {
    const user = await this.usersRepo.findOne({
      where: { id: userId }, // App plantas: busca al usuario autenticado usando el id que viene del JWT
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado'); // App plantas: devuelve error si el usuario del JWT no existe
    }

    if (user.isVerified) {
      return { message: 'El email ya está verificado' }; // App plantas: evita reenviar verificación si ya está verificado
    }

    const verificationToken = randomUUID(); // App plantas: genera un nuevo token único de verificación
    user.verificationToken = verificationToken; // App plantas: guarda el nuevo token en el usuario

    await this.usersRepo.save(user); // App plantas: persiste el nuevo token en la base de datos

    const verificationLink = `http://localhost:4200/verify-email?token=${verificationToken}`; // App plantas: link que se enviará al usuario por email

    // App plantas: temporal para pruebas; después se reemplaza por un servicio real de email
    console.log('Nuevo link de verificación:', verificationLink);

    return { message: 'Email reenviado' }; // App plantas: respuesta que recibe Angular
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