import { Platform } from 'react-native';

/** Tema claro tipo banking (basado en las pantallas proporcionadas) */
export const colors = {
  // Base
  background: '#F5F6F8',          // gris muy claro (pantalla)
  surface: '#FFFFFF',             // cards / formularios
  surfaceElevated: '#FFFFFF',

  // Bordes
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',

  // Texto
  textPrimary: '#111827',         // negro suave
  textSecondary: '#374151',       // gris oscuro
  textMuted: '#6B7280',           // gris medio

  // Marca / acciones
  primary: '#FACC15',             // amarillo (botón enviar)
  primaryPressed: '#EAB308',

  // Estados
  danger: '#EF4444',              // errores (inputs)
  success: '#22C55E',

  // Botones secundarios
  neutral: '#E5E7EB',             // botón gris (reiniciar)
  neutralText: '#374151',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',

} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  fontFamily,

  // Header (BANCO)
  header: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },

  // Títulos principales
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
  },

  // Subtítulos / labels importantes
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },

  // Texto normal
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
  },

  // Labels de formulario
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#374151',
  },

  // Texto de error
  error: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: '#EF4444',
  },

  // Texto auxiliar
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: '#6B7280',
  },
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

/** Tokens específicos para inputs y formularios */
export const components = {
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,

    backgroundColor: '#FFFFFF',

    borderColor: '#E5E7EB',
    borderColorFocus: '#9CA3AF',
    borderColorError: '#EF4444',

    textColor: '#111827',
    placeholderColor: '#9CA3AF',
  },

  button: {
    height: 48,
    borderRadius: 8,

    primary: {
      background: '#FACC15',
      text: '#111827',
    },

    secondary: {
      background: '#E5E7EB',
      text: '#374151',
    },

    danger: {
      background: '#EF4444',
      text: '#FFFFFF',
    },
  },

  card: {
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderColor: '#E5E7EB',
  },
} as const;