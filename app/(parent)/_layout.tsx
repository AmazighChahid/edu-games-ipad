import { useState } from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';
import { ParentGate } from '../../src/components/common/ParentGate';

export default function ParentLayout() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return <ParentGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
        animation: 'fade',
      }}
    />
  );
}
