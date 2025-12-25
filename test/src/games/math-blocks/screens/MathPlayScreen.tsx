/**
 * MathBlocks Play Screen
 * Main gameplay screen
 */

import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable, Modal, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { colors, spacing, borderRadius, shadows, textStyles } from '@/theme';
import { useAppSettings } from '@/store/useStore';
import { GameGrid, TimerBar, ScoreDisplay } from '../components';
import { useMathGame } from '../hooks/useMathGame';
import { OPERATION_SYMBOLS } from '../types';

interface MathPlayScreenProps {
  levelId?: string;
}

export function MathPlayScreen({ levelId }: MathPlayScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ levelId?: string }>();
  const effectiveLevelId = levelId || params.levelId;
  const settings = useAppSettings();
  const [showSettings, setShowSettings] = useState(false);

  const handleVictory = useCallback(() => {
    setTimeout(() => {
      router.push('/(games)/math-blocks/victory');
    }, 1500);
  }, [router]);

  const handleGameOver = useCallback(() => {
    setTimeout(() => {
      router.push('/(games)/math-blocks/victory');
    }, 1500);
  }, [router]);

  const {
    gameState,
    level,
    isVictory,
    isGameOver,
    selectBlock,
    reset,
    pause,
    resume,
  } = useMathGame({
    levelId: effectiveLevelId,
    onVictory: handleVictory,
    onGameOver: handleGameOver,
  });

  const handleHome = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.push('/(games)/math-blocks');
  };

  const operationSymbols = level.operations
    .map((op) => OPERATION_SYMBOLS[op])
    .join(' ');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.menuButton}>
          <Text style={styles.menuText}>{'<'} Retour</Text>
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Niveau {level.displayOrder}</Text>
          <Text style={styles.subtitle}>{operationSymbols}</Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => setShowSettings(true)}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>*</Text>
          </Pressable>
          <Pressable onPress={reset} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      {/* Timer */}
      {level.timeLimit > 0 && (
        <TimerBar
          timeRemaining={gameState.timeRemaining}
          totalTime={level.timeLimit}
        />
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
            <Text style={styles.overlayTitle}>
              {isVictory ? 'Bravo !' : 'Temps ecoule !'}
            </Text>
            <Text style={styles.overlayScore}>Score: {gameState.score}</Text>
          </View>
        </View>
      )}

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSettings(false)}
        >
          <Pressable
            style={styles.settingsCard}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.settingsTitle}>Parametres</Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Son</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={settings.setSoundEnabled}
                trackColor={{
                  false: colors.background.secondary,
                  true: colors.primary.light,
                }}
                thumbColor={
                  settings.soundEnabled ? colors.primary.main : colors.text.muted
                }
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Vibrations</Text>
              <Switch
                value={settings.hapticEnabled}
                onValueChange={settings.setHapticEnabled}
                trackColor={{
                  false: colors.background.secondary,
                  true: colors.primary.light,
                }}
                thumbColor={
                  settings.hapticEnabled ? colors.primary.main : colors.text.muted
                }
              />
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gradientStart,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  menuButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  menuText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary.main,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  resetButton: {
    backgroundColor: colors.ui.buttonBlue,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
  },
  resetText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
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
  },
  overlayContent: {
    backgroundColor: colors.background.card,
    padding: spacing[8],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: spacing[4],
  },
  overlayScore: {
    fontSize: 24,
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: 320,
    ...shadows.lg,
  },
  settingsTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  closeButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    marginTop: spacing[6],
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.primary.contrast,
    fontWeight: 'bold',
  },
});
