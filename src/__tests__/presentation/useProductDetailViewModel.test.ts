import { useProductDetailViewModel } from '@/presentation/screens/ProductDetail/useProductDetailViewModel';
import { deleteProduct, getProductById } from '@/presentation/di/productsComposition';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { sampleProduct } from '../fixtures/financialProduct';

jest.mock('expo-router', () => {
  const React = require('react');
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    /** En Jest no hay foco real; un useEffect equivale al ciclo de foco. */
    useFocusEffect: (cb: () => void) => {
      React.useEffect(() => {
        cb();
      }, [cb]);
    },
  };
});

describe('useProductDetailViewModel', () => {
  let getSpy: jest.SpyInstance;
  let deleteSpy: jest.SpyInstance;

  beforeEach(() => {
    getSpy = jest.spyOn(getProductById, 'execute');
    deleteSpy = jest.spyOn(deleteProduct, 'execute');
  });

  afterEach(() => {
    getSpy.mockRestore();
    deleteSpy.mockRestore();
  });

  it('marca error si falta id', async () => {
    const { result } = renderHook(() => useProductDetailViewModel(undefined));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.errorMessage).toMatch(/no válido/);
  });

  it('carga producto y permite eliminar con éxito', async () => {
    const p = sampleProduct({ id: 'x1' });
    getSpy.mockResolvedValue(p);
    deleteSpy.mockResolvedValue(undefined);

    const { result } = renderHook(() => useProductDetailViewModel('x1'));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.product?.id).toBe('x1');

    await act(async () => {
      result.current.openDeleteModal();
    });
    expect(result.current.deleteModalVisible).toBe(true);

    let ok = false;
    await act(async () => {
      ok = await result.current.confirmDelete();
    });
    expect(ok).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith('x1');
  });

  it('expone notFound cuando el producto no existe', async () => {
    getSpy.mockResolvedValue(null);

    const { result } = renderHook(() => useProductDetailViewModel('nope'));

    await waitFor(() => expect(result.current.isNotFound).toBe(true));
  });
});
