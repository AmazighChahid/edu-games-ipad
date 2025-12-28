/**
 * useProfileSwitcher - Hook to manage profile switching modal state
 * Handles switching profiles and creating new ones
 */

import { useState, useCallback } from 'react';
import { useStore, useActiveProfile, useProfiles } from '@/store';
import type { AgeGroup } from '@/types';

export function useProfileSwitcher() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreationFlowVisible, setIsCreationFlowVisible] = useState(false);

  const profiles = useProfiles();
  const activeProfile = useActiveProfile();
  const { setActiveProfile, createProfile } = useStore();

  const openSwitcher = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const closeSwitcher = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const openCreationFlow = useCallback(() => {
    setIsModalVisible(false);
    // Small delay for smooth transition
    setTimeout(() => {
      setIsCreationFlowVisible(true);
    }, 100);
  }, []);

  const closeCreationFlow = useCallback(() => {
    setIsCreationFlowVisible(false);
  }, []);

  const switchProfile = useCallback((profileId: string) => {
    setActiveProfile(profileId);
    closeSwitcher();
  }, [setActiveProfile, closeSwitcher]);

  const handleCreateProfile = useCallback(
    (data: { name: string; avatar: string; ageGroup: AgeGroup }) => {
      const newId = createProfile(data.name, data.avatar, data.ageGroup);
      setActiveProfile(newId);
      closeCreationFlow();
    },
    [createProfile, setActiveProfile, closeCreationFlow]
  );

  return {
    // Modal states
    isModalVisible,
    isCreationFlowVisible,

    // Data
    profiles,
    activeProfile,

    // Actions
    openSwitcher,
    closeSwitcher,
    openCreationFlow,
    closeCreationFlow,
    switchProfile,
    handleCreateProfile,
  };
}
