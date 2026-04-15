import { ApiError, NetworkTransportError } from '@/data/ApiError';

function normalizeBaseUrl(raw: string): string {
  return raw.replace(/\/$/, '');
}

async function responseToApiError(response: Response): Promise<ApiError> {
  const text = await response.text();
  let body: unknown = text;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      /* texto plano */
    }
  }
  let serverMessage: string | undefined;
  let serverName: string | undefined;
  if (body && typeof body === 'object' && body !== null) {
    if ('message' in body && typeof (body as { message?: unknown }).message === 'string') {
      serverMessage = (body as { message: string }).message;
    }
    if ('name' in body && typeof (body as { name?: unknown }).name === 'string') {
      serverName = (body as { name: string }).name;
    }
  }
  return new ApiError({
    status: response.status,
    body,
    serverMessage,
    serverName,
  });
}

export type ApiClientOptions = {
  baseUrl?: string;
};

/**
 * Cliente HTTP mínimo (`fetch`). Inyectable para tests (`baseUrl`).
 */
export class ApiClient {
  constructor(private readonly options: ApiClientOptions = {}) {}

  private getBaseUrl(): string {
    const raw = this.options.baseUrl ?? process.env.EXPO_PUBLIC_API_BASE;
    if (!raw || !String(raw).trim()) {
      throw new Error(
        'Falta EXPO_PUBLIC_API_BASE. Copia .env.example a .env y define la URL del API.',
      );
    }
    return normalizeBaseUrl(String(raw).trim());
  }

  /** Respuesta JSON; errores HTTP como `ApiError`. */
  async requestJson(path: string, init: RequestInit = {}): Promise<unknown> {
    const response = await this.doFetch(path, init);
    if (!response.ok) {
      throw await responseToApiError(response);
    }
    try {
      return await response.json();
    } catch {
      throw new Error('INVALID_SERVER_JSON');
    }
  }

  /** Éxito HTTP y consume el cuerpo (p. ej. DELETE). */
  async requestOk(path: string, init: RequestInit = {}): Promise<void> {
    const response = await this.doFetch(path, init);
    if (!response.ok) {
      throw await responseToApiError(response);
    }
    await response.text();
  }

  private async doFetch(path: string, init: RequestInit): Promise<Response> {
    const base = this.getBaseUrl();
    const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
    const headers: HeadersInit = {
      Accept: 'application/json',
      ...(init.headers ?? {}),
    };
    const headersRecord = headers as Record<string, unknown>;
    if (init.body !== undefined && !('Content-Type' in headersRecord)) {
      headersRecord['Content-Type'] = 'application/json';
    }

    try {
      return await fetch(url, { ...init, headers });
    } catch (e) {
      throw new NetworkTransportError(e);
    }
  }
}
