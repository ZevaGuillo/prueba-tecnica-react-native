/**
 * Extrae errores por campo de respuestas 400 del API (p. ej. class-validator).
 * T029: mensajes en español cuando el servidor envía inglés genérico.
 */

export type ProductFormFieldKey =
  | 'id'
  | 'name'
  | 'description'
  | 'logo'
  | 'date_release'
  | 'date_revision';

const BACKEND_TO_FIELD: Record<string, ProductFormFieldKey> = {
  id: 'id',
  name: 'name',
  description: 'description',
  logo: 'logo',
  date_release: 'date_release',
  date_revision: 'date_revision',
};

function translateConstraint(message: string, property: string): string {
  const m = message.toLowerCase();
  if (m.includes('must be longer') || m.includes('minlength')) {
    return `El campo «${property}» no cumple la longitud mínima.`;
  }
  if (m.includes('must be shorter') || m.includes('maxlength')) {
    return `El campo «${property}» supera la longitud permitida.`;
  }
  if (m.includes('must be a date string') || m.includes('isdatestring')) {
    return 'Usa una fecha válida (AAAA-MM-DD).';
  }
  if (m.includes('should not be empty') || m.includes('isnotempty')) {
    return 'Este campo es obligatorio.';
  }
  return message;
}

function firstConstraint(constraints: Record<string, string> | undefined): string | undefined {
  if (!constraints) return undefined;
  const first = Object.values(constraints)[0];
  return typeof first === 'string' ? first : undefined;
}

/**
 * Devuelve mapa campo → mensaje para mostrar bajo cada input.
 */
export function mapBadRequestBodyToFieldErrors(body: unknown): Partial<Record<ProductFormFieldKey, string>> {
  const out: Partial<Record<ProductFormFieldKey, string>> = {};
  if (!body || typeof body !== 'object') return out;

  const root = body as Record<string, unknown>;
  const errors = root.errors;
  if (errors === undefined || errors === null) return out;

  if (Array.isArray(errors)) {
    for (const item of errors) {
      if (!item || typeof item !== 'object') continue;
      const row = item as { property?: string; constraints?: Record<string, string> };
      const prop = row.property;
      if (!prop) continue;
      const field = BACKEND_TO_FIELD[prop];
      if (!field) continue;
      const raw = firstConstraint(row.constraints);
      if (raw) {
        out[field] = translateConstraint(raw, prop);
      }
    }
    return out;
  }

  if (typeof errors === 'object') {
    for (const [key, val] of Object.entries(errors as Record<string, unknown>)) {
      const field = BACKEND_TO_FIELD[key];
      if (!field) continue;
      let msg: string | undefined;
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
        msg = val[0];
      } else if (typeof val === 'string') {
        msg = val;
      }
      if (msg) {
        out[field] = translateConstraint(msg, key);
      }
    }
  }

  return out;
}
