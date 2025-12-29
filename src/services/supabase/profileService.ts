/**
 * Profile Service
 * CRUD operations pour les profils enfants dans Supabase
 */

import { supabase } from './supabaseClient';
import type { ChildProfile, AgeGroup } from '@/types/parent.types';

// Type Supabase row
interface SupabaseProfile {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  age_group: AgeGroup;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Convertit une row Supabase vers le type app
 */
function toChildProfile(row: SupabaseProfile): ChildProfile {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    ageGroup: row.age_group,
    isActive: row.is_active,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export const profileService = {
  /**
   * Récupérer tous les profils de l'utilisateur courant
   */
  async fetchProfiles(): Promise<ChildProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[ProfileService] Fetch error:', error);
        return [];
      }

      return (data ?? []).map(toChildProfile);
    } catch (err) {
      console.error('[ProfileService] Fetch exception:', err);
      return [];
    }
  },

  /**
   * Récupérer le profil actif
   */
  async fetchActiveProfile(): Promise<ChildProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return null;
      }

      return toChildProfile(data);
    } catch (err) {
      console.error('[ProfileService] FetchActive exception:', err);
      return null;
    }
  },

  /**
   * Créer un nouveau profil
   */
  async createProfile(
    name: string,
    avatar: string,
    ageGroup: AgeGroup,
    setAsActive: boolean = false
  ): Promise<ChildProfile | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('[ProfileService] No authenticated user');
        return null;
      }

      // Si c'est le premier profil ou setAsActive, on le met actif
      const profiles = await this.fetchProfiles();
      const shouldBeActive = profiles.length === 0 || setAsActive;

      // Si on veut l'activer, désactiver les autres d'abord
      if (shouldBeActive && profiles.length > 0) {
        await supabase
          .from('profiles')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name,
          avatar,
          age_group: ageGroup,
          is_active: shouldBeActive,
        })
        .select()
        .single();

      if (error) {
        console.error('[ProfileService] Create error:', error);
        return null;
      }

      return toChildProfile(data);
    } catch (err) {
      console.error('[ProfileService] Create exception:', err);
      return null;
    }
  },

  /**
   * Définir le profil actif (désactive les autres)
   */
  async setActiveProfile(profileId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return false;

      // Désactiver tous les profils
      await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Activer le profil sélectionné
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', profileId);

      return !error;
    } catch (err) {
      console.error('[ProfileService] SetActive exception:', err);
      return false;
    }
  },

  /**
   * Mettre à jour un profil
   */
  async updateProfile(
    profileId: string,
    updates: Partial<Pick<ChildProfile, 'name' | 'avatar' | 'ageGroup'>>
  ): Promise<boolean> {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.avatar) dbUpdates.avatar = updates.avatar;
      if (updates.ageGroup) dbUpdates.age_group = updates.ageGroup;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', profileId);

      return !error;
    } catch (err) {
      console.error('[ProfileService] Update exception:', err);
      return false;
    }
  },

  /**
   * Supprimer un profil
   */
  async deleteProfile(profileId: string): Promise<boolean> {
    try {
      // Vérifier qu'on ne supprime pas le dernier profil
      const profiles = await this.fetchProfiles();
      if (profiles.length <= 1) {
        console.warn('[ProfileService] Cannot delete last profile');
        return false;
      }

      const profileToDelete = profiles.find((p) => p.id === profileId);
      const wasActive = profileToDelete?.isActive;

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        console.error('[ProfileService] Delete error:', error);
        return false;
      }

      // Si on a supprimé le profil actif, activer le premier restant
      if (wasActive) {
        const remaining = profiles.filter((p) => p.id !== profileId);
        if (remaining.length > 0) {
          await this.setActiveProfile(remaining[0].id);
        }
      }

      return true;
    } catch (err) {
      console.error('[ProfileService] Delete exception:', err);
      return false;
    }
  },

  /**
   * Vérifier si l'utilisateur a des profils
   */
  async hasProfiles(): Promise<boolean> {
    const profiles = await this.fetchProfiles();
    return profiles.length > 0;
  },
};

export default profileService;
