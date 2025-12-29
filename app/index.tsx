/**
 * Entry Point
 * Point d'entrée de l'application - gère le routing conditionnel
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';
import { profileService } from '@/services/supabase/profileService';
import { colors } from '@/theme/colors';

export default function EntryPoint() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const hasCompletedOnboarding = useStore((s) => s.hasCompletedOnboarding);
  const hasHydrated = useStore((s) => s.hasHydrated);

  useEffect(() => {
    // Attendre que le store soit hydraté et que l'auth soit chargée
    if (!hasHydrated || isAuthLoading) {
      return;
    }

    const navigate = async () => {
      // Cas 1: Non authentifié
      if (!isAuthenticated) {
        if (!hasCompletedOnboarding) {
          // Premier lancement -> Onboarding
          router.replace('/(auth)/onboarding' as Href);
        } else {
          // Onboarding déjà fait -> Login
          router.replace('/(auth)/login' as Href);
        }
        return;
      }

      // Cas 2: Authentifié - vérifier les profils
      try {
        const hasProfiles = await profileService.hasProfiles();

        if (!hasProfiles) {
          // Pas de profil -> Créer le premier
          router.replace('/(app)/create-profile' as Href);
        } else {
          // A des profils -> Home
          router.replace('/(app)/home' as Href);
        }
      } catch (error) {
        console.error('[EntryPoint] Error checking profiles:', error);
        // En cas d'erreur, aller vers home (le local store a peut-être des profils)
        router.replace('/(app)/home' as Href);
      }
    };

    navigate();
  }, [hasHydrated, isAuthLoading, isAuthenticated, hasCompletedOnboarding, router]);

  // Écran de chargement pendant la vérification
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
