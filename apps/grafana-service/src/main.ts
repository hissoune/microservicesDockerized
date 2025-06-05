import { NestFactory } from '@nestjs/core';
import { GrafanaServiceModule } from './grafana-service.module';
import Consul = require('consul');
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GrafanaServiceModule);
  app.useGlobalPipes(new ValidationPipe());

  const consul = new Consul({
    host: process.env.CONSUL_HOST,
    port: parseInt(process.env.CONSUL_PORT || '8500', 10),
  });
  const serviceId = 'grafana-service';
  const serviceName = 'grafana-service';
  const serviceAddress = process.env.GRAFANA_SERVICE_ADDRESS || 'localhost';
  const servicePort = parseInt(process.env.GRAFANA_SERVICE_PORT || '6000', 10);
  const service = {
    id: serviceId,
    name: serviceName,
    address: serviceAddress,
    port: servicePort,
    tags: ['grafana-service'],
  };

  await consul.agent.service.register({
    ...service,
    check: {
      http: `http://${process.env.GRAFANA_SERVICE_ADDRESS || "localhost"}:${servicePort}/health`,
      name: 'HTTP API Health Check',
      interval: '10s',
      timeout: '5s'
    }
  });

  console.log(`Service ${serviceName} registered with Consul`);
  const grafanaMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(GrafanaServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672/"],
      queue: "grafana_queue",
      queueOptions: {
        durable: true,
      },
    },
  });
  grafanaMicroservice.listen();
  await app.listen(process.env.GRAFANA_SERVICE_PORT ?? 6000);
}
bootstrap();
