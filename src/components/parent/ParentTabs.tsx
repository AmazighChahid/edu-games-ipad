/**
 * Parent Dashboard Tab Navigation
 * Horizontal tabs for switching between dashboard sections
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import type { ParentTabId } from '../../types';

interface Tab {
  id: ParentTabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'activities', label: 'Activités', icon: '🎮' },
  { id: 'skills', label: 'Compétences', icon: '🧠' },
  { id: 'goals', label: 'Objectifs', icon: '🎯' },
];

interface ParentTabsProps {
  activeTab: ParentTabId;
  onTabChange: (tabId: ParentTabId) => void;
}

export function ParentTabs({ activeTab, onTabChange }: ParentTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    gap: spacing[2],
    position: 'relative',
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.muted,
  },
  tabLabelActive: {
    color: colors.primary.main,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing[5],
    right: spacing[5],
    height: 3,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.sm,
  },
});
