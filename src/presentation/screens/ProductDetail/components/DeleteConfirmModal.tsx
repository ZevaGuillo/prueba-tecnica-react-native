import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/shared/theme';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  productName: string;
  /** Conservado para compatibilidad con pantallas que ya pasan el id; no se muestra en UI. */
  productId: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  submitting?: boolean;
  errorMessage?: string | null;
};

export type DeleteConfirmModalSurfaceProps = Omit<Props, 'visible'>;

const SHEET_MAX_HEIGHT_RATIO = 0.4;

/**
 * Contenido del modal (backdrop + bottom sheet). Exportado para pruebas sin `Modal` nativo.
 */
export function DeleteConfirmModalSurface({
  productName,
  productId: _productId,
  onCancel,
  onConfirm,
  submitting = false,
  errorMessage,
}: DeleteConfirmModalSurfaceProps) {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sheetMaxHeight = windowHeight * SHEET_MAX_HEIGHT_RATIO;
  const bottomPad = Math.max(insets.bottom, spacing.md);

  const message = `¿Estás seguro de eliminar el producto ${productName}?`;

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          if (!submitting) onCancel();
        }}
        accessibilityLabel="Cerrar sin eliminar"
        accessibilityRole="button"
        accessibilityHint="Descarta el cuadro de confirmación"
      />
      <View style={styles.sheetAlign} pointerEvents="box-none">
        <View
          style={[styles.sheet, { height: sheetMaxHeight }]}
          accessibilityRole="alert"
          accessibilityLabel="Confirmar eliminación de producto">
          <Pressable
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && !submitting && styles.closePressed,
              submitting && styles.closeDisabled,
            ]}
            onPress={onCancel}
            disabled={submitting}
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
            accessibilityHint="Cierra sin eliminar el producto"
            hitSlop={12}>
            <Ionicons name="close" size={24} color={colors.textPrimary} accessibilityElementsHidden />
          </Pressable>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator
            nestedScrollEnabled>
            <Text style={styles.message} accessibilityRole="text">
              {message}
            </Text>
            {errorMessage ? (
              <Text
                style={styles.error}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite">
                {errorMessage}
              </Text>
            ) : null}
          </ScrollView>

          <View style={[styles.actions, { paddingBottom: bottomPad }]}>
            <Pressable
              onPress={onConfirm}
              disabled={submitting}
              style={({ pressed }) => [
                styles.btn,
                styles.btnPrimary,
                pressed && !submitting && styles.pressed,
                submitting && styles.btnDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel={submitting ? 'Eliminando' : 'Confirmar'}
              accessibilityState={{ disabled: submitting }}>
              <Text style={styles.primaryLabel}>
                {submitting ? 'Eliminando…' : 'Confirmar'}
              </Text>
            </Pressable>
            <Pressable
              onPress={onCancel}
              disabled={submitting}
              style={({ pressed }) => [
                styles.btn,
                styles.btnSecondary,
                pressed && !submitting && styles.pressed,
                submitting && styles.btnDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              accessibilityState={{ disabled: submitting }}>
              <Text style={styles.secondaryLabel}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

/**
 * Confirmación de borrado (bottom sheet): Cancelar cierra; Confirmar ejecuta la eliminación.
 */
export function DeleteConfirmModal({
  visible,
  ...surfaceProps
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (!surfaceProps.submitting) surfaceProps.onCancel();
      }}
      statusBarTranslucent
      accessibilityViewIsModal>
      <DeleteConfirmModalSurface {...surfaceProps} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheetAlign: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
    padding: spacing.xs,
    borderRadius: radii.md,
  },
  closePressed: {
    opacity: 0.7,
  },
  closeDisabled: {
    opacity: 0.4,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  message: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: typography.fontFamily,
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    flexShrink: 0,
  },
  btn: {
    width: '100%',
    minHeight: 48,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    backgroundColor: colors.neutral,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.88,
  },
  primaryLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryLabel: {
    color: colors.neutralText,
    fontSize: 16,
    fontWeight: '600',
  },
});
