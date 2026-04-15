import type { Href } from 'expo-router';

/**
 * Rutas de la feature de productos (Expo Router).
 * Las rutas físicas viven en `app/`; aquí solo tipamos helpers para navegación tipada.
 */
export function hrefProductDetail(id: string): Href {
  return `/product/${encodeURIComponent(id)}` as Href;
}

export function hrefProductNew(): Href {
  return '/product/new' as Href;
}

export function hrefProductEdit(id: string): Href {
  return `/product/edit/${encodeURIComponent(id)}` as Href;
}
