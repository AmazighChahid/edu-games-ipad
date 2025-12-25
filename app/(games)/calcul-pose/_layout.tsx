/**
 * Calcul Posé layout
 */

import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function CalculPoseLayout() {
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
