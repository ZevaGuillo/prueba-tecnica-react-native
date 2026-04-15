import { ApiError } from '@/data/errors/ApiError';

function normalizeBaseUrl(raw: string): string {
  return raw.replace(/\/$/, '');
}

function mapStatusToSpanish(status: number, fallback: string): string {
  switch (status) {
    case 400:
      return 'Solicitud incorrecta. Revisa los datos enviados.';
    case 401:
      return 'No autorizado.';
    case 404:
      return 'No se encontró el recurso solicitado.';
    case 409:
      return 'Conflicto: el recurso ya existe o no se puede modificar.';
    case 500:
    case 502:
    case 503:
      return 'Error del servidor. Inténtalo de nuevo más tarde.';
    default:
      return fallback;
  }
}

async function parseHttpError(response: Response): Promise<{ message: string; body: unknown }> {
  const text = await response.text();
  let body: unknown = text;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      /* mantener texto */
    }
  }
  let message = mapStatusToSpanish(response.status, 'Error al comunicarse con el servidor.');
  if (body && typeof body === 'object' && body !== null && 'message' in body) {
    const m = (body as { message?: unknown }).message;
    if (typeof m === 'string' && m.trim()) {
      message = translateServerMessage(m);
    }
  } else if (typeof body === 'string' && body.trim()) {
    message = mapStatusToSpanish(response.status, body.slice(0, 200));
  }
  if (
    body &&
    typeof body === 'object' &&
    body !== null &&
    'name' in body &&
    typeof (body as { name?: unknown }).name === 'string' &&
    (body as { name: string }).name.includes('NotFound')
  ) {
    message = 'No se encontró el producto con ese identificador.';
  }
  return { message, body };
}

function translateServerMessage(message: string): string {
  const m = message.trim();
  if (/not product found|not found with that identifier/i.test(m)) {
    return 'No se encontró el producto con ese identificador.';
  }
  if (/duplicate|already exists/i.test(m)) {
    return 'Ese identificador ya está en uso.';
  }
  if (/invalid body/i.test(m)) {
    return 'Datos no válidos. Revisa los campos del formulario.';
  }
  return m;
}

/**
 * Cliente HTTP singleton (fetch). Base URL desde `EXPO_PUBLIC_API_BASE`.
 */
export class ApiClient {
  private static instance: ApiClient | null = null;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getBaseUrl(): string {
    const raw = process.env.EXPO_PUBLIC_API_BASE;
    if (!raw || !String(raw).trim()) {
      throw new Error(
        'Falta EXPO_PUBLIC_API_BASE. Copia .env.example a .env y define la URL del API.',
      );
    }
    return normalizeBaseUrl(String(raw).trim());
  }

  async requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
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

    let response: Response;
    try {
      response = await fetch(url, { ...init, headers });
    } catch {
      throw new Error('Error de red. Comprueba tu conexión e inténtalo de nuevo.');
    }

    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const { message, body } = await parseHttpError(response);
      throw new ApiError(message, response.status, body);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    if (isJson) {
      return (await response.json()) as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error('Respuesta del servidor no reconocida.');
    }
  }
}
