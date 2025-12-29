/**
 * App Layout (Protected Routes)
 * Layout pour les routes protégées (nécessitent authentification)
 */

import React, { useEffect } from 'react';
import { Stack, Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/colors';

export default function AppLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login' as Href);
    }
  }, [isLoading, isAuthenticated, router]);

  // Afficher loading pendant la vérification
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  // Si non authentifié, ne rien afficher (la redirection est en cours)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="create-profile" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
