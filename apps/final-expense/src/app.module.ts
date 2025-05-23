import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LogtailModule } from './logtail/logtail.module';
import { LogginInterceptor } from './logginInterseptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    LogtailModule,
  ],
  controllers: [AppController],
  providers: [AppService,LogginInterceptor],
})
export class AppModule {}
 