import { useProductFormViewModel } from '@/presentation/screens/ProductForm/useProductFormViewModel';
import {
  createProduct,
  getProductById,
  updateProduct,
  verifyProductId,
} from '@/presentation/di/productsComposition';
import { ApiError } from '@/data/errors/ApiError';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { sampleProduct } from '../fixtures/financialProduct';

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('useProductFormViewModel', () => {
  let verifySpy: jest.SpyInstance;
  let createSpy: jest.SpyInstance;
  let getSpy: jest.SpyInstance;
  let updateSpy: jest.SpyInstance;

  beforeEach(() => {
    verifySpy = jest.spyOn(verifyProductId, 'execute');
    createSpy = jest.spyOn(createProduct, 'execute');
    getSpy = jest.spyOn(getProductById, 'execute');
    updateSpy = jest.spyOn(updateProduct, 'execute');
    verifySpy.mockResolvedValue(false);
  });

  afterEach(() => {
    verifySpy.mockRestore();
    createSpy.mockRestore();
    getSpy.mockRestore();
    updateSpy.mockRestore();
    jest.useRealTimers();
  });

  it('create: validación falla con campos vacíos', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useProductFormViewModel('create'));

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(false);
    });
  });

  it('create: envía producto nuevo cuando los datos son válidos', async () => {
    jest.useFakeTimers();
    const dateRel = tomorrowIso();
    createSpy.mockResolvedValue(sampleProduct());

    const { result } = renderHook(() => useProductFormViewModel('create'));

    await act(() => {
      result.current.setField('id', 'newprod');
      result.current.setField('name', 'Nombre largo suficiente');
      result.current.setField('description', 'Descripción de más de diez.');
      result.current.setField('logo', 'https://a.com/x.png');
      result.current.setField('date_release', dateRel);
    });

    await act(async () => {
      jest.advanceTimersByTime(450);
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.idCheckPending).toBe(false));

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(true);
    });

    expect(createSpy).toHaveBeenCalled();
  });

  it('create: ApiError 400 mapea errores de campo', async () => {
    jest.useFakeTimers();
    const dateRel = tomorrowIso();
    createSpy.mockRejectedValue(new ApiError('bad', 400, { errors: [{ property: 'name', constraints: { x: 'must be longer' } }] }));

    const { result } = renderHook(() => useProductFormViewModel('create'));

    await act(() => {
      result.current.setField('id', 'newprod2');
      result.current.setField('name', 'Nombre largo suficiente');
      result.current.setField('description', 'Descripción de más de diez.');
      result.current.setField('logo', 'https://a.com/x.png');
      result.current.setField('date_release', dateRel);
    });
    await act(async () => {
      jest.advanceTimersByTime(450);
      await Promise.resolve();
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.idCheckPending).toBe(false));

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(false);
    });
    expect(result.current.fieldErrors.name).toBeTruthy();
  });

  it('edit: carga producto y actualiza', async () => {
    const p = sampleProduct({ id: 'ed1', name: 'Nombre largo suficiente' });
    getSpy.mockResolvedValue(p);
    updateSpy.mockResolvedValue(p);

    const { result } = renderHook(() => useProductFormViewModel('edit', 'ed1'));

    await waitFor(() => expect(result.current.editLoadStatus).toBe('ready'));

    await act(() => {
      result.current.setField('name', 'Otro nombre largo distinto');
    });

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(true);
    });
    expect(updateSpy).toHaveBeenCalled();
  });
});
