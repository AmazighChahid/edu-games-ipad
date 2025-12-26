/**
 * ActionButtons Component
 * Three action buttons: Next Level, Replay, Home
 */

import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface ActionButtonsProps {
  hasNextLevel: boolean;
  onNextLevel?: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export function ActionButtons({
  hasNextLevel,
  onNextLevel,
  onReplay,
  onHome,
}: ActionButtonsProps) {
  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    callback();
  };

  return (
    <Animated.View entering={FadeInDown.delay(2200)} style={styles.container}>
      {/* Primary Button: Next Level or Replay */}
      {hasNextLevel && onNextLevel ? (
        <Pressable
          onPress={() => handlePress(onNextLevel)}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={['#5B8DEE', '#4A7BD9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.primaryButtonText}>🚀</Text>
            <Text style={styles.primaryButtonText}>Niveau suivant</Text>
          </LinearGradient>
        </Pressable>
      ) : null}

      {/* Secondary Buttons Row */}
      <View style={styles.secondaryRow}>
        {/* Replay Button */}
        <Pressable
          onPress={() => handlePress(onReplay)}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <View style={styles.secondaryGradient}>
            <Text style={styles.secondaryButtonText}>🔄</Text>
            <Text style={styles.secondaryButtonText}>Rejouer</Text>
          </View>
        </Pressable>

        {/* Home Button */}
        <Pressable
          onPress={() => handlePress(onHome)}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <View style={styles.secondaryGradient}>
            <Text style={styles.secondaryButtonText}>🏠</Text>
            <Text style={styles.secondaryButtonText}>Accueil</Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 64, // Accessibility: large touch target
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontFamily: 'Fredoka-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    minHeight: 64, // Accessibility: large touch target
  },
  secondaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
