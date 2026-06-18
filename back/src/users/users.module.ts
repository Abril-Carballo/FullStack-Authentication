import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { LocalUsersGateway } from './gateways/local-users.gateway'; // EJERCICIO MEDIO 5
import { USERS_GATEWAY } from './gateways/users.gateway';
import { UsersService } from './services/users.service';

@Global()
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_GATEWAY,
      // EJERCICIO MEDIO 5: factory provider que elige el gateway según la variable de entorno
      useFactory: () => { // reemplaza useClass, nos permite manejar lo que se instancia y crea
        return process.env.USERS_SOURCE === 'local'
          ? new LocalUsersGateway() // crea un LocalUsersGateway (lee el JSON)
          : new JsonPlaceholderUsersGateway(); // Cualquier otro valor → crea un JsonPlaceholderUsersGateway (llama a la API)
      },
    },
  ],
  exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}