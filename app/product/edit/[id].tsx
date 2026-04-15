import { ProductFormScreen } from '@/presentation/screens/ProductForm/ProductFormScreen';
import { useLocalSearchParams } from 'expo-router';

export default function ProductEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  return <ProductFormScreen mode="edit" productId={productId} />;
}
