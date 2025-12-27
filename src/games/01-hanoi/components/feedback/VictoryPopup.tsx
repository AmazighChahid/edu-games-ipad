/**
 * VictoryPopup Component
 * Main popup card container with all victory content
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import type { CollectibleCard } from '../../data/collectibleCards';
import { GameActionButtons, PerformanceStats } from '@/components/common';
import { PopupHeader } from './PopupHeader';
import { CollectibleCardFlip } from './CollectibleCardFlip';
import { CollectionProgress } from './CollectionProgress';
import { StatsSection } from './StatsSection';
import { getVictoryMessage } from '../../logic/cardAwardEngine';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VictoryPopupProps {
  stars: number;
  awardedCard: CollectibleCard | null;
  isCardNew: boolean;
  unlockedCardsCount: number;
  moves: number;
  optimalMoves: number;
  timeElapsed: number;
  isPerfect: boolean;
  hasNextLevel: boolean;
  onNextLevel?: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export function VictoryPopup({
  stars,
  awardedCard,
  isCardNew,
  unlockedCardsCount,
  moves,
  optimalMoves,
  timeElapsed,
  isPerfect,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onHome,
}: VictoryPopupProps) {
  const message = getVictoryMessage(awardedCard, stars, isPerfect);

  return (
    <Animated.View
      entering={ZoomIn.delay(100).springify().damping(15)}
      style={styles.popup}
    >
      {/* Golden Header with Rays and Stars */}
      <PopupHeader stars={stars} />

      {/* Card Section */}
      <View style={styles.cardSection}>
        {awardedCard ? (
          <>
            <CollectibleCardFlip card={awardedCard} isNew={isCardNew} />

            <Animated.View entering={FadeInDown.delay(1800)} style={styles.cardMessage}>
              <Text style={styles.messageText}>{message}</Text>
              <CollectionProgress unlockedCount={unlockedCardsCount} />
            </Animated.View>
          </>
        ) : (
          <Animated.View entering={FadeInDown.delay(1200)} style={styles.noCardMessage}>
            <Text style={styles.noCardText}>
              Continue de jouer pour débloquer plus de cartes !
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Stats */}
      <StatsSection
        moves={moves}
        optimalMoves={optimalMoves}
        timeElapsed={timeElapsed}
        isPerfect={isPerfect}
      />

      {/* Performance Analysis */}
      <PerformanceStats
        current={moves}
        optimal={optimalMoves}
        type="moves"
        showAnalysis={true}
        enterDelay={2200}
      />

      {/* Action Buttons */}
      <GameActionButtons
        variant="victory"
        hasNextLevel={hasNextLevel}
        onNextLevel={onNextLevel}
        onReplay={onReplay}
        onHome={onHome}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: {
    backgroundColor: '#fff',
    borderRadius: 28,
    maxWidth: Math.min(420, SCREEN_WIDTH * 0.85),
    width: '85%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 60,
    elevation: 20,
  },
  cardSection: {
    paddingHorizontal: 24,
    paddingTop: 0,
    marginTop: -40, // Overlap with header
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardMessage: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  messageText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 12,
  },
  noCardMessage: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  noCardText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
