import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';

export class GetProductById {
  constructor(private readonly repository: IProductRepository) {}

  execute(id: string): Promise<FinancialProduct | null> {
    return this.repository.getById(id);
  }
}
