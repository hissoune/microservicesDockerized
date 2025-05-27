import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { N8nServiceService } from './n8n-service.service';

@Controller()
export class N8nServiceController {
  constructor(private readonly n8nServiceService: N8nServiceService) {}

  @Get('health')
  getHello(): string {
    return "N8n Service is running!";
  }
 
  @Get('get-workflows')
  async getWorkflows() {
    return this.n8nServiceService.getWorkflows();
  }



  @Get('get-workflow/:id')
  async getWorkflow(@Param() param: any) {
      console.log("Fetching workflow with ID:", param.id);
    
    return this.n8nServiceService.getWorkflow(param.id);
  }
  
  
  @Post('create-workflow')
  async createWorkflow(@Body() body: any) {
    console.log("Creating workflow with data:", body);
    
   return this.n8nServiceService.createWorkflow(body);
  }

 @Patch('update-workflow')
  async updateWorkflow(@Body() body: any) {
    console.log("Updating workflow with data:", body);
    
    return this.n8nServiceService.updateWorkflow(body);
  }

  @Delete('delete-workflow/:id')
  async deleteWorkflow(@Param() workflowId: any) {
 console.log("Deleting workflow with ID:", workflowId.id);
 
     return this.n8nServiceService.deleteWorkflow(workflowId.id);

  }

}
