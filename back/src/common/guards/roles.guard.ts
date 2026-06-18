import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator'; // LABORATORIO 3
import { UserRole } from '../../users/user-role.enum'; // LABORATORIO 3

// LABORATORIO 3: guard que verifica si el usuario tiene el rol requerido
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    // LABORATORIO 3: si no hay roles requeridos, deja pasar
    if (!required?.length) return true;

    const req = ctx.switchToHttp().getRequest();
    const role = req.user?.role as UserRole | undefined;

    // LABORATORIO 3: verifica que el rol del usuario esté en los requeridos
    return !!role && required.includes(role);
  }
}