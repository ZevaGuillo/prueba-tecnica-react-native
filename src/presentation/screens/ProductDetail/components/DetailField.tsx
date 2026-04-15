import { colors, spacing, typography } from '@/shared/theme';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  /** Para lectores de pantalla (evita leer label y valor por separado sin contexto). */
  accessibilityHint?: string;
};

export function DetailField({ label, value, accessibilityHint }: Props) {
  return (
    <View
      style={styles.row}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
      accessibilityHint={accessibilityHint}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xxs,
  },
  label: {
    ...typography.caption,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    ...typography.body,
  },
});
