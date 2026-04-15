import { useDeleteProductMutation } from '@/presentation/hooks/products/useProductMutations';
import { useProductQuery } from '@/presentation/hooks/products/useProductQuery';
import { DeleteConfirmModal } from '@/presentation/screens/ProductDetail/components/DeleteConfirmModal';
import { DetailErrorState } from '@/presentation/screens/ProductDetail/components/DetailErrorState';
import { DetailInvalidIdState } from '@/presentation/screens/ProductDetail/components/DetailInvalidIdState';
import { DetailLoadingState } from '@/presentation/screens/ProductDetail/components/DetailLoadingState';
import { DetailNotFoundState } from '@/presentation/screens/ProductDetail/components/DetailNotFoundState';
import { ProductDetailContent } from '@/presentation/screens/ProductDetail/components/ProductDetailContent';
import { productDetailScreenStyles as styles } from '@/presentation/screens/ProductDetail/style/ProductDetailScreen.styles';
import { getUserFacingErrorMessage } from '@/shared/utils/userFacingMessage';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ProductDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const router = useRouter();
  const productQuery = useProductQuery(id);
  const { refetch } = productQuery;
  const deleteMutation = useDeleteProductMutation();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const openDeleteModal = useCallback(() => {
    deleteMutation.reset();
    setDeleteModalVisible(true);
  }, [deleteMutation]);

  const closeDeleteModal = useCallback(() => {
    if (deleteMutation.isPending) return;
    deleteMutation.reset();
    setDeleteModalVisible(false);
  }, [deleteMutation]);

  const confirmDelete = useCallback(async (): Promise<boolean> => {
    const pid = id?.trim();
    if (!pid) {
      return false;
    }
    try {
      await deleteMutation.mutateAsync(pid);
      setDeleteModalVisible(false);
      return true;
    } catch {
      return false;
    }
  }, [deleteMutation, id]);

  const rawId = id?.trim() ?? '';

  if (!rawId) {
    return <DetailInvalidIdState />;
  }

  if (productQuery.isLoading) {
    return <DetailLoadingState />;
  }

  if (productQuery.isError) {
    const msg =
      getUserFacingErrorMessage(productQuery.error) || 'No se pudo cargar el producto.';
    return (
      <DetailErrorState
        message={msg}
        onRetry={() => void refetch()}
        onBack={() => router.back()}
      />
    );
  }

  if (productQuery.isSuccess && productQuery.data === null) {
    return <DetailNotFoundState onBack={() => router.back()} />;
  }

  const p = productQuery.data;
  if (!p) {
    return null;
  }

  const onConfirmDelete = async () => {
    const ok = await confirmDelete();
    if (ok) router.back();
  };

  const deleteErr = deleteMutation.isError
    ? getUserFacingErrorMessage(deleteMutation.error) || 'No se pudo eliminar el producto.'
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <DeleteConfirmModal
        visible={deleteModalVisible}
        productName={p.name}
        productId={p.id}
        onCancel={closeDeleteModal}
        onConfirm={onConfirmDelete}
        submitting={deleteMutation.isPending}
        errorMessage={deleteErr}
      />
      <ProductDetailContent product={p} onOpenDelete={openDeleteModal} />
    </SafeAreaView>
  );
}
