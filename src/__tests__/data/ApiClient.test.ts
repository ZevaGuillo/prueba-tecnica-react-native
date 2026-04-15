import { ApiClient } from '@/data/ApiClient';
import { ApiError, NetworkTransportError } from '@/data/ApiError';

describe('ApiClient', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.EXPO_PUBLIC_API_BASE;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_BASE = 'http://localhost:3002';
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_API_BASE = originalEnv;
    global.fetch = originalFetch;
  });

  function mockJsonResponse(over: {
    ok?: boolean;
    status?: number;
    json?: unknown;
  }) {
    const { ok = true, status = 200, json: jsonBody } = over;
    const data = jsonBody !== undefined ? jsonBody : {};
    return {
      ok,
      status,
      headers: { get: () => 'application/json' },
      json: jest.fn().mockResolvedValue(data),
      text: jest.fn().mockResolvedValue(JSON.stringify(data)),
    };
  }

  it('lanza si falta EXPO_PUBLIC_API_BASE', async () => {
    delete process.env.EXPO_PUBLIC_API_BASE;
    const client = new ApiClient();
    global.fetch = jest.fn();
    await expect(client.requestJson('/x')).rejects.toThrow(/Falta EXPO_PUBLIC_API_BASE/);
  });

  it('acepta baseUrl en opciones', async () => {
    const payload = { data: [{ id: '1' }] };
    global.fetch = jest.fn().mockResolvedValue(mockJsonResponse({ json: payload }));

    const client = new ApiClient({ baseUrl: 'http://api.example' });
    await expect(client.requestJson('/bp/products')).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.example/bp/products',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('GET devuelve JSON parseado', async () => {
    const payload = { data: [{ id: '1' }] };
    global.fetch = jest.fn().mockResolvedValue(mockJsonResponse({ json: payload }));

    const client = new ApiClient({ baseUrl: 'http://localhost:3002' });
    await expect(client.requestJson('/bp/products')).resolves.toEqual(payload);
  });

  it('mapea error HTTP a ApiError', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: () => 'application/json' },
      text: jest.fn().mockResolvedValue(JSON.stringify({ message: 'not product found' })),
    });

    const client = new ApiClient({ baseUrl: 'http://localhost:3002' });
    try {
      await client.requestJson('/bp/products/x');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(404);
    }
  });

  it('error de red lanza NetworkTransportError', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));

    const client = new ApiClient({ baseUrl: 'http://localhost:3002' });
    await expect(client.requestJson('/x')).rejects.toBeInstanceOf(NetworkTransportError);
  });

  it('JSON inválido en éxito lanza Error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: jest.fn().mockRejectedValue(new SyntaxError('bad json')),
    });

    const client = new ApiClient({ baseUrl: 'http://localhost:3002' });
    await expect(client.requestJson('/x')).rejects.toThrow('INVALID_SERVER_JSON');
  });

  it('requestOk consume cuerpo sin devolverlo', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      text: jest.fn().mockResolvedValue('{"message":"ok"}'),
    });

    const client = new ApiClient({ baseUrl: 'http://localhost:3002' });
    await expect(client.requestOk('/x')).resolves.toBeUndefined();
  });
});
