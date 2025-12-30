/**
 * FabriqueIntroScreen
 * ===================
 * Écran d'introduction pour La Fabrique de Réactions
 *
 * Architecture : Hook + Template
 * - useFabriqueIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants spécifiques : GedeonMascot, MachineGrid, ElementPalette
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import {
  GameIntroTemplate,
  type LevelConfig,
  PetalsIndicator,
} from '../../../components/common';
import { GedeonMascot } from '../components/GedeonMascot';
import { useFabriqueIntro } from '../hooks/useFabriqueIntro';
import { getElementDefinition } from '../data/elements';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
} from '../../../theme';

// ============================================
// GRID CELL COMPONENT (mémorisé pour performance)
// ============================================

interface GridCellProps {
  row: number;
  col: number;
  isEmptySlot: boolean;
  placedElement: ReturnType<typeof getElementDefinition> | null;
  isFixed: boolean;
  isSelected: boolean;
  onPress: () => void;
}

const GridCell = React.memo<GridCellProps>(({
  isEmptySlot,
  placedElement,
  isFixed,
  isSelected,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.gridCell,
      isEmptySlot && styles.gridCellEmpty,
      isSelected && styles.gridCellSelected,
      isFixed && styles.gridCellFixed,
    ]}
  >
    {placedElement && (
      <Text style={styles.elementEmoji}>{placedElement.emoji}</Text>
    )}
    {isEmptySlot && !placedElement && (
      <Text style={styles.emptySlotText}>?</Text>
    )}
  </Pressable>
));

GridCell.displayName = 'GridCell';

// ============================================
// CUSTOM LEVEL CARD
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

const DIFFICULTY_COLORS = {
  easy: colors.feedback.success,
  medium: colors.secondary.main,
  hard: colors.feedback.error,
  expert: colors.primary.dark,
  empty: colors.ui.disabled,
};

const getDifficultyLevel = (difficulty: LevelConfig['difficulty']): 1 | 2 | 3 => {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
    case 'expert':
      return 3;
    default:
      return 1;
  }
};

const FabriqueLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  const difficultyLevel = getDifficultyLevel(level.difficulty);

  // Icônes d'engrenages pour représenter la difficulté
  const renderGears = () => {
    const gears = [
      { size: 14, filled: difficultyLevel >= 1 },
      { size: 18, filled: difficultyLevel >= 2 },
      { size: 22, filled: difficultyLevel >= 3 },
    ];

    return (
      <View style={styles.gearsContainer}>
        {gears.map((gear, index) => (
          <Text
            key={index}
            style={[
              styles.gearIcon,
              { fontSize: gear.size },
              gear.filled
                ? { opacity: isSelected ? 1 : 0.9 }
                : { opacity: 0.3 },
            ]}
          >
            {gear.filled ? (isSelected ? '⚙️' : '⚙️') : '⚙️'}
          </Text>
        ))}
      </View>
    );
  };

  const renderPetals = () => (
    <PetalsIndicator
      filledCount={(level.stars || 0) as 0 | 1 | 2 | 3}
      size="small"
      isSelected={isSelected}
    />
  );

  const cardContent = (
    <>
      {renderGears()}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : '🔒'}
      </Text>
      {level.isUnlocked && renderPetals()}
      {level.isCompleted && !isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkBadgeText}>✓</Text>
        </View>
      )}
    </>
  );

  const containerStyle = [
    styles.levelCard,
    level.isCompleted && styles.levelCardCompleted,
    !level.isUnlocked && styles.levelCardLocked,
  ];

  if (isSelected) {
    return (
      <LinearGradient
        colors={[colors.secondary.main, colors.secondary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[containerStyle, styles.levelCardSelected]}
      >
        {cardContent}
      </LinearGradient>
    );
  }

  return <View style={containerStyle}>{cardContent}</View>;
};

// ============================================
// MAIN SCREEN
// ============================================

export default function FabriqueIntroScreen() {
  const intro = useFabriqueIntro();

  // Render custom level card
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <FabriqueLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area (grille + éléments)
  const renderGame = useCallback(() => {
    if (!intro.currentGameLevel) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir la machine
          </Text>
        </View>
      );
    }

    const { gridSize, fixedElements, emptySlots } = intro.currentGameLevel;

    return (
      <View style={styles.gameArea}>
        {/* Grille de la machine */}
        <View style={styles.machineContainer}>
          <View
            style={[
              styles.grid,
              {
                width: gridSize.cols * 70,
                height: gridSize.rows * 70,
              },
            ]}
          >
            {/* Cases de la grille - optimisé avec GridCell mémorisé */}
            {Array.from({ length: gridSize.rows }).map((_, row) =>
              Array.from({ length: gridSize.cols }).map((_, col) => {
                const isEmptySlot = emptySlots.some(
                  (s) => s.row === row && s.col === col
                );
                const placedElement = intro.placedElements.find(
                  (e) => e.position.row === row && e.position.col === col
                );
                const isSelected =
                  intro.selectedSlot?.row === row &&
                  intro.selectedSlot?.col === col;

                const elementDef = placedElement
                  ? getElementDefinition(placedElement.elementId)
                  : null;

                return (
                  <GridCell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    isEmptySlot={isEmptySlot}
                    placedElement={elementDef}
                    isFixed={placedElement?.isFixed ?? false}
                    isSelected={isSelected}
                    onPress={() => {
                      if (isEmptySlot && !placedElement) {
                        intro.handleSelectSlot({ row, col });
                      }
                    }}
                  />
                );
              })
            )}
          </View>

          {/* Légende */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.feedback.success }]} />
              <Text style={styles.legendText}>Source</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary.main }]} />
              <Text style={styles.legendText}>Objectif</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.secondary.main }]} />
              <Text style={styles.legendText}>À placer</Text>
            </View>
          </View>
        </View>

        {/* Palette d'éléments (visible quand on joue) */}
        {intro.isPlaying && intro.availableElements.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.paletteContainer}
          >
            <Text style={styles.paletteTitle}>Éléments disponibles</Text>
            <View style={styles.palette}>
              {intro.availableElements.map((elementId, index) => {
                const def = getElementDefinition(elementId);
                if (!def) return null;

                return (
                  <Pressable
                    key={`${elementId}-${index}`}
                    style={styles.paletteItem}
                    onPress={() => {
                      if (intro.selectedSlot) {
                        intro.handlePlaceElement(elementId, intro.selectedSlot);
                      }
                    }}
                  >
                    <Text style={styles.paletteEmoji}>{def.emoji}</Text>
                    <Text style={styles.paletteName}>{def.name}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Bouton de simulation */}
            {intro.placedElements.length > intro.currentGameLevel.fixedElements.length && (
              <Pressable
                style={styles.runButton}
                onPress={intro.handleRunSimulation}
                disabled={intro.isSimulating}
              >
                <Text style={styles.runButtonText}>
                  {intro.isSimulating ? '⏳ En cours...' : '▶️ Lancer la machine !'}
                </Text>
              </Pressable>
            )}
          </Animated.View>
        )}
      </View>
    );
  }, [intro]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const { current, total, attempts, hintsUsed, stars } = intro.progressData;

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>NIVEAU</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.main }]}>
              {current}/{total}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>ESSAIS</Text>
            <Text style={[styles.progressStatValue, { color: colors.secondary.main }]}>
              {attempts}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>INDICES</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.dark }]}>
              {hintsUsed}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>ÉTOILES</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.warning }]}>
              {'⭐'.repeat(stars)}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [intro.progressData]);

  return (
    <GameIntroTemplate
      // Header
      title="La Fabrique"
      emoji="⚙️"
      onBack={intro.handleBack}
      onParentPress={intro.handleParentPress}
      onHelpPress={intro.handleHelpPress}
      showParentButton
      showHelpButton

      // Niveaux
      levels={intro.levels}
      selectedLevel={intro.selectedLevel}
      onSelectLevel={intro.handleSelectLevel}
      renderLevelCard={renderLevelCard}

      // Jeu
      renderGame={renderGame}
      isPlaying={intro.isPlaying}
      onStartPlaying={intro.handleStartPlaying}

      // Progress
      renderProgress={renderProgress}

      // Mascot
      mascotComponent={
        <GedeonMascot
          message={intro.mascotMessage}
          emotion={intro.mascotEmotion}
          visible={!intro.isVictory}
        />
      }

      // Floating buttons
      showResetButton
      onReset={intro.handleReset}
      showHintButton
      onHint={intro.handleHint}
      hintsRemaining={intro.hintsRemaining}
      hintsDisabled={intro.hintsRemaining === 0}
      onForceComplete={intro.handleForceComplete}

      // Victory
      isVictory={intro.isVictory}

      // Mode entrainement désactivé
      showTrainingMode={false}
    />
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Level Card
  levelCard: {
    width: 80,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: colors.secondary.light,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    ...shadows.md,
    overflow: 'visible',
  },
  levelCardCompleted: {
    borderColor: colors.feedback.success,
  },
  levelCardSelected: {
    borderColor: colors.secondary.dark,
    shadowColor: colors.secondary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  levelCardLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: colors.ui.disabled,
    opacity: 0.6,
  },

  // Gears for difficulty
  gearsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 24,
    marginBottom: 4,
  },
  gearIcon: {
    lineHeight: 24,
  },

  // Level number
  levelNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: colors.text.primary,
    lineHeight: 28,
  },
  levelNumberSelected: {
    color: colors.text.inverse,
  },
  levelNumberLocked: {
    fontSize: 28,
  },

  // Check badge
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    backgroundColor: colors.feedback.success,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.card,
    ...shadows.sm,
  },
  checkBadgeText: {
    fontSize: 12,
    color: colors.text.inverse,
    fontWeight: '700',
  },

  // Game Area
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  gamePreviewEmptyText: {
    fontSize: 16,
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
  },
  gameArea: {
    alignItems: 'center',
    gap: spacing[4],
  },

  // Machine grid
  machineContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    ...shadows.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: 64,
    height: 64,
    margin: 3,
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ui.disabled,
  },
  gridCellEmpty: {
    backgroundColor: colors.secondary.background,
    borderColor: colors.secondary.main,
    borderStyle: 'dashed',
  },
  gridCellSelected: {
    backgroundColor: colors.secondary.light,
    borderColor: colors.secondary.dark,
    borderWidth: 3,
  },
  gridCellFixed: {
    backgroundColor: colors.feedback.successLight,
    borderColor: colors.feedback.success,
  },
  elementEmoji: {
    fontSize: 32,
  },
  emptySlotText: {
    fontSize: 24,
    color: colors.secondary.main,
    fontWeight: 'bold',
  },

  // Legend
  legend: {
    flexDirection: 'row',
    gap: spacing[4],
    marginTop: spacing[3],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: fontFamily.medium,
  },

  // Palette
  paletteContainer: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    alignItems: 'center',
    ...shadows.md,
  },
  paletteTitle: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    justifyContent: 'center',
  },
  paletteItem: {
    width: 70,
    padding: spacing[2],
    backgroundColor: colors.secondary.background,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary.light,
  },
  paletteEmoji: {
    fontSize: 28,
  },
  paletteName: {
    fontSize: 10,
    color: colors.text.secondary,
    fontFamily: fontFamily.medium,
    marginTop: 2,
    textAlign: 'center',
  },

  // Run button
  runButton: {
    marginTop: spacing[4],
    backgroundColor: colors.feedback.success,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  runButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    color: colors.text.inverse,
  },

  // Progress Panel
  progressPanel: {
    alignSelf: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: 20,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    ...shadows.lg,
    zIndex: 100,
    marginVertical: spacing[2],
  },
  progressStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  progressStatItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.muted,
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  progressStatValue: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 24,
  },
  progressDivider: {
    width: 2,
    height: 36,
    backgroundColor: colors.ui.disabled,
    borderRadius: 1,
  },
});
