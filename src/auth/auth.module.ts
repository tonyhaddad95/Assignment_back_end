import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { jwtConfig } from '../../constants';
import { ConfigModule, ConfigService  } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, ConfigService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}