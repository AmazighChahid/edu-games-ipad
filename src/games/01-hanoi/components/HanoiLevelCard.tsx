/**
 * HanoiLevelCard
 * Carte de niveau custom pour Tour de Hanoï avec preview des mini-disques
 *
 * Affiche :
 * - Stack de mini-disques colorés (preview visuelle du niveau)
 * - Numéro du niveau
 * - État (sélectionné, complété, verrouillé)
 * - Étoiles si complété
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontFamily,
  fontSize,
} from '../../../theme';
import type { LevelConfig } from '../../../components/common/GameIntroTemplate.types';

// ============================================
// TYPES
// ============================================

interface HanoiLevelCardProps {
  level: LevelConfig;
  isSelected: boolean;
}

// ============================================
// DISK COLORS (from theme.colors.game)
// ============================================

const DISK_COLORS = [
  colors.game.disk1,
  colors.game.disk2,
  colors.game.disk3,
  colors.game.disk4,
  colors.game.disk5,
];

// ============================================
// COMPONENT
// ============================================

export function HanoiLevelCard({ level, isSelected }: HanoiLevelCardProps) {
  // Get disk count from config (number = level number = disk count + 1)
  const diskCount = (level.config?.diskCount as number) || level.number + 1;

  return (
    <View
      style={[
        styles.card,
        level.isCompleted && styles.cardCompleted,
        isSelected && styles.cardSelected,
        !level.isUnlocked && styles.cardLocked,
      ]}
    >
      {/* Mini disks stack (visual preview) - smallest at top, largest at bottom (like real Hanoi) */}
      <View style={styles.disksStack}>
        {Array.from({ length: Math.min(diskCount, 5) }).map((_, i) => {
          // i=0 → rendered first (top) → smallest disk
          // i=diskCount-1 → rendered last (bottom) → largest disk
          const diskSize = i + 1; // 1 = smallest (top), diskCount = largest (bottom)
          const width = 16 + diskSize * 8; // Smaller disks to fit card
          const colorIndex = i % DISK_COLORS.length;

          return (
            <View
              key={i}
              style={[
                styles.miniDisk,
                {
                  width,
                  backgroundColor: level.isUnlocked
                    ? DISK_COLORS[colorIndex]
                    : colors.text.muted,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Level number */}
      <Text
        style={[
          styles.levelNumber,
          isSelected && styles.levelNumberSelected,
          !level.isUnlocked && styles.levelNumberLocked,
        ]}
      >
        {level.isUnlocked ? diskCount : '🔒'}
      </Text>

      {/* Stars if completed */}
      {level.isCompleted && level.stars !== undefined && (
        <View style={styles.starsRow}>
          {[1, 2, 3].map((star) => (
            <Text
              key={star}
              style={star <= (level.stars || 0) ? styles.starFilled : styles.starEmpty}
            >
              ★
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    alignItems: 'center',
    width: 100,
    height: 120,
    borderWidth: 2,
    borderColor: colors.background.secondary,
    ...shadows.md,
  },
  cardCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#7BC74D',
  },
  cardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
    transform: [{ scale: 1.05 }],
  },
  cardLocked: {
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },

  // Mini disks preview
  disksStack: {
    alignItems: 'center',
    gap: 2,
    marginBottom: spacing[1],
    minHeight: 40,
    justifyContent: 'flex-end',
  },
  miniDisk: {
    height: 6,
    borderRadius: 3,
  },

  // Level number
  levelNumber: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  levelNumberSelected: {
    color: colors.primary.main,
  },
  levelNumberLocked: {
    fontSize: 24,
    color: colors.text.muted,
  },

  // Stars
  starsRow: {
    flexDirection: 'row',
    marginTop: spacing[1],
    gap: 2,
  },
  starFilled: {
    fontSize: 14,
    color: colors.secondary.main,
  },
  starEmpty: {
    fontSize: 14,
    color: colors.text.muted,
    opacity: 0.3,
  },
});

export default HanoiLevelCard;
