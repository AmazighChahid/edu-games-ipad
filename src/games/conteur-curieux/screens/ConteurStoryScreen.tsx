/**
 * ConteurStoryScreen Component
 *
 * Écran de lecture de l'histoire pour Le Conteur Curieux
 * - Affichage du texte avec highlighting des mots de vocabulaire
 * - Lecteur audio (quand disponible)
 * - Navigation paragraphe par paragraphe
 * - Popup de vocabulaire au tap
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeInLeft,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily } from '@/theme';
import { useAccessibilityAnimations } from '@/hooks';

import { PlumeMascot } from '../components/PlumeMascot';
import { AudioPlayer } from '../components/AudioPlayer';
import { VocabularyBubble } from '../components/VocabularyBubble';
import { getLevelById } from '../data/stories';
import type { ConteurLevel, ReadingMode, VocabularyWord, PlumeExpression } from '../types';

// Messages de Plume pendant la lecture
const PLUME_READING_MESSAGES = {
  start: [
    'C\'est parti pour l\'histoire !',
    'Installe-toi bien, on commence !',
    'Prêt ? Bonne lecture !',
  ],
  middle: [
    'Continue, c\'est passionnant !',
    'Tu lis très bien !',
    'L\'histoire est captivante !',
  ],
  end: [
    'Bravo, tu as tout lu !',
    'Super lecture !',
    'Prêt pour les questions ?',
  ],
};

interface ConteurStoryScreenProps {
  levelId?: string;
  mode?: ReadingMode;
  onFinish?: () => void;
}

export function ConteurStoryScreen({ levelId, mode, onFinish }: ConteurStoryScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId: string; mode: string }>();
  const { width, height } = useWindowDimensions();
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  // Récupérer le niveau
  const resolvedLevelId = levelId || params.levelId;
  const resolvedMode = (mode || params.mode || 'mixed') as ReadingMode;
  const level = useMemo(() => getLevelById(resolvedLevelId || ''), [resolvedLevelId]);

  // État
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [vocabularyPopup, setVocabularyPopup] = useState<VocabularyWord | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);
  const [readingStartTime] = useState(Date.now());

  // Responsive
  const isTablet = width >= 768;
  const isLandscape = width > height;

  // Données dérivées
  const totalParagraphs = level?.story.paragraphs.length || 0;
  const isFirstParagraph = currentParagraph === 0;
  const isLastParagraph = currentParagraph === totalParagraphs - 1;
  const progressPercent = totalParagraphs > 0 ? ((currentParagraph + 1) / totalParagraphs) * 100 : 0;

  // Message de Plume basé sur la progression
  const plumeData = useMemo(() => {
    if (!level) return { message: '', expression: 'neutral' as PlumeExpression };

    let messages: string[];
    let expression: PlumeExpression = 'reading';

    if (currentParagraph === 0) {
      messages = PLUME_READING_MESSAGES.start;
    } else if (isLastParagraph) {
      messages = PLUME_READING_MESSAGES.end;
      expression = 'happy';
    } else {
      messages = PLUME_READING_MESSAGES.middle;
    }

    return {
      message: messages[Math.floor(Math.random() * messages.length)],
      expression,
    };
  }, [currentParagraph, isLastParagraph, level]);

  // Texte du paragraphe actuel avec mots de vocabulaire surlignés
  const currentText = useMemo(() => {
    if (!level) return '';
    return level.story.paragraphs[currentParagraph] || '';
  }, [level, currentParagraph]);

  // Mots de vocabulaire dans le paragraphe actuel
  const vocabularyInParagraph = useMemo(() => {
    if (!level?.story.vocabulary) return [];
    return level.story.vocabulary.filter((v) =>
      currentText.toLowerCase().includes(v.word.toLowerCase())
    );
  }, [level, currentText]);

  // Handlers
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Quitter la lecture ?',
      'Ta progression sera perdue.',
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: () => router.back() },
      ]
    );
  }, [router]);

  const handlePause = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAudioPlaying(false);
    Alert.alert('Pause', 'Prends ton temps !', [{ text: 'Reprendre' }]);
  }, []);

  const handlePreviousParagraph = useCallback(() => {
    if (isFirstParagraph) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentParagraph((prev) => prev - 1);
  }, [isFirstParagraph]);

  const handleNextParagraph = useCallback(() => {
    if (isLastParagraph) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentParagraph((prev) => prev + 1);
  }, [isLastParagraph]);

  const handleFinishReading = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (onFinish) {
      onFinish();
    } else {
      // Calculer le temps de lecture
      const readingTimeSeconds = Math.floor((Date.now() - readingStartTime) / 1000);

      router.push({
        pathname: '/(games)/conteur-curieux/questions',
        params: {
          levelId: resolvedLevelId,
          mode: resolvedMode,
          readingTime: readingTimeSeconds.toString(),
        },
      });
    }
  }, [onFinish, router, resolvedLevelId, resolvedMode, readingStartTime]);

  const handleVocabularyTap = useCallback((word: VocabularyWord) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVocabularyPopup(word);
  }, []);

  const handleCloseVocabulary = useCallback(() => {
    setVocabularyPopup(null);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsAudioPlaying((prev) => !prev);
  }, []);

  // Rendu du texte avec mots de vocabulaire cliquables
  const renderTextWithVocabulary = useCallback(() => {
    if (vocabularyInParagraph.length === 0) {
      return <Text style={styles.paragraphText}>{currentText}</Text>;
    }

    // Créer une regex pour tous les mots de vocabulaire
    const vocabWords = vocabularyInParagraph.map((v) => v.word);
    const regex = new RegExp(`(${vocabWords.join('|')})`, 'gi');
    const parts = currentText.split(regex);

    return (
      <Text style={styles.paragraphText}>
        {parts.map((part, index) => {
          const vocabWord = vocabularyInParagraph.find(
            (v) => v.word.toLowerCase() === part.toLowerCase()
          );

          if (vocabWord) {
            return (
              <Text
                key={index}
                style={styles.vocabularyWord}
                onPress={() => handleVocabularyTap(vocabWord)}
              >
                {part}
              </Text>
            );
          }

          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  }, [currentText, vocabularyInParagraph, handleVocabularyTap]);

  if (!level) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>Histoire introuvable</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleBack}>
          <Text style={styles.headerButtonText}>{'<'}</Text>
        </Pressable>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentParagraph + 1} / {totalParagraphs}
          </Text>
        </View>

        <Pressable style={styles.headerButton} onPress={handlePause}>
          <Text style={styles.headerButtonText}>⏸️</Text>
        </Pressable>
      </View>

      {/* Main content */}
      <View style={[styles.content, isTablet && isLandscape && styles.contentLandscape]}>
        {/* Story illustration placeholder */}
        {isTablet && isLandscape && (
          <View style={styles.illustrationSection}>
            <View style={styles.illustrationPlaceholder}>
              <Text style={styles.illustrationEmoji}>{level.story.emoji}</Text>
              <Text style={styles.illustrationTitle}>{level.story.title}</Text>
            </View>

            {/* Plume on tablet */}
            <View style={styles.plumeTablet}>
              <PlumeMascot
                expression={plumeData.expression}
                size="medium"
                message={plumeData.message}
                showBubble
                bubblePosition="right"
              />
            </View>
          </View>
        )}

        {/* Text section */}
        <View style={styles.textSection}>
          {/* Story title (mobile only) */}
          {(!isTablet || !isLandscape) && (
            <Animated.View
              style={styles.titleRow}
              entering={shouldAnimate ? FadeIn.duration(getDuration(300)) : undefined}
            >
              <Text style={styles.storyEmoji}>{level.story.emoji}</Text>
              <Text style={styles.storyTitle}>{level.story.title}</Text>
            </Animated.View>
          )}

          {/* Paragraph text */}
          <ScrollView
            style={styles.textScrollView}
            contentContainerStyle={styles.textContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              key={currentParagraph}
              entering={
                shouldAnimate
                  ? currentParagraph > 0
                    ? SlideInRight.duration(getDuration(300))
                    : FadeIn.duration(getDuration(300))
                  : undefined
              }
            >
              {renderTextWithVocabulary()}
            </Animated.View>

            {/* Vocabulary hint */}
            {vocabularyInParagraph.length > 0 && (
              <Text style={styles.vocabularyHint}>
                💡 Tape sur les mots soulignés pour voir leur définition
              </Text>
            )}
          </ScrollView>

          {/* Audio player (if mode includes audio) */}
          {(resolvedMode === 'listen' || resolvedMode === 'mixed') && level.story.audioUrl && (
            <View style={styles.audioSection}>
              <AudioPlayer
                duration={level.story.readingTime * 60}
                currentTime={audioPosition}
                isPlaying={isAudioPlaying}
                onPlayPause={handlePlayPause}
                onSeek={setAudioPosition}
              />
            </View>
          )}

          {/* Plume compact (mobile) */}
          {(!isTablet || !isLandscape) && (
            <View style={styles.plumeCompact}>
              <PlumeMascot
                expression={plumeData.expression}
                size="small"
              />
            </View>
          )}
        </View>
      </View>

      {/* Navigation buttons */}
      <View style={styles.navigation}>
        <Pressable
          style={[styles.navButton, isFirstParagraph && styles.navButtonDisabled]}
          onPress={handlePreviousParagraph}
          disabled={isFirstParagraph}
        >
          <Text style={[styles.navButtonText, isFirstParagraph && styles.navButtonTextDisabled]}>
            {'<'} Précédent
          </Text>
        </Pressable>

        {isLastParagraph ? (
          <Pressable style={styles.finishButton} onPress={handleFinishReading}>
            <Text style={styles.finishButtonText}>Questions ! 🎯</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.nextButton} onPress={handleNextParagraph}>
            <Text style={styles.nextButtonText}>Suivant {'>'}</Text>
          </Pressable>
        )}
      </View>

      {/* Vocabulary popup */}
      <VocabularyBubble
        word={vocabularyPopup}
        visible={!!vocabularyPopup}
        onClose={handleCloseVocabulary}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  headerButtonText: {
    fontSize: 20,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9B59B6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#718096',
    marginTop: spacing[1],
  },

  // Content
  content: {
    flex: 1,
  },
  contentLandscape: {
    flexDirection: 'row',
  },

  // Illustration (tablet)
  illustrationSection: {
    width: '55%',
    backgroundColor: '#E8D4F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  illustrationPlaceholder: {
    width: '80%',
    aspectRatio: 4 / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  illustrationEmoji: {
    fontSize: 80,
    marginBottom: spacing[3],
  },
  illustrationTitle: {
    fontSize: 24,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
  },
  plumeTablet: {
    position: 'absolute',
    bottom: spacing[6],
    left: spacing[4],
  },

  // Text section
  textSection: {
    flex: 1,
    padding: spacing[4],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  storyEmoji: {
    fontSize: 36,
  },
  storyTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
  },
  textScrollView: {
    flex: 1,
  },
  textContent: {
    paddingBottom: spacing[4],
  },
  paragraphText: {
    fontSize: 20,
    fontFamily: fontFamily.regular,
    color: '#2D3748',
    lineHeight: 32,
  },
  vocabularyWord: {
    color: '#9B59B6',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    fontFamily: fontFamily.medium,
  },
  vocabularyHint: {
    marginTop: spacing[4],
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Audio section
  audioSection: {
    marginTop: spacing[4],
  },

  // Plume compact
  plumeCompact: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
  },

  // Navigation
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  navButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFFFFF',
    ...shadows.sm,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: '#718096',
  },
  navButtonTextDisabled: {
    color: '#A0AEC0',
  },
  nextButton: {
    flex: 1,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    ...shadows.md,
    shadowColor: '#9B59B6',
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },
  finishButton: {
    flex: 1,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    backgroundColor: '#7BC74D',
    alignItems: 'center',
    ...shadows.md,
    shadowColor: '#7BC74D',
  },
  finishButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: spacing[4],
  },
  errorText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  errorButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
  },
  errorButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fontFamily.medium,
  },
});

export default ConteurStoryScreen;
