import { ApiClient } from './client';

export interface AccessToken {
  item: string;
}

export interface AccessTokenResponse {
  item: string;
}

export class AccessTokensAPI {
  constructor(private client: ApiClient) {}

  async login(emailOrUsername: string, password: string): Promise<AccessTokenResponse> {
    return this.client.request<AccessTokenResponse>('/access-tokens', {
      method: 'POST',
      body: { emailOrUsername, password },
    });
  }

  async logout(): Promise<void> {
    return this.client.request<void>('/access-tokens/me', {
      method: 'DELETE',
    });
  }

  async exchangeWithOidc(code: string, nonce: string): Promise<AccessTokenResponse> {
    return this.client.request<AccessTokenResponse>('/access-tokens/exchange-with-oidc', {
      method: 'POST',
      body: { code, nonce },
    });
  }
}
