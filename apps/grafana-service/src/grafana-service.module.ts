import { Module } from '@nestjs/common';
import { GrafanaServiceController } from './grafana-service.controller';
import { GrafanaServiceService } from './grafana-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    })
  ],
  controllers: [GrafanaServiceController],
  providers: [GrafanaServiceService],
})
export class GrafanaServiceModule {}
