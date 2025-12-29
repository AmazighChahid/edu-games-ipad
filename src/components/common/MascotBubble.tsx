/**
 * MascotBubble Component
 *
 * Bulle de dialogue style panneau bois pour les mascottes.
 * Cohérente avec le thème Forêt Magique de l'application.
 *
 * @example
 * // Usage basique
 * <MascotBubble
 *   message="Bonjour ! Prêt à jouer ?"
 *   buttonText="C'est parti !"
 *   onPress={() => navigation.navigate('Games')}
 * />
 *
 * // Avec highlights et décorations
 * <MascotBubble
 *   message={
 *     <>
 *       Tu es à <Text style={bubbleTextStyles.highlightOrange}>2 niveaux</Text> du rang{' '}
 *       <Text style={bubbleTextStyles.highlightGold}>Or</Text> !
 *     </>
 *   }
 *   buttonText="C'est parti !"
 *   buttonIcon="🎯"
 *   onPress={handleStart}
 *   showDecorations={true}
 *   showSparkles={true}
 * />
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  SlideInLeft,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, fontFamily, fontSize, touchTargets, homeLayout } from '../../theme';
import { useStore } from '../../store';

// ============================================================================
// TYPES
// ============================================================================

type TailPosition = 'left' | 'right' | 'bottom' | 'top';
type ButtonVariant = 'orange' | 'blue' | 'green';

export interface MascotBubbleProps {
  /** Message à afficher (peut contenir des React.ReactNode pour highlights) */
  message: React.ReactNode;
  /** Texte du bouton CTA (optionnel - si absent, pas de bouton) */
  buttonText?: string;
  /** Icône emoji du bouton (optionnel) */
  buttonIcon?: string;
  /** Callback au press du bouton (optionnel) */
  onPress?: () => void;
  /** Variante de couleur du bouton */
  buttonVariant?: ButtonVariant;
  /** Afficher les décorations (gland, champignon, feuille) */
  showDecorations?: boolean;
  /** Afficher les sparkles animés */
  showSparkles?: boolean;
  /** Position de la flèche/queue */
  tailPosition?: TailPosition;
  /** Masquer la flèche */
  hideTail?: boolean;
  /** Largeur maximale de la bulle */
  maxWidth?: number;
  /** Style container additionnel */
  style?: ViewStyle;
  /** Désactiver l'animation d'entrée */
  disableEnterAnimation?: boolean;
  /** Accessible label personnalisé */
  accessibilityLabel?: string;
  /** Activer l'effet de frappe progressive (typewriter) - uniquement pour message string */
  typing?: boolean;
  /** Vitesse de frappe en ms par caractère */
  typingSpeed?: number;
  /** Callback appelé quand la frappe est terminée */
  onTypingComplete?: () => void;
}

// ============================================================================
// COULEURS WOOD THEME
// ============================================================================

const WOOD_COLORS = {
  // Fond bulle
  background: '#FFF9F0',
  backgroundGradientEnd: '#FFF5E6',
  // Bordure bois
  border: '#C9A86C',
  // Ombre 3D bois
  shadow: '#A68B5B',
  // Boutons
  button: {
    orange: {
      bg: '#FFB347',
      shadow: '#D07800',
    },
    blue: {
      bg: '#5B8DEE',
      shadow: '#3A68C0',
    },
    green: {
      bg: '#7BC74D',
      shadow: '#5FB030',
    },
  },
  // Texte
  text: '#2D3748',
  textHighlight: {
    orange: '#FFB347',
    gold: '#D4A017',
    blue: '#5B8DEE',
  },
} as const;

// ============================================================================
// ANIMATION CONFIGS
// ============================================================================

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

const BUTTON_SPRING_IN = {
  damping: 15,
  stiffness: 300,
};

const BUTTON_SPRING_OUT = {
  damping: 12,
  stiffness: 200,
};

// ============================================================================
// ANIMATED PRESSABLE
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================================================
// COMPONENT
// ============================================================================

export function MascotBubble({
  message,
  buttonText,
  buttonIcon,
  onPress,
  buttonVariant = 'orange',
  showDecorations = true,
  showSparkles = false,
  tailPosition = 'left',
  hideTail = false,
  maxWidth = 380,
  style,
  disableEnterAnimation = false,
  accessibilityLabel,
  typing = false,
  typingSpeed = 25,
  onTypingComplete,
}: MascotBubbleProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);

  // Typewriter state (uniquement pour messages string)
  const [displayedText, setDisplayedText] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const isStringMessage = typeof message === 'string';

  // Effet de frappe progressive (typewriter)
  useEffect(() => {
    if (!typing || !isStringMessage || !message) {
      // Si pas de typing ou message non-string, afficher directement
      if (isStringMessage) {
        setDisplayedText(message as string);
      }
      return;
    }

    const msgString = message as string;

    // Skip si le message n'a pas changé
    if (msgString === lastMessage && displayedText.length > 0) return;

    setLastMessage(msgString);
    setDisplayedText('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < msgString.length) {
        setDisplayedText(msgString.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        onTypingComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [message, typing, typingSpeed, isStringMessage]);

  // Animation values
  const buttonScale = useSharedValue(1);
  const buttonTranslateY = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0.4);
  const sparkleScale = useSharedValue(0.8);

  // Sparkles animation loop
  useEffect(() => {
    if (showSparkles) {
      sparkleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.4, { duration: 1000 })
        ),
        -1,
        true
      );

      sparkleScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(0.8, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [showSparkles]);

  // Button animation styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { translateY: buttonTranslateY.value },
    ],
  }));

  // Sparkle animation styles
  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [{ scale: sparkleScale.value }],
  }));

  // Handlers
  const handlePressIn = () => {
    buttonScale.value = withSpring(0.97, BUTTON_SPRING_IN);
    buttonTranslateY.value = withSpring(2, BUTTON_SPRING_IN);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, BUTTON_SPRING_OUT);
    buttonTranslateY.value = withSpring(0, BUTTON_SPRING_OUT);
  };

  const handlePress = () => {
    if (!onPress) return;
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  // Button colors based on variant
  const buttonColors = WOOD_COLORS.button[buttonVariant];

  // Tail position styles
  const getTailStyles = (): { outer: ViewStyle; inner: ViewStyle } => {
    const baseOuter: ViewStyle = {
      position: 'absolute',
      width: 0,
      height: 0,
    };

    const baseInner: ViewStyle = {
      position: 'absolute',
      width: 0,
      height: 0,
      zIndex: 2,
    };

    switch (tailPosition) {
      case 'left':
        return {
          outer: {
            ...baseOuter,
            left: -14,
            top: 40,
            borderTopWidth: 14,
            borderBottomWidth: 14,
            borderRightWidth: 14,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderRightColor: WOOD_COLORS.border,
          },
          inner: {
            ...baseInner,
            left: -8,
            top: 44,
            borderTopWidth: 10,
            borderBottomWidth: 10,
            borderRightWidth: 10,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderRightColor: WOOD_COLORS.background,
          },
        };
      case 'right':
        return {
          outer: {
            ...baseOuter,
            right: -14,
            top: 40,
            borderTopWidth: 14,
            borderBottomWidth: 14,
            borderLeftWidth: 14,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: WOOD_COLORS.border,
          },
          inner: {
            ...baseInner,
            right: -8,
            top: 44,
            borderTopWidth: 10,
            borderBottomWidth: 10,
            borderLeftWidth: 10,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: WOOD_COLORS.background,
          },
        };
      case 'bottom':
        return {
          outer: {
            ...baseOuter,
            bottom: -14,
            left: '50%',
            marginLeft: -14,
            borderLeftWidth: 14,
            borderRightWidth: 14,
            borderTopWidth: 14,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: WOOD_COLORS.border,
          },
          inner: {
            ...baseInner,
            bottom: -8,
            left: '50%',
            marginLeft: -10,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: WOOD_COLORS.background,
          },
        };
      case 'top':
        return {
          outer: {
            ...baseOuter,
            top: -14,
            left: '50%',
            marginLeft: -14,
            borderLeftWidth: 14,
            borderRightWidth: 14,
            borderBottomWidth: 14,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: WOOD_COLORS.border,
          },
          inner: {
            ...baseInner,
            top: -8,
            left: '50%',
            marginLeft: -10,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderBottomWidth: 10,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: WOOD_COLORS.background,
          },
        };
      default:
        return { outer: baseOuter, inner: baseInner };
    }
  };

  const tailStyles = getTailStyles();

  // Entering animation
  const enteringAnimation = disableEnterAnimation
    ? undefined
    : SlideInLeft.springify()
        .damping(SPRING_CONFIG.damping)
        .stiffness(SPRING_CONFIG.stiffness);

  return (
    <Animated.View
      entering={enteringAnimation}
      style={[styles.container, { maxWidth }, style]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      {/* Tail / Arrow */}
      {!hideTail && (
        <>
          <View style={tailStyles.outer} />
          <View style={tailStyles.inner} />
        </>
      )}

      {/* Decorations */}
      {showDecorations && (
        <>
          <Text style={styles.decoAcorn}>🌰</Text>
          <Text style={styles.decoMushroom}>🍄</Text>
          <Text style={styles.decoLeaf}>🍃</Text>
        </>
      )}

      {/* Sparkles */}
      {showSparkles && (
        <>
          <Animated.Text style={[styles.sparkle, styles.sparkle1, sparkleAnimatedStyle]}>
            ✨
          </Animated.Text>
          <Animated.Text style={[styles.sparkle, styles.sparkle2, sparkleAnimatedStyle]}>
            ⭐
          </Animated.Text>
        </>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.messageText, !buttonText && styles.messageTextNoButton]}>
          {typing && isStringMessage ? displayedText : message}
        </Text>

        {buttonText && onPress && (
          <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[
              styles.button,
              {
                backgroundColor: buttonColors.bg,
                shadowColor: buttonColors.shadow,
              },
              buttonAnimatedStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel={buttonText}
            accessibilityHint="Appuie pour continuer"
          >
            {buttonIcon && <Text style={styles.buttonIcon}>{buttonIcon}</Text>}
            <Text style={styles.buttonText}>{buttonText}</Text>
          </AnimatedPressable>
        )}
      </View>
    </Animated.View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: WOOD_COLORS.background,
    paddingVertical: spacing[6],
    paddingHorizontal: homeLayout.headerPadding, // 28
    borderRadius: borderRadius.xl,
    borderWidth: 4,
    borderColor: WOOD_COLORS.border,
    // Ombre 3D bois - pas de blur pour effet plat
    shadowColor: WOOD_COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },

  // Decorations
  decoAcorn: {
    position: 'absolute',
    top: -20,
    left: 24,
    fontSize: 28,
    transform: [{ rotate: '-15deg' }],
  },
  decoMushroom: {
    position: 'absolute',
    bottom: -16,
    right: 28,
    fontSize: 26,
  },
  decoLeaf: {
    position: 'absolute',
    top: -14,
    right: 40,
    fontSize: 22,
    transform: [{ rotate: '20deg' }],
  },

  // Sparkles
  sparkle: {
    position: 'absolute',
    fontSize: 18,
  },
  sparkle1: {
    top: -30,
    right: 10,
  },
  sparkle2: {
    top: 20,
    right: -25,
  },

  // Content
  content: {
    position: 'relative',
    zIndex: 2,
  },
  messageText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg, // 18 - minimum pour enfants
    color: WOOD_COLORS.text,
    lineHeight: 27, // 1.5 × 18
    marginBottom: spacing[4],
  },
  messageTextNoButton: {
    marginBottom: 0,
  },

  // Button
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: homeLayout.headerPadding, // 28
    borderRadius: borderRadius.round,
    minHeight: touchTargets.minimum, // 64dp minimum pour enfants
    // Ombre 3D pressable
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// ============================================================================
// HELPER STYLES FOR MESSAGE HIGHLIGHTS
// ============================================================================

/**
 * Styles pour les highlights dans le message
 * @example
 * <MascotBubble
 *   message={
 *     <>
 *       Tu es à <Text style={bubbleTextStyles.highlightOrange}>2 niveaux</Text>
 *       du rang <Text style={bubbleTextStyles.highlightGold}>Or</Text> !
 *     </>
 *   }
 *   ...
 * />
 */
export const bubbleTextStyles = StyleSheet.create({
  highlightOrange: {
    color: WOOD_COLORS.textHighlight.orange,
    fontWeight: '800',
  },
  highlightGold: {
    color: WOOD_COLORS.textHighlight.gold,
    fontWeight: '800',
  },
  highlightBlue: {
    color: WOOD_COLORS.textHighlight.blue,
    fontWeight: '800',
  },
});

export default MascotBubble;
