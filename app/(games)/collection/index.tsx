/**
 * Collection Screen
 * Main album view for the card collection
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useCollection } from '../../../src/store';
import {
  CollectionBook,
  CardDetailModal,
} from '../../../src/components/collection';
import {
  Card,
  CardCategory,
  ALL_CARDS,
  getCardsByCategory,
  RARITY_CONFIG,
} from '../../../src/data/cards';
import { COLORS } from '../../../src/constants/colors';

// Decorative elements
const CloudDecoration: React.FC<{ style: object }> = ({ style }) => (
  <View style={[styles.cloud, style]} />
);

const StarDecoration: React.FC<{ style: object; delay?: number }> = ({ style }) => (
  <Animated.Text
    entering={FadeIn.delay(200)}
    style={[styles.star, style]}
  >
    ✨
  </Animated.Text>
);

export default function CollectionScreen() {
  const {
    collectionData,
    newCardIds,
    isCardUnlocked,
    isCardNew,
    getUnlockedCardsCount,
    getAllCategoryStats,
    getUnlockedCardData,
    markCardAsSeen,
    getRarityStats,
  } = useCollection();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Get unlocked card IDs
  const unlockedCardIds = useMemo(
    () => Object.keys(collectionData),
    [collectionData]
  );

  // Get category stats
  const categoryStats = useMemo(() => getAllCategoryStats(), [collectionData]);

  // Get rarity stats
  const rarityStats = useMemo(() => getRarityStats(), [collectionData]);

  // Count legendaries
  const legendaryCount = rarityStats.legendary.unlocked;

  // Handle card press
  const handleCardPress = useCallback((card: Card) => {
    if (isCardUnlocked(card.id)) {
      setSelectedCard(card);
      setModalVisible(true);
      // Mark as seen when viewing details
      if (isCardNew(card.id)) {
        markCardAsSeen(card.id);
      }
    }
  }, [isCardUnlocked, isCardNew, markCardAsSeen]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedCard(null);
  }, []);

  // Handle card navigation in modal
  const handleNavigateCard = useCallback((direction: 'prev' | 'next') => {
    if (!selectedCard) return;

    const unlockedCards = ALL_CARDS.filter((c) =>
      unlockedCardIds.includes(c.id)
    );
    const currentIndex = unlockedCards.findIndex((c) => c.id === selectedCard.id);

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedCard(unlockedCards[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < unlockedCards.length - 1) {
      setSelectedCard(unlockedCards[currentIndex + 1]);
    }
  }, [selectedCard, unlockedCardIds]);

  // Get card position for modal
  const cardPosition = useMemo(() => {
    if (!selectedCard) return undefined;
    const unlockedCards = ALL_CARDS.filter((c) =>
      unlockedCardIds.includes(c.id)
    );
    const index = unlockedCards.findIndex((c) => c.id === selectedCard.id);
    return { current: index + 1, total: unlockedCards.length };
  }, [selectedCard, unlockedCardIds]);

  // Check navigation availability
  const canNavigatePrev = useMemo(() => {
    if (!selectedCard || !cardPosition) return false;
    return cardPosition.current > 1;
  }, [selectedCard, cardPosition]);

  const canNavigateNext = useMemo(() => {
    if (!selectedCard || !cardPosition) return false;
    return cardPosition.current < cardPosition.total;
  }, [selectedCard, cardPosition]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorations */}
      <CloudDecoration style={styles.cloud1} />
      <CloudDecoration style={styles.cloud2} />
      <CloudDecoration style={styles.cloud3} />
      <StarDecoration style={styles.star1} />
      <StarDecoration style={styles.star2} />
      <StarDecoration style={styles.star3} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>📚</Text>
          <Text style={styles.title}>Ma Collection</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🃏</Text>
            <Text style={styles.statValue}>{getUnlockedCardsCount()}</Text>
            <Text style={styles.statLabel}>/ {ALL_CARDS.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{legendaryCount}</Text>
            <Text style={styles.statLabel}>légendaires</Text>
          </View>
        </View>
      </View>

      {/* Book */}
      <View style={styles.bookContainer}>
        <CollectionBook
          unlockedCardIds={unlockedCardIds}
          newCardIds={newCardIds}
          categoryStats={categoryStats}
          onCardPress={handleCardPress}
        />
      </View>

      {/* Mascot */}
      <View style={styles.mascot}>
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotText}>
            {getUnlockedCardsCount() === 0 ? (
              "Joue aux jeux pour débloquer des cartes ! 🎮"
            ) : newCardIds.length > 0 ? (
              <>Tu as <Text style={styles.mascotHighlight}>{newCardIds.length} nouvelle{newCardIds.length > 1 ? 's' : ''} carte{newCardIds.length > 1 ? 's' : ''}</Text> ! Regarde vite ! 🎉</>
            ) : (
              <>Continue pour compléter ta collection ! Tu as <Text style={styles.mascotHighlight}>{getUnlockedCardsCount()}</Text> cartes ! 🌟</>
            )}
          </Text>
        </View>
        <View style={styles.owlBody}>
          <View style={styles.owlEye} />
          <View style={[styles.owlEye, styles.owlEyeRight]} />
          <View style={styles.owlBeak} />
        </View>
      </View>

      {/* Global Progress */}
      <View style={styles.globalProgress}>
        <View style={styles.progressCircle}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            style={[
              styles.progressCircleFill,
              {
                height: `${(getUnlockedCardsCount() / ALL_CARDS.length) * 100}%`,
              },
            ]}
          />
          <Text style={styles.progressCircleText}>
            {Math.round((getUnlockedCardsCount() / ALL_CARDS.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressTitle}>
            {getUnlockedCardsCount()} / {ALL_CARDS.length} cartes
          </Text>
          <Text style={styles.progressSubtitle}>
            Continue comme ça !
          </Text>
          <View style={styles.nextReward}>
            <Text style={styles.nextRewardIcon}>🎁</Text>
            <Text style={styles.nextRewardText}>
              Prochaine récompense à {Math.ceil((getUnlockedCardsCount() + 1) / 5) * 5} cartes
            </Text>
          </View>
        </View>
      </View>

      {/* Card Detail Modal */}
      <CardDetailModal
        visible={modalVisible}
        card={selectedCard}
        cardData={selectedCard ? getUnlockedCardData(selectedCard.id) : undefined}
        onClose={handleCloseModal}
        onNavigate={handleNavigateCard}
        canNavigatePrev={canNavigatePrev}
        canNavigateNext={canNavigateNext}
        cardPosition={cardPosition}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 50,
  },
  cloud1: {
    top: 30,
    left: 80,
    width: 100,
    height: 40,
  },
  cloud2: {
    top: 60,
    right: 120,
    width: 80,
    height: 35,
  },
  cloud3: {
    top: 100,
    left: 300,
    width: 60,
    height: 25,
  },
  star: {
    position: 'absolute',
    fontSize: 24,
    opacity: 0.6,
  },
  star1: {
    top: 50,
    right: 300,
  },
  star2: {
    top: 120,
    right: 80,
  },
  star3: {
    top: 80,
    left: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  backButton: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: '#4A5568',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  titleIcon: {
    fontSize: 32,
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 26,
    color: '#4A5568',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 22,
  },
  statValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#718096',
  },
  bookContainer: {
    flex: 1,
    paddingTop: 20,
  },
  mascot: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    zIndex: 20,
  },
  mascotBubble: {
    backgroundColor: 'white',
    padding: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 6,
  },
  mascotText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  mascotHighlight: {
    fontFamily: 'Nunito_700Bold',
    color: COLORS.accent,
  },
  owlBody: {
    width: 75,
    height: 80,
    backgroundColor: '#D4A574',
    borderRadius: 40,
    position: 'relative',
  },
  owlEye: {
    position: 'absolute',
    top: 20,
    left: 12,
    width: 22,
    height: 22,
    backgroundColor: 'white',
    borderRadius: 11,
  },
  owlEyeRight: {
    left: 'auto',
    right: 12,
  },
  owlBeak: {
    position: 'absolute',
    top: 44,
    left: '50%',
    marginLeft: -9,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFB347',
  },
  globalProgress: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    paddingRight: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 6,
    zIndex: 20,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 30,
  },
  progressCircleText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 16,
    color: COLORS.primary,
    zIndex: 1,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 16,
    color: '#4A5568',
  },
  progressSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
  },
  nextReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  nextRewardIcon: {
    fontSize: 14,
  },
  nextRewardText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: COLORS.accent,
  },
});
