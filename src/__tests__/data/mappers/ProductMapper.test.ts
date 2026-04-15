import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { ProductMapper } from '@/data/mappers/ProductMapper';

describe('ProductMapper', () => {
  const valid = {
    id: 'p1',
    name: 'Nombre largo ok',
    description: '1234567890',
    logo: 'https://x.com/a.png',
    date_release: '2030-01-01T00:00:00.000Z',
    date_revision: '2031-01-01',
  };

  it('toDomain mapea snake_case y normaliza fechas', () => {
    const d = ProductMapper.toDomain(valid);
    expect(d.date_release).toBe('2030-01-01');
    expect(d.date_revision).toBe('2031-01-01');
    expect(d.id).toBe('p1');
  });

  it('toDomain acepta Date en campos', () => {
    const raw = {
      ...valid,
      id: new Date('2020-01-01'),
    };
    const d = ProductMapper.toDomain(raw);
    expect(typeof d.id).toBe('string');
  });

  it('toDomain lanza si no es objeto', () => {
    expect(() => ProductMapper.toDomain(null)).toThrow(/inválida/);
  });

  it('toCreateBody serializa todos los campos', () => {
    const p: FinancialProduct = {
      id: 'i',
      name: 'Nombre largo ok',
      description: '1234567890',
      logo: 'x.png',
      date_release: '2030-01-01',
      date_revision: '2031-01-01',
    };
    expect(ProductMapper.toCreateBody(p)).toEqual({
      id: 'i',
      name: 'Nombre largo ok',
      description: '1234567890',
      logo: 'x.png',
      date_release: '2030-01-01',
      date_revision: '2031-01-01',
    });
  });

  it('toUpdateBody solo incluye campos definidos', () => {
    expect(ProductMapper.toUpdateBody({ name: 'Otro nombre largo' })).toEqual({
      name: 'Otro nombre largo',
    });
    expect(ProductMapper.toUpdateBody({})).toEqual({});
  });
});
