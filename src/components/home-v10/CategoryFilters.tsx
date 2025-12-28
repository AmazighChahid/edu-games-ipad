/**
 * CategoryFilters - Version Compacte avec expand/collapse
 * Boutons rectangulaires arrondis avec icônes SVG
 * Un filtre principal visible, déploiement horizontal au clic
 */

import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { fontFamily } from '../../theme/typography';
import { HomeV10Colors } from '../../theme/home-v10-colors';
import { CATEGORIES, CategoryId, Category } from './categoryFiltersData';
import {
  TousIcon,
  AttentionIcon,
  LogiqueIcon,
  ChiffresIcon,
  MotsIcon,
  FormesIcon,
  CreativiteIcon,
  FavorisIcon,
} from './category-icons';

// ========================================
// TYPES
// ========================================

interface CategoryFiltersProps {
  selectedCategory: CategoryId;
  onCategoryChange: (categoryId: CategoryId) => void;
  style?: ViewStyle;
}

interface FilterButtonProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}

// ========================================
// CONSTANTES
// ========================================

const BUTTON_HEIGHT = 48;
const BUTTON_MIN_WIDTH = 110;
const BUTTON_GAP = 10;
const ICON_SIZE = 22;
const TEXT_SIZE = 20;

const ANIMATION_CONFIG = {
  duration: 280,
  easing: Easing.out(Easing.cubic),
};

// ========================================
// CATEGORY ICON MAPPING
// ========================================

const getCategoryIcon = (categoryId: CategoryId, color: string) => {
  const size = ICON_SIZE;
  switch (categoryId) {
    case 'all':
      return <TousIcon size={size} color={color} />;
    case 'attention':
      return <AttentionIcon size={size} color={color} />;
    case 'logic':
      return <LogiqueIcon size={size} color={color} />;
    case 'math':
      return <ChiffresIcon size={size} color={color} />;
    case 'reading':
      return <MotsIcon size={size} color={color} />;
    case 'spatial':
      return <FormesIcon size={size} color={color} />;
    case 'creativity':
      return <CreativiteIcon size={size} color={color} />;
    case 'favorites':
      return <FavorisIcon size={size} color={color} />;
    default:
      return <TousIcon size={size} color={color} />;
  }
};

// ========================================
// HELPER
// ========================================

const getCategoryById = (id: CategoryId): Category => {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
};

// ========================================
// FILTER BUTTON COMPONENT
// ========================================

const FilterButton = memo(({
  category,
  isActive,
  onPress,
}: FilterButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const { colors } = category;
  const iconColor = isActive ? '#FFFFFF' : colors.iconColor;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityLabel={`Catégorie ${category.label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive ? colors.activeBg : colors.bg,
            borderColor: isActive ? colors.activeBorder : colors.border,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.iconContainer}>
          {getCategoryIcon(category.id, iconColor)}
        </View>
        <Text
          style={[
            styles.filterText,
            isActive && styles.filterTextActive,
          ]}
        >
          {category.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

FilterButton.displayName = 'FilterButton';

// ========================================
// CATEGORY FILTERS
// ========================================

export const CategoryFilters = memo(({
  selectedCategory,
  onCategoryChange,
  style,
}: CategoryFiltersProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const expandProgress = useSharedValue(0);

  const selectedConfig = getCategoryById(selectedCategory);

  // Réorganiser : sélectionnée en premier, puis les autres
  const orderedCategories = React.useMemo(() => {
    const selected = CATEGORIES.find((c) => c.id === selectedCategory);
    const others = CATEGORIES.filter((c) => c.id !== selectedCategory);
    return selected ? [selected, ...others] : CATEGORIES;
  }, [selectedCategory]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(true);
    expandProgress.value = withTiming(1, ANIMATION_CONFIG);
  };

  const handleClose = () => {
    expandProgress.value = withTiming(0, ANIMATION_CONFIG);
    setTimeout(() => setIsExpanded(false), ANIMATION_CONFIG.duration);
  };

  const handleSelect = (categoryId: CategoryId) => {
    onCategoryChange(categoryId);
    handleClose();
  };

  // Style animé pour le container des filtres supplémentaires
  const expandedContainerStyle = useAnimatedStyle(() => {
    const totalWidth = (CATEGORIES.length - 1) * (BUTTON_MIN_WIDTH + BUTTON_GAP);
    return {
      width: interpolate(expandProgress.value, [0, 1], [0, totalWidth]),
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
      <View style={[styles.container, style]}>
        <View style={styles.filterRow}>
          {/* Filtre principal (toujours visible) */}
          <FilterButton
            category={selectedConfig}
            isActive={true}
            onPress={isExpanded ? () => handleSelect(selectedConfig.id) : handleToggle}
          />

          {/* Filtres supplémentaires (déroulés) */}
          {isExpanded && (
            <Animated.View style={[styles.expandedContainer, expandedContainerStyle]}>
              {orderedCategories.slice(1).map((category) => (
                <FilterButton
                  key={category.id}
                  category={category}
                  isActive={false}
                  onPress={() => handleSelect(category.id)}
                />
              ))}
            </Animated.View>
          )}

          {/* Indicateur quand fermé */}
          {!isExpanded && (
            <Pressable onPress={handleToggle} style={styles.expandIndicator}>
              <View style={styles.expandDot} />
              <View style={styles.expandDot} />
              <View style={styles.expandDot} />
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
});

CategoryFilters.displayName = 'CategoryFilters';

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 90,
  },
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BUTTON_GAP,
    marginLeft: BUTTON_GAP,
    overflow: 'hidden',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: BUTTON_HEIGHT,
    minWidth: BUTTON_MIN_WIDTH,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontFamily: fontFamily.display,
    fontSize: TEXT_SIZE,
    fontWeight: '600',
    color: HomeV10Colors.textPrimary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  expandIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
    padding: 10,
  },
  expandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(45, 52, 72, 0.4)',
  },
});

export default CategoryFilters;
