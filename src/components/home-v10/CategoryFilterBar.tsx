/**
 * CategoryFilterBar - Filtre compact par catégorie
 * Une icône à gauche qui s'expand horizontalement pour afficher toutes les catégories
 * Cliquer ailleurs referme le menu
 */

import React, { memo } from 'react';
import { View, StyleSheet, Pressable, Text, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { fontFamily } from '../../theme/typography';

// ========================================
// TYPES
// ========================================

export type CategoryFilterId = 'all' | 'favorites' | 'logic' | 'numbers' | 'shapes' | 'memory' | 'words';

interface CategoryFilterBarProps {
  selectedCategory: CategoryFilterId;
  onSelectCategory: (category: CategoryFilterId) => void;
}

interface CategoryFilterConfig {
  id: CategoryFilterId;
  icon: string;
  label: string;
  gradient: readonly [string, string];
}

// ========================================
// CONFIGURATION DES CATÉGORIES
// ========================================

const FILTER_CATEGORIES: CategoryFilterConfig[] = [
  {
    id: 'all',
    icon: '🏠',
    label: 'Tous',
    gradient: ['#90CAF9', '#42A5F5'],
  },
  {
    id: 'favorites',
    icon: '❤️',
    label: 'Favoris',
    gradient: ['#F8BBD9', '#E91E63'],
  },
  {
    id: 'logic',
    icon: '🧠',
    label: 'Logique',
    gradient: ['#FFB74D', '#F57C00'],
  },
  {
    id: 'numbers',
    icon: '🔢',
    label: 'Chiffres',
    gradient: ['#5C6BC0', '#3F51B5'],
  },
  {
    id: 'words',
    icon: '📖',
    label: 'Mots',
    gradient: ['#81C784', '#4CAF50'],
  },
  {
    id: 'memory',
    icon: '🎯',
    label: 'Mémoire',
    gradient: ['#4DB6AC', '#009688'],
  },
  {
    id: 'shapes',
    icon: '🧩',
    label: 'Formes',
    gradient: ['#EF5350', '#E53935'],
  },
];

// ========================================
// HELPER
// ========================================

const getCategoryConfig = (id: CategoryFilterId): CategoryFilterConfig => {
  return FILTER_CATEGORIES.find((c) => c.id === id) || FILTER_CATEGORIES[0];
};

// ========================================
// COMPOSANT ICÔNE DE CATÉGORIE
// ========================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryIconProps {
  config: CategoryFilterConfig;
  size?: number;
  onPress?: () => void;
  isSelected?: boolean;
  index?: number;
}

const CategoryIcon = memo(({
  config,
  size = 48,
  onPress,
  isSelected = false,
  index = 0,
}: CategoryIconProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={SlideInLeft.delay(index * 40).springify().damping(14).stiffness(120)}
      exiting={SlideOutLeft.delay((FILTER_CATEGORIES.length - 1 - index) * 30).duration(150)}
    >
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.iconButton, containerStyle]}
        accessibilityRole="button"
        accessibilityLabel={`Filtrer par ${config.label}`}
      >
        <View style={[
          styles.iconRing,
          isSelected && styles.iconRingSelected,
        ]}>
          <LinearGradient
            colors={config.gradient}
            style={[styles.iconGradient, { width: size, height: size, borderRadius: size / 2 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.iconEmoji, { fontSize: size * 0.5 }]}>
              {config.icon}
            </Text>
          </LinearGradient>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
});

CategoryIcon.displayName = 'CategoryIcon';

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export const CategoryFilterBar = memo(({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterBarProps) => {
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const selectedConfig = getCategoryConfig(selectedCategory);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleSelect = (categoryId: CategoryFilterId) => {
    onSelectCategory(categoryId);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Overlay pour fermer quand on clique ailleurs */}
      {isExpanded && (
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.overlay}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Container du filtre */}
      <View style={[styles.container, { bottom: insets.bottom + 20 }]}>
        {isExpanded ? (
          // Mode expandé : toutes les catégories en ligne horizontale
          <Animated.View
            style={styles.expandedRow}
            layout={LinearTransition.springify().damping(15).stiffness(120)}
          >
            {FILTER_CATEGORIES.map((category, index) => (
              <CategoryIcon
                key={category.id}
                config={category}
                size={50}
                isSelected={selectedCategory === category.id}
                onPress={() => handleSelect(category.id)}
                index={index}
              />
            ))}
          </Animated.View>
        ) : (
          // Mode collapsed : juste l'icône sélectionnée
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(100)}
            layout={LinearTransition.springify()}
          >
            <Pressable onPress={handleToggle} style={styles.collapsedButton}>
              <LinearGradient
                colors={selectedConfig.gradient}
                style={styles.collapsedGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.collapsedEmoji}>{selectedConfig.icon}</Text>
              </LinearGradient>
              <View style={styles.labelBadge}>
                <Text style={styles.labelBadgeText}>{selectedConfig.label}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </>
  );
});

CategoryFilterBar.displayName = 'CategoryFilterBar';

// ========================================
// STYLES
// ========================================

const ICON_SIZE = 50;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 90,
  },
  container: {
    position: 'absolute',
    left: 16,
    zIndex: 100,
  },

  // Mode collapsed
  collapsedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapsedGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  collapsedEmoji: {
    fontSize: 28,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  labelBadgeText: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: '#2D3436',
  },
  chevron: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#718096',
    marginLeft: 2,
  },

  // Mode expanded
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    // Container pour l'icône
  },
  iconRing: {
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: (ICON_SIZE + 8) / 2,
  },
  iconRingSelected: {
    borderColor: '#4CAF50',
  },
  iconGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconEmoji: {
    textAlign: 'center',
  },
});

export default CategoryFilterBar;
