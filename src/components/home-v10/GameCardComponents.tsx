/**
 * GameCardComponents - Composants internes pour les cartes de jeu V10
 * Extrait de GameCardV10.tsx pour améliorer la maintenabilité
 *
 * Contient:
 * - ProgressBar: Barre de progression (4 segments)
 * - ActionButton: Bouton d'action (play, favorite, add)
 * - MedalBadge: Badge de médaille avec gradient
 * - CategoryBadge: Badge de catégorie
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { styles } from './GameCardStyles';
import { medalConfig as themeMedalConfig, categoryColors } from '../../theme/home-v10-colors';

// ========================================
// TYPES
// ========================================

export type MedalType = 'start' | 'bronze' | 'silver' | 'gold' | 'diamond';
export type GameCategory = 'chiffres' | 'mots' | 'logique' | 'memoire';

// ========================================
// CONFIGURATIONS
// ========================================

// Configuration des médailles basées sur la progression
export const getMedalFromProgress = (progress: number): MedalType => {
  if (progress <= 0) return 'start';
  if (progress === 1) return 'bronze';
  if (progress === 2) return 'silver';
  if (progress === 3) return 'gold';
  return 'diamond'; // progress >= 4
};

// Re-export medalConfig from theme for backwards compatibility
export const medalConfig = themeMedalConfig;

// Configuration des catégories (utilise categoryColors du theme)
export const categoryConfig: Record<GameCategory, {
  icon: string;
  color: string;
  label: string
}> = {
  chiffres: { icon: '🔢', color: categoryColors.chiffres, label: 'Chiffres' },
  mots: { icon: '📝', color: categoryColors.mots, label: 'Mots' },
  logique: { icon: '🧩', color: categoryColors.logique, label: 'Logique' },
  memoire: { icon: '🧠', color: categoryColors.memoire, label: 'Mémoire' },
};

// Mapping des catégories du registry vers GameCategory
export const mapRegistryCategory = (registryCategory: string): GameCategory | undefined => {
  const mapping: Record<string, GameCategory> = {
    logic: 'logique',
    math: 'chiffres',
    memory: 'memoire',
    language: 'mots',
    spatial: 'logique', // spatial → logique (puzzles, formes)
  };
  return mapping[registryCategory];
};

// ========================================
// COMPOSANTS
// ========================================

/**
 * ProgressBar - Barre de progression avec 4 segments
 */
export const ProgressBar = memo(({
  progress,
  showIndicator = true
}: {
  progress: number;
  showIndicator?: boolean
}) => (
  <View style={styles.progressContainer}>
    {showIndicator && (
      <View style={styles.progressIndicator}>
        <Svg width={20} height={12} viewBox="0 0 20 12">
          <Path d="M10 12L0 0h20L10 12z" fill="#2B7CE9" />
        </Svg>
      </View>
    )}
    <View style={styles.progressBar}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.progressSegment,
            i < progress && styles.progressSegmentFilled,
          ]}
        />
      ))}
    </View>
  </View>
));
ProgressBar.displayName = 'ProgressBar';

/**
 * ActionButton - Bouton d'action animé (play, favorite, add)
 * Touch target: 64dp (conformité guidelines UX enfant)
 */
export const ActionButton = memo(({
  type,
  isFavorite,
  onPress,
}: {
  type: 'play' | 'favorite' | 'add';
  isFavorite?: boolean;
  onPress?: () => void;
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderIcon = () => {
    switch (type) {
      case 'play':
        return (
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <Path d="M8 5v14l11-7z" fill="#2B7CE9" />
          </Svg>
        );
      case 'favorite':
        return (
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={isFavorite ? '#E91E63' : 'none'}
              stroke={isFavorite ? '#E91E63' : '#2B7CE9'}
              strokeWidth={2}
            />
          </Svg>
        );
      case 'add':
        return (
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#2B7CE9" />
          </Svg>
        );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.actionButtonPressable}
      accessibilityRole="button"
      accessibilityLabel={
        type === 'play' ? 'Jouer' :
        type === 'favorite' ? (isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris') :
        'Ajouter'
      }
    >
      <Animated.View style={[styles.actionButton, animatedStyle]}>
        {renderIcon()}
      </Animated.View>
    </Pressable>
  );
});
ActionButton.displayName = 'ActionButton';

/**
 * MedalBadge - Badge de médaille avec gradient
 */
export const MedalBadge = memo(({ progress }: { progress: number }) => {
  const medal = getMedalFromProgress(progress);
  const config = medalConfig[medal];

  return (
    <LinearGradient
      colors={config.gradient as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.medalBadge}
    >
      <View style={styles.iconWrapper}>
        <Text style={styles.medalIcon}>{config.icon}</Text>
      </View>
      <Text style={[styles.medalLabel, { color: config.textColor }]}>{config.label}</Text>
    </LinearGradient>
  );
});
MedalBadge.displayName = 'MedalBadge';

/**
 * CategoryBadge - Badge de catégorie coloré
 */
export const CategoryBadge = memo(({ category }: { category: GameCategory }) => {
  const config = categoryConfig[category];

  return (
    <View style={[styles.categoryBadge, { backgroundColor: config.color }]}>
      <Text style={styles.categoryIcon}>{config.icon}</Text>
      <Text style={styles.categoryLabel}>{config.label}</Text>
    </View>
  );
});
CategoryBadge.displayName = 'CategoryBadge';
