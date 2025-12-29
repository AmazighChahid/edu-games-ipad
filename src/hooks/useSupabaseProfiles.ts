/**
 * useSupabaseProfiles Hook
 * Gestion des profils avec sync Supabase
 */

import { useEffect, useCallback, useState } from 'react';
import { useStore } from '@/store';
import { profileService } from '@/services/supabase/profileService';
import type { ChildProfile, AgeGroup } from '@/types/parent.types';

export function useSupabaseProfiles() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const profiles = useStore((s) => s.profiles);
  const activeProfileId = useStore((s) => s.activeProfileId);
  const setProfiles = useStore((s) => s.setProfiles);
  const setActiveProfileId = useStore((s) => s.setActiveProfileId);
  const addProfile = useStore((s) => s.addProfile);

  // Charger les profils depuis Supabase
  const loadProfiles = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabaseProfiles = await profileService.fetchProfiles();

      if (supabaseProfiles.length > 0) {
        // Sync avec le store local
        setProfiles(supabaseProfiles);

        // Trouver le profil actif
        const activeProfile = supabaseProfiles.find((p) => p.isActive);
        if (activeProfile) {
          setActiveProfileId(activeProfile.id);
        } else {
          // Si aucun actif, activer le premier
          setActiveProfileId(supabaseProfiles[0].id);
        }
      }
    } catch (err) {
      console.error('[useSupabaseProfiles] Load error:', err);
      setError('Erreur de chargement des profils');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, setProfiles, setActiveProfileId]);

  // Charger au montage et quand l'auth change
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Créer un profil
  const createProfile = useCallback(
    async (name: string, avatar: string, ageGroup: AgeGroup): Promise<ChildProfile | null> => {
      setError(null);

      const newProfile = await profileService.createProfile(name, avatar, ageGroup, true);

      if (newProfile) {
        // Ajouter au store local
        addProfile(newProfile);
        setActiveProfileId(newProfile.id);
        return newProfile;
      }

      setError('Erreur lors de la création du profil');
      return null;
    },
    [addProfile, setActiveProfileId]
  );

  // Changer de profil actif
  const switchProfile = useCallback(
    async (profileId: string): Promise<boolean> => {
      setError(null);

      const success = await profileService.setActiveProfile(profileId);

      if (success) {
        setActiveProfileId(profileId);
        // Mettre à jour isActive dans le store local
        setProfiles(
          profiles.map((p) => ({
            ...p,
            isActive: p.id === profileId,
          }))
        );
        return true;
      }

      setError('Erreur lors du changement de profil');
      return false;
    },
    [profiles, setActiveProfileId, setProfiles]
  );

  // Mettre à jour un profil
  const updateProfile = useCallback(
    async (
      profileId: string,
      updates: Partial<Pick<ChildProfile, 'name' | 'avatar' | 'ageGroup'>>
    ): Promise<boolean> => {
      setError(null);

      const success = await profileService.updateProfile(profileId, updates);

      if (success) {
        setProfiles(
          profiles.map((p) =>
            p.id === profileId
              ? { ...p, ...updates }
              : p
          )
        );
        return true;
      }

      setError('Erreur lors de la mise à jour');
      return false;
    },
    [profiles, setProfiles]
  );

  // Supprimer un profil
  const deleteProfile = useCallback(
    async (profileId: string): Promise<boolean> => {
      setError(null);

      if (profiles.length <= 1) {
        setError('Impossible de supprimer le dernier profil');
        return false;
      }

      const success = await profileService.deleteProfile(profileId);

      if (success) {
        const remaining = profiles.filter((p) => p.id !== profileId);
        setProfiles(remaining);

        // Si on a supprimé le profil actif
        if (activeProfileId === profileId && remaining.length > 0) {
          setActiveProfileId(remaining[0].id);
        }

        return true;
      }

      setError('Erreur lors de la suppression');
      return false;
    },
    [profiles, activeProfileId, setProfiles, setActiveProfileId]
  );

  // Profil actif
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;

  return {
    // État
    profiles,
    activeProfile,
    activeProfileId,
    isLoading,
    error,
    hasProfiles: profiles.length > 0,

    // Actions
    loadProfiles,
    createProfile,
    switchProfile,
    updateProfile,
    deleteProfile,
  };
}

export default useSupabaseProfiles;
