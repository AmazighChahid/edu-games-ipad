import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SequenceDisplay } from './SequenceDisplay';
import { ChoicePanel } from './ChoicePanel';
import { useSuitesGame } from '../hooks/useSuitesGame';
import { ThemeType, SessionStats, SequenceElement } from '../types';
import { PIXEL_MESSAGES } from '../constants/gameConfig';

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

  // Initialisation - démarrer une nouvelle séquence
  useEffect(() => {
    setMascotMessage("Bip bip ! Trouve ce qui vient après !");
    nextSequence();
  }, []);

  // Gestion du feedback selon le statut
  useEffect(() => {
    if (gameState.status === 'success') {
      const messages = PIXEL_MESSAGES.success;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else if (gameState.status === 'error') {
      const messages = PIXEL_MESSAGES.error;
      setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else if (gameState.status === 'hint') {
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
    }
  }, [isSessionComplete, sessionState, nextSequence, onSessionEnd]);

  if (!currentSequence) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onExit} style={styles.exitButton}>
          <Text style={styles.exitText}>← Retour</Text>
        </Pressable>

        <View style={styles.levelIndicator}>
          <Text style={styles.levelText}>Niveau {sessionState.currentLevel}</Text>
          <Text style={styles.progressText}>
            {sessionState.sequencesCompleted} / 8 suites
          </Text>
        </View>
      </View>

      {/* Bulle de la mascotte */}
      <View style={styles.mascotBubble}>
        <Text style={styles.mascotText}>{mascotMessage}</Text>
      </View>

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
          style={[styles.hintButton, gameState.currentHintLevel >= 4 && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>💡 Indice</Text>
        </Pressable>

        {gameState.status === 'success' && (
          <Pressable onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.buttonText}>
              {isSessionComplete ? '🏁 Terminer' : '➡️ Suivant'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Statistiques de session */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          Streak: {sessionState.currentStreak} 🔥 | Indices: {sessionState.totalHints}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exitButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
  },
  exitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  levelIndicator: {
    alignItems: 'flex-end',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  mascotBubble: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mascotText: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
  },
  sequenceArea: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  choiceArea: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  hintButton: {
    backgroundColor: '#FFB347',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButton: {
    backgroundColor: '#5B8DEE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  stats: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  loadingText: {
    fontSize: 20,
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 100,
  },
});
