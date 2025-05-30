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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  providers: [UserService,KeycloakStrategy],
})
export class UserModule {}
