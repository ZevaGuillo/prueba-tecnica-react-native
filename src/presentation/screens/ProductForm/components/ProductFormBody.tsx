import { FieldLabel } from '@/presentation/screens/ProductForm/components/FieldLabel';
import { FormFieldError } from '@/presentation/screens/ProductForm/components/FormFieldError';
import { useProductFormScreen } from '@/presentation/screens/ProductForm/hooks/useProductFormScreen';
import { productFormScreenStyles as styles } from '@/presentation/screens/ProductForm/style/ProductFormScreen.styles';
import { localDateToIsoDateString, startOfTodayLocal } from '@/presentation/screens/ProductForm/utils/dateIsoUtils';
import * as Theme from '@/shared/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';

export type ProductFormViewModel = ReturnType<typeof useProductFormScreen>;

type Props = {
  mode: 'create' | 'edit';
  vm: ProductFormViewModel;
  releaseDateValue: Date;
  onSubmit: () => void | Promise<void>;
};

export function ProductFormBody({ mode, vm, releaseDateValue, onSubmit }: Props) {
  const err = vm.fieldErrors;
  const formA11y =
    mode === 'create' ? 'Formulario de alta de producto' : 'Formulario de edición de producto';

  return (
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
        <FormFieldError message={vm.fieldErrors.id} />

        <FieldLabel>Nombre</FieldLabel>
        <TextInput
          value={vm.fields.name}
          onChangeText={(t) => vm.setField('name', t)}
          placeholderTextColor={Theme.colors.textMuted}
          style={[styles.input, err.name && styles.inputError]}
          accessibilityLabel="Nombre del producto"
        />
        <FormFieldError message={vm.fieldErrors.name} />

        <FieldLabel>Descripción</FieldLabel>
        <TextInput
          value={vm.fields.description}
          onChangeText={(t) => vm.setField('description', t)}
          placeholderTextColor={Theme.colors.textMuted}
          style={[styles.input, styles.inputMultiline, err.description && styles.inputError]}
          multiline
          accessibilityLabel="Descripción del producto"
        />
        <FormFieldError message={vm.fieldErrors.description} />

        <FieldLabel>Logo (URL o archivo)</FieldLabel>
        <TextInput
          value={vm.fields.logo}
          onChangeText={(t) => vm.setField('logo', t)}
          placeholderTextColor={Theme.colors.textMuted}
          style={[styles.input, err.logo && styles.inputError]}
          autoCapitalize="none"
          accessibilityLabel="Logo del producto"
        />
        <FormFieldError message={vm.fieldErrors.logo} />

        <View style={styles.datePickerRow}>
          <FieldLabel>Fecha de liberación</FieldLabel>
          <DatePickerInput
            locale="es"
            inputMode="start"
            mode="outlined"
            value={releaseDateValue}
            onChange={(d) => vm.setField('date_release', localDateToIsoDateString(d))}
            validRange={{ startDate: startOfTodayLocal() }}
            hideValidationErrors
            error={!!err.date_release}
            accessibilityLabel="Fecha de liberación"
          />
          <FormFieldError message={vm.fieldErrors.date_release} />
        </View>

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
        <FormFieldError message={vm.fieldErrors.date_revision} />

        <View style={styles.actions}>
          <Pressable
            onPress={() => void onSubmit()}
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
              <Text style={styles.primaryLabel}>
                {mode === 'create' ? 'Guardar' : 'Guardar cambios'}
              </Text>
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
  );
}
