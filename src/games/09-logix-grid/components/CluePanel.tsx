/**
 * CluePanel Component
 *
 * Panneau affichant les indices du puzzle
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInLeft, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { colors, spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';
import type { Clue } from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface CluePanelProps {
  /** Liste des indices */
  clues: Clue[];
  /** IDs des indices utilisés */
  usedClueIds: string[];
  /** Indice actif (mis en évidence) */
  activeClueId: string | null;
  /** Callback quand on touche un indice */
  onCluePress: (clueId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CluePanel({
  clues,
  usedClueIds,
  activeClueId,
  onCluePress,
}: CluePanelProps) {
  const { shouldAnimate, getDuration } = useAccessibilityAnimations();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>🔍 Indices</Text>

      {clues.map((clue, index) => {
        const isUsed = usedClueIds.includes(clue.id);
        const isActive = activeClueId === clue.id;

        return (
          <Animated.View
            key={clue.id}
            entering={
              shouldAnimate
                ? FadeInLeft.delay(index * 100).duration(getDuration(300))
                : undefined
            }
          >
            <Pressable
              style={[
                styles.clueCard,
                isUsed && styles.clueCardUsed,
                isActive && styles.clueCardActive,
              ]}
              onPress={() => onCluePress(clue.id)}
            >
              <View style={styles.clueNumber}>
                <Text style={styles.clueNumberText}>{index + 1}</Text>
              </View>
              <Text
                style={[
                  styles.clueText,
                  isUsed && styles.clueTextUsed,
                ]}
              >
                {clue.text}
              </Text>
              {isUsed && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </Pressable>
          </Animated.View>
        );
      })}

      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>💡 Astuce</Text>
        <Text style={styles.helpText}>
          Touche une case pour marquer ✓ (oui) ou ✗ (non).{'\n'}
          Quand tu trouves un ✓, les autres cases de la même ligne deviennent automatiquement ✗.
        </Text>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    margin: spacing[2],
  },
  scrollContent: {
    padding: spacing[3],
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  clueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  clueCardUsed: {
    backgroundColor: '#E8F5E9',
    opacity: 0.8,
  },
  clueCardActive: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  clueNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  clueNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  clueText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  clueTextUsed: {
    color: colors.text.tertiary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  helpCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: borderRadius.md,
    padding: spacing[3],
    marginTop: spacing[2],
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  helpText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});

export default CluePanel;
