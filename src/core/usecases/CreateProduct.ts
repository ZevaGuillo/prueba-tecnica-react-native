import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';

export class CreateProduct {
  constructor(private readonly repository: IProductRepository) {}

  execute(product: FinancialProduct): Promise<FinancialProduct> {
    return this.repository.create(product);
  }
}
