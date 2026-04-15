import * as Theme from '@/shared/theme';
import { MD3LightTheme } from 'react-native-paper';

export function createProductFormPaperTheme() {
  return {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: Theme.colors.primary,
      onSurface: Theme.colors.textPrimary,
      onSurfaceVariant: Theme.colors.textSecondary,
      error: Theme.colors.danger,
      surface: Theme.colors.surfaceElevated,
      outline: Theme.colors.border,
    },
  };
}
