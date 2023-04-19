import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
 
    @HttpCode(HttpStatus.OK)
    @Post('user/register')
    @Public()
    signUp(@Body() signUpDto: Record<string, any>) {
        const payload = { name: signUpDto.name, email: signUpDto.email, password: signUpDto.password, login_disabled: false, is_verified:false, role: 'user' }
      return this.authService.signUp(payload);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('user/login')
    @Public()
    signInUser(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.email, signInDto.password, 'user');
    }

    @HttpCode(HttpStatus.OK)
    @Post('admin/login')
    @Public()
    signInAdmin(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.email, signInDto.password, 'admin');
    }
  
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  }