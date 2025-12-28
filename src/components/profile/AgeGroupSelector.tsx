/**
 * AgeGroupSelector - Selector for age groups (3-5, 6-7, 8-10)
 * Large colorful buttons for child-friendly selection
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import type { AgeGroup } from '@/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AgeGroupSelectorProps {
  selectedAgeGroup: AgeGroup | null;
  onSelect: (ageGroup: AgeGroup) => void;
}

interface AgeGroupConfig {
  id: AgeGroup;
  label: string;
  emoji: string;
  colors: [string, string];
  description: string;
}

const AGE_GROUPS: AgeGroupConfig[] = [
  {
    id: '3-5',
    label: '3-5 ans',
    emoji: '🧒',
    colors: ['#7BC74D', '#5BA030'],
    description: 'Petits explorateurs',
  },
  {
    id: '6-7',
    label: '6-7 ans',
    emoji: '👦',
    colors: ['#5B8DEE', '#3A6DD8'],
    description: 'Aventuriers curieux',
  },
  {
    id: '8-10',
    label: '8-10 ans',
    emoji: '🧑',
    colors: ['#9B59B6', '#7B3F96'],
    description: 'Grands champions',
  },
];

interface AgeGroupButtonProps {
  config: AgeGroupConfig;
  isSelected: boolean;
  onPress: () => void;
}

const AgeGroupButton = memo(({ config, isSelected, onPress }: AgeGroupButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.buttonContainer, animatedStyle]}
    >
      <LinearGradient
        colors={isSelected ? config.colors : ['#E8E8E8', '#D0D0D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, isSelected && styles.buttonSelected]}
      >
        <Text style={styles.buttonEmoji}>{config.emoji}</Text>
        <View style={styles.buttonText}>
          <Text style={[styles.buttonLabel, isSelected && styles.buttonLabelSelected]}>
            {config.label}
          </Text>
          <Text style={[styles.buttonDescription, isSelected && styles.buttonDescriptionSelected]}>
            {config.description}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
});

AgeGroupButton.displayName = 'AgeGroupButton';

export const AgeGroupSelector = memo(({ selectedAgeGroup, onSelect }: AgeGroupSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quel âge as-tu ?</Text>
      <View style={styles.buttonsContainer}>
        {AGE_GROUPS.map((config) => (
          <AgeGroupButton
            key={config.id}
            config={config}
            isSelected={selectedAgeGroup === config.id}
            onPress={() => onSelect(config.id)}
          />
        ))}
      </View>
    </View>
  );
});

AgeGroupSelector.displayName = 'AgeGroupSelector';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsContainer: {
    gap: 16,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  buttonSelected: {
    borderWidth: 0,
  },
  buttonEmoji: {
    fontSize: 40,
  },
  buttonText: {
    flex: 1,
    gap: 4,
  },
  buttonLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#555',
  },
  buttonLabelSelected: {
    color: '#fff',
  },
  buttonDescription: {
    fontSize: 16,
    color: '#777',
  },
  buttonDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
