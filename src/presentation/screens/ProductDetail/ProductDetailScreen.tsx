import { hrefProductEdit } from '@/presentation/navigation/types';
import { DeleteConfirmModal } from '@/presentation/screens/ProductDetail/components/DeleteConfirmModal';
import { DetailField } from '@/presentation/screens/ProductDetail/components/DetailField';
import { useProductDetailViewModel } from '@/presentation/screens/ProductDetail/useProductDetailViewModel';
import { colors, radii, spacing, typography } from '@/shared/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductLogoDisplay } from './components/ProductLogoDisplay';

function formatEsDate(iso: string): string {
  const part = iso.slice(0, 10);
  const [y, m, d] = part.split('-').map((x) => Number(x));
  if (!y || !m || !d) return iso;
  try {
    return new Intl.DateTimeFormat('es', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(y, m - 1, d));
  } catch {
    return part;
  }
}

export function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const vm = useProductDetailViewModel(id);

  if (vm.isLoading) {
    return (
      <View style={styles.centered} accessibilityLabel="Cargando detalle del producto">
        <ActivityIndicator size="large" color={colors.border} />
        <Text style={styles.muted}>Cargando…</Text>
      </View>
    );
  }

  if (vm.isNotFound) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered} accessibilityRole="alert">
          <Text style={styles.title}>Producto no encontrado</Text>
          <Text style={styles.muted}>No hay un producto con ese identificador.</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver al catálogo">
            <Text style={styles.secondaryLabel}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (vm.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered} accessibilityRole="alert">
          <Text style={styles.errorTitle}>No se pudo cargar el producto</Text>
          {vm.errorMessage ? <Text style={styles.muted}>{vm.errorMessage}</Text> : null}
          <Pressable
            onPress={vm.refresh}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Reintentar cargar el producto">
            <Text style={styles.primaryLabel}>Reintentar</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver al catálogo">
            <Text style={styles.secondaryLabel}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!vm.product) {
    return null;
  }

  const p = vm.product;

  const onEdit = () => {
    router.push(hrefProductEdit(p.id));
  };

  const onConfirmDelete = async () => {
    const ok = await vm.confirmDelete();
    if (ok) router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <DeleteConfirmModal
        visible={vm.deleteModalVisible}
        productName={p.name}
        productId={p.id}
        onCancel={vm.closeDeleteModal}
        onConfirm={onConfirmDelete}
        submitting={vm.deleteSubmitting}
        errorMessage={vm.deleteError}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel="Detalle del producto">
        <View
          accessibilityRole="text"
          accessibilityLabel={`ID: ${p.id}`}>
          <Text style={styles.idLabel}>ID: {p.id}</Text>
          <Text style={styles.idsub}>Información extra</Text>
        </View>
        <DetailField label="Nombre" value={p.name} />
        <DetailField label="Descripción" value={p.description} />
        <DetailField label="Logo (referencia)" value={""} />
        <ProductLogoDisplay logo={p.logo} productName={p.name} />

        <DetailField label="Fecha de liberación" value={formatEsDate(p.date_release)} />
        <DetailField label="Fecha de revisión" value={formatEsDate(p.date_revision)} />

        <View style={styles.actions} accessibilityRole="toolbar">
          <Pressable
            onPress={onEdit}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Editar producto">
            <Text style={styles.primaryLabel}>Editar</Text>
          </Pressable>
          <Pressable
            onPress={vm.openDeleteModal}
            style={({ pressed }) => [styles.dangerBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Eliminar producto">
            <Text style={styles.dangerLabel}>Eliminar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  idLabel: {
    ...typography.title,
    color: colors.textPrimary,
  },
  idsub: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.textPrimary,
    ...typography.subtitle,
    textAlign: 'center',
  },
  errorTitle: {
    color: colors.danger,
    ...typography.subtitle,
    textAlign: 'center',
  },
  muted: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.85,
  },
  primaryLabel: {
    color: colors.textSecondary,
    ...typography.subtitle,
  },
  secondaryLabel: {
    color: colors.surface,
    ...typography.subtitle,
  },
  dangerLabel: {
    color: colors.surface,
    ...typography.subtitle,
  },
});
