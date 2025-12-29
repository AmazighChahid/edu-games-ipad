/**
 * MotsCroisesIntroScreen
 * Écran d'introduction pour le jeu Mots Croisés
 *
 * Architecture : Hook + Template
 * - useMotsCroisesIntro() : toute la logique métier
 * - GameIntroTemplate : UI partagée
 * - Composants spécifiques : LexieMascot, CrosswordGrid, Keyboard
 *
 * @see docs/GAME_ARCHITECTURE.md pour le pattern complet
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { GameIntroTemplate, type LevelConfig } from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { CrosswordGrid } from '../components/CrosswordGrid';
import { Keyboard } from '../components/Keyboard';
import { ClueList } from '../components/ClueList';
import { LexieMascot } from '../components/LexieMascot';
import { useMotsCroisesIntro } from '../hooks/useMotsCroisesIntro';
import { motsCroisesLevels } from '../data/levels';
import { Icons } from '../../../constants/icons';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
  fontSize,
} from '../../../theme';

// ============================================
// CUSTOM LEVEL CARD (spécifique à Mots Croisés)
// ============================================

interface LevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

const MotsCroisesLevelCard: React.FC<LevelCardProps> = ({ level, isSelected }) => {
  // Récupérer l'emoji du thème depuis les données de niveau
  const levelData = motsCroisesLevels[level.number - 1];
  const themeEmoji = levelData?.themeEmoji || Icons.writing;

  return (
    <View
      style={[
        styles.levelCard,
        level.isCompleted && styles.levelCardCompleted,
        isSelected && styles.levelCardSelected,
        !level.isUnlocked && styles.levelCardLocked,
      ]}
    >
      {/* Icône thème */}
      <Text style={styles.levelThemeIcon}>
        {level.isUnlocked ? themeEmoji : Icons.lock}
      </Text>

      {/* Numéro niveau */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.number}
      </Text>

      {/* Étoiles si complété */}
      {level.isCompleted && level.stars !== undefined && (
        <View style={styles.starsRow}>
          {[1, 2, 3].map((star) => (
            <Text
              key={star}
              style={star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty}
            >
              {star <= (level.stars || 0) ? Icons.star : Icons.starEmpty}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

// ============================================
// MAIN SCREEN
// ============================================

export default function MotsCroisesIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useMotsCroisesIntro();
  const { gameHook } = intro;

  // Render custom level card
  const renderLevelCard = useCallback(
    (level: LevelConfig, isSelected: boolean) => (
      <MotsCroisesLevelCard level={level} isSelected={isSelected} />
    ),
    []
  );

  // Render game area (grille + indices + clavier)
  const renderGame = useCallback(() => {
    const { gameState } = gameHook;

    if (!gameState) {
      return (
        <View style={styles.gamePreviewEmpty}>
          <Text style={styles.gamePreviewEmptyText}>
            Sélectionne un niveau pour voir la grille
          </Text>
        </View>
      );
    }

    return (
      <>
        {/* Zone de la grille */}
        <View style={styles.gridArea}>
          <CrosswordGrid
            grid={gameState.grid}
            selectedCell={gameState.selectedCell}
            selectedWordId={gameState.selectedWordId}
            onCellPress={gameHook.handleCellSelect}
            words={gameState.words}
          />
        </View>

        {/* Zone des indices (visible quand on joue) */}
        {intro.isPlaying && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.cluesArea}>
            <ClueList
              words={gameState.words}
              completedWordIds={gameState.completedWordIds}
              selectedWordId={gameState.selectedWordId}
              onWordPress={gameHook.handleWordSelect}
            />
          </Animated.View>
        )}

        {/* Clavier (visible quand on joue) */}
        {intro.isPlaying && (
          <Animated.View entering={FadeIn.duration(400).delay(100)} style={styles.keyboardArea}>
            <Keyboard
              onKeyPress={gameHook.handleLetterInput}
              onDelete={gameHook.handleDelete}
              disabled={gameState.phase !== 'playing'}
            />
          </Animated.View>
        )}
      </>
    );
  }, [gameHook, intro.isPlaying]);

  // Render progress panel
  const renderProgress = useCallback(() => {
    const { wordsFound, totalWords, hintsUsed, timeElapsed, completionPercent } =
      intro.progressData;
    const progress = completionPercent / 100;

    // Formater le temps
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Message d'encouragement
    const getMessage = () => {
      if (progress >= 1) return 'Bravo ! ';
      if (progress >= 0.7) return 'Tu y es presque ! ';
      if (progress >= 0.4) return 'Continue ! ';
      return "C'est parti ! ";
    };

    return (
      <View style={styles.progressPanel}>
        <View style={styles.progressStatsRow}>
          {/* Temps */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>TEMPS</Text>
            <Text style={[styles.progressStatValue, { color: colors.primary.main }]}>
              {formatTime(timeElapsed)}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Mots trouvés */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>MOTS</Text>
            <Text style={[styles.progressStatValue, { color: colors.feedback.success }]}>
              {wordsFound}/{totalWords}
            </Text>
          </View>

          <View style={styles.progressDivider} />

          {/* Indices */}
          <View style={styles.progressStatItem}>
            <Text style={styles.progressStatLabel}>INDICES</Text>
            <Text style={[styles.progressStatValue, { color: colors.secondary.main }]}>
              {Icons.lightbulb} {hintsUsed}
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
    <>
      <GameIntroTemplate
        // Header
        title="Mots Croisés"
        emoji={Icons.writing}
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
          <LexieMascot
            message={intro.mascotMessage}
            emotion={intro.mascotEmotion}
            visible={!intro.isVictory}
            canPlayAudio={intro.canPlayAudio}
          />
        }

        // Floating buttons
        showResetButton
        onReset={intro.handleReset}
        showHintButton
        onHint={intro.handleHint}
        hintsRemaining={intro.hintsRemaining}
        hintsDisabled={intro.hintsRemaining <= 0}
        onForceComplete={intro.handleForceComplete}

        // Victory
        isVictory={intro.isVictory}

        // Mode entrainement désactivé pour ce jeu
        showTrainingMode={false}
      />

      {/* Fiche parent de l'activité */}
      <ParentDrawer
        isVisible={intro.showParentDrawer}
        onClose={() => intro.setShowParentDrawer(false)}
        activityName="Mots Croisés"
        activityEmoji={Icons.writing}
        gameData={{
          objective: 'Enrichir le vocabulaire et travailler l\'orthographe en complétant des grilles de mots croisés thématiques.',
          optimalSolution: 'Trouver tous les mots sans utiliser d\'indices',
          rules: [
            'Sélectionne une case vide et tape la lettre correspondante',
            'Utilise les définitions pour deviner les mots',
            'Les couleurs indiquent si la lettre est correcte (vert), présente mais mal placée (orange), ou absente (rouge)',
          ],
          strategy: 'Commence par les mots les plus courts ou les plus faciles, puis utilise les lettres trouvées pour compléter les autres.',
          tip: 'Lis les définitions à voix haute pour mieux les mémoriser !',
        }}
        appBehavior={{
          does: [
            'Affiche les définitions de chaque mot',
            'Donne un feedback visuel sur chaque lettre',
            'Permet d\'utiliser des indices pour révéler des lettres',
          ],
          doesnt: [
            'Ne donne jamais directement la réponse',
            'Ne pénalise pas les erreurs',
            'Ne limite pas le temps de jeu',
          ],
        }}
        competences={[
          { id: 'vocab', icon: Icons.book, title: 'Vocabulaire', description: 'Enrichir son lexique', stars: 4, iconBgColor: colors.home.categories.language },
          { id: 'ortho', icon: Icons.writing, title: 'Orthographe', description: 'Mémoriser l\'écriture des mots', stars: 5, iconBgColor: colors.home.categories.language },
          { id: 'lecture', icon: Icons.eyes, title: 'Lecture', description: 'Comprendre les définitions', stars: 3, iconBgColor: colors.home.categories.logic },
          { id: 'reflexion', icon: Icons.brain, title: 'Réflexion', description: 'Déduire les mots des indices', stars: 4, iconBgColor: colors.home.categories.logic },
        ]}
        scienceData={{
          text: 'Les mots croisés stimulent la mémoire lexicale et renforcent les connexions entre sens et orthographe. Ils développent également la capacité de déduction et la persévérance.',
        }}
        advices={[
          { situation: 'L\'enfant est bloqué', response: 'Suggérez de lire la définition à voix haute et de penser aux mots qui correspondent' },
          { situation: 'L\'enfant fait des erreurs', response: 'Félicitez les tentatives et rappelez que les couleurs l\'aident à trouver' },
          { situation: 'L\'enfant veut un indice', response: 'Encouragez d\'abord à essayer, mais n\'hésitez pas à utiliser les indices si besoin' },
        ]}
      />
    </>
  );
}

// ============================================
// STYLES (spécifiques à ce jeu)
// ============================================

const styles = StyleSheet.create({
  // Custom Level Card
  levelCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    alignItems: 'center',
    minWidth: 100,
    minHeight: 120,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    ...shadows.md,
  },
  levelCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#7BC74D',
  },
  levelCardSelected: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },
  levelThemeIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  levelNumber: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
  levelNumberSelected: {
    color: colors.primary.main,
  },
  levelNumberLocked: {
    fontSize: 24,
    color: colors.text.muted,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: spacing[1],
  },
  starFilled: {
    fontSize: 14,
    color: colors.secondary.main,
  },
  starEmpty: {
    fontSize: 14,
    color: colors.text.muted,
    opacity: 0.3,
  },

  // Game Area
  gamePreviewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  gamePreviewEmptyText: {
    fontSize: fontSize.base,
    color: colors.text.muted,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
  },
  gridArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },
  cluesArea: {
    marginBottom: spacing[3],
    maxHeight: 120,
  },
  keyboardArea: {
    marginBottom: spacing[4],
  },

  // Progress Panel (style cohérent avec autres jeux)
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
    fontSize: 12, // Min pour lisibilité (exception contrainte UI compacte)
    fontWeight: '600',
    color: '#A0AEC0',
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  progressStatValue: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  progressDivider: {
    width: 2,
    height: 36,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  progressBarSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  progressBar: {
    width: 80,
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
    fontSize: 12, // Min pour lisibilité (exception contrainte UI compacte)
    fontWeight: '700',
    color: colors.feedback.success,
  },
});
