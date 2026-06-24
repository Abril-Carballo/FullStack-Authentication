import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum'; // LABORATORIO 2

// LABORATORIO 2: entidad que mapea la tabla 'users' en SQLite
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') // genera un ID único automáticamente
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // LABORATORIO 2: select:false oculta el hash en consultas normales
  // hace que TypeORM nunca devuelva ese campo en consultas normales
  passwordHash!: string;

  @Column({ type: 'text', default: UserRole.USER })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean; // App plantas: indica si el usuario ya verificó su email

  @Column({ type: 'text', nullable: true })
  verificationToken!: string | null; // App plantas: guarda el token enviado por email para verificar la cuenta

  @Column({ type: 'text', nullable: true })
  resetPasswordToken!: string | null; // App plantas: guarda el token enviado por email para recuperar la contraseña

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires!: Date | null; // App plantas: guarda hasta cuándo es válido el token de recuperación
}