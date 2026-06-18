import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user-role.enum'; // LABORATORIO 3

export const ROLES_KEY = 'roles'; // LABORATORIO 3: clave para leer metadata de roles

// LABORATORIO 3: decorador que marca qué roles puede acceder a un handler
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);