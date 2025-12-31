/**
 * HomeHeaderV10 - Header pour l'écran d'accueil V10
 * Avatar, greeting, stats et bouton parent
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import {
  HomeV10Colors,
  HomeV10Layout,
} from '../../theme/home-v10-colors';

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
  showPlayground?: boolean;
  // Dev mode
  devMode?: boolean;
  onDevModeToggle?: () => void;
}

// Playground Button Icon (code/palette icon)
const PlaygroundIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" />
    <Path d="M6.5 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm3-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
  </Svg>
);

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

// Playground Button Component
const PlaygroundButton = memo(({ onPress }: { onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.playgroundButton,
      pressed && styles.playgroundButtonPressed,
    ]}
  >
    <LinearGradient
      colors={['#10B981', '#059669']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.playgroundButtonGradient}
    >
      <PlaygroundIcon />
    </LinearGradient>
  </Pressable>
));

PlaygroundButton.displayName = 'PlaygroundButton';

// Dev Mode Button Component
const DevModeButton = memo(({ active, onPress }: { active: boolean; onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    onLongPress={onPress}
    delayLongPress={500}
    style={({ pressed }) => [
      styles.devButton,
      active && styles.devButtonActive,
      pressed && styles.devButtonPressed,
    ]}
  >
    <Text style={styles.devButtonText}>DEV</Text>
  </Pressable>
));

DevModeButton.displayName = 'DevModeButton';

export const HomeHeaderV10 = memo(({
  profile,
  onParentPress,
  onAvatarPress,
  showPlayground = true,
  devMode = false,
  onDevModeToggle,
}: HomeHeaderV10Props) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handlePlaygroundPress = () => {
    router.push('/playground');
  };

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

      {/* Right: Stats + Playground + Dev */}
      <View style={styles.statsContainer}>
        <StatBadge icon="💎" value={profile.gems} />
        <StatBadge icon="🏅" value={profile.totalMedals} />
        {showPlayground && <PlaygroundButton onPress={handlePlaygroundPress} />}
        <DevModeButton active={devMode} onPress={onDevModeToggle} />
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
    boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 6px 20px rgba(91, 141, 238, 0.3)',
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
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.08)',
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

  // Playground Button
  playgroundButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(16, 185, 129, 0.3)',
    elevation: 4,
  },
  playgroundButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  playgroundButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Dev Mode Button
  devButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#6B7280',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  devButtonActive: {
    backgroundColor: '#EF4444',
  },
  devButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  devButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
});
