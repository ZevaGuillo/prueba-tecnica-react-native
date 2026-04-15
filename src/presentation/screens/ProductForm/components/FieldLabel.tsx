import { productFormScreenStyles as styles } from '@/presentation/screens/ProductForm/style/ProductFormScreen.styles';
import { Text } from 'react-native';

type Props = { children: string };

export function FieldLabel({ children }: Props) {
  return (
    <Text style={styles.label} accessibilityRole="text">
      {children}
    </Text>
  );
}
