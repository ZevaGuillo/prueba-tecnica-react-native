---

description: "Task list for 001-bank-products-crud (Expo + clean architecture)"
---

# Tasks: Gestión completa de productos financieros (catálogo bancario)

**Input**: Design documents from `/specs/001-bank-products-crud/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Incluidas tareas mínimas de prueba en fase final para cumplir cobertura por capas (`.specify/memory/constitution.md`); no TDD estricto salvo orden sugerido.

**Organization**: Por historia de usuario (US1–US5) según prioridades del spec.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencia de tareas incompletas del mismo lote)
- **[USn]**: Historia de usuario (solo fases US1–US5)
- Rutas absolutas desde la raíz del repositorio salvo que se indique `src/` en raíz del app

## Path Conventions

- Cliente: `src/core/`, `src/data/`, `src/presentation/`, `src/shared/`, `src/__tests__/` (espejo)
- Rutas Expo Router: `app/` en la raíz del repo
- Contrato API: `specs/001-bank-products-crud/contracts/products-http.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura, variables de entorno, toolchain de pruebas.

- [X] T001 Create carpetas `src/core/entities`, `src/core/repositories`, `src/core/usecases`, `src/data/datasources`, `src/data/repositories`, `src/data/mappers`, `src/presentation/screens`, `src/presentation/navigation`, `src/shared/constants`, `src/shared/hooks`, `src/shared/theme`, `src/shared/utils`, `src/__tests__` según `plan.md`
- [X] T002 [P] Add archivo `.env.example` en la raíz con `EXPO_PUBLIC_API_BASE=http://localhost:3002` documentado en comentario para emulador Android (`10.0.2.2`) si aplica
- [X] T003 [P] Add dependencias de prueba: `jest-expo`, `@testing-library/react-native`, `@types/jest` y script `test` / `test:coverage` en `package.json` según `research.md`
- [X] T004 Add `jest.config.js` (o campo jest en `package.json`) con preset `jest-expo` y `moduleNameMapper` para alias si se configuran en T005
- [X] T005 [P] Configure path aliases TypeScript (`@/core`, `@/data`, `@/presentation`, `@/shared` o equivalente) en `tsconfig.json` y resolución compatible con Metro (`babel.config.js` / `metro.config.js` si hace falta)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Entidad, contratos HTTP, casos de uso, repositorio, tema, validadores — **ninguna historia US* puede empezar antes**.

**⚠️ CRITICAL**: Completar esta fase antes de rutas/pantallas.

- [X] T006 Create interface `FinancialProduct` en `src/core/entities/FinancialProduct.ts` alineada a `data-model.md`
- [X] T007 Create `IProductRepository` en `src/core/repositories/IProductRepository.ts` con métodos getAll, getById, create, update, delete, verifyId según `contracts/products-http.md`
- [X] T008 [P] Create `src/data/datasources/ApiClient.ts` singleton (`fetch`, base `process.env.EXPO_PUBLIC_API_BASE`, manejo de errores con mensajes en español para UI)
- [X] T009 [P] Create `src/data/mappers/ProductMapper.ts` para mapear DTO JSON ↔ `FinancialProduct`
- [X] T010 Create `src/data/datasources/ProductRemoteDataSource.ts` implementando llamadas GET/POST/PUT/DELETE y GET verification contra `/bp/products` (contrato en `contracts/products-http.md`)
- [X] T011 Create `src/data/repositories/ProductRepositoryImpl.ts` implementando `IProductRepository` usando `ProductRemoteDataSource` y `ProductMapper`
- [X] T012 Create casos de uso en `src/core/usecases/GetProducts.ts`, `GetProductById.ts`, `CreateProduct.ts`, `UpdateProduct.ts`, `DeleteProduct.ts`, `VerifyProductId.ts` inyectando `IProductRepository`
- [X] T013 [P] Create tokens de tema en `src/shared/theme/index.ts` (colores, spacing, tipografía) sin librerías UI de terceros
- [X] T014 [P] Create validadores puros en `src/shared/utils/validators.ts` según tabla del `spec.md` (id, nombre, descripción, logo, fechas)
- [X] T015 [P] Create `src/shared/hooks/useDebounce.ts` para verificación remota de ID (~400 ms)
- [X] T016 Create factoría o módulo de composición `src/presentation/di/productsComposition.ts` (o similar) que instancie repositorio y casos de uso para inyección en pantallas

**Checkpoint**: Fundación lista — puede comenzar US1.

---

## Phase 3: User Story 1 - Consultar catálogo y buscar (Priority: P1) 🎯 MVP

**Goal**: Listado desde API, búsqueda por texto, contador de registros, maquetación D1, estados vacío/carga/error.

**Independent Test**: Con API en marcha (`quickstart.md`), pantalla principal muestra lista, buscador filtra, contador coincide; sin navegar a detalle.

### Implementation for User Story 1

- [X] T017 [US1] Create `src/presentation/screens/ProductList/ProductListScreen.tsx` con `FlatList`, cabecera “BANCO”, campo búsqueda y contador según D1
- [X] T018 [P] [US1] Create `src/presentation/screens/ProductList/useProductListViewModel.ts` (carga `GetProducts`, query, filtrado local por nombre/id, total, loading/error)
- [X] T019 [P] [US1] Create `src/presentation/screens/ProductList/components/ProductItem.tsx` y `SearchBar.tsx` con `StyleSheet` + tema
- [X] T020 [US1] Wire ruta Expo `app/index.tsx` (o `app/(bank)/index.tsx` si agrupas) que monte `ProductListScreen` y tipos de navegación en `src/presentation/navigation/types.ts`
- [X] T021 [US1] Add manejo de estados vacío, error de red con reintento y accesibilidad (`accessibilityRole` / `accessibilityLabel`) en listado

**Checkpoint**: US1 verificable sola (MVP).

---

## Phase 4: User Story 2 - Ver detalle de un producto (Priority: P2)

**Goal**: Pantalla detalle con todos los campos; imagen logo con `expo-image`; volver preservando búsqueda cuando aplique.

**Independent Test**: Desde lista, abrir ítem por `id`; ver todos los atributos; volver atrás.

### Implementation for User Story 2

- [X] T022 [US2] Create `src/presentation/screens/ProductDetail/ProductDetailScreen.tsx` y `useProductDetailViewModel.ts` usando `GetProductById` (o dato pasado + refresh opcional)
- [X] T023 [P] [US2] Create componentes de fila de detalle en `src/presentation/screens/ProductDetail/components/` (label/valor, imagen logo con fallback)
- [X] T024 [US2] Add ruta Expo `app/product/[id].tsx` con param `id`, navegación desde `ProductList` pasando solo `id` preferentemente
- [X] T025 [US2] Add botón o acción hacia formulario de edición y hacia flujo de eliminar (navegación stub aceptable hasta US4/US5)

**Checkpoint**: US2 independiente con US1 previa.

---

## Phase 5: User Story 3 - Registrar un producto nuevo (Priority: P3)

**Goal**: Formulario alta D2, botón principal acceso D3, Reiniciar, validación sync + verificación async de ID, POST create, feedback español.

**Independent Test**: Crear producto válido aparece en lista; ID duplicado muestra error; Reiniciar limpia.

### Implementation for User Story 3

- [X] T026 [US3] Create `src/presentation/screens/ProductForm/useProductFormViewModel.ts` modo `create` con estado de campos, errores por campo, debounce a `VerifyProductId`, submit `CreateProduct`
- [X] T027 [P] [US3] Create `src/presentation/screens/ProductForm/ProductFormScreen.tsx` campos Id, Nombre, Descripción, Logo, Fecha liberación, Fecha revisión (readonly calculada +1 año), botones enviar y reiniciar según D2
- [X] T028 [US3] Add ruta `app/product/new.tsx` y botón “Agregar” en `ProductListScreen` / layout D3 que navegue a `product/new`
- [X] T029 [US3] Mapear errores 400 del servidor a mensajes por campo cuando exista `errors` en cuerpo de respuesta

**Checkpoint**: Flujo de alta completo.

---

## Phase 6: User Story 4 - Editar un producto existente (Priority: P4)

**Goal**: Mismo formulario D2, `id` deshabilitado, PUT, validaciones como alta.

**Independent Test**: Editar campo, guardar; lista y detalle reflejan cambios; `id` inmutable.

### Implementation for User Story 4

- [X] T030 [US4] Extend `useProductFormViewModel.ts` con modo `edit`: precarga desde `GetProductById`, deshabilita `id`, usa `UpdateProduct`
- [X] T031 [US4] Add ruta `app/product/edit/[id].tsx` (o equivalente acordado) y navegación desde detalle con `id`
- [X] T032 [US4] Manejar 404 en edición con mensaje de producto no encontrado

**Checkpoint**: Edición completa.

---

## Phase 7: User Story 5 - Eliminar un producto (Priority: P5)

**Goal**: Modal D4, Cancelar cierra, Eliminar llama DELETE y refresca catálogo.

**Independent Test**: Cancelar no borra; confirmar elimina y desaparece de la lista.

### Implementation for User Story 5

- [X] T033 [US5] Create `src/presentation/screens/ProductDetail/components/DeleteConfirmModal.tsx` (o `presentation/components/`) según D4 con textos en español
- [X] T034 [US5] Wire `DeleteProduct` en `useProductDetailViewModel` o hook dedicado; al éxito, `router` vuelve a lista o invalida datos
- [X] T035 [US5] Asegurar accesibilidad y cierre sin fugas de estado en el modal

**Checkpoint**: CRUD vertical completo.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Pruebas por capas (constitución), cobertura, limpieza.

- [X] T036 [P] Add unit tests `src/__tests__/core/usecases/GetProducts.test.ts` y casos críticos de otros use cases con repositorio mock
- [X] T037 [P] Add unit tests `src/__tests__/shared/utils/validators.test.ts` cubriendo reglas del spec
- [X] T038 [P] Add pruebas de ViewModel o componentes clave con RNTL en `src/__tests__/presentation/` (interacciones lista/búsqueda y modal mínimo)
- [X] T039 Run `npm test` y `npm run test:coverage`; ajustar hasta ≥70% global con foco en prioridades de constitución
- [X] T040 Remove `console.log` de código de feature; ejecutar `npm run lint`; validar `quickstart.md` end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → sin dependencias.
- **Foundational (Phase 2)** → depende de Setup; **bloquea todas las US**.
- **US1 (Phase 3)** → después de Foundational.
- **US2–US5** → después de Foundational; orden recomendado US1 → US2 → US3 → US4 → US5 por dependencia de navegación y reutilización del formulario.
- **Polish (Phase 8)** → después de US5 (o al menos después de Foundational para T036–T037 en paralelo parcial).

### User Story Dependencies

- **US1**: Solo Foundational.
- **US2**: US1 + Foundational (navegación desde lista).
- **US3**: US1 + Foundational (volver a lista); opcional acoplar después de US2 para flujo más natural.
- **US4**: US2 + US3 (reutiliza formulario; requiere detalle o lista con `id`).
- **US5**: US2 (acciones desde detalle).

### Parallel Opportunities

- T003–T005 en Setup en paralelo parcial.
- T008–T009 y T013–T015 en Foundational tras definir interfaces.
- T019–T023 componentes marcados [P] cuando el contrato de props esté claro.
- T036–T038 en Polish en paralelo.

---

## Parallel Example: Foundational

```bash
# Tras T007, en paralelo:
Task: "Create src/data/datasources/ApiClient.ts ..."
Task: "Create src/data/mappers/ProductMapper.ts ..."
Task: "Create src/shared/theme/index.ts ..."
Task: "Create src/shared/utils/validators.ts ..."
Task: "Create src/shared/hooks/useDebounce.ts ..."
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup  
2. Phase 2 Foundational  
3. Phase 3 US1 → **STOP** y validar listado + búsqueda + contador con API real

### Incremental Delivery

1. US1 → US2 → US3 → US4 → US5  
2. Tras cada historia, probar criterio independiente del spec  
3. Polish al final para cobertura y lint

---

## Notes

- Contrato HTTP autoritativo: `specs/001-bank-products-crud/contracts/products-http.md` y `spec.md` Clarifications.
- API de productos: backend externo con prefijo `/bp` (p. ej. puerto 3002); no se incluye en este repo.
- **Total tasks**: T001–T040 (40 tareas).
