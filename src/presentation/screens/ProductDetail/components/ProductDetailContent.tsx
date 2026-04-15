import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { hrefProductEdit } from '@/presentation/navigation/types';
import { DetailField } from '@/presentation/screens/ProductDetail/components/DetailField';
import { productDetailScreenStyles as styles } from '@/presentation/screens/ProductDetail/style/ProductDetailScreen.styles';
import { formatEsDate } from '@/presentation/screens/ProductDetail/utils/formatEsDate';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ProductLogoDisplay } from './ProductLogoDisplay';

type Props = {
  product: FinancialProduct;
  onOpenDelete: () => void;
};

export function ProductDetailContent({ product, onOpenDelete }: Props) {
  const router = useRouter();
  const p = product;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Detalle del producto">
      <View accessibilityRole="text" accessibilityLabel={`ID: ${p.id}`}>
        <Text style={styles.idLabel}>ID: {p.id}</Text>
        <Text style={styles.idsub}>Información extra</Text>
      </View>
      <DetailField label="Nombre" value={p.name} />
      <DetailField label="Descripción" value={p.description} />
      <DetailField label="Logo (referencia)" value={''} />
      <ProductLogoDisplay logo={p.logo} productName={p.name} />

      <DetailField label="Fecha de liberación" value={formatEsDate(p.date_release)} />
      <DetailField label="Fecha de revisión" value={formatEsDate(p.date_revision)} />

      <View style={styles.actions} accessibilityRole="toolbar">
        <Pressable
          onPress={() => router.push(hrefProductEdit(p.id))}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Editar producto">
          <Text style={styles.primaryLabel}>Editar</Text>
        </Pressable>
        <Pressable
          onPress={onOpenDelete}
          style={({ pressed }) => [styles.dangerBtn, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Eliminar producto">
          <Text style={styles.dangerLabel}>Eliminar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
