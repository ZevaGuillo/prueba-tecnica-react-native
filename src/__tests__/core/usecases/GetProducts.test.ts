import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';
import { GetProducts } from '@/core/usecases/GetProducts';
import { sampleProduct } from '../../fixtures/financialProduct';

function createMockRepo(overrides: Partial<IProductRepository> = {}): IProductRepository {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    verifyId: jest.fn(),
    ...overrides,
  };
}

describe('GetProducts', () => {
  it('delegates en el repositorio y devuelve la lista', async () => {
    const list: FinancialProduct[] = [sampleProduct({ id: 'a' }), sampleProduct({ id: 'b' })];
    const getAll = jest.fn().mockResolvedValue(list);
    const repo = createMockRepo({ getAll });
    const uc = new GetProducts(repo);

    await expect(uc.execute()).resolves.toEqual(list);
    expect(getAll).toHaveBeenCalledTimes(1);
  });

  it('propaga errores del repositorio', async () => {
    const getAll = jest.fn().mockRejectedValue(new Error('red'));
    const uc = new GetProducts(createMockRepo({ getAll }));

    await expect(uc.execute()).rejects.toThrow('red');
  });
});
