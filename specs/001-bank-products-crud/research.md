# Research: 001-bank-products-crud

## 1. Navegación: Expo Router vs. único Stack manual

**Decision**: Mantener **Expo Router** (`app/`) como capa de enrutamiento y definir **tipos de rutas**
y parámetros alineados a los flujos (lista → detalle → formulario create/edit). Las pantallas viven
en `presentation/screens/` y se importan desde archivos de ruta.

**Rationale**: El repositorio ya usa `expo-router` y `package.json` lo declara; cumple el espíritu de
“React Navigation” de la constitución (Expo Router construye sobre React Navigation).

**Alternatives considered**: Un solo `AppNavigator.tsx` sin Expo Router — mayor reescritura del
bootstrap actual.

---

## 2. Pruebas: Jest + React Native Testing Library

**Decision**: Añadir **Jest 29** con **`jest-expo`** y **`@testing-library/react-native`**, con
configuración en `jest.config.js` / `package.json` y scripts `test` / `test:coverage`.

**Rationale**: Constitución exige Jest 29 + RNTL y cobertura mínima; el proyecto aún no declara Jest
en dependencias.

**Alternatives considered**: Solo pruebas manuales — rechazado por gates de calidad.

---

## 3. Cliente HTTP y configuración de base URL

**Decision**: Un **`ApiClient`** singleton en `data/` usando `fetch`, base URL desde
`process.env.EXPO_PUBLIC_API_BASE` (p. ej. `http://localhost:3002` en desarrollo), rutas relativas
`/bp/products`.

**Rationale**: Alineación con constitución (singleton, capa data), compatibilidad con Expo
(variables `EXPO_PUBLIC_*`).

**Alternatives considered**: URL hardcodeada — rechazado por entornos distintos (emulador vs
dispositivo).

---

## 4. Validación cliente vs. DTO del backend (nombre mínimo)

**Decision**: Las validaciones de formulario siguen la **especificación** (nombre 5–100
caracteres). El DTO de referencia en `backend/repo-interview-main` usa `@MinLength(6)` para
`name`; se documenta como **posible divergencia** — priorizar spec en cliente; si el backend rechaza
5–6 caracteres, ajustar DTO en backend o elevar el mínimo en spec en una iteración posterior.

**Rationale**: La spec y la constitución de negocio fijan 5–100; el backend es referencia.

**Alternatives considered**: Forzar 6 en cliente — rechazado por conflicto con spec hasta acuerdo
explícito.

---

## 5. Estado global vs. local

**Decision**: **Context** (o Zustand si crece) para datos de catálogo compartidos entre listado y
detalle cuando navegación por `id` requiera refresco; formularios con estado local + ViewModels.

**Rationale**: Constitución: no estado global para datos exclusivos de una pantalla; catálogo
compartido justifica Context.

---

## 6. Verificación de ID asíncrona

**Decision**: Llamar al endpoint de verificación con **debounce ~400 ms** desde el ViewModel del
formulario de alta; no bloquear submit si la red falla sin mensaje claro.

**Rationale**: Constitución y spec F4; reduce carreras y carga.
