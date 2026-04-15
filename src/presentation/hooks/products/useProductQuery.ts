import { getProductById } from '@/presentation/di/productsComposition';
import { productKeys } from '@/presentation/hooks/products/productKeys';
import { useQuery } from '@tanstack/react-query';

export function useProductQuery(productId: string | undefined) {
  const id = productId?.trim() ?? '';
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById.execute(id),
    enabled: id.length > 0,
  });
}
