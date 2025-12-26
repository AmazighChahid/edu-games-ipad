/**
 * AudioPlayer Component
 *
 * Lecteur audio pour les histoires du Conteur Curieux
 * - Play/Pause avec icône animée
 * - Barre de progression
 * - Affichage du temps
 * - Vitesse de lecture (optionnel)
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, shadows, fontFamily } from '@/theme';

interface AudioPlayerProps {
  /** Durée totale en secondes */
  duration: number;
  /** Position actuelle en secondes */
  currentTime: number;
  /** État de lecture */
  isPlaying: boolean;
  /** Callback play/pause */
  onPlayPause: () => void;
  /** Callback seek (position en secondes) */
  onSeek?: (time: number) => void;
  /** Taille compacte */
  compact?: boolean;
  /** Désactiver le lecteur */
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Formate le temps en mm:ss
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer({
  duration,
  currentTime,
  isPlaying,
  onPlayPause,
  onSeek,
  compact = false,
  disabled = false,
}: AudioPlayerProps) {
  const buttonScale = useSharedValue(1);
  const progressWidth = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Animation du bouton
  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  }, []);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 12, stiffness: 150 });
  }, []);

  const handlePlayPause = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlayPause();
  }, [disabled, onPlayPause]);

  // Style animé du bouton
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Gestion du tap sur la barre de progression
  const handleProgressPress = useCallback(
    (event: any) => {
      if (!onSeek || disabled || duration <= 0) return;

      const { locationX } = event.nativeEvent;
      const progressBarWidth = event.target.offsetWidth || 200;
      const percentage = Math.max(0, Math.min(1, locationX / progressBarWidth));
      const newTime = percentage * duration;

      Haptics.selectionAsync();
      onSeek(newTime);
    },
    [onSeek, disabled, duration]
  );

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <AnimatedPressable
          style={[styles.playButtonCompact, buttonAnimatedStyle, disabled && styles.disabled]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePlayPause}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Lecture'}
        >
          <Text style={styles.playIconCompact}>{isPlaying ? '⏸️' : '▶️'}</Text>
        </AnimatedPressable>

        <View style={styles.progressBarCompact}>
          <View style={[styles.progressFillCompact, { width: `${progressWidth}%` }]} />
        </View>

        <Text style={styles.timeTextCompact}>
          {formatTime(currentTime)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Play/Pause button */}
      <AnimatedPressable
        style={[styles.playButton, buttonAnimatedStyle, disabled && styles.disabled]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePlayPause}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause' : 'Lecture'}
      >
        <View style={styles.playIconContainer}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        </View>
      </AnimatedPressable>

      {/* Progress section */}
      <View style={styles.progressSection}>
        {/* Progress bar */}
        <Pressable
          style={styles.progressBarContainer}
          onPress={handleProgressPress}
          accessibilityRole="adjustable"
          accessibilityLabel={`Progression: ${formatTime(currentTime)} sur ${formatTime(duration)}`}
        >
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: `${progressWidth}%` }]}
            />
            {/* Knob */}
            <View
              style={[
                styles.progressKnob,
                { left: `${progressWidth}%` },
              ]}
            />
          </View>
        </Pressable>

        {/* Time display */}
        <View style={styles.timeContainer}>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.duration}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full size container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    gap: spacing[4],
    ...shadows.md,
  },

  // Play button
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    shadowColor: '#9B59B6',
  },
  playIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 28,
  },

  // Progress section
  progressSection: {
    flex: 1,
    gap: spacing[2],
  },
  progressBarContainer: {
    height: 24,
    justifyContent: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'visible',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#9B59B6',
    borderRadius: 3,
  },
  progressKnob: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#9B59B6',
    marginLeft: -8,
    ...shadows.sm,
  },

  // Time display
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentTime: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: '#2D3748',
  },
  duration: {
    fontSize: 14,
    color: '#718096',
  },

  // Compact version
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  playButtonCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconCompact: {
    fontSize: 18,
  },
  progressBarCompact: {
    flex: 1,
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillCompact: {
    height: '100%',
    backgroundColor: '#9B59B6',
    borderRadius: 2,
  },
  timeTextCompact: {
    fontSize: 12,
    color: '#718096',
    minWidth: 40,
    textAlign: 'right',
  },

  // States
  disabled: {
    opacity: 0.5,
  },
});

export default AudioPlayer;
