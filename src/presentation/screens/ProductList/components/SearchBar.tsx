import { colors, radii, spacing, typography } from '@/shared/theme';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  testID?: string;
};

export function SearchBar({ value, onChangeText, testID }: Props) {
  return (
    <View
      style={styles.wrap}
      accessibilityRole="search"
      accessibilityLabel="Buscar en el catálogo"
      accessibilityHint="Escribe para filtrar por nombre o identificador del producto">
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel="Campo de búsqueda del catálogo"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
  },
  input: {
    minHeight: 44,
    paddingVertical: spacing.xs,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    ...typography.body,
  },
});
