import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import '@/i18n';
import { useStore } from '@/store/useStore';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const updateLastOpened = useStore((state) => state.updateLastOpened);

  useEffect(() => {
    if (hasHydrated) {
      updateLastOpened();
      SplashScreen.hideAsync();
    }
  }, [hasHydrated, updateLastOpened]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background.primary },
            animation: 'fade',
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
