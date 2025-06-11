import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { LogtailModule } from './logtail/logtail.module';
import { RoleModule } from './role/role.module';
import { Role } from './role/entities/role.entity';
import { PermissionModule } from './permission/permission.module';
import { RoleHasPermissionModule } from './role_has_permission/role_has_permission.module';
import { RoleHasPermission } from './role_has_permission/entities/role_has_permission.entity';
import { Permission } from './permission/entities/permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
     isGlobal: true,
      envFilePath: ['.env'],
     }),
  

  
     TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 6432,
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'dbname',
      entities: [User, Role, Permission, RoleHasPermission],
      synchronize: true,
  
    }),
    
    UserModule,
    LogtailModule,
    RoleModule,
    PermissionModule,
    RoleHasPermissionModule,


  ],
  controllers: [AuthServiceController],
  providers: [
    AuthServiceService,
  

  ],
})
export class AuthServiceModule {}
