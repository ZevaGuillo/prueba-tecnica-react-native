/** Formatea una fecha ISO (YYYY-MM-DD…) para lectura en español. */
export function formatEsDate(iso: string): string {
  const part = iso.slice(0, 10);
  const [y, m, d] = part.split('-').map((x) => Number(x));
  if (!y || !m || !d) return iso;
  try {
    return new Intl.DateTimeFormat('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(y, m - 1, d));
  } catch {
    return part;
  }
}
