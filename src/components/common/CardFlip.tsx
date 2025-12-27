/**
 * CardFlip Component
 *
 * Animation de retournement de carte 3D avec Reanimated
 * Utilisable pour les cartes collectibles, les cartes mémoire, etc.
 *
 * @example
 * // Flip automatique après délai
 * <CardFlip
 *   frontContent={<MyCardFront />}
 *   backContent={<MyCardBack />}
 *   autoFlip
 *   flipDelay={1200}
 * />
 *
 * // Flip contrôlé
 * <CardFlip
 *   frontContent={<MyCardFront />}
 *   backContent={<MyCardBack />}
 *   isFlipped={showFront}
 *   onFlipComplete={() => console.log('Flipped!')}
 * />
 */

import { ReactNode, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { shadows, borderRadius } from '@/theme';

// Types
type CardSize = 'small' | 'medium' | 'large' | 'custom';

interface CardDimensions {
  width: number;
  height: number;
}

interface CardFlipProps {
  /** Contenu de la face avant */
  frontContent: ReactNode;
  /** Contenu de la face arrière */
  backContent: ReactNode;
  /** Taille prédéfinie de la carte */
  size?: CardSize;
  /** Dimensions personnalisées (si size='custom') */
  customDimensions?: CardDimensions;
  /** Flip automatique après un délai */
  autoFlip?: boolean;
  /** Délai avant le flip auto (ms) */
  flipDelay?: number;
  /** Durée de l'animation de flip (ms) */
  flipDuration?: number;
  /** État contrôlé : true = face avant visible */
  isFlipped?: boolean;
  /** Callback quand le flip est terminé */
  onFlipComplete?: () => void;
  /** Rendre la carte cliquable pour flipper */
  pressToFlip?: boolean;
  /** Style du conteneur */
  style?: ViewStyle;
  /** Désactiver les ombres */
  disableShadow?: boolean;
}

// Dimensions prédéfinies
const SIZE_DIMENSIONS: Record<Exclude<CardSize, 'custom'>, CardDimensions> = {
  small: { width: 120, height: 170 },
  medium: { width: 180, height: 250 },
  large: { width: 240, height: 340 },
};

export function CardFlip({
  frontContent,
  backContent,
  size = 'medium',
  customDimensions,
  autoFlip = true,
  flipDelay = 1200,
  flipDuration = 800,
  isFlipped: controlledFlipped,
  onFlipComplete,
  pressToFlip = false,
  style,
  disableShadow = false,
}: CardFlipProps) {
  // Dimensions de la carte
  const dimensions = size === 'custom' && customDimensions
    ? customDimensions
    : SIZE_DIMENSIONS[size as Exclude<CardSize, 'custom'>];

  // État d'animation : 0 = dos visible, 180 = face visible
  const rotateY = useSharedValue(0);

  // Flip automatique au montage
  useEffect(() => {
    if (autoFlip && controlledFlipped === undefined) {
      rotateY.value = withDelay(
        flipDelay,
        withTiming(180, {
          duration: flipDuration,
          easing: Easing.inOut(Easing.ease),
        }, (finished) => {
          if (finished && onFlipComplete) {
            runOnJS(onFlipComplete)();
          }
        })
      );
    }
  }, [autoFlip, flipDelay, flipDuration]);

  // Flip contrôlé
  useEffect(() => {
    if (controlledFlipped !== undefined) {
      rotateY.value = withTiming(controlledFlipped ? 180 : 0, {
        duration: flipDuration,
        easing: Easing.inOut(Easing.ease),
      }, (finished) => {
        if (finished && onFlipComplete) {
          runOnJS(onFlipComplete)();
        }
      });
    }
  }, [controlledFlipped, flipDuration]);

  // Handler pour press-to-flip
  const handlePress = () => {
    if (!pressToFlip) return;

    const newValue = rotateY.value < 90 ? 180 : 0;
    rotateY.value = withTiming(newValue, {
      duration: flipDuration,
      easing: Easing.inOut(Easing.ease),
    }, (finished) => {
      if (finished && onFlipComplete) {
        runOnJS(onFlipComplete)();
      }
    });
  };

  // Style animé de la face avant
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 90, 180], [0, 90, 180]);
    const opacityValue = interpolate(rotateY.value, [0, 89, 91, 180], [0, 0, 1, 1]);

    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: opacityValue,
    };
  });

  // Style animé de la face arrière
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 90, 180], [180, 90, 0]);
    const opacityValue = interpolate(rotateY.value, [0, 89, 91, 180], [1, 1, 0, 0]);

    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: opacityValue,
    };
  });

  const cardFaceStyle = [
    styles.cardFace,
    {
      width: dimensions.width,
      height: dimensions.height,
    },
    !disableShadow && styles.cardShadow,
  ];

  const content = (
    <View style={[styles.container, { width: dimensions.width, height: dimensions.height }, style]}>
      {/* Face arrière (initialement visible) */}
      <Animated.View style={[cardFaceStyle, backAnimatedStyle]}>
        {backContent}
      </Animated.View>

      {/* Face avant (initialement cachée) */}
      <Animated.View style={[cardFaceStyle, styles.cardFront, frontAnimatedStyle]}>
        {frontContent}
      </Animated.View>
    </View>
  );

  if (pressToFlip) {
    return (
      <Pressable onPress={handlePress}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
  },
  cardFace: {
    borderRadius: borderRadius.xl,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  cardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardShadow: {
    ...shadows.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});

export default CardFlip;
