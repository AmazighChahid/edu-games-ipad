/**
 * Create Profile Screen
 * Écran de création du premier profil enfant (post-inscription)
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileCreationFlow } from '@/components/profile';
import { useSupabaseProfiles } from '@/hooks/useSupabaseProfiles';
import { colors } from '@/theme/colors';
import type { AgeGroup } from '@/types/parent.types';

export default function CreateProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createProfile } = useSupabaseProfiles();

  const handleComplete = useCallback(
    async (data: { name: string; avatar: string; ageGroup: AgeGroup }) => {
      const profile = await createProfile(data.name, data.avatar, data.ageGroup);

      if (profile) {
        // Profil créé, aller vers home
        router.replace('/(app)/home' as Href);
      }
    },
    [createProfile, router]
  );

  const handleClose = useCallback(() => {
    // On ne peut pas fermer sans créer de profil
    // Mais on pourrait déconnecter l'utilisateur
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Créons ton profil !</Text>
        <Text style={styles.subtitle}>
          Pour personnaliser ton expérience d'apprentissage
        </Text>
      </View>

      <ProfileCreationFlow
        visible={true}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Fredoka',
    fontSize: 28,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
