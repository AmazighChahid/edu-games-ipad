/**
 * VictoryOverlay Component
 * Main orchestrator for victory celebration overlay
 * Replaces VictoryCelebration component
 */

import { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store';
import type { CollectibleCard } from '../../data/collectibleCards';
import {
  determineAwardedCard,
  getStars,
  isPerfectRun,
  getMascotMessage,
} from '../../logic/cardAwardEngine';
import { Confetti } from '@/components/common';
import { VictoryPopup } from './VictoryPopup';
import { VictoryMascot } from './VictoryMascot';
import { useSound } from '@/hooks/useSound';

export interface VictoryOverlayProps {
  visible: boolean;
  moves: number;
  optimalMoves: number;
  timeElapsed: number; // in seconds
  hintsUsed: number;
  levelId: string;
  hasNextLevel: boolean;
  onNextLevel?: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export function VictoryOverlay({
  visible,
  moves,
  optimalMoves,
  timeElapsed,
  hintsUsed,
  levelId,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onHome,
}: VictoryOverlayProps) {
  const {
    unlockedCards,
    unlockCard,
    isCardNew,
    getUnlockedCardsCount,
    getTotalCompletions,
  } = useStore();

  const { playSound } = useSound();

  const [awardedCard, setAwardedCard] = useState<CollectibleCard | null>(null);

  // Calculate performance metrics
  const stars = getStars(moves, optimalMoves);
  const isPerfect = isPerfectRun(moves, optimalMoves, hintsUsed);
  const unlockedCardsCount = getUnlockedCardsCount();
  const totalCompletions = getTotalCompletions('hanoi');

  // Award card on victory
  useEffect(() => {
    if (!visible) return;

    const card = determineAwardedCard(
      levelId,
      stars,
      hintsUsed,
      unlockedCards,
      totalCompletions
    );

    if (card) {
      setAwardedCard(card);
      unlockCard(card.id);
    } else {
      setAwardedCard(null);
    }
  }, [visible, levelId, stars, hintsUsed, unlockedCards, totalCompletions]);

  // Haptic feedback pattern
  useEffect(() => {
    if (!visible || Platform.OS === 'web') return;

    // Popup appear (100ms)
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 100);

    // Card flip (1200ms)
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      playSound('disk_place', 0.6); // Placeholder for card_flip sound
    }, 1200);

    // Mascot speech (2500ms)
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 2500);
  }, [visible]);

  if (!visible) return null;

  const mascotMessage = getMascotMessage(
    isPerfect,
    stars,
    awardedCard?.rarity || null
  );

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <Animated.View style={styles.backdrop} entering={FadeIn.duration(300)} />

      {/* Confetti */}
      <Confetti type="emoji" loop={false} />

      {/* Main Popup */}
      <VictoryPopup
        stars={stars}
        awardedCard={awardedCard}
        isCardNew={awardedCard ? isCardNew(awardedCard.id) : false}
        unlockedCardsCount={unlockedCardsCount}
        moves={moves}
        optimalMoves={optimalMoves}
        timeElapsed={timeElapsed}
        isPerfect={isPerfect}
        hasNextLevel={hasNextLevel}
        onNextLevel={onNextLevel}
        onReplay={onReplay}
        onHome={onHome}
      />

      {/* Mascot Celebration */}
      <VictoryMascot message={mascotMessage} delay={2500} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});
