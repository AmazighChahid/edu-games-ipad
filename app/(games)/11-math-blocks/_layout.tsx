import { Stack } from 'expo-router';
import { colors } from '../../../src/theme';

export default function MathBlocksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.game },
        animation: 'fade',
      }}
    />
  );
}
