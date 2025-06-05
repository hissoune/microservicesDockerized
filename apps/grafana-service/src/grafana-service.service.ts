import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GrafanaServiceService {
  getHello(): string {
    return 'up !';
  }



  async getAnalytics() {
    const response = await axios.get(
      process.env.GRAFANA_SEARCH_URL || 'http://host:port/api/search',
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
}
