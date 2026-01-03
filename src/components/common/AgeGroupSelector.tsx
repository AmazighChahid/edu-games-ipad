/**
 * AgeGroupSelector component
 * Dropdown for selecting age groups (6-7, 7-8, 8-9, 9-10 years)
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, spacing, fontFamily, fontSize, borderRadius, shadows, touchTargets } from '../../theme';
import { Icons } from '../../constants/icons';
import { useStore } from '../../store';

export type AgeGroup = '6-7' | '7-8' | '8-9' | '9-10';

export interface AgeGroupOption {
  value: AgeGroup;
  label: string;
  icon?: string;
}

export interface AgeGroupSelectorProps {
  /** Currently selected age group */
  selectedAge: AgeGroup;
  /** Callback when age changes */
  onAgeChange: (age: AgeGroup) => void;
  /** Available options. Default: all age groups */
  options?: AgeGroupOption[];
  /** Show child icon. Default: true */
  showIcon?: boolean;
  /** Compact mode (shorter labels). Default: false */
  compact?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

const DEFAULT_AGE_OPTIONS: AgeGroupOption[] = [
  { value: '6-7', label: '6-7 ans', icon: Icons.child },
  { value: '7-8', label: '7-8 ans', icon: Icons.child },
  { value: '8-9', label: '8-9 ans', icon: Icons.child },
  { value: '9-10', label: '9-10 ans', icon: Icons.child },
];

const COMPACT_LABELS: Record<AgeGroup, string> = {
  '6-7': '6-7',
  '7-8': '7-8',
  '8-9': '8-9',
  '9-10': '9-10',
};

export function AgeGroupSelector({
  selectedAge,
  onAgeChange,
  options = DEFAULT_AGE_OPTIONS,
  showIcon = true,
  compact = false,
  accessibilityLabel = "Sélectionner la tranche d'âge",
}: AgeGroupSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hapticEnabled = useStore((state) => state.hapticEnabled);

  const currentOption = options.find((o) => o.value === selectedAge) || options[0];

  const handleToggle = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsOpen((prev) => !prev);
  }, [hapticEnabled]);

  const handleSelect = useCallback(
    (age: AgeGroup) => {
      if (hapticEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onAgeChange(age);
      setIsOpen(false);
    },
    [hapticEnabled, onAgeChange]
  );

  const handleOverlayPress = useCallback(() => {
    setIsOpen(false);
  }, []);

  const displayLabel = compact
    ? COMPACT_LABELS[currentOption.value]
    : currentOption.label;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleToggle}
        style={[styles.button, isOpen && styles.buttonOpen]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        {showIcon && currentOption.icon && (
          <Text style={styles.icon}>{currentOption.icon}</Text>
        )}
        <Text style={styles.label}>{displayLabel}</Text>
        <Text style={styles.chevron}>
          {isOpen ? Icons.chevronUp : Icons.chevronDown}
        </Text>
      </Pressable>

      {isOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <Pressable
            style={styles.overlay}
            onPress={handleOverlayPress}
            accessibilityLabel="Fermer le menu"
          />

          {/* Dropdown menu */}
          <View style={styles.dropdown}>
            {options.map((option) => {
              const isSelected = selectedAge === option.value;
              const optionLabel = compact
                ? COMPACT_LABELS[option.value]
                : option.label;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {showIcon && option.icon ? `${option.icon} ` : ''}
                    {optionLabel}
                  </Text>
                  {isSelected && (
                    <Text style={styles.checkmark}>{Icons.checkmark}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    height: touchTargets.minimum,
    minWidth: 120,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  buttonOpen: {
    borderColor: colors.primary.main,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing[2],
  },
  label: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  chevron: {
    fontSize: 12,
    color: colors.text.muted,
    marginLeft: spacing[2],
  },
  overlay: {
    position: 'absolute',
    top: touchTargets.minimum,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 98,
  },
  dropdown: {
    position: 'absolute',
    top: touchTargets.minimum - 1,
    left: 0,
    right: 0,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    ...shadows.md,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.primary.main,
    zIndex: 99,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: touchTargets.minimum,
  },
  optionSelected: {
    backgroundColor: colors.primary.light + '20',
  },
  optionText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  optionTextSelected: {
    fontFamily: fontFamily.semiBold,
    color: colors.primary.main,
  },
  checkmark: {
    fontSize: 16,
    color: colors.primary.main,
  },
});
