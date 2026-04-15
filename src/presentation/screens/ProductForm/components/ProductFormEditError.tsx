import { productFormScreenStyles as styles } from '@/presentation/screens/ProductForm/style/ProductFormScreen.styles';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  message: string | null;
  onRetry: () => void;
  onBack: () => void;
};

export function ProductFormEditError({ message, onRetry, onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.centered} accessibilityRole="alert">
        <Text style={styles.errorTitle}>No se pudo cargar el producto</Text>
        {message ? <Text style={styles.muted}>{message}</Text> : null}
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Reintentar">
          <Text style={styles.primaryLabel}>Reintentar</Text>
        </Pressable>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Volver">
          <Text style={styles.secondaryLabel}>Volver</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
