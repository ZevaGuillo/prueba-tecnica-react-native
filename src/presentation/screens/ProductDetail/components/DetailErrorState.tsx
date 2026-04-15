import { productDetailScreenStyles as styles } from '@/presentation/screens/ProductDetail/style/ProductDetailScreen.styles';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  message: string;
  onRetry: () => void;
  onBack: () => void;
};

export function DetailErrorState({ message, onRetry, onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.centered} accessibilityRole="alert">
        <Text style={styles.errorTitle}>No se pudo cargar el producto</Text>
        <Text style={styles.muted}>{message}</Text>
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Reintentar cargar el producto">
          <Text style={styles.primaryLabel}>Reintentar</Text>
        </Pressable>
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
