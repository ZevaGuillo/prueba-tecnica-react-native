# Quickstart: desarrollo local (catálogo + API)

## Prerrequisitos

- Node.js 20+ recomendado
- npm o pnpm
- Para móvil: Android Studio / Xcode o dispositivo con Expo Go (según flujo)

## 1. API de productos

Este repositorio es solo el cliente. Necesitas un backend que exponga las rutas bajo `/bp/products`
(por ejemplo en el puerto **3002**). Ajusta `EXPO_PUBLIC_API_BASE` a la URL real.

## 2. Cliente Expo (raíz del repo)

```bash
cd /home/guillermo-zevallos/Documentos/projects/guillo/prueba-frontend-react-native
npm install
```

Definir la base del API (ejemplo):

```bash
export EXPO_PUBLIC_API_BASE=http://localhost:3002
```

En Android emulator, `localhost` suele ser el emulador mismo; usar `10.0.2.2:3002` para apuntar al
host si es necesario.

Arrancar:

```bash
npm run start
```

Luego abrir en iOS / Android / web según indicaciones de Expo.

## 3. Pruebas

```bash
npm test
npm run test:coverage
```

Cobertura: ver `jest.config.js` y constitución (≈70% global en sentencias/líneas; `src/presentation/screens/**/*Screen.tsx` excluidas del informe como orquestación).

## 4. Documentación de la feature

- Especificación: `specs/001-bank-products-crud/spec.md`
- Plan: `specs/001-bank-products-crud/plan.md`
- Contrato HTTP: `specs/001-bank-products-crud/contracts/products-http.md`
