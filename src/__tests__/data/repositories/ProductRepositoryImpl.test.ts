import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { ProductRemoteDataSource } from '@/data/datasources/ProductRemoteDataSource';
import { ProductRepositoryImpl } from '@/data/repositories/ProductRepositoryImpl';
import { sampleProduct } from '../../fixtures/financialProduct';

function createRemote(over: Partial<ProductRemoteDataSource> = {}): ProductRemoteDataSource {
  return {
    fetchAll: jest.fn(),
    fetchById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    verifyIdentifierExists: jest.fn(),
    ...over,
  } as unknown as ProductRemoteDataSource;
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
    const fetchAll = jest.fn().mockResolvedValue([dto]);
    const repo = new ProductRepositoryImpl(createRemote({ fetchAll }));

    const out = await repo.getAll();
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('p1');
  });

  it('getById devuelve null si el remoto no encuentra', async () => {
    const fetchById = jest.fn().mockResolvedValue(null);
    const repo = new ProductRepositoryImpl(createRemote({ fetchById }));

    await expect(repo.getById('x')).resolves.toBeNull();
  });

  it('create y update delegan y mapean', async () => {
    const p = sampleProduct();
    const create = jest.fn().mockResolvedValue(dto);
    const update = jest.fn().mockResolvedValue(dto);
    const repo = new ProductRepositoryImpl(createRemote({ create, update }));

    await expect(repo.create(p)).resolves.toMatchObject({ id: 'p1' });
    const patch: Partial<FinancialProduct> = { name: 'Otro nombre largo' };
    await expect(repo.update('p1', patch)).resolves.toMatchObject({ id: 'p1' });
  });

  it('delete y verifyId delegan', async () => {
    const remove = jest.fn().mockResolvedValue(undefined);
    const verifyIdentifierExists = jest.fn().mockResolvedValue(true);
    const repo = new ProductRepositoryImpl(createRemote({ remove, verifyIdentifierExists }));

    await repo.delete('z');
    await expect(repo.verifyId('z')).resolves.toBe(true);
    expect(remove).toHaveBeenCalledWith('z');
    expect(verifyIdentifierExists).toHaveBeenCalledWith('z');
  });
});
