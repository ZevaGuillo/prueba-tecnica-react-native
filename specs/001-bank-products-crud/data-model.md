# Data Model: Producto financiero

## Entity: `FinancialProduct` (dominio)

Representa un producto ofrecido por el banco. Ubicación prevista: `src/core/entities/FinancialProduct.ts`.

| Field           | Type (TS) | Reglas de negocio |
|-----------------|-----------|-------------------|
| `id`            | `string`  | Requerido; 3–10 caracteres; único en catálogo (verificación remota en alta) |
| `name`          | `string`  | Requerido; 5–100 caracteres (spec; ver research si backend exige 6) |
| `description`   | `string`  | Requerido; 10–200 caracteres |
| `logo`          | `string`  | Requerido; URL válida |
| `date_release`  | `string`  | ISO 8601 (fecha); ≥ fecha actual (calendario local para “hoy”) |
| `date_revision` | `string`  | ISO 8601; exactamente un año después de `date_release` |

### Relaciones

- Sin relaciones a otras entidades en esta feature; lista plana de productos.

### Ciclo de vida

1. **Creación**: POST tras validación local + ID no existente.
2. **Lectura**: GET listado y GET detalle por `id` (desde lista o estado).
3. **Actualización**: PUT con mismo `id` (no editable en UI).
4. **Eliminación**: DELETE tras confirmación en modal.

### Mapper (DTO ↔ entidad)

- El API devuelve/recibe objetos alineados a `ProductInterface` / `ProductDTO` del backend; el mapper
  normaliza fechas (`Date` vs `string`) y campos faltantes.
- Respuestas envueltas: listado `{ data: Product[] }`; crear `{ data: Product, message?: string }`;
  errores HTTP 400/404 con mensajes mapeados a español en capa `data` o `presentation`.
