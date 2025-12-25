/**
 * Hanoi play screen
 * Main gameplay screen with parent zone
 * Specs: 02-ux-flow.md - Écran C (Jeu)
 * - HUD minimal: Indice, Annuler, Règles
 * - Micro-objectifs affichés
 * - Détection blocage + Pause stratégie
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, Text, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

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

// Micro-objectifs selon la progression (spec 02-ux-flow.md)
const getMicroObjective = (progress: number, diskCount: number): string => {
  if (progress < 0.3) {
    return 'Libérer le grand disque';
  } else if (progress < 0.6) {
    return 'Construire une pile provisoire';
  } else {
    return 'Recomposer la pile finale';
  }
};

export function HanoiPlayScreen({ levelId }: HanoiPlayScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const assistant = useAssistant();
  const settings = useAppSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showParentZone, setShowParentZone] = useState(false);
  const [showRulesOverlay, setShowRulesOverlay] = useState(false);
  const [showStrategyPause, setShowStrategyPause] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('discovery');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Blocage detection timers
  const lastMoveTimeRef = useRef<number>(Date.now());
  const blockageCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Hint animation
  const hintPulse = useSharedValue(1);

  // Hints based on mode
  const maxHints = gameMode === 'discovery' ? 99 : gameMode === 'challenge' ? 3 : 0;
  const hintsRemaining = Math.max(0, maxHints - hintsUsed);

  const handleVictory = useCallback(() => {
    if (blockageCheckRef.current) {
      clearInterval(blockageCheckRef.current);
    }
    setTimeout(() => {
      router.push('/(games)/hanoi/victory');
    }, 2000);
  }, [router]);

  const {
    gameState,
    level,
    moveCount,
    invalidMoveCount,
    consecutiveInvalid,
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

  // Blocage detection (spec 04-feedback-ai.md)
  useEffect(() => {
    lastMoveTimeRef.current = Date.now();
  }, [moveCount]);

  useEffect(() => {
    // Check for blocage every 5 seconds
    blockageCheckRef.current = setInterval(() => {
      const idleTime = (Date.now() - lastMoveTimeRef.current) / 1000;

      // Trigger pause stratégie if:
      // - 3+ invalid moves quickly OR
      // - 25+ seconds idle
      if (consecutiveInvalid >= 3 || idleTime >= 25) {
        if (!showStrategyPause && !isVictory) {
          setShowStrategyPause(true);
        }
      }
    }, 5000);

    return () => {
      if (blockageCheckRef.current) {
        clearInterval(blockageCheckRef.current);
      }
    };
  }, [consecutiveInvalid, isVictory, showStrategyPause]);

  const handleHome = () => {
    if (blockageCheckRef.current) {
      clearInterval(blockageCheckRef.current);
    }
    router.push('/');
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setHintsUsed(0);
    reset();
  };

  // Animated hint - shows the next optimal move with animation
  const handleHint = useCallback(() => {
    if (hintsRemaining > 0 && !isVictory) {
      setHintsUsed((prev) => prev + 1);

      // Animate hint button
      hintPulse.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );

      // Show hint message
      const hint = getHint();
      if (hint) {
        const towerNames = ['A', 'B', 'C'];
        setHintMessage(`Déplace vers ${towerNames[hint.to]}`);

        // Auto-play the hint after a short delay
        setTimeout(() => {
          playHint();
          setHintMessage(null);
        }, 1500);
      }
    }
  }, [hintsRemaining, isVictory, getHint, playHint, hintPulse]);

  // Strategy pause: show hint or micro-demo
  const handleStrategyHint = () => {
    setShowStrategyPause(false);
    handleHint();
  };

  const handleStrategyDemo = () => {
    setShowStrategyPause(false);
    // Play 2 moves (micro-demo)
    playHint();
    setTimeout(() => {
      if (!isVictory) playHint();
    }, 1000);
  };

  const handleStrategyContinue = () => {
    setShowStrategyPause(false);
  };

  const handleHelp = () => {
    setShowParentZone((prev) => !prev);
  };

  const handleShowRules = () => {
    setShowRulesOverlay(true);
  };

  const hintButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintPulse.value }],
  }));

  // Calculate progress for micro-objective
  const targetDisks = level.diskCount;
  const disksOnTarget = gameState.towers[2].disks.length;
  const progress = disksOnTarget / targetDisks;
  const microObjective = getMicroObjective(progress, level.diskCount);

  const levelNumber = level.displayOrder;

  return (
    <GameContainer
      showHeader
      title="Tour de Hanoï"
      levelNumber={levelNumber}
      moveCount={moveCount}
      optimalMoves={level.optimalMoves}
      onReset={reset}
      onHome={handleHome}
      onSettings={() => setShowSettings(true)}
      onHelp={handleHelp}
    >
      {/* Micro-objective display */}
      <Animated.View entering={FadeIn} style={styles.microObjective}>
        <Text style={styles.microObjectiveLabel}>Mini-but :</Text>
        <Text style={styles.microObjectiveText}>{microObjective}</Text>
      </Animated.View>

      <View style={styles.gameArea}>
        <DraggableGameBoard
          gameState={gameState}
          totalDisks={level.diskCount}
          onMove={performMove}
          onTowerPress={selectTower}
          canMoveTo={canMoveTo}
        />
      </View>

      {/* Bottom HUD - minimal */}
      <View style={styles.bottomHud}>
        {/* Hint button with animation */}
        <Animated.View style={hintButtonStyle}>
          <Pressable
            onPress={handleHint}
            style={[styles.hudButton, styles.hintButton]}
            disabled={hintsRemaining <= 0 || isVictory}
          >
            <Text style={styles.hudButtonIcon}>💡</Text>
            <Text style={styles.hudButtonText}>
              Indice {gameMode !== 'discovery' && `(${hintsRemaining})`}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Rules button */}
        <Pressable onPress={handleShowRules} style={styles.hudButton}>
          <Text style={styles.hudButtonIcon}>📋</Text>
          <Text style={styles.hudButtonText}>Règles</Text>
        </Pressable>
      </View>

      {/* Hint toast message */}
      {hintMessage && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.hintToast}
        >
          <Text style={styles.hintToastText}>{hintMessage}</Text>
        </Animated.View>
      )}

      {/* Parent Zone at bottom - toggleable */}
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

      {/* Rules overlay (mini) */}
      <Modal
        visible={showRulesOverlay}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRulesOverlay(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowRulesOverlay(false)}
        >
          <Pressable style={styles.rulesCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.rulesTitle}>Règles</Text>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: colors.feedback.success }]}>
                <Text style={styles.ruleIconText}>→</Text>
              </View>
              <Text style={styles.ruleText}>Déplace la pile de A vers C</Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: colors.primary.main }]}>
                <Text style={styles.ruleIconText}>1</Text>
              </View>
              <Text style={styles.ruleText}>Un disque à la fois</Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleIcon, { backgroundColor: colors.feedback.error }]}>
                <Text style={styles.ruleIconText}>✕</Text>
              </View>
              <Text style={styles.ruleText}>Grand sur petit = interdit</Text>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() => setShowRulesOverlay(false)}
            >
              <Text style={styles.closeButtonText}>OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Strategy Pause overlay (spec 04-feedback-ai.md) */}
      <Modal
        visible={showStrategyPause}
        transparent
        animationType="fade"
        onRequestClose={handleStrategyContinue}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.strategyCard}>
            <Text style={styles.strategyTitle}>Pause stratégie</Text>
            <Text style={styles.strategySubtitle}>
              Ton mini-but : {microObjective}
            </Text>

            <View style={styles.strategyButtons}>
              <Pressable onPress={handleStrategyHint} style={styles.strategyButton}>
                <Text style={styles.strategyButtonIcon}>💡</Text>
                <Text style={styles.strategyButtonText}>Un indice</Text>
              </Pressable>

              <Pressable onPress={handleStrategyDemo} style={styles.strategyButton}>
                <Text style={styles.strategyButtonIcon}>▶</Text>
                <Text style={styles.strategyButtonText}>Montre-moi 2 coups</Text>
              </Pressable>

              <Pressable onPress={handleStrategyContinue} style={[styles.strategyButton, styles.strategyButtonOutline]}>
                <Text style={styles.strategyButtonTextOutline}>Je continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings modal */}
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
  microObjective: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    alignSelf: 'center',
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  microObjectiveLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginRight: spacing[2],
  },
  microObjectiveText: {
    ...textStyles.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHud: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    paddingVertical: spacing[3],
  },
  hudButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
    ...shadows.md,
  },
  hintButton: {
    backgroundColor: colors.secondary.main,
  },
  hudButtonIcon: {
    fontSize: 18,
  },
  hudButtonText: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  hintToast: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  hintToastText: {
    ...textStyles.h3,
    color: colors.primary.contrast,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rulesCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: 320,
    ...shadows.lg,
  },
  rulesTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  ruleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleIconText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: 'bold',
  },
  ruleText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
  },
  strategyCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: 340,
    alignItems: 'center',
    ...shadows.lg,
  },
  strategyTitle: {
    ...textStyles.h2,
    color: colors.primary.main,
    marginBottom: spacing[2],
  },
  strategySubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  strategyButtons: {
    width: '100%',
    gap: spacing[3],
  },
  strategyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
  },
  strategyButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.text.muted,
  },
  strategyButtonIcon: {
    fontSize: 20,
  },
  strategyButtonText: {
    ...textStyles.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  strategyButtonTextOutline: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
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
