import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InventoryItem } from '../types';

interface Props {
  items: InventoryItem[];
  maxSlots?: number;
}

const ELEMENT_ICONS = {
  key: '🔑',
  gem: '💎',
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
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  slots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  slot: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 28,
  },
  colorDot: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  emptySlot: {
    width: '100%',
    height: '100%',
  },
});
