import { useEffect, useState } from 'react';

const DEFAULT_MS = 400;

/**
 * Retrasa la actualización del valor (p. ej. texto de ID) para disparar verificación remota sin saturar el API.
 */
export function useDebounce<T>(value: T, delayMs: number = DEFAULT_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
