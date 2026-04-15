import { getProducts } from '@/presentation/di/productsComposition';
import { useProductsQuery } from '@/presentation/hooks/products/useProductsQuery';
import { createQueryClientWrapper } from '../../test-utils/queryClientWrapper';
import { renderHook, waitFor } from '@testing-library/react-native';
import { sampleProduct } from '../fixtures/financialProduct';

describe('useProductsQuery', () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest.spyOn(getProducts, 'execute');
  });

  afterEach(() => {
    executeSpy.mockRestore();
  });

  it('carga la lista', async () => {
    executeSpy.mockResolvedValue([
      sampleProduct({ id: 'alfa', name: 'Crédito personal' }),
      sampleProduct({ id: 'beta', name: 'Otro nombre largo' }),
    ]);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useProductsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('expone error cuando falla la carga', async () => {
    executeSpy.mockRejectedValue(new Error('fallo'));

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useProductsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toMatch(/fallo/);
  });
});
