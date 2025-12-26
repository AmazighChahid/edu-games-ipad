import { useState } from 'react';
import { ChildProfile } from '../types/games';

// Mock data - À remplacer par une vraie source de données (Context, AsyncStorage, etc.)
const MOCK_PROFILE: ChildProfile = {
  id: '1',
  name: 'Emma',
  avatarEmoji: '🦊',
  level: 5,
  totalStars: 127,
  totalBadges: 12,
  currentStreak: 5,
  weekProgress: [true, true, true, true, true, false, false],
  todayIndex: 4, // Vendredi
  flowersCount: 5,
  gamesCompleted: 47,
  totalPlayTime: '8h',
};

export const useChildProfile = () => {
  const [profile, setProfile] = useState<ChildProfile>(MOCK_PROFILE);

  const updateProfile = (updates: Partial<ChildProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return {
    profile,
    updateProfile,
  };
};
