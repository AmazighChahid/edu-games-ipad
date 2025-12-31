/**
 * ConteurStoryScreen Component
 *
 * Écran de lecture de l'histoire pour Le Conteur Curieux
 * - Affichage du texte avec highlighting des mots de vocabulaire
 * - Lecteur audio (quand disponible)
 * - Navigation paragraphe par paragraphe
 * - Popup de vocabulaire au tap
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily, touchTargets } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import { PageContainer } from '../../../components/common/PageContainer';
import { ScreenHeader } from '../../../components/common/ScreenHeader';

import { PlumeMascot } from '../components/PlumeMascot';
import { AudioPlayer } from '../components/AudioPlayer';
import { VocabularyBubble } from '../components/VocabularyBubble';
import { StoryIllustration } from '../components/StoryIllustration';
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

  // Ref pour le FlatList horizontal
  const flatListRef = useRef<FlatList>(null);

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
    const newIndex = currentParagraph - 1;
    setCurrentParagraph(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  }, [isFirstParagraph, currentParagraph]);

  const handleNextParagraph = useCallback(() => {
    if (isLastParagraph) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newIndex = currentParagraph + 1;
    setCurrentParagraph(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  }, [isLastParagraph, currentParagraph]);

  // Handler pour le scroll horizontal manuel
  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== currentParagraph && newIndex >= 0 && newIndex < totalParagraphs) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentParagraph(newIndex);
    }
  }, [currentParagraph, totalParagraphs, width]);

  const handleFinishReading = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (onFinish) {
      onFinish();
    } else {
      // Calculer le temps de lecture
      const readingTimeSeconds = Math.floor((Date.now() - readingStartTime) / 1000);

      router.push({
        pathname: '/(games)/06-conteur-curieux/questions',
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

  if (!level) {
    return (
      <PageContainer variant="neutral" safeAreaEdges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>{Icons.thinking}</Text>
          <Text style={styles.errorText}>Histoire introuvable</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Pressable>
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="neutral" scrollable={false} safeAreaEdges={['top']}>
      {/* Header */}
      <ScreenHeader
        variant="game"
        title={level.story.title}
        emoji={level.story.emoji}
        onBack={handleBack}
        showHelpButton
        onHelpPress={handlePause}
      />

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

      {/* Main content */}
      <View style={[styles.content, isTablet && isLandscape && styles.contentLandscape]}>
        {/* Story illustration */}
        {isTablet && isLandscape && (
          <View style={styles.illustrationSection}>
            <StoryIllustration
              theme={level.story.theme}
              title={level.story.title}
              width={Math.min(400, width * 0.4)}
              height={Math.min(300, height * 0.5)}
              animated={shouldAnimate}
              showTitle
            />

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

          {/* Paragraph text avec scroll horizontal */}
          <View style={styles.paragraphContainer}>
            {/* Chevron gauche */}
            <Pressable
              style={[styles.chevronButton, styles.chevronLeft, isFirstParagraph && styles.chevronDisabled]}
              onPress={handlePreviousParagraph}
              disabled={isFirstParagraph}
              accessibilityLabel="Page précédente"
              accessibilityRole="button"
            >
              <Text style={[styles.chevronText, isFirstParagraph && styles.chevronTextDisabled]}>{Icons.arrowLeft}</Text>
            </Pressable>

            {/* FlatList horizontal */}
            <FlatList
              ref={flatListRef}
              data={level.story.paragraphs}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollEnd}
              initialScrollIndex={currentParagraph}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              keyExtractor={(_, index) => `paragraph-${index}`}
              renderItem={({ item: paragraphText, index }) => {
                // Mots de vocabulaire dans ce paragraphe
                const vocabInThisParagraph = level?.story.vocabulary?.filter((v) =>
                  paragraphText.toLowerCase().includes(v.word.toLowerCase())
                ) || [];

                // Rendu du texte avec vocabulaire
                const renderParagraphText = () => {
                  if (vocabInThisParagraph.length === 0) {
                    return <Text style={styles.paragraphText}>{paragraphText}</Text>;
                  }

                  const vocabWords = vocabInThisParagraph.map((v) => v.word);
                  const regex = new RegExp(`(${vocabWords.join('|')})`, 'gi');
                  const parts = paragraphText.split(regex);

                  return (
                    <Text style={styles.paragraphText}>
                      {parts.map((part: string, partIndex: number) => {
                        const vocabWord = vocabInThisParagraph.find(
                          (v) => v.word.toLowerCase() === part.toLowerCase()
                        );
                        if (vocabWord) {
                          return (
                            <Text
                              key={partIndex}
                              style={styles.vocabularyWord}
                              onPress={() => handleVocabularyTap(vocabWord)}
                            >
                              {part}
                            </Text>
                          );
                        }
                        return <Text key={partIndex}>{part}</Text>;
                      })}
                    </Text>
                  );
                };

                return (
                  <ScrollView
                    style={[styles.textScrollView, { width }]}
                    contentContainerStyle={styles.textContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {renderParagraphText()}
                    {/* Vocabulary hint */}
                    {vocabInThisParagraph.length > 0 && (
                      <Text style={styles.vocabularyHint}>
                        {Icons.lightbulb} Tape sur les mots soulignés pour voir leur définition
                      </Text>
                    )}
                  </ScrollView>
                );
              }}
            />

            {/* Chevron droite */}
            <Pressable
              style={[styles.chevronButton, styles.chevronRight, isLastParagraph && styles.chevronDisabled]}
              onPress={handleNextParagraph}
              disabled={isLastParagraph}
              accessibilityLabel="Page suivante"
              accessibilityRole="button"
            >
              <Text style={[styles.chevronText, isLastParagraph && styles.chevronTextDisabled]}>{Icons.arrowRight}</Text>
            </Pressable>
          </View>

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

      {/* Navigation buttons - Bouton terminer */}
      <View style={styles.navigation}>
        {isLastParagraph ? (
          <Pressable style={styles.finishButton} onPress={handleFinishReading}>
            <Text style={styles.finishButtonText}>Questions ! {Icons.target}</Text>
          </Pressable>
        ) : (
          <View style={styles.pageIndicatorContainer}>
            {level.story.paragraphs.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pageIndicatorDot,
                  index === currentParagraph && styles.pageIndicatorDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Vocabulary popup */}
      <VocabularyBubble
        word={vocabularyPopup}
        visible={!!vocabularyPopup}
        onClose={handleCloseVocabulary}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  // Progress bar (moved below header)
  progressContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
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
    fontSize: 18,
    fontFamily: fontFamily.medium,
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
  plumeTablet: {
    position: 'absolute',
    bottom: spacing[6],
    left: spacing[4],
  },

  // Text section
  textSection: {
    flex: 1,
    paddingTop: spacing[4],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
    paddingHorizontal: spacing[4],
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

  // Paragraph container avec chevrons
  paragraphContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    borderRadius: touchTargets.minimum / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    zIndex: 10,
  },
  chevronLeft: {
    position: 'absolute',
    left: spacing[2],
  },
  chevronRight: {
    position: 'absolute',
    right: spacing[2],
  },
  chevronDisabled: {
    opacity: 0.3,
  },
  chevronText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#9B59B6',
  },
  chevronTextDisabled: {
    color: '#A0AEC0',
  },

  textScrollView: {
    flex: 1,
  },
  textContent: {
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[6],
  },
  paragraphText: {
    fontSize: 24,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    lineHeight: 38,
  },
  vocabularyWord: {
    color: '#9B59B6',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    fontFamily: fontFamily.medium,
  },
  vocabularyHint: {
    marginTop: spacing[4],
    fontSize: 18,
    fontFamily: fontFamily.regular,
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
  finishButton: {
    flex: 1,
    minHeight: touchTargets.minimum,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    backgroundColor: '#7BC74D',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(123, 199, 77, 0.25)',
    elevation: 3,
  },
  finishButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },

  // Page indicators
  pageIndicatorContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[2],
  },
  pageIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8E8E8',
  },
  pageIndicatorDotActive: {
    backgroundColor: '#9B59B6',
    transform: [{ scale: 1.2 }],
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
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  errorButton: {
    backgroundColor: colors.primary.main,
    minHeight: touchTargets.minimum,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: fontFamily.medium,
  },
});

export default ConteurStoryScreen;
