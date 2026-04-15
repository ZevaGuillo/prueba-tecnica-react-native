import {
  computeRevisionDateFromRelease,
  validateDateRelease,
  validateDateRevision,
  validateDescription,
  validateLogo,
  validateName,
  validateProductId,
} from '@/shared/utils/validators';

describe('validateProductId', () => {
  it('rechaza vacío y espacios en blanco', () => {
    expect(validateProductId('')).toMatch(/obligatorio/);
    expect(validateProductId('  ')).toMatch(/obligatorio/);
    expect(validateProductId('a b')).toMatch(/espacios en blanco/);
    expect(validateProductId(' leading')).toMatch(/espacios en blanco/);
  });

  it('acepta id sin espacios (sin límite de 10 caracteres)', () => {
    expect(validateProductId('ab')).toBeNull();
    expect(validateProductId('abc')).toBeNull();
    expect(validateProductId('prod-01')).toBeNull();
    expect(validateProductId('12345678901234567890')).toBeNull();
  });
});

describe('validateName', () => {
  it('rechaza vacío y longitud', () => {
    expect(validateName('')).toMatch(/obligatorio/);
    expect(validateName('abcd')).toMatch(/entre 5 y 100/);
  });

  it('acepta nombre válido', () => {
    expect(validateName('Nombre')).toBeNull();
  });
});

describe('validateDescription', () => {
  it('rechaza corto y vacío', () => {
    expect(validateDescription('')).toMatch(/obligatoria/);
    expect(validateDescription('corta')).toMatch(/entre 10 y 200/);
  });

  it('acepta descripción válida', () => {
    expect(validateDescription('1234567890')).toBeNull();
  });
});

describe('validateLogo', () => {
  it('rechaza vacío e inválido', () => {
    expect(validateLogo('')).toMatch(/obligatorio/);
    expect(validateLogo('no es url ni archivo!!!')).toMatch(/URL válida/);
  });

  it('acepta http(s) y nombre de recurso', () => {
    expect(validateLogo('https://a.com/x.png')).toBeNull();
    expect(validateLogo('assets-1.png')).toBeNull();
    expect(validateLogo('folder/sub-name.png')).toBeNull();
  });
});

describe('validateDateRelease', () => {
  it('rechaza vacío y fecha inválida', () => {
    expect(validateDateRelease('')).toMatch(/obligatoria/);
    expect(validateDateRelease('not-a-date')).toMatch(/AAAA-MM-DD/);
  });

  it('rechaza fechas pasadas', () => {
    expect(validateDateRelease('2000-01-01')).toMatch(/anterior a hoy/);
  });

  it('acepta fecha de hoy o futura', () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(validateDateRelease(iso)).toBeNull();
  });
});

describe('validateDateRevision', () => {
  const release = '2030-01-15';

  it('rechaza vacío o fechas inconsistentes', () => {
    expect(validateDateRevision(release, '')).toMatch(/obligatoria/);
    expect(validateDateRevision(release, '2031-01-16')).toMatch(/un año después/);
  });

  it('acepta exactamente un año después', () => {
    expect(validateDateRevision(release, '2031-01-15')).toBeNull();
  });
});

describe('computeRevisionDateFromRelease', () => {
  it('calcula +1 año en calendario local', () => {
    expect(computeRevisionDateFromRelease('2025-03-10')).toBe('2026-03-10');
  });

  it('devuelve null si la fecha de liberación es inválida', () => {
    expect(computeRevisionDateFromRelease('')).toBeNull();
  });
});
