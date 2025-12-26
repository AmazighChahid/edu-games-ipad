import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { SequenceDisplay } from './SequenceDisplay';
import { ChoicePanel } from './ChoicePanel';
import { MascotRobot } from './MascotRobot';
import { useSuitesGame } from '../hooks/useSuitesGame';
import { ThemeType, SessionStats, SequenceElement } from '../types';
import { PIXEL_MESSAGES } from '../constants/gameConfig';
import { colors, spacing, textStyles, touchTargets, borderRadius, shadows } from '@/theme';

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// ============================================
// COMPOSANT PRINCIPAL - SUITES LOGIQUES GAME
// ============================================

interface Props {
  theme?: ThemeType;
  initialLevel?: number;
  onSessionEnd?: (stats: SessionStats) => void;
  onExit?: () => void;
}

export const SuitesLogiquesGame: React.FC<Props> = ({
  theme = 'shapes',
  initialLevel = 1,
  onSessionEnd,
  onExit,
}) => {
  const {
    gameState,
    sessionState,
    currentSequence,
    selectAnswer,
    confirmAnswer,
    requestHint,
    nextSequence,
    isSessionComplete,
  } = useSuitesGame({ theme, initialLevel });

  // Message de la mascotte
  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');

  // Initialisation - démarrer une nouvelle séquence
  useEffect(() => {
    setMascotMessage("Bip bip ! Trouve ce qui vient après et clique sur Valider !");
    setMascotEmotion('encouraging');
    nextSequence();
  }, []);

  // Gestion du feedback selon le statut
  useEffect(() => {
    if (gameState.status === 'success') {
      const messages = PIXEL_MESSAGES.success;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('excited'); // Grand sourire pour le succès
    } else if (gameState.status === 'error') {
      const messages = PIXEL_MESSAGES.error;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('encouraging'); // Encourager après une erreur
    } else if (gameState.status === 'hint') {
      setMascotEmotion('thinking'); // Réfléchit pour donner un indice
      // Messages d'indices selon le niveau
      if (gameState.currentHintLevel === 1) {
        setMascotMessage(PIXEL_MESSAGES.hint1);
      } else if (gameState.currentHintLevel === 2) {
        setMascotMessage(PIXEL_MESSAGES.hint2);
      } else if (gameState.currentHintLevel === 3) {
        setMascotMessage(PIXEL_MESSAGES.hint3);
      } else if (gameState.currentHintLevel === 4) {
        setMascotMessage(PIXEL_MESSAGES.hint4);
      }
    }
  }, [gameState.status, gameState.currentHintLevel]);

  // Sélection d'un élément
  const handleSelect = useCallback(
    (element: SequenceElement) => {
      selectAnswer(element);
      // Message pour encourager à valider
      setMascotMessage("Bip ! Clique sur 'Valider' pour confirmer ton choix !");
      setMascotEmotion('happy'); // Sourire quand l'utilisateur sélectionne
    },
    [selectAnswer]
  );

  // Confirmation (appelé automatiquement après sélection)
  const handleConfirm = useCallback(() => {
    if (gameState.selectedAnswer) {
      confirmAnswer();
    }
  }, [gameState.selectedAnswer, confirmAnswer]);

  // Demande d'indice
  const handleHint = useCallback(() => {
    requestHint();
  }, [requestHint]);

  // Passage à la suite suivante
  const handleNext = useCallback(() => {
    if (isSessionComplete) {
      // Fin de session
      if (onSessionEnd) {
        onSessionEnd({
          completed: sessionState.sequencesCompleted,
          correctFirstTry: sessionState.sequencesCorrectFirstTry,
          maxStreak: sessionState.maxStreak,
          totalTime: Date.now() - sessionState.startTime.getTime(),
        });
      }
    } else {
      nextSequence();
      const messages = PIXEL_MESSAGES.start;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('neutral'); // Retour à l'état neutre pour la nouvelle suite
    }
  }, [isSessionComplete, sessionState, nextSequence, onSessionEnd]);

  if (!currentSequence) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.background.primary, colors.background.secondary]}
          style={styles.background}
        >
          <Text style={styles.loadingText}>Chargement...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          colors.background.primary,
          colors.background.secondary,
          '#E0E8F8',
        ]}
        locations={[0, 0.5, 1]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onExit} style={styles.exitButton}>
              <Text style={styles.exitText}>←</Text>
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.headerEmoji}>🔮</Text>
              <Text style={styles.headerTitle}>Suites Logiques</Text>
            </View>

            <View style={styles.levelIndicator}>
              <Text style={styles.levelText}>Niveau {sessionState.currentLevel}</Text>
              <Text style={styles.progressText}>
                {sessionState.sequencesCompleted} / 8
              </Text>
            </View>
          </View>

          {/* Robot mascotte avec émotions */}
          <MascotRobot
            message={mascotMessage}
            emotion={mascotEmotion}
            visible={true}
          />

          {/* Zone de la suite */}
          <View style={styles.sequenceArea}>
            <SequenceDisplay
              sequence={currentSequence}
              selectedAnswer={gameState.selectedAnswer}
              status={gameState.status}
              hintLevel={gameState.currentHintLevel}
              onDropInSlot={handleConfirm}
            />
          </View>

          {/* Zone des choix */}
          <View style={styles.choiceArea}>
            <ChoicePanel
              choices={[currentSequence.correctAnswer, ...currentSequence.distractors]}
              selectedId={gameState.selectedAnswer?.id}
              onSelect={handleSelect}
              onConfirm={handleConfirm}
              disabled={gameState.status === 'checking' || gameState.status === 'success'}
              hintLevel={gameState.currentHintLevel}
              correctAnswerId={currentSequence.correctAnswer.id}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={handleHint}
              disabled={gameState.currentHintLevel >= 4}
              style={[
                styles.hintButton,
                gameState.currentHintLevel >= 4 && styles.disabledButton,
              ]}
            >
              <Text style={styles.hintButtonText}>💡</Text>
              <Text style={styles.hintButtonLabel}>Indice</Text>
            </Pressable>

            {gameState.status === 'success' && (
              <Animated.View entering={FadeIn}>
                <Pressable onPress={handleNext} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>
                    {isSessionComplete ? '🏁 Terminer' : 'Suivant →'}
                  </Text>
                </Pressable>
              </Animated.View>
            )}
          </View>

          {/* Statistiques de session */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionState.currentStreak}</Text>
              <Text style={styles.statLabel}>🔥 Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessionState.totalHints}</Text>
              <Text style={styles.statLabel}>💡 Indices</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  exitButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  exitText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  levelIndicator: {
    alignItems: 'flex-end',
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  levelText: {
    ...textStyles.body,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  progressText: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  sequenceArea: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  choiceArea: {
    marginBottom: spacing[4],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  hintButtonText: {
    fontSize: 20,
  },
  hintButtonLabel: {
    ...textStyles.body,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  nextButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  nextButtonText: {
    ...textStyles.body,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  disabledButton: {
    opacity: 0.4,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    backgroundColor: colors.background.card,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    alignSelf: 'center',
    ...shadows.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...textStyles.h3,
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.background.secondary,
  },
  loadingText: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 100,
  },
});
