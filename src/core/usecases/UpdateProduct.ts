import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';

export class UpdateProduct {
  constructor(private readonly repository: IProductRepository) {}

  execute(id: string, patch: Partial<FinancialProduct>): Promise<FinancialProduct> {
    return this.repository.update(id, patch);
  }
}
