import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Category, CategoryId } from '../../types/games';

const CATEGORIES: Category[] = [
  { id: 'home', icon: '🏠', label: 'Accueil' },
  { id: 'logic', icon: '🧠', label: 'Logique' },
  { id: 'numbers', icon: '🔢', label: 'Chiffres' },
  { id: 'spatial', icon: '🧩', label: 'Formes' },
  { id: 'words', icon: '📚', label: 'Mots' },
  { id: 'progress', icon: '🏆', label: 'Progrès' },
];

interface CategoriesNavProps {
  activeCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
}

export const CategoriesNav: React.FC<CategoriesNavProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((category) => (
        <CategoryButton
          key={category.id}
          category={category}
          isActive={activeCategory === category.id}
          onPress={() => onCategoryChange(category.id)}
        />
      ))}
    </View>
  );
};

interface CategoryButtonProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isActive, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isActive) {
      scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible
      accessibilityLabel={category.label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={animatedStyle}>
        {isActive ? (
          <LinearGradient
            colors={['#5B8DEE', '#4A7BD9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.icon}>{category.icon}</Text>
            <Text style={[styles.label, styles.labelActive]}>{category.label}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.button, styles.buttonInactive]}>
            <Text style={styles.icon}>{category.icon}</Text>
            <Text style={styles.label}>{category.label}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: 70,
  },
  buttonInactive: {
    backgroundColor: 'transparent',
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: '#9A9A9A',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
