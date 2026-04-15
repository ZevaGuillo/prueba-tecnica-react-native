/** Error HTTP con `status` y cuerpo parseado (si existe) para mapeo en UI. */
export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;
  readonly serverMessage?: string;
  readonly serverName?: string;

  constructor(init: {
    status: number;
    body?: unknown;
    serverMessage?: string;
    serverName?: string;
  }) {
    super(`HTTP ${init.status}`);
    this.name = 'ApiError';
    this.status = init.status;
    this.body = init.body;
    this.serverMessage = init.serverMessage;
    this.serverName = init.serverName;
  }
}

/** Fallo de red antes de respuesta HTTP. */
export class NetworkTransportError extends Error {
  constructor(public readonly causeError?: unknown) {
    super('NETWORK_TRANSPORT');
    this.name = 'NetworkTransportError';
  }
}
