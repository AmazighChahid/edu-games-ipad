/**
 * Goals Section Component
 * Displays parent-defined goals with progress tracking
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { useStore, useActiveProfile } from '../../store';
import type { ParentGoal, GoalStatus } from '../../types';
import { GoalEditor } from './GoalEditor';

const STATUS_CONFIG: Record<GoalStatus, { icon: string; color: string }> = {
  active: { icon: '⏳', color: colors.primary.main },
  completed: { icon: '✓', color: colors.feedback.success },
  expired: { icon: '⏰', color: colors.feedback.error },
  paused: { icon: '⏸️', color: colors.text.muted },
};

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
}

function CircularProgress({ progress, size = 60 }: CircularProgressProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isComplete = progress >= 100;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.ui.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isComplete ? colors.feedback.success : colors.primary.main}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {/* Center text */}
      <View style={styles.progressTextContainer}>
        {isComplete ? (
          <Text style={styles.progressCheck}>✓</Text>
        ) : (
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        )}
      </View>
    </View>
  );
}

export function GoalsSection() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ParentGoal | null>(null);

  const profile = useActiveProfile();
  const goals = useStore((state) =>
    state.goals.filter((g) => g.profileId === profile?.id)
  );

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowEditor(true);
  };

  const handleEditGoal = (goal: ParentGoal) => {
    setEditingGoal(goal);
    setShowEditor(true);
  };

  const getProgressPercent = (goal: ParentGoal): number => {
    if (goal.target === 0) return 0;
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(91, 141, 238, 0.15)' }]}>
            <Text style={styles.headerIcon}>🎯</Text>
          </View>
          <Text style={styles.title}>Objectifs de la semaine</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
          <Text style={styles.addButtonText}>+ Nouvel objectif</Text>
        </TouchableOpacity>
      </View>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyTitle}>Aucun objectif défini</Text>
          <Text style={styles.emptyText}>
            Définissez des objectifs pour motiver votre enfant !
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddGoal}>
            <Text style={styles.emptyButtonText}>Créer un objectif</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.goalsGrid}>
          {activeGoals.slice(0, 4).map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalCard}
              onPress={() => handleEditGoal(goal)}
              activeOpacity={0.7}
            >
              {/* Progress Ring */}
              <CircularProgress progress={getProgressPercent(goal)} />

              {/* Content */}
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle} numberOfLines={1}>
                  {goal.title}
                </Text>
                {goal.description && (
                  <Text style={styles.goalDescription} numberOfLines={1}>
                    {goal.description}
                  </Text>
                )}
                <View style={styles.goalStatus}>
                  <Text style={styles.statusIcon}>
                    {STATUS_CONFIG[goal.status].icon}
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      { color: STATUS_CONFIG[goal.status].color },
                    ]}
                  >
                    {goal.status === 'active' ? 'En cours' : goal.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Show completed count if any */}
          {completedGoals.length > 0 && (
            <View style={styles.completedBanner}>
              <Text style={styles.completedText}>
                ✓ {completedGoals.length} objectif{completedGoals.length > 1 ? 's' : ''} complété{completedGoals.length > 1 ? 's' : ''} !
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Goal Editor Modal */}
      <Modal
        visible={showEditor}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditor(false)}
      >
        <GoalEditor
          goal={editingGoal}
          onClose={() => setShowEditor(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 18,
  },
  title: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary.main,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  goalCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: 'Fredoka',
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressCheck: {
    fontSize: 20,
    color: colors.feedback.success,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  goalDescription: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: spacing[2],
  },
  goalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  statusIcon: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  completedBanner: {
    width: '100%',
    backgroundColor: 'rgba(123, 199, 77, 0.15)',
    borderRadius: borderRadius.md,
    padding: spacing[3],
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.feedback.success,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing[6],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  emptyTitle: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  emptyButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.inverse,
  },
});
