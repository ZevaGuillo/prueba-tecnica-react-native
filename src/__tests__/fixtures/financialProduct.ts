import type { FinancialProduct } from '@/core/entities/FinancialProduct';

export function sampleProduct(over: Partial<FinancialProduct> = {}): FinancialProduct {
  return {
    id: 'prod-001',
    name: 'Nombre producto demo',
    description: 'Descripción suficientemente larga para validar.',
    logo: 'https://example.com/logo.png',
    date_release: '2030-06-01',
    date_revision: '2031-06-01',
    ...over,
  };
}
