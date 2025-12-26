/**
 * Progress Chart Component
 * Simple bar chart for visualizing game progress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, textStyles, borderRadius } from '@/theme';

interface ProgressChartProps {
  data: {
    label: string;
    value: number;
    maxValue: number;
    color?: string;
  }[];
  title?: string;
}

export function ProgressChart({ data, title }: ProgressChartProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      {data.map((item, index) => {
        const percentage = Math.min((item.value / item.maxValue) * 100, 100);
        const barColor = item.color || colors.primary.main;

        return (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.label}>{item.label}</Text>

            <View style={styles.barWrapper}>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>

              <Text style={styles.value}>
                {item.value}/{item.maxValue}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  title: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  barContainer: {
    gap: spacing[1],
  },
  label: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  barBackground: {
    flex: 1,
    height: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.md,
    minWidth: 4,
  },
  value: {
    ...textStyles.caption,
    color: colors.text.secondary,
    minWidth: 50,
    textAlign: 'right',
  },
});
