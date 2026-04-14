# HTTP contract: Productos (`/bp`)

Base URL de ejemplo: `http://localhost:3002` (desarrollo). Rutas del controlador bajo prefijo global
`/bp` → `/products` efectivo como `/bp/products`.

---

## Obtener productos (listado)

| | |
|---|---|
| **URL** | `/bp/products` |
| **METHOD** | `GET` |
| **Ejemplo** | `http://localhost:3002/bp/products` |

**Response 200**

```json
{
  "data": [
    {
      "id": "uno",
      "name": "Nombre producto",
      "description": "Descripción producto",
      "logo": "assets-1.png",
      "date_release": "2025-01-01",
      "date_revision": "2025-01-01"
    }
  ]
}
```

---

## Crear producto

| | |
|---|---|
| **URL** | `/bp/products` |
| **METHOD** | `POST` |
| **Ejemplo** | `http://localhost:3002/bp/products` |

**Request body (JSON)**

```json
{
  "id": "dos",
  "name": "Nombre producto",
  "description": "Descripción producto",
  "logo": "assets-1.png",
  "date_release": "2025-01-01",
  "date_revision": "2025-01-01"
}
```

**Response 200**

```json
{
  "message": "Product added successfully",
  "data": {
    "id": "dos",
    "name": "Nombre producto",
    "description": "Descripción producto",
    "logo": "assets-1.png",
    "date_release": "2025-01-01",
    "date_revision": "2025-01-01"
  }
}
```

**Response 400** (ejemplo)

```json
{
  "name": "BadRequestError",
  "message": "Invalid body, check 'errors' property for more info."
}
```

*(El servidor puede incluir más metadatos; revisar propiedad `errors` cuando exista.)*

---

## Actualizar producto

| | |
|---|---|
| **URL** | `/bp/products/:id` |
| **METHOD** | `PUT` |
| **Ejemplo** | `http://localhost:3002/bp/products/uno` |

**Request body (JSON)** — identificador en la ruta; cuerpo con campos a actualizar:

```json
{
  "name": "Nombre actualizado",
  "description": "Descripción producto",
  "logo": "assets-1.png",
  "date_release": "2025-01-01",
  "date_revision": "2025-01-01"
}
```

**Response 200**

```json
{
  "message": "Product updated successfully",
  "data": {
    "name": "Nombre actualizado",
    "description": "Descripción producto",
    "logo": "assets-1.png",
    "date_release": "2025-01-01",
    "date_revision": "2025-01-01"
  }
}
```

**Response 404** (ejemplo)

```json
{
  "name": "NotFoundError",
  "message": "Not product found with that identifier"
}
```

---

## Eliminar producto

| | |
|---|---|
| **URL** | `/bp/products/:id` |
| **METHOD** | `DELETE` |
| **Ejemplo** | `http://localhost:3002/bp/products/dos` |
| **Params** | `id` (ej. `dos`) |

**Response 200**

```json
{
  "message": "Product removed successfully"
}
```

**Response 404** (ejemplo)

```json
{
  "name": "NotFoundError",
  "message": "Not product found with that identifier"
}
```

---

## Verificación de existencia de ID

| | |
|---|---|
| **URL** | `/bp/products/verification/:id` |
| **METHOD** | `GET` |
| **Ejemplo** | `http://localhost:3002/bp/products/verification/uno` |
| **Params** | `id` (ej. `uno`) |

**Response 200**

- Cuerpo: `true` o `false` (JSON boolean).
- **true**: el identificador **existe**.
- **false**: el identificador **no existe**.

---

## Detalle por ID (referencia)

| | |
|---|---|
| **URL** | `/bp/products/:id` |
| **METHOD** | `GET` |

Documentado en el backend de referencia para obtener un solo producto; alinear con listado para
forma de objeto `Product`.

---

## Objeto `Product` (campos)

| Campo | Tipo (JSON) | Notas |
|-------|-------------|--------|
| `id` | string | Identificador único |
| `name` | string | |
| `description` | string | |
| `logo` | string | Ruta o nombre de recurso (ej. `assets-1.png`) |
| `date_release` | string (fecha ISO) | |
| `date_revision` | string (fecha ISO) | |

Validaciones de cliente y negocio: ver `spec.md` (tabla de validación) y `data-model.md`.
