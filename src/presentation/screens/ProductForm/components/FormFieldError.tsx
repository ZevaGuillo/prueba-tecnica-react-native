import { productFormScreenStyles as styles } from '@/presentation/screens/ProductForm/style/ProductFormScreen.styles';
import { Text } from 'react-native';

type Props = { message?: string };

export function FormFieldError({ message }: Props) {
  if (!message) return null;
  return (
    <Text style={styles.errorText} accessibilityRole="alert">
      {message}
    </Text>
  );
}
