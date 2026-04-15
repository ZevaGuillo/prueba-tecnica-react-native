import { ProductFormBody } from '@/presentation/screens/ProductForm/components/ProductFormBody';
import { ProductFormEditError } from '@/presentation/screens/ProductForm/components/ProductFormEditError';
import { ProductFormEditLoading } from '@/presentation/screens/ProductForm/components/ProductFormEditLoading';
import { ProductFormEditNotFound } from '@/presentation/screens/ProductForm/components/ProductFormEditNotFound';
import { useProductFormScreen } from '@/presentation/screens/ProductForm/hooks/useProductFormScreen';
import { createProductFormPaperTheme } from '@/presentation/screens/ProductForm/style/productFormPaperTheme';
import { productFormScreenStyles as styles } from '@/presentation/screens/ProductForm/style/ProductFormScreen.styles';
import { isoDateStringToLocalDate, startOfTodayLocal } from '@/presentation/screens/ProductForm/utils/dateIsoUtils';
import { useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import { es, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

registerTranslation('es', es);

export type ProductFormScreenProps = {
  mode: 'create' | 'edit';
  /** Obligatorio si `mode === 'edit'` (param de ruta). */
  productId?: string;
};

export function ProductFormScreen({ mode, productId }: ProductFormScreenProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const vm = useProductFormScreen(mode, productId);

  const paperTheme = useMemo(() => createProductFormPaperTheme(), []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerBackVisible: false });
  }, [navigation]);

  const releaseDateValue = useMemo(
    () => isoDateStringToLocalDate(vm.fields.date_release) ?? startOfTodayLocal(),
    [vm.fields.date_release],
  );

  const onSubmit = async () => {
    const ok = await vm.submit();
    if (ok) {
      router.back();
    }
  };

  if (mode === 'edit' && vm.editLoadStatus === 'loading') {
    return <ProductFormEditLoading />;
  }

  if (mode === 'edit' && vm.editLoadStatus === 'notFound') {
    return <ProductFormEditNotFound onBack={() => router.back()} />;
  }

  if (mode === 'edit' && vm.editLoadStatus === 'error') {
    return (
      <ProductFormEditError
        message={vm.editLoadError}
        onRetry={vm.reloadEdit}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <PaperProvider theme={paperTheme}>
        <ProductFormBody
          mode={mode}
          vm={vm}
          releaseDateValue={releaseDateValue}
          onSubmit={onSubmit}
        />
      </PaperProvider>
    </SafeAreaView>
  );
}
