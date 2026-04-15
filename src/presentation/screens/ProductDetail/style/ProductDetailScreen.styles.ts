import { colors, radii, spacing, typography } from '@/shared/theme';
import { StyleSheet } from 'react-native';

export const productDetailScreenStyles = StyleSheet.create({
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
