/**
 * GameCategoriesSection - Section containing all game categories
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import { GameCategoryV9 } from '@/types/home.types';
import { CategoryRow } from './CategoryRow';

interface GameCategoriesSectionProps {
  categories: GameCategoryV9[];
}

export const GameCategoriesSection = memo(({ categories }: GameCategoriesSectionProps) => {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </View>
  );
});

GameCategoriesSection.displayName = 'GameCategoriesSection';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
});
