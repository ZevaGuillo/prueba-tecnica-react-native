import type { FinancialProduct } from '@/core/entities/FinancialProduct';
import { hrefProductDetail, hrefProductNew } from '@/presentation/navigation/types';
import { ProductItem } from '@/presentation/screens/ProductList/components/ProductItem';
import { SearchBar } from '@/presentation/screens/ProductList/components/SearchBar';
import { useProductListViewModel } from '@/presentation/screens/ProductList/useProductListViewModel';
import { colors, radii, spacing, typography } from '@/shared/theme';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type EmptyProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  allCount: number;
  query: string;
  onRetry: () => void;
};

function ListEmptyState({
  isLoading,
  isError,
  errorMessage,
  allCount,
  query,
  onRetry,
}: EmptyProps) {
  if (isLoading) {
    return (
      <View
        style={styles.centerBlock}
        accessibilityRole="progressbar"
        accessibilityLabel="Cargando productos del catálogo"
        accessibilityLiveRegion="polite">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.hint}>Cargando catálogo…</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.centerBlock} accessibilityRole="alert">
        <Text style={styles.errorTitle}>No se pudo cargar el catálogo</Text>
        {errorMessage ? <Text style={styles.errorBody}>{errorMessage}</Text> : null}
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Reintentar cargar el catálogo"
          accessibilityHint="Vuelve a solicitar los productos al servidor">
          <Text style={styles.retryLabel}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }
  if (allCount === 0) {
    return (
      <View style={styles.centerBlock}>
        <Text
          style={styles.emptyTitle}
          accessibilityRole="header"
          accessibilityLabel="Catálogo vacío">
          No hay productos
        </Text>
        <Text style={styles.emptyBody}>Aún no hay productos en el catálogo.</Text>
      </View>
    );
  }
  return (
    <View style={styles.centerBlock}>
      <Text style={styles.emptyTitle} accessibilityRole="header">
        Sin resultados
      </Text>
      <Text style={styles.emptyBody} accessibilityLiveRegion="polite">
        Ningún producto coincide con «{query.trim()}».
      </Text>
    </View>
  );
}

export function ProductListScreen() {
  const vm = useProductListViewModel();
  const { load } = vm;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

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
        isLoading={vm.isLoading}
        isError={vm.isError}
        errorMessage={vm.errorMessage}
        allCount={vm.allProducts.length}
        query={vm.query}
        onRetry={vm.load}
      />
    ),
    [
      vm.allProducts.length,
      vm.errorMessage,
      vm.isError,
      vm.isLoading,
      vm.load,
      vm.query,
    ],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.body}>
        <View style={styles.header}>
          <SearchBar value={vm.query} onChangeText={vm.setQuery} />
          <Text
            style={styles.counter}
            accessibilityRole="text"
            accessibilityLabel={`${vm.visibleCount} productos mostrados`}
            accessibilityLiveRegion="polite">
            {vm.visibleCount} {vm.visibleCount === 1 ? 'producto' : 'productos'}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          data={vm.isReady ? vm.filteredProducts : []}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  list: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  addBtn: {
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnPressed: {
    backgroundColor: colors.primaryPressed,
  },
  addBtnLabel: {
    color: colors.textPrimary,
    ...typography.subtitle,
    fontSize: 16,
  },
  counter: {
    ...typography.caption,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
  },
  listContent: {
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    borderRadius: radii.sm,
    overflow: 'hidden',
    flexGrow: 1,
  },
  centerBlock: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  errorTitle: {
    color: colors.danger,
    ...typography.subtitle,
    textAlign: 'center',
  },
  errorBody: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.textPrimary,
    ...typography.subtitle,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  retryBtnPressed: {
    backgroundColor: colors.primaryPressed,
  },
  retryLabel: {
    color: colors.background,
    ...typography.subtitle,
  },
});
