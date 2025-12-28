/**
 * Profile Slice
 * Manages child profiles (prepared for multi-profile support)
 */

import { StateCreator } from 'zustand';
import type { ChildProfile, AgeGroup } from '@/types';

export interface ProfileState {
  profiles: ChildProfile[];
  activeProfileId: string | null;
}

export interface ProfileActions {
  // Profile management
  createProfile: (name: string, avatar: string, ageGroup: AgeGroup, birthDate?: number) => string;
  updateProfile: (id: string, updates: Partial<Omit<ChildProfile, 'id' | 'createdAt'>>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;

  // Getters
  getActiveProfile: () => ChildProfile | null;
  getProfile: (id: string) => ChildProfile | undefined;
  getAllProfiles: () => ChildProfile[];
}

export type ProfileSlice = ProfileState & ProfileActions;

// Generate unique ID
const generateId = () => `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Default profile created on first launch
const createDefaultProfile = (): ChildProfile => ({
  id: 'default_profile',
  name: 'Mon Enfant',
  avatar: '👦',
  ageGroup: '6-7',
  createdAt: Date.now(),
  isActive: true,
});

export const initialProfileState: ProfileState = {
  profiles: [createDefaultProfile()],
  activeProfileId: 'default_profile',
};

export const createProfileSlice: StateCreator<ProfileSlice, [], [], ProfileSlice> = (
  set,
  get
) => ({
  ...initialProfileState,

  createProfile: (name, avatar, ageGroup, birthDate) => {
    const id = generateId();
    const newProfile: ChildProfile = {
      id,
      name,
      avatar,
      ageGroup,
      birthDate,
      createdAt: Date.now(),
      isActive: false,
    };

    set((state) => ({
      profiles: [...state.profiles, newProfile],
    }));

    return id;
  },

  updateProfile: (id, updates) => {
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.id === id ? { ...profile, ...updates } : profile
      ),
    }));
  },

  deleteProfile: (id) => {
    const state = get();

    // Prevent deleting the last profile
    if (state.profiles.length <= 1) {
      console.warn('Cannot delete the last profile');
      return;
    }

    // If deleting active profile, switch to another
    const wasActive = state.activeProfileId === id;
    const remainingProfiles = state.profiles.filter((p) => p.id !== id);

    set({
      profiles: remainingProfiles,
      activeProfileId: wasActive ? remainingProfiles[0]?.id || null : state.activeProfileId,
    });
  },

  setActiveProfile: (id) => {
    set((state) => ({
      activeProfileId: id,
      profiles: state.profiles.map((profile) => ({
        ...profile,
        isActive: profile.id === id,
      })),
    }));
  },

  getActiveProfile: () => {
    const state = get();
    return state.profiles.find((p) => p.id === state.activeProfileId) || null;
  },

  getProfile: (id) => {
    return get().profiles.find((p) => p.id === id);
  },

  getAllProfiles: () => {
    return get().profiles;
  },
});
