import { productDetailScreenStyles as styles } from '@/presentation/screens/ProductDetail/style/ProductDetailScreen.styles';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function DetailInvalidIdState() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.centered} accessibilityRole="alert">
        <Text style={styles.title}>Identificador de producto no válido.</Text>
      </View>
    </SafeAreaView>
  );
}
