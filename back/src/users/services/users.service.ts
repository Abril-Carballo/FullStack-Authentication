
import { ExternalUser } from '../user.types';
import { USERS_GATEWAY, UsersGateway } from '../gateways/users.gateway';
import { BadGatewayException, Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
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
}

