import type { ApiClient } from '@/data/datasources/ApiClient';
import { ApiError } from '@/data/errors/ApiError';
import { ProductRemoteDataSource } from '@/data/datasources/ProductRemoteDataSource';
import { sampleProduct } from '../../fixtures/financialProduct';

function createClient(requestJson: jest.Mock): ApiClient {
  return { requestJson } as unknown as ApiClient;
}

describe('ProductRemoteDataSource', () => {
  it('fetchAll devuelve data o []', async () => {
    const requestJson = jest.fn().mockResolvedValue({ data: [{ id: 'a', name: 'Nombre largo', description: '1234567890', logo: 'x', date_release: '2030-01-01', date_revision: '2031-01-01' }] });
    const ds = new ProductRemoteDataSource(createClient(requestJson));

    const rows = await ds.fetchAll();
    expect(rows).toHaveLength(1);
    expect(requestJson).toHaveBeenCalledWith('/bp/products', { method: 'GET' });
  });

  it('fetchById devuelve null en 404', async () => {
    const requestJson = jest.fn().mockRejectedValue(new ApiError('nf', 404));
    const ds = new ProductRemoteDataSource(createClient(requestJson));

    await expect(ds.fetchById('x')).resolves.toBeNull();
  });

  it('fetchById acepta respuesta envuelta en data', async () => {
    const dto = {
      id: 'p',
      name: 'Nombre largo',
      description: '1234567890',
      logo: 'x.png',
      date_release: '2030-01-01',
      date_revision: '2031-01-01',
    };
    const requestJson = jest.fn().mockResolvedValue({ data: dto });
    const ds = new ProductRemoteDataSource(createClient(requestJson));

    await expect(ds.fetchById('p')).resolves.toMatchObject({ id: 'p' });
  });

  it('update hace PUT y vuelve a leer el producto', async () => {
    const dto = {
      id: 'u1',
      name: 'Nombre largo',
      description: '1234567890',
      logo: 'x.png',
      date_release: '2030-01-01',
      date_revision: '2031-01-01',
    };
    const requestJson = jest.fn().mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce(dto);
    const ds = new ProductRemoteDataSource(createClient(requestJson));

    await expect(ds.update('u1', { name: 'Otro nombre largo' })).resolves.toMatchObject({ id: 'u1' });
    expect(requestJson).toHaveBeenCalledWith(
      '/bp/products/u1',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('create valida data en respuesta', async () => {
    const dto = {
      id: 'p',
      name: 'Nombre largo',
      description: '1234567890',
      logo: 'x.png',
      date_release: '2030-01-01',
      date_revision: '2031-01-01',
    };
    const requestJson = jest.fn().mockResolvedValue({ data: dto });
    const ds = new ProductRemoteDataSource(createClient(requestJson));
    const p = sampleProduct({ id: 'p' });

    await expect(ds.create(p)).resolves.toMatchObject({ id: 'p' });
  });

  it('create lanza si la respuesta no incluye producto válido', async () => {
    const requestJson = jest.fn().mockResolvedValue({ message: 'sin data' });
    const ds = new ProductRemoteDataSource(createClient(requestJson));

    await expect(ds.create(sampleProduct())).rejects.toThrow(/inválida/);
  });

  it('remove llama DELETE', async () => {
    const requestJson = jest.fn().mockResolvedValue({});
    const ds = new ProductRemoteDataSource(createClient(requestJson));

    await ds.remove('z');
    expect(requestJson).toHaveBeenCalledWith('/bp/products/z', { method: 'DELETE' });
  });

  it('verifyIdentifierExists delega', async () => {
    const requestJson = jest.fn().mockResolvedValue(true);
    const ds = new ProductRemoteDataSource(createClient(requestJson));

    await expect(ds.verifyIdentifierExists('id1')).resolves.toBe(true);
    expect(requestJson).toHaveBeenCalledWith('/bp/products/verification/id1', { method: 'GET' });
  });
});
