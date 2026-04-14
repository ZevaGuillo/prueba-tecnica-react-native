# Feature Specification: Gestión completa de productos financieros (catálogo bancario)

**Feature Branch**: `001-bank-products-crud`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "quiero implementar todo"

<!--
  Constitution: For product/financial CRUD features, align functional requirements and acceptance
  scenarios with `.specify/memory/constitution.md` (scope table, FinancialProduct rules, API paths).
-->

## Clarifications

### Session 2026-04-14

- Q: ¿Los requerimientos **F1–F6** (maquetación **D1–D4** y validaciones por campo) están contemplados
  en esta especificación? → A: **Sí a nivel funcional** (historias y FR ya cubrían listado, búsqueda,
  conteo, detalle, alta con reinicio, edición con ID fijo, eliminación con modal y validaciones
  agregadas). **Faltaba** trazabilidad explícita F1–F6, referencias a diseños D1–D4, matriz de
  validación por campo y la entrada de alta desde el catálogo acorde a **D3**; todo queda integrado
  en esta revisión.
- Q: Contrato HTTP confirmado para **obtener, crear, actualizar, eliminar** y **verificación de
  ID** → A: Host de ejemplo `http://localhost:3002` (configurable por entorno). **GET**
  `/bp/products` → 200 `{ "data": [ Product ] }`. **POST** `/bp/products` con cuerpo JSON del
  producto completo → 200 `{ "message", "data" }`; 400 cuerpo tipo `BadRequestError` con texto
  orientativo y detalles en `errors` cuando el servidor lo provea. **PUT** `/bp/products/:id` con
  cuerpo de campos a actualizar (identificador solo en ruta) → 200 mensaje + `data`; 404 si no
  existe. **DELETE** `/bp/products/:id` → 200 `{ "message": "Product removed successfully" }` o 404.
  **GET** `/bp/products/verification/:id` → 200 valor booleano: **true** si el ID existe, **false**
  si no existe. Respuestas 404 habituales con mensaje del estilo *Not product found with that
  identifier*.

### Alcance normativo F1–F6 (trazabilidad)

- **F1**: Aplicación que muestra productos financieros del banco cargados desde el servicio remoto;
  maquetación del listado y flujo según **D1**; al seleccionar un ítem, otra vista muestra **toda** la
  información de ese producto.
- **F2**: Búsqueda mediante campo de texto; maquetación según **D1**.
- **F3**: Listado de registros obtenidos y su cantidad visible; maquetación según **D1**.
- **F4**: Acción principal para ir al formulario de registro; formulario con envío de alta y acción
  de limpieza ("Reiniciar"); maquetación del formulario **D2**; ubicación del botón principal de
  acceso al flujo según **D3**; validaciones previas al envío según tabla de campos más abajo.
- **F5**: Acción que navega al formulario de edición; campo identificador deshabilitado; mismas
  validaciones y errores por campo que en F4; maquetación **D2**.
- **F6**: Modal de confirmación con "Cancelar" (solo cierra) y "Eliminar" (procede al borrado);
  maquetación **D4**.

### Validación por campo (antes del envío)

| Campo            | Reglas de aceptación |
|------------------|----------------------|
| Id               | Requerido; entre 3 y 10 caracteres; no duplicado, verificado mediante servicio de verificación de identificadores antes de crear |
| Nombre           | Requerido; entre 5 y 100 caracteres |
| Descripción      | Requerido; entre 10 y 200 caracteres |
| Logo             | Requerido |
| Fecha liberación | Requerido; fecha igual o posterior a la fecha actual |
| Fecha revisión   | Requerido; exactamente un año posterior a la fecha de liberación |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar catálogo y buscar (Priority: P1)

Una persona usuaria abre la aplicación y ve el listado de productos financieros ofrecidos por el
banco, puede escribir en un buscador para acotar por nombre o identificador, y ve cuántos
resultados hay en ese momento.

**Why this priority**: Sin listado y búsqueda no hay valor base; es el punto de entrada a todo el
flujo.

**Independent Test**: Con datos de prueba cargados, abrir la app y comprobar que la lista muestra
productos, el contador coincide con los ítems visibles (según filtro), y el buscador reduce la lista
sin salir de la pantalla principal.

**Acceptance Scenarios**:

1. **Given** hay productos disponibles en el catálogo, **When** la usuaria abre la pantalla
   principal, **Then** ve una lista desplazable con nombre e identificador de cada producto y un
   indicador de cantidad de registros acorde a lo mostrado.
2. **Given** la lista está visible, **When** la usuaria escribe texto en el buscador, **Then** la
   lista se filtra en tiempo real o tras una acción explícita y el contador refleja solo los
   resultados coincidentes.
3. **Given** el buscador no coincide con ningún producto, **When** la usuaria busca, **Then** ve
   un estado vacío claro (sin errores confusos).

---

### User Story 2 - Ver detalle de un producto (Priority: P2)

La usuaria selecciona un producto en la lista y accede a una vista donde ve toda la información
relevante del producto (identificador, nombre, descripción, imagen de marca, fechas de liberación y
revisión).

**Why this priority**: La lectura detallada es necesaria antes de editar o eliminar con contexto.

**Independent Test**: Desde la lista, abrir un ítem y verificar que todos los campos obligatorios del
producto se muestran correctamente, incluida la imagen cuando la URL es válida.

**Acceptance Scenarios**:

1. **Given** un producto en la lista, **When** la usuaria lo selecciona, **Then** navega a detalle y
   ve identificador, nombre, descripción, logo, fecha de liberación y fecha de revisión.
2. **Given** el detalle está abierto, **When** la usuaria vuelve atrás, **Then** regresa al listado
   conservando el contexto de búsqueda cuando aplique.

---

### User Story 3 - Registrar un producto nuevo (Priority: P3)

La usuaria completa un formulario de alta con validaciones claras, incluida la comprobación de que
el identificador no esté duplicado, y envía el registro. Tras un alta exitosa, recibe confirmación
y el catálogo refleja el nuevo producto.

**Why this priority**: Completa el ciclo de creación exigido por el negocio.

**Independent Test**: Crear un producto con datos válidos y verificar persistencia en el catálogo;
intentar un duplicado y ver error de unicidad.

**Acceptance Scenarios**:

1. **Given** la usuaria está en el formulario de alta, **When** introduce datos válidos y envía,
   **Then** el sistema valida campos, confirma unicidad del identificador y el producto aparece en
   el listado.
2. **Given** el identificador ya existe, **When** la usuaria intenta guardar, **Then** ve un error
   de duplicidad en el campo identificador sin guardar datos inválidos.
3. **Given** hay errores de validación, **When** la usuaria envía o abandona campos obligatorios,
   **Then** ve mensajes por campo y no puede completar el envío hasta corregirlos.
4. **Given** el formulario tiene datos, **When** la usuaria usa la acción de reinicio, **Then** los
   campos y errores visibles se limpian.

---

### User Story 4 - Editar un producto existente (Priority: P4)

La usuaria abre el formulario de edición desde el detalle; el identificador no es editable; el resto
de campos sigue las mismas reglas de validación que el alta.

**Why this priority**: Mantiene datos al día sin recrear registros.

**Independent Test**: Editar descripción u otra regla permitida, guardar, y ver cambios en detalle y
lista; comprobar que el identificador no cambia.

**Acceptance Scenarios**:

1. **Given** un producto existente, **When** la usuaria entra a editar, **Then** el identificador se
   muestra deshabilitado y los demás campos cargan valores actuales.
2. **Given** cambios válidos, **When** guarda, **Then** el detalle y el listado reflejan la
   información actualizada.

---

### User Story 5 - Eliminar un producto (Priority: P5)

La usuaria solicita eliminar desde el detalle; el sistema muestra un diálogo de confirmación con
acciones de cancelar o confirmar. Si confirma, el producto deja de aparecer en el catálogo.

**Why this priority**: Operación sensible; va después de consulta y edición.

**Independent Test**: Eliminar un producto de prueba y verificar desaparición del listado; cancelar
en el modal y verificar que no hay cambios.

**Acceptance Scenarios**:

1. **Given** detalle de producto, **When** la usuaria elige eliminar, **Then** aparece confirmación
   con opciones claras de cancelar o confirmar borrado.
2. **Given** el modal abierto, **When** cancela, **Then** el producto permanece sin cambios.
3. **Given** el modal abierto, **When** confirma, **Then** el producto ya no aparece en el catálogo.

---

### Edge Cases

- Catálogo vacío: mensaje o estado vacío comprensible; sin fallos silenciosos.
- Fallo al cargar datos (servicio no disponible): mensaje comprensible para la usuaria, opción de
  reintentar cuando tenga sentido.
- Búsqueda sin coincidencias: lista vacía con feedback, no error genérico.
- Imagen de logo inválida o no cargable: comportamiento definido (p. ej. placeholder o mensaje
  acotado) sin bloquear el resto del detalle.
- Validación de fechas: liberación no anterior a “hoy” según reglas de negocio; revisión alineada
  con la regla de un año posterior a la liberación.
- Envío concurrente o repetido: el sistema evita duplicados de negocio mediante validación de
  identificador.
- Error 400 en alta/actualización: el usuario ve mensaje claro; si el servidor envía `errors` por
  campo, puede mapearse a errores por campo cuando el contrato lo permita.
- Error 404 en edición/eliminación: mensaje coherente con “producto no encontrado” sin exponer
  detalles técnicos innecesarios.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar un catálogo de productos financieros obtenido del servicio de
  datos del banco.
- **FR-002**: La usuaria MUST poder buscar productos por nombre o identificador sobre el conjunto
  mostrado, con actualización del listado y del contador de registros.
- **FR-003**: El sistema MUST mostrar en todo momento un contador coherente con los ítems visibles
  según búsqueda o filtros aplicados.
- **FR-004**: La usuaria MUST poder abrir el detalle de un producto y ver todos los atributos de
  negocio: identificador, nombre, descripción, logo, fecha de liberación, fecha de revisión.
- **FR-005**: La usuaria MUST poder crear un producto mediante formulario con botones de envío y
  reinicio, validación por campo y mensajes comprensibles.
- **FR-006**: Antes de crear, el sistema MUST verificar que el identificador no exista ya en el
  catálogo remoto.
- **FR-007**: Las reglas de negocio para alta MUST incluir: identificador con longitud permitida;
  nombre y descripción dentro de rangos; logo obligatorio; fechas válidas según reglas de negocio
  (liberación no anterior a la fecha corriente; revisión exactamente un año después de la
  liberación).
- **FR-008**: La usuaria MUST poder editar un producto existente con el identificador bloqueado y el
  mismo conjunto de validaciones que en alta, salvo lo inherente al identificador fijo.
- **FR-009**: La usuaria MUST poder eliminar un producto solo tras confirmación explícita en un
  modal.
- **FR-010**: El sistema MUST presentar errores de validación y de servicio con mensajes claros para
  la usuaria, sin jerga técnica innecesaria.
- **FR-011**: El sistema MUST permitir navegar entre listado, detalle, formularios y acciones de
  eliminación de forma coherente y predecible.
- **FR-012**: El sistema MUST exponer desde el catálogo una acción clara para iniciar el registro
  (F4) cuya ubicación y jerarquía visual sigan el diseño de referencia **D3**; las pantallas de
  listado, búsqueda y contador (F1–F3) MUST alinearse a **D1**; el formulario de alta y el de
  edición (F4–F5) MUST alinearse a **D2**; el diálogo de eliminación (F6) MUST alinearse a **D4**.
- **FR-013**: Las validaciones por campo MUST coincidir con la tabla en **Clarifications** para alta
  y edición; los errores MUST mostrarse por campo antes o al envío, según corresponda al flujo de
  validación acordado en planificación.

### Key Entities *(include if feature involves data)*

- **Producto financiero**: Representa un producto ofrecido por el banco. Atributos de negocio:
  identificador único (texto acotado), nombre, descripción, URL o referencia de logo, fecha de
  liberación, fecha de revisión ligada por regla de negocio a la liberación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una usuaria puede localizar un producto por nombre o identificador en menos de 10
  segundos en condiciones normales de uso.
- **SC-002**: Tras un alta o edición válida, el detalle muestra los datos actualizados sin
  inconsistencias respecto al listado en la misma sesión.
- **SC-003**: En escenarios de error de servicio o validación, al menos el 90% de las pruebas de
  aceptación manuales documentan un mensaje comprensible y una acción siguiente clara (corregir
  campo, reintentar, cancelar).
- **SC-004**: Las operaciones de eliminación requieren confirmación explícita; en pruebas, cero
  borrados accidentales cuando la usuaria cancela el diálogo.

## Assumptions

- Las usuarias tienen conectividad suficiente para operar el catálogo; los fallos de red se manejan
  con mensajes claros.
- Existe un servicio de backend del banco que mantiene la fuente de verdad de productos; la
  aplicación cliente se alinea a las reglas de datos y operaciones descritas en la gobernanza del
  proyecto (constitución). El contrato de rutas y formas de respuesta acordadas para esta feature
  están resumidos en **Clarifications** y detallados en `contracts/products-http.md` (misma fuente
  que el ejemplo `http://localhost:3002`).
- El alcance incluye listado, búsqueda, conteo, detalle, alta, edición y baja con las reglas
  anteriores; no se incluye autenticación de usuarias en esta especificación salvo que otra
  especificación la defina.
- Los entregables de diseño **D1** (listado, búsqueda, contador), **D2** (formularios alta/edición),
  **D3** (ubicación del botón principal de acceso al registro desde el catálogo) y **D4** (modal de
  eliminación) son referencias de aceptación de maquetación; el flujo y jerarquía MUST alinearse; el
  refinado pixel-perfect puede detallarse en planificación.
