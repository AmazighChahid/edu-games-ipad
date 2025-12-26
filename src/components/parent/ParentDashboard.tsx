/**
 * ParentDashboard - Full-screen parent dashboard modal
 * Design based on parent-dashboard-redesign.html mockup
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Navigation tab types
type NavTab = 'overview' | 'activities' | 'skills' | 'history' | 'goals' | 'screentime' | 'resources';

// Colors matching the design
const COLORS = {
  primary: '#5B8DEE',
  primaryDark: '#4A7BD9',
  primaryLight: '#8BB0F4',
  secondary: '#FFB347',
  secondaryDark: '#FFA020',
  success: '#7BC74D',
  successDark: '#5FB030',
  accent: '#E056FD',
  accentDark: '#C840E0',
  attention: '#F39C12',
  background: '#FFF9F0',
  backgroundWarm: '#FFF5E6',
  surface: '#FFFFFF',
  textDark: '#2D3748',
  textMedium: '#4A5568',
  textMuted: '#718096',
  border: '#E2E8F0',
  error: '#E53E3E',
};

interface ParentDashboardProps {
  isVisible: boolean;
  onClose: () => void;
  childName?: string;
  // Stats data
  levelsCompleted?: number;
  playTime?: string;
  gamesExplored?: number;
  successRate?: number;
  // Game progress data
  gameProgress?: {
    [gameId: string]: {
      level: number;
      maxLevel: number;
      gamesPlayed: number;
      totalTime: number;
      isFavorite?: boolean;
    };
  };
}

// Haptic feedback helper
const triggerHaptic = (type: 'light' | 'medium' | 'selection') => {
  if (Platform.OS === 'web') return;
  if (type === 'selection') {
    Haptics.selectionAsync();
  } else {
    const style = type === 'light'
      ? Haptics.ImpactFeedbackStyle.Light
      : Haptics.ImpactFeedbackStyle.Medium;
    Haptics.impactAsync(style);
  }
};

export function ParentDashboard({
  isVisible,
  onClose,
  childName = 'Emma',
  levelsCompleted = 12,
  playTime = '2h 15',
  gamesExplored = 4,
  successRate = 78,
  gameProgress = {},
}: ParentDashboardProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isVisible]);

  // Navigation tabs data
  const navTabs: { id: NavTab; label: string; icon: string }[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: '📊' },
    { id: 'activities', label: 'Par activité', icon: '🎮' },
    { id: 'skills', label: 'Compétences', icon: '🧠' },
    { id: 'history', label: 'Historique', icon: '📅' },
    { id: 'goals', label: 'Objectifs', icon: '🎯' },
    { id: 'screentime', label: "Temps d'écran", icon: '⏰' },
    { id: 'resources', label: 'Ressources', icon: '📚' },
  ];

  // Weekly activity data (mock)
  const weeklyData = [
    { day: 'Lun', value: 60 },
    { day: 'Mar', value: 90 },
    { day: 'Mer', value: 45 },
    { day: 'Jeu', value: 120 },
    { day: 'Ven', value: 75 },
    { day: 'Sam', value: 100 },
    { day: 'Dim', value: 30 },
  ];
  const maxValue = Math.max(...weeklyData.map(d => d.value));

  // Skills data (mock)
  const skills = [
    { name: 'Logique', icon: '🎯', level: 3, maxLevel: 5, progress: 60, color: 'blue' },
    { name: 'Résolution', icon: '🧩', level: 2, maxLevel: 5, progress: 40, color: 'green' },
    { name: 'Concentration', icon: '🪞', level: 4, maxLevel: 5, progress: 80, color: 'orange' },
    { name: 'Persévérance', icon: '🌱', level: 3, maxLevel: 5, progress: 55, color: 'purple' },
  ];

  // Games data (mock)
  const games = [
    { id: 'hanoi', name: 'Tour de Hanoï', category: 'Logique séquentielle', icon: '🗼', level: 6, maxLevel: 10, progress: 60, gamesPlayed: 18, totalTime: '45 min', isFavorite: true, color: '#FFB347' },
    { id: 'sudoku', name: 'Sudoku Montessori', category: 'Logique numérique', icon: '🔢', level: 2, maxLevel: 10, progress: 20, gamesPlayed: 5, totalTime: '15 min', isFavorite: false, color: '#5B8DEE' },
    { id: 'sequences', name: 'Suites Logiques', category: 'Reconnaissance patterns', icon: '🧩', level: 4, maxLevel: 10, progress: 40, gamesPlayed: 12, totalTime: '30 min', isFavorite: false, color: '#7BC74D' },
  ];

  // Recent activity (mock)
  const recentActivities = [
    { id: 1, game: 'Tour de Hanoï', icon: '🗼', action: 'Niveau 3 complété !', time: "Aujourd'hui, 10:23", details: 'A résolu le puzzle en 9 coups (optimal: 7). Excellent travail de planification !', success: true, duration: '3 min 45s' },
    { id: 2, game: 'Suites Logiques', icon: '🧩', action: 'Niveau 4 tenté', time: 'Hier, 17:45', details: '2 essais sur ce niveau. Continue de progresser dans la reconnaissance de patterns.', success: false, duration: '8 min' },
    { id: 3, game: 'Sudoku Montessori', icon: '🔢', action: 'Badge débloqué !', time: 'Hier, 16:30', details: 'A obtenu le badge "Premier Sudoku" 🏅 après avoir complété la grille 4x4.', success: true, badge: true },
  ];

  // Badges (mock)
  const badges = [
    { id: 1, name: 'Premier pas', icon: '🚀', date: '15 déc. 2025', unlocked: true },
    { id: 2, name: 'Maître des Tours', icon: '🗼', date: '20 déc. 2025', unlocked: true },
    { id: 3, name: "5 jours d'affilée", icon: '🔥', date: '22 déc. 2025', unlocked: true },
    { id: 4, name: 'Logicien en herbe', icon: '🧠', date: '24 déc. 2025', unlocked: true },
    { id: 5, name: 'Champion', icon: '🏆', date: 'À débloquer', unlocked: false },
    { id: 6, name: 'Perfectionniste', icon: '⭐', date: 'À débloquer', unlocked: false },
  ];

  // Goals (mock)
  const goals = [
    { id: 1, title: '5 niveaux cette semaine', desc: 'Plus que 2 niveaux à compléter !', progress: 70, status: 'in_progress' },
    { id: 2, title: 'Essayer un nouveau jeu', desc: 'A découvert les Suites Logiques !', progress: 100, status: 'completed' },
    { id: 3, title: "Jouer 5 jours d'affilée", desc: 'Série actuelle : 2 jours', progress: 40, status: 'in_progress' },
    { id: 4, title: 'Maîtriser Tour Hanoï 4 disques', desc: '1 réussite sur 5 nécessaires', progress: 20, status: 'in_progress' },
  ];

  // Render stat card
  const renderStatCard = (value: string | number, label: string, trend: string, trendType: 'up' | 'down' | 'neutral', color: string) => (
    <View style={[styles.statCard, { borderTopColor: COLORS[color as keyof typeof COLORS] || COLORS.primary }]}>
      <Text style={[styles.statValue, { color: COLORS[color as keyof typeof COLORS] || COLORS.primary }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={[styles.statTrend, trendType === 'up' ? styles.trendUp : trendType === 'down' ? styles.trendDown : styles.trendNeutral]}>
        <Text style={styles.statTrendText}>{trend}</Text>
      </View>
    </View>
  );

  // Render skill card
  const renderSkillCard = (skill: typeof skills[0]) => {
    const colorMap: Record<string, string> = {
      blue: COLORS.primary,
      green: COLORS.success,
      orange: COLORS.secondary,
      purple: COLORS.accent,
    };
    const fillColor = colorMap[skill.color] || COLORS.primary;

    return (
      <View key={skill.name} style={styles.skillCard}>
        <Text style={styles.skillIcon}>{skill.icon}</Text>
        <Text style={styles.skillName}>{skill.name}</Text>
        <View style={styles.skillStars}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={i < skill.level ? styles.starFilled : styles.starEmpty}>★</Text>
          ))}
        </View>
        <View style={styles.skillProgressBar}>
          <View style={[styles.skillProgressFill, { width: `${skill.progress}%`, backgroundColor: fillColor }]} />
        </View>
        <Text style={styles.skillProgressText}>Niveau {skill.level}/{skill.maxLevel}</Text>
      </View>
    );
  };

  // Render game card
  const renderGameCard = (game: typeof games[0]) => (
    <Pressable key={game.id} style={styles.gameCard}>
      {game.isFavorite && <View style={styles.gameBadge}><Text style={styles.gameBadgeText}>Favori</Text></View>}
      <View style={styles.gameCardHeader}>
        <View style={[styles.gameIcon, { backgroundColor: game.color }]}>
          <Text style={styles.gameIconText}>{game.icon}</Text>
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameName}>{game.name}</Text>
          <Text style={styles.gameCategory}>{game.category}</Text>
        </View>
      </View>
      <View style={styles.gameProgressContainer}>
        <View style={styles.gameProgressHeader}>
          <Text style={styles.gameProgressText}>Niveau {game.level}/{game.maxLevel}</Text>
          <Text style={styles.gameProgressText}>{game.progress}%</Text>
        </View>
        <View style={styles.gameProgressBar}>
          <View style={[styles.gameProgressFill, { width: `${game.progress}%` }]} />
        </View>
      </View>
      <View style={styles.gameStats}>
        <View style={styles.gameStat}>
          <Text style={styles.gameStatIcon}>🎯</Text>
          <Text style={styles.gameStatText}>{game.gamesPlayed} parties</Text>
        </View>
        <View style={styles.gameStat}>
          <Text style={styles.gameStatIcon}>⏱️</Text>
          <Text style={styles.gameStatText}>{game.totalTime}</Text>
        </View>
      </View>
    </Pressable>
  );

  // Render activity item
  const renderActivityItem = (activity: typeof recentActivities[0]) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={[styles.activityDot, activity.success ? styles.dotSuccess : styles.dotPrimary]} />
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <View style={styles.activityTitle}>
            <Text style={styles.activityIcon}>{activity.icon}</Text>
            <Text style={styles.activityTitleText}>{activity.game} - {activity.action}</Text>
          </View>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
        <Text style={styles.activityDetails}>{activity.details}</Text>
        <View style={styles.activityBadges}>
          {activity.success && !activity.badge && (
            <View style={styles.activityBadgeSuccess}>
              <Text style={styles.activityBadgeText}>✓ Réussi</Text>
            </View>
          )}
          {activity.badge && (
            <View style={styles.activityBadgeSuccess}>
              <Text style={styles.activityBadgeText}>🏅 Nouveau badge</Text>
            </View>
          )}
          {activity.duration && (
            <View style={styles.activityBadgeTime}>
              <Text style={styles.activityBadgeText}>⏱️ {activity.duration}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  // Render goal card
  const renderGoalCard = (goal: typeof goals[0]) => {
    const circumference = 2 * Math.PI * 24;
    const offset = circumference - (goal.progress / 100) * circumference;

    return (
      <View key={goal.id} style={styles.goalCard}>
        <View style={styles.goalProgressRing}>
          {/* SVG-like progress ring using View */}
          <View style={styles.goalRingBg} />
          <View style={[styles.goalRingProgress, { transform: [{ rotate: '-90deg' }] }]}>
            <View style={[styles.goalRingFill, {
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 6,
              borderColor: goal.progress === 100 ? COLORS.success : COLORS.success,
              borderTopColor: 'transparent',
              borderRightColor: goal.progress > 25 ? COLORS.success : 'transparent',
              borderBottomColor: goal.progress > 50 ? COLORS.success : 'transparent',
              borderLeftColor: goal.progress > 75 ? COLORS.success : 'transparent',
            }]} />
          </View>
          <Text style={styles.goalProgressText}>
            {goal.progress === 100 ? '✓' : `${goal.progress}%`}
          </Text>
        </View>
        <View style={styles.goalContent}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalDesc}>{goal.desc}</Text>
          <View style={[styles.goalStatus, goal.status === 'completed' ? styles.goalStatusCompleted : styles.goalStatusInProgress]}>
            <Text style={styles.goalStatusText}>
              {goal.status === 'completed' ? '✓ Complété' : '⏳ En cours'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Render badge item
  const renderBadgeItem = (badge: typeof badges[0]) => (
    <View key={badge.id} style={[styles.badgeItem, !badge.unlocked && styles.badgeItemLocked]}>
      <View style={[styles.badgeIcon, !badge.unlocked && styles.badgeIconLocked]}>
        <Text style={styles.badgeIconText}>{badge.icon}</Text>
      </View>
      <Text style={[styles.badgeName, !badge.unlocked && styles.badgeNameLocked]}>{badge.name}</Text>
      <Text style={[styles.badgeDate, !badge.unlocked && styles.badgeDateLocked]}>{badge.date}</Text>
    </View>
  );

  // Render overview content
  const renderOverviewContent = () => (
    <>
      {/* Hero Section: Stats + Chart */}
      <View style={styles.heroSection}>
        {/* Stats Overview */}
        <View style={styles.statsOverview}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <View style={[styles.sectionIcon, styles.iconBlue]}>
                <Text style={styles.sectionIconText}>📊</Text>
              </View>
              <Text style={styles.sectionTitleText}>Statistiques Globales</Text>
            </View>
            <View style={styles.periodSelector}>
              <Text style={styles.periodBtn}>Jour</Text>
              <Text style={[styles.periodBtn, styles.periodBtnActive]}>Semaine</Text>
              <Text style={styles.periodBtn}>Mois</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            {renderStatCard(levelsCompleted, 'Niveaux réussis', '↑ +4 cette semaine', 'up', 'primary')}
            {renderStatCard(playTime, 'Temps de jeu', '→ Stable', 'neutral', 'success')}
            {renderStatCard(gamesExplored, 'Jeux explorés', '↑ +1 nouveau', 'up', 'secondary')}
            {renderStatCard(`${successRate}%`, 'Taux de réussite', '↑ +12%', 'up', 'accent')}
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.weeklyChart}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <View style={[styles.sectionIcon, styles.iconGreen]}>
                <Text style={styles.sectionIconText}>📈</Text>
              </View>
              <Text style={styles.sectionTitleText}>Activité de la semaine</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.chartBarGroup}>
                <View style={[styles.chartBar, { height: (day.value / maxValue) * 120 }]} />
                <Text style={styles.chartLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Temps de jeu (min)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Behavior Insights */}
      <View style={styles.behaviorSection}>
        <View style={styles.behaviorCard}>
          <View style={[styles.behaviorIcon, styles.iconMorning]}>
            <Text style={styles.behaviorIconText}>☀️</Text>
          </View>
          <Text style={styles.behaviorLabel}>Meilleur moment</Text>
          <Text style={styles.behaviorValue}>Matin (9h-11h)</Text>
        </View>
        <View style={styles.behaviorCard}>
          <View style={[styles.behaviorIcon, styles.iconDuration]}>
            <Text style={styles.behaviorIconText}>⏱️</Text>
          </View>
          <Text style={styles.behaviorLabel}>Session moyenne</Text>
          <Text style={styles.behaviorValue}>12 minutes</Text>
        </View>
        <View style={styles.behaviorCard}>
          <View style={[styles.behaviorIcon, styles.iconStreak]}>
            <Text style={styles.behaviorIconText}>🔥</Text>
          </View>
          <Text style={styles.behaviorLabel}>Série actuelle</Text>
          <Text style={styles.behaviorValue}>5 jours</Text>
        </View>
        <View style={styles.behaviorCard}>
          <View style={[styles.behaviorIcon, styles.iconPersistence]}>
            <Text style={styles.behaviorIconText}>💪</Text>
          </View>
          <Text style={styles.behaviorLabel}>Essais / niveau</Text>
          <Text style={styles.behaviorValue}>2.3 en moyenne</Text>
        </View>
      </View>

      {/* Skills Section */}
      <View style={styles.skillsSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <View style={[styles.sectionIcon, styles.iconPurple]}>
              <Text style={styles.sectionIconText}>🧠</Text>
            </View>
            <Text style={styles.sectionTitleText}>Compétences Développées</Text>
          </View>
          <Pressable>
            <Text style={styles.seeMoreLink}>Voir détails →</Text>
          </Pressable>
        </View>
        <View style={styles.skillsGrid}>
          {skills.map(renderSkillCard)}
        </View>
      </View>

      {/* Insights Row */}
      <View style={styles.insightsRow}>
        {/* Strengths */}
        <View style={styles.strengthsCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <View style={[styles.sectionIcon, styles.iconGreen]}>
                <Text style={styles.sectionIconText}>💡</Text>
              </View>
              <Text style={styles.sectionTitleText}>Points forts & Axes de progrès</Text>
            </View>
          </View>
          <View style={styles.strengthItem}>
            <View style={[styles.strengthBadge, styles.badgePositive]}>
              <Text style={styles.strengthBadgeText}>⭐</Text>
            </View>
            <View style={styles.strengthContent}>
              <Text style={styles.strengthTitle}>Excellent en planification</Text>
              <Text style={styles.strengthDesc}>{childName} anticipe bien ses actions dans la Tour de Hanoï</Text>
            </View>
            <View style={[styles.strengthTag, styles.tagExcellent]}>
              <Text style={styles.strengthTagText}>Excellent</Text>
            </View>
          </View>
          <View style={styles.strengthItem}>
            <View style={[styles.strengthBadge, styles.badgePositive]}>
              <Text style={styles.strengthBadgeText}>🎯</Text>
            </View>
            <View style={styles.strengthContent}>
              <Text style={styles.strengthTitle}>Bonne concentration</Text>
              <Text style={styles.strengthDesc}>Sessions complètes sans interruption</Text>
            </View>
            <View style={[styles.strengthTag, styles.tagGood]}>
              <Text style={styles.strengthTagText}>Très bien</Text>
            </View>
          </View>
          <View style={styles.strengthItem}>
            <View style={[styles.strengthBadge, styles.badgeImprove]}>
              <Text style={styles.strengthBadgeText}>📈</Text>
            </View>
            <View style={styles.strengthContent}>
              <Text style={styles.strengthTitle}>À travailler : patience</Text>
              <Text style={styles.strengthDesc}>Tendance à recommencer rapidement après une erreur</Text>
            </View>
            <View style={[styles.strengthTag, styles.tagFocus]}>
              <Text style={styles.strengthTagText}>Focus</Text>
            </View>
          </View>
        </View>

        {/* AI Recommendations */}
        <View style={styles.recommendationsCard}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>✨ Recommandations personnalisées</Text>
          </View>
          <Pressable style={styles.recommendationItem}>
            <View style={[styles.recIcon, { backgroundColor: COLORS.success }]}>
              <Text style={styles.recIconText}>🧩</Text>
            </View>
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>Essayer les Suites Logiques</Text>
              <Text style={styles.recReason}>Renforcera la reconnaissance de patterns, un point fort d'{childName}</Text>
            </View>
            <Text style={styles.recArrow}>→</Text>
          </Pressable>
          <Pressable style={styles.recommendationItem}>
            <View style={[styles.recIcon, { backgroundColor: COLORS.accent }]}>
              <Text style={styles.recIconText}>⚖️</Text>
            </View>
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>Balance Logique niveau 2</Text>
              <Text style={styles.recReason}>Idéal pour développer la patience et la réflexion</Text>
            </View>
            <Text style={styles.recArrow}>→</Text>
          </Pressable>
          <Pressable style={styles.recommendationItem}>
            <View style={[styles.recIcon, { backgroundColor: COLORS.secondary }]}>
              <Text style={styles.recIconText}>🗼</Text>
            </View>
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>Tour de Hanoï 4 disques</Text>
              <Text style={styles.recReason}>Prête pour le niveau suivant !</Text>
            </View>
            <Text style={styles.recArrow}>→</Text>
          </Pressable>
        </View>
      </View>

      {/* Games Section */}
      <View style={styles.gamesSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <View style={[styles.sectionIcon, styles.iconOrange]}>
              <Text style={styles.sectionIconText}>🎮</Text>
            </View>
            <Text style={styles.sectionTitleText}>Progression par Jeu</Text>
          </View>
          <Pressable>
            <Text style={styles.seeMoreLink}>Voir tout →</Text>
          </Pressable>
        </View>
        <View style={styles.gamesGrid}>
          {games.map(renderGameCard)}
        </View>
      </View>

      {/* Goals Section */}
      <View style={styles.goalsSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <View style={[styles.sectionIcon, styles.iconBlue]}>
              <Text style={styles.sectionIconText}>🎯</Text>
            </View>
            <Text style={styles.sectionTitleText}>Objectifs de la semaine</Text>
          </View>
          <Pressable>
            <Text style={styles.seeMoreLink}>+ Nouvel objectif</Text>
          </Pressable>
        </View>
        <View style={styles.goalsGrid}>
          {goals.map(renderGoalCard)}
        </View>
      </View>

      {/* Activity Section */}
      <View style={styles.activitySection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <View style={[styles.sectionIcon, styles.iconGreen]}>
              <Text style={styles.sectionIconText}>📅</Text>
            </View>
            <Text style={styles.sectionTitleText}>Activité Récente</Text>
          </View>
          <Pressable>
            <Text style={styles.seeMoreLink}>Voir historique complet →</Text>
          </Pressable>
        </View>
        <View style={styles.activityTimeline}>
          {recentActivities.map(renderActivityItem)}
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.badgesSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <View style={[styles.sectionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.sectionIconText}>🏆</Text>
            </View>
            <Text style={[styles.sectionTitleText, { color: '#fff' }]}>Badges & Accomplissements</Text>
          </View>
          <Pressable>
            <Text style={[styles.seeMoreLink, { color: '#fff' }]}>Collection complète →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesGrid}>
          {badges.map(renderBadgeItem)}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Pressable style={styles.actionCard}>
          <View style={[styles.actionIcon, styles.actionSettings]}>
            <Text style={styles.actionIconText}>⚙️</Text>
          </View>
          <Text style={styles.actionTitle}>Paramètres</Text>
          <Text style={styles.actionDesc}>Profil, limites, notifications</Text>
        </Pressable>
        <Pressable style={styles.actionCard}>
          <View style={[styles.actionIcon, styles.actionExport]}>
            <Text style={styles.actionIconText}>📄</Text>
          </View>
          <Text style={styles.actionTitle}>Exporter rapport</Text>
          <Text style={styles.actionDesc}>PDF pour enseignants</Text>
        </Pressable>
        <Pressable style={styles.actionCard}>
          <View style={[styles.actionIcon, styles.actionTime]}>
            <Text style={styles.actionIconText}>⏰</Text>
          </View>
          <Text style={styles.actionTitle}>Temps d'écran</Text>
          <Text style={styles.actionDesc}>Limites quotidiennes</Text>
        </Pressable>
        <Pressable style={styles.actionCard}>
          <View style={[styles.actionIcon, styles.actionSupport]}>
            <Text style={styles.actionIconText}>💬</Text>
          </View>
          <Text style={styles.actionTitle}>Support</Text>
          <Text style={styles.actionDesc}>Aide & ressources</Text>
        </Pressable>
      </View>
    </>
  );

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'activities':
        return (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>🎮</Text>
            <Text style={styles.comingSoonText}>Détail par activité</Text>
            <Text style={styles.comingSoonDesc}>Bientôt disponible</Text>
          </View>
        );
      case 'skills':
        return (
          <View style={styles.skillsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <View style={[styles.sectionIcon, styles.iconPurple]}>
                  <Text style={styles.sectionIconText}>🧠</Text>
                </View>
                <Text style={styles.sectionTitleText}>Toutes les Compétences</Text>
              </View>
            </View>
            <View style={styles.skillsGrid}>
              {skills.map(renderSkillCard)}
            </View>
          </View>
        );
      case 'history':
        return (
          <View style={styles.activitySection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <View style={[styles.sectionIcon, styles.iconGreen]}>
                  <Text style={styles.sectionIconText}>📅</Text>
                </View>
                <Text style={styles.sectionTitleText}>Historique Complet</Text>
              </View>
            </View>
            <View style={styles.activityTimeline}>
              {recentActivities.map(renderActivityItem)}
            </View>
          </View>
        );
      case 'goals':
        return (
          <View style={styles.goalsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle}>
                <View style={[styles.sectionIcon, styles.iconBlue]}>
                  <Text style={styles.sectionIconText}>🎯</Text>
                </View>
                <Text style={styles.sectionTitleText}>Tous les Objectifs</Text>
              </View>
            </View>
            <View style={styles.goalsGrid}>
              {goals.map(renderGoalCard)}
            </View>
          </View>
        );
      case 'screentime':
        return (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>⏰</Text>
            <Text style={styles.comingSoonText}>Temps d'écran</Text>
            <Text style={styles.comingSoonDesc}>Bientôt disponible</Text>
          </View>
        );
      case 'resources':
        return (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>📚</Text>
            <Text style={styles.comingSoonText}>Ressources pédagogiques</Text>
            <Text style={styles.comingSoonDesc}>Bientôt disponible</Text>
          </View>
        );
      default:
        return renderOverviewContent();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerLeft}>
            <Pressable style={styles.backBtn} onPress={onClose}>
              <Text style={styles.backBtnText}>←</Text>
            </Pressable>
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>👨‍👩‍👧 Espace Parents</Text>
              <Text style={styles.headerSubtitle}>Tableau de bord & suivi de progression</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.childSelector}>
              <View style={styles.childAvatar}>
                <Text style={styles.childAvatarText}>👦</Text>
              </View>
              <Text style={styles.childName}>{childName}</Text>
              <Text style={styles.childDropdown}>▼</Text>
            </View>
            <Pressable style={styles.settingsBtn}>
              <Text style={styles.settingsBtnText}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.navTabs}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navTabsContent}
          >
            {navTabs.map((tab) => (
              <Pressable
                key={tab.id}
                style={[styles.navTab, activeTab === tab.id && styles.navTabActive]}
                onPress={() => {
                  setActiveTab(tab.id);
                  triggerHaptic('selection');
                }}
              >
                <Text style={styles.navTabIcon}>{tab.icon}</Text>
                <Text style={[styles.navTabLabel, activeTab === tab.id && styles.navTabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={[styles.mainContentContainer, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 20,
    color: '#fff',
  },
  headerTitle: {},
  headerTitleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  childAvatar: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childAvatarText: {
    fontSize: 16,
  },
  childName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  childDropdown: {
    color: '#fff',
    fontSize: 10,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtnText: {
    fontSize: 18,
  },

  // Navigation Tabs
  navTabs: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navTabsContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  navTab: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  navTabActive: {
    borderBottomColor: COLORS.primary,
  },
  navTabIcon: {
    fontSize: 16,
  },
  navTabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  navTabLabelActive: {
    color: COLORS.primary,
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    padding: 20,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlue: { backgroundColor: 'rgba(91,141,238,0.15)' },
  iconGreen: { backgroundColor: 'rgba(123,199,77,0.15)' },
  iconOrange: { backgroundColor: 'rgba(255,179,71,0.15)' },
  iconPurple: { backgroundColor: 'rgba(224,86,253,0.15)' },
  sectionIconText: {
    fontSize: 18,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  seeMoreLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },

  // Period Selector
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    padding: 4,
    borderRadius: 10,
    gap: 4,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  periodBtnActive: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    overflow: 'hidden',
  },

  // Hero Section
  heroSection: {
    gap: 16,
    marginBottom: 20,
  },

  // Stats Overview
  statsOverview: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  statTrend: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendUp: { backgroundColor: 'rgba(123,199,77,0.15)' },
  trendDown: { backgroundColor: 'rgba(229,62,62,0.15)' },
  trendNeutral: { backgroundColor: 'rgba(113,128,150,0.15)' },
  statTrendText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.successDark,
  },

  // Weekly Chart
  weeklyChart: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  chartContainer: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 20,
  },
  chartBarGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: '100%',
    maxWidth: 35,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textMedium,
  },

  // Behavior Section
  behaviorSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  behaviorCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  behaviorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconMorning: { backgroundColor: 'rgba(255,179,71,0.15)' },
  iconDuration: { backgroundColor: 'rgba(91,141,238,0.15)' },
  iconStreak: { backgroundColor: 'rgba(123,199,77,0.15)' },
  iconPersistence: { backgroundColor: 'rgba(224,86,253,0.15)' },
  behaviorIconText: {
    fontSize: 20,
  },
  behaviorLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  behaviorValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },

  // Skills Section
  skillsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  skillIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  skillStars: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starFilled: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  starEmpty: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  skillProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  skillProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  skillProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },

  // Insights Row
  insightsRow: {
    gap: 16,
    marginBottom: 20,
  },

  // Strengths Card
  strengthsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  strengthBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePositive: { backgroundColor: 'rgba(123,199,77,0.15)' },
  badgeImprove: { backgroundColor: 'rgba(255,179,71,0.15)' },
  strengthBadgeText: {
    fontSize: 18,
  },
  strengthContent: {
    flex: 1,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  strengthDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  strengthTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagExcellent: { backgroundColor: COLORS.success },
  tagGood: { backgroundColor: 'rgba(123,199,77,0.2)' },
  tagFocus: { backgroundColor: COLORS.secondary },
  strengthTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // Recommendations Card
  recommendationsCard: {
    backgroundColor: 'rgba(224,86,253,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(224,86,253,0.2)',
    borderRadius: 20,
    padding: 20,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  recommendationItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recIconText: {
    fontSize: 22,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  recReason: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  recArrow: {
    fontSize: 16,
    color: COLORS.textMuted,
  },

  // Games Section
  gamesSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  gamesGrid: {
    gap: 12,
  },
  gameCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  gameBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gameBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  gameCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  gameIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIconText: {
    fontSize: 22,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  gameCategory: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  gameProgressContainer: {
    marginBottom: 12,
  },
  gameProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  gameProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  gameProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gameProgressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  gameStats: {
    flexDirection: 'row',
    gap: 16,
  },
  gameStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameStatIcon: {
    fontSize: 14,
  },
  gameStatText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Goals Section
  goalsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  goalsGrid: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  goalProgressRing: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  goalRingBg: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 6,
    borderColor: '#E2E8F0',
  },
  goalRingProgress: {
    position: 'absolute',
  },
  goalRingFill: {},
  goalProgressText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  goalStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  goalStatusInProgress: {
    backgroundColor: 'rgba(91,141,238,0.15)',
  },
  goalStatusCompleted: {
    backgroundColor: 'rgba(123,199,77,0.15)',
  },
  goalStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },

  // Activity Section
  activitySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  activityTimeline: {
    paddingLeft: 24,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
  },
  activityItem: {
    position: 'relative',
    paddingVertical: 12,
  },
  activityDot: {
    position: 'absolute',
    left: -30,
    top: 18,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  dotSuccess: { backgroundColor: COLORS.success },
  dotPrimary: { backgroundColor: COLORS.primary },
  activityContent: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 14,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  activityTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  activityIcon: {
    fontSize: 16,
  },
  activityTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  activityDetails: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 19,
  },
  activityBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  activityBadgeSuccess: {
    backgroundColor: 'rgba(123,199,77,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activityBadgeTime: {
    backgroundColor: 'rgba(91,141,238,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },

  // Badges Section
  badgesSection: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  badgesGrid: {
    gap: 12,
    paddingVertical: 8,
  },
  badgeItem: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  badgeItemLocked: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD93D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  badgeIconLocked: {
    backgroundColor: '#CBD5E0',
  },
  badgeIconText: {
    fontSize: 28,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: 'rgba(255,255,255,0.7)',
  },
  badgeDate: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  badgeDateLocked: {
    color: 'rgba(255,255,255,0.5)',
  },

  // Actions Section
  actionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionSettings: { backgroundColor: COLORS.primary },
  actionExport: { backgroundColor: COLORS.success },
  actionTime: { backgroundColor: COLORS.secondary },
  actionSupport: { backgroundColor: COLORS.accent },
  actionIconText: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // Coming Soon
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  comingSoonIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  comingSoonDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
