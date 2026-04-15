import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';

export class GetProducts {
  constructor(private readonly repository: IProductRepository) {}

  execute(): Promise<FinancialProduct[]> {
    return this.repository.getAll();
  }
}
