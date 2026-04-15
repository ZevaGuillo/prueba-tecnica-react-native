import { verifyProductId } from '@/presentation/di/productsComposition';
import { productKeys } from '@/presentation/hooks/products/productKeys';
import { useQuery } from '@tanstack/react-query';

export function useVerifyProductIdQuery(rawId: string, enabled: boolean) {
  const id = rawId.trim();
  return useQuery({
    queryKey: productKeys.verify(id),
    queryFn: () => verifyProductId.execute(id),
    enabled: enabled && id.length > 0,
    staleTime: 0,
  });
}
