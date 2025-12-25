/**
 * Hanoi play screen
 * Main gameplay screen with parent zone
 */

import { useState, useCallback } from 'react';
import { View, StyleSheet, Modal, Text, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { colors, spacing, textStyles, borderRadius, shadows } from '@/theme';
import { GameContainer } from '@/components/layout';
import { ParentZone, type GameMode } from '@/components/parent';
import { AssistantBubble } from '@/components/assistant';
import { useAssistant, useAppSettings } from '@/store/useStore';
import { DraggableGameBoard } from '../components';
import { useHanoiGame } from '../hooks/useHanoiGame';

interface HanoiPlayScreenProps {
  levelId?: string;
}

export function HanoiPlayScreen({ levelId }: HanoiPlayScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const assistant = useAssistant();
  const settings = useAppSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showParentZone, setShowParentZone] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('discovery');
  const [hintsUsed, setHintsUsed] = useState(0);

  // Hints based on mode
  const maxHints = gameMode === 'discovery' ? 99 : gameMode === 'challenge' ? 3 : 0;
  const hintsRemaining = Math.max(0, maxHints - hintsUsed);

  const handleVictory = useCallback(() => {
    setTimeout(() => {
      router.push('/(games)/hanoi/victory');
    }, 2000);
  }, [router]);

  const {
    gameState,
    level,
    moveCount,
    isVictory,
    selectTower,
    canMoveTo,
    performMove,
    reset,
    getHint,
    playHint,
  } = useHanoiGame({
    levelId,
    onVictory: handleVictory,
  });

  const handleHome = () => {
    router.push('/');
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setHintsUsed(0);
    reset();
  };

  const handleHint = () => {
    if (hintsRemaining > 0 && !isVictory) {
      setHintsUsed((prev) => prev + 1);
      // Play the hint - automatically make the next optimal move
      playHint();
    }
  };

  const handleHelp = () => {
    // Toggle parent zone visibility
    setShowParentZone((prev) => !prev);
  };

  // Extract level number from levelId
  const levelNumber = level.displayOrder;

  return (
    <GameContainer
      showHeader
      title="Tour de Hanoi"
      levelNumber={levelNumber}
      moveCount={moveCount}
      optimalMoves={level.optimalMoves}
      onReset={reset}
      onHome={handleHome}
      onSettings={() => setShowSettings(true)}
      onHelp={handleHelp}
    >
      <View style={styles.gameArea}>
        <DraggableGameBoard
          gameState={gameState}
          totalDisks={level.diskCount}
          onMove={performMove}
          onTowerPress={selectTower}
          canMoveTo={canMoveTo}
        />
      </View>

      {/* Parent Zone at bottom - toggleable with Help button */}
      {showParentZone && (
        <ParentZone
          progression={moveCount}
          maxProgression={level.optimalMoves ?? 0}
          personalRecord={0}
          hintsRemaining={hintsRemaining}
          maxHints={maxHints}
          currentMode={gameMode}
          onModeChange={handleModeChange}
          onHintPress={handleHint}
        />
      )}

      {assistant.isVisible && assistant.currentMessage && (
        <AssistantBubble
          message={assistant.currentMessage}
          mood={assistant.mood}
          onDismiss={assistant.hideMessage}
        />
      )}

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
          <Pressable style={styles.settingsCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.settingsTitle}>{t('common.settings')}</Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('settings.sound')}</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={settings.setSoundEnabled}
                trackColor={{ false: colors.background.secondary, true: colors.primary.light }}
                thumbColor={settings.soundEnabled ? colors.primary.main : colors.text.muted}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('settings.music')}</Text>
              <Switch
                value={settings.musicEnabled}
                onValueChange={settings.setMusicEnabled}
                trackColor={{ false: colors.background.secondary, true: colors.primary.light }}
                thumbColor={settings.musicEnabled ? colors.primary.main : colors.text.muted}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t('settings.haptic')}</Text>
              <Switch
                value={settings.hapticEnabled}
                onValueChange={settings.setHapticEnabled}
                trackColor={{ false: colors.background.secondary, true: colors.primary.light }}
                thumbColor={settings.hapticEnabled ? colors.primary.main : colors.text.muted}
              />
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>{t('common.ok')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </GameContainer>
  );
}

const styles = StyleSheet.create({
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    ...textStyles.body,
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
    ...textStyles.body,
    color: colors.primary.contrast,
    fontWeight: 'bold',
  },
});
