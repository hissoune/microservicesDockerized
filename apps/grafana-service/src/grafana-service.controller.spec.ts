import { Test, TestingModule } from '@nestjs/testing';
import { GrafanaServiceController } from './grafana-service.controller';
import { GrafanaServiceService } from './grafana-service.service';

describe('GrafanaServiceController', () => {
  let grafanaServiceController: GrafanaServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GrafanaServiceController],
      providers: [GrafanaServiceService],
    }).compile();

    grafanaServiceController = app.get<GrafanaServiceController>(GrafanaServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(grafanaServiceController.getHello()).toBe('Hello World!');
    });
  });
});
