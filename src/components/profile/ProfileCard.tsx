/**
 * ProfileCard - Card component for displaying a profile
 * Used in the profile switcher modal
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import type { ChildProfile, AgeGroup } from '@/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ProfileCardProps {
  profile: ChildProfile;
  isActive: boolean;
  onPress: () => void;
}

// Couleurs par tranche d'âge
const AGE_GROUP_COLORS: Record<AgeGroup, [string, string]> = {
  '3-5': ['#7BC74D', '#5BA030'],
  '6-7': ['#5B8DEE', '#3A6DD8'],
  '8-10': ['#9B59B6', '#7B3F96'],
};

const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '3-5': '3-5 ans',
  '6-7': '6-7 ans',
  '8-10': '8-10 ans',
};

export const ProfileCard = memo(({ profile, isActive, onPress }: ProfileCardProps) => {
  const scale = useSharedValue(1);
  const ageGroup = profile.ageGroup || '6-7';
  const colors = AGE_GROUP_COLORS[ageGroup];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <View style={[styles.card, isActive && styles.cardActive]}>
        {/* Avatar */}
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarEmoji}>{profile.avatar}</Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}
          </Text>
          <View style={[styles.ageBadge, { backgroundColor: colors[0] + '20' }]}>
            <Text style={[styles.ageText, { color: colors[0] }]}>
              {AGE_GROUP_LABELS[ageGroup]}
            </Text>
          </View>
        </View>

        {/* Active indicator */}
        {isActive && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeCheck}>✓</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
});

ProfileCard.displayName = 'ProfileCard';

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    gap: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardActive: {
    borderColor: '#5B8DEE',
    backgroundColor: '#F0F6FF',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
  },
  ageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5B8DEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheck: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
