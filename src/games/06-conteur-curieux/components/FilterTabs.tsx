/**
 * FilterTabs Component
 *
 * Onglets de filtrage par thème d'histoire
 * Scroll horizontal, feedback tactile
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { spacing, borderRadius, fontFamily } from '../../../theme';
import type { StoryTheme, ThemeConfig } from '../types';

type FilterValue = StoryTheme | 'all';

interface FilterTabsProps {
  selectedTheme: FilterValue;
  onSelectTheme: (theme: FilterValue) => void;
  showAll?: boolean;
}

// Configuration des thèmes
const THEME_CONFIGS: ThemeConfig[] = [
  { id: 'nature', label: 'Nature', emoji: '🌿', color: '#27AE60' },
  { id: 'adventure', label: 'Aventure', emoji: '🗺️', color: '#E67E22' },
  { id: 'magic', label: 'Magie', emoji: '✨', color: '#9B59B6' },
  { id: 'family', label: 'Famille', emoji: '👨‍👩‍👧', color: '#3498DB' },
  { id: 'friendship', label: 'Amitié', emoji: '🤝', color: '#E91E63' },
  { id: 'discovery', label: 'Découverte', emoji: '🔍', color: '#00BCD4' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabProps {
  id: FilterValue;
  label: string;
  emoji?: string;
  color?: string;
  isActive: boolean;
  onPress: (id: FilterValue) => void;
}

function Tab({ id, label, emoji, color, isActive, onPress }: TabProps) {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(isActive ? (color || '#9B59B6') : 'rgba(255,255,255,0.8)');

  // Update background when active changes
  React.useEffect(() => {
    backgroundColor.value = withTiming(
      isActive ? (color || '#9B59B6') : 'rgba(255,255,255,0.8)',
      { duration: 200 }
    );
  }, [isActive, color]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
  }, []);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(id);
  }, [id, onPress]);

  const tabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: backgroundColor.value,
  }));

  return (
    <AnimatedPressable
      style={[styles.tab, tabStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`Filtrer par ${label}`}
    >
      {emoji && <Text style={styles.tabEmoji}>{emoji}</Text>}
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function FilterTabs({
  selectedTheme,
  onSelectTheme,
  showAll = true,
}: FilterTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All tab */}
        {showAll && (
          <Tab
            id="all"
            label="Tous"
            isActive={selectedTheme === 'all'}
            onPress={onSelectTheme}
            color="#9B59B6"
          />
        )}

        {/* Theme tabs */}
        {THEME_CONFIGS.map((theme) => (
          <Tab
            key={theme.id}
            id={theme.id}
            label={theme.label}
            emoji={theme.emoji}
            color={theme.color}
            isActive={selectedTheme === theme.id}
            onPress={onSelectTheme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[3],
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.round,
  },
  tabEmoji: {
    fontSize: 14,
  },
  tabLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: '#718096',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
});

export default FilterTabs;
