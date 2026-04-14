<!--
Sync Impact Report
- Version change: unversioned template → 1.0.0
- Principles: (none) → I Stack y UI personalizada; II Arquitectura limpia; III SOLID y módulos;
  IV Pruebas y cobertura; V UX, accesibilidad y errores
- Added sections: Core Principles; Scope, API Contract, and Domain Model; Implementation
  Standards and Quality Gates; Governance
- Removed sections: none (initial adoption from placeholder template)
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ updated (Constitution Check gates)
  - .specify/templates/spec-template.md — ✅ updated (constitution reference note)
  - .specify/templates/tasks-template.md — ✅ updated (RN path conventions)
  - .specify/templates/checklist-template.md — N/A (generic; /speckit.checklist fills from spec)
  - .specify/templates/commands/*.md — ⚠ not present (skipped)
- Follow-up TODOs: none
-->

# App Banco (React Native) Constitution

Documento normativo para la aplicación móvil bancaria en React Native. Toda decisión técnica del
proyecto MUST alinearse con este documento salvo excepción aprobada por el tech lead.

## Core Principles

### I. Obligatory Stack and Custom UI

El stack MUST incluir: React Native ≥ 0.73, TypeScript en modo estricto (≥ 5.0), React 18,
React Navigation 6 (Stack y Bottom Tabs), Jest 29 con React Native Testing Library, ESLint y
Prettier. La gestión de estado MUST usar Context API con useReducer o Zustand. Está PROHIBIDO
usar librerías de componentes prefabricados (por ejemplo NativeBase, React Native Paper). Todo el
UI MUST construirse con estilos propios mediante `StyleSheet.create` y tokens centralizados en
`shared/theme`.

**Rationale**: Control visual, menor deuda de dependencias y coherencia con requisitos de
entrega y defensa técnica.

### II. Clean Architecture and Dependency Rule

El código MUST organizarse en capas: `core/` (entidades, casos de uso, contratos de repositorio),
`data/` (fuentes remotas, implementaciones de repositorio, mappers), `presentation/` (pantallas con
ViewModel como hook, navegación), `shared/` (constantes, hooks genéricos, tema, utilidades) y
`__tests__/` espejando `src/`. La regla de dependencias es: `presentation` → `core` ← `data`. La
capa `core` MUST NOT importar desde `data` ni `presentation`.

**Rationale**: Testabilidad, sustitución de fuentes de datos y reglas de negocio estables.

### III. SOLID and Single-Purpose Modules

Cada archivo MUST tener una sola razón de cambio: `Screen` solo orquesta layout y navegación;
ViewModel (hook) solo estado y lógica de pantalla; cada `UseCase` una operación de negocio;
repositorio solo abstrae datos. Los casos de uso MUST depender de `IProductRepository` (u otras
interfaces), no de implementaciones concretas. Está PROHIBIDO realizar llamadas HTTP o fetch
directamente en componentes o pantallas; MUST delegarse en casos de uso vía repositorios.

**Rationale**: Cumplir RF/RNF de mantenibilidad y permitir mocks coherentes en pruebas.

### IV. Testing Discipline and Coverage

La cobertura global mínima MUST ser del 70%. Prioridades: `core/usecases/` al 100%,
`shared/utils/validators` al 100%, `data/` (repositorios y datasources) ≥ 80%, ViewModels ≥ 75%,
componentes ≥ 60% en interacciones clave. Toda función o hook nuevo con lógica MUST incluir pruebas
unitarias antes de merge. Los repositorios MUST poder sustituirse por implementaciones falsas que
cumplan el mismo contrato (LSP).

**Rationale**: Regresiones en reglas de negocio y validaciones son inaceptables en un contexto
bancario simulado.

### V. User-Facing Quality, Accessibility, and Errors

Toda llamada a API MUST envolverse en manejo de errores; los mensajes al usuario MUST estar en
español claro (no mensajes técnicos crudos). La navegación MUST estar tipada; MUST preferirse pasar
identificadores en lugar de objetos grandes cuando baste el estado o la recarga. Elementos
interactivos MUST exponer `accessibilityRole` y `accessibilityLabel` donde corresponda. Está
PROHIBIDO dejar `console.log` en código entregado. Los estilos MUST usar tokens del tema, no valores
mágicos dispersos.

**Rationale**: Usabilidad, accesibilidad y trazabilidad en revisión de código y demos.

## Scope, API Contract, and Domain Model

### Functional scope (use cases)

| ID | Caso de uso           | Descripción breve                                      | Endpoint / notas                          |
|----|-----------------------|--------------------------------------------------------|-------------------------------------------|
| F1 | Listar productos      | Lista desde API                                        | GET /bp/products                          |
| F2 | Buscar producto       | Filtro por nombre o ID                                 | Cliente sobre datos de F1               |
| F3 | Cantidad de registros | Contador visible                                       | Derivado de F1                            |
| F4 | Agregar producto      | Formulario validado + POST                             | POST /bp/products                         |
| F5 | Editar producto       | Como F4; ID no editable                                | PUT /bp/products/:id                      |
| F6 | Eliminar producto     | Modal de confirmación + DELETE                         | DELETE /bp/products/:id                   |
| –  | Verificar ID          | Unicidad de ID (creación)                              | GET /bp/products/verification/:id         |

### Entity: FinancialProduct

Campos y reglas MUST respetarse en dominio, validadores y mapeo:

- `id`: string, 3–10 caracteres, único en sistema.
- `name`: string, 5–100 caracteres.
- `description`: string, 10–200 caracteres.
- `logo`: string, URL válida.
- `date_release`: string ISO 8601; fecha MUST ser ≥ hoy (regla de negocio de formulario).
- `date_revision`: string ISO 8601; MUST ser exactamente un año después de `date_release`.

### Non-functional alignment

Arquitectura limpia, separación UI / negocio / servicios, listas eficientes (`FlatList`), estados de
carga (p. ej. skeletons), optimización de render cuando aplique, manejo explícito de 400/404 y
errores de red, compatibilidad con versiones mínimas del stack anterior, sin frameworks UI
prefabricados, repositorio Git público según entrega.

## Implementation Standards and Quality Gates

### Folder layout (normative)

La estructura MUST seguir el árbol acordado (resumen):

```text
src/
├── core/entities/FinancialProduct.ts
├── core/usecases/ (GetProducts, CreateProduct, UpdateProduct, DeleteProduct, VerifyProductId)
├── core/repositories/IProductRepository.ts
├── data/datasources/ProductRemoteDataSource.ts
├── data/repositories/ProductRepositoryImpl.ts
├── data/mappers/ProductMapper.ts
├── presentation/screens/<Screen>/ (Screen, ViewModel hook, components/)
├── presentation/navigation/AppNavigator.tsx
├── shared/constants/, shared/hooks/, shared/theme/, shared/utils/
└── __tests__/ (espejo de src/)
```

### Patrones obligatorios

- Repository en `data/repositories/`; ViewModel como custom hook; Mapper para DTO ↔ entidad;
  cliente HTTP singleton (`ApiClient`); validaciones de formulario intercambiables (Strategy);
  debounce ~400 ms para verificación remota de ID.

### Estado

Estado local (`useState`) para formularios y modales; `useReducer` o ViewModel para lógica de
pantalla; Context solo para datos que trascienden una pantalla. MUST NOT usar estado global para
datos exclusivos de un solo screen.

### Code style (extracción de reglas)

- Línea ≤ 80 caracteres cuando sea razonable; funciones y hooks ≤ 30 líneas o MUST refactorizar.
- MUST NOT usar `any`; usar tipos explícitos o `unknown` con refinamiento. `// @ts-ignore` solo con
  justificación en PR.
- Un componente por archivo; sin código comentado residual; comentarios solo para el “por qué”.

### Merge / review checklist (MUST verificar antes de aprobar)

- [ ] Sin `any` ni `@ts-ignore` sin justificación documentada.
- [ ] Nueva lógica cubierta por pruebas; cobertura global no por debajo del 70%.
- [ ] Sin llamadas API directas desde pantallas/componentes.
- [ ] Errores visibles al usuario; mensajes en español.
- [ ] Estilos desde tokens de tema.
- [ ] Accesibilidad básica en controles interactivos.
- [ ] Sin `console.log` en código entregado.
- [ ] Descripción de PR clara (qué cambia y por qué).

### Glosario breve

- **Entity**: modelo de negocio puro.
- **UseCase**: operación de negocio usando repositorio abstracto.
- **Repository**: contrato de acceso a datos.
- **DataSource**: implementación concreta (HTTP, etc.).
- **ViewModel**: hook que expone estado y acciones a un Screen.
- **Mapper**: conversión pura DTO ↔ entidad.

## Governance

Esta constitución MUST prevalecer sobre prácticas ad hoc no documentadas. Las enmiendas MUST
documentarse en PR, incrementar versión semántica del documento y obtener aprobación del tech lead.
**Versionado del documento**: MAJOR si se eliminan o redefinen principios de forma incompatible;
MINOR si se añaden secciones o guías materiales; PATCH para aclaraciones y correcciones sin cambio
de significado. Las revisiones de cumplimiento MUST realizarse en code review y al cerrar features
relevantes. El incumplimiento MUST justificarse en `plan.md` (Complejidad) o recibir excepción
explícita.

**Version**: 1.0.0 | **Ratified**: 2024-01-15 | **Last Amended**: 2026-04-14
