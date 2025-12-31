/**
 * MemoryGrid Component
 *
 * Grille de cartes pour le jeu Memory
 * Calcule automatiquement la disposition optimale
 */

import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { spacing } from '../../../theme';
import { MemoryCard } from './MemoryCard';
import { getGridDimensions } from '../logic/memoryEngine';
import type { MemoryCard as MemoryCardType } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface MemoryGridProps {
  cards: MemoryCardType[];
  onCardPress: (cardId: string) => void;
  disabled?: boolean;
  cardBackColor?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MemoryGrid({
  cards,
  onCardPress,
  disabled = false,
  cardBackColor,
}: MemoryGridProps) {
  const { width, height } = useWindowDimensions();

  // Calculer les dimensions de la grille
  const pairCount = cards.length / 2;
  const { rows, cols } = getGridDimensions(pairCount);

  // Calculer la taille des cartes
  const cardSize = useMemo(() => {
    const availableWidth = width - spacing[8] * 2; // Padding horizontal
    const availableHeight = height - 300; // Espace pour header, stats, etc.

    const maxCardWidth = (availableWidth - (cols + 1) * 8) / cols;
    const maxCardHeight = (availableHeight - (rows + 1) * 8) / rows;

    // Prendre le minimum pour garder les cartes carrées
    const size = Math.min(maxCardWidth, maxCardHeight, 100);

    return Math.max(size, 64); // Minimum 64px pour touch targets enfant
  }, [width, height, rows, cols]);

  // Organiser les cartes en grille
  const grid = useMemo(() => {
    const result: MemoryCardType[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: MemoryCardType[] = [];
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        if (index < cards.length) {
          row.push(cards[index]);
        }
      }
      result.push(row);
    }

    return result;
  }, [cards, rows, cols]);

  return (
    <View style={styles.container}>
      {grid.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              onPress={onCardPress}
              size={cardSize}
              disabled={disabled}
              cardBackColor={cardBackColor}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default MemoryGrid;
