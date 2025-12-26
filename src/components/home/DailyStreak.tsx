import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TEXT_STYLES, TYPOGRAPHY } from '../../constants/typography';

interface DailyStreakProps {
  currentStreak: number;
  weekProgress: boolean[]; // [L, M, M, J, V, S, D]
  todayIndex: number; // 0-6
}

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const DailyStreak: React.FC<DailyStreakProps> = ({
  currentStreak,
  weekProgress,
  todayIndex,
}) => {
  const fireScale = useSharedValue(1);

  useEffect(() => {
    if (currentStreak >= 3) {
      fireScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    }
  }, [currentStreak]);

  const fireAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
  }));

  return (
    <LinearGradient
      colors={[COLORS.streakOrange, COLORS.streakOrangeDark]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Animated.Text style={[styles.fireEmoji, fireAnimatedStyle]}>
          🔥
        </Animated.Text>
        <Text style={styles.title}>Série en cours !</Text>
      </View>

      {/* Jours de la semaine */}
      <View style={styles.days}>
        {DAY_LABELS.map((label, index) => {
          const isCompleted = weekProgress[index];
          const isToday = index === todayIndex;
          const isFuture = index > todayIndex;

          return (
            <View
              key={index}
              style={[
                styles.day,
                isCompleted && styles.dayCompleted,
                isToday && styles.dayToday,
                isFuture && styles.dayFuture,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isCompleted && styles.dayTextCompleted,
                  isToday && styles.dayTextToday,
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Message */}
      <Text style={styles.message}>
        {currentStreak} jour{currentStreak > 1 ? 's' : ''} d'affilée ! Continue comme ça ! 🎉
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.radiusXl,
    padding: SPACING.xl,
    shadowColor: COLORS.streakOrangeDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  fireEmoji: {
    fontSize: 36, // HTML: 32px, augmenté pour impact visuel
  },
  title: {
    ...TEXT_STYLES.h3,
    color: COLORS.white,
  },
  days: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCompleted: {
    backgroundColor: COLORS.white,
  },
  dayToday: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  dayFuture: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dayText: {
    fontSize: 16, // HTML: 14px, augmenté pour lisibilité
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: 'Nunito_700Bold',
  },
  dayTextCompleted: {
    color: COLORS.streakOrangeDark,
  },
  dayTextToday: {
    color: COLORS.white,
  },
  message: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.white,
    marginTop: SPACING.md,
    opacity: 0.9,
  },
});
