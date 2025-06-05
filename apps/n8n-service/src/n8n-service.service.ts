import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class N8nServiceService {
  getHello(): string {
    return 'Hello World!';
  }
 
  async getAnalitics() {
    const response = await axios.get(
      process.env.GRAFANA_SEARCH8URL || 'http://host:port/api/search',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}`, 
        },
      }
    );

     

    const iframeslinks = await Promise.all(
      response.data.map(async (dash: any) => {
        const dashdata = await axios.get(
          `${process.env.GRAFANA_DASHBOARD_URL}/${dash.uid}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}`,
            },
          }
        );
      console.log('dashdata', dashdata.data.dashboard.panels);
      
        return dashdata.data.dashboard.panels.map((panel: any) => {
          return {
            title: panel.title,
            iframeLink: `${process.env.GRAFANA_URL}/d-solo/${dash.uid}?orgId=${dash.orgId}&panelId=${panel.id}&fullscreen&theme=dark`,
          };
        });
      })
    );
    return iframeslinks.flat();
  }
   
  async getWorkflows() {
    const response = await axios.get(
      `${process.env.N8N_SERVICE_URL}/api/v1/workflows`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`, 
        },
      }
    );
    return response.data;
  }

  async getWorkflow(workflowId: string) {
    const response = await axios.get(
      `${process.env.N8N_SERVICE_URL}/api/v1/workflows/${workflowId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`, // Ensure you have set N8N_API_KEY in your environment variables
        },
      }
    );
    return response.data;
  }

  async createWorkflow(workflow:any){
   
     const response = await axios.post(
    `${process.env.N8N_SERVICE_URL}/api/v1/workflows`,workflow,
    
    {
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`, // Ensure you have set N8N_API_KEY in your environment variables
      },
    }
  );
 
   
  return response.data;
  }

  async updateWorkflow(workflow:any){
    const { id, ...workflowwithoutId } = workflow;
    const response = await axios.put(
      `${process.env.N8N_SERVICE_URL}/api/v1/workflows/${workflow.id}`, workflowwithoutId,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`, // Ensure you have set N8N_API_KEY in your environment variables
        },
      }
    );
    return response.data;
  }

  async deleteWorkflow(workflowId:string){
    const response = await axios.delete(
      `${process.env.N8N_SERVICE_URL}/api/v1/workflows/${workflowId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`, // Ensure you have set N8N_API_KEY in your environment variables
        },
      }
    );
    return response.data;
  }

  async activateWorkflow(workflowId: string) {
    const response = await axios.post(
      `${process.env.N8N_SERVICE_URL}/api/v1/workflows/${workflowId}/activate`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`, // Ensure you have set N8N_API_KEY in your environment variables
        },
      }
    );
    return response.data;
  }

  async deactivateWorkflow(workflowId: string) {
    const response = await axios.post(
      `${process.env.N8N_SERVICE_URL}/api/v1/workflows/${workflowId}/deactivate`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`, 
        },
      }
    );
    return response.data;
  }

  async handleWorkflowCreated(data: any) {
    console.log('Workflow created:', data);

    await axios.post(
      `${process.env.N8N_SERVICE_URL}/webhook/webhook`,data,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': `${process.env.N8N_API_KEY}`,
        }}).catch(error => {
      console.error('Error activating workflow:', error);
        })

  }



}
