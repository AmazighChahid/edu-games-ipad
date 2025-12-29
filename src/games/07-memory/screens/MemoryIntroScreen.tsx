/**
 * MemoryIntroScreen
 * Écran d'introduction pour le jeu Super Mémoire
 *
 * Suit le pattern Hook + Template :
 * - useMemoryIntro : orchestrateur (logique, état, animations)
 * - GameIntroTemplate : UI standardisée
 * - MemoMascot : mascotte SVG animée
 *
 * ~120 lignes - Assemblage minimal
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { GameIntroTemplate, Button } from '../../../components/common';
import { ParentDrawer } from '../../../components/parent/ParentDrawer';
import { GameBoard } from '../components/GameBoard';
import { MemoMascot } from '../components/mascot';
import { useMemoryIntro } from '../hooks/useMemoryIntro';
import { getLevelByNumber } from '../data/levels';
import { memoryParentGuideData } from '../data/parentGuideData';
import { Icons } from '../../../constants/icons';
import { colors, spacing, borderRadius, shadows, fontFamily, textStyles } from '../../../theme';
import type { LevelConfig } from '../../../components/common';

// ============================================================================
// CONSTANTS
// ============================================================================

const THEME_ICONS: Record<string, string> = {
  animals: Icons.dog, fruits: Icons.apple, vehicles: Icons.car,
  nature: Icons.flowerCherry, space: Icons.rocket, emojis: Icons.celebration,
};

// ============================================================================
// COMPONENT
// ============================================================================

function MemoryIntroScreen() {
  const intro = useMemoryIntro();

  // Render level card
  const renderLevelCard = (level: LevelConfig, isSelected: boolean) => {
    const memoryLevel = getLevelByNumber(level.number);
    if (!memoryLevel) return null;

    const difficultyColor = memoryLevel.difficulty === 'easy' ? colors.feedback.success :
      memoryLevel.difficulty === 'medium' ? colors.secondary.main : colors.feedback.error;

    return (
      <View style={[styles.levelCard, isSelected && styles.levelCardSelected, !level.isUnlocked && styles.levelCardLocked]}>
        <Text style={styles.levelThemeIcon}>{!level.isUnlocked ? Icons.lock : THEME_ICONS[memoryLevel.theme] || Icons.cards}</Text>
        <Text style={[styles.levelNumber, isSelected && styles.levelNumberSelected]}>{level.number}</Text>
        <View style={[styles.pairsBadge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.pairsText}>{memoryLevel.pairCount}p</Text>
        </View>
        {level.isCompleted && level.stars !== undefined && (
          <View style={styles.starsRow}>
            {[1, 2, 3].map((s) => <Text key={s} style={s <= (level.stars || 0) ? styles.starFilled : styles.starEmpty}>{Icons.star}</Text>)}
          </View>
        )}
      </View>
    );
  };

  // Render game
  const renderGame = () => {
    if (intro.isPlaying && intro.gameState) {
      return <GameBoard gameState={intro.gameState} onCardPress={intro.handleCardFlip} onPause={intro.handlePause} onHint={intro.handleHint} onBack={intro.handleBack} />;
    }

    if (!intro.currentMemoryLevel) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>{Icons.elephant}</Text>
          <Text style={styles.emptyText}>Sélectionne un niveau pour voir les détails</Text>
        </View>
      );
    }

    return (
      <View style={styles.previewContainer}>
        <View style={styles.cardPreview}>
          {Array.from({ length: Math.min(intro.currentMemoryLevel.pairCount * 2, 12) }).map((_, i) => (
            <Animated.View key={i} entering={ZoomIn.delay(i * 50)} style={[styles.previewCard, { backgroundColor: i % 2 === 0 ? colors.primary.light : colors.secondary.light }]}>
              <Text style={styles.previewCardText}>?</Text>
            </Animated.View>
          ))}
        </View>
        <View style={styles.levelInfoCard}>
          <Text style={styles.levelInfoText}>{THEME_ICONS[intro.currentMemoryLevel.theme]} Thème: {intro.currentMemoryLevel.theme}</Text>
          <Text style={styles.levelInfoText}>{Icons.memoryPairs} {intro.currentMemoryLevel.pairCount} paires à trouver</Text>
          {intro.currentMemoryLevel.timeLimit > 0 && <Text style={styles.levelInfoText}>{Icons.timer} {Math.floor(intro.currentMemoryLevel.timeLimit / 60)}:{String(intro.currentMemoryLevel.timeLimit % 60).padStart(2, '0')}</Text>}
        </View>
        <Button variant="primary" size="large" onPress={intro.handleStartPlaying} label={`${Icons.memoryPairs} C'est parti !`} />
      </View>
    );
  };

  // Render progress
  const renderProgress = () => (
    <View style={styles.progressPanel}>
      <View style={styles.progressItem}><Text style={styles.progressValue}>{intro.progressData.completedLevels}</Text><Text style={styles.progressLabel}>/ {intro.progressData.totalLevels}</Text></View>
      <View style={styles.progressDivider} />
      <View style={styles.progressItem}><Text style={styles.progressValue}>{intro.progressData.currentLevel}</Text><Text style={styles.progressLabel}>{Icons.memoryPairs}</Text></View>
      <View style={styles.progressDivider} />
      <View style={styles.progressItem}><Text style={styles.progressValue}>{intro.progressData.totalStars}</Text><Text style={styles.progressLabel}>{Icons.star}</Text></View>
    </View>
  );

  return (
    <>
      <GameIntroTemplate
        title="Super Mémoire" emoji={Icons.elephant} onBack={intro.handleBack} onParentPress={intro.handleParentPress} onHelpPress={intro.handleHelpPress}
        showParentButton showHelpButton levels={intro.levels} selectedLevel={intro.selectedLevel} onSelectLevel={intro.handleSelectLevel}
        renderLevelCard={renderLevelCard} levelColumns={5} showTrainingMode trainingConfig={intro.trainingConfig}
        onTrainingPress={intro.handleTrainingPress} isTrainingMode={intro.isTrainingMode} renderGame={renderGame} isPlaying={intro.isPlaying}
        onStartPlaying={intro.handleStartPlaying} renderProgress={renderProgress}
        mascotComponent={!intro.isPlaying ? <MemoMascot message={intro.mascotMessage} emotion={intro.mascotEmotion} /> : undefined}
        mascotMessage={intro.mascotMessage} showResetButton={!intro.isPlaying} onReset={intro.handleReset}
        showHintButton={!intro.isPlaying} onHint={intro.handleHint} hintsRemaining={intro.hintsRemaining}
      />

      {/* Fiche parent de l'activité */}
      <ParentDrawer
        isVisible={intro.showParentDrawer}
        onClose={() => intro.setShowParentDrawer(false)}
        activityName={memoryParentGuideData.activityName}
        activityEmoji={memoryParentGuideData.activityEmoji}
        gameData={memoryParentGuideData.gameData}
        appBehavior={memoryParentGuideData.appBehavior}
        competences={memoryParentGuideData.competences}
        scienceData={memoryParentGuideData.scienceData}
        advices={memoryParentGuideData.advices}
        warningText={memoryParentGuideData.warningText}
        teamMessage={memoryParentGuideData.teamMessage}
        questionsDuring={memoryParentGuideData.questionsDuring}
        questionsAfter={memoryParentGuideData.questionsAfter}
        questionsWarning={memoryParentGuideData.questionsWarning}
        dailyActivities={memoryParentGuideData.dailyActivities}
        transferPhrases={memoryParentGuideData.transferPhrases}
        resources={memoryParentGuideData.resources}
        badges={memoryParentGuideData.badges}
        ageExpectations={memoryParentGuideData.ageExpectations}
        settings={memoryParentGuideData.settings}
      />
    </>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  levelCard: { backgroundColor: colors.background.card, borderRadius: borderRadius.xl, padding: spacing[3], alignItems: 'center', minWidth: 72, minHeight: 100, borderWidth: 3, borderColor: colors.background.secondary, ...shadows.md },
  levelCardSelected: { backgroundColor: colors.primary.light, borderColor: colors.primary.main, transform: [{ scale: 1.05 }] },
  levelCardLocked: { backgroundColor: colors.background.secondary, opacity: 0.6 },
  levelThemeIcon: { fontSize: 24, marginBottom: spacing[1] },
  levelNumber: { fontSize: 24, fontFamily: fontFamily.bold, color: colors.text.primary },
  levelNumberSelected: { color: colors.primary.main },
  pairsBadge: { paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: borderRadius.md, marginTop: spacing[1] },
  pairsText: { fontSize: 12, fontFamily: fontFamily.bold, color: '#FFFFFF' },
  starsRow: { flexDirection: 'row', marginTop: spacing[1] },
  starFilled: { fontSize: 14, color: colors.secondary.main },
  starEmpty: { fontSize: 14, color: colors.text.muted, opacity: 0.3 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: spacing[8], gap: spacing[4] },
  emptyEmoji: { fontSize: 64 },
  emptyText: { ...textStyles.body, color: colors.text.muted, textAlign: 'center' },
  previewContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[4] },
  cardPreview: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing[2], maxWidth: 280 },
  previewCard: { width: 44, height: 60, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  previewCardText: { fontSize: 20, fontFamily: fontFamily.bold, color: colors.text.primary },
  levelInfoCard: { backgroundColor: colors.background.card, borderRadius: borderRadius.lg, padding: spacing[4], ...shadows.md, gap: spacing[2], width: '100%', maxWidth: 280 },
  levelInfoText: { ...textStyles.body, color: colors.text.primary },
  playButton: { marginTop: spacing[2] },
  progressPanel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[5], backgroundColor: 'rgba(255,255,255,0.95)', paddingVertical: spacing[3], paddingHorizontal: spacing[5], borderRadius: borderRadius.xl, marginHorizontal: spacing[4], ...shadows.md },
  progressItem: { alignItems: 'center' },
  progressValue: { ...textStyles.h3, color: colors.primary.main, fontFamily: fontFamily.bold },
  progressLabel: { ...textStyles.caption, color: colors.text.secondary, fontSize: 12 },
  progressDivider: { width: 1, height: 30, backgroundColor: colors.background.secondary },
});

// Export named for compatibility with playground registry
export { MemoryIntroScreen };
export default MemoryIntroScreen;
