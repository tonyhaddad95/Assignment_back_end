import { Injectable, Dependencies, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config()

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  usersService: any;
  jwtService: any;

  constructor(usersService, jwtService, private configService: ConfigService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }
  async signIn(email: string, password: string, role: string) {
    const user = await this.usersService.signInUser(email);
    if (user && role === user.role) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      const isAbleToLogin = !user.login_disabled;
      const isVerified = user.is_verified
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      } else if (!isAbleToLogin) {
        throw new UnauthorizedException('Login is disabled');
      } else if (!isVerified){
        throw new UnauthorizedException('user is not verified');
      }
      
      const jwtSecret = process.env.JWT_SECRET;
      const payload = { username: user.email, sub: user.idusers, role };
      return {
        access_token: await this.jwtService.signAsync(payload, { secret: jwtSecret }),
        role: role,
        user: user
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
    
  }
  
  async signUp(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 10); // Hash the password with a salt of 10 rounds
    const user = { ...payload, password: hashedPassword }; // Create a new user object with the hashed password
    // Create a new user entity and save it to the database
    await this.usersService.createUser(user);
    return 'Successfully registered'
  }

  async signOut(user: any): Promise<void> {
    // You can store the logged out user information in a database or memory, depending on your requirements
    // In this example, we'll just remove the token from the user object

    const updatedUser = { ...user, token: '' };
    await this.usersService.updateUser(updatedUser);
  }

}