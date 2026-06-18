import axios from 'axios';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

export class JsonPlaceholderUsersGateway implements UsersGateway {
  async fetchAll(): Promise<ExternalUser[]> {
    const { data } = await axios.get<ExternalUser[]>(
      'https://jsonplaceholder.typicode.com/users',
    );
    return data;
  }
   
  //METÓDO AÑADIDO EJERCICIO 4
  async fetchById(id: number): Promise<ExternalUser | null> {
  try {
    const { data } = await axios.get<ExternalUser>(
      `https://jsonplaceholder.typicode.com/users/${id}`,
    );
    return data;
  } catch {
    return null;
  }
}
}

