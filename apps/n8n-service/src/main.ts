import { NestFactory } from '@nestjs/core';
import { N8nServiceModule } from './n8n-service.module';
import Consul = require('consul');
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(N8nServiceModule);
  const consul = new Consul({
    host: process.env.CONSUL_HOST,
    port: parseInt(process.env.CONSUL_PORT || '8500', 10),
  });

  
  const serviceId = 'n8n-service';
  const serviceName = 'n8n-service';
  const serviceAddress = process.env.N8N_SERVICE_ADDRESS || 'localhost';
  const servicePort = parseInt( '3002', 10);

  const service = {
    id: serviceId,
    name: serviceName,
    address: serviceAddress,
    port: servicePort,
    tags: ['n8n-service'],
  };

  try {
    await consul.agent.service.register({
      ...service,
      check: {
        http: `http://${process.env.N8N_SERVICE_ADDRESS || "localhost"}:${servicePort}/health`,
        interval: "10s",
        name: `${serviceName}-health-check`,
        timeout: "5s",
      },
    });
    console.log(`Service ${serviceName} registered with Consul`);
  } catch (err) {
    console.error('Error registering service with Consul:', err);
  }
  app.enableCors({
    origin: 'localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });


  const n8nMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(N8nServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672/"],
      queue: "n8n_queue",
      queueOptions: {
        durable: true,
      },
    },
  });
  n8nMicroservice.listen();

  await app.listen(3002);
}
bootstrap();
