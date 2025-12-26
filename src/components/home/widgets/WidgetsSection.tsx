/**
 * WidgetsSection - 2x2 grid of widgets
 * Contains: Piou, Garden, Streak, Collection widgets
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import { PiouAdvice, GardenStats, StreakData, CollectionDataV9 } from '@/types/home.types';
import { PiouWidget } from './PiouWidget';
import { GardenWidget } from './GardenWidget';
import { StreakWidget } from './StreakWidget';
import { CollectionWidgetV9 } from './CollectionWidgetV9';

interface WidgetsSectionProps {
  piouAdvice: PiouAdvice;
  gardenStats: GardenStats;
  streakData: StreakData;
  collectionData: CollectionDataV9;
}

export const WidgetsSection = memo(({
  piouAdvice,
  gardenStats,
  streakData,
  collectionData,
}: WidgetsSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={styles.row}>
          <View style={styles.widgetWrapper}>
            <PiouWidget advice={piouAdvice} />
          </View>
          <View style={styles.widgetWrapper}>
            <GardenWidget stats={gardenStats} />
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <View style={styles.widgetWrapper}>
            <StreakWidget streak={streakData} />
          </View>
          <View style={styles.widgetWrapper}>
            <CollectionWidgetV9 collection={collectionData} />
          </View>
        </View>
      </View>
    </View>
  );
});

WidgetsSection.displayName = 'WidgetsSection';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  grid: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  widgetWrapper: {
    flex: 1,
  },
});
