import { colors, radii, spacing, typography } from '@/shared/theme';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type ListEmptyStateProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  allCount: number;
  query: string;
  onRetry: () => void;
};

export function ListEmptyState({
  isLoading,
  isError,
  errorMessage,
  allCount,
  query,
  onRetry,
}: ListEmptyStateProps) {
  if (isLoading) {
    return (
      <View
        style={styles.centerBlock}
        accessibilityRole="progressbar"
        accessibilityLabel="Cargando productos del catálogo"
        accessibilityLiveRegion="polite">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.hint}>Cargando catálogo…</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.centerBlock} accessibilityRole="alert">
        <Text style={styles.errorTitle}>No se pudo cargar el catálogo</Text>
        {errorMessage ? <Text style={styles.errorBody}>{errorMessage}</Text> : null}
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Reintentar cargar el catálogo"
          accessibilityHint="Vuelve a solicitar los productos al servidor">
          <Text style={styles.retryLabel}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }
  if (allCount === 0) {
    return (
      <View style={styles.centerBlock}>
        <Text
          style={styles.emptyTitle}
          accessibilityRole="header"
          accessibilityLabel="Catálogo vacío">
          No hay productos
        </Text>
        <Text style={styles.emptyBody}>Aún no hay productos en el catálogo.</Text>
      </View>
    );
  }
  return (
    <View style={styles.centerBlock}>
      <Text style={styles.emptyTitle} accessibilityRole="header">
        Sin resultados
      </Text>
      <Text style={styles.emptyBody} accessibilityLiveRegion="polite">
        Ningún producto coincide con «{query.trim()}».
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerBlock: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  errorTitle: {
    color: colors.danger,
    ...typography.subtitle,
    textAlign: 'center',
  },
  errorBody: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.textPrimary,
    ...typography.subtitle,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  retryBtnPressed: {
    backgroundColor: colors.primaryPressed,
  },
  retryLabel: {
    color: colors.background,
    ...typography.subtitle,
  },
});
