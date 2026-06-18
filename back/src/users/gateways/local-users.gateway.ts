import { Injectable } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';
import * as users from '../data/users.json'; // EJERCICIO MEDIO 5: lee el JSON local

// EJERCICIO MEDIO 5: gateway alternativo que lee desde un archivo JSON local
@Injectable()
export class LocalUsersGateway implements UsersGateway {
  async fetchAll(): Promise<ExternalUser[]> { // devuelve todos los usuarios del JSON
    return users as ExternalUser[];
  }

  async fetchById(id: number): Promise<ExternalUser | null> { // busca un usuario por id en el array del JSON, si no lo encuentra devuelve null
    const user = (users as ExternalUser[]).find((u) => u.id === id);
    return user ?? null;
  }
}