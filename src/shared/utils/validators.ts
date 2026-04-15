/**
 * Validadores puros (mensaje en español o `null` si es válido).
 * Alineado a spec (tabla de campos) y data-model (logo URL, fechas ISO).
 */

export function validateProductId(id: string): string | null {
  const t = id.trim();
  if (!t) return 'El identificador es obligatorio.';
  if (/\s/.test(id)) {
    return 'El identificador no puede contener espacios en blanco.';
  }
  return null;
}

export function validateName(name: string): string | null {
  const t = name.trim();
  if (!t) return 'El nombre es obligatorio.';
  if (t.length < 5 || t.length > 100) {
    return 'El nombre debe tener entre 5 y 100 caracteres.';
  }
  return null;
}

export function validateDescription(description: string): string | null {
  const t = description.trim();
  if (!t) return 'La descripción es obligatoria.';
  if (t.length < 10 || t.length > 200) {
    return 'La descripción debe tener entre 10 y 200 caracteres.';
  }
  return null;
}

/** Acepta URL absoluta (http/https) o nombre de recurso tipo contrato (`assets-1.png`). */
export function validateLogo(logo: string): string | null {
  const t = logo.trim();
  if (!t) return 'El logo es obligatorio.';
  if (isProbablyAbsoluteUrl(t)) {
    return null;
  }
  if (/^[a-zA-Z0-9._\-/]+$/.test(t)) {
    return null;
  }
  return 'Indica una URL válida o un nombre de archivo permitido.';
}

function isProbablyAbsoluteUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseLocalDate(isoDate: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(y, mo - 1, d);
}

function startOfTodayLocal(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function validateDateRelease(isoDate: string): string | null {
  const t = isoDate.trim();
  if (!t) return 'La fecha de liberación es obligatoria.';
  const parsed = parseLocalDate(t);
  if (!parsed) return 'Usa una fecha válida (AAAA-MM-DD).';
  if (parsed < startOfTodayLocal()) {
    return 'La fecha de liberación no puede ser anterior a hoy.';
  }
  return null;
}

/** `date_revision` debe ser exactamente un año después de `date_release` (calendario local). */
export function validateDateRevision(isoRelease: string, isoRevision: string): string | null {
  const tr = isoRevision.trim();
  if (!tr) return 'La fecha de revisión es obligatoria.';
  const release = parseLocalDate(isoRelease);
  const revision = parseLocalDate(tr);
  if (!release || !revision) return 'Las fechas deben ser válidas (AAAA-MM-DD).';
  const expected = new Date(release);
  expected.setFullYear(expected.getFullYear() + 1);
  const y = expected.getFullYear();
  const mo = String(expected.getMonth() + 1).padStart(2, '0');
  const da = String(expected.getDate()).padStart(2, '0');
  const expectedIso = `${y}-${mo}-${da}`;
  if (tr.slice(0, 10) !== expectedIso) {
    return 'La fecha de revisión debe ser exactamente un año después de la fecha de liberación.';
  }
  return null;
}

/** Calcula la fecha de revisión esperada (un año después) en formato AAAA-MM-DD. */
export function computeRevisionDateFromRelease(isoRelease: string): string | null {
  const release = parseLocalDate(isoRelease.trim());
  if (!release) return null;
  const next = new Date(release);
  next.setFullYear(next.getFullYear() + 1);
  const y = next.getFullYear();
  const mo = String(next.getMonth() + 1).padStart(2, '0');
  const da = String(next.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}
