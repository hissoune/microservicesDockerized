import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LogtailModule } from '../logtail/logtail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LogtailModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
