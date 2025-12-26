/**
 * Skills Radar Component V2
 * Enhanced visual representation with stars and progress bars
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';

interface SkillData {
  name: string;
  level: number; // 0-5
  icon: string;
  color: string;
}

interface SkillsRadarV2Props {
  skills: SkillData[];
}

export function SkillsRadarV2({ skills }: SkillsRadarV2Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(224, 86, 253, 0.15)' }]}>
          <Text style={styles.headerIcon}>🧠</Text>
        </View>
        <Text style={styles.title}>Compétences Développées</Text>
      </View>

      {/* Skills Grid */}
      <View style={styles.skillsGrid}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillCard}>
            {/* Icon */}
            <View style={styles.skillIconContainer}>
              <Text style={styles.skillIcon}>{skill.icon}</Text>
            </View>

            {/* Name */}
            <Text style={styles.skillName}>{skill.name}</Text>

            {/* Stars */}
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.star,
                    { color: i < skill.level ? colors.secondary.main : colors.ui.border },
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(skill.level / 5) * 100}%`,
                    backgroundColor: skill.color,
                  },
                ]}
              />
            </View>

            {/* Level Text */}
            <Text style={styles.levelText}>Niveau {skill.level}/5</Text>
          </View>
        ))}
      </View>
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
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
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
    flex: 1,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  skillCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    alignItems: 'center',
  },
  skillIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  skillIcon: {
    fontSize: 28,
  },
  skillName: {
    fontFamily: 'Fredoka',
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing[1],
    marginBottom: spacing[2],
  },
  star: {
    fontSize: 16,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.ui.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.muted,
  },
});
