import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import type { ProductApiDto } from '@/data/schemas/productApi';

function normalizeDateField(v: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
    return v.slice(0, 10);
  }
  return v;
}

export const ProductMapper = {
  /** Convierte DTO ya validado al modelo de dominio. */
  toDomain(dto: ProductApiDto): FinancialProduct {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      logo: dto.logo,
      date_release: normalizeDateField(dto.date_release),
      date_revision: normalizeDateField(dto.date_revision),
    };
  },

  toCreateBody(product: FinancialProduct): Record<string, string> {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision,
    };
  },

  toUpdateBody(patch: Partial<FinancialProduct>): Record<string, string> {
    const out: Record<string, string> = {};
    if (patch.name !== undefined) out.name = patch.name;
    if (patch.description !== undefined) out.description = patch.description;
    if (patch.logo !== undefined) out.logo = patch.logo;
    if (patch.date_release !== undefined) out.date_release = patch.date_release;
    if (patch.date_revision !== undefined) out.date_revision = patch.date_revision;
    return out;
  },
};
