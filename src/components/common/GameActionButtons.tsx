/**
 * GameActionButtons Component
 *
 * Boutons d'action unifiés pour les écrans de jeu (victoire, pause, etc.)
 * Touch targets 64dp minimum conformes aux guidelines enfants
 *
 * @example
 * // Boutons de victoire avec niveau suivant
 * <GameActionButtons
 *   variant="victory"
 *   hasNextLevel={true}
 *   onNextLevel={() => goNext()}
 *   onReplay={() => reset()}
 *   onHome={() => goHome()}
 * />
 *
 * // Boutons flottants pendant le jeu
 * <GameActionButtons
 *   variant="floating"
 *   onReset={() => reset()}
 *   onHint={() => showHint()}
 *   hintsRemaining={3}
 * />
 */

import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  FadeInDown,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { colors, shadows, spacing, borderRadius, fontFamily } from '@/theme';

// Types
type ButtonVariant = 'victory' | 'floating' | 'pause';

interface GameActionButtonsProps {
  /** Variante d'affichage */
  variant?: ButtonVariant;

  // Props pour variant 'victory'
  /** Y a-t-il un niveau suivant ? */
  hasNextLevel?: boolean;
  /** Callback niveau suivant */
  onNextLevel?: () => void;
  /** Callback rejouer */
  onReplay?: () => void;
  /** Callback retour accueil */
  onHome?: () => void;

  // Props pour variant 'floating'
  /** Callback reset/recommencer */
  onReset?: () => void;
  /** Callback indice */
  onHint?: () => void;
  /** Nombre d'indices restants */
  hintsRemaining?: number;
  /** Désactiver le bouton indice */
  hintDisabled?: boolean;

  /** Visibilité */
  visible?: boolean;
  /** Désactiver les retours haptiques */
  disableHaptics?: boolean;
  /** Délai d'animation d'entrée (ms) */
  enterDelay?: number;
}

// Constantes
const BUTTON_SIZE = 64;

const COLORS = {
  primary: {
    gradient: ['#5B8DEE', '#4A7BD9'] as [string, string],
    shadow: '#5B8DEE',
  },
  secondary: {
    background: '#F5F5F5',
    text: '#4A4A4A',
  },
  reset: {
    background: 'rgba(255, 255, 255, 0.95)',
    icon: '#5B8DEE',
  },
  hint: {
    gradient: ['#FFB347', '#FFA020'] as [string, string],
    haloColor: 'rgba(255, 179, 71, 0.3)',
  },
  disabled: {
    background: '#CCCCCC',
  },
};

// Helper pour haptics
const triggerHaptic = (type: 'light' | 'medium', disabled?: boolean) => {
  if (Platform.OS === 'web' || disabled) return;
  Haptics.impactAsync(
    type === 'light'
      ? Haptics.ImpactFeedbackStyle.Light
      : Haptics.ImpactFeedbackStyle.Medium
  );
};

// Composant AnimatedPressable
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Boutons de victoire : Next Level, Replay, Home
 */
function VictoryButtons({
  hasNextLevel,
  onNextLevel,
  onReplay,
  onHome,
  disableHaptics,
  enterDelay = 2200,
}: Omit<GameActionButtonsProps, 'variant'>) {
  const handlePress = (callback?: () => void) => {
    triggerHaptic('medium', disableHaptics);
    callback?.();
  };

  return (
    <Animated.View entering={FadeInDown.delay(enterDelay)} style={styles.victoryContainer}>
      {/* Bouton principal : Niveau suivant */}
      {hasNextLevel && onNextLevel && (
        <Pressable
          onPress={() => handlePress(onNextLevel)}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={COLORS.primary.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryButtonText}>🚀</Text>
            <Text style={styles.primaryButtonText}>Niveau suivant</Text>
          </LinearGradient>
        </Pressable>
      )}

      {/* Boutons secondaires : Replay + Home */}
      <View style={styles.secondaryRow}>
        {onReplay && (
          <Pressable
            onPress={() => handlePress(onReplay)}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.secondaryInner}>
              <Text style={styles.secondaryButtonText}>🔄</Text>
              <Text style={styles.secondaryButtonText}>Rejouer</Text>
            </View>
          </Pressable>
        )}

        {onHome && (
          <Pressable
            onPress={() => handlePress(onHome)}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.secondaryInner}>
              <Text style={styles.secondaryButtonText}>🏠</Text>
              <Text style={styles.secondaryButtonText}>Accueil</Text>
            </View>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

/**
 * Boutons flottants : Reset + Hint
 */
function FloatingButtons({
  onReset,
  onHint,
  hintsRemaining = 3,
  hintDisabled = false,
  visible = true,
  disableHaptics,
}: Omit<GameActionButtonsProps, 'variant'>) {
  // Animations
  const resetScale = useSharedValue(1);
  const hintScale = useSharedValue(1);
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.3);

  const isHintDisabled = hintDisabled || hintsRemaining <= 0;

  // Animation halo pour le bouton indice
  useEffect(() => {
    if (!isHintDisabled) {
      haloScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.4, { duration: 1000, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );
      haloOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      haloScale.value = withTiming(1, { duration: 200 });
      haloOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isHintDisabled]);

  const handleResetPress = () => {
    resetScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );
    triggerHaptic('light', disableHaptics);
    onReset?.();
  };

  const handleHintPress = () => {
    if (isHintDisabled) return;

    hintScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15 })
    );
    triggerHaptic('medium', disableHaptics);
    onHint?.();
  };

  // Styles animés
  const resetStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resetScale.value }],
  }));

  const hintStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.floatingContainer}>
      {/* Bouton Reset - Gauche */}
      {onReset && (
        <AnimatedPressable
          onPress={handleResetPress}
          style={[styles.floatingButton, styles.resetButton, resetStyle]}
        >
          <Text style={styles.resetIcon}>↻</Text>
        </AnimatedPressable>
      )}

      {/* Bouton Hint - Droite avec halo */}
      {onHint && (
        <View style={styles.hintContainer}>
          {!isHintDisabled && (
            <Animated.View style={[styles.halo, haloStyle]} />
          )}

          <AnimatedPressable
            onPress={handleHintPress}
            disabled={isHintDisabled}
            style={[styles.floatingButton, hintStyle]}
          >
            {isHintDisabled ? (
              <View style={[styles.hintButtonInner, styles.hintButtonDisabled]}>
                <Text style={styles.hintIcon}>💡</Text>
              </View>
            ) : (
              <LinearGradient
                colors={COLORS.hint.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hintButtonInner}
              >
                <Text style={styles.hintIcon}>💡</Text>
                {hintsRemaining < 99 && (
                  <View style={styles.hintBadge}>
                    <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
                  </View>
                )}
              </LinearGradient>
            )}
          </AnimatedPressable>
        </View>
      )}
    </View>
  );
}

/**
 * Composant principal GameActionButtons
 */
export function GameActionButtons({
  variant = 'victory',
  ...props
}: GameActionButtonsProps) {
  switch (variant) {
    case 'victory':
      return <VictoryButtons {...props} />;
    case 'floating':
      return <FloatingButtons {...props} />;
    case 'pause':
      // Réutilise VictoryButtons avec des labels différents si besoin
      return <VictoryButtons {...props} />;
    default:
      return <VictoryButtons {...props} />;
  }
}

const styles = StyleSheet.create({
  // Victory Buttons
  victoryContainer: {
    gap: 12,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  primaryButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: COLORS.primary.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    minHeight: BUTTON_SIZE,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.secondary.background,
    minHeight: BUTTON_SIZE,
  },
  secondaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.secondary.text,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  // Floating Buttons
  floatingContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    zIndex: 100,
  },
  floatingButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: COLORS.reset.background,
    ...shadows.lg,
  },
  resetIcon: {
    fontSize: 28,
    color: COLORS.reset.icon,
  },
  hintContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.hint.haloColor,
  },
  hintButtonInner: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  hintButtonDisabled: {
    backgroundColor: COLORS.disabled.background,
  },
  hintIcon: {
    fontSize: 28,
  },
  hintBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  hintBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default GameActionButtons;
