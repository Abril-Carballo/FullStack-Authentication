import { ExternalUser } from '../user.types';

export const USERS_GATEWAY = 'USERS_GATEWAY';

export interface UsersGateway {
  fetchAll(): Promise<ExternalUser[]>;
  //Ejercicio 4: Añadir el método fetchById a la interfaz UsersGateway
  fetchById(id: number): Promise<ExternalUser | null>;
}

