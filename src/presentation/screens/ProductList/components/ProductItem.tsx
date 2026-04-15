import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { colors, spacing, typography } from '@/shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  product: FinancialProduct;
  onPress: () => void;
};

export function ProductItem({ product, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalle de ${product.name}, identificador ${product.id}`}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.id} numberOfLines={1}>
            ID: {product.id}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={22}
          color={colors.textMuted}
          style={styles.chevron}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  cardPressed: {
    opacity: 0.92,
    backgroundColor: colors.surfaceElevated,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  chevron: {
    flexShrink: 0,
  },
  id: {
    ...typography.caption,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    ...typography.subtitle,
  },
});
