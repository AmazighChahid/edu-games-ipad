/**
 * HomeHeaderV9 - Header component for V9 home screen
 * Contains: Parent button (left), Profile section (center), Stats (right)
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';

import { UserProfileV9 } from '@/types/home.types';

interface HomeHeaderV9Props {
  profile: UserProfileV9;
  onParentPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Parent icon SVG
const ParentIcon = memo(() => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="#FFFFFF">
    <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </Svg>
));

ParentIcon.displayName = 'ParentIcon';

// Parent Button Component
const ParentButton = memo(({ onPress }: { onPress?: () => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.parentButton, animatedStyle]}
      accessibilityLabel="Espace Parent"
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#9B59B6', '#8E44AD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.parentIcon}
      >
        <ParentIcon />
      </LinearGradient>
      <Text style={styles.parentText}>Espace Parent</Text>
    </AnimatedPressable>
  );
});

ParentButton.displayName = 'ParentButton';

// Profile Section Component
const ProfileSection = memo(({ profile }: { profile: UserProfileV9 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    router.push('/(games)/profile' as any);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.profileSection, animatedStyle]}
      accessibilityLabel={`Profil de ${profile.name}`}
      accessibilityRole="button"
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={['#5B8DEE', '#9B59B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
        </LinearGradient>
        {/* Level badge */}
        <LinearGradient
          colors={['#F5A623', '#F39C12']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.levelBadge}
        >
          <Text style={styles.levelText}>{profile.level}</Text>
        </LinearGradient>
      </View>

      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>
          Bonjour <Text style={styles.greetingName}>{profile.name}</Text> !
        </Text>
        <Text style={styles.greetingSubtitle}>
          Prête pour une nouvelle aventure ?
        </Text>
      </View>
    </AnimatedPressable>
  );
});

ProfileSection.displayName = 'ProfileSection';

// Stats Section Component
const StatsSection = memo(({ gems, medals }: { gems: number; medals: number }) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>💎</Text>
        <Text style={styles.statValue}>{gems}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>🏅</Text>
        <Text style={styles.statValue}>{medals}</Text>
      </View>
    </View>
  );
});

StatsSection.displayName = 'StatsSection';

// Main Header Component
export const HomeHeaderV9 = memo(({ profile, onParentPress }: HomeHeaderV9Props) => {
  const insets = useSafeAreaInsets();

  const handleParentPress = () => {
    if (onParentPress) {
      onParentPress();
    } else {
      // Default: navigate to parent zone
      router.push('/(parent)' as any);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <ParentButton onPress={handleParentPress} />
      <ProfileSection profile={profile} />
      <StatsSection gems={profile.gems} medals={profile.totalMedals} />
    </View>
  );
});

HomeHeaderV9.displayName = 'HomeHeaderV9';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 16,
  },

  // Parent Button
  parentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  parentIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
    color: '#666',
  },

  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  greeting: {
    gap: 2,
  },
  greetingTitle: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 24,
    color: '#2D3436',
  },
  greetingName: {
    color: '#5B8DEE',
  },
  greetingSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#4A5568',
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 14,
    color: '#2D3436',
  },
});
