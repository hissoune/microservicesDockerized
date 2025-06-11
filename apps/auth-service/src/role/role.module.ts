import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ConfigModule } from '@nestjs/config';
import { KeycloakHelper } from '../helpers/keycloak.helper';

@Module({
  imports: [
     ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env'],
        }),
    TypeOrmModule.forFeature([Role]),

  ],
  controllers: [RoleController],
  providers: [RoleService,KeycloakHelper],
})
export class RoleModule {}
