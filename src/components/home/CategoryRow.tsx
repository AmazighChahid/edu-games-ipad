/**
 * CategoryRow - Horizontal scrollable row of games for a category
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { GameCategoryV9 } from '@/types/home.types';
import { GameCardV9 } from './GameCardV9';

interface CategoryRowProps {
  category: GameCategoryV9;
}

export const CategoryRow = memo(({ category }: CategoryRowProps) => {
  const gameCount = category.games.length;
  const gameText = gameCount === 1 ? '1 jeu' : `${gameCount} jeux`;

  return (
    <View style={styles.container}>
      {/* Category header */}
      <View style={styles.header}>
        <Text style={styles.icon}>{category.icon}</Text>
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.count}>{gameText}</Text>
      </View>

      {/* Horizontal scroll of games */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gamesContainer}
        decelerationRate="fast"
        snapToInterval={214} // card width (200) + gap (14)
      >
        {category.games.map((game) => (
          <GameCardV9 key={game.id} game={game} />
        ))}
      </ScrollView>
    </View>
  );
});

CategoryRow.displayName = 'CategoryRow';

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 20,
    color: '#2D3436',
  },
  dot: {
    fontSize: 20,
    color: '#CBD5E0',
    marginHorizontal: 2,
  },
  count: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#9CA3AF',
  },
  gamesContainer: {
    gap: 14,
    paddingRight: 28, // Extra padding at the end
  },
});
