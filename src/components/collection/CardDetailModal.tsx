/**
 * CardDetailModal Component
 * Detailed view of a card with animations and full information
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import {
  Card,
  RARITY_CONFIG,
  CATEGORY_CONFIG,
  getTotalCardsCount,
} from '../../data/cards';
import { colors } from '../../theme';
import { UnlockedCardData } from '../../store/slices/collectionSlice';

interface CardDetailModalProps {
  visible: boolean;
  card: Card | null;
  cardData?: UnlockedCardData;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
  cardPosition?: { current: number; total: number };
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  visible,
  card,
  cardData,
  onClose,
  onNavigate,
  canNavigatePrev = false,
  canNavigateNext = false,
  cardPosition,
}) => {
  // Animation values
  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.8);
  const cardRotateY = useSharedValue(-15);
  const floatY = useSharedValue(0);
  const shineX = useSharedValue(-200);
  const sparkleOpacity = useSharedValue(0.3);
  const panelTranslateX = useSharedValue(50);
  const panelOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible && card) {
      // Entry animations
      overlayOpacity.value = withTiming(1, { duration: 300 });
      cardScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      cardRotateY.value = withSpring(0, { damping: 15, stiffness: 80 });
      panelTranslateX.value = withDelay(200, withSpring(0, { damping: 15 }));
      panelOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));

      // Continuous animations
      floatY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      shineX.value = withRepeat(
        withSequence(
          withTiming(400, { duration: 3000, easing: Easing.linear }),
          withTiming(-200, { duration: 0 })
        ),
        -1
      );

      sparkleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      // Exit animations
      overlayOpacity.value = withTiming(0, { duration: 200 });
      cardScale.value = withTiming(0.8, { duration: 200 });
      panelOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, card]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { rotateY: `${cardRotateY.value}deg` },
      { translateY: floatY.value },
    ],
  }));

  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shineX.value }, { rotate: '45deg' }],
  }));

  const panelStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value,
    transform: [{ translateX: panelTranslateX.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  if (!card) return null;

  const rarityConfig = RARITY_CONFIG[card.rarity];
  const categoryConfig = CATEGORY_CONFIG[card.category];
  const unlockDate = cardData?.unlockedAt
    ? new Date(cardData.unlockedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        {/* Sparkles */}
        <Animated.Text style={[styles.sparkle, styles.sparkle1, sparkleStyle]}>
          ✨
        </Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle2, sparkleStyle]}>
          ⭐
        </Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle3, sparkleStyle]}>
          💫
        </Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle4, sparkleStyle]}>
          ✨
        </Animated.Text>
        <Animated.Text style={[styles.sparkle, styles.sparkle5, sparkleStyle]}>
          ⭐
        </Animated.Text>

        {/* Close button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>

        <View style={styles.content}>
          {/* Large card */}
          <Animated.View style={[styles.largeCard, cardStyle]}>
            {/* Card glow */}
            <View
              style={[
                styles.cardGlow,
                { shadowColor: rarityConfig.color },
              ]}
            />

            {/* Card container */}
            <View
              style={[styles.cardContainer, { borderColor: rarityConfig.color }]}
            >
              {/* Shine effect */}
              <Animated.View style={[styles.shine, shineStyle]}>
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                  style={styles.shineGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>

              {/* Header */}
              <LinearGradient
                colors={rarityConfig.gradientColors}
                style={styles.cardHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.rarityBadge}>
                  <Text style={styles.rarityIcon}>👑</Text>
                  <Text
                    style={[
                      styles.rarityText,
                      card.rarity === 'legendary' && styles.rarityTextDark,
                    ]}
                  >
                    {rarityConfig.label}
                  </Text>
                </View>
                <Text style={styles.cardNumber}>#{String(card.number).padStart(3, '0')}</Text>
              </LinearGradient>

              {/* Body */}
              <View style={styles.cardBody}>
                <Text style={styles.cardEmoji}>{card.emoji}</Text>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>

                <View style={styles.traitsContainer}>
                  {card.traits.map((trait, index) => (
                    <View key={index} style={styles.traitBadge}>
                      <Text style={styles.traitText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Footer */}
              {unlockDate && (
                <View style={styles.cardFooter}>
                  <Text style={styles.unlockInfo}>
                    Débloqué le <Text style={styles.unlockDate}>{unlockDate}</Text>
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Info panel */}
          <Animated.View style={[styles.infoPanel, panelStyle]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.infoPanelHeader}>
                <LinearGradient
                  colors={rarityConfig.gradientColors}
                  style={styles.infoIcon}
                >
                  <Text style={styles.infoIconText}>{card.emoji}</Text>
                </LinearGradient>
                <View style={styles.infoTitle}>
                  <Text style={styles.infoName}>{card.name}</Text>
                  <Text style={styles.infoSubtitle}>
                    Carte {rarityConfig.label} • {categoryConfig.label}
                  </Text>
                </View>
              </View>

              {/* Story */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>📖 Histoire</Text>
                <Text style={styles.storyText}>{card.story}</Text>
              </View>

              {/* Stats */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>📊 Statistiques</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{card.stats.intelligence}</Text>
                    <Text style={styles.statLabel}>Intelligence</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{card.stats.speed}</Text>
                    <Text style={styles.statLabel}>Rapidité</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{card.stats.strategy}</Text>
                    <Text style={styles.statLabel}>Stratégie</Text>
                  </View>
                </View>
              </View>

              {/* Unlock source */}
              {cardData && (
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>🎮 Obtenue dans</Text>
                  <View style={styles.activityBadge}>
                    <Text style={styles.activityIcon}>🏰</Text>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityName}>
                        {card.unlockCondition.activity || 'Aventure'}
                      </Text>
                      <Text style={styles.activitySubtext}>
                        {card.unlockCondition.requirement ||
                          `Niveau ${card.unlockCondition.level || '?'}`}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Position */}
              {cardPosition && (
                <View style={styles.positionContainer}>
                  <View style={styles.positionInfo}>
                    <Text style={styles.positionEmoji}>📚</Text>
                    <Text style={styles.positionText}>
                      Carte{' '}
                      <Text style={styles.positionHighlight}>
                        {cardPosition.current}
                      </Text>{' '}
                      sur{' '}
                      <Text style={styles.positionHighlight}>
                        {cardPosition.total}
                      </Text>
                    </Text>
                  </View>
                  {(canNavigatePrev || canNavigateNext) && onNavigate && (
                    <View style={styles.navCards}>
                      <Pressable
                        style={[
                          styles.navCardBtn,
                          !canNavigatePrev && styles.navCardBtnDisabled,
                        ]}
                        onPress={() => canNavigatePrev && onNavigate('prev')}
                        disabled={!canNavigatePrev}
                      >
                        <Text style={styles.navCardBtnText}>‹</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.navCardBtn,
                          !canNavigateNext && styles.navCardBtnDisabled,
                        ]}
                        onPress={() => canNavigateNext && onNavigate('next')}
                        disabled={!canNavigateNext}
                      >
                        <Text style={styles.navCardBtnText}>›</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
  },
  sparkle1: { top: '15%', left: '10%' },
  sparkle2: { top: '25%', right: '15%' },
  sparkle3: { bottom: '30%', left: '8%' },
  sparkle4: { bottom: '20%', right: '10%' },
  sparkle5: { top: '40%', left: '5%' },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#4A5568',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
    paddingHorizontal: 40,
  },
  largeCard: {
    width: 320,
    height: 450,
  },
  cardGlow: {
    position: 'absolute',
    inset: -10,
    borderRadius: 34,
    shadowOpacity: 0.5,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 0 },
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    borderRadius: 28,
    borderWidth: 6,
    overflow: 'hidden',
    boxShadow: '0px 25px 60px rgba(0, 0, 0, 0.4)',
    elevation: 10,
  },
  shine: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 600,
    zIndex: 10,
  },
  shineGradient: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rarityIcon: {
    fontSize: 14,
  },
  rarityText: {
    fontSize: 11,
    fontFamily: 'Fredoka_700Bold',
    color: '#4A4A4A',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rarityTextDark: {
    color: '#4A4A4A',
  },
  cardNumber: {
    fontSize: 12,
    fontFamily: 'Fredoka_700Bold',
    color: 'rgba(74, 74, 74, 0.6)',
  },
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  cardEmoji: {
    fontSize: 120,
    textShadow: '0px 8px 20px rgba(0,0,0,0.15)',
  },
  cardName: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 26,
    color: '#4A5568',
    marginTop: 15,
    textAlign: 'center',
  },
  cardTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 14,
    color: colors.home.categories.spatial,
    marginTop: 5,
  },
  traitsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  traitBadge: {
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.2)',
  },
  traitText: {
    fontSize: 12,
    fontFamily: 'Fredoka_700Bold',
    color: colors.home.categories.logic,
  },
  cardFooter: {
    backgroundColor: 'rgba(139, 90, 43, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  unlockInfo: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#8B5A2B',
  },
  unlockDate: {
    fontFamily: 'Nunito_700Bold',
    color: colors.home.categories.logic,
  },
  infoPanel: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28,
    padding: 35,
    width: 400,
    maxHeight: 500,
    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(91, 141, 238, 0.2)',
    borderStyle: 'dashed',
  },
  infoIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontSize: 30,
  },
  infoTitle: {
    flex: 1,
  },
  infoName: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 22,
    color: '#4A5568',
  },
  infoSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 14,
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  storyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 24,
    color: colors.home.categories.logic,
  },
  statLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 2,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.2)',
    padding: 14,
    borderRadius: 16,
  },
  activityIcon: {
    fontSize: 28,
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 15,
    color: '#4A5568',
    textTransform: 'capitalize',
  },
  activitySubtext: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#718096',
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  positionEmoji: {
    fontSize: 24,
  },
  positionText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#4A5568',
  },
  positionHighlight: {
    fontFamily: 'Nunito_700Bold',
    color: colors.home.categories.spatial,
  },
  navCards: {
    flexDirection: 'row',
    gap: 8,
  },
  navCardBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCardBtnDisabled: {
    opacity: 0.4,
  },
  navCardBtnText: {
    fontSize: 24,
    color: '#4A5568',
    fontWeight: '600',
  },
});

export default CardDetailModal;
