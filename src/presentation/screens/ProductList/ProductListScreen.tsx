import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { useProductsQuery } from '@/presentation/hooks/products/useProductsQuery';
import { hrefProductDetail, hrefProductNew } from '@/presentation/navigation/types';
import { ListEmptyState } from '@/presentation/screens/ProductList/components/ListEmptyState';
import { ProductItem } from '@/presentation/screens/ProductList/components/ProductItem';
import { SearchBar } from '@/presentation/screens/ProductList/components/SearchBar';
import { productListScreenStyles as styles } from '@/presentation/screens/ProductList/style/ProductListScreen.styles';
import { spacing } from '@/shared/theme';
import { getUserFacingErrorMessage } from '@/shared/utils/userFacingMessage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export function ProductListScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const productsQuery = useProductsQuery();
  const { refetch } = productsQuery;

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const errorMessage = productsQuery.isError
    ? getUserFacingErrorMessage(productsQuery.error) || 'No se pudo cargar el catálogo.'
    : null;

  const filteredProducts = useMemo(() => {
    const all = productsQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (p) => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
    );
  }, [productsQuery.data, query]);

  const isLoading = productsQuery.isLoading;
  const isError = productsQuery.isError;
  const isReady = productsQuery.isSuccess;

  const renderItem: ListRenderItem<FinancialProduct> = useCallback(
    ({ item }) => (
      <ProductItem
        product={item}
        onPress={() => router.push(hrefProductDetail(item.id))}
      />
    ),
    [router],
  );

  const keyExtractor = useCallback((item: FinancialProduct) => item.id, []);

  const listEmpty = useCallback(
    () => (
      <ListEmptyState
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        allCount={productsQuery.data?.length ?? 0}
        query={query}
        onRetry={() => void refetch()}
      />
    ),
    [productsQuery.data?.length, errorMessage, isError, isLoading, query, refetch],
  );

  const visibleCount = filteredProducts.length;

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.body}>
        <View style={styles.header}>
          <SearchBar value={query} onChangeText={setQuery} />
          <Text
            style={styles.counter}
            accessibilityRole="text"
            accessibilityLabel={`${visibleCount} productos mostrados`}
            accessibilityLiveRegion="polite">
            {visibleCount} {visibleCount === 1 ? 'producto' : 'productos'}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          data={isReady ? filteredProducts : []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          accessibilityLabel="Lista de productos del catálogo"
        />
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}>
        <Pressable
          onPress={() => router.push(hrefProductNew())}
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Agregar producto nuevo"
          accessibilityHint="Abre el formulario para dar de alta un producto">
          <Text style={styles.addBtnLabel}>Agregar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
