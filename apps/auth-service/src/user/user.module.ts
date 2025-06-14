import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LogtailModule } from '../logtail/logtail.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { KeycloakStrategy } from './keycloak.strategy';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { KeycloakHelper } from '../helpers/keycloak.helper';
import { RoleHasPermissionService } from '../role_has_permission/role_has_permission.service';
import { RoleHasPermission } from '../role_has_permission/entities/role_has_permission.entity';

export const apiRequestCounter = new Counter({
  name: 'api_request_count',
  help: 'Total number of API requests',
  labelNames: ['method', 'path', 'status'],
});
@Module({
  imports: [
PrometheusModule.register(),
    TypeOrmModule.forFeature([User, RoleHasPermission]),
    PassportModule.register({ defaultStrategy: 'keycloak' }),
    LogtailModule,
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    
       ClientsModule.register(
      [
        {
            name: 'N8N_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672/'],
              queue: 'n8n_queue',
              queueOptions: {
                durable: true,
              },
            },
          }
    
      ]),
  ],
  controllers: [UserController],
  providers: [UserService,KeycloakStrategy,
    {
      provide: 'PROM_METRIC_API_REQUEST_COUNT',
      useValue: apiRequestCounter,
    },
    KeycloakHelper,
    RoleHasPermissionService
  ],
    exports: ['PROM_METRIC_API_REQUEST_COUNT',KeycloakHelper,RoleHasPermissionService],

})
export class UserModule {}
