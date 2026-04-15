import type { IProductRepository } from '@/core/repositories/IProductRepository';

export class DeleteProduct {
  constructor(private readonly repository: IProductRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
