import { Body, Controller, Get, Post } from '@nestjs/common';
import { N8nServiceService } from './n8n-service.service';
import axios from 'axios';

@Controller()
export class N8nServiceController {
  constructor(private readonly n8nServiceService: N8nServiceService) {}

  @Get('health')
  getHello(): string {
    return "N8n Service is running!";
  }


  @Post('create-workflow')
  async createWorkflow(@Body() body: any) {
    console.log("Creating workflow with data:", body);
    
   return this.n8nServiceService.createWorkflow(body);
  }
}
