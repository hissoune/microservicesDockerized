import { Controller, Get } from '@nestjs/common';
import { GrafanaServiceService } from './grafana-service.service';

@Controller()
export class GrafanaServiceController {
  constructor(private readonly grafanaServiceService: GrafanaServiceService) {}

  @Get('health')
  getHello(): string {
    return this.grafanaServiceService.getHello();
  }

  @Get('get-analytics')
  async getAnalytics() {
    return this.grafanaServiceService.getAnalytics();
  }
}
