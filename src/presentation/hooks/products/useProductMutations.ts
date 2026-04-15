import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/presentation/di/productsComposition';
import { productKeys } from '@/presentation/hooks/products/productKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: FinancialProduct) => createProduct.execute(product),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}

export function useUpdateProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<FinancialProduct>;
    }) => updateProduct.execute(id, patch),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: productKeys.list() });
      void qc.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct.execute(id),
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: productKeys.list() });
      qc.removeQueries({ queryKey: productKeys.detail(id) });
    },
  });
}
