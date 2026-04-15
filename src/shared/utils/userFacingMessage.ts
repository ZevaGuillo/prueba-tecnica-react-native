import { ApiError, NetworkTransportError } from '@/data/ApiError';

function mapStatusToSpanish(status: number, fallback: string): string {
  switch (status) {
    case 400:
      return 'Solicitud incorrecta. Revisa los datos enviados.';
    case 401:
      return 'No autorizado.';
    case 404:
      return 'No se encontró el recurso solicitado.';
    case 409:
      return 'Conflicto: el recurso ya existe o no se puede modificar.';
    case 500:
    case 502:
    case 503:
      return 'Error del servidor. Inténtalo de nuevo más tarde.';
    default:
      return fallback;
  }
}

function translateServerMessage(message: string): string {
  const m = message.trim();
  if (/not product found|not found with that identifier/i.test(m)) {
    return 'No se encontró el producto con ese identificador.';
  }
  if (/duplicate|already exists/i.test(m)) {
    return 'Ese identificador ya está en uso.';
  }
  if (/invalid body/i.test(m)) {
    return 'Datos no válidos. Revisa los campos del formulario.';
  }
  return m;
}

export function mapApiErrorToUserMessage(e: ApiError): string {
  const body = e.body;
  let serverMsg = e.serverMessage;
  if (!serverMsg && body && typeof body === 'object' && body !== null && 'message' in body) {
    const m = (body as { message?: unknown }).message;
    if (typeof m === 'string' && m.trim()) serverMsg = m;
  }

  let message = mapStatusToSpanish(e.status, 'Error al comunicarse con el servidor.');
  if (serverMsg) {
    message = translateServerMessage(serverMsg);
  } else if (typeof body === 'string' && body.trim()) {
    message = mapStatusToSpanish(e.status, body.slice(0, 200));
  }

  let serverName = e.serverName;
  if (!serverName && body && typeof body === 'object' && body !== null && 'name' in body) {
    const n = (body as { name?: unknown }).name;
    if (typeof n === 'string') serverName = n;
  }
  if (serverName?.includes('NotFound')) {
    message = 'No se encontró el producto con ese identificador.';
  }
  return message;
}

/** Texto en español para errores de red/API y mensajes de dominio (`Error`). */
export function getUserFacingErrorMessage(e: unknown): string {
  if (e instanceof ApiError) return mapApiErrorToUserMessage(e);
  if (e instanceof NetworkTransportError) {
    return 'Error de red. Comprueba tu conexión e inténtalo de nuevo.';
  }
  if (e instanceof Error && e.message === 'INVALID_SERVER_JSON') {
    return 'Respuesta del servidor no reconocida.';
  }
  if (e instanceof Error) return e.message;
  return 'No se pudo completar la operación.';
}
