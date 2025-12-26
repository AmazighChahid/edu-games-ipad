/**
 * HomeHeaderV10 - Header pour l'écran d'accueil V10
 * Avatar, greeting, stats et bouton parent
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
  HomeV10Colors,
  HomeV10Layout,
} from '@/theme/home-v10-colors';

interface HomeHeaderV10Props {
  profile: {
    name: string;
    avatarEmoji: string;
    level: number;
    gems: number;
    totalMedals: number;
  };
  onParentPress?: () => void;
  onAvatarPress?: () => void;
}

// Parent Button Icon
const ParentIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="#fff">
    <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </Svg>
);

// Parent Button Component
const ParentButton = memo(({ onPress }: { onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.parentButton,
      pressed && styles.parentButtonPressed,
    ]}
  >
    <View style={styles.parentButtonIcon}>
      <LinearGradient
        colors={['#9B59B6', '#8E44AD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.parentButtonIconGradient}
      >
        <ParentIcon />
      </LinearGradient>
    </View>
    <Text style={styles.parentButtonText}>Espace Parent</Text>
  </Pressable>
));

ParentButton.displayName = 'ParentButton';

// Avatar Component
const Avatar = memo(({
  emoji,
  level,
  onPress,
}: {
  emoji: string;
  level: number;
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.avatarContainer,
      pressed && styles.avatarPressed,
    ]}
  >
    <LinearGradient
      colors={['#5B8DEE', '#9B59B6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatar}
    >
      <Text style={styles.avatarEmoji}>{emoji}</Text>
    </LinearGradient>
    <View style={styles.avatarLevel}>
      <LinearGradient
        colors={['#F5A623', '#F39C12']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarLevelGradient}
      >
        <Text style={styles.avatarLevelText}>{level}</Text>
      </LinearGradient>
    </View>
  </Pressable>
));

Avatar.displayName = 'Avatar';

// Stat Badge Component
const StatBadge = memo(({ icon, value }: { icon: string; value: number }) => (
  <View style={styles.statBadge}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
));

StatBadge.displayName = 'StatBadge';

export const HomeHeaderV10 = memo(({
  profile,
  onParentPress,
  onAvatarPress,
}: HomeHeaderV10Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Left: Parent Button */}
      <ParentButton onPress={onParentPress} />

      {/* Center: Profile Section */}
      <View style={styles.profileSection}>
        <Avatar
          emoji={profile.avatarEmoji}
          level={profile.level}
          onPress={onAvatarPress}
        />
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>
            Bonjour <Text style={styles.greetingName}>{profile.name}</Text> !
          </Text>
          <Text style={styles.greetingSubtitle}>
            Prête pour une nouvelle aventure ?
          </Text>
        </View>
      </View>

      {/* Right: Stats */}
      <View style={styles.statsContainer}>
        <StatBadge icon="💎" value={profile.gems} />
        <StatBadge icon="🏅" value={profile.totalMedals} />
      </View>
    </View>
  );
});

HomeHeaderV10.displayName = 'HomeHeaderV10';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HomeV10Layout.screenPadding,
    paddingBottom: HomeV10Layout.headerPaddingVertical,
  },

  // Parent Button
  parentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: HomeV10Colors.cardBg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  parentButtonPressed: {
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.2,
  },
  parentButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  parentButtonIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },

  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPressed: {
    transform: [{ scale: 1.05 }],
  },
  avatar: {
    width: HomeV10Layout.avatarSize,
    height: HomeV10Layout.avatarSize,
    borderRadius: HomeV10Layout.avatarSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  avatarLevel: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: HomeV10Layout.avatarLevelSize,
    height: HomeV10Layout.avatarLevelSize,
    borderRadius: HomeV10Layout.avatarLevelSize / 2,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarLevelGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLevelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  greeting: {
    gap: 6,
  },
  greetingTitle: {
    fontSize: HomeV10Layout.greetingSize,
    fontWeight: '700',
    color: HomeV10Colors.textPrimary,
  },
  greetingName: {
    color: HomeV10Colors.textAccent,
  },
  greetingSubtitle: {
    fontSize: 15,
    color: HomeV10Colors.textSecondary,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: HomeV10Colors.cardBg,
    paddingVertical: HomeV10Layout.statPaddingV,
    paddingHorizontal: HomeV10Layout.statPaddingH,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: HomeV10Colors.textPrimary,
  },
});
