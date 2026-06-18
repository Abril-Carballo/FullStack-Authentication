import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<ExternalUser[]> {
    return this.usersService.findAll();
  }

 @Get(':id')
  findOne(@Param('id') id: string): Promise<ExternalUser> {
  return this.usersService.findOne(Number(id));
}
}
