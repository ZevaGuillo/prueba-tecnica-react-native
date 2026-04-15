import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';
import type { ProductRemoteDataSource } from '@/data/datasources/ProductRemoteDataSource';
import { ProductMapper } from '@/data/mappers/ProductMapper';

export class ProductRepositoryImpl implements IProductRepository {
  constructor(private readonly remote: ProductRemoteDataSource) {}

  async getAll(): Promise<FinancialProduct[]> {
    const rows = await this.remote.fetchAll();
    return rows.map((r) => ProductMapper.toDomain(r));
  }

  async getById(id: string): Promise<FinancialProduct | null> {
    const row = await this.remote.fetchById(id);
    return row ? ProductMapper.toDomain(row) : null;
  }

  async create(product: FinancialProduct): Promise<FinancialProduct> {
    const row = await this.remote.create(product);
    return ProductMapper.toDomain(row);
  }

  async update(id: string, product: Partial<FinancialProduct>): Promise<FinancialProduct> {
    const row = await this.remote.update(id, product);
    return ProductMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.remote.remove(id);
  }

  async verifyId(id: string): Promise<boolean> {
    return this.remote.verifyIdentifierExists(id);
  }
}
