/** Convierte AAAA-MM-DD (local) a `Date` a medianoche local; inválido → `undefined`. */
export function isoDateStringToLocalDate(iso: string): Date | undefined {
  const t = iso.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return undefined;
  const [y, m, d] = t.split('-').map((x) => Number(x));
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

/** `Date` local → AAAA-MM-DD; `undefined` → cadena vacía. */
export function localDateToIsoDateString(d: Date | undefined): string {
  if (!d) return '';
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

export function startOfTodayLocal(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
