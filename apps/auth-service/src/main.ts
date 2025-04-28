import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import Consul = require('consul');
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

 
  const consul = new Consul({
    host: process.env.CONSUL_HOST,
    port: parseInt(process.env.CONSUL_PORT || '8500', 10),
  });

  const serviceId = 'auth-service';
  const serviceName = 'auth-service';
  const serviceAddress = process.env.SERVICE_ADDRESS || 'localhost';
  const servicePort = parseInt(process.env.SERVICE_PORT || '3000', 10);

  const service = {
    id: serviceId,
    name: serviceName,
    address: serviceAddress,
    port: servicePort,
    tags: ['auth-service'],
  };

  try {
    await consul.agent.service.register(service);
    console.log(`Service ${serviceName} registered with Consul`);
  } catch (err) {
    console.error('Error registering service with Consul:', err);
  }
   
  const authMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(AuthServiceModule, {
    transport: Transport.RMQ, 
      options: {
        urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672/"],
        queue: "auth_queue",
        queueOptions: {
          durable: false,
        },
      },
  });
  authMicroservice.listen();




  await app.listen(process.env.port ?? 3001);
}
bootstrap();
