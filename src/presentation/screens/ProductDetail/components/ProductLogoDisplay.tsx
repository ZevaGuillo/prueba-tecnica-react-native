import { colors, radii, spacing, typography } from '@/shared/theme';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  logo: string;
  productName: string;
};

function isAbsoluteHttpUrl(s: string): boolean {
  try {
    const u = new URL(s.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function ProductLogoDisplay({ logo, productName }: Props) {
  const [failed, setFailed] = useState(false);
  const trimmed = logo.trim();
  const canTryImage = trimmed.length > 0 && isAbsoluteHttpUrl(trimmed) && !failed;

  return (
    <View
      style={styles.wrap}
      accessibilityRole="image"
      accessibilityLabel={`Logo del producto ${productName}`}>
      {canTryImage ? (
        <Image
          source={{ uri: trimmed }}
          style={styles.image}
          contentFit="contain"
          transition={200}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={styles.fallback} accessibilityRole="text">
          <Text style={styles.fallbackIcon}>◆</Text>
          <Text style={styles.fallbackText} numberOfLines={2}>
            {trimmed || 'Sin logo'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 280,
    aspectRatio: 16 / 9,
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  fallbackIcon: {
    fontSize: 40,
    color: colors.textMuted,
  },
  fallbackText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
