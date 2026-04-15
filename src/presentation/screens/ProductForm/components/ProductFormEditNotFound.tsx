import { productFormScreenStyles as styles } from '@/presentation/screens/ProductForm/style/ProductFormScreen.styles';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = { onBack: () => void };

export function ProductFormEditNotFound({ onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.centered} accessibilityRole="alert">
        <Text style={styles.title}>Producto no encontrado</Text>
        <Text style={styles.muted}>
          No se pudo cargar el producto para editar. Puede que haya sido eliminado o el enlace sea
          incorrecto.
        </Text>
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
