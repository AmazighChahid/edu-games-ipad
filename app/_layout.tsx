import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';

// Custom font - FredokaOne for display titles
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FredokaOneRegular = require('../assets/fonts/FredokaOne-Regular.otf');
import 'react-native-reanimated';

import '../src/i18n';
import { useStore } from '../src/store';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const updateLastOpened = useStore((state) => state.updateLastOpened);

  // Load fonts
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    // Custom display font for titles
    'FredokaOne-Regular': FredokaOneRegular,
  });

  useEffect(() => {
    if (hasHydrated && fontsLoaded) {
      updateLastOpened();
      SplashScreen.hideAsync();
    }
  }, [hasHydrated, fontsLoaded, updateLastOpened]);

  if (!hasHydrated || !fontsLoaded) {
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
