import { ApiClient } from '@/data/datasources/ApiClient';
import { ApiError } from '@/data/errors/ApiError';

describe('ApiClient', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.EXPO_PUBLIC_API_BASE;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_BASE = 'http://localhost:3002';
    // @ts-expect-error reset singleton for isolated tests
    ApiClient['instance'] = null;
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_API_BASE = originalEnv;
    global.fetch = originalFetch;
  });

  function mockResponse(over: {
    ok?: boolean;
    status?: number;
    contentType?: string;
    json?: unknown;
    text?: string;
  }) {
    const {
      ok = true,
      status = 200,
      contentType = 'application/json',
      json: jsonBody,
      text: textBody,
    } = over;
    const textStr =
      textBody ?? (jsonBody !== undefined ? JSON.stringify(jsonBody) : '{}');
    return {
      ok,
      status,
      headers: {
        get: (h: string) => (h === 'content-type' ? contentType : null),
      },
      json: jest.fn().mockImplementation(() => Promise.resolve(JSON.parse(textStr))),
      text: jest.fn().mockResolvedValue(textStr),
    };
  }

  it('lanza si falta EXPO_PUBLIC_API_BASE', async () => {
    delete process.env.EXPO_PUBLIC_API_BASE;
    // @ts-expect-error reset
    ApiClient['instance'] = null;
    const client = ApiClient.getInstance();
    global.fetch = jest.fn();
    await expect(client.requestJson('/x')).rejects.toThrow(/Falta EXPO_PUBLIC_API_BASE/);
  });

  it('GET devuelve JSON parseado', async () => {
    const payload = { data: [{ id: '1' }] };
    global.fetch = jest.fn().mockResolvedValue(mockResponse({ json: payload }));

    const client = ApiClient.getInstance();
    await expect(client.requestJson('/bp/products')).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('mapea error HTTP a ApiError', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      mockResponse({
        ok: false,
        status: 404,
        json: { message: 'not product found' },
      }),
    );

    const client = ApiClient.getInstance();
    try {
      await client.requestJson('/bp/products/x');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(404);
    }
  });

  it('error de red lanza mensaje en español', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));

    const client = ApiClient.getInstance();
    await expect(client.requestJson('/x')).rejects.toThrow(/Error de red/);
  });

  it('204 devuelve undefined', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: { get: () => 'application/json' },
      json: jest.fn(),
      text: jest.fn().mockResolvedValue(''),
    });

    const client = ApiClient.getInstance();
    await expect(client.requestJson('/x')).resolves.toBeUndefined();
  });

  it('respuesta ok con texto JSON parseable sin header json', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'text/plain' },
      json: jest.fn(),
      text: jest.fn().mockResolvedValue('{"a":1}'),
    });

    const client = ApiClient.getInstance();
    await expect(client.requestJson('/x')).resolves.toEqual({ a: 1 });
  });
});
