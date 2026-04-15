import { colors, radii, spacing, typography } from '@/shared/theme';
import { StyleSheet } from 'react-native';

export const productListScreenStyles = StyleSheet.create({
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
});
