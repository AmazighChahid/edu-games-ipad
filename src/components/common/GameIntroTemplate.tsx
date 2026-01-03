/**
 * GameIntroTemplate
 * =================
 * Template unifie pour les ecrans d'introduction des jeux educatifs.
 *
 * ARCHITECTURE A 2 VUES :
 * -----------------------
 *
 * VUE 1 - SELECTION (isPlaying = false)
 * -------------------------------------
 * L'enfant choisit son niveau avant de jouer.
 * Elements visibles :
 *   - Header avec titre du jeu
 *   - Grille de selection des niveaux (1-10)
 *   - Mascotte en position centrale
 *   - Apercu du jeu (inactif)
 *   - Bouton "C'est parti !"
 *
 * VUE 2 - PLAY (isPlaying = true)
 * -------------------------------
 * L'enfant joue activement au jeu.
 * Elements visibles :
 *   - Header (identique)
 *   - Panneau de progression (remplace la grille)
 *   - Carte du niveau selectionne (animee depuis la grille)
 *   - Mascotte en position fixe
 *   - Zone de jeu active
 *   - Boutons flottants (reset, indice, terminer)
 *
 * TRANSITION (isPlaying: false -> true)
 * -------------------------------------
 * Quand l'utilisateur clique sur "C'est parti !" :
 *   1. Toutes les cartes glissent vers la carte selectionnee (regroupement)
 *   2. Le groupe se deplace vers sa position finale (gauche ou droite)
 *   3. Le panneau de progression apparait progressivement
 *
 * TRANSITION RETOUR (isPlaying: true -> false)
 * --------------------------------------------
 * Quand l'utilisateur clique sur le bouton retour :
 *   1. Le panneau de progression disparait progressivement
 *   2. Toutes les cartes reviennent a leur position initiale (separation)
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
} from './GameIntroTemplate.types';

// ============================================
// RE-EXPORTS (pour import simplifie)
// ============================================

export type {
  GameIntroTemplateProps,
  LevelConfig,
  TrainingConfig,
  TrainingParam,
  PlayingLayoutVariant,
  ColumnLayoutConfig,
} from './GameIntroTemplate.types';
export {
  calculateLevelsForAge,
  generateDefaultLevels,
  DEFAULT_ANIMATION_CONFIG,
} from './GameIntroTemplate.types';

// ============================================
// CONSTANTES
// ============================================

/** Couleurs associees a chaque niveau de difficulte */
const DIFFICULTY_COLORS: Record<LevelConfig['difficulty'], string> = {
  easy: colors.feedback.success,           // Vert
  medium: colors.secondary.main,           // Orange
  hard: colors.primary.main,               // Bleu
  expert: colors.home.categories.spatial,  // Violet
};

/** Labels francais pour les difficultes */
const DIFFICULTY_LABELS: Record<LevelConfig['difficulty'], string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
  expert: 'Expert',
};

/** Largeur d'une carte + gap pour calcul de glissement */
const CARD_WIDTH_WITH_GAP = 92;

// ============================================
// SOUS-COMPOSANT: AnimatedLevelCardWrapper
// ============================================
// Wrapper anime pour les cartes de niveau.
// Toutes les cartes glissent vers la carte selectionnee (regroupement)
// puis le groupe entier glisse vers sa position finale.

interface AnimatedLevelCardWrapperProps {
  children: React.ReactNode;
  index: number;
  selectedLevelIndex: number;
  slideProgress: SharedValue<number>;
  /** Distance pour regrouper cette carte vers la carte selectionnee */
  groupSlideDistance: number;
  /** Distance pour deplacer le groupe vers sa position finale */
  finalSlideDistance: number;
}

const AnimatedLevelCardWrapper: React.FC<AnimatedLevelCardWrapperProps> = ({
  children,
  index,
  selectedLevelIndex,
  slideProgress,
  groupSlideDistance,
  finalSlideDistance,
}) => {
  const isSelected = index === selectedLevelIndex;

  const animatedStyle = useAnimatedStyle(() => {
    const slide = slideProgress.value;

    // Phase 1 (0 -> 0.5) : regroupement vers la carte selectionnee
    // Phase 2 (0.5 -> 1) : deplacement du groupe vers la position finale
    const groupProgress = interpolate(slide, [0, 0.5], [0, 1], 'clamp');
    const finalProgress = interpolate(slide, [0.5, 1], [0, 1], 'clamp');

    // Calcul du deplacement total
    const groupOffset = groupSlideDistance * groupProgress;
    const finalOffset = finalSlideDistance * finalProgress;

    // Les cartes non-selectionnees disparaissent progressivement pendant le regroupement
    // La carte selectionnee reste toujours visible (opacite = 1)
    const opacity = isSelected ? 1 : interpolate(slide, [0, 0.4], [1, 0], 'clamp');

    return {
      transform: [{ translateX: groupOffset + finalOffset }],
      opacity,
      // La carte selectionnee reste au-dessus pendant l'animation
      zIndex: isSelected ? 100 : 1,
    };
  }, [index, selectedLevelIndex, groupSlideDistance, finalSlideDistance, isSelected]);

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// ============================================
// SOUS-COMPOSANT: DefaultLevelCard
// ============================================
// Carte de niveau par defaut.
// Peut etre remplacee via la prop `renderLevelCard`.

interface DefaultLevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
  onPress: () => void;
}

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
      accessibilityLabel={`Niveau ${level.number}${level.isCompleted ? ', complete' : ''}${!level.isUnlocked ? ', verrouille' : ''}`}
      accessibilityRole="button"
    >
      {/* Etoiles (si niveau complete) */}
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

      {/* Numero du niveau */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && { color: difficultyColor },
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? level.number : '🔒'}
      </Text>

      {/* Badge de difficulte */}
      <View
        style={[
          styles.difficultyBadge,
          { backgroundColor: level.isUnlocked ? difficultyColor : colors.text.muted },
        ]}
      >
        <Text style={styles.difficultyText}>
          {level.isUnlocked ? DIFFICULTY_LABELS[level.difficulty] : 'Bloque'}
        </Text>
      </View>
    </Pressable>
  );
};

// ============================================
// SOUS-COMPOSANT: SelectionView
// ============================================
// Vue 1 : Grille de selection des niveaux
// Visible quand isPlaying = false
// Contient le bouton mode entrainement et la grille de niveaux

interface SelectionViewProps {
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  onSelectLevel: (level: LevelConfig) => void;
  renderLevelCard?: (level: LevelConfig, isSelected: boolean) => React.ReactNode;
  cardSlideProgress: SharedValue<number>;
  selectedLevelIndex: number;
  finalSlideDistance: number;
  showTrainingMode: boolean;
  onTrainingPress?: () => void;
  isTrainingMode: boolean;
  trainingConfig?: GameIntroTemplateProps['trainingConfig'];
  isPlaying: boolean;
}

const SelectionView: React.FC<SelectionViewProps> = ({
  levels,
  selectedLevel,
  onSelectLevel,
  renderLevelCard,
  cardSlideProgress,
  selectedLevelIndex,
  finalSlideDistance,
  showTrainingMode,
  onTrainingPress,
  isTrainingMode,
  trainingConfig,
  isPlaying,
}) => {
  // Rendu de la grille de niveaux
  const renderLevelGrid = () => (
    <View style={styles.levelGrid}>
      {levels.slice(0, 10).map((level, index) => {
        const isSelected = selectedLevel?.id === level.id;

        // Calcul de la distance de regroupement pour cette carte
        // Chaque carte glisse vers la position de la carte selectionnee
        const groupSlideDistance = (selectedLevelIndex - index) * CARD_WIDTH_WITH_GAP;

        const cardContent = renderLevelCard ? (
          <Pressable onPress={() => level.isUnlocked && onSelectLevel(level)}>
            {renderLevelCard(level, isSelected)}
          </Pressable>
        ) : (
          <DefaultLevelCard
            level={level}
            isSelected={isSelected}
            onPress={() => onSelectLevel(level)}
          />
        );

        return (
          <AnimatedLevelCardWrapper
            key={level.id}
            index={index}
            selectedLevelIndex={selectedLevelIndex}
            slideProgress={cardSlideProgress}
            groupSlideDistance={groupSlideDistance}
            finalSlideDistance={finalSlideDistance}
          >
            {cardContent}
          </AnimatedLevelCardWrapper>
        );
      })}
    </View>
  );

  // Rendu de la configuration d'entrainement
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

  return (
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
          accessibilityLabel="Mode entrainement"
          accessibilityRole="button"
        >
          <Text style={styles.trainingButtonEmoji}>🎯</Text>
          <Text
            style={[
              styles.trainingButtonText,
              isTrainingMode && styles.trainingButtonTextActive,
            ]}
          >
            Entrainement
          </Text>
        </Pressable>
      )}

      {/* Grille de niveaux OU config entrainement */}
      {isTrainingMode ? renderTrainingConfig() : renderLevelGrid()}
    </View>
  );
};

// ============================================
// SOUS-COMPOSANT: PlayView
// ============================================
// Vue 2 : Elements visibles uniquement en mode jeu
// Visible quand isPlaying = true

interface PlayViewProps {
  renderProgress?: () => React.ReactNode;
  progressOpacity: SharedValue<number>;
  isPlaying: boolean;
  isVictory: boolean;
  showResetButton: boolean;
  onReset?: () => void;
  showHintButton: boolean;
  onHint?: () => void;
  hintsRemaining: number;
  hintsDisabled: boolean;
  showForceCompleteButton: boolean;
  onForceComplete?: () => void;
}

const PlayView: React.FC<PlayViewProps> = ({
  renderProgress,
  progressOpacity,
  isPlaying,
  isVictory,
  showResetButton,
  onReset,
  showHintButton,
  onHint,
  hintsRemaining,
  hintsDisabled,
  showForceCompleteButton,
  onForceComplete,
}) => {
  // Style anime pour le panneau de progression
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  if (!isPlaying) return null;

  return (
    <>
      {/* Panneau de progression */}
      <Animated.View
        style={[styles.progressContainer, progressAnimatedStyle]}
        pointerEvents="auto"
      >
        {renderProgress?.()}
      </Animated.View>

      {/* Boutons flottants (sauf en victoire) */}
      {!isVictory && (
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

          {/* Bouton Indice */}
          {showHintButton && onHint && !hintsDisabled && (
            <HintButton
              hintsRemaining={hintsRemaining}
              maxHints={3}
              onPress={onHint}
              size="medium"
              colorScheme="orange"
            />
          )}

          {/* Bouton Terminer */}
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
    </>
  );
};

// ============================================
// SOUS-COMPOSANT: PlayButton
// ============================================
// Bouton "C'est parti !" visible en Vue 1
// quand un niveau est selectionne

interface PlayButtonProps {
  isPlaying: boolean;
  selectedLevel: LevelConfig | null;
  showPlayButton: boolean;
  playButtonEmoji: string;
  playButtonText: string;
  onPress: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  selectedLevel,
  showPlayButton,
  playButtonEmoji,
  playButtonText,
  onPress,
}) => {
  if (isPlaying || !selectedLevel || !showPlayButton) return null;

  return (
    <Pressable
      onPress={onPress}
      style={styles.playButton}
      accessible
      accessibilityLabel="Commencer a jouer"
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
  );
};

// ============================================
// COMPOSANT PRINCIPAL: GameIntroTemplate
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
  headerRightContent,

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

  // --- LAYOUT (January 2026 - Standardization) ---
  playingLayout = 'fullwidth',
  columnConfig = { leftRatio: 4, rightRatio: 6, gap: 16 },
  leftColumnContent,
  rightColumnContent,
}) => {
  // ============================================
  // VALEURS ANIMEES (Reanimated)
  // ============================================

  // Animation de glissement des cartes (0 = positions initiales, 1 = regroupees + deplacement final)
  const cardSlideProgress = useSharedValue(0);

  // Opacite du panneau de progression (0 = invisible, 1 = visible)
  const progressOpacity = useSharedValue(0);

  // ============================================
  // CALCULS DERIVES
  // ============================================

  // Index du niveau selectionne dans le tableau
  const selectedLevelIndex = useMemo(() => {
    if (!selectedLevel) return 0;
    return levels.findIndex(l => l.id === selectedLevel.id);
  }, [selectedLevel, levels]);

  // Distance de deplacement final du groupe (vers gauche ou droite de l'ecran)
  // Les niveaux 1-5 vont vers la gauche, les niveaux 6-10 vers la droite
  const finalSlideDistance = useMemo(() => {
    if (!selectedLevel || levels.length === 0) return 0;

    const levelNumbers = levels.map(l => l.number);
    const minLevel = Math.min(...levelNumbers);
    const maxLevel = Math.max(...levelNumbers);
    const medianLevel = (minLevel + maxLevel) / 2;

    const levelNumber = selectedLevel.number;

    if (levelNumber <= medianLevel) {
      // Deplacement vers la gauche (negatif)
      // Le groupe regroupé glisse pour que le niveau selectionne soit a gauche
      return -selectedLevelIndex * CARD_WIDTH_WITH_GAP;
    } else {
      // Deplacement vers la droite (positif)
      // Le groupe regroupé glisse pour que le niveau selectionne soit a droite
      return (levels.length - 1 - selectedLevelIndex) * CARD_WIDTH_WITH_GAP;
    }
  }, [selectedLevel, levels, selectedLevelIndex]);

  // ============================================
  // ANIMATIONS DE TRANSITION
  // ============================================

  /**
   * Transition VUE 1 -> VUE 2
   * Declenchee par le bouton "C'est parti !"
   */
  const transitionToPlayMode = useCallback(() => {
    if (isPlaying) return;

    // Animation des cartes : regroupement puis deplacement final
    cardSlideProgress.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });

    // Panneau de progression apparait apres le regroupement
    progressOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 300 })
    );

    // Notifier le parent
    onStartPlaying?.();
  }, [isPlaying, cardSlideProgress, progressOpacity, onStartPlaying]);

  /**
   * Transition VUE 2 -> VUE 1
   * Declenchee par le bouton retour pendant le jeu
   */
  const transitionToSelectionMode = useCallback(() => {
    // Panneau de progression disparait
    progressOpacity.value = withTiming(0, { duration: 200 });

    // Les cartes reviennent a leur position initiale
    cardSlideProgress.value = withDelay(
      100,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [cardSlideProgress, progressOpacity]);

  // ============================================
  // SYNCHRONISATION AVEC isPlaying
  // ============================================

  /**
   * Synchronise les animations quand isPlaying change depuis l'exterieur.
   * Permet aux jeux de declencher le mode play directement
   * (ex: premier mouvement dans Hanoi sans cliquer sur "C'est parti").
   */
  useEffect(() => {
    if (isPlaying) {
      // Transition vers VUE 2 : regroupement + deplacement
      cardSlideProgress.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });
      progressOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 300 })
      );
    } else {
      // Transition vers VUE 1 : separation
      progressOpacity.value = withTiming(0, { duration: 200 });
      cardSlideProgress.value = withDelay(
        100,
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.quad),
        })
      );
    }
  }, [isPlaying, cardSlideProgress, progressOpacity]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Gestion du bouton retour :
   * - Si en mode jeu (pas victoire) : anime la transition vers selection
   * - Dans tous les cas : delegue au parent via onBack()
   */
  const handleBack = useCallback(() => {
    if (isPlaying && !isVictory) {
      transitionToSelectionMode();
    }
    onBack();
  }, [isPlaying, isVictory, transitionToSelectionMode, onBack]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <PageContainer variant="playful" scrollable={false}>
      {/* ========================================
          HEADER (commun aux 2 vues)
          ======================================== */}
      <ScreenHeader
        variant="game"
        title={title}
        emoji={emoji}
        onBack={handleBack}
        showParentButton={showParentButton && !!onParentPress}
        onParentPress={onParentPress}
        showHelpButton={showHelpButton && !!onHelpPress}
        onHelpPress={onHelpPress}
        rightContent={headerRightContent}
      />

      <View style={styles.mainContainer}>
        {/* ========================================
            VUE 2 - ELEMENTS SPECIFIQUES AU MODE JEU
            (isPlaying = true)
            - Panneau de progression
            - Boutons flottants
            ======================================== */}
        <PlayView
          renderProgress={renderProgress}
          progressOpacity={progressOpacity}
          isPlaying={isPlaying}
          isVictory={isVictory}
          showResetButton={showResetButton}
          onReset={onReset}
          showHintButton={showHintButton}
          onHint={onHint}
          hintsRemaining={hintsRemaining}
          hintsDisabled={hintsDisabled}
          showForceCompleteButton={showForceCompleteButton}
          onForceComplete={onForceComplete}
        />

        {/* ========================================
            VUE 1 - GRILLE DE SELECTION DES NIVEAUX
            (isPlaying = false, mais toujours monte
            pour les animations)
            ======================================== */}
        <SelectionView
          levels={levels}
          selectedLevel={selectedLevel}
          onSelectLevel={onSelectLevel}
          renderLevelCard={renderLevelCard}
          cardSlideProgress={cardSlideProgress}
          selectedLevelIndex={selectedLevelIndex}
          finalSlideDistance={finalSlideDistance}
          showTrainingMode={showTrainingMode}
          onTrainingPress={onTrainingPress}
          isTrainingMode={isTrainingMode}
          trainingConfig={trainingConfig}
          isPlaying={isPlaying}
        />

        {/* Spacer pour l'espace de la grille (position absolue) */}
        <View style={styles.selectorSpacer} />

        {/* ========================================
            MASCOTTE (commun aux 2 vues)
            Position fixe, non impactee par isPlaying
            ======================================== */}
        <View style={styles.mascotContainer} pointerEvents="box-none">
          {mascotComponent}
        </View>

        {/* ========================================
            ZONE DE JEU (commun aux 2 vues)
            - Vue 1 : apercu inactif
            - Vue 2 : jeu actif

            Layouts disponibles :
            - 'fullwidth' : le jeu prend toute la largeur (défaut)
            - '2-columns' : 2 colonnes avec ratio configurable
            ======================================== */}
        <View style={styles.gameContainer}>
          {/* Layout 2 colonnes (quand playingLayout === '2-columns' et isPlaying) */}
          {playingLayout === '2-columns' && isPlaying && leftColumnContent && rightColumnContent ? (
            <View style={[styles.twoColumnLayout, { gap: columnConfig.gap || 16 }]}>
              <View
                style={[
                  styles.leftColumn,
                  {
                    flex: columnConfig.leftRatio,
                    minWidth: columnConfig.leftMinWidth,
                  },
                ]}
              >
                {leftColumnContent}
              </View>
              <View
                style={[
                  styles.rightColumn,
                  {
                    flex: columnConfig.rightRatio,
                    minWidth: columnConfig.rightMinWidth,
                  },
                ]}
              >
                {rightColumnContent}
              </View>
            </View>
          ) : (
            /* Layout fullwidth (défaut) ou mode aperçu */
            renderGame()
          )}

          {/* Bouton "C'est parti !" (Vue 1 uniquement) */}
          <PlayButton
            isPlaying={isPlaying}
            selectedLevel={selectedLevel}
            showPlayButton={showPlayButton}
            playButtonEmoji={playButtonEmoji}
            playButtonText={playButtonText}
            onPress={transitionToPlayMode}
          />
        </View>

        {/* ========================================
            OVERLAY VICTOIRE
            Affiche par-dessus tout quand isVictory = true
            ======================================== */}
        {isVictory && victoryComponent}
      </View>
    </PageContainer>
  );
};

// ============================================
// STYLES
// ============================================
//
// Organisation par categorie :
// 1. LAYOUT GENERAL
// 2. VUE 1 - GRILLE DE NIVEAUX (isPlaying = false)
// 3. VUE 2 - PANNEAU PROGRESSION (isPlaying = true)
// 4. MASCOTTE (commun)
// 5. ZONE DE JEU (commun)
// 6. BOUTONS
//    - Bouton "C'est parti !" (Vue 1)
//    - Boutons flottants (Vue 2)

const styles = StyleSheet.create({
  // =====================
  // 1. LAYOUT GENERAL
  // =====================
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },

  // =====================
  // 2. VUE 1 - GRILLE DE NIVEAUX
  // (isPlaying = false)
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

  selectorSpacer: {
    height: 140,
  },

  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[3],
  },

  // Carte de niveau - etats
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

  // Etoiles dans la carte
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

  // Numero et badge difficulte
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

  // Mode entrainement
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
  // 3. VUE 2 - PANNEAU PROGRESSION
  // (isPlaying = true)
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
  // 4. MASCOTTE (commun)
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
  // 5. ZONE DE JEU (commun)
  // =====================
  gameContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing[4],
  },

  // =====================
  // 6. BOUTONS
  // =====================

  // Bouton "C'est parti !" (Vue 1)
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

  // Boutons flottants (Vue 2)
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

  // =====================
  // 7. LAYOUT 2 COLONNES (January 2026)
  // =====================
  twoColumnLayout: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  leftColumn: {
    justifyContent: 'flex-start',
  },
  rightColumn: {
    justifyContent: 'flex-start',
  },
});

export default GameIntroTemplate;
