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

import React, { useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  SharedValue,
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
// COMPOSANT: CARTE ANIMÉE (wrapper pour animation)
// ============================================

interface AnimatedLevelCardWrapperProps {
  children: React.ReactNode;
  index: number;
  /** Progression du fade (0 = visible, 1 = invisible) */
  fadeProgress: SharedValue<number>;
  /** Index de la carte sélectionnée */
  selectedLevelIndex: number;
  /** Progression du glissement */
  slideProgress: SharedValue<number>;
  /** Distance de glissement en pixels (calculée par le parent) */
  slideDistance: number;
}

/**
 * Wrapper animé pour les cartes de niveau.
 * - Carte sélectionnée : reste visible + glisse vers une position fixe (droite de la grille)
 * - Autres cartes : fade out mais gardent leur espace (visibility hidden style)
 */
const AnimatedLevelCardWrapper: React.FC<AnimatedLevelCardWrapperProps> = ({
  children,
  index,
  fadeProgress,
  selectedLevelIndex,
  slideProgress,
  slideDistance,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const fade = fadeProgress.value;
    const slide = slideProgress.value;

    // Carte sélectionnée : reste visible + glisse vers la position cible
    if (index === selectedLevelIndex) {
      return {
        opacity: 1,
        transform: [{ translateX: interpolate(slide, [0, 1], [0, slideDistance]) }],
        zIndex: 100,
      };
    }

    // Autres cartes : fade out seulement (gardent leur espace dans le layout)
    return {
      opacity: interpolate(fade, [0, 1], [1, 0]),
    };
  }, [index, selectedLevelIndex, slideDistance]);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
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

  // Animation de fade des cartes (0 = visible, 1 = masqué)
  const cardsFadeProgress = useSharedValue(0);

  // Animation de glissement de la carte sélectionnée
  const cardSlideProgress = useSharedValue(0);

  // Index du niveau sélectionné
  const selectedLevelIndex = useMemo(() => {
    if (!selectedLevel) return 0;
    return levels.findIndex(l => l.id === selectedLevel.id);
  }, [selectedLevel, levels]);

  // Calcul dynamique de la distance de glissement
  // Basé sur : niveau min, niveau max, et valeur médiane
  // - Niveaux <= médiane : regroupement vers la gauche (position min)
  // - Niveaux > médiane : regroupement vers la droite (position max)
  // Largeur carte (80px) + gap (12px) = 92px par position
  const CARD_WIDTH_WITH_GAP = 92;
  const slideDistance = useMemo(() => {
    if (!selectedLevel || levels.length === 0) return 0;

    // Identifier min, max et médiane des niveaux
    const levelNumbers = levels.map(l => l.number);
    const minLevel = Math.min(...levelNumbers);
    const maxLevel = Math.max(...levelNumbers);
    const medianLevel = (minLevel + maxLevel) / 2;

    const levelNumber = selectedLevel.number;

    if (levelNumber <= medianLevel) {
      // Regroupement vers la gauche (position du niveau minimum)
      // Ex: niveau 1 → 0, niveau 3 → -2 positions
      const positionsToMove = minLevel - levelNumber;
      return positionsToMove * CARD_WIDTH_WITH_GAP;
    } else {
      // Regroupement vers la droite (position du niveau maximum)
      // Ex: niveau 10 → 0, niveau 6 → +4 positions
      const positionsToMove = maxLevel - levelNumber;
      return positionsToMove * CARD_WIDTH_WITH_GAP;
    }
  }, [selectedLevel, levels]);

  // Vue 2 : Le panneau de progression apparait
  const progressOpacity = useSharedValue(0);

  // ============================================
  // STYLES ANIMÉS
  // ============================================

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
   *
   * Animation en 2 phases :
   * 1. Les autres cartes font un fade out + la carte sélectionnée glisse
   * 2. Le panneau de progression apparait
   */
  const transitionToPlayMode = useCallback(() => {
    if (isPlaying) return;

    // Phase 1 : Fade out des autres cartes
    cardsFadeProgress.value = withTiming(1, {
      duration: animConfig.selectorFadeDuration,
      easing: Easing.out(Easing.quad),
    });

    // Phase 1 : Glissement de la carte sélectionnée (en parallèle)
    cardSlideProgress.value = withDelay(
      100,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) })
    );

    // Phase 2 : Panneau de progression apparait après
    progressOpacity.value = withDelay(
      animConfig.selectorFadeDuration + 100,
      withTiming(1, { duration: animConfig.selectorFadeDuration })
    );

    // Notifier le parent
    onStartPlaying?.();
  }, [isPlaying, animConfig, cardsFadeProgress, cardSlideProgress, progressOpacity, onStartPlaying]);

  /**
   * Transition VUE 2 → VUE 1
   * Appelée quand l'enfant clique sur le bouton retour pendant le jeu
   */
  const transitionToSelectionMode = useCallback(() => {
    // Panneau de progression : fade out
    progressOpacity.value = withTiming(0, { duration: 200 });

    // Reset du glissement
    cardSlideProgress.value = withTiming(0, { duration: 300 });

    // Cartes : fade in (après le fade out du panneau)
    cardsFadeProgress.value = withDelay(
      200,
      withTiming(0, {
        duration: animConfig.selectorFadeDuration,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [animConfig, cardsFadeProgress, cardSlideProgress, progressOpacity]);

  // ============================================
  // SYNC ANIMATIONS WITH isPlaying PROP
  // ============================================

  /**
   * Synchronise les animations quand isPlaying change depuis l'extérieur.
   * Cela permet aux jeux comme Hanoi de déclencher le mode play
   * en faisant un mouvement direct (sans passer par le bouton "C'est parti").
   */
  useEffect(() => {
    if (isPlaying) {
      // Fade out des autres cartes
      cardsFadeProgress.value = withTiming(1, {
        duration: animConfig.selectorFadeDuration,
        easing: Easing.out(Easing.quad),
      });
      // Glissement de la carte sélectionnée
      cardSlideProgress.value = withDelay(
        100,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) })
      );
      // Progression apparait après
      progressOpacity.value = withDelay(
        animConfig.selectorFadeDuration + 100,
        withTiming(1, { duration: animConfig.selectorFadeDuration })
      );
    } else {
      // Progression fade out
      progressOpacity.value = withTiming(0, { duration: 200 });
      // Reset glissement
      cardSlideProgress.value = withTiming(0, { duration: 300 });
      // Cartes fade in
      cardsFadeProgress.value = withDelay(
        200,
        withTiming(0, {
          duration: animConfig.selectorFadeDuration,
          easing: Easing.out(Easing.quad),
        })
      );
    }
  }, [isPlaying, animConfig, cardsFadeProgress, cardSlideProgress, progressOpacity]);

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

  /** Rendu de la grille de niveaux (Vue 1) avec animation de fade */
  const renderLevelGrid = () => (
    <View style={styles.levelGrid}>
      {levels.slice(0, 10).map((level, index) => {
        const isSelected = selectedLevel?.id === level.id;

        // Contenu de la carte (custom ou par défaut)
        const cardContent = renderLevelCard ? (
          <Pressable
            onPress={() => level.isUnlocked && onSelectLevel(level)}
          >
            {renderLevelCard(level, isSelected)}
          </Pressable>
        ) : (
          <DefaultLevelCard
            level={level}
            isSelected={isSelected}
            onPress={() => onSelectLevel(level)}
          />
        );

        // Wrapper animé pour le fade et glissement
        return (
          <AnimatedLevelCardWrapper
            key={level.id}
            index={index}
            fadeProgress={cardsFadeProgress}
            selectedLevelIndex={selectedLevelIndex}
            slideProgress={cardSlideProgress}
            slideDistance={slideDistance}
          >
            {cardContent}
          </AnimatedLevelCardWrapper>
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
            La carte niveau glisse depuis la grille vers sa position finale
            (gauche pour niveau 1-5, droite pour niveau 6-10)
            ================================================ */}
        {isPlaying && (
          <Animated.View
            style={[styles.progressContainer, progressAnimatedStyle]}
            pointerEvents={isPlaying ? 'auto' : 'none'}
          >
            {/* Panneau de progression (métriques) - centré */}
            {renderProgress?.()}
          </Animated.View>
        )}

        {/* ================================================
            VUE 1 - GRILLE DE SELECTION DES NIVEAUX
            Toujours monté pour permettre les animations de regroupement.
            Chaque carte gère son propre fade (sauf la sélectionnée qui reste visible).
            Position absolue pour maintenir Y pendant le glissement.
            ================================================ */}
        <View
          style={styles.selectorContainer}
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
        </View>

        {/* Spacer pour réserver l'espace du selectorContainer (toujours présent) */}
        <View style={styles.selectorSpacer} />

        {/* ================================================
            MASCOTTE
            Position fixe (non impactée par isPlaying)
            ================================================ */}
        <View style={styles.mascotContainer} pointerEvents="box-none">
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
  // Position absolue pour maintenir la position Y pendant l'animation de glissement
  // =====================
  selectorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    zIndex: 50,
  },

  // Spacer pour réserver l'espace du selectorContainer en position absolue
  // Permet de pousser vers le bas la mascotte, le jeu et le bouton "C'est parti"
  selectorSpacer: {
    height: 140, // Hauteur approximative des cartes de niveau + padding
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
  // Position absolue pour ne pas impacter le layout de la mascotte/jeu
  // =====================
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },

  // =====================
  // 4. MASCOTTE
  // (position fixe, non impactée par isPlaying)
  // =====================
  mascotContainer: {
    zIndex: 40,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: spacing[2],
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
