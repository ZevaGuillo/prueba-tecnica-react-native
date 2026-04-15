import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { ApiClient } from '@/data/datasources/ApiClient';
import { ApiError } from '@/data/errors/ApiError';
import { ProductMapper, type ProductApiDto } from '@/data/mappers/ProductMapper';

const PREFIX = '/bp/products';

type ListResponse = { data: ProductApiDto[] };
type MessageDataResponse = { data?: ProductApiDto; message?: string };

function isProductDto(v: unknown): v is ProductApiDto {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string';
}

export class ProductRemoteDataSource {
  constructor(private readonly client: ApiClient) {}

  async fetchAll(): Promise<ProductApiDto[]> {
    const body = await this.client.requestJson<ListResponse>(PREFIX, { method: 'GET' });
    return Array.isArray(body.data) ? body.data : [];
  }

  async fetchById(id: string): Promise<ProductApiDto | null> {
    try {
      const body = await this.client.requestJson<unknown>(
        `${PREFIX}/${encodeURIComponent(id)}`,
        { method: 'GET' },
      );
      if (isProductDto(body)) {
        return body;
      }
      if (body && typeof body === 'object' && body !== null && 'data' in body) {
        const inner = (body as { data?: unknown }).data;
        if (isProductDto(inner)) return inner;
      }
      return null;
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async create(product: FinancialProduct): Promise<ProductApiDto> {
    const body = await this.client.requestJson<MessageDataResponse>(PREFIX, {
      method: 'POST',
      body: JSON.stringify(ProductMapper.toCreateBody(product)),
    });
    if (!body.data || !isProductDto(body.data)) {
      throw new Error('Respuesta inválida al crear el producto.');
    }
    return body.data;
  }

  async update(id: string, patch: Partial<FinancialProduct>): Promise<ProductApiDto> {
    await this.client.requestJson<MessageDataResponse>(`${PREFIX}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(ProductMapper.toUpdateBody(patch)),
    });
    const fresh = await this.fetchById(id);
    if (!fresh) {
      throw new Error('No se encontró el producto tras actualizar.');
    }
    return fresh;
  }

  async remove(id: string): Promise<void> {
    await this.client.requestJson<unknown>(`${PREFIX}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async verifyIdentifierExists(id: string): Promise<boolean> {
    return this.client.requestJson<boolean>(
      `${PREFIX}/verification/${encodeURIComponent(id)}`,
      { method: 'GET' },
    );
  }
}
