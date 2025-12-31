import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SequenceDisplay } from './SequenceDisplay';
import { ChoicePanel } from './ChoicePanel';
import { MascotRobot } from './MascotRobot';
import { useSuitesGameV2 as useSuitesGame } from '../hooks/useSuitesGameV2';
import { useSuitesSound } from '../hooks/useSuitesSound';
import { ThemeType, SessionStats, SequenceElement } from '../types';
import { PIXEL_MESSAGES } from '../data/gameConfig';
import { getErrorHintMessage, getHintLevelMessage } from '../utils/patternHintMessages';
import { colors, spacing, textStyles, touchTargets, borderRadius, shadows } from '../../../theme';

type EmotionType = 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';

// Mapping du statut GameStatus -> StatusType pour ChoicePanel
const mapGameStatusToChoiceStatus = (status: string): 'playing' | 'checking' | 'success' | 'error' | 'hint' => {
  switch (status) {
    case 'idle':
    case 'selected':
      return 'playing';
    case 'checking':
      return 'checking';
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'hint':
      return 'hint';
    default:
      return 'playing';
  }
};

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
  initialLevel = 10, // TODO: remettre à 1 après tests
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
    // Nouvelles données depuis levels.ts
    currentLevelInfo,
    hintsRemaining,
    // Nouvelles données du moteur adaptatif
    lastHint,
    // Puzzle pour accéder au pattern
    currentPuzzle,
  } = useSuitesGame({ theme, initialLevel });

  // Hook pour les sons
  const {
    playSelect,
    playCorrect,
    playError,
    playThinking,
    startAmbient,
    stopAmbient,
  } = useSuitesSound();

  // Message de la mascotte
  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [mascotEmotion, setMascotEmotion] = useState<EmotionType>('neutral');
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Pour autoriser l'audio après interaction

  // Initialisation - démarrer une nouvelle séquence
  useEffect(() => {
    setMascotMessage("Bip bip ! Trouve ce qui vient après et clique sur Valider !");
    setMascotEmotion('encouraging');
    // Passer initialLevel explicitement pour éviter la race condition
    nextSequence(initialLevel);

    // Nettoyage : arrêter le fond sonore quand on quitte
    return () => {
      stopAmbient();
    };
  }, []);

  // Gestion du feedback selon le statut
  useEffect(() => {
    if (gameState.status === 'success') {
      // Jouer le son de bonne réponse
      playCorrect();

      const messages = PIXEL_MESSAGES.success;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
      setMascotEmotion('excited'); // Grand sourire pour le succès

      // Passer automatiquement à la suite suivante après un court délai
      const timer = setTimeout(() => {
        if (isSessionComplete) {
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
          const startMessages = PIXEL_MESSAGES.start;
          setMascotMessage(startMessages[Math.floor(Math.random() * startMessages.length)]);
          setMascotEmotion('neutral');
        }
      }, 1200); // Délai de 1.2 secondes pour voir le feedback

      return () => clearTimeout(timer);
    } else if (gameState.status === 'error') {
      // Jouer le son d'erreur
      playError();

      // Utiliser le message contextuel basé sur le pattern si disponible
      if (currentPuzzle?.pattern) {
        const contextualMessage = getErrorHintMessage(
          currentPuzzle.pattern,
          gameState.attempts
        );
        // DEBUG: Afficher dans la mascotte avec le pattern type
        setMascotMessage(`[${currentPuzzle.pattern.type}] ${contextualMessage}`);
      } else {
        // DEBUG: Afficher qu'on n'a pas de pattern
        setMascotMessage(`[NO PATTERN] puzzle=${!!currentPuzzle} - Message générique`);
      }
      setMascotEmotion('encouraging'); // Encourager après une erreur
    } else if (gameState.status === 'hint') {
      // Jouer le son de réflexion
      playThinking();

      setMascotEmotion('thinking'); // Réfléchit pour donner un indice

      // DEBUG: Voir ce qui arrive
      console.log('[HINT DEBUG] lastHint:', lastHint);
      console.log('[HINT DEBUG] currentPuzzle?.pattern:', currentPuzzle?.pattern);
      console.log('[HINT DEBUG] hintLevel:', gameState.currentHintLevel);

      // Utiliser le hint Montessori adapté du moteur si disponible
      if (lastHint?.message) {
        console.log('[HINT DEBUG] Using lastHint.message:', lastHint.message);
        setMascotMessage(lastHint.message);
      } else if (currentPuzzle?.pattern && gameState.currentHintLevel >= 1 && gameState.currentHintLevel <= 3) {
        // Utiliser les messages contextuels basés sur le pattern
        const hintMessage = getHintLevelMessage(
          currentPuzzle.pattern,
          gameState.currentHintLevel as 1 | 2 | 3
        );
        setMascotMessage(hintMessage);
      } else {
        // Fallback sur les anciens messages génériques
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
    }
  }, [gameState.status, gameState.currentHintLevel, lastHint, currentPuzzle]);

  // Sélection d'un élément
  const handleSelect = useCallback(
    (element: SequenceElement) => {
      // Marquer qu'il y a eu une interaction (autorise l'audio)
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        // Démarrer le fond sonore ambient après la première interaction
        startAmbient();
      }

      // Jouer le son de sélection
      playSelect();

      selectAnswer(element);
      // Message pour encourager à valider
      setMascotMessage("Bip ! Clique sur 'Valider' pour confirmer ton choix !");
      setMascotEmotion('happy'); // Sourire quand l'utilisateur sélectionne
    },
    [selectAnswer, playSelect, hasUserInteracted, startAmbient]
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
              <Text style={styles.levelText}>
                {currentLevelInfo?.name ?? `Niveau ${sessionState.currentLevel}`}
              </Text>
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
            canPlayAudio={hasUserInteracted}
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
              status={mapGameStatusToChoiceStatus(gameState.status)}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={handleHint}
              disabled={hintsRemaining <= 0 || gameState.currentHintLevel >= 4}
              style={[
                styles.hintButton,
                (hintsRemaining <= 0 || gameState.currentHintLevel >= 4) && styles.disabledButton,
              ]}
            >
              <Text style={styles.hintButtonText}>💡</Text>
              <Text style={styles.hintButtonLabel}>
                Indice ({hintsRemaining})
              </Text>
            </Pressable>
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
    borderRadius: borderRadius.round,
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
