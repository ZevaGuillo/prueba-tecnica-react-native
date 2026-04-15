import { productFormScreenStyles as styles } from '@/presentation/screens/ProductForm/style/ProductFormScreen.styles';
import * as Theme from '@/shared/theme';
import { ActivityIndicator, Text, View } from 'react-native';

export function ProductFormEditLoading() {
  return (
    <View style={styles.centered} accessibilityLabel="Cargando datos del producto">
      <ActivityIndicator size="large" color={Theme.colors.primary} />
      <Text style={styles.muted}>Cargando…</Text>
    </View>
  );
}
