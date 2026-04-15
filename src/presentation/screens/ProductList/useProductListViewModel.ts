import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { getProducts } from '@/presentation/di/productsComposition';
import { useCallback, useMemo, useState } from 'react';

export type ProductListStatus = 'loading' | 'ready' | 'error';

export function useProductListViewModel() {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<FinancialProduct[]>([]);
  const [status, setStatus] = useState<ProductListStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const list = await getProducts.execute();
      setAllProducts(list);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setErrorMessage(e instanceof Error ? e.message : 'No se pudo cargar el catálogo.');
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter(
      (p) => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
    );
  }, [allProducts, query]);

  return {
    query,
    setQuery,
    allProducts,
    filteredProducts,
    /** Número de ítems mostrados tras aplicar el filtro (contador D1). */
    visibleCount: filteredProducts.length,
    status,
    errorMessage,
    load,
    isLoading: status === 'loading',
    isError: status === 'error',
    isReady: status === 'ready',
  };
}
