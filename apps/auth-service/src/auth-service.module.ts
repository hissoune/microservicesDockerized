import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
     isGlobal: true,
      envFilePath: ['.env'],
     }),
  
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 6432,
      username: 'postgres',
      password: '123',
      database: 'test_db',
      entities: [User],
      synchronize: true,
      logging: true,
     
    }),
    UserModule,
 

  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
