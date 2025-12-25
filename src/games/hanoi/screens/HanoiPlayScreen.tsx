/**
 * Hanoi play screen
 * Main gameplay screen
 */

import { useState, useCallback } from 'react';
import { View, StyleSheet, Modal, Text, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { GameContainer } from '@/components/layout';
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
  } = useHanoiGame({
    levelId,
    onVictory: handleVictory,
  });

  const handleHome = () => {
    router.push('/');
  };

  return (
    <GameContainer
      showHeader
      title={t('games.hanoi.name')}
      moveCount={moveCount}
      optimalMoves={level.optimalMoves}
      onReset={reset}
      onHome={handleHome}
      onSettings={() => setShowSettings(true)}
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
