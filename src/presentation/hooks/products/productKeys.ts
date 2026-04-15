/** Claves de caché TanStack Query para productos (invalidación centralizada). */
export const productKeys = {
  all: ['products'] as const,
  list: () => [...productKeys.all, 'list'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  verify: (id: string) => [...productKeys.all, 'verify', id] as const,
};
