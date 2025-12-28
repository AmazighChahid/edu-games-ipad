/**
 * GameCardV10 - Widget style Edoki pour l'écran d'accueil
 * Design inspiré des widgets Edoki avec illustration thématique
 *
 * Refactorisé pour améliorer la maintenabilité:
 * - GameCardStyles.ts: Tous les styles
 * - GameCardComponents.tsx: ProgressBar, ActionButton, Badges
 * - GameCardIllustrations.tsx: Illustrations SVG
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { edokiWidgetThemes } from '../../theme/home-v10-colors';

// Imports depuis les fichiers refactorisés
import {
  styles,
  CARD_WIDTH,
  CARD_GAP,
  PARALLAX_FACTOR,
} from './GameCardStyles';
import {
  ActionButton,
  MedalBadge,
  CategoryBadge,
  mapRegistryCategory,
  GameCategory,
  MedalType,
} from './GameCardComponents';
import { illustrations, EdokiTheme } from './GameCardIllustrations';

// ========================================
// TYPES EXPORTÉS
// ========================================

export type { EdokiTheme, GameCategory, MedalType };
export { mapRegistryCategory };

interface GameCardV10Props {
  id: string;
  title: string;
  theme: EdokiTheme;
  progress: number; // 0-4 (détermine la médaille: 1=bronze, 2=argent, 3=or, 4=diamant)
  category?: GameCategory;
  isFavorite: boolean;
  isComingSoon?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
  // Parallaxe
  scrollX?: SharedValue<number>;
  index?: number;
}

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export const GameCardV10 = memo(({
  id: _id,
  title,
  theme,
  progress,
  category,
  isFavorite,
  isComingSoon = false,
  onPress,
  onToggleFavorite,
  scrollX,
  index = 0,
}: GameCardV10Props) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const themeConfig = edokiWidgetThemes[theme] || edokiWidgetThemes.barres;
  const Illustration = illustrations[theme];

  const handlePressIn = () => {
    scale.value = withSpring(1.02, { damping: 15, stiffness: 200 });
    translateY.value = withSpring(-8, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  // Style animé pour l'effet parallaxe sur l'illustration
  const parallaxStyle = useAnimatedStyle(() => {
    if (!scrollX) {
      return { transform: [{ translateX: 0 }] };
    }

    // Position de la carte dans le scroll
    const cardPosition = index * (CARD_WIDTH + CARD_GAP);

    // Calcul du décalage parallaxe
    const translateX = interpolate(
      scrollX.value,
      [cardPosition - CARD_WIDTH, cardPosition, cardPosition + CARD_WIDTH],
      [CARD_WIDTH * PARALLAX_FACTOR, 0, -CARD_WIDTH * PARALLAX_FACTOR],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const isLightTitle = themeConfig.titleColor === 'light';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Jouer à ${title}`}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Fond avec gradient ou couleur unie */}
        {themeConfig.gradient ? (
          <LinearGradient
            colors={themeConfig.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.background}
          />
        ) : (
          <View style={[styles.background, { backgroundColor: themeConfig.background }]} />
        )}

        {/* Illustration thématique avec effet parallaxe */}
        <Animated.View style={[styles.illustrationWrapper, styles.parallaxContainer, parallaxStyle]}>
          <Illustration />
        </Animated.View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              style={[
                styles.title,
                isLightTitle ? styles.titleLight : styles.titleDark,
              ]}
            >
              {title}
            </Text>
          </View>

          {/* Bouton favori uniquement */}
          {onToggleFavorite && (
            <ActionButton
              type="favorite"
              isFavorite={isFavorite}
              onPress={onToggleFavorite}
            />
          )}
        </View>

        {/* Badges en bas à gauche */}
        {!isComingSoon && (
          <View style={styles.badgesContainer}>
            <MedalBadge progress={progress} />
            {category && <CategoryBadge category={category} />}
          </View>
        )}

        {/* Overlay grisé + filigrane Coming Soon */}
        {isComingSoon && (
          <View style={styles.comingSoonOverlay}>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>BIENTÔT</Text>
            </View>
          </View>
        )}

      </Animated.View>
    </Pressable>
  );
});

GameCardV10.displayName = 'GameCardV10';

export default GameCardV10;
