/**
 * ConteurVictoryScreen Component
 *
 * Écran de victoire et récompenses pour Le Conteur Curieux
 * - Confettis
 * - Étoiles animées
 * - Carte collectionnable avec flip 3D
 * - Plume qui célèbre
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import { PageContainer } from '../../../components/common/PageContainer';

import { Confetti } from '../../../components/common';
import { PlumeMascot } from '../components/PlumeMascot';
import { CollectibleCard } from '../components/CollectibleCard';
import { StarsRow } from '../components/StarsRow';
import { SkillBadge } from '../components/SkillBadge';
import { RaysEffect } from '../components/RaysEffect';
import { getLevelById } from '../data/stories';
import type { ConteurLevel, EarnedSkill, QuestionCategory } from '../types';

// Messages de Plume pour la victoire
const PLUME_VICTORY_MESSAGES = {
  perfect: [
    'INCROYABLE ! Tu as tout compris !',
    'PARFAIT ! Quelle lecture !',
    'WOW ! Tu es un champion de lecture !',
  ],
  great: [
    'BRAVO ! Super travail !',
    'GÉNIAL ! Tu as très bien compris !',
    'EXCELLENT ! Continue comme ça !',
  ],
  good: [
    'BIEN JOUÉ ! Tu progresses !',
    'SUPER ! Tu t\'améliores !',
    'C\'est bien ! Tu peux être fier !',
  ],
  encourage: [
    'Tu as terminé ! C\'est déjà super !',
    'Bravo d\'avoir essayé !',
    'Continue, tu vas y arriver !',
  ],
};

// Compétences possibles par catégorie
const SKILL_CONFIG: Record<QuestionCategory, EarnedSkill> = {
  factual: { id: 'factual', emoji: Icons.search, label: 'Observation', category: 'factual' },
  sequential: { id: 'sequential', emoji: Icons.list, label: 'Séquence', category: 'sequential' },
  causal: { id: 'causal', emoji: Icons.link, label: 'Cause & Effet', category: 'causal' },
  emotional: { id: 'emotional', emoji: Icons.thinking, label: 'Émotions', category: 'emotional' },
  inferential: { id: 'inferential', emoji: Icons.thinking, label: 'Inférence', category: 'inferential' },
  opinion: { id: 'opinion', emoji: Icons.lightbulb, label: 'Opinion', category: 'opinion' },
};

interface ConteurVictoryScreenProps {
  levelId?: string;
  stars?: 1 | 2 | 3 | 4 | 5;
  score?: number;
  readingTime?: number;
}

export function ConteurVictoryScreen({
  levelId,
  stars: propStars,
  score: propScore,
  readingTime: propReadingTime,
}: ConteurVictoryScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{
    levelId: string;
    stars: string;
    score: string;
    readingTime: string;
  }>();
  const { width, height } = useWindowDimensions();
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // Récupérer les données
  const resolvedLevelId = levelId || params.levelId;
  const stars = (propStars || parseInt(params.stars || '3', 10)) as 1 | 2 | 3 | 4 | 5;
  const score = propScore || parseInt(params.score || '80', 10);
  const readingTime = propReadingTime || parseInt(params.readingTime || '0', 10);
  const level = useMemo(() => getLevelById(resolvedLevelId || ''), [resolvedLevelId]);

  // État
  const [showCard, setShowCard] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  // Responsive
  const isTablet = width >= 768;

  // Message de Plume basé sur le score
  const plumeMessage = useMemo(() => {
    let messages: string[];
    if (stars === 5) {
      messages = PLUME_VICTORY_MESSAGES.perfect;
    } else if (stars >= 4) {
      messages = PLUME_VICTORY_MESSAGES.great;
    } else if (stars >= 3) {
      messages = PLUME_VICTORY_MESSAGES.good;
    } else {
      messages = PLUME_VICTORY_MESSAGES.encourage;
    }
    return messages[Math.floor(Math.random() * messages.length)];
  }, [stars]);

  // Compétences développées basées sur les questions de l'histoire
  const earnedSkills = useMemo<EarnedSkill[]>(() => {
    if (!level?.story.questions) return [];

    // Récupérer les catégories uniques des questions
    const categories = new Set<QuestionCategory>();
    level.story.questions.forEach((q) => {
      if (q.category) {
        categories.add(q.category);
      }
    });

    // Convertir en skills (max 4 pour l'affichage)
    return Array.from(categories)
      .slice(0, 4)
      .map((cat) => SKILL_CONFIG[cat]);
  }, [level]);

  // Haptic feedback initial
  useEffect(() => {
    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Afficher la carte après les étoiles
  useEffect(() => {
    if (level?.story.collectible) {
      const timer = setTimeout(() => {
        setShowCard(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [level]);

  // Handlers
  const handleNewStory = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(games)/06-conteur-curieux');
  }, [router]);

  const handleReplay = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace({
      pathname: '/(games)/06-conteur-curieux/story',
      params: { levelId: resolvedLevelId },
    });
  }, [router, resolvedLevelId]);

  const handleHome = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/');
  }, [router]);

  const handleCardRevealed = useCallback(() => {
    setCardRevealed(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  // Format reading time
  const formattedReadingTime = useMemo(() => {
    const mins = Math.floor(readingTime / 60);
    const secs = readingTime % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [readingTime]);

  return (
    <View style={styles.container}>
      <PageContainer
        variant="neutral"
        scrollable={false}
        safeAreaEdges={['top']}
      >
        {/* Animated Confetti */}
        {shouldAnimate && <Confetti type="shapes" count={25} duration={4000} loop={false} />}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        {/* Title with Rays */}
        <Animated.View
          style={styles.titleSection}
          entering={shouldAnimate ? FadeInDown.duration(getDuration(500)) : undefined}
        >
          {/* Rays behind title */}
          {shouldAnimate && (
            <View style={styles.raysContainer}>
              <RaysEffect size={250} color="rgba(255,255,255,0.2)" rayCount={12} duration={20000} />
            </View>
          )}
          <Text style={styles.title}>BRAVO !</Text>
          <Text style={styles.subtitle}>Tu as terminé l'histoire !</Text>
        </Animated.View>

        {/* Stars */}
        <Animated.View
          style={styles.starsSection}
          entering={shouldAnimate ? ZoomIn.delay(300).duration(getDuration(400)) : undefined}
        >
          <StarsRow
            stars={stars}
            size={isTablet ? 'large' : 'medium'}
            animated={shouldAnimate}
            initialDelay={500}
          />
        </Animated.View>

        {/* Plume */}
        <Animated.View
          style={styles.plumeSection}
          entering={shouldAnimate ? FadeInUp.delay(800).duration(getDuration(400)) : undefined}
        >
          <PlumeMascot
            expression="celebrating"
            size="medium"
            message={plumeMessage}
            showBubble
            bubblePosition="top"
          />
        </Animated.View>

        {/* Stats card */}
        <Animated.View
          style={styles.statsCard}
          entering={shouldAnimate ? FadeInUp.delay(1000).duration(getDuration(400)) : undefined}
        >
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Compréhension</Text>
            <Text style={[styles.statValue, score >= 80 && styles.statValueGood]}>
              {score}%
            </Text>
          </View>
          {readingTime > 0 && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Temps de lecture</Text>
              <Text style={styles.statValue}>{formattedReadingTime}</Text>
            </View>
          )}
          {level && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Histoire</Text>
              <Text style={styles.statValue}>{level.story.emoji} {level.story.title}</Text>
            </View>
          )}
        </Animated.View>

        {/* Skills Section */}
        {earnedSkills.length > 0 && (
          <Animated.View
            style={styles.skillsSection}
            entering={shouldAnimate ? FadeInUp.delay(1200).duration(getDuration(400)) : undefined}
          >
            <Text style={styles.skillsTitle}>Compétences développées</Text>
            <View style={styles.skillsGrid}>
              {earnedSkills.map((skill, index) => (
                <SkillBadge
                  key={skill.id}
                  emoji={skill.emoji}
                  label={skill.label}
                  color="#5B8DEE"
                  delay={1300 + index * 100}
                  animated={shouldAnimate}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Collectible card */}
        {level?.story.collectible && showCard && (
          <Animated.View
            style={styles.cardSection}
            entering={shouldAnimate ? FadeIn.duration(getDuration(300)) : undefined}
          >
            <Text style={styles.cardTitle}>
              {cardRevealed ? 'Nouvelle carte !' : 'Tu as gagné une carte !'}
            </Text>
            <CollectibleCard
              collectible={level.story.collectible}
              startFlipped={!cardRevealed}
              revealDelay={800}
              onRevealed={handleCardRevealed}
              size={isTablet ? 'large' : 'medium'}
            />
          </Animated.View>
        )}

        {/* Buttons */}
        <Animated.View
          style={styles.buttonsContainer}
          entering={shouldAnimate ? FadeInUp.delay(1500).duration(getDuration(400)) : undefined}
        >
          <Pressable
            style={styles.primaryButton}
            onPress={handleNewStory}
            accessibilityLabel="Choisir une nouvelle histoire"
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Nouvelle histoire</Text>
          </Pressable>

          <View style={styles.secondaryButtons}>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleReplay}
              accessibilityLabel="Relire cette histoire"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Relire</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleHome}
              accessibilityLabel="Retourner à l'accueil"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Accueil</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
      </PageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9B59B6',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
    paddingBottom: spacing[12],
  },

  // Title
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: {
    fontSize: 48,
    fontFamily: fontFamily.displayBold,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: fontFamily.medium,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing[1],
  },

  // Stars
  starsSection: {
    marginBottom: spacing[4],
  },

  // Plume
  plumeSection: {
    marginBottom: spacing[4],
  },

  // Stats card
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    width: '100%',
    maxWidth: 340,
    marginBottom: spacing[6],
    ...shadows.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  statLabel: {
    fontSize: 18,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  statValueGood: {
    color: '#7BC74D',
  },

  // Rays
  raysContainer: {
    position: 'absolute',
    top: -100,
    left: '50%',
    marginLeft: -125,
    zIndex: -1,
  },

  // Skills section
  skillsSection: {
    width: '100%',
    maxWidth: 340,
    marginBottom: spacing[6],
    alignItems: 'center',
  },
  skillsTitle: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#FFFFFF',
    marginBottom: spacing[3],
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2],
  },

  // Card section
  cardSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fontFamily.displayBold,
    color: '#FFFFFF',
    marginBottom: spacing[4],
  },

  // Buttons
  buttonsContainer: {
    width: '100%',
    maxWidth: 340,
    gap: spacing[3],
  },
  primaryButton: {
    minHeight: touchTargets.minimum,
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#9B59B6',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  secondaryButton: {
    flex: 1,
    minHeight: touchTargets.minimum,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#FFFFFF',
  },
});

export default ConteurVictoryScreen;
