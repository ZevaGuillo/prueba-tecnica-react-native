import { productDetailScreenStyles as styles } from '@/presentation/screens/ProductDetail/style/ProductDetailScreen.styles';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onBack: () => void;
};

export function DetailNotFoundState({ onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.centered} accessibilityRole="alert">
        <Text style={styles.title}>Producto no encontrado</Text>
        <Text style={styles.muted}>No hay un producto con ese identificador.</Text>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Volver al catálogo">
          <Text style={styles.secondaryLabel}>Volver</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
