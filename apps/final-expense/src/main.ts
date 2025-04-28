import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Consul = require('consul');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const consul = new Consul({
    host: process.env.CONSUL_HOST,
    port: parseInt(process.env.CONSUL_PORT || "8500", 10),
  });

  const serviceId = 'final-expense-service';
  const serviceName = 'final-expense';
  const serviceAddress = process.env.SERVICE_ADDRESS || 'localhost';
  const servicePort = parseInt(process.env.PORT || '3000', 10);

  const service = {
    id: serviceId,
    name: serviceName,
    address: serviceAddress,
    port: servicePort,
    tags: ['final-expense'],
  };
  
  try {
    await consul.agent.service.register({...service, check: {
      http: `http://${process.env.HOST || "localhost"}:${servicePort}/health`, 
      interval: "10s",
      name: `${serviceName}-health-check`,
      timeout: "10s",
    }});
    console.log(`Service ${serviceName} registered with Consul`);
  } catch (err) {
    console.error('Error registering service with Consul:', err);
  }
  
console.log(process.env.PORT);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
