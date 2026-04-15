import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { deleteProduct, getProductById } from '@/presentation/di/productsComposition';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

export type ProductDetailStatus = 'loading' | 'ready' | 'error' | 'notFound';

export type ProductDetailViewModel = {
  product: FinancialProduct | null;
  status: ProductDetailStatus;
  errorMessage: string | null;
  refresh: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  isNotFound: boolean;
  isReady: boolean;
  deleteModalVisible: boolean;
  deleteSubmitting: boolean;
  deleteError: string | null;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  confirmDelete: () => Promise<boolean>;
};

export function useProductDetailViewModel(
  productId: string | undefined,
): ProductDetailViewModel {
  const [product, setProduct] = useState<FinancialProduct | null>(null);
  const [status, setStatus] = useState<ProductDetailStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!productId || !String(productId).trim()) {
      setStatus('error');
      setErrorMessage('Identificador de producto no válido.');
      setProduct(null);
      return;
    }

    if (!silent) {
      setStatus('loading');
      setErrorMessage(null);
    }
    try {
      const p = await getProductById.execute(String(productId));
      if (!p) {
        setProduct(null);
        setStatus('notFound');
        return;
      }
      setProduct(p);
      setStatus('ready');
      setErrorMessage(null);
    } catch (e) {
      if (!silent) {
        setProduct(null);
        setStatus('error');
        setErrorMessage(e instanceof Error ? e.message : 'No se pudo cargar el producto.');
      }
    }
  }, [productId]);

  /**
   * Al volver a esta pantalla (p. ej. desde editar), recarga sin pantalla de carga
   * para mostrar los datos actualizados.
   */
  const skipNextFocusRefetch = useRef(true);

  /** Carga inicial o cuando cambia el id de ruta. */
  useEffect(() => {
    skipNextFocusRefetch.current = true;
    void load(false);
  }, [load, productId]);

  useFocusEffect(
    useCallback(() => {
      if (skipNextFocusRefetch.current) {
        skipNextFocusRefetch.current = false;
        return;
      }
      void load(true);
    }, [load]),
  );

  const openDeleteModal = useCallback(() => {
    setDeleteError(null);
    setDeleteModalVisible(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (deleteSubmitting) return;
    setDeleteModalVisible(false);
    setDeleteError(null);
  }, [deleteSubmitting]);

  const confirmDelete = useCallback(async (): Promise<boolean> => {
    const pid = productId?.trim();
    if (!pid) {
      setDeleteError('Identificador de producto no válido.');
      return false;
    }
    setDeleteSubmitting(true);
    setDeleteError(null);
    try {
      await deleteProduct.execute(pid);
      setDeleteModalVisible(false);
      setDeleteError(null);
      return true;
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'No se pudo eliminar el producto.');
      return false;
    } finally {
      setDeleteSubmitting(false);
    }
  }, [productId]);

  return {
    product,
    status,
    errorMessage,
    refresh: load,
    isLoading: status === 'loading',
    isError: status === 'error',
    isNotFound: status === 'notFound',
    isReady: status === 'ready',
    deleteModalVisible,
    deleteSubmitting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
}
