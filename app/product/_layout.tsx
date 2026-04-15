import { colors } from '@/shared/theme';
import { Stack } from 'expo-router';

export default function ProductStackLayout() {
  return (
    <Stack
      screenOptions={{
        title: '',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
      }}
    />
  );
}
