/**
 * StreakWidget - Daily streak widget (orange)
 * Shows consecutive days of play
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { StreakData, WeekDay, WIDGET_COLORS } from '@/types/home.types';

interface StreakWidgetProps {
  streak: StreakData;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Day circle component
const DayCircle = memo(({ day }: { day: WeekDay }) => {
  const getStyle = () => {
    if (day.isToday) {
      return [styles.day, styles.dayToday];
    }
    if (day.completed) {
      return [styles.day, styles.dayCompleted];
    }
    return [styles.day, styles.dayPending];
  };

  const getTextStyle = () => {
    if (day.isToday || day.completed) {
      return styles.dayTextCompleted;
    }
    return styles.dayTextPending;
  };

  return (
    <View style={getStyle()}>
      <Text style={getTextStyle()}>{day.label}</Text>
    </View>
  );
});

DayCircle.displayName = 'DayCircle';

export const StreakWidget = memo(({ streak }: StreakWidgetProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <LinearGradient
        colors={['rgba(243,156,18,0.95)', 'rgba(214,137,16,0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Background icon */}
        <Text style={styles.bgIcon}>{WIDGET_COLORS.streak.bgIcon}</Text>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>🔥 Ma Série</Text>

          {/* Streak content */}
          <View style={styles.streakContent}>
            {/* Days */}
            <View style={styles.daysContainer}>
              {streak.weekDays.map((day, index) => (
                <DayCircle key={index} day={day} />
              ))}
            </View>

            {/* Streak info */}
            <View style={styles.streakInfo}>
              <Text style={styles.streakCount}>{streak.currentStreak}</Text>
              <Text style={styles.streakLabel}>jours d'affilée !</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
});

StreakWidget.displayName = 'StreakWidget';

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: 20,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    top: '50%',
    right: -10,
    fontSize: 130,
    opacity: 0.15,
    transform: [{ translateY: -65 }],
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  streakContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  // Days
  daysContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dayCompleted: {
    backgroundColor: '#FFFFFF',
  },
  dayToday: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dayTextPending: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dayTextCompleted: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
    color: '#F39C12',
  },

  // Streak info
  streakInfo: {
    alignItems: 'center',
  },
  streakCount: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  streakLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
