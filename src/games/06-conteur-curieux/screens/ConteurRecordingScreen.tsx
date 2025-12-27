/**
 * ConteurRecordingScreen Component
 *
 * Écran d'enregistrement audio pour Le Conteur Curieux
 * - L'enfant peut enregistrer ce qu'il a compris de l'histoire
 * - Affichage d'un résumé de l'histoire si besoin
 * - Bouton pour passer cette étape
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';

import { PlumeMascot } from '../components/PlumeMascot';
import { getLevelById } from '../data/stories';
import { saveRecording } from '../utils/parentStorage';
import type { PlumeExpression } from '../types';

// Messages de Plume pour l'enregistrement
const PLUME_MESSAGES = {
  intro: [
    'Raconte-moi ce que tu as compris !',
    'Qu\'as-tu retenu de l\'histoire ?',
    'À toi de me raconter !',
  ],
  recording: [
    'Je t\'écoute...',
    'Continue, c\'est super !',
    'Tu racontes très bien !',
  ],
  done: [
    'Bravo, tu as bien raconté !',
    'Super enregistrement !',
    'Tu as très bien résumé !',
  ],
};

interface ConteurRecordingScreenProps {
  levelId?: string;
  stars?: number;
  score?: number;
  readingTime?: number;
}

export function ConteurRecordingScreen({
  levelId,
  stars: propStars,
  score: propScore,
  readingTime: propReadingTime,
}: ConteurRecordingScreenProps) {
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
  const stars = propStars || parseInt(params.stars || '3', 10);
  const score = propScore || parseInt(params.score || '80', 10);
  const readingTimeParam = propReadingTime || parseInt(params.readingTime || '0', 10);
  const level = useMemo(() => getLevelById(resolvedLevelId || ''), [resolvedLevelId]);

  // État
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [plumeState, setPlumeState] = useState<'intro' | 'recording' | 'done'>('intro');

  // Ref pour l'enregistrement
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation du bouton d'enregistrement
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  // Responsive
  const isTablet = width >= 768;

  // Message de Plume
  const plumeMessage = useMemo(() => {
    const messages = PLUME_MESSAGES[plumeState];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [plumeState]);

  // Expression de Plume
  const plumeExpression = useMemo((): PlumeExpression => {
    if (plumeState === 'recording') return 'thinking';
    if (plumeState === 'done') return 'celebrating';
    return 'happy';
  }, [plumeState]);

  // Animation pulse pour l'enregistrement
  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
      pulseOpacity.value = withTiming(0.5, { duration: 200 });
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  // Handlers
  const startRecording = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setPlumeState('recording');
      setRecordingDuration(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Timer pour la durée
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const finalDuration = recordingDuration;
      recordingRef.current = null;

      setIsRecording(false);
      setHasRecorded(true);
      setPlumeState('done');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Sauvegarder l'enregistrement dans le storage parent
      if (uri && level) {
        try {
          await saveRecording({
            id: `recording_${Date.now()}`,
            uri,
            storyId: resolvedLevelId || '',
            storyTitle: level.story.title,
            date: new Date().toISOString(),
            duration: finalDuration,
          });
          console.log('Enregistrement sauvegardé:', uri);
        } catch (saveError) {
          console.error('Erreur sauvegarde enregistrement:', saveError);
        }
      }
    } catch (error) {
      console.error('Erreur arrêt enregistrement:', error);
    }
  }, [recordingDuration, level, resolvedLevelId]);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const handleToggleSummary = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSummary((prev) => !prev);
  }, []);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/(games)/06-conteur-curieux/victory',
      params: {
        levelId: resolvedLevelId,
        stars: stars.toString(),
        score: score.toString(),
        readingTime: readingTimeParam.toString(),
      },
    });
  }, [router, resolvedLevelId, stars, score, readingTimeParam]);

  const handleContinue = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/(games)/06-conteur-curieux/victory',
      params: {
        levelId: resolvedLevelId,
        stars: stars.toString(),
        score: score.toString(),
        readingTime: readingTimeParam.toString(),
      },
    });
  }, [router, resolvedLevelId, stars, score, readingTimeParam]);

  // Format durée
  const formattedDuration = useMemo(() => {
    const mins = Math.floor(recordingDuration / 60);
    const secs = recordingDuration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [recordingDuration]);

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
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Passer</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Raconte l'histoire</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Plume */}
        <Animated.View
          style={styles.plumeSection}
          entering={shouldAnimate ? FadeInDown.duration(getDuration(400)) : undefined}
        >
          <PlumeMascot
            expression={plumeExpression}
            size="medium"
            message={plumeMessage}
            showBubble
            bubblePosition="top"
          />
        </Animated.View>

        {/* Instructions */}
        <Animated.View
          style={styles.instructionsCard}
          entering={shouldAnimate ? FadeInUp.delay(200).duration(getDuration(400)) : undefined}
        >
          <Text style={styles.instructionsTitle}>
            {hasRecorded ? 'Super enregistrement !' : 'Enregistre ce que tu as compris'}
          </Text>
          <Text style={styles.instructionsText}>
            {hasRecorded
              ? 'Tu peux continuer ou enregistrer à nouveau.'
              : 'Appuie sur le micro et raconte l\'histoire avec tes mots. C\'est comme si tu la racontais à un ami !'}
          </Text>
        </Animated.View>

        {/* Bouton résumé */}
        <Animated.View
          entering={shouldAnimate ? FadeInUp.delay(300).duration(getDuration(400)) : undefined}
        >
          <Pressable
            style={[styles.summaryButton, showSummary && styles.summaryButtonActive]}
            onPress={handleToggleSummary}
          >
            <Text style={styles.summaryButtonIcon}>📖</Text>
            <Text style={[styles.summaryButtonText, showSummary && styles.summaryButtonTextActive]}>
              {showSummary ? 'Masquer le résumé' : 'Voir le résumé de l\'histoire'}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Résumé de l'histoire */}
        {showSummary && (
          <Animated.View
            style={styles.summaryCard}
            entering={FadeInUp.duration(getDuration(200))}
          >
            <Text style={styles.summaryLabel}>Résumé de l'histoire</Text>
            <Text style={styles.summaryEmoji}>{level.story.emoji}</Text>
            <Text style={styles.summaryTitle}>{level.story.title}</Text>
            <Text style={styles.summaryText}>
              {level.story.summary || level.story.paragraphs.slice(0, 2).join(' ').substring(0, 200) + '...'}
            </Text>
          </Animated.View>
        )}

        {/* Zone d'enregistrement */}
        <Animated.View
          style={styles.recordingSection}
          entering={shouldAnimate ? FadeInUp.delay(400).duration(getDuration(400)) : undefined}
        >
          {/* Durée */}
          <Text style={styles.duration}>{formattedDuration}</Text>

          {/* Bouton micro avec halo */}
          <View style={styles.micButtonContainer}>
            {/* Halo animé */}
            <Animated.View style={[styles.micHalo, pulseStyle]} />

            <Pressable
              style={[styles.micButton, isRecording && styles.micButtonRecording]}
              onPress={handleToggleRecording}
            >
              <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎙️'}</Text>
            </Pressable>
          </View>

          <Text style={styles.micHint}>
            {isRecording ? 'Appuie pour arrêter' : 'Appuie pour enregistrer'}
          </Text>
        </Animated.View>

        {/* Bouton continuer */}
        {hasRecorded && (
          <Animated.View
            style={styles.continueSection}
            entering={FadeIn.duration(getDuration(300))}
          >
            <Pressable style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Voir mes résultats</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  skipButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: '#718096',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
  },
  headerSpacer: {
    width: 60,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    paddingBottom: spacing[12],
  },

  // Plume
  plumeSection: {
    marginBottom: spacing[4],
  },

  // Instructions
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    width: '100%',
    maxWidth: 360,
    marginBottom: spacing[4],
    alignItems: 'center',
    ...shadows.md,
  },
  instructionsTitle: {
    fontSize: 20,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  instructionsText: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Bouton résumé
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB347',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.round,
    marginBottom: spacing[4],
    gap: spacing[2],
    boxShadow: '0px 2px 4px rgba(255, 179, 71, 0.25)',
    elevation: 3,
  },
  summaryButtonActive: {
    backgroundColor: '#9B59B6',
    boxShadow: '0px 2px 4px rgba(155, 89, 182, 0.25)',
  },
  summaryButtonIcon: {
    fontSize: 18,
  },
  summaryButtonText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: '#FFFFFF',
  },
  summaryButtonTextActive: {
    color: '#FFFFFF',
  },

  // Résumé
  summaryCard: {
    backgroundColor: '#F0E6F5',
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    width: '100%',
    maxWidth: 360,
    marginBottom: spacing[4],
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: '#9B59B6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  summaryEmoji: {
    fontSize: 40,
    marginBottom: spacing[2],
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  summaryText: {
    fontSize: 15,
    fontFamily: fontFamily.regular,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Recording section
  recordingSection: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
  duration: {
    fontSize: 36,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    marginBottom: spacing[4],
  },
  micButtonContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  micHalo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(155, 89, 182, 0.3)',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(155, 89, 182, 0.3)',
    elevation: 5,
  },
  micButtonRecording: {
    backgroundColor: '#E74C3C',
    boxShadow: '0px 4px 8px rgba(231, 76, 60, 0.3)',
  },
  micIcon: {
    fontSize: 40,
  },
  micHint: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: '#718096',
  },

  // Continue
  continueSection: {
    width: '100%',
    maxWidth: 360,
    marginTop: spacing[6],
  },
  continueButton: {
    backgroundColor: '#7BC74D',
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(123, 199, 77, 0.25)',
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
  },

  // Error
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

export default ConteurRecordingScreen;
