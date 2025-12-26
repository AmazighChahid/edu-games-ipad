/**
 * CollectionPage Component
 * A single page of the collection book (6 cards per page)
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardCategory, CATEGORY_CONFIG } from '../../data/cards';
import CollectionCard from './CollectionCard';

interface CollectionPageProps {
  cards: Card[];
  category: CardCategory;
  isLeftPage: boolean;
  pageNumber: number;
  totalPages: number;
  categoryProgress: { unlocked: number; total: number; percentage: number };
  unlockedCardIds: string[];
  newCardIds: string[];
  onCardPress: (card: Card) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  cards,
  category,
  isLeftPage,
  pageNumber,
  totalPages,
  categoryProgress,
  unlockedCardIds,
  newCardIds,
  onCardPress,
  onNavigate,
  canNavigatePrev,
  canNavigateNext,
}) => {
  const categoryConfig = CATEGORY_CONFIG[category];

  return (
    <View style={[styles.page, isLeftPage ? styles.leftPage : styles.rightPage]}>
      {/* Page texture overlay */}
      <View style={styles.pageTexture} />

      {/* Page edge shadow */}
      <View
        style={[
          styles.pageEdge,
          isLeftPage ? styles.pageEdgeRight : styles.pageEdgeLeft,
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.categoryEmoji}>{categoryConfig.emoji}</Text>
          <Text style={styles.categoryName}>{categoryConfig.label}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${categoryProgress.percentage}%`,
                  backgroundColor: categoryConfig.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {categoryProgress.unlocked}/{categoryProgress.total}
          </Text>
        </View>
      </View>

      {/* Cards grid */}
      <View style={styles.cardsGrid}>
        {cards.map((card, index) => (
          <CollectionCard
            key={card.id}
            card={card}
            isUnlocked={unlockedCardIds.includes(card.id)}
            isNew={newCardIds.includes(card.id)}
            onPress={() => onCardPress(card)}
            index={index}
          />
        ))}
        {/* Fill empty slots */}
        {Array.from({ length: Math.max(0, 6 - cards.length) }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.emptySlot}>
            <Text style={styles.emptySlotIcon}>?</Text>
          </View>
        ))}
      </View>

      {/* Navigation */}
      {isLeftPage ? (
        <>
          <Text style={[styles.pageNumber, styles.pageNumberLeft]}>
            {pageNumber}
          </Text>
          {canNavigateNext && (
            <Pressable
              style={[styles.navArrow, styles.navArrowRight]}
              onPress={() => onNavigate('next')}
            >
              <Text style={styles.navArrowText}>›</Text>
            </Pressable>
          )}
        </>
      ) : (
        <>
          {canNavigatePrev && (
            <Pressable
              style={[styles.navArrow, styles.navArrowLeft]}
              onPress={() => onNavigate('prev')}
            >
              <Text style={styles.navArrowText}>‹</Text>
            </Pressable>
          )}
          <Text style={[styles.pageNumber, styles.pageNumberRight]}>
            {pageNumber}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    width: '46%', // Approximately (50% - 25px) for book layout
    backgroundColor: '#FFF9F0',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  leftPage: {
    left: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  rightPage: {
    right: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  pageTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    borderRadius: 8,
  },
  pageEdge: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    width: 3,
    backgroundColor: 'transparent',
  },
  pageEdgeRight: {
    right: 0,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.05)',
  },
  pageEdgeLeft: {
    left: 0,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(139, 90, 43, 0.2)',
    borderStyle: 'dashed',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryName: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: '#8B5A2B',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    width: 80,
    height: 10,
    backgroundColor: 'rgba(139, 90, 43, 0.15)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 14,
    color: '#8B5A2B',
  },
  cardsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  emptySlot: {
    width: '30%',
    aspectRatio: 3 / 4,
    backgroundColor: 'rgba(139, 90, 43, 0.05)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(139, 90, 43, 0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  emptySlotIcon: {
    fontSize: 28,
    color: '#A0AEC0',
    opacity: 0.5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    fontFamily: 'Fredoka_500Medium',
    fontSize: 16,
    color: '#A0AEC0',
  },
  pageNumberLeft: {
    left: 24,
  },
  pageNumberRight: {
    right: 24,
  },
  navArrow: {
    position: 'absolute',
    bottom: 12,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(139, 90, 43, 0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrowLeft: {
    left: 24,
  },
  navArrowRight: {
    right: 24,
  },
  navArrowText: {
    fontSize: 24,
    color: '#8B5A2B',
    fontWeight: '600',
  },
});

export default CollectionPage;
