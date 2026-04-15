import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { ApiClient } from '@/data/ApiClient';
import { ApiError } from '@/data/ApiError';
import { ProductRepositoryImpl } from '@/data/repositories/ProductRepositoryImpl';
import { sampleProduct } from '../../fixtures/financialProduct';

function createClient(over: Partial<ApiClient> = {}): ApiClient {
  return {
    requestJson: jest.fn(),
    requestOk: jest.fn(),
    ...over,
  } as unknown as ApiClient;
}

describe('ProductRepositoryImpl', () => {
  const dto = {
    id: 'p1',
    name: 'Nombre largo ok',
    description: '1234567890',
    logo: 'x.png',
    date_release: '2030-01-01',
    date_revision: '2031-01-01',
  };

  it('getAll mapea filas a dominio', async () => {
    const requestJson = jest.fn().mockResolvedValue({ data: [dto] });
    const repo = new ProductRepositoryImpl(createClient({ requestJson }));

    const out = await repo.getAll();
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('p1');
    expect(requestJson).toHaveBeenCalledWith('/bp/products', { method: 'GET' });
  });

  it('getById devuelve null en 404', async () => {
    const requestJson = jest.fn().mockRejectedValue(new ApiError({ status: 404, body: {} }));
    const repo = new ProductRepositoryImpl(createClient({ requestJson }));

    await expect(repo.getById('x')).resolves.toBeNull();
  });

  it('getById acepta respuesta envuelta en data', async () => {
    const requestJson = jest.fn().mockResolvedValue({ data: dto });
    const repo = new ProductRepositoryImpl(createClient({ requestJson }));

    await expect(repo.getById('p1')).resolves.toMatchObject({ id: 'p1' });
  });

  it('update hace PUT y vuelve a leer el producto', async () => {
    const requestOk = jest.fn().mockResolvedValue(undefined);
    const requestJson = jest.fn().mockResolvedValue({ data: dto });
    const repo = new ProductRepositoryImpl(createClient({ requestOk, requestJson }));

    const patch: Partial<FinancialProduct> = { name: 'Otro nombre largo' };
    await expect(repo.update('p1', patch)).resolves.toMatchObject({ id: 'p1' });
    expect(requestOk).toHaveBeenCalledWith(
      '/bp/products/p1',
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(requestJson).toHaveBeenCalledWith('/bp/products/p1', { method: 'GET' });
  });

  it('create valida data en respuesta', async () => {
    const requestJson = jest.fn().mockResolvedValue({ data: dto });
    const repo = new ProductRepositoryImpl(createClient({ requestJson }));
    const p = sampleProduct({ id: 'p1' });

    await expect(repo.create(p)).resolves.toMatchObject({ id: 'p1' });
  });

  it('create lanza si la respuesta no incluye producto válido', async () => {
    const requestJson = jest.fn().mockResolvedValue({ message: 'sin data' });
    const repo = new ProductRepositoryImpl(createClient({ requestJson }));

    await expect(repo.create(sampleProduct())).rejects.toThrow(/inválida/);
  });

  it('delete llama requestOk DELETE', async () => {
    const requestOk = jest.fn().mockResolvedValue(undefined);
    const repo = new ProductRepositoryImpl(createClient({ requestOk }));

    await repo.delete('z');
    expect(requestOk).toHaveBeenCalledWith('/bp/products/z', { method: 'DELETE' });
  });

  it('verifyId valida boolean JSON', async () => {
    const requestJson = jest.fn().mockResolvedValue(true);
    const repo = new ProductRepositoryImpl(createClient({ requestJson }));

    await expect(repo.verifyId('id1')).resolves.toBe(true);
    expect(requestJson).toHaveBeenCalledWith('/bp/products/verification/id1', { method: 'GET' });
  });

  it('verifyId acepta { exists: boolean }', async () => {
    const requestJson = jest.fn().mockResolvedValue({ exists: true });
    const repo = new ProductRepositoryImpl(createClient({ requestJson }));

    await expect(repo.verifyId('id1')).resolves.toBe(true);
  });
});
