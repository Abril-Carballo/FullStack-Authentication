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
}