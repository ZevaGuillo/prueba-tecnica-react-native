import type { FinancialProduct } from '@/core/entities/FinancialProduct';

export interface IProductRepository {
  getAll(): Promise<FinancialProduct[]>;
  getById(id: string): Promise<FinancialProduct | null>;
  create(product: FinancialProduct): Promise<FinancialProduct>;
  update(id: string, product: Partial<FinancialProduct>): Promise<FinancialProduct>;
  delete(id: string): Promise<void>;
  /** `true` si el identificador ya existe en el catálogo (API de verificación). */
  verifyId(id: string): Promise<boolean>;
}
