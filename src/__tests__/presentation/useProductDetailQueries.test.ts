import { deleteProduct, getProductById } from '@/presentation/di/productsComposition';
import { useDeleteProductMutation } from '@/presentation/hooks/products/useProductMutations';
import { useProductQuery } from '@/presentation/hooks/products/useProductQuery';
import { createQueryClientWrapper } from '../../test-utils/queryClientWrapper';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { sampleProduct } from '../fixtures/financialProduct';

describe('useProductQuery / useDeleteProductMutation', () => {
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

  it('carga producto por id', async () => {
    const p = sampleProduct({ id: 'x1' });
    getSpy.mockResolvedValue(p);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useProductQuery('x1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe('x1');
  });

  it('devuelve null si no existe', async () => {
    getSpy.mockResolvedValue(null);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useProductQuery('nope'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('elimina con mutación', async () => {
    deleteSpy.mockResolvedValue(undefined);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useDeleteProductMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync('x1');
    });
    expect(deleteSpy).toHaveBeenCalledWith('x1');
  });
});
