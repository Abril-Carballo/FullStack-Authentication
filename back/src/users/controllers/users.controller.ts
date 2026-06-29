import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<ExternalUser[]> {
    return this.usersService.findAll();
  }

  // 1.6: endpoint para cambiar la contraseña del usuario autenticado
  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @Req() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    return this.usersService.updatePassword(req.user.id, body.currentPassword, body.newPassword); // 1.6: req.user.id viene de la estrategia JWT
  }

  // 1.6: endpoint para cambiar el email del usuario autenticado
  @Patch('me/email')
  @UseGuards(JwtAuthGuard)
  updateEmail(
    @Req() req: any,
    @Body() body: { newEmail: string; password: string },
  ): Promise<{ message: string }> {
    return this.usersService.updateEmail(req.user.id, body.newEmail, body.password); // 1.6: req.user.id viene de la estrategia JWT
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExternalUser> {
    return this.usersService.findOne(Number(id));
  }
}

