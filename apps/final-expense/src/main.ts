import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogginInterceptor } from './logginInterseptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LogginInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
