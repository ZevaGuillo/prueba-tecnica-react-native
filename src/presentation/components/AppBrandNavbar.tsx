import { colors, spacing, typography } from '@/shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Barra de marca global (navbar superior) visible en todas las pantallas.
 */
export function AppBrandNavbar() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View
        style={styles.brandRow}
        accessibilityRole="header"
        accessibilityLabel="Banco, marca">
        <Ionicons
          name="card-outline"
          size={20}
          color={colors.textSecondary}
          accessibilityElementsHidden
        />
        <Text style={styles.brand}>BANCO</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  brand: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    ...typography.title,
    letterSpacing: 2,
  },
});
