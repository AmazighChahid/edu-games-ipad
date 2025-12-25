/**
 * ParentZone component
 * Educational guide and tips for parents
 */

import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { spacing } from '@/theme';

const PANEL_HEIGHT = 380;
const COLLAPSED_HEIGHT = 0;

export type GameMode = 'discovery' | 'challenge' | 'expert';

type TabType = 'method' | 'tips' | 'modes';

interface ParentZoneProps {
  progression: number;
  maxProgression: number;
  hintsRemaining: number;
  maxHints: number;
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onHintPress: () => void;
  isVisible?: boolean;
}

export function ParentZone({
  progression,
  maxProgression,
  hintsRemaining,
  maxHints,
  currentMode,
  onModeChange,
  onHintPress,
  isVisible = true,
}: ParentZoneProps) {
  const animation = useSharedValue(isVisible ? 1 : 0);
  const [activeTab, setActiveTab] = useState<TabType>('method');

  useEffect(() => {
    animation.value = withSpring(isVisible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
  }, [isVisible, animation]);

  const panelStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animation.value,
      [0, 1],
      [COLLAPSED_HEIGHT, PANEL_HEIGHT],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      animation.value,
      [0, 1],
      [PANEL_HEIGHT, 0],
      Extrapolate.CLAMP
    );

    return {
      height,
      transform: [{ translateY }],
      opacity: animation.value,
    };
  });

  const renderMethodContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>La méthode de la Tour de Hanoï</Text>

      <View style={styles.methodCard}>
        <Text style={styles.methodNumber}>1</Text>
        <View style={styles.methodTextContainer}>
          <Text style={styles.methodTitle}>Objectif du jeu</Text>
          <Text style={styles.methodText}>
            Déplacer tous les disques de la tour A vers la tour C, en utilisant B comme intermédiaire.
          </Text>
        </View>
      </View>

      <View style={styles.methodCard}>
        <Text style={styles.methodNumber}>2</Text>
        <View style={styles.methodTextContainer}>
          <Text style={styles.methodTitle}>Les 3 règles d'or</Text>
          <Text style={styles.methodText}>
            • Un seul disque à la fois{'\n'}
            • Seul le disque du haut peut bouger{'\n'}
            • Jamais un grand sur un petit
          </Text>
        </View>
      </View>

      <View style={styles.methodCard}>
        <Text style={styles.methodNumber}>3</Text>
        <View style={styles.methodTextContainer}>
          <Text style={styles.methodTitle}>La stratégie récursive</Text>
          <Text style={styles.methodText}>
            Pour déplacer N disques : d'abord déplacer les N-1 du dessus vers la tour intermédiaire, puis le grand vers la destination.
          </Text>
        </View>
      </View>

      <View style={styles.formulaBox}>
        <Text style={styles.formulaLabel}>Nombre minimum de coups :</Text>
        <Text style={styles.formulaText}>2ⁿ - 1 (ex: 3 disques = 7 coups)</Text>
      </View>
    </View>
  );

  const renderTipsContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Accompagner votre enfant</Text>

      <View style={styles.tipCard}>
        <View style={[styles.tipIcon, { backgroundColor: '#4ADE80' }]}>
          <Text style={styles.tipIconText}>✓</Text>
        </View>
        <Text style={styles.tipCardText}>
          Laissez-le <Text style={styles.bold}>manipuler seul</Text> les disques
        </Text>
      </View>

      <View style={styles.tipCard}>
        <View style={[styles.tipIcon, { backgroundColor: '#FBBF24' }]}>
          <Text style={styles.tipIconText}>?</Text>
        </View>
        <Text style={styles.tipCardText}>
          Posez des questions : « Quel disque dois-tu libérer ? »
        </Text>
      </View>

      <View style={styles.tipCard}>
        <View style={[styles.tipIcon, { backgroundColor: '#F87171' }]}>
          <Text style={styles.tipIconText}>!</Text>
        </View>
        <Text style={styles.tipCardText}>
          Ne donnez pas la solution, guidez vers la réflexion
        </Text>
      </View>

      <View style={styles.tipCard}>
        <View style={[styles.tipIcon, { backgroundColor: '#74C0FC' }]}>
          <Text style={styles.tipIconText}>♥</Text>
        </View>
        <Text style={styles.tipCardText}>
          Valorisez l'effort : « Tu as bien réfléchi ! »
        </Text>
      </View>
    </View>
  );

  const renderModesContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Modes de jeu</Text>

      <Pressable
        style={[styles.modeCard, currentMode === 'discovery' && styles.modeCardActive]}
        onPress={() => onModeChange('discovery')}
      >
        <Text style={styles.modeCardIcon}>☀️</Text>
        <View style={styles.modeCardContent}>
          <Text style={styles.modeCardTitle}>Découverte</Text>
          <Text style={styles.modeCardDesc}>Indices illimités, sans pression</Text>
        </View>
        {currentMode === 'discovery' && <Text style={styles.checkMark}>✓</Text>}
      </Pressable>

      <Pressable
        style={[styles.modeCard, currentMode === 'challenge' && styles.modeCardActive]}
        onPress={() => onModeChange('challenge')}
      >
        <Text style={styles.modeCardIcon}>⭐</Text>
        <View style={styles.modeCardContent}>
          <Text style={styles.modeCardTitle}>Défi</Text>
          <Text style={styles.modeCardDesc}>3 indices maximum par niveau</Text>
        </View>
        {currentMode === 'challenge' && <Text style={styles.checkMark}>✓</Text>}
      </Pressable>

      <Pressable
        style={[styles.modeCard, currentMode === 'expert' && styles.modeCardActive]}
        onPress={() => onModeChange('expert')}
      >
        <Text style={styles.modeCardIcon}>🏆</Text>
        <View style={styles.modeCardContent}>
          <Text style={styles.modeCardTitle}>Expert</Text>
          <Text style={styles.modeCardDesc}>Aucun indice, pour les pros !</Text>
        </View>
        {currentMode === 'expert' && <Text style={styles.checkMark}>✓</Text>}
      </Pressable>

      <View style={styles.statsBox}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Coups</Text>
          <Text style={styles.statValue}>{progression}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Objectif</Text>
          <Text style={styles.statValueGreen}>{maxProgression}</Text>
        </View>
        <Pressable
          style={[styles.hintButton, hintsRemaining <= 0 && styles.hintButtonDisabled]}
          onPress={onHintPress}
          disabled={hintsRemaining <= 0}
        >
          <Text style={styles.hintButtonText}>💡 Indice ({hintsRemaining})</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, panelStyle]}>
      {/* Header with tabs */}
      <View style={styles.header}>
        <Pressable
          style={[styles.headerTab, activeTab === 'method' && styles.headerTabActive]}
          onPress={() => setActiveTab('method')}
        >
          <Text style={[styles.headerTabText, activeTab === 'method' && styles.headerTabTextActive]}>
            📖 Méthode
          </Text>
        </Pressable>
        <Pressable
          style={[styles.headerTab, activeTab === 'tips' && styles.headerTabActive]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.headerTabText, activeTab === 'tips' && styles.headerTabTextActive]}>
            💡 Conseils
          </Text>
        </Pressable>
        <Pressable
          style={[styles.headerTab, activeTab === 'modes' && styles.headerTabActive]}
          onPress={() => setActiveTab('modes')}
        >
          <Text style={[styles.headerTabText, activeTab === 'modes' && styles.headerTabTextActive]}>
            🎮 Modes
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {activeTab === 'method' && renderMethodContent()}
        {activeTab === 'tips' && renderTipsContent()}
        {activeTab === 'modes' && renderModesContent()}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBF0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4A9FE8',
  },
  headerTab: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  headerTabActive: {
    backgroundColor: '#3B82D6',
  },
  headerTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  headerTabTextActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentSection: {
    padding: spacing[4],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5D4E37',
    marginBottom: spacing[4],
  },
  // Method tab styles
  methodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing[3],
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  methodNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4A9FE8',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: spacing[3],
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4E37',
    marginBottom: 4,
  },
  methodText: {
    fontSize: 12,
    color: '#8B7355',
    lineHeight: 18,
  },
  formulaBox: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: spacing[3],
    alignItems: 'center',
    marginTop: spacing[2],
  },
  formulaLabel: {
    fontSize: 11,
    color: '#4A9FE8',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formulaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82D6',
    marginTop: 4,
  },
  // Tips tab styles
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing[3],
    marginBottom: spacing[2],
    gap: spacing[3],
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipCardText: {
    flex: 1,
    fontSize: 13,
    color: '#5D4E37',
    lineHeight: 19,
  },
  bold: {
    fontWeight: '700',
  },
  // Modes tab styles
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing[3],
    marginBottom: spacing[2],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeCardActive: {
    borderColor: '#4ADE80',
    backgroundColor: '#F0FDF4',
  },
  modeCardIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  modeCardContent: {
    flex: 1,
  },
  modeCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4E37',
  },
  modeCardDesc: {
    fontSize: 11,
    color: '#8B7355',
    marginTop: 2,
  },
  checkMark: {
    fontSize: 18,
    color: '#4ADE80',
    fontWeight: '700',
  },
  statsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFF5E0',
    borderRadius: 12,
    padding: spacing[3],
    marginTop: spacing[3],
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A9FE8',
  },
  statValueGreen: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4ADE80',
  },
  hintButton: {
    backgroundColor: '#FBBF24',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: 16,
  },
  hintButtonDisabled: {
    backgroundColor: '#E0D5C5',
    opacity: 0.6,
  },
  hintButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D4E37',
  },
});
