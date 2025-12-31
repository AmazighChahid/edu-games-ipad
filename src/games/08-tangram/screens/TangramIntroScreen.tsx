/**
 * TangramIntroScreen
 * Écran d'introduction pour le jeu Tangram
 *
 * Architecture : Hook + Template
 * - useTangramIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants spécifiques : GeoMascot, TangramBoard
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { GameIntroTemplate, type LevelConfig } from '../../../components/common';
import { GeoMascot } from '../components/GeoMascot';
import { TangramBoard } from '../components/TangramBoard';
import { useTangramIntro } from '../hooks/useTangramIntro';
import { Icons } from '../../../constants/icons';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
} from '../../../theme';

// ============================================
// CUSTOM LEVEL CARD (spécifique à Tangram)
// Avec emoji du puzzle et étoiles
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

// Couleurs par difficulté
const DIFFICULTY_COLORS = {
  easy: colors.feedback.success,
  medium: colors.secondary.main,
  hard: colors.feedback.error,
  expert: colors.home.categories.spatial,
};

const TangramLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  // Récupérer l'emoji du puzzle si disponible
  const puzzleEmoji = (level.data as any)?.thumbnailEmoji || Icons.puzzle;
  const difficultyColor = DIFFICULTY_COLORS[level.difficulty];

  // Rendu des étoiles
  const renderStars = () => {
    const filledStars = level.stars || 0;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((star) => (
          <Text
            key={star}
            style={[
              styles.star,
              star <= filledStars ? styles.starFilled : styles.starEmpty,
              isSelected && styles.starSelected,
            ]}
          >
            {Icons.star}
          </Text>
        ))}
      </View>
    );
  };

  // Contenu de la carte
  const cardContent = (
    <>
      {/* Emoji du puzzle */}
      <Text style={styles.puzzleEmoji}>{puzzleEmoji}</Text>

      {/* Numéro du niveau */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : Icons.lock}
      </Text>

      {/* Étoiles (si débloqué) */}
      {level.isUnlocked && renderStars()}

      {/* Badge difficulté */}
      <View
        style={[
          styles.difficultyBadge,
          { backgroundColor: level.isUnlocked ? difficultyColor : colors.text.muted },
        ]}
      >
        <Text style={styles.difficultyText}>
          {level.difficulty === 'easy' ? 'Facile' :
           level.difficulty === 'medium' ? 'Moyen' :
           level.difficulty === 'hard' ? 'Difficile' : 'Expert'}
        </Text>
      </View>

      {/* Badge complété */}
      {level.isCompleted && !isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkBadgeText}>{Icons.success}</Text>
        </View>
      )}
    </>
  );

  // Style de base de la carte
  const containerStyle = [
    styles.levelCard,
    level.isCompleted && styles.levelCardCompleted,
    !level.isUnlocked && styles.levelCardLocked,
  ];

  // Rendu avec gradient si sélectionné, sinon View normale
  if (isSelected) {
    return (
      <LinearGradient
        colors={['#E67E22', '#D35400']}
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

export default function TangramIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useTangramIntro();

  // Render custom level card
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <TangramLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area (TangramBoard)
  const renderGame = useCallback(() => {
    if (!intro.gameState) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un puzzle pour commencer
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.gameContainer}>
        <TangramBoard
          gameState={intro.gameState}
          onMovePiece={intro.handleMovePiece}
          onMoveEnd={intro.handleMoveEnd}
          onRotatePiece={intro.handleRotate}
          onFlipPiece={intro.handleFlip}
          onSelectPiece={intro.handleSelect}
          onPause={intro.handlePause}
          onHint={intro.handleHint}
          onBack={intro.handleBack}
        />
      </View>
    );
  }, [intro]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const { piecesPlaced, totalPieces, moveCount, timeElapsed, hintsUsed } = intro.progressData;
    const progress = piecesPlaced / totalPieces;

    // Formater le temps
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Message d'encouragement
    const getMessage = () => {
      if (progress >= 1) return 'Bravo !';
      if (progress >= 0.7) return 'Presque fini !';
      if (progress >= 0.4) return 'Continue !';
      return "C'est parti !";
    };

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          {/* Temps */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>{Icons.timer} TEMPS</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.main }]}>
              {formatTime(timeElapsed)}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Pièces */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>{Icons.puzzle} PIÈCES</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.success }]}>
              {piecesPlaced}/{totalPieces}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Mouvements */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>{Icons.refresh} COUPS</Text>
            <Text style={[styles.progressStatValue, { color: colors.secondary.main }]}>
              {moveCount}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Barre de progression */}
          <View style={styles.progressBarSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressEncourageText}>{getMessage()}</Text>
          </View>
        </View>
      </View>
    );
  }, [intro.progressData]);

  return (
    <GameIntroTemplate
      // Header
      title="Puzzle Formes"
      emoji={Icons.puzzle}
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
        <GeoMascot
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
      hintsDisabled={intro.hintsDisabled}
      onForceComplete={intro.handleForceComplete}

      // Victory
      isVictory={intro.isVictory}

      // Play button
      playButtonText="C'est parti !"
      playButtonEmoji={Icons.rocket}
    />
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Custom Level Card
  levelCard: {
    width: 90,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    gap: spacing[1],
    ...shadows.md,
    overflow: 'visible',
  },
  levelCardCompleted: {
    borderColor: colors.feedback.success,
  },
  levelCardSelected: {
    borderColor: '#D35400',
    shadowColor: '#E67E22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  levelCardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },

  // Emoji du puzzle
  puzzleEmoji: {
    fontSize: 28,
    marginBottom: spacing[1],
  },

  // Numéro de niveau
  levelNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text.primary,
  },
  levelNumberSelected: {
    color: '#FFFFFF',
  },
  levelNumberLocked: {
    fontSize: 24,
  },

  // Étoiles
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 12,
  },
  starFilled: {
    color: colors.secondary.main,
  },
  starEmpty: {
    color: colors.text.muted,
    opacity: 0.3,
  },
  starSelected: {
    color: '#FFFFFF',
  },

  // Badge difficulté
  difficultyBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing[1],
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  // Badge check complété
  checkBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: colors.feedback.success,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.sm,
  },
  checkBadgeText: {
    fontSize: 12,
  },

  // Game Area
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    minHeight: 200,
  },
  gamePreviewEmptyText: {
    fontSize: 18,
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
  },
  gameContainer: {
    flex: 1,
    width: '100%',
  },

  // Progress Panel
  progressPanel: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
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
    fontSize: 11,
    fontWeight: '600',
    color: '#A0AEC0',
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  progressStatValue: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  progressDivider: {
    width: 2,
    height: 36,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  progressBarSection: {
    alignItems: 'center',
    gap: spacing[1],
  },
  progressBar: {
    width: 70,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.feedback.success,
    borderRadius: 4,
  },
  progressEncourageText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.feedback.success,
  },
});
