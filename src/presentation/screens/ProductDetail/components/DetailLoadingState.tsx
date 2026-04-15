import { productDetailScreenStyles as styles } from '@/presentation/screens/ProductDetail/style/ProductDetailScreen.styles';
import { colors } from '@/shared/theme';
import { ActivityIndicator, Text, View } from 'react-native';

export function DetailLoadingState() {
  return (
    <View style={styles.centered} accessibilityLabel="Cargando detalle del producto">
      <ActivityIndicator size="large" color={colors.border} />
      <Text style={styles.muted}>Cargando…</Text>
    </View>
  );
}
