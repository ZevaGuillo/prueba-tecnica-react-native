# prueba-frontend-react-native

Cliente móvil (Expo / React Native) para gestionar un catálogo de **productos financieros**: listado con búsqueda, alta, detalle, edición y baja. La API se configura por variable de entorno.

## Requisitos

- **Node.js** 20 o superior (recomendado LTS)
- **npm** (el proyecto usa `package-lock.json`)

## Stack principal

| Tecnología | Versión (orientativa) |
|------------|------------------------|
| TypeScript | ~5.9 (modo estricto) |
| Expo | ~54 |
| React | 19 |
| React Native | 0.81 |
| Expo Router | ~6 (navegación basada en archivos) |
| React Navigation | 7 (tabs/stack vía Expo Router) |

## Configuración

Crea un archivo `.env` en la raíz del proyecto con la URL base del backend:

```bash
EXPO_PUBLIC_API_BASE=https://tu-api.example.com
```

Expo inyecta variables con prefijo `EXPO_PUBLIC_` en el bundle. Reinicia el servidor de desarrollo tras cambiar `.env`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala dependencias |
| `npm start` / `npx expo start` | Arranca Metro y la UI de Expo |
| `npm run android` | Abre en Android |
| `npm run ios` | Abre en iOS |
| `npm run web` | Abre en navegador |
| `npm run lint` | ESLint (config Expo) |
| `npm test` | Jest (tests en `src/__tests__/`) |
| `npm run test:coverage` | Jest con informe de cobertura |

## Dependencias

### Producción (runtime)

- **expo**, **expo-router** — aplicación y rutas
- **react**, **react-native** — UI
- **@react-navigation/native** y paquetes asociados — navegación (stack, elementos)
- **react-native-screens**, **react-native-safe-area-context** — pantallas y áreas seguras
- **react-native-gesture-handler**, **react-native-reanimated** — gestos y animaciones
- **react-native-web** — soporte web
- **@expo/vector-icons** — iconos (p. ej. Ionicons)
- **expo-image**, **expo-status-bar**, **expo-system-ui**, **expo-linking**, **expo-constants**, **expo-font**, **expo-splash-screen**, **expo-web-browser**, **expo-symbols** — utilidades Expo

### Desarrollo

- **typescript** — tipado
- **jest**, **jest-expo**, **@testing-library/react-native**, **react-test-renderer** — tests
- **eslint**, **eslint-config-expo** — lint
- **babel-plugin-module-resolver** — alias de rutas (`@/…`)

La lista completa y versiones exactas están en `package.json`.

## Estructura del proyecto

```text
app/                          # Expo Router: rutas y layouts
  _layout.tsx                 # Raíz: tema, SafeAreaProvider, barra de marca, Stack
  index.tsx                   # Inicio → ProductListScreen
  product/
    _layout.tsx               # Stack de producto (cabecera nativa, estilos)
    [id].tsx                  # Detalle
    new.tsx                   # Alta
    edit/[id].tsx             # Edición

src/
  core/                       # Dominio
    entities/                 # Entidades (p. ej. FinancialProduct)
    repositories/             # Contratos (IProductRepository)
    usecases/                 # Casos de uso (GetProducts, CreateProduct, …)

  data/                       # Infraestructura
    datasources/              # ApiClient, llamadas HTTP
    mappers/                  # DTO ↔ entidad
    repositories/             # ProductRepositoryImpl
    errors/                   # ApiError

  presentation/
    components/               # UI compartida (p. ej. AppBrandNavbar)
    screens/                  # Pantallas por feature (ProductList, ProductDetail, ProductForm)
    di/                       # Composición de casos de uso (productsComposition)
    navigation/               # Helpers de rutas tipadas (hrefProductDetail, …)

  shared/
    theme/                    # Colores, tipografía, espaciados
    hooks/                    # useDebounce, use-color-scheme, …
    utils/                    # Validadores, mapApiFieldErrors
    constants/

  __tests__/                  # Tests Jest
```

Alias TypeScript (ver `tsconfig.json`):

- `@/core/*`, `@/data/*`, `@/presentation/*`, `@/shared/*`
- `@/*` → raíz del repo

## Pantallas y rutas

La barra superior global **BANCO** (`AppBrandNavbar`) se define en `app/_layout.tsx` y envuelve todo el `Stack`. El grupo `product` añade cabecera nativa (sin título en formularios según configuración actual).

| Ruta (Expo Router) | Archivo de ruta | Pantalla / componente | Función |
|--------------------|-----------------|-------------------------|---------|
| `/` | `app/index.tsx` | `ProductListScreen` | Catálogo: búsqueda, listado, botón agregar |
| `/product/[id]` | `app/product/[id].tsx` | `ProductDetailScreen` | Ficha del producto, editar, eliminar (modal) |
| `/product/new` | `app/product/new.tsx` | `ProductFormScreen` (modo create) | Alta de producto |
| `/product/edit/[id]` | `app/product/edit/[id].tsx` | `ProductFormScreen` (modo edit) | Edición |

Navegación tipada desde código: `hrefProductDetail`, `hrefProductNew`, `hrefProductEdit` en `src/presentation/navigation/types.ts`.

### Componentes destacados por pantalla

- **Listado:** `SearchBar`, `ProductItem`, `useProductListViewModel`
- **Detalle:** `DetailField`, `ProductLogoDisplay`, `DeleteConfirmModal`, `useProductDetailViewModel`
- **Formulario:** campos validados con `src/shared/utils/validators.ts`, `useProductFormViewModel`

## Arquitectura de datos

- Los casos de uso viven en `src/core/usecases/` y se cablean en `src/presentation/di/productsComposition.ts`.
- El repositorio concreto usa `ApiClient` y `ProductRemoteDataSource` para hablar con la API REST configurada en `EXPO_PUBLIC_API_BASE`.

## Recursos

- [Documentación Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
