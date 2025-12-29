/**
 * GameIntroTemplate
 * =================
 * Template unifié pour les écrans d'introduction des jeux éducatifs.
 *
 * ARCHITECTURE À 2 VUES :
 * -----------------------
 * VUE 1 - SELECTION : L'enfant choisit son niveau
 *   - Header avec titre du jeu
 *   - Grille de sélection des niveaux (1-10)
 *   - Mascotte en position centrale
 *   - Aperçu du jeu
 *   - Bouton "C'est parti !"
 *
 * VUE 2 - PLAY : L'enfant joue
 *   - Header (même)
 *   - Panneau de progression (remplace la grille)
 *   - Mascotte en position latérale (à gauche)
 *   - Zone de jeu active
 *   - Boutons flottants (reset, indice, terminer)
 *
 * TRANSITION :
 * La transition entre les vues est gérée par la prop `isPlaying`.
 * Quand isPlaying passe à true :
 *   - La grille de niveaux disparait (slide up + fade)
 *   - Le panneau de progression apparait (fade in)
 *   - La mascotte se déplace à gauche
 *
 * @example
 * <GameIntroTemplate
 *   title="Suites Logiques"
 *   emoji="🔮"
 *   levels={levels}
 *   selectedLevel={selectedLevel}
 *   onSelectLevel={handleSelectLevel}
 *   isPlaying={isPlaying}
 *   renderGame={() => <MonJeu />}
 *   mascotComponent={<MaMascotte />}
 * />
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
  fontFamily,
  touchTargets,
} from '../../theme';
import { PageContainer } from './PageContainer';
import { ScreenHeader } from './ScreenHeader';
import { HintButton } from './HintButton';
import type {
  GameIntroTemplateProps,
  LevelConfig,
  IntroAnimationConfig,
} from './GameIntroTemplate.types';

// ============================================
// RE-EXPORTS (pour import simplifié)
// ============================================

export type {
  GameIntroTemplateProps,
  LevelConfig,
  TrainingConfig,
  TrainingParam,
} from './GameIntroTemplate.types';
export {
  calculateLevelsForAge,
  generateDefaultLevels,
  DEFAULT_ANIMATION_CONFIG,
} from './GameIntroTemplate.types';

// ============================================
// CONSTANTES
// ============================================

/** Couleurs associées à chaque niveau de difficulté */
const DIFFICULTY_COLORS: Record<LevelConfig['difficulty'], string> = {
  easy: colors.feedback.success,    // Vert
  medium: colors.secondary.main,    // Orange
  hard: colors.primary.main,        // Bleu
  expert: colors.home.categories.spatial, // Violet
};

/** Labels français pour les difficultés */
const DIFFICULTY_LABELS: Record<LevelConfig['difficulty'], string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  expert: 'Expert',
};

/** Configuration d'animation par défaut */
const DEFAULT_ANIM_CONFIG: IntroAnimationConfig = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  mascotSlideDuration: 400,
  selectorSlideDistance: -150,
  mascotSlideDistance: -180,
  springDamping: 15,
  springStiffness: 150,
};

// ============================================
// COMPOSANT: CARTE DE NIVEAU (par défaut)
// ============================================

interface DefaultLevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * Carte de niveau par défaut.
 * Peut être remplacée via la prop `renderLevelCard`.
 */
const DefaultLevelCard: React.FC<DefaultLevelCardProps> = ({
  level,
  isSelected,
  onPress,
}) => {
  const difficultyColor = DIFFICULTY_COLORS[level.difficulty];

  return (
    <Pressable
      onPress={onPress}
      disabled={!level.isUnlocked}
      style={[
        styles.levelCard,
        level.isCompleted && styles.levelCardCompleted,
        isSelected && styles.levelCardSelected,
        !level.isUnlocked && styles.levelCardLocked,
        isSelected && { borderColor: difficultyColor },
      ]}
      accessible
      accessibilityLabel={`Niveau ${level.number}${level.isCompleted ? ', complété' : ''}${!level.isUnlocked ? ', verrouillé' : ''}`}
      accessibilityRole="button"
    >
      {/* Étoiles (si niveau complété) */}
      {level.isCompleted && level.stars !== undefined && (
        <View style={styles.starsContainer}>
          {[1, 2, 3].map((star) => (
            <Text
              key={star}
              style={[
                styles.star,
                star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty,
              ]}
            >
              ★
            </Text>
          ))}
        </View>
      )}

      {/* Numéro du niveau */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && { color: difficultyColor },
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : '🔒'}
      </Text>

      {/* Badge de difficulté */}
      <View
        style={[
          styles.difficultyBadge,
          { backgroundColor: level.isUnlocked ? difficultyColor : colors.text.muted },
        ]}
      >
        <Text style={styles.difficultyText}>
          {level.isUnlocked ? DIFFICULTY_LABELS[level.difficulty] : 'Bloqué'}
        </Text>
      </View>
    </Pressable>
  );
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const GameIntroTemplate: React.FC<GameIntroTemplateProps> = ({
  // --- HEADER ---
  title,
  emoji,
  onBack,
  onParentPress,
  onHelpPress,
  showParentButton = true,
  showHelpButton = true,

  // --- VUE 1: SELECTION DE NIVEAU ---
  levels,
  selectedLevel,
  onSelectLevel,
  renderLevelCard,

  // --- MODE ENTRAINEMENT (optionnel) ---
  showTrainingMode = false,
  trainingConfig,
  onTrainingPress,
  isTrainingMode = false,

  // --- JEU ---
  renderGame,
  isPlaying,
  onStartPlaying,

  // --- VUE 2: PROGRESSION (visible quand isPlaying) ---
  renderProgress,

  // --- MASCOTTE ---
  mascotComponent,

  // --- ANIMATION (optionnel) ---
  animationConfig: customAnimationConfig,

  // --- BOUTONS FLOTTANTS (VUE 2) ---
  showResetButton = true,
  onReset,
  showHintButton = true,
  onHint,
  hintsRemaining = 0,
  hintsDisabled = false,
  onForceComplete,
  showForceCompleteButton = true,

  // --- VICTOIRE ---
  isVictory = false,
  victoryComponent,

  // --- BOUTON PLAY (VUE 1) ---
  showPlayButton = true,
  playButtonText = "C'est parti !",
  playButtonEmoji = '🚀',
}) => {
  // ============================================
  // CONFIGURATION ANIMATION
  // ============================================

  const animConfig = useMemo<IntroAnimationConfig>(
    () => ({ ...DEFAULT_ANIM_CONFIG, ...customAnimationConfig }),
    [customAnimationConfig]
  );

  // ============================================
  // VALEURS ANIMÉES (Reanimated)
  // ============================================

  // Vue 1 → Vue 2 : La grille de niveaux slide vers le haut et disparait
  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);

  // Vue 2 : Le panneau de progression apparait
  const progressOpacity = useSharedValue(0);

  // ============================================
  // STYLES ANIMÉS
  // ============================================

  /** Style animé pour la grille de sélection de niveaux */
  const selectorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: selectorY.value }],
    opacity: selectorOpacity.value,
  }));

  /** Style animé pour le panneau de progression */
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  // ============================================
  // TRANSITIONS
  // ============================================

  /**
   * Transition VUE 1 → VUE 2
   * Appelée quand l'enfant clique sur "C'est parti !"
   */
  const transitionToPlayMode = useCallback(() => {
    if (isPlaying) return;

    // Grille de niveaux : slide up + fade out
    selectorY.value = withTiming(animConfig.selectorSlideDistance, {
      duration: animConfig.selectorSlideDuration,
      easing: Easing.out(Easing.quad),
    });
    selectorOpacity.value = withTiming(0, {
      duration: animConfig.selectorFadeDuration,
    });

    // Panneau de progression : fade in (avec délai)
    progressOpacity.value = withDelay(
      animConfig.progressDelayDuration,
      withTiming(1, { duration: animConfig.selectorFadeDuration })
    );

    // Notifier le parent
    onStartPlaying?.();
  }, [isPlaying, animConfig, selectorY, selectorOpacity, progressOpacity, onStartPlaying]);

  /**
   * Transition VUE 2 → VUE 1
   * Appelée quand l'enfant clique sur le bouton retour pendant le jeu
   */
  const transitionToSelectionMode = useCallback(() => {
    // Grille de niveaux : revient avec effet spring
    selectorY.value = withSpring(0, {
      damping: animConfig.springDamping,
      stiffness: animConfig.springStiffness,
    });
    selectorOpacity.value = withTiming(1, {
      duration: animConfig.selectorFadeDuration,
    });

    // Panneau de progression : fade out
    progressOpacity.value = withTiming(0, { duration: 200 });
  }, [animConfig, selectorY, selectorOpacity, progressOpacity]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Gestion du bouton retour :
   * - Si en train de jouer : anime la transition + délègue au parent (onBack)
   * - Sinon : retour à l'écran précédent (onBack)
   *
   * Note: Le parent (hook) gère setIsPlaying(false) dans son handleBack
   */
  const handleBack = useCallback(() => {
    if (isPlaying && !isVictory) {
      // Animation de retour à la sélection
      transitionToSelectionMode();
    }
    // Toujours appeler onBack pour que le parent gère la logique
    onBack();
  }, [isPlaying, isVictory, transitionToSelectionMode, onBack]);

  // ============================================
  // RENDER HELPERS
  // ============================================

  /** Rendu de la grille de niveaux (Vue 1) */
  const renderLevelGrid = () => (
    <View style={styles.levelGrid}>
      {levels.slice(0, 10).map((level) => {
        const isSelected = selectedLevel?.id === level.id;

        // Si un renderLevelCard custom est fourni, l'utiliser
        if (renderLevelCard) {
          return (
            <Pressable
              key={level.id}
              onPress={() => level.isUnlocked && onSelectLevel(level)}
            >
              {renderLevelCard(level, isSelected)}
            </Pressable>
          );
        }

        // Sinon, utiliser la carte par défaut
        return (
          <DefaultLevelCard
            key={level.id}
            level={level}
            isSelected={isSelected}
            onPress={() => onSelectLevel(level)}
          />
        );
      })}
    </View>
  );

  /** Rendu de la configuration d'entrainement */
  const renderTrainingConfig = () => {
    if (!trainingConfig) return null;

    return (
      <View style={styles.trainingConfig}>
        {trainingConfig.availableParams.map((param) => (
          <View key={param.id} style={styles.trainingParam}>
            <Text style={styles.trainingParamLabel}>{param.label}</Text>
            {param.type === 'select' && param.options && (
              <View style={styles.trainingOptions}>
                {param.options.map((option) => (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => trainingConfig.onParamChange(param.id, option.value)}
                    style={[
                      styles.trainingOption,
                      trainingConfig.currentValues[param.id] === option.value &&
                        styles.trainingOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.trainingOptionText,
                        trainingConfig.currentValues[param.id] === option.value &&
                          styles.trainingOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <PageContainer variant="playful" scrollable={false}>
      {/* ================================================
          HEADER (commun aux 2 vues)
          ================================================ */}
      <ScreenHeader
        variant="game"
        title={title}
        emoji={emoji}
        onBack={handleBack}
        showParentButton={showParentButton && !!onParentPress}
        onParentPress={onParentPress}
        showHelpButton={showHelpButton && !!onHelpPress}
        onHelpPress={onHelpPress}
      />

      <View style={styles.mainContainer}>
        {/* ================================================
            VUE 2 - PANNEAU DE PROGRESSION
            Visible uniquement quand isPlaying = true
            Position : juste sous le header
            ================================================ */}
        {isPlaying && (
          <Animated.View
            style={[styles.progressContainer, progressAnimatedStyle]}
            pointerEvents={isPlaying ? 'auto' : 'none'}
          >
            {renderProgress?.()}
          </Animated.View>
        )}

        {/* ================================================
            VUE 1 - GRILLE DE SELECTION DES NIVEAUX
            Visible uniquement quand isPlaying = false
            Animation : slide up + fade out lors de la transition
            ================================================ */}
        {!isPlaying && (
          <Animated.View
            style={[styles.selectorContainer, selectorAnimatedStyle]}
            pointerEvents={isPlaying ? 'none' : 'auto'}
          >
            {/* Bouton mode entrainement (optionnel) */}
            {showTrainingMode && onTrainingPress && (
              <Pressable
                onPress={onTrainingPress}
                style={[
                  styles.trainingButton,
                  isTrainingMode && styles.trainingButtonActive,
                ]}
                accessible
                accessibilityLabel="Mode entraînement"
                accessibilityRole="button"
              >
                <Text style={styles.trainingButtonEmoji}>🎯</Text>
                <Text
                  style={[
                    styles.trainingButtonText,
                    isTrainingMode && styles.trainingButtonTextActive,
                  ]}
                >
                  Entraînement
                </Text>
              </Pressable>
            )}

            {/* Grille de niveaux OU config entrainement */}
            {isTrainingMode ? renderTrainingConfig() : renderLevelGrid()}
          </Animated.View>
        )}

        {/* ================================================
            MASCOTTE
            Position différente selon la vue :
            - Vue 1 (selection) : centrée
            - Vue 2 (play) : à gauche, plus petite
            ================================================ */}
        <View
          style={[
            styles.mascotContainer,
            isPlaying ? styles.mascotContainerPlay : styles.mascotContainerSelect,
          ]}
          pointerEvents="box-none"
        >
          {mascotComponent}
        </View>

        {/* ================================================
            ZONE DE JEU
            Toujours visible (aperçu en Vue 1, actif en Vue 2)
            ================================================ */}
        <View style={styles.gameContainer}>
          {renderGame()}

          {/* Bouton "C'est parti !" (Vue 1 uniquement) */}
          {!isPlaying && selectedLevel && showPlayButton && (
            <Pressable
              onPress={transitionToPlayMode}
              style={styles.playButton}
              accessible
              accessibilityLabel="Commencer à jouer"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={[colors.primary.main, colors.primary.dark]}
                style={styles.playButtonGradient}
              >
                <Text style={styles.playButtonEmoji}>{playButtonEmoji}</Text>
                <Text style={styles.playButtonText}>{playButtonText}</Text>
              </LinearGradient>
            </Pressable>
          )}
        </View>

        {/* ================================================
            VUE 2 - BOUTONS FLOTTANTS
            Visible uniquement quand isPlaying = true et pas de victoire
            Position : en bas à droite
            ================================================ */}
        {isPlaying && !isVictory && (
          <View style={styles.floatingButtons}>
            {/* Bouton Reset */}
            {showResetButton && onReset && (
              <Pressable
                onPress={onReset}
                style={styles.floatingButton}
                accessible
                accessibilityLabel="Recommencer"
                accessibilityRole="button"
              >
                <Text style={styles.floatingButtonEmoji}>🔄</Text>
              </Pressable>
            )}

            {/* Bouton Indice - Utilise HintButton commun */}
            {showHintButton && onHint && !hintsDisabled && (
              <HintButton
                hintsRemaining={hintsRemaining}
                maxHints={3}
                onPress={onHint}
                size="medium"
                colorScheme="orange"
              />
            )}

            {/* Bouton Terminer (pour tous les utilisateurs) */}
            {showForceCompleteButton && onForceComplete && (
              <Pressable
                onPress={onForceComplete}
                style={[styles.floatingButton, styles.floatingButtonComplete]}
                accessible
                accessibilityLabel="Terminer le niveau"
                accessibilityRole="button"
              >
                <Text style={styles.floatingButtonEmoji}>✅</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ================================================
            OVERLAY VICTOIRE
            Affiché par-dessus tout quand isVictory = true
            ================================================ */}
        {isVictory && victoryComponent}
      </View>
    </PageContainer>
  );
};

// ============================================
// STYLES
// ============================================
// Organisation :
// 1. Layout général
// 2. Grille de niveaux (visible quand isPlaying = false)
// 3. Panneau progression (visible quand isPlaying = true)
// 4. Mascotte (toujours visible, position change selon isPlaying)
// 5. Zone de jeu (toujours visible)
// 6. Boutons (play quand !isPlaying, flottants quand isPlaying)

const styles = StyleSheet.create({
  // =====================
  // 1. LAYOUT GÉNÉRAL
  // =====================
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },

  // =====================
  // 2. GRILLE DE NIVEAUX
  // (visible quand isPlaying = false)
  // =====================
  selectorContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    zIndex: 50,
  },

  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[3],
  },

  // Carte de niveau - états
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
    transform: [{ scale: 1.05 }],
  },
  levelCardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.7,
  },

  // Étoiles dans la carte
  starsContainer: {
    flexDirection: 'row',
    marginBottom: spacing[1],
  },
  star: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  starFilled: {
    color: colors.secondary.main,
  },
  starEmpty: {
    color: colors.text.muted,
    opacity: 0.3,
  },

  // Numéro et badge difficulté
  levelNumber: {
    fontSize: 36,
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  levelNumberLocked: {
    fontSize: 28,
  },
  difficultyBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  // Mode entrainement (optionnel, désactivé pour Suites Logiques)
  trainingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  trainingButtonActive: {
    backgroundColor: colors.secondary.light,
  },
  trainingButtonEmoji: {
    fontSize: 20,
  },
  trainingButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.text.secondary,
  },
  trainingButtonTextActive: {
    color: colors.secondary.dark,
  },
  trainingConfig: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    gap: spacing[4],
    ...shadows.md,
  },
  trainingParam: {
    gap: spacing[2],
  },
  trainingParamLabel: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.text.primary,
  },
  trainingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  trainingOption: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    minWidth: 64,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainingOptionSelected: {
    backgroundColor: colors.primary.main,
  },
  trainingOptionText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.text.secondary,
  },
  trainingOptionTextSelected: {
    color: '#FFFFFF',
  },

  // =====================
  // 3. PANNEAU PROGRESSION
  // (visible quand isPlaying = true)
  // =====================
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 50,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
  },

  // =====================
  // 4. MASCOTTE
  // (toujours visible, position change)
  // =====================
  mascotContainer: {
    zIndex: 40,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  // Position quand isPlaying = false (centrée)
  mascotContainerSelect: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  // Position quand isPlaying = true (à gauche, compact)
  mascotContainerPlay: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing[4],
    marginTop: spacing[1],    // Petit espace après le panneau progression
    marginBottom: spacing[10], // Petit espace avant la zone de jeu
  },

  // =====================
  // 5. ZONE DE JEU
  // (toujours visible)
  // =====================
  gameContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing[4],
  },

  // =====================
  // 6. BOUTONS
  // =====================

  // Bouton "C'est parti !" (visible quand isPlaying = false)
  playButton: {
    marginTop: spacing[4],
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: borderRadius.xl,
    minHeight: touchTargets.large,
    ...shadows.lg,
  },
  playButtonEmoji: {
    fontSize: 24,
  },
  playButtonText: {
    ...textStyles.button,
    color: '#FFFFFF',
    fontFamily: fontFamily.bold,
    fontSize: 20,
  },

  // Boutons flottants (visible quand isPlaying = true)
  floatingButtons: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[4],
    gap: spacing[3],
    zIndex: 60,
  },
  floatingButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  floatingButtonComplete: {
    backgroundColor: '#4CAF50',
  },
  floatingButtonDisabled: {
    opacity: 0.5,
  },
  floatingButtonEmoji: {
    fontSize: 28,
  },
});

export default GameIntroTemplate;
