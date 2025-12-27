/**
 * Skills Radar Component
 * Visual representation of skills development across games
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, textStyles, borderRadius } from '../../theme';

interface SkillsRadarProps {
  skills: {
    name: string;
    level: number; // 0-5
    color?: string;
  }[];
}

export function SkillsRadar({ skills }: SkillsRadarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compétences Développées</Text>

      <View style={styles.skillsGrid}>
        {skills.map((skill, index) => {
          const levelPercentage = (skill.level / 5) * 100;
          const skillColor = skill.color || colors.primary.main;

          return (
            <View key={index} style={styles.skillCard}>
              {/* Skill Icon/Level */}
              <View style={styles.levelContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.levelDot,
                      i < skill.level
                        ? { backgroundColor: skillColor }
                        : { backgroundColor: colors.background.secondary },
                    ]}
                  />
                ))}
              </View>

              {/* Skill Name */}
              <Text style={styles.skillName}>{skill.name}</Text>

              {/* Level Text */}
              <Text style={styles.levelText}>
                Niveau {skill.level}/5
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  title: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  skillCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    minWidth: 160,
    gap: spacing[2],
  },
  levelContainer: {
    flexDirection: 'row',
    gap: spacing[1],
    marginBottom: spacing[1],
  },
  levelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  skillName: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  levelText: {
    ...textStyles.caption,
    color: colors.text.secondary,
  },
});
