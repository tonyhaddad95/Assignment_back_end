import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  postRepository: any;
  userService: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateLoginDisabled(id: number, loginDisabled: boolean): Promise<void> {
    await this.userRepository.update(id, { login_disabled: loginDisabled });
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async signInUser(email): Promise<User> {
    return this.userRepository.findOne({ where: { email }});
  }

  async getCount(): Promise<number> {
    return this.userRepository.count();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['posts']
    });
  }
}





