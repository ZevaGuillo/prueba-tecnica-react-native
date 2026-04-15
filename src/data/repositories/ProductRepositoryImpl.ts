import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { IProductRepository } from '@/core/repositories/IProductRepository';
import type { ApiClient } from '@/data/ApiClient';
import { ApiError } from '@/data/ApiError';
import { ProductMapper } from '@/data/mappers/ProductMapper';
import {
  createResponseSchema,
  listResponseSchema,
  parseProductFromGetById,
  verificationResponseSchema,
} from '@/data/schemas/productApi';

const PREFIX = '/bp/products';

/**
 * Acceso HTTP a productos. Los bodies de escritura se arman con `ProductMapper` aquí
 * (el cliente solo transporta JSON).
 */
export class ProductRepositoryImpl implements IProductRepository {
  constructor(private readonly client: ApiClient) {}

  async getAll(): Promise<FinancialProduct[]> {
    const body = await this.client.requestJson(PREFIX, { method: 'GET' });
    const parsed = listResponseSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error('Respuesta inválida al listar productos.');
    }
    return parsed.data.data.map((row) => ProductMapper.toDomain(row));
  }

  async getById(id: string): Promise<FinancialProduct | null> {
    try {
      const body = await this.client.requestJson(`${PREFIX}/${encodeURIComponent(id)}`, {
        method: 'GET',
      });
      const dto = parseProductFromGetById(body);
      if (!dto) {
        throw new Error('Respuesta inválida al obtener el producto.');
      }
      return ProductMapper.toDomain(dto);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async create(product: FinancialProduct): Promise<FinancialProduct> {
    const body = await this.client.requestJson(PREFIX, {
      method: 'POST',
      body: JSON.stringify(ProductMapper.toCreateBody(product)),
    });
    const parsed = createResponseSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error('Respuesta inválida al crear el producto.');
    }
    return ProductMapper.toDomain(parsed.data.data);
  }

  async update(id: string, product: Partial<FinancialProduct>): Promise<FinancialProduct> {
    await this.client.requestOk(`${PREFIX}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(ProductMapper.toUpdateBody(product)),
    });
    const fresh = await this.getById(id);
    if (!fresh) {
      throw new Error('No se encontró el producto tras actualizar.');
    }
    return fresh;
  }

  async delete(id: string): Promise<void> {
    await this.client.requestOk(`${PREFIX}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async verifyId(id: string): Promise<boolean> {
    const body = await this.client.requestJson(
      `${PREFIX}/verification/${encodeURIComponent(id)}`,
      { method: 'GET' },
    );
    const parsed = verificationResponseSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error('Respuesta inválida al verificar el identificador.');
    }
    return parsed.data;
  }
}
