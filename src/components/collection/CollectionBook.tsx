/**
 * CollectionBook Component
 * The main book/album view with double pages and navigation
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Card,
  CardCategory,
  ALL_CARDS,
  getCardsByCategory,
  CATEGORY_CONFIG,
} from '@/data/cards';
import CollectionPage from './CollectionPage';
import CategoryTabs from './CategoryTabs';

interface CollectionBookProps {
  unlockedCardIds: string[];
  newCardIds: string[];
  categoryStats: Record<CardCategory, { unlocked: number; total: number; percentage: number }>;
  onCardPress: (card: Card) => void;
}

const CARDS_PER_PAGE = 6;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CollectionBook: React.FC<CollectionBookProps> = ({
  unlockedCardIds,
  newCardIds,
  categoryStats,
  onCardPress,
}) => {
  const [activeCategory, setActiveCategory] = useState<CardCategory>('animals');
  const [currentPagePair, setCurrentPagePair] = useState(0);
  const pageTransition = useSharedValue(0);

  // Get cards for current category
  const categoryCards = useMemo(
    () => getCardsByCategory(activeCategory),
    [activeCategory]
  );

  // Calculate total page pairs (2 pages per pair)
  const totalPagePairs = Math.ceil(categoryCards.length / (CARDS_PER_PAGE * 2));

  // Get cards for current page pair
  const leftPageCards = useMemo(() => {
    const startIndex = currentPagePair * CARDS_PER_PAGE * 2;
    return categoryCards.slice(startIndex, startIndex + CARDS_PER_PAGE);
  }, [categoryCards, currentPagePair]);

  const rightPageCards = useMemo(() => {
    const startIndex = currentPagePair * CARDS_PER_PAGE * 2 + CARDS_PER_PAGE;
    return categoryCards.slice(startIndex, startIndex + CARDS_PER_PAGE);
  }, [categoryCards, currentPagePair]);

  // Handle category change
  const handleCategoryChange = (category: CardCategory) => {
    if (category === activeCategory) return;

    // Animate transition
    pageTransition.value = withTiming(
      1,
      { duration: 300, easing: Easing.inOut(Easing.ease) },
      () => {
        runOnJS(setActiveCategory)(category);
        runOnJS(setCurrentPagePair)(0);
        pageTransition.value = withTiming(0, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
    );
  };

  // Handle page navigation
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentPagePair < totalPagePairs - 1) {
      pageTransition.value = withTiming(
        1,
        { duration: 250 },
        () => {
          runOnJS(setCurrentPagePair)(currentPagePair + 1);
          pageTransition.value = withTiming(0, { duration: 250 });
        }
      );
    } else if (direction === 'prev' && currentPagePair > 0) {
      pageTransition.value = withTiming(
        -1,
        { duration: 250 },
        () => {
          runOnJS(setCurrentPagePair)(currentPagePair - 1);
          pageTransition.value = withTiming(0, { duration: 250 });
        }
      );
    }
  };

  // Swipe gesture for page turning
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -50 && currentPagePair < totalPagePairs - 1) {
        runOnJS(handleNavigate)('next');
      } else if (event.translationX > 50 && currentPagePair > 0) {
        runOnJS(handleNavigate)('prev');
      }
    });

  const animatedBookStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(pageTransition.value), [0, 0.5, 1], [1, 0.8, 1]),
    transform: [
      {
        scale: interpolate(
          Math.abs(pageTransition.value),
          [0, 0.5, 1],
          [1, 0.98, 1]
        ),
      },
    ],
  }));

  const categoryProgress = categoryStats[activeCategory];

  return (
    <View style={styles.container}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.book, animatedBookStyle]}>
          {/* Book spine */}
          <View style={styles.spine}>
            <LinearGradient
              colors={['#8B5A2B', '#A0522D', '#8B5A2B']}
              style={styles.spineGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.spineDecoration} />
            </LinearGradient>
          </View>

          {/* Category tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            categoryStats={categoryStats}
          />

          {/* Left page */}
          {leftPageCards.length > 0 && (
            <CollectionPage
              cards={leftPageCards}
              category={activeCategory}
              isLeftPage={true}
              pageNumber={currentPagePair * 2 + 1}
              totalPages={totalPagePairs * 2}
              categoryProgress={categoryProgress}
              unlockedCardIds={unlockedCardIds}
              newCardIds={newCardIds}
              onCardPress={onCardPress}
              onNavigate={handleNavigate}
              canNavigatePrev={currentPagePair > 0}
              canNavigateNext={currentPagePair < totalPagePairs - 1}
            />
          )}

          {/* Right page */}
          {rightPageCards.length > 0 && (
            <CollectionPage
              cards={rightPageCards}
              category={activeCategory}
              isLeftPage={false}
              pageNumber={currentPagePair * 2 + 2}
              totalPages={totalPagePairs * 2}
              categoryProgress={categoryProgress}
              unlockedCardIds={unlockedCardIds}
              newCardIds={newCardIds}
              onCardPress={onCardPress}
              onNavigate={handleNavigate}
              canNavigatePrev={currentPagePair > 0}
              canNavigateNext={currentPagePair < totalPagePairs - 1}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  book: {
    width: '100%',
    maxWidth: 1000,
    height: 600,
    position: 'relative',
  },
  spine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 30,
    marginLeft: -15,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  spineGradient: {
    flex: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spineDecoration: {
    width: 4,
    height: '90%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
    opacity: 0.8,
  },
});

export default CollectionBook;
