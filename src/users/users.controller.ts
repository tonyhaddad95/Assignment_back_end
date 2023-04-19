import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('count')
  async getCount(): Promise<{ count: number }> {
    const count = await this.usersService.getCount();
    return { count };
  }

  @Post(':id/login-status')
  async updateUserLoginDisabled(
    @Param('id') id: number,
    @Body() body: { login_disabled: boolean },
  ): Promise<void> {
    await this.usersService.updateLoginDisabled(id, body.login_disabled);
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
