import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.game },
        animation: 'slide_from_right',
      }}
    />
  );
}
