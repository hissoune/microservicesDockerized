import axios from "axios";


export class KeycloakHelper {

  public keycloakUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCKLOAK_REALM}/protocol/openid-connect/token`;
  public keycloakAdminUrl = `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCKLOAK_REALM}/users`;
  public clientId = process.env.KEYCLOAK_CLIENT_ID ;
  public clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  public grantType = process.env.KEYCLOAK_GRANT_TYPE ;
  public grantTypeAdmin = process.env.KEYCLOAK_GRANT_TYPE_ADMIN ;
public keycloakRefreshGrantType = process.env.KEYCLOAK_REFRESH_GRANT_TYPE;

 
  async getAdminToken(): Promise<string> {
    try {
      const response = await axios.post(
        this.keycloakUrl,
        new URLSearchParams({
          grant_type: this.grantTypeAdmin || 'client_credentials',
          client_id: this.clientId || 'admin-cli',
          client_secret:  this.clientSecret || 'your-client-secret',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to get admin token');
    }
  }
}
