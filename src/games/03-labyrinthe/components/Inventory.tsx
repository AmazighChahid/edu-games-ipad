import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';
import { InventoryItem } from '../types';

interface Props {
  items: InventoryItem[];
  maxSlots?: number;
}

const ELEMENT_ICONS: Record<string, string> = {
  key: Icons.key,
  gem: Icons.gem,
};

const COLOR_STYLES = {
  red: '#E53E3E',
  blue: '#5B8DEE',
  green: '#7BC74D',
  yellow: '#F39C12',
  purple: '#E056FD',
};

export const Inventory: React.FC<Props> = ({ items, maxSlots = 5 }) => {
  const slots = Array.from({ length: maxSlots }, (_, i) => items[i] || null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventaire</Text>
      <View style={styles.slots}>
        {slots.map((item, index) => (
          <View key={index} style={styles.slot}>
            {item ? (
              <View style={styles.itemContainer}>
                {item.color && (
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: COLOR_STYLES[item.color] },
                    ]}
                  />
                )}
                <Text style={styles.itemIcon}>{ELEMENT_ICONS[item.type]}</Text>
              </View>
            ) : (
              <View style={styles.emptySlot} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  slots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  slot: {
    width: theme.touchTargets.large,
    height: theme.touchTargets.large,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 32,
  },
  colorDot: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  emptySlot: {
    width: '100%',
    height: '100%',
  },
});
