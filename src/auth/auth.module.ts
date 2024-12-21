import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { userProviders } from 'src/user/user.providers';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, ...userProviders, ...databaseProviders],
})
export class AuthModule {}
