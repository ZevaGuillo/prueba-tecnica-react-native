import { useProductFormViewModel } from '@/presentation/screens/ProductForm/useProductFormViewModel';
import * as Theme from '@/shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type ProductFormScreenProps = {
  mode: 'create' | 'edit';
  /** Obligatorio si `mode === 'edit'` (param de ruta). */
  productId?: string;
};

function FieldLabel({ children }: { children: string }) {
  return (
    <Text style={styles.label} accessibilityRole="text">
      {children}
    </Text>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text style={styles.errorText} accessibilityRole="alert">
      {message}
    </Text>
  );
}

export function ProductFormScreen({ mode, productId }: ProductFormScreenProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const vm = useProductFormViewModel(mode, productId);

  useLayoutEffect(() => {
    navigation.setOptions({ headerBackVisible: false });
  }, [navigation]);

  const onSubmit = async () => {
    const ok = await vm.submit();
    if (ok) {
      router.back();
    }
  };

  if (mode === 'edit' && vm.editLoadStatus === 'loading') {
    return (
      <View style={styles.centered} accessibilityLabel="Cargando datos del producto">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.muted}>Cargando…</Text>
      </View>
    );
  }

  if (mode === 'edit' && vm.editLoadStatus === 'notFound') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered} accessibilityRole="alert">
          <Text style={styles.title}>Producto no encontrado</Text>
          <Text style={styles.muted}>
            No se pudo cargar el producto para editar. Puede que haya sido eliminado o el enlace sea
            incorrecto.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver">
            <Text style={styles.secondaryLabel}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === 'edit' && vm.editLoadStatus === 'error') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
        <View style={styles.centered} accessibilityRole="alert">
          <Text style={styles.errorTitle}>No se pudo cargar el producto</Text>
          {vm.editLoadError ? <Text style={styles.muted}>{vm.editLoadError}</Text> : null}
          <Pressable
            onPress={vm.reloadEdit}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Reintentar">
            <Text style={styles.primaryLabel}>Reintentar</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver">
            <Text style={styles.secondaryLabel}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const formA11y =
    mode === 'create' ? 'Formulario de alta de producto' : 'Formulario de edición de producto';

  const err = vm.fieldErrors;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
          accessibilityLabel={formA11y}>
          {vm.generalError ? (
            <Text style={styles.bannerError} accessibilityRole="alert">
              {vm.generalError}
            </Text>
          ) : null}
          <Text style={styles.formTitle}>
            {mode === 'create' ? 'Formulario de Registro' : 'Editar Producto'}
          </Text>

          <FieldLabel>ID</FieldLabel>
          <TextInput
            value={vm.fields.id}
            onChangeText={(t) => vm.setField('id', t)}
            placeholderTextColor={Theme.colors.textMuted}
            style={[styles.input, !vm.idEditable && styles.inputDisabled, err.id && styles.inputError]}
            editable={vm.idEditable}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="ID del producto"
            accessibilityHint={vm.idEditable ? undefined : 'No se puede modificar en edición'}
          />
          {vm.idEditable && vm.idCheckPending ? (
            <Text style={styles.hint}>Comprobando ID…</Text>
          ) : null}
          <ErrorText message={vm.fieldErrors.id} />

          <FieldLabel>Nombre</FieldLabel>
          <TextInput
            value={vm.fields.name}
            onChangeText={(t) => vm.setField('name', t)}
            placeholderTextColor={Theme.colors.textMuted}
            style={[styles.input, err.name && styles.inputError]}
            accessibilityLabel="Nombre del producto"
          />
          <ErrorText message={vm.fieldErrors.name} />

          <FieldLabel>Descripción</FieldLabel>
          <TextInput
            value={vm.fields.description}
            onChangeText={(t) => vm.setField('description', t)}
            placeholderTextColor={Theme.colors.textMuted}
            style={[styles.input, styles.inputMultiline, err.description && styles.inputError]}
            multiline
            accessibilityLabel="Descripción del producto"
          />
          <ErrorText message={vm.fieldErrors.description} />

          <FieldLabel>Logo (URL o archivo)</FieldLabel>
          <TextInput
            value={vm.fields.logo}
            onChangeText={(t) => vm.setField('logo', t)}
            placeholderTextColor={Theme.colors.textMuted}
            style={[styles.input, err.logo && styles.inputError]}
            autoCapitalize="none"
            accessibilityLabel="Logo del producto"
          />
          <ErrorText message={vm.fieldErrors.logo} />

          <FieldLabel>Fecha de liberación</FieldLabel>
          <View style={[styles.dateFieldShell, err.date_release && styles.fieldShellError]}>
            <TextInput
              value={vm.fields.date_release}
              onChangeText={(t) => vm.setField('date_release', t)}
              placeholder={Platform.OS === 'web' ? undefined : 'AAAA-MM-DD'}
              placeholderTextColor={Theme.colors.textMuted}
              style={styles.dateFieldInput}
              accessibilityLabel="Fecha de liberación"
              {...(Platform.OS === 'web'
                ? ({ type: 'date' } as object)
                : {})}
            />
            <Ionicons
              name="calendar-outline"
              size={22}
              color={err.date_release ? Theme.colors.danger : Theme.colors.textMuted}
              style={styles.dateFieldIcon}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
          <ErrorText message={vm.fieldErrors.date_release} />

          <FieldLabel>Fecha de revisión (calculada)</FieldLabel>
          <View
            style={[
              styles.dateFieldShell,
              styles.dateFieldShellReadonly,
              err.date_revision && styles.fieldShellError,
            ]}
            accessibilityLabel="Fecha de revisión calculada automáticamente"
            accessibilityRole="text">
            <Text style={styles.dateFieldReadonlyText} numberOfLines={1}>
              {vm.dateRevisionComputed || '—'}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={22}
              color={err.date_revision ? Theme.colors.danger : Theme.colors.textMuted}
              style={styles.dateFieldIcon}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
          <ErrorText message={vm.fieldErrors.date_revision} />

          <View style={styles.actions}>
            <Pressable
              onPress={onSubmit}
              disabled={vm.submitting}
              style={({ pressed }) => [
                styles.primaryBtn,
                (pressed || vm.submitting) && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={mode === 'create' ? 'Guardar producto' : 'Guardar cambios'}>
              {vm.submitting ? (
                <ActivityIndicator color={Theme.colors.textPrimary} />
              ) : (
                <Text style={styles.primaryLabel}>{mode === 'create' ? 'Guardar' : 'Guardar cambios'}</Text>
              )}
            </Pressable>
            <Pressable
              onPress={vm.reset}
              disabled={vm.submitting}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
              accessibilityRole="button"
              accessibilityLabel="Reiniciar formulario">
              <Text style={styles.secondaryLabel}>Reiniciar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  formTitle: {
    ...Theme.typography.title,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  title: {
    color: Theme.colors.textPrimary,
    ...Theme.typography.subtitle,
    textAlign: 'center',
  },
  errorTitle: {
    color: Theme.colors.danger,
    ...Theme.typography.subtitle,
    textAlign: 'center',
  },
  muted: {
    color: Theme.colors.textSecondary,
    ...Theme.typography.body,
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
    gap: Theme.spacing.xs,
  },
  bannerError: {
    ...Theme.typography.caption,
    color: Theme.colors.danger,
    backgroundColor: Theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Theme.colors.danger,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radii.sm,
    marginBottom: Theme.spacing.sm,
  },
  label: {
    ...Theme.typography.label,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radii.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.surfaceElevated,
    minHeight: 44,
    fontFamily: Theme.typography.fontFamily,
    ...Theme.typography.body,
  },
  inputError: {
    borderColor: Theme.colors.danger,
  },
  inputDisabled: {
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.textSecondary,
    opacity: 0.95,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateFieldShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radii.sm,
    backgroundColor: Theme.colors.surfaceElevated,
    minHeight: 44,
    paddingRight: Theme.spacing.xs,
  },
  dateFieldShellReadonly: {
    backgroundColor: Theme.colors.surface,
  },
  fieldShellError: {
    borderColor: Theme.colors.danger,
  },
  dateFieldInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
    ...Theme.typography.body,
  },
  dateFieldReadonlyText: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    color: Theme.colors.textPrimary,
    fontFamily: Theme.typography.fontFamily,
    ...Theme.typography.body,
  },
  dateFieldIcon: {
    flexShrink: 0,
  },
  hint: {
    ...Theme.typography.caption,
    color: Theme.colors.textMuted,
  },
  errorText: {
    ...Theme.typography.caption,
    color: Theme.colors.danger,
    marginBottom: Theme.spacing.xs,
  },
  actions: {
    marginTop: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radii.sm,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radii.sm,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  btnPressed: {
    opacity: 0.88,
  },
  primaryLabel: {
    color: Theme.colors.textPrimary,
    ...Theme.typography.subtitle,
  },
  secondaryLabel: {
    color: Theme.colors.textSecondary,
    ...Theme.typography.subtitle,
  },
});
