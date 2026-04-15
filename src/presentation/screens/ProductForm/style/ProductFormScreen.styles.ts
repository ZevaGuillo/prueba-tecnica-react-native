import * as Theme from '@/shared/theme';
import { StyleSheet } from 'react-native';

export const productFormScreenStyles = StyleSheet.create({
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
  datePickerRow: {
    alignSelf: 'stretch',
    marginTop: Theme.spacing.sm,
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
