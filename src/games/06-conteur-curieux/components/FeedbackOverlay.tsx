/**
 * FeedbackOverlay Component
 *
 * Overlay de feedback après une réponse
 * - Correct: Vert avec confettis et message positif
 * - Encourage: Orange avec message d'encouragement (JAMAIS rouge !)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, shadows, fontFamily } from '../../../theme';

type FeedbackType = 'correct' | 'encourage';

interface FeedbackOverlayProps {
  /** Type de feedback */
  type: FeedbackType;
  /** Message à afficher */
  message: string;
  /** Visible ou non */
  visible: boolean;
  /** Callback de fermeture */
  onClose: () => void;
  /** Message secondaire (explication) */
  explanation?: string;
  /** Auto-fermeture après X ms (0 = pas d'auto-fermeture) */
  autoCloseDelay?: number;
}

// Messages par défaut
const DEFAULT_MESSAGES: Record<FeedbackType, string[]> = {
  correct: [
    'Bravo ! 🎉',
    'Super ! 🌟',
    'Excellent ! ✨',
    'Génial ! 🎊',
    'Parfait ! 👏',
  ],
  encourage: [
    'Presque ! 💪',
    'Essaie encore ! 🌈',
    'Tu y es presque ! ⭐',
    'Continue ! 🚀',
    'Réfléchis bien ! 💡',
  ],
};

// Couleurs par type
const COLORS: Record<FeedbackType, { bg: string; accent: string; text: string }> = {
  correct: {
    bg: 'rgba(123,199,77,0.95)',
    accent: '#5BA836',
    text: '#FFFFFF',
  },
  encourage: {
    bg: 'rgba(255,179,71,0.95)',
    accent: '#E59400',
    text: '#2D3748',
  },
};

export function FeedbackOverlay({
  type,
  message,
  visible,
  onClose,
  explanation,
  autoCloseDelay = 2000,
}: FeedbackOverlayProps) {
  const { width: screenWidth } = useWindowDimensions();
  const scale = useSharedValue(0.8);
  const iconScale = useSharedValue(0);

  const colors = COLORS[type];
  const displayMessage = message || DEFAULT_MESSAGES[type][Math.floor(Math.random() * DEFAULT_MESSAGES[type].length)];

  // Animation d'entrée
  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (type === 'correct') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      // Animations
      scale.value = withSpring(1, { damping: 12, stiffness: 150 });
      iconScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8 }),
          withSpring(1, { damping: 12 })
        )
      );

      // Auto-close
      if (autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, type, autoCloseDelay]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.bg, maxWidth: Math.min(screenWidth * 0.9, 400) },
          containerStyle,
        ]}
        entering={ZoomIn.springify().damping(15)}
      >
        {/* Icon */}
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Text style={styles.icon}>
            {type === 'correct' ? '🎉' : '💡'}
          </Text>
        </Animated.View>

        {/* Message */}
        <Text style={[styles.message, { color: colors.text }]}>
          {displayMessage}
        </Text>

        {/* Explanation (if provided) */}
        {explanation && (
          <View style={styles.explanationContainer}>
            <Text style={[styles.explanation, { color: colors.text }]}>
              {explanation}
            </Text>
          </View>
        )}

        {/* Mini confetti for correct (simple version) */}
        {type === 'correct' && (
          <View style={styles.confettiContainer}>
            {['✨', '🌟', '⭐', '✨', '🌟'].map((emoji, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.confetti,
                  {
                    left: `${15 + index * 17}%`,
                    top: index % 2 === 0 ? '10%' : '80%',
                  },
                ]}
                entering={FadeIn.delay(300 + index * 100).duration(300)}
              >
                {emoji}
              </Animated.Text>
            ))}
          </View>
        )}

        {/* Close button */}
        <Pressable
          style={[styles.closeButton, { backgroundColor: colors.accent }]}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>
            {type === 'correct' ? 'Continuer' : 'Réessayer'}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    borderRadius: 24,
    padding: spacing[6],
    alignItems: 'center',
    ...shadows.xl,
    overflow: 'hidden',
  },

  // Icon
  iconContainer: {
    marginBottom: spacing[3],
  },
  icon: {
    fontSize: 60,
  },

  // Message
  message: {
    fontSize: 28,
    fontFamily: fontFamily.displayBold,
    textAlign: 'center',
    marginBottom: spacing[3],
  },

  // Explanation
  explanationContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  explanation: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Confetti (simple)
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    fontSize: 20,
  },

  // Close button
  closeButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
    minWidth: 140,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },
});

export default FeedbackOverlay;
