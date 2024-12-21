import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  controllers: [UserController],
  providers: [UserService, ...userProviders, ...databaseProviders],
})
export class UserModule {}
