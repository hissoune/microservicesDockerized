import { Module } from '@nestjs/common';
import { N8nServiceController } from './n8n-service.controller';
import { N8nServiceService } from './n8n-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',

    })
  ],
  controllers: [N8nServiceController],
  providers: [N8nServiceService],
})
export class N8nServiceModule {}
