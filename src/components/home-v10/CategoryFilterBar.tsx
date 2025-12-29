/**
 * CategoryFilterBar - Filtre compact par catégorie
 * Une icône principale à gauche, cliquer dessus déroule horizontalement les autres catégories
 * Cliquer ailleurs referme le menu (les icônes se regroupent)
 */

import React, { memo } from 'react';
import { View, StyleSheet, Pressable, Text, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { fontFamily } from '../../theme/typography';
import { Icons } from '../../constants/icons';

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
    icon: Icons.categoryAll,
    label: 'Tous',
    gradient: ['#90CAF9', '#42A5F5'],
  },
  {
    id: 'favorites',
    icon: Icons.categoryFavorites,
    label: 'Favoris',
    gradient: ['#F8BBD9', '#E91E63'],
  },
  {
    id: 'logic',
    icon: Icons.categoryLogic,
    label: 'Logique',
    gradient: ['#FFB74D', '#F57C00'],
  },
  {
    id: 'numbers',
    icon: Icons.categoryMath,
    label: 'Chiffres',
    gradient: ['#5C6BC0', '#3F51B5'],
  },
  {
    id: 'words',
    icon: Icons.categoryReading,
    label: 'Mots',
    gradient: ['#81C784', '#4CAF50'],
  },
  {
    id: 'memory',
    icon: Icons.categoryTarget,
    label: 'Mémoire',
    gradient: ['#4DB6AC', '#009688'],
  },
  {
    id: 'shapes',
    icon: Icons.categoryPuzzle,
    label: 'Formes',
    gradient: ['#EF5350', '#E53935'],
  },
];

// ========================================
// CONSTANTES
// ========================================

const ICON_SIZE = 48;
const ICON_GAP = 8;
const ANIMATION_CONFIG = {
  duration: 300,
  easing: Easing.out(Easing.cubic),
};

// ========================================
// HELPER
// ========================================

const getCategoryConfig = (id: CategoryFilterId): CategoryFilterConfig => {
  return FILTER_CATEGORIES.find((c) => c.id === id) || FILTER_CATEGORIES[0];
};

// ========================================
// COMPOSANT ICÔNE DE CATÉGORIE
// ========================================

interface CategoryIconProps {
  config: CategoryFilterConfig;
  isSelected?: boolean;
  onPress?: () => void;
}

const CategoryIcon = memo(({
  config,
  isSelected = false,
  onPress,
}: CategoryIconProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Filtrer par ${config.label}`}
      >
        <View style={[styles.iconRing, isSelected && styles.iconRingSelected]}>
          <LinearGradient
            colors={config.gradient}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.iconEmoji}>{config.icon}</Text>
          </LinearGradient>
        </View>
      </Pressable>
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

  // Animation value: 0 = collapsed, 1 = expanded
  const expandProgress = useSharedValue(0);

  const selectedConfig = getCategoryConfig(selectedCategory);

  // Réorganiser les catégories : la sélectionnée en premier, puis les autres
  const orderedCategories = React.useMemo(() => {
    const selected = FILTER_CATEGORIES.find(c => c.id === selectedCategory);
    const others = FILTER_CATEGORIES.filter(c => c.id !== selectedCategory);
    return selected ? [selected, ...others] : FILTER_CATEGORIES;
  }, [selectedCategory]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(true);
    expandProgress.value = withTiming(1, ANIMATION_CONFIG);
  };

  const handleClose = () => {
    expandProgress.value = withTiming(0, ANIMATION_CONFIG);
    // Délai pour laisser l'animation se terminer
    setTimeout(() => setIsExpanded(false), ANIMATION_CONFIG.duration);
  };

  const handleSelect = (categoryId: CategoryFilterId) => {
    onSelectCategory(categoryId);
    handleClose();
  };

  // Style animé pour le container des icônes supplémentaires
  const expandedContainerStyle = useAnimatedStyle(() => {
    const totalWidth = (FILTER_CATEGORIES.length - 1) * (ICON_SIZE + ICON_GAP);
    return {
      width: expandProgress.value * totalWidth,
      opacity: expandProgress.value,
    };
  });

  return (
    <>
      {/* Overlay pour fermer quand on clique ailleurs */}
      {isExpanded && (
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Container du filtre */}
      <View style={[styles.container, { bottom: insets.bottom + 20 }]}>
        <View style={styles.filterRow}>
          {/* Icône principale (toujours visible) */}
          <CategoryIcon
            config={selectedConfig}
            isSelected={true}
            onPress={isExpanded ? () => handleSelect(selectedConfig.id) : handleToggle}
          />

          {/* Icônes supplémentaires (déroulées) */}
          {isExpanded && (
            <Animated.View style={[styles.expandedContainer, expandedContainerStyle]}>
              {orderedCategories.slice(1).map((category) => (
                <CategoryIcon
                  key={category.id}
                  config={category}
                  isSelected={false}
                  onPress={() => handleSelect(category.id)}
                />
              ))}
            </Animated.View>
          )}

          {/* Label de la catégorie (visible quand fermé) */}
          {!isExpanded && (
            <Pressable onPress={handleToggle} style={styles.labelBadge}>
              <Text style={styles.labelBadgeText}>{selectedConfig.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
});

CategoryFilterBar.displayName = 'CategoryFilterBar';

// ========================================
// STYLES
// ========================================

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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ICON_GAP,
    marginLeft: ICON_GAP,
    overflow: 'hidden',
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
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconEmoji: {
    fontSize: ICON_SIZE * 0.5,
    textAlign: 'center',
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    marginLeft: 8,
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
});

export default CategoryFilterBar;
