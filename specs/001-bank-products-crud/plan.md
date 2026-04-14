# Implementation Plan: Gestión completa de productos financieros (catálogo bancario)

**Branch**: `001-bank-products-crud` | **Date**: 2026-04-14 | **Spec**:
`/specs/001-bank-products-crud/spec.md`  
**Input**: Feature specification from `/specs/001-bank-products-crud/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar la aplicación móvil de catálogo de productos financieros (F1–F6) contra el API REST bajo
prefijo `/bp`, con arquitectura limpia en `src/`, UI propia sin librerías de componentes, navegación
basada en Expo Router en `app/` como capa fina, y cliente HTTP en `data/` consumiendo el backend de
referencia en `backend/repo-interview-main/`. Incluye listado con búsqueda y contador (D1), detalle,
formulario alta/edición con validaciones y verificación de ID (D2/D3), y modal de eliminación (D4).

## Technical Context

**Language/Version**: TypeScript ~5.9 (strict), JavaScript tooling Node 20+  
**Primary Dependencies**: Expo ~54, React Native 0.81.x, React 19, Expo Router ~6 (React Navigation 7
bajo el capó), `expo-image`, `react-native-safe-area-context`, `react-native-screens`  
**Storage**: N/A en cliente (estado en memoria/Context); persistencia de productos en backend en
memoria (proceso actual del servidor de referencia)  
**Testing**: Jest 29 + React Native Testing Library (añadir vía `jest-expo` / config en research);
ESLint + Prettier (Expo)  
**Target Platform**: iOS, Android, Web (Expo) según matriz del proyecto  
**Project Type**: mobile-app (Expo) + API HTTP externa (backend existente en monorepo)  
**Performance Goals**: Lista fluida con `FlatList`; pantallas con estados de carga; sin bloqueo UI en
validación asíncrona de ID (debounce)  
**Constraints**: Sin UI kits de terceros; mensajes de error en español; cobertura mínima 70% global
con prioridades por capa (constitución); API base configurable (p. ej. `EXPO_PUBLIC_API_BASE`)  
**Scale/Scope**: ~6 pantallas/flujos principales; catálogo acotado a pruebas; sin autenticación en
esta feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates MUST be verified against `.specify/memory/constitution.md` (App Banco React Native):

- [x] **Stack and UI**: React Native ≥ 0.73, TypeScript strict, navegación compatible con React
      Navigation (Expo Router); sin NativeBase/Paper; estilos con `StyleSheet.create` y
      `shared/theme`.
- [x] **Architecture**: `presentation` → `core` ← `data`; sin `fetch` en componentes de vista;
      casos de uso + `IProductRepository`.
- [x] **Testing**: Plan incluye Jest 29 + RNTL y umbrales de cobertura por capa (ver research).
- [x] **Errors and UX**: Errores en español; rutas tipadas; accesibilidad en controles; sin
      `console.log` en entrega.
- [x] **Product domain**: Endpoints alineados con constitución: `GET/POST /bp/products`,
      `GET /bp/products/verification/:id`, `PUT/DELETE /bp/products/:id`.

**Post Phase 1 design**: Sin cambios que violen los gates; detalle en `research.md` (Expo Router como
fachada de navegación) y `contracts/`.

## Project Structure

### Documentation (this feature)

```text
specs/001-bank-products-crud/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/                              # Expo Router: rutas finas que montan pantallas
├── (tabs)/ or _layout.tsx       # A definir en implementación
└── ...

src/
├── core/
│   ├── entities/FinancialProduct.ts
│   ├── repositories/IProductRepository.ts
│   └── usecases/                 # GetProducts, CreateProduct, UpdateProduct, DeleteProduct, VerifyProductId
├── data/
│   ├── datasources/ProductRemoteDataSource.ts
│   ├── repositories/ProductRepositoryImpl.ts
│   └── mappers/ProductMapper.ts
├── presentation/
│   ├── screens/                  # ProductList, ProductDetail, ProductForm, DeleteModal, etc.
│   └── navigation/               # tipos de rutas / helpers si no cubiertos solo por Expo Router
├── shared/
│   ├── constants/
│   ├── hooks/
│   ├── theme/
│   └── utils/validators.ts
└── __tests__/                    # Espejo de src/

backend/repo-interview-main/      # API de referencia (Express, prefijo /bp)
├── src/
│   ├── controllers/ProductControllers.ts
│   └── dto/Product.ts
└── package.json
```

**Structure Decision**: El cliente móvil implementa la constitución bajo `src/`. Las rutas visibles
para Expo permanecen en `app/` importando pantallas desde `presentation/`, manteniendo la regla de
dependencias. El backend no se reescribe en esta feature; se documenta el contrato HTTP en
`contracts/` y se asume host local para desarrollo.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Expo Router en lugar de un único `AppNavigator.tsx` | Plantilla Expo actual usa file-based routing | Reescribir todo el esqueleto retrasa entrega; los tipos de navegación y flujos se replican en el árbol `app/` |
