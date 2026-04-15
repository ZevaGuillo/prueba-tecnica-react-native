import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';
import { CreateProduct } from '@/core/usecases/CreateProduct';
import { DeleteProduct } from '@/core/usecases/DeleteProduct';
import { GetProductById } from '@/core/usecases/GetProductById';
import { UpdateProduct } from '@/core/usecases/UpdateProduct';
import { VerifyProductId } from '@/core/usecases/VerifyProductId';
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

describe('GetProductById', () => {
  it('devuelve null cuando el repositorio no encuentra el producto', async () => {
    const getById = jest.fn().mockResolvedValue(null);
    const uc = new GetProductById(createMockRepo({ getById }));

    await expect(uc.execute('x')).resolves.toBeNull();
    expect(getById).toHaveBeenCalledWith('x');
  });

  it('devuelve el producto cuando existe', async () => {
    const p = sampleProduct();
    const getById = jest.fn().mockResolvedValue(p);
    const uc = new GetProductById(createMockRepo({ getById }));

    await expect(uc.execute('prod-001')).resolves.toEqual(p);
  });
});

describe('CreateProduct', () => {
  it('delegates create en el repositorio', async () => {
    const p = sampleProduct();
    const create = jest.fn().mockResolvedValue(p);
    const uc = new CreateProduct(createMockRepo({ create }));

    await expect(uc.execute(p)).resolves.toEqual(p);
    expect(create).toHaveBeenCalledWith(p);
  });
});

describe('UpdateProduct', () => {
  it('delegates update con id y parche', async () => {
    const updated = sampleProduct({ name: 'Nuevo nombre largo suficiente' });
    const update = jest.fn().mockResolvedValue(updated);
    const uc = new UpdateProduct(createMockRepo({ update }));
    const patch: Partial<FinancialProduct> = { name: 'Nuevo nombre largo suficiente' };

    await expect(uc.execute('prod-001', patch)).resolves.toEqual(updated);
    expect(update).toHaveBeenCalledWith('prod-001', patch);
  });
});

describe('DeleteProduct', () => {
  it('delegates delete por id', async () => {
    const del = jest.fn().mockResolvedValue(undefined);
    const uc = new DeleteProduct(createMockRepo({ delete: del }));

    await expect(uc.execute('id-z')).resolves.toBeUndefined();
    expect(del).toHaveBeenCalledWith('id-z');
  });
});

describe('VerifyProductId', () => {
  it('devuelve true si el id ya existe', async () => {
    const verifyId = jest.fn().mockResolvedValue(true);
    const uc = new VerifyProductId(createMockRepo({ verifyId }));

    await expect(uc.execute('dup')).resolves.toBe(true);
  });

  it('devuelve false si el id está libre', async () => {
    const verifyId = jest.fn().mockResolvedValue(false);
    const uc = new VerifyProductId(createMockRepo({ verifyId }));

    await expect(uc.execute('libre')).resolves.toBe(false);
  });
});
