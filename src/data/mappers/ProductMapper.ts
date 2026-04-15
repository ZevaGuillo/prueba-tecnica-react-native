import type { FinancialProduct } from '@/core/entities/FinancialProduct';

/** Forma JSON del API (snake_case, fechas en string). */
export type ProductApiDto = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function asString(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? '');
}

export const ProductMapper = {
  toDomain(raw: unknown): FinancialProduct {
    if (!isRecord(raw)) {
      throw new Error('Respuesta de producto inválida.');
    }
    return {
      id: asString(raw.id),
      name: asString(raw.name),
      description: asString(raw.description),
      logo: asString(raw.logo),
      date_release: normalizeDateField(raw.date_release),
      date_revision: normalizeDateField(raw.date_revision),
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

function normalizeDateField(v: unknown): string {
  const s = asString(v);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return s.slice(0, 10);
  }
  return s;
}
