import { Module } from '@nestjs/common';
import { RoleHasPermissionService } from './role_has_permission.service';
import { RoleHasPermissionController } from './role_has_permission.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleHasPermission } from './entities/role_has_permission.entity';
import { PermissionsGuard } from '../gurds/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([RoleHasPermission]),
  ],
  controllers: [RoleHasPermissionController],
  providers: [RoleHasPermissionService, PermissionsGuard],
})
export class RoleHasPermissionModule {}
