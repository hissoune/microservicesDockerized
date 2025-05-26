import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class N8nServiceService {
  getHello(): string {
    return 'Hello World!';
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
}
