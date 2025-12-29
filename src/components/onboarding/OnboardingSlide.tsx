/**
 * OnboardingSlide
 * Template pour une slide d'onboarding
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlideProps {
  emoji: string;
  title: string;
  subtitle: string;
  description?: string;
  index: number;
}

export function OnboardingSlide({
  emoji,
  title,
  subtitle,
  description,
  index,
}: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.emojiContainer}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        style={styles.textContainer}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emojiContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'Fredoka',
    fontSize: 32,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary.main,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 26,
  },
});

export default OnboardingSlide;
