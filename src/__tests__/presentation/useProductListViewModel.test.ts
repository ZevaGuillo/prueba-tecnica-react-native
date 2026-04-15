import { useProductListViewModel } from '@/presentation/screens/ProductList/useProductListViewModel';
import { getProducts } from '@/presentation/di/productsComposition';
import { renderHook, act } from '@testing-library/react-native';
import { sampleProduct } from '../fixtures/financialProduct';

describe('useProductListViewModel', () => {
  let executeSpy: jest.SpyInstance;

  beforeEach(() => {
    executeSpy = jest.spyOn(getProducts, 'execute');
  });

  afterEach(() => {
    executeSpy.mockRestore();
  });

  it('carga productos y filtra por consulta', async () => {
    executeSpy.mockResolvedValue([
      sampleProduct({ id: 'alfa', name: 'Crédito personal' }),
      sampleProduct({ id: 'beta', name: 'Otro nombre largo' }),
    ]);

    const { result } = renderHook(() => useProductListViewModel());

    await act(async () => {
      await result.current.load();
    });
    expect(result.current.isReady).toBe(true);
    expect(result.current.allProducts).toHaveLength(2);

    act(() => {
      result.current.setQuery('alfa');
    });
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.visibleCount).toBe(1);

    act(() => {
      result.current.setQuery('nada');
    });
    expect(result.current.filteredProducts).toHaveLength(0);
  });

  it('expone error cuando falla la carga', async () => {
    executeSpy.mockRejectedValue(new Error('fallo'));

    const { result } = renderHook(() => useProductListViewModel());

    await act(async () => {
      await result.current.load();
    });
    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toMatch(/fallo/);
  });
});
