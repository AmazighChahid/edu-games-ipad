/**
 * SpeechBubble Component
 *
 * Bulle de dialogue réutilisable pour les mascottes et assistants
 * Avec animation d'apparition et effet de "typing"
 *
 * @example
 * // Usage basique
 * <SpeechBubble message="Bonjour !" visible={true} />
 *
 * // Avec effet typing et callback
 * <SpeechBubble
 *   message="Bienvenue dans le jeu !"
 *   visible={true}
 *   typing={true}
 *   typingSpeed={30}
 *   onTypingComplete={() => console.log('Terminé')}
 * />
 *
 * // Position de la queue personnalisée
 * <SpeechBubble
 *   message="Je suis à gauche"
 *   tailPosition="left"
 *   colorScheme="game"
 * />
 */

import { useEffect, useState } from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { spacing, borderRadius, shadows, fontFamily, colors } from '@/theme';

// Types
type TailPosition = 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top';
type ColorScheme = 'default' | 'game' | 'conteur' | 'parent';

interface SpeechBubbleProps {
  /** Message à afficher */
  message: string;
  /** Afficher ou masquer la bulle */
  visible?: boolean;
  /** Position de la queue de la bulle */
  tailPosition?: TailPosition;
  /** Activer l'effet de frappe progressive */
  typing?: boolean;
  /** Vitesse de frappe en ms par caractère */
  typingSpeed?: number;
  /** Largeur maximale de la bulle */
  maxWidth?: number;
  /** Style personnalisé du conteneur */
  style?: ViewStyle;
  /** Callback appelé quand la frappe est terminée */
  onTypingComplete?: () => void;
  /** Schéma de couleurs */
  colorScheme?: ColorScheme;
}

// Schémas de couleurs prédéfinis
const COLOR_SCHEMES = {
  default: {
    bubble: colors.background.card,
    text: colors.text.primary,
    shadow: colors.ui.shadow,
  },
  game: {
    bubble: '#FFFFFF',
    text: colors.text.primary,
    shadow: colors.primary.main,
  },
  conteur: {
    bubble: '#FFFFFF',
    text: '#2D3748',
    shadow: '#9B59B6',
  },
  parent: {
    bubble: colors.parent.background,
    text: colors.text.primary,
    shadow: colors.ui.shadow,
  },
};

export function SpeechBubble({
  message,
  visible = true,
  tailPosition = 'bottom',
  typing = true,
  typingSpeed = 25,
  maxWidth = 280,
  style,
  onTypingComplete,
  colorScheme = 'default',
}: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [lastMessage, setLastMessage] = useState('');

  // Couleurs selon le schéma
  const colorConfig = COLOR_SCHEMES[colorScheme];

  // Valeurs d'animation
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Animation d'apparition de la bulle
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 150 });
    }
  }, [visible]);

  // Effet de frappe progressive
  useEffect(() => {
    if (!visible || message === lastMessage) return;

    setLastMessage(message);

    if (!typing) {
      setDisplayedText(message);
      onTypingComplete?.();
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        onTypingComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [message, visible, typing, typingSpeed, lastMessage, onTypingComplete]);

  // Style animé
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  // Styles de la queue selon sa position
  const getTailStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: colorConfig.bubble,
    };

    switch (tailPosition) {
      case 'bottom':
        return { ...baseStyle, bottom: -10, left: '50%', marginLeft: -10 };
      case 'bottom-left':
        return { ...baseStyle, bottom: -10, left: 24 };
      case 'bottom-right':
        return { ...baseStyle, bottom: -10, right: 24 };
      case 'left':
        return {
          ...baseStyle,
          left: -10,
          top: '50%',
          marginTop: -10,
          transform: [{ rotate: '-90deg' }],
        };
      case 'right':
        return {
          ...baseStyle,
          right: -10,
          top: '50%',
          marginTop: -10,
          transform: [{ rotate: '90deg' }],
        };
      case 'top':
        return {
          ...baseStyle,
          top: -10,
          left: '50%',
          marginLeft: -10,
          transform: [{ rotate: '180deg' }],
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          maxWidth,
          backgroundColor: colorConfig.bubble,
          shadowColor: colorConfig.shadow,
        },
        bubbleStyle,
        style,
      ]}
    >
      <Text style={[styles.text, { color: colorConfig.text }]}>
        {displayedText}
      </Text>
      <Animated.View style={getTailStyle()} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    ...shadows.lg,
    shadowOpacity: 0.15,
  },
  text: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    lineHeight: 24,
  },
});

export default SpeechBubble;
