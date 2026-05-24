import * as http2 from 'http2';
import * as url from 'url';
import { ConfigManager } from '../utils/config';

export interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  bearerToken?: string;
}

export class ApiClient {
  private apiKey: string;
  private baseUrl: string;
  private bearerToken: string;

  constructor(opts?: ClientOptions) {
    const config = new ConfigManager();
    let raw =
      opts?.baseUrl ||
      process.env.PLANKA_BASE_URL ||
      config.get('baseUrl') ||
      '';
    this.baseUrl = raw.replace(/\/+$/, '');
    this.apiKey =
      opts?.apiKey ||
      process.env.PLANKA_API_KEY ||
      config.get('apiKey') ||
      '';
    this.bearerToken =
      opts?.bearerToken ||
      process.env.PLANKA_BEARER_TOKEN ||
      config.get('bearerToken') ||
      '';
  }

  isConfigured(): boolean {
    return !!this.baseUrl && (!!this.apiKey || !!this.bearerToken);
  }

  private getHeaders(contentType?: string): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    } else if (this.bearerToken) {
      headers['authorization'] = `Bearer ${this.bearerToken}`;
    }
    if (contentType) {
      headers['content-type'] = contentType;
    }
    return headers;
  }

  private buildUrl(path: string, query?: Record<string, string | undefined>): string {
    let fullPath = `/api${path}`;
    if (query) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== '') {
          params.set(k, v);
        }
      }
      const qs = params.toString();
      if (qs) {
        fullPath += `?${qs}`;
      }
    }
    return fullPath;
  }

  request<T>(path: string, options: {
    method?: string;
    body?: unknown;
    query?: Record<string, string | undefined>;
  } = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      const { method = 'GET', body, query } = options;
      const parsed = new url.URL(this.baseUrl);
      const fullPath = this.buildUrl(path, query);

      const client = http2.connect(`${parsed.protocol}//${parsed.host}`, {
        rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
      });

      const headers: Record<string, string> = {
        [http2.constants.HTTP2_HEADER_METHOD]: method,
        [http2.constants.HTTP2_HEADER_PATH]: fullPath,
        [http2.constants.HTTP2_HEADER_AUTHORITY]: parsed.host,
        [http2.constants.HTTP2_HEADER_SCHEME]: parsed.protocol.replace(':', ''),
        'accept': 'application/json, */*',
        'user-agent': 'planka-cli/0.1.0',
      };

      const extraHeaders = this.getHeaders(body instanceof FormData ? undefined : 'application/json');
      for (const [k, v] of Object.entries(extraHeaders)) {
        headers[k] = v;
      }

      let bodyData: string | Buffer | undefined;
      if (body !== undefined && body !== null) {
        if (body instanceof FormData) {
          reject(new Error('FormData uploads not supported via http2; use requestWithFetch for file uploads'));
          client.close();
          return;
        }
        bodyData = JSON.stringify(body);
      }

      const req = client.request(headers, {
        endStream: bodyData === undefined,
      });

      const chunks: Buffer[] = [];
      let statusCode = 0;

      req.on('response', (responseHeaders) => {
        statusCode = responseHeaders[':status'] || 0;
      });

      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        client.close();
        const text = Buffer.concat(chunks).toString('utf-8');

        if (statusCode >= 400) {
          reject(new Error(`API ${statusCode}: ${text}`));
          return;
        }

        if (statusCode === 204 || !text) {
          resolve(undefined as unknown as T);
          return;
        }

        try {
          resolve(JSON.parse(text) as T);
        } catch {
          resolve(text as unknown as T);
        }
      });

      req.on('error', (err) => {
        client.close();
        reject(err);
      });

      client.on('error', (err) => {
        reject(err);
      });

      if (bodyData) {
        req.end(bodyData);
      }
    });
  }

  async uploadFile<T>(path: string, formData: FormData): Promise<T> {
    const bodyData = JSON.stringify({});
    return this.request<T>(path, { method: 'POST', body: bodyData });
  }

  requestWithFetch<T>(path: string, options: {
    method?: string;
    body?: unknown;
    query?: Record<string, string | undefined>;
  } = {}): Promise<T> {
    const { method = 'GET', body, query } = options;
    const fullPath = this.buildUrl(path, query);
    const fetchUrl = `${this.baseUrl}${fullPath}`;

    const fetchOptions: RequestInit = {
      method,
      headers: this.getHeaders(body instanceof FormData ? undefined : 'application/json'),
    };

    if (body !== undefined && body !== null) {
      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    return fetch(fetchUrl, fetchOptions).then(async (response) => {
      if (!response.ok) {
        let detail = '';
        try {
          detail = await response.text();
        } catch { /**/ }
        throw new Error(`API ${response.status}: ${detail}`);
      }
      if (response.status === 204) {
        return undefined as unknown as T;
      }
      const text = await response.text();
      if (!text) {
        return undefined as unknown as T;
      }
      return JSON.parse(text) as T;
    });
  }
}
