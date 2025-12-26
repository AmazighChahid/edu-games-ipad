/**
 * CategoryTabs Component
 * Vertical tabs for filtering cards by category (book-style tabs on the side)
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { CardCategory, CATEGORY_CONFIG } from '../../data/cards';

interface CategoryTabsProps {
  activeCategory: CardCategory;
  onCategoryChange: (category: CardCategory) => void;
  categoryStats?: Record<CardCategory, { unlocked: number; total: number }>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CATEGORIES: CardCategory[] = ['animals', 'robots', 'nature', 'stars'];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
  categoryStats,
}) => {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((category, index) => (
        <CategoryTab
          key={category}
          category={category}
          isActive={activeCategory === category}
          onPress={() => onCategoryChange(category)}
          stats={categoryStats?.[category]}
          index={index}
        />
      ))}
    </View>
  );
};

interface CategoryTabProps {
  category: CardCategory;
  isActive: boolean;
  onPress: () => void;
  stats?: { unlocked: number; total: number };
  index: number;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  category,
  isActive,
  onPress,
  stats,
  index,
}) => {
  const config = CATEGORY_CONFIG[category];
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withSpring(isActive ? -8 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: isActive ? 60 : 50,
  }));

  return (
    <AnimatedPressable onPress={onPress} style={[styles.tab, animatedStyle]}>
      <LinearGradient
        colors={config.gradientColors}
        style={styles.tabGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.tabEmoji}>{config.emoji}</Text>
        {isActive && stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {stats.unlocked}/{stats.total}
            </Text>
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: -20,
    top: 50,
    gap: 8,
    zIndex: 10,
  },
  tab: {
    height: 60,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  tabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabEmoji: {
    fontSize: 24,
  },
  statsContainer: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  statsText: {
    fontSize: 8,
    fontFamily: 'Nunito_700Bold',
    color: 'white',
  },
});

export default CategoryTabs;
