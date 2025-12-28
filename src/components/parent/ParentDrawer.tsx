/**
 * ParentDrawer component - V2
 * Generic bottom drawer with 6 tabs for parent educational guide
 * Reusable across all activities - content passed via props
 *
 * Tabs: Objectif & Règles, Compétences, Accompagnement, Questions, Vie quotidienne, Progression
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
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.9;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type TabType = 'objectif' | 'competences' | 'accompagnement' | 'questions' | 'quotidien' | 'progression';

export type GameMode = 'discovery' | 'challenge' | 'expert';

/** Game objective and rules data */
export interface GameObjectiveData {
  objective: string;
  optimalSolution: string;
  rules: string[];
  strategy: string;
  tip: string;
}

/** What the app does / doesn't do */
export interface AppBehaviorData {
  does: string[];
  doesnt: string[];
}

/** Competence item */
export interface CompetenceData {
  id: string;
  icon: string;
  title: string;
  description: string;
  stars: number; // 1-5
  iconBgColor: string;
}

/** Scientific basis info */
export interface ScienceData {
  text: string;
}

/** Advice row for accompaniment tab */
export interface AdviceData {
  situation: string;
  response: string;
}

/** Question item */
export interface QuestionData {
  text: string;
}

/** Daily life transfer activity */
export interface DailyActivityData {
  icon: string;
  title: string;
  description: string;
}

/** Resource recommendation */
export interface ResourceData {
  type: string;
  icon: string;
  title: string;
  author: string;
}

/** Badge for play style */
export interface BadgeData {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: boolean;
}

/** Age expectation */
export interface AgeExpectationData {
  age: number;
  expectation: string;
  isCurrent?: boolean;
}

/** Settings item */
export interface SettingData {
  id: string;
  label: string;
  enabled: boolean;
}

/** Stats for progression */
export interface StatsData {
  totalGames: number;
  successfulGames: number;
  totalTime: string;
}

/** Progress data */
export interface ProgressData {
  currentLevel: number;
  maxLevel: number;
  progressPercent: number;
  nextObjective: string;
}

/** Complete props interface */
export interface ParentDrawerProps {
  isVisible: boolean;
  onClose?: () => void;

  // Activity identity
  activityName?: string;
  activityEmoji?: string;

  // Tab 1: Objectif & Règles
  gameData?: GameObjectiveData;
  appBehavior?: AppBehaviorData;

  // Tab 2: Compétences
  competences?: CompetenceData[];
  scienceData?: ScienceData;

  // Tab 3: Accompagnement
  advices?: AdviceData[];
  warningText?: string;
  teamMessage?: string;

  // Tab 4: Questions
  questionsDuring?: QuestionData[];
  questionsAfter?: QuestionData[];
  questionsWarning?: string;

  // Tab 5: Vie quotidienne
  dailyActivities?: DailyActivityData[];
  transferPhrases?: string[];
  resources?: ResourceData[];

  // Tab 6: Progression
  stats?: StatsData;
  progress?: ProgressData;
  badges?: BadgeData[];
  currentMode?: GameMode;
  onModeChange?: (mode: GameMode) => void;
  childAge?: number;
  ageExpectations?: AgeExpectationData[];
  settings?: SettingData[];
  onSettingChange?: (id: string, value: boolean) => void;
  hintsRemaining?: number;
  maxHints?: number;
  onHintPress?: () => void;

  // Legacy props (for backward compatibility)
  currentMoves?: number;
  optimalMoves?: number;
  currentLevel?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TABS: { id: TabType; label: string; emoji: string }[] = [
  { id: 'objectif', label: 'Objectif & Règles', emoji: '🎯' },
  { id: 'competences', label: 'Compétences', emoji: '🧠' },
  { id: 'accompagnement', label: 'Accompagnement', emoji: '🤝' },
  { id: 'questions', label: 'Questions à poser', emoji: '💬' },
  { id: 'quotidien', label: 'Vie quotidienne', emoji: '🏠' },
  { id: 'progression', label: 'Progression', emoji: '📈' },
];

// ============================================================================
// HELPERS
// ============================================================================

const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
  if (Platform.OS === 'web') return;
  const style = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  }[type];
  Haptics.impactAsync(style);
};

// ============================================================================
// COMPONENT
// ============================================================================

// Default values for optional props
const defaultGameData: GameObjectiveData = {
  objective: '',
  optimalSolution: '',
  rules: [],
  strategy: '',
  tip: '',
};

const defaultAppBehavior: AppBehaviorData = {
  does: [],
  doesnt: [],
};

const defaultScienceData: ScienceData = {
  text: '',
};

const defaultStats: StatsData = {
  totalGames: 0,
  successfulGames: 0,
  totalTime: '0min',
};

const defaultProgress: ProgressData = {
  currentLevel: 3,
  maxLevel: 8,
  progressPercent: 0,
  nextObjective: '',
};

export function ParentDrawer({
  isVisible,
  onClose,
  activityName = 'Activité',
  activityEmoji = '🎮',
  gameData = defaultGameData,
  appBehavior = defaultAppBehavior,
  competences = [],
  scienceData = defaultScienceData,
  advices = [],
  warningText = '',
  teamMessage = '',
  questionsDuring = [],
  questionsAfter = [],
  questionsWarning,
  dailyActivities = [],
  transferPhrases = [],
  resources = [],
  stats = defaultStats,
  progress = defaultProgress,
  badges = [],
  currentMode = 'discovery',
  onModeChange,
  childAge = 7,
  ageExpectations = [],
  settings = [],
  onSettingChange,
  hintsRemaining = 3,
  maxHints = 3,
  onHintPress,
  // Legacy props
  currentMoves,
  optimalMoves,
  currentLevel,
}: ParentDrawerProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('objectif');
  const [localSettings, setLocalSettings] = useState<Record<string, boolean>>({});

  // Initialize local settings from props
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    settings.forEach(s => { initial[s.id] = s.enabled; });
    setLocalSettings(initial);
  }, [settings]);

  // Animation values
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Calculate success rate
  const successRate = stats.totalGames > 0
    ? Math.round((stats.successfulGames / stats.totalGames) * 100)
    : 0;

  // Open/close animation
  useEffect(() => {
    if (isVisible) {
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
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          triggerHaptic('light');
          onClose?.();
        } else {
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

  // Toggle setting handler
  const handleToggleSetting = (id: string) => {
    const newValue = !localSettings[id];
    setLocalSettings(prev => ({ ...prev, [id]: newValue }));
    onSettingChange?.(id, newValue);
    triggerHaptic('light');
  };

  // ==========================================================================
  // TAB CONTENT RENDERERS
  // ==========================================================================

  const renderObjectifContent = () => (
    <View style={styles.tabContentInner}>
      {/* Cards Grid */}
      <View style={styles.cardsGrid}>
        {/* Objectif Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={[styles.infoCardIcon, styles.iconBlue]}>
              <Text style={styles.infoCardIconText}>🎯</Text>
            </View>
            <Text style={styles.infoCardTitle}>Objectif du jeu</Text>
          </View>
          <Text style={styles.infoCardText}>{gameData.objective}</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>SOLUTION OPTIMALE</Text>
            <Text style={styles.highlightValue}>{gameData.optimalSolution}</Text>
          </View>
        </View>

        {/* Règles Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={[styles.infoCardIcon, styles.iconOrange]}>
              <Text style={styles.infoCardIconText}>📜</Text>
            </View>
            <Text style={styles.infoCardTitle}>Les 3 règles d'or</Text>
          </View>
          <View style={styles.rulesList}>
            {gameData.rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleCheck}>✓</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stratégie Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={[styles.infoCardIcon, styles.iconGreen]}>
              <Text style={styles.infoCardIconText}>💡</Text>
            </View>
            <Text style={styles.infoCardTitle}>La stratégie</Text>
          </View>
          <Text style={styles.infoCardText}>{gameData.strategy}</Text>
          <View style={[styles.highlightBox, styles.highlightBoxOrange]}>
            <Text style={[styles.highlightLabel, styles.highlightLabelOrange]}>ASTUCE</Text>
            <Text style={styles.highlightValueOrange}>{gameData.tip}</Text>
          </View>
        </View>
      </View>

      {/* App Behavior Section */}
      <View style={styles.appBehaviorSection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitleEmoji}>📱</Text>
          <Text style={styles.sectionTitle}>Ce que l'application fait</Text>
        </View>
        <View style={styles.behaviorGrid}>
          {/* Does Card */}
          <View style={[styles.behaviorCard, styles.behaviorCardDoes]}>
            <View style={styles.behaviorHeader}>
              <Text style={styles.behaviorHeaderIcon}>✓</Text>
              <Text style={styles.behaviorHeaderTextDoes}>L'app fait</Text>
            </View>
            <View style={styles.behaviorList}>
              {appBehavior.does.map((item, index) => (
                <View key={index} style={styles.behaviorItem}>
                  <Text style={styles.behaviorBullet}>•</Text>
                  <Text style={styles.behaviorItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Doesn't Card */}
          <View style={[styles.behaviorCard, styles.behaviorCardDoesnt]}>
            <View style={styles.behaviorHeader}>
              <Text style={styles.behaviorHeaderIcon}>✗</Text>
              <Text style={styles.behaviorHeaderTextDoesnt}>L'app ne fait pas</Text>
            </View>
            <View style={styles.behaviorList}>
              {appBehavior.doesnt.map((item, index) => (
                <View key={index} style={styles.behaviorItem}>
                  <Text style={styles.behaviorBullet}>•</Text>
                  <Text style={styles.behaviorItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCompetencesContent = () => (
    <View style={styles.tabContentInner}>
      <Text style={styles.introText}>
        {activityName} développe des compétences essentielles pour la réussite scolaire et la vie quotidienne.
      </Text>

      <View style={styles.competencesGrid}>
        {competences.map((comp) => (
          <View key={comp.id} style={styles.competenceCard}>
            <View style={[styles.competenceIcon, { backgroundColor: comp.iconBgColor }]}>
              <Text style={styles.competenceIconText}>{comp.icon}</Text>
            </View>
            <Text style={styles.competenceTitle}>{comp.title}</Text>
            <Text style={styles.competenceDesc}>{comp.description}</Text>
            <View style={styles.competenceStars}>
              <Text style={styles.starFilled}>{'★'.repeat(comp.stars)}</Text>
              <Text style={styles.starEmpty}>{'☆'.repeat(5 - comp.stars)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.scienceBox}>
        <View style={styles.scienceBoxHeader}>
          <Text style={styles.scienceBoxEmoji}>🔬</Text>
          <Text style={styles.scienceBoxTitle}>Base scientifique</Text>
        </View>
        <Text style={styles.scienceBoxText}>{scienceData.text}</Text>
      </View>
    </View>
  );

  const renderAccompagnementContent = () => (
    <View style={styles.tabContentInner}>
      <Text style={styles.introText}>
        Ces conseils vous aident à accompagner votre enfant sans interférer avec son apprentissage autonome.
      </Text>

      {/* Advice Table */}
      <View style={styles.adviceTable}>
        <View style={styles.adviceTableHeader}>
          <View style={[styles.adviceTableCell, styles.adviceTableCellSituation]}>
            <Text style={styles.adviceTableHeaderText}>Situation</Text>
          </View>
          <View style={styles.adviceTableCell}>
            <Text style={styles.adviceTableHeaderText}>Votre réaction recommandée</Text>
          </View>
        </View>
        {advices.map((advice, index) => (
          <View key={index} style={styles.adviceTableRow}>
            <View style={[styles.adviceTableCell, styles.adviceTableCellSituation]}>
              <Text style={styles.adviceSituation}>{advice.situation}</Text>
            </View>
            <View style={styles.adviceTableCell}>
              <Text style={styles.adviceResponse}>{advice.response}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Warning Box */}
      <View style={styles.warningBox}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>À éviter absolument</Text>
          <Text style={styles.warningText}>{warningText}</Text>
        </View>
      </View>

      {/* Team Message */}
      <View style={styles.teamMessageBox}>
        <View style={styles.teamMessageHeader}>
          <Text style={styles.teamMessageEmoji}>💌</Text>
          <Text style={styles.teamMessageTitle}>Message de l'équipe pédagogique</Text>
        </View>
        <Text style={styles.teamMessageText}>{teamMessage}</Text>
      </View>
    </View>
  );

  const renderQuestionsContent = () => (
    <View style={styles.tabContentInner}>
      <Text style={styles.introText}>
        Ces questions aident votre enfant à verbaliser sa réflexion (métacognition). Guidez sans donner la réponse !
      </Text>

      {/* During Game */}
      <View style={styles.questionsSection}>
        <View style={styles.questionsSectionHeader}>
          <View style={[styles.questionsSectionIcon, styles.questionsSectionIconDuring]}>
            <Text style={styles.questionsSectionIconText}>🎮</Text>
          </View>
          <Text style={styles.questionsSectionTitle}>Pendant le jeu</Text>
        </View>
        <View style={styles.questionsList}>
          {questionsDuring.map((q, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.questionBullet}>💬</Text>
              <Text style={styles.questionText}>{q.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* After Game */}
      <View style={styles.questionsSection}>
        <View style={styles.questionsSectionHeader}>
          <View style={[styles.questionsSectionIcon, styles.questionsSectionIconAfter]}>
            <Text style={styles.questionsSectionIconText}>✅</Text>
          </View>
          <Text style={styles.questionsSectionTitle}>Après l'activité</Text>
        </View>
        <View style={styles.questionsList}>
          {questionsAfter.map((q, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.questionBullet}>💬</Text>
              <Text style={styles.questionText}>{q.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Warning */}
      {questionsWarning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>À éviter</Text>
            <Text style={styles.warningText}>{questionsWarning}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderQuotidienContent = () => (
    <View style={styles.tabContentInner}>
      <Text style={styles.introText}>
        Appliquez les compétences développées dans la vie quotidienne pour renforcer les apprentissages.
      </Text>

      {/* Daily Activities Grid */}
      <View style={styles.dailyCardsGrid}>
        {dailyActivities.map((activity, index) => (
          <View key={index} style={styles.dailyCard}>
            <Text style={styles.dailyCardIcon}>{activity.icon}</Text>
            <Text style={styles.dailyCardTitle}>{activity.title}</Text>
            <Text style={styles.dailyCardDesc}>{activity.description}</Text>
          </View>
        ))}
      </View>

      {/* Transfer Phrases */}
      <View style={styles.transferPhrasesBox}>
        <Text style={styles.transferPhrasesTitle}>💡 Phrases de transfert</Text>
        {transferPhrases.map((phrase, index) => (
          <View key={index} style={styles.transferPhrase}>
            <Text style={styles.transferPhraseText}>{phrase}</Text>
          </View>
        ))}
      </View>

      {/* Resources */}
      <View style={styles.resourcesSection}>
        <Text style={styles.resourcesSectionTitle}>📚 Ressources recommandées</Text>
        <View style={styles.resourcesGrid}>
          {resources.map((resource, index) => (
            <View key={index} style={styles.resourceCard}>
              <Text style={styles.resourceIcon}>{resource.icon}</Text>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceType}>{resource.type}</Text>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceAuthor}>{resource.author}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderProgressionContent = () => (
    <View style={styles.tabContentInner}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.statValueBlue]}>{stats.totalGames}</Text>
          <Text style={styles.statLabel}>Parties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.statValueGreen]}>{stats.successfulGames}</Text>
          <Text style={styles.statLabel}>Réussites</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.statValueOrange]}>{successRate}%</Text>
          <Text style={styles.statLabel}>Taux</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.statValuePurple]}>{stats.totalTime}</Text>
          <Text style={styles.statLabel}>Temps total</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Niveau actuel</Text>
          <Text style={styles.progressLevel}>{progress.currentLevel} disques</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={[theme.colors.primary.main, theme.colors.secondary.light]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progress.progressPercent}%` }]}
          />
        </View>
        <Text style={styles.progressHint}>{progress.nextObjective}</Text>
      </View>

      {/* Badges Section */}
      <View style={styles.badgesSection}>
        <Text style={styles.badgesSectionTitle}>🏆 Style de jeu</Text>
        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View
              key={badge.id}
              style={[styles.badgeCard, badge.earned && styles.badgeCardEarned]}
            >
              <Text style={styles.badgeCardIcon}>{badge.icon}</Text>
              <Text style={styles.badgeCardTitle}>{badge.title}</Text>
              <Text style={styles.badgeCardDesc}>{badge.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Game Modes */}
      <View style={styles.modesSection}>
        <Text style={styles.modesSectionTitle}>🎮 Modes de jeu</Text>
        <View style={styles.modesGrid}>
          <Pressable
            style={[styles.modeCard, currentMode === 'discovery' && styles.modeCardActive]}
            onPress={() => { onModeChange?.('discovery'); triggerHaptic('light'); }}
          >
            {currentMode === 'discovery' && <Text style={styles.modeCardCheck}>✓</Text>}
            <Text style={styles.modeCardIcon}>☀️</Text>
            <Text style={styles.modeCardTitle}>Découverte</Text>
            <Text style={styles.modeCardDesc}>Indices illimités</Text>
          </Pressable>

          <Pressable
            style={[styles.modeCard, currentMode === 'challenge' && styles.modeCardActive]}
            onPress={() => { onModeChange?.('challenge'); triggerHaptic('light'); }}
          >
            {currentMode === 'challenge' && <Text style={styles.modeCardCheck}>✓</Text>}
            <Text style={styles.modeCardIcon}>⭐</Text>
            <Text style={styles.modeCardTitle}>Défi</Text>
            <Text style={styles.modeCardDesc}>3 indices max</Text>
          </Pressable>

          <Pressable
            style={[styles.modeCard, currentMode === 'expert' && styles.modeCardActive]}
            onPress={() => { onModeChange?.('expert'); triggerHaptic('light'); }}
          >
            {currentMode === 'expert' && <Text style={styles.modeCardCheck}>✓</Text>}
            <Text style={styles.modeCardIcon}>🏆</Text>
            <Text style={styles.modeCardTitle}>Expert</Text>
            <Text style={styles.modeCardDesc}>Aucun indice</Text>
          </Pressable>
        </View>
      </View>

      {/* Age Expectations */}
      <View style={styles.ageSection}>
        <Text style={styles.ageSectionTitle}>📊 Attentes par âge (indicatif)</Text>
        <View style={styles.ageGrid}>
          {ageExpectations.map((age) => (
            <View
              key={age.age}
              style={[styles.ageCard, age.age === childAge && styles.ageCardCurrent]}
            >
              <Text style={[styles.ageCardAge, age.age === childAge && styles.ageCardAgeCurrent]}>
                {age.age} ans
              </Text>
              <Text style={styles.ageCardExpect}>{age.expectation}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionTitle}>⚙️ Paramètres de l'activité</Text>
        <View style={styles.settingsGrid}>
          {settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <Text style={styles.settingLabel}>{setting.label}</Text>
              <Pressable
                style={[
                  styles.settingToggle,
                  localSettings[setting.id] && styles.settingToggleActive,
                ]}
                onPress={() => handleToggleSetting(setting.id)}
              >
                <View
                  style={[
                    styles.settingToggleThumb,
                    localSettings[setting.id] && styles.settingToggleThumbActive,
                  ]}
                />
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Hint Button */}
      {currentMode !== 'expert' && (
        <Pressable
          style={[styles.hintButton, hintsRemaining <= 0 && styles.hintButtonDisabled]}
          onPress={() => { onHintPress?.(); triggerHaptic('medium'); }}
          disabled={hintsRemaining <= 0}
        >
          <LinearGradient
            colors={[theme.colors.secondary.main, theme.colors.secondary.dark]}
            style={styles.hintButtonGradient}
          >
            <Text style={styles.hintButtonText}>
              💡 Utiliser un indice ({hintsRemaining}/{maxHints})
            </Text>
          </LinearGradient>
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
      case 'accompagnement':
        return renderAccompagnementContent();
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

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </TouchableWithoutFeedback>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateY }],
              height: DRAWER_HEIGHT,
            },
          ]}
        >
          {/* Handle */}
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerIcon}>👨‍👩‍👧</Text>
              <Text style={styles.headerTitle}>Guide Parent</Text>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{activityName}</Text>
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
            {TABS.map((tab) => (
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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // === MODAL & OVERLAY ===
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },

  // === HANDLE ===
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: theme.colors.ui.disabled,
    borderRadius: 3,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.disabled,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  headerBadge: {
    backgroundColor: theme.colors.secondary.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 12,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: theme.colors.text.muted,
  },

  // === TABS ===
  tabsContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.disabled,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    marginRight: 8,
    minHeight: 44,
  },
  tabActive: {
    backgroundColor: theme.colors.primary.main,
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },

  // === CONTENT ===
  contentScroll: {
    flex: 1,
    backgroundColor: theme.colors.parent.background,
  },
  tabContentInner: {
    padding: 24,
  },

  // === INTRO TEXT ===
  introText: {
    fontSize: 18,
    fontFamily: 'Nunito',
    color: theme.colors.text.secondary,
    lineHeight: 26,
    marginBottom: 20,
  },

  // === CARDS GRID (Objectif) ===
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.ui.disabled,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoCardIcon: {
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
  infoCardIconText: {
    fontSize: 22,
  },
  infoCardTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  infoCardText: {
    fontSize: 16,
    fontFamily: 'Nunito',
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: 12,
  },

  // === HIGHLIGHT BOX ===
  highlightBox: {
    backgroundColor: 'rgba(91, 141, 238, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary.main,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  highlightBoxOrange: {
    backgroundColor: 'rgba(243, 156, 18, 0.08)',
    borderLeftColor: theme.colors.feedback.warning,
  },
  highlightLabel: {
    fontSize: 11,
    fontFamily: 'Nunito',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: theme.colors.primary.main,
    marginBottom: 4,
  },
  highlightLabelOrange: {
    color: theme.colors.feedback.warning,
  },
  highlightValue: {
    fontSize: 16,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: theme.colors.primary.dark,
  },
  highlightValueOrange: {
    fontSize: 16,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: theme.colors.secondary.dark,
  },

  // === RULES LIST ===
  rulesList: {
    gap: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ruleCheck: {
    fontSize: 16,
    color: theme.colors.feedback.success,
    fontWeight: '700',
    marginTop: 2,
  },
  ruleText: {
    fontSize: 16,
    fontFamily: 'Nunito',
    color: theme.colors.text.primary,
    flex: 1,
  },

  // === APP BEHAVIOR SECTION ===
  appBehaviorSection: {
    marginTop: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitleEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  behaviorGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  behaviorCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  behaviorCardDoes: {
    backgroundColor: 'rgba(123, 199, 77, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(123, 199, 77, 0.3)',
  },
  behaviorCardDoesnt: {
    backgroundColor: 'rgba(229, 62, 62, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229, 62, 62, 0.2)',
  },
  behaviorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  behaviorHeaderIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  behaviorHeaderTextDoes: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: '#3AA069',
  },
  behaviorHeaderTextDoesnt: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.feedback.error,
  },
  behaviorList: {
    gap: 8,
  },
  behaviorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  behaviorBullet: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  behaviorItemText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: theme.colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },

  // === COMPETENCES GRID ===
  competencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  competenceCard: {
    width: '31%',
    minWidth: 160,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.disabled,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  competenceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  competenceIconText: {
    fontSize: 28,
  },
  competenceTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  competenceDesc: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  competenceStars: {
    flexDirection: 'row',
  },
  starFilled: {
    fontSize: 14,
    color: theme.colors.secondary.main,
    letterSpacing: 2,
  },
  starEmpty: {
    fontSize: 14,
    color: theme.colors.ui.disabled,
    letterSpacing: 2,
  },

  // === SCIENCE BOX ===
  scienceBox: {
    backgroundColor: 'rgba(91, 141, 238, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 141, 238, 0.2)',
  },
  scienceBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scienceBoxEmoji: {
    fontSize: 16,
  },
  scienceBoxTitle: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  scienceBoxText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },

  // === ADVICE TABLE (Accompagnement) ===
  adviceTable: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.ui.disabled,
  },
  adviceTableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.ui.disabled,
  },
  adviceTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.disabled,
  },
  adviceTableCell: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  adviceTableCellSituation: {
    flex: 0.4,
    borderRightWidth: 1,
    borderRightColor: theme.colors.ui.disabled,
  },
  adviceTableHeaderText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  adviceSituation: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  adviceResponse: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontStyle: 'italic',
    color: theme.colors.primary.dark,
  },

  // === WARNING BOX ===
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.feedback.warning,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  warningIcon: {
    fontSize: 20,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.secondary.dark,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },

  // === TEAM MESSAGE BOX ===
  teamMessageBox: {
    backgroundColor: 'rgba(91, 141, 238, 0.06)',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
  },
  teamMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  teamMessageEmoji: {
    fontSize: 16,
  },
  teamMessageTitle: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  teamMessageText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontStyle: 'italic',
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },

  // === QUESTIONS SECTION ===
  questionsSection: {
    marginBottom: 24,
  },
  questionsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  questionsSectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionsSectionIconDuring: {
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
  },
  questionsSectionIconAfter: {
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
  },
  questionsSectionIconText: {
    fontSize: 18,
  },
  questionsSectionTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  questionsList: {
    gap: 10,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  questionBullet: {
    fontSize: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito',
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },

  // === DAILY CARDS GRID ===
  dailyCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  dailyCard: {
    width: '23%',
    minWidth: 140,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.disabled,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  dailyCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  dailyCardTitle: {
    fontSize: 14,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  dailyCardDesc: {
    fontSize: 12,
    fontFamily: 'Nunito',
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 16,
  },

  // === TRANSFER PHRASES BOX ===
  transferPhrasesBox: {
    backgroundColor: 'rgba(91, 141, 238, 0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  transferPhrasesTitle: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: 12,
  },
  transferPhrase: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary.light,
    paddingLeft: 16,
    marginBottom: 10,
  },
  transferPhraseText: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontStyle: 'italic',
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },

  // === RESOURCES SECTION ===
  resourcesSection: {
    marginTop: 8,
  },
  resourcesSectionTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  resourcesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  resourceIcon: {
    fontSize: 24,
  },
  resourceContent: {
    flex: 1,
  },
  resourceType: {
    fontSize: 10,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resourceTitle: {
    fontSize: 14,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  resourceAuthor: {
    fontSize: 12,
    fontFamily: 'Nunito',
    color: theme.colors.text.muted,
  },

  // === STATS GRID ===
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Fredoka',
    fontWeight: '800',
    marginBottom: 4,
  },
  statValueBlue: {
    color: theme.colors.primary.main,
  },
  statValueGreen: {
    color: theme.colors.feedback.success,
  },
  statValueOrange: {
    color: theme.colors.secondary.dark,
  },
  statValuePurple: {
    color: theme.colors.secondary.light,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // === PROGRESS SECTION ===
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
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  progressLevel: {
    fontSize: 16,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: theme.colors.ui.disabled,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressHint: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: theme.colors.text.muted,
    lineHeight: 18,
  },

  // === BADGES SECTION ===
  badgesSection: {
    marginBottom: 24,
  },
  badgesSectionTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.disabled,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    opacity: 0.5,
  },
  badgeCardEarned: {
    opacity: 1,
    borderColor: theme.colors.secondary.main,
    backgroundColor: 'rgba(255, 179, 71, 0.08)',
  },
  badgeCardIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  badgeCardTitle: {
    fontSize: 14,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeCardDesc: {
    fontSize: 12,
    fontFamily: 'Nunito',
    color: theme.colors.text.muted,
    textAlign: 'center',
  },

  // === MODES SECTION ===
  modesSection: {
    marginBottom: 24,
  },
  modesSectionTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  modesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    minHeight: 100,
  },
  modeCardActive: {
    borderColor: theme.colors.feedback.success,
    backgroundColor: 'rgba(123, 199, 77, 0.1)',
  },
  modeCardCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 14,
    color: theme.colors.feedback.success,
    fontWeight: '700',
  },
  modeCardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  modeCardTitle: {
    fontSize: 14,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  modeCardDesc: {
    fontSize: 12,
    fontFamily: 'Nunito',
    color: theme.colors.text.muted,
  },

  // === AGE SECTION ===
  ageSection: {
    marginBottom: 24,
  },
  ageSectionTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  ageGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  ageCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  ageCardCurrent: {
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  ageCardAge: {
    fontSize: 18,
    fontFamily: 'Fredoka',
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  ageCardAgeCurrent: {
    color: theme.colors.primary.main,
  },
  ageCardExpect: {
    fontSize: 10,
    fontFamily: 'Nunito',
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 13,
  },

  // === SETTINGS SECTION ===
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.disabled,
    paddingTop: 20,
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  settingItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  settingLabel: {
    fontSize: 13,
    fontFamily: 'Nunito',
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  settingToggle: {
    width: 48,
    height: 28,
    backgroundColor: theme.colors.ui.disabled,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 3,
  },
  settingToggleActive: {
    backgroundColor: theme.colors.feedback.success,
  },
  settingToggleThumb: {
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingToggleThumbActive: {
    transform: [{ translateX: 20 }],
  },

  // === HINT BUTTON ===
  hintButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.secondary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  hintButtonDisabled: {
    opacity: 0.5,
  },
  hintButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
