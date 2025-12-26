import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { AISuggestion as AISuggestionType } from '../../types/games';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TEXT_STYLES, TYPOGRAPHY } from '../../constants/typography';

interface AISuggestionProps extends AISuggestionType {
  onAccept: () => void;
}

export const AISuggestion: React.FC<AISuggestionProps> = ({ suggestedGame, onAccept }) => {
  const buttonScale = useSharedValue(1);
  const buttonPressScale = useSharedValue(1);

  useEffect(() => {
    // Pulsation douce du bouton
    buttonScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value * buttonPressScale.value }],
  }));

  const handlePressIn = () => {
    buttonPressScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    buttonPressScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>Piou te conseille</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <LinearGradient
          colors={[COLORS.bgSpatial, COLORS.bgSpatialDark]}
          style={styles.iconContainer}
        >
          <Text style={styles.icon}>{suggestedGame.icon}</Text>
        </LinearGradient>

        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {suggestedGame.reason}{' '}
            <Text style={styles.textBold}>{suggestedGame.name}</Text> pour un nouveau défi !
          </Text>
        </View>
      </View>

      {/* Bouton CTA */}
      <Pressable
        onPress={onAccept}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible
        accessibilityLabel={`Essayer ${suggestedGame.name}`}
        accessibilityRole="button"
      >
        <Animated.View style={buttonAnimatedStyle}>
          <LinearGradient
            colors={[COLORS.accent, '#C840E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>C'est parti ! 🚀</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.radiusXl,
    padding: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  emoji: {
    fontSize: 24, // HTML: 22px, augmenté pour visibilité
  },
  title: {
    ...TEXT_STYLES.button,
    color: COLORS.textDark,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32, // HTML: 28px, augmenté pour meilleure visibilité
  },
  textContainer: {
    flex: 1,
  },
  text: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textDark,
  },
  textBold: {
    fontWeight: TYPOGRAPHY.weightBold,
    color: COLORS.accent,
  },
  button: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: SPACING.radiusMd,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    ...TEXT_STYLES.button,
    color: COLORS.white,
  },
});
