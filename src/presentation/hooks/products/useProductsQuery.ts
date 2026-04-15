import { getProducts } from '@/presentation/di/productsComposition';
import { productKeys } from '@/presentation/hooks/products/productKeys';
import { useQuery } from '@tanstack/react-query';

export function useProductsQuery() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: () => getProducts.execute(),
  });
}
