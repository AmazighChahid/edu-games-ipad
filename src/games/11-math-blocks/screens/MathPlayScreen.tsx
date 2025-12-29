/**
 * MathBlocks Play Screen
 * Main gameplay screen - Refactored with standardized components
 *
 * Uses:
 * - PageContainer for layout
 * - ScreenHeader for consistent header
 * - GameModal for settings modal
 * - theme tokens for all styling
 */

import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { theme } from '../../../theme';
import {
  PageContainer,
  ScreenHeader,
  GameModal,
  ProgressIndicator,
} from '../../../components/common';
import { Icons } from '../../../constants/icons';
import { useAppSettings } from '../../../store';
import { GameGrid, ScoreDisplay } from '../components';
import { useMathGame } from '../hooks/useMathGame';
import { useMathSound } from '../hooks/useMathSound';
import { OPERATION_SYMBOLS } from '../types';

interface MathPlayScreenProps {
  levelId?: string;
}

export function MathPlayScreen({ levelId }: MathPlayScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId?: string }>();
  const effectiveLevelId = levelId || params.levelId;
  const settings = useAppSettings();
  const { playVictory } = useMathSound();
  const [showSettings, setShowSettings] = useState(false);

  const handleVictory = useCallback(() => {
    playVictory();
    setTimeout(() => {
      router.push('/(games)/11-math-blocks/victory');
    }, 1500);
  }, [router, playVictory]);

  const handleGameOver = useCallback(() => {
    setTimeout(() => {
      router.push('/(games)/11-math-blocks/victory');
    }, 1500);
  }, [router]);

  const {
    gameState,
    level,
    isVictory,
    isGameOver,
    selectBlock,
    reset,
  } = useMathGame({
    levelId: effectiveLevelId,
    onVictory: handleVictory,
    onGameOver: handleGameOver,
  });

  const handleBack = () => {
    router.push('/(games)/11-math-blocks');
  };

  const operationSymbols = level.operations
    .map((op) => OPERATION_SYMBOLS[op])
    .join(' ');

  return (
    <PageContainer variant="playful">
      {/* Header standardisé */}
      <ScreenHeader
        variant="game"
        title={`Niveau ${level.displayOrder}`}
        emoji={Icons.abacus}
        onBack={handleBack}
        showResetButton
        onReset={reset}
        rightContent={
          <Text style={styles.operationsBadge}>{operationSymbols}</Text>
        }
      />

      {/* Timer */}
      {level.timeLimit > 0 && (
        <View style={styles.timerContainer}>
          <ProgressIndicator
            type="timer"
            timeRemaining={gameState.timeRemaining}
            totalTime={level.timeLimit}
            colorScheme="auto"
          />
        </View>
      )}

      {/* Score Display */}
      <ScoreDisplay
        score={gameState.score}
        combo={gameState.combo}
        matchesFound={gameState.matchesFound}
        totalPairs={gameState.totalPairs}
      />

      {/* Game Grid */}
      <View style={styles.gameArea}>
        <GameGrid grid={gameState.grid} onBlockPress={selectBlock} />
      </View>

      {/* Victory/Game Over Overlay */}
      {(isVictory || isGameOver) && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayEmoji}>
              {isVictory ? Icons.trophy : Icons.timer}
            </Text>
            <Text style={styles.overlayTitle}>
              {isVictory ? 'Bravo !' : 'Temps écoulé !'}
            </Text>
            <Text style={styles.overlayScore}>Score: {gameState.score}</Text>
          </View>
        </View>
      )}

      {/* Settings Modal */}
      <GameModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        variant="info"
        title="Paramètres"
        emoji={Icons.settings}
        content={
          <View style={styles.settingsContent}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{Icons.music} Son</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={settings.setSoundEnabled}
                trackColor={{
                  false: theme.colors.background.secondary,
                  true: theme.colors.primary.light,
                }}
                thumbColor={
                  settings.soundEnabled
                    ? theme.colors.primary.main
                    : theme.colors.text.muted
                }
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{Icons.sparkles} Vibrations</Text>
              <Switch
                value={settings.hapticEnabled}
                onValueChange={settings.setHapticEnabled}
                trackColor={{
                  false: theme.colors.background.secondary,
                  true: theme.colors.primary.light,
                }}
                thumbColor={
                  settings.hapticEnabled
                    ? theme.colors.primary.main
                    : theme.colors.text.muted
                }
              />
            </View>
          </View>
        }
        buttons={[
          {
            label: 'OK',
            onPress: () => setShowSettings(false),
            variant: 'primary',
          },
        ]}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  operationsBadge: {
    fontSize: 18,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.primary.main,
  },
  timerContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  overlayContent: {
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing[8],
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  overlayEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing[4],
  },
  overlayTitle: {
    fontSize: 32,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing[4],
  },
  overlayScore: {
    fontSize: 24,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.text.primary,
  },
  settingsContent: {
    gap: theme.spacing[4],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
  },
  settingLabel: {
    fontSize: 18,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.text.primary,
  },
});
