/**
 * BalanceGameScreen
 *
 * Menu principal pour le jeu Balance Logique
 * Permet d'accéder à :
 * - Mode Niveaux (BalanceIntroScreen)
 * - Mode Libre (Sandbox)
 * - Journal des découvertes
 *
 * Note: Le jeu principal est maintenant dans BalanceIntroScreen qui utilise GameIntroTemplate
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { colors, spacing, touchTargets, shadows, borderRadius, fontFamily, fontSize } from '../../../theme';
import { PageContainer, ScreenHeader } from '../../../components/common';
import { Icons } from '../../../constants/icons';
import { DrHibou } from '../components/DrHibou';
import { EquivalenceJournal } from '../components/EquivalenceJournal';
import { SandboxMode } from '../components/SandboxMode';
import { useGameProgress, useStore } from '../../../store/useStore';
import type { Equivalence, PlayerProgress } from '../types';

// ============================================
// TYPES
// ============================================

type GameView = 'menu' | 'sandbox' | 'journal';

// ============================================
// MAIN COMPONENT
// ============================================

export function BalanceGameScreen() {
  const router = useRouter();

  // Store - progression
  const gameProgress = useGameProgress('balance');

  // State
  const [view, setView] = useState<GameView>('menu');
  const [showJournal, setShowJournal] = useState(false);
  const [showMascotBubble, setShowMascotBubble] = useState(true);

  // Local state pour les équivalences découvertes (à migrer vers store)
  const [discoveredEquivalences, setDiscoveredEquivalences] = useState<Equivalence[]>([]);

  // Stats depuis le store
  const completedLevels = gameProgress?.completedLevels
    ? Object.keys(gameProgress.completedLevels).length
    : 0;

  // Handle sandbox discovery
  const handleSandboxDiscovery = useCallback((equivalence: Equivalence) => {
    setDiscoveredEquivalences(prev => [...prev, equivalence]);
  }, []);

  // Navigate to levels (nouvel écran avec GameIntroTemplate)
  const handleGoToLevels = useCallback(() => {
    router.push('/(games)/04-balance/intro');
  }, [router]);

  // ============================================
  // RENDER: SANDBOX VIEW
  // ============================================

  if (view === 'sandbox') {
    return (
      <SandboxMode
        onDiscovery={handleSandboxDiscovery}
        onExit={() => setView('menu')}
        discoveredEquivalences={discoveredEquivalences}
      />
    );
  }

  // ============================================
  // RENDER: MENU VIEW
  // ============================================

  return (
    <PageContainer variant="playful">
      <ScreenHeader
        variant="game"
        title="Balance Logique"
        emoji={Icons.balance}
        onBack={() => router.back()}
      />

      {/* Dr. Hibou welcome */}
      <View style={styles.mascotContainer}>
        <DrHibou
          mood="excited"
          message={showMascotBubble ? "Bienvenue dans mon laboratoire ! Que veux-tu explorer ?" : undefined}
          size="large"
          position="center"
          onMessageDismiss={() => setShowMascotBubble(false)}
        />
      </View>

      {/* Menu buttons */}
      <View style={styles.menuButtons}>
        <TouchableOpacity
          style={[styles.menuButton, styles.menuButtonPrimary]}
          onPress={handleGoToLevels}
          activeOpacity={0.8}
        >
          <Text style={styles.menuButtonEmoji}>{Icons.lab}</Text>
          <View style={styles.menuButtonContent}>
            <Text style={styles.menuButtonTitle}>Niveaux</Text>
            <Text style={styles.menuButtonSubtitle}>30 défis à résoudre</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, styles.menuButtonSecondary]}
          onPress={() => setView('sandbox')}
          activeOpacity={0.8}
        >
          <Text style={styles.menuButtonEmoji}>{Icons.sandbox}</Text>
          <View style={styles.menuButtonContent}>
            <Text style={styles.menuButtonTitle}>Mode Libre</Text>
            <Text style={styles.menuButtonSubtitle}>Expérimente sans limite</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, styles.menuButtonTertiary]}
          onPress={() => setShowJournal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.menuButtonEmoji}>{Icons.journal}</Text>
          <View style={styles.menuButtonContent}>
            <Text style={styles.menuButtonTitle}>Mon Journal</Text>
            <Text style={styles.menuButtonSubtitle}>
              {discoveredEquivalences.length} découvertes
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Progress summary */}
      <View style={styles.progressSummary}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{completedLevels}</Text>
          <Text style={styles.progressLabel}>Niveaux</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>
            {discoveredEquivalences.length}
          </Text>
          <Text style={styles.progressLabel}>Découvertes</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>1</Text>
          <Text style={styles.progressLabel}>Phases</Text>
        </View>
      </View>

      {/* Journal modal */}
      <EquivalenceJournal
        equivalences={discoveredEquivalences}
        isVisible={showJournal}
        onClose={() => setShowJournal(false)}
      />
    </PageContainer>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Mascot container
  mascotContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },

  // Menu buttons
  menuButtons: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    minHeight: touchTargets.large,
    ...shadows.md,
  },
  menuButtonPrimary: {
    backgroundColor: colors.home.categories.logic,
  },
  menuButtonSecondary: {
    backgroundColor: colors.home.categories.memory,
  },
  menuButtonTertiary: {
    backgroundColor: colors.home.categories.numbers,
  },
  menuButtonEmoji: {
    fontSize: 36,
  },
  menuButtonContent: {
    flex: 1,
  },
  menuButtonTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  menuButtonSubtitle: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Progress summary
  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  progressItem: {
    alignItems: 'center',
    minWidth: 70,
  },
  progressValue: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.text.secondary,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.ui.divider,
  },
});

export default BalanceGameScreen;
