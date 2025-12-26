/**
 * ParentDrawer component
 * Bottom drawer with modern tabs for parent educational guide
 * Design: Option 2 - Drawer inférieur avec tabs modernes
 *
 * Simple behavior:
 * - Click "Espace Parent" button → drawer slides up
 * - Click outside or swipe down on handle → drawer closes
 */

import { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { shadows } from '@/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Drawer height - 90% of screen height
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.9;

// Tab types
type TabType = 'objectif' | 'competences' | 'questions' | 'quotidien' | 'progression';

// Game mode types (for progression tab)
export type GameMode = 'discovery' | 'challenge' | 'expert';

// Colors matching the design
const COLORS = {
  primary: '#5B8DEE',
  primaryDark: '#4A7BD9',
  secondary: '#FFB347',
  success: '#7BC74D',
  accent: '#E056FD',
  attention: '#F39C12',
  background: '#FFFFFF',
  surface: '#F7FAFC',
  textDark: '#2D3748',
  textMedium: '#4A5568',
  textMuted: '#718096',
  border: '#E2E8F0',
};

interface ParentDrawerProps {
  isVisible: boolean;
  onClose?: () => void;
  // Game stats for progression tab
  currentMoves?: number;
  optimalMoves?: number;
  hintsRemaining?: number;
  maxHints?: number;
  currentMode?: GameMode;
  onModeChange?: (mode: GameMode) => void;
  onHintPress?: () => void;
  // Child stats
  totalGames?: number;
  successfulGames?: number;
  currentLevel?: number;
}

// Haptic feedback helper
const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
  if (Platform.OS === 'web') return;
  const style = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  }[type];
  Haptics.impactAsync(style);
};

export function ParentDrawer({
  isVisible,
  onClose,
  currentMoves = 0,
  optimalMoves = 7,
  hintsRemaining = 3,
  maxHints = 3,
  currentMode = 'discovery',
  onModeChange,
  onHintPress,
  totalGames = 12,
  successfulGames = 8,
  currentLevel = 3,
}: ParentDrawerProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('objectif');

  // Animation values - start offscreen
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Calculate success rate
  const successRate = totalGames > 0 ? Math.round((successfulGames / totalGames) * 100) : 0;

  // Open/close drawer based on visibility
  useEffect(() => {
    if (isVisible) {
      // Animate both backdrop and drawer
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // Pan responder for swipe to close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward movement (0 = open, positive = closing)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped down more than 100px or with velocity, close
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          triggerHaptic('light');
          onClose?.();
        } else {
          // Snap back to open position
          Animated.spring(translateY, {
            toValue: 0,
            damping: 20,
            stiffness: 150,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Tab data
  const tabs: { id: TabType; label: string; emoji: string }[] = [
    { id: 'objectif', label: 'Objectif & Règles', emoji: '🎯' },
    { id: 'competences', label: 'Compétences', emoji: '🧠' },
    { id: 'questions', label: 'Questions à poser', emoji: '💬' },
    { id: 'quotidien', label: 'Vie quotidienne', emoji: '🏠' },
    { id: 'progression', label: 'Progression', emoji: '📈' },
  ];

  // Tab content renderers
  const renderObjectifContent = () => (
    <View style={styles.contentGrid}>
      {/* Objectif Card */}
      <View style={styles.gridCard}>
        <View style={styles.gridCardHeader}>
          <View style={[styles.gridCardIcon, styles.iconBlue]}>
            <Text style={styles.gridCardIconText}>🎯</Text>
          </View>
          <Text style={styles.gridCardTitle}>Objectif du jeu</Text>
        </View>
        <Text style={styles.gridCardText}>
          Déplacer tous les disques de la tour A vers la tour C, en utilisant B comme intermédiaire.
        </Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxLabel}>Solution optimale</Text>
          <Text style={styles.infoBoxValue}>7 mouvements pour 3 disques</Text>
        </View>
      </View>

      {/* Règles Card */}
      <View style={styles.gridCard}>
        <View style={styles.gridCardHeader}>
          <View style={[styles.gridCardIcon, styles.iconOrange]}>
            <Text style={styles.gridCardIconText}>📜</Text>
          </View>
          <Text style={styles.gridCardTitle}>Les 3 règles d'or</Text>
        </View>
        <View style={styles.rulesList}>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleCheck}>✓</Text>
            <Text style={styles.ruleText}>Un seul disque à la fois</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleCheck}>✓</Text>
            <Text style={styles.ruleText}>Seul le disque du haut bouge</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleCheck}>✓</Text>
            <Text style={styles.ruleText}>Jamais un grand sur un petit</Text>
          </View>
        </View>
      </View>

      {/* Stratégie Card */}
      <View style={styles.gridCard}>
        <View style={styles.gridCardHeader}>
          <View style={[styles.gridCardIcon, styles.iconGreen]}>
            <Text style={styles.gridCardIconText}>💡</Text>
          </View>
          <Text style={styles.gridCardTitle}>La stratégie</Text>
        </View>
        <Text style={styles.gridCardText}>
          Pour déplacer N disques : d'abord déplacer les N-1 du dessus vers la tour intermédiaire, puis le grand vers la destination.
        </Text>
        <View style={styles.tipBox}>
          <Text style={styles.tipBadge}>Astuce</Text>
          <Text style={styles.tipText}>Commencez toujours par le plus petit disque !</Text>
        </View>
      </View>
    </View>
  );

  const renderCompetencesContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionIntro}>
        La Tour de Hanoï développe des compétences essentielles pour la réussite scolaire et la vie quotidienne.
      </Text>

      <View style={styles.skillsGrid}>
        <View style={styles.skillCard}>
          <View style={[styles.skillIcon, { backgroundColor: 'rgba(91, 141, 238, 0.15)' }]}>
            <Text style={styles.skillIconText}>📋</Text>
          </View>
          <Text style={styles.skillTitle}>Planification</Text>
          <Text style={styles.skillDesc}>Capacité à penser avant d'agir</Text>
          <View style={styles.skillStars}>
            <Text style={styles.starFilled}>★★★★★</Text>
          </View>
        </View>

        <View style={styles.skillCard}>
          <View style={[styles.skillIcon, { backgroundColor: 'rgba(123, 199, 77, 0.15)' }]}>
            <Text style={styles.skillIconText}>🧩</Text>
          </View>
          <Text style={styles.skillTitle}>Raisonnement</Text>
          <Text style={styles.skillDesc}>Déduire les conséquences</Text>
          <View style={styles.skillStars}>
            <Text style={styles.starFilled}>★★★★</Text>
            <Text style={styles.starEmpty}>☆</Text>
          </View>
        </View>

        <View style={styles.skillCard}>
          <View style={[styles.skillIcon, { backgroundColor: 'rgba(255, 179, 71, 0.15)' }]}>
            <Text style={styles.skillIconText}>⏳</Text>
          </View>
          <Text style={styles.skillTitle}>Patience</Text>
          <Text style={styles.skillDesc}>Accepter que ça prend du temps</Text>
          <View style={styles.skillStars}>
            <Text style={styles.starFilled}>★★★★★</Text>
          </View>
        </View>

        <View style={styles.skillCard}>
          <View style={[styles.skillIcon, { backgroundColor: 'rgba(224, 86, 253, 0.15)' }]}>
            <Text style={styles.skillIconText}>🧠</Text>
          </View>
          <Text style={styles.skillTitle}>Mémoire</Text>
          <Text style={styles.skillDesc}>Retenir plusieurs informations</Text>
          <View style={styles.skillStars}>
            <Text style={styles.starFilled}>★★★</Text>
            <Text style={styles.starEmpty}>☆☆</Text>
          </View>
        </View>
      </View>

      <View style={styles.scienceBox}>
        <Text style={styles.scienceTitle}>Base scientifique</Text>
        <Text style={styles.scienceText}>
          La Tour de Hanoï est utilisée en neuropsychologie pour évaluer les fonctions exécutives. Des études montrent que la pratique régulière améliore la capacité de planification (+15% en moyenne).
        </Text>
      </View>
    </View>
  );

  const renderQuestionsContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionIntro}>
        Ces questions aident votre enfant à verbaliser sa réflexion (métacognition). Guidez sans donner la réponse !
      </Text>

      <View style={styles.questionCategory}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.categoryIconText}>🎮</Text>
          </View>
          <Text style={styles.categoryTitle}>Pendant le jeu</Text>
        </View>
        <View style={styles.questionsList}>
          <View style={styles.questionItem}>
            <Text style={styles.questionBullet}>💬</Text>
            <Text style={styles.questionText}>"Par quel disque vas-tu commencer ?"</Text>
          </View>
          <View style={styles.questionItem}>
            <Text style={styles.questionBullet}>💬</Text>
            <Text style={styles.questionText}>"Que se passe-t-il si tu mets celui-ci là ?"</Text>
          </View>
          <View style={styles.questionItem}>
            <Text style={styles.questionBullet}>💬</Text>
            <Text style={styles.questionText}>"Comment peux-tu libérer le grand disque ?"</Text>
          </View>
        </View>
      </View>

      <View style={styles.questionCategory}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: COLORS.success }]}>
            <Text style={styles.categoryIconText}>✅</Text>
          </View>
          <Text style={styles.categoryTitle}>Après l'activité</Text>
        </View>
        <View style={styles.questionsList}>
          <View style={styles.questionItem}>
            <Text style={styles.questionBullet}>💬</Text>
            <Text style={styles.questionText}>"Comment as-tu su quel disque bouger en premier ?"</Text>
          </View>
          <View style={styles.questionItem}>
            <Text style={styles.questionBullet}>💬</Text>
            <Text style={styles.questionText}>"Qu'est-ce qui était le plus difficile ?"</Text>
          </View>
          <View style={styles.questionItem}>
            <Text style={styles.questionBullet}>💬</Text>
            <Text style={styles.questionText}>"Si tu recommençais, ferais-tu pareil ?"</Text>
          </View>
        </View>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>À éviter</Text>
          <Text style={styles.warningText}>
            Ne donnez pas la solution ! Cela prive l'enfant de la satisfaction de trouver seul.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderQuotidienContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionIntro}>
        Appliquez les compétences développées dans la vie quotidienne pour renforcer les apprentissages.
      </Text>

      <View style={styles.transferGrid}>
        <View style={styles.transferCard}>
          <Text style={styles.transferEmoji}>🎒</Text>
          <Text style={styles.transferTitle}>Ranger le cartable</Text>
          <Text style={styles.transferDesc}>Planifier et organiser les affaires par ordre d'importance</Text>
        </View>

        <View style={styles.transferCard}>
          <Text style={styles.transferEmoji}>🧹</Text>
          <Text style={styles.transferTitle}>Organiser sa chambre</Text>
          <Text style={styles.transferDesc}>Même logique de "petit sur grand" pour empiler</Text>
        </View>

        <View style={styles.transferCard}>
          <Text style={styles.transferEmoji}>📚</Text>
          <Text style={styles.transferTitle}>Planifier ses devoirs</Text>
          <Text style={styles.transferDesc}>Séquencer les étapes comme dans le jeu</Text>
        </View>

        <View style={styles.transferCard}>
          <Text style={styles.transferEmoji}>🧱</Text>
          <Text style={styles.transferTitle}>Construire avec Lego</Text>
          <Text style={styles.transferDesc}>Anticiper plusieurs coups à l'avance</Text>
        </View>
      </View>

      <View style={styles.phraseBox}>
        <Text style={styles.phraseTitle}>Phrases de transfert</Text>
        <View style={styles.phraseItem}>
          <Text style={styles.phraseQuote}>
            "Tu te souviens de la Tour de Hanoï ? C'est pareil ici : il faut réfléchir à l'ordre des étapes."
          </Text>
        </View>
        <View style={styles.phraseItem}>
          <Text style={styles.phraseQuote}>
            "Comme dans le jeu, si tu es bloqué, essaie de voir quel est le 'gros disque' à bouger."
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProgressionContent = () => (
    <View style={styles.contentSection}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{totalGames}</Text>
          <Text style={styles.statLabel}>Parties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{successfulGames}</Text>
          <Text style={styles.statLabel}>Réussites</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.secondary }]}>{successRate}%</Text>
          <Text style={styles.statLabel}>Taux</Text>
        </View>
      </View>

      {/* Level Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Niveau actuel</Text>
          <Text style={styles.progressValue}>{currentLevel} disques</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(100, (currentLevel / 7) * 100)}%` }]} />
        </View>
        <Text style={styles.progressHint}>
          Prochain objectif : Réussir 3 fois en moins de {Math.pow(2, currentLevel + 1) - 1} coups pour débloquer {currentLevel + 1} disques.
        </Text>
      </View>

      {/* Game Modes */}
      <Text style={styles.modesTitle}>Modes de jeu</Text>
      <View style={styles.modesGrid}>
        <Pressable
          style={[styles.modeCard, currentMode === 'discovery' && styles.modeCardActive]}
          onPress={() => onModeChange?.('discovery')}
        >
          <Text style={styles.modeEmoji}>☀️</Text>
          <Text style={styles.modeTitle}>Découverte</Text>
          <Text style={styles.modeDesc}>Indices illimités</Text>
          {currentMode === 'discovery' && <Text style={styles.modeCheck}>✓</Text>}
        </Pressable>

        <Pressable
          style={[styles.modeCard, currentMode === 'challenge' && styles.modeCardActive]}
          onPress={() => onModeChange?.('challenge')}
        >
          <Text style={styles.modeEmoji}>⭐</Text>
          <Text style={styles.modeTitle}>Défi</Text>
          <Text style={styles.modeDesc}>3 indices max</Text>
          {currentMode === 'challenge' && <Text style={styles.modeCheck}>✓</Text>}
        </Pressable>

        <Pressable
          style={[styles.modeCard, currentMode === 'expert' && styles.modeCardActive]}
          onPress={() => onModeChange?.('expert')}
        >
          <Text style={styles.modeEmoji}>🏆</Text>
          <Text style={styles.modeTitle}>Expert</Text>
          <Text style={styles.modeDesc}>Aucun indice</Text>
          {currentMode === 'expert' && <Text style={styles.modeCheck}>✓</Text>}
        </Pressable>
      </View>

      {/* Hint Button */}
      {currentMode !== 'expert' && (
        <Pressable
          style={[styles.hintButton, hintsRemaining <= 0 && styles.hintButtonDisabled]}
          onPress={onHintPress}
          disabled={hintsRemaining <= 0}
        >
          <Text style={styles.hintButtonText}>💡 Utiliser un indice ({hintsRemaining}/{maxHints})</Text>
        </Pressable>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'objectif':
        return renderObjectifContent();
      case 'competences':
        return renderCompetencesContent();
      case 'questions':
        return renderQuestionsContent();
      case 'quotidien':
        return renderQuotidienContent();
      case 'progression':
        return renderProgressionContent();
      default:
        return renderObjectifContent();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop - click to close */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              height: DRAWER_HEIGHT,
            },
          ]}
        >
          {/* Drag Handle */}
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Text style={styles.headerIcon}>👨‍👩‍👧</Text>
              <Text style={styles.headerText}>Guide Parent</Text>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>Tour de Hanoï</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsContent}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => {
                  setActiveTab(tab.id);
                  triggerHaptic('light');
                }}
              >
                <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Content */}
          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {renderTabContent()}
            <View style={{ height: 40 + insets.bottom }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...shadows.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },

  // Handle
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.textMuted,
  },

  // Tabs
  tabsContainer: {
    maxHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },

  // Content
  contentScroll: {
    flex: 1,
  },

  // Grid layout
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  gridCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  gridCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlue: {
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
  },
  iconOrange: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
  },
  iconGreen: {
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
  },
  gridCardIconText: {
    fontSize: 22,
  },
  gridCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  gridCardText: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Rules list
  rulesList: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ruleCheck: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '700',
  },
  ruleText: {
    fontSize: 13,
    color: COLORS.textDark,
  },

  // Info box
  infoBox: {
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  infoBoxLabel: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBoxValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginTop: 4,
  },

  // Tip box
  tipBox: {
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  tipBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.textDark,
  },

  // Content section
  contentSection: {
    padding: 20,
  },
  sectionIntro: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 22,
    marginBottom: 20,
  },

  // Skills
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  skillCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  skillIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  skillIconText: {
    fontSize: 24,
  },
  skillTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  skillDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
  skillStars: {
    flexDirection: 'row',
  },
  starFilled: {
    fontSize: 12,
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  starEmpty: {
    fontSize: 12,
    color: '#D1D5DB',
    letterSpacing: 1,
  },

  // Science box
  scienceBox: {
    backgroundColor: 'rgba(91, 141, 238, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 141, 238, 0.2)',
  },
  scienceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  scienceText: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
  },

  // Questions
  questionCategory: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 16,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  questionsList: {
    gap: 10,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
  },
  questionBullet: {
    fontSize: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },

  // Warning box
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.attention,
  },
  warningIcon: {
    fontSize: 20,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.attention,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
  },

  // Transfer
  transferGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  transferCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(123, 199, 77, 0.3)',
  },
  transferEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  transferTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  transferDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Phrase box
  phraseBox: {
    backgroundColor: 'rgba(123, 199, 77, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(123, 199, 77, 0.2)',
  },
  phraseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 12,
  },
  phraseItem: {
    marginBottom: 12,
  },
  phraseQuote: {
    fontSize: 13,
    color: COLORS.textMedium,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Progress
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  // Modes
  modesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  modesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  modeCardActive: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(123, 199, 77, 0.08)',
  },
  modeEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  modeDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  modeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '700',
  },

  // Hint button
  hintButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  hintButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
