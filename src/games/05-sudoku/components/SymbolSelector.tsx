/**
 * SymbolSelector Component
 * Bottom panel for selecting symbols to place in the grid
 * Supports both tap and drag & drop
 */

import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store';
import { Icons } from '@/constants/icons';
import { useDragDrop } from '../context/DragDropContext';
import type { SudokuValue } from '../types';

// ============================================
// TYPES
// ============================================

interface SymbolSelectorProps {
  symbols: SudokuValue[];
  onSymbolSelect: (symbol: SudokuValue) => void;
  selectedSymbol?: SudokuValue;
  onClear?: () => void;
  theme: string;
  usedSymbols?: Set<SudokuValue>;
}

// ============================================
// COMPONENT
// ============================================

export function SymbolSelector({
  symbols,
  onSymbolSelect,
  selectedSymbol,
  onClear,
  theme,
  usedSymbols,
}: SymbolSelectorProps) {
  const hapticEnabled = useStore((state) => state.hapticEnabled);

  return (
    <View style={styles.container}>
      <View style={styles.symbolsRow}>
        {symbols.map((symbol, index) => {
          const isUsed = usedSymbols?.has(symbol) ?? false;
          return (
            <DraggableSymbolButton
              key={index}
              symbol={symbol}
              isSelected={selectedSymbol === symbol}
              isUsed={isUsed}
              onPress={() => {
                if (hapticEnabled) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onSymbolSelect(symbol);
              }}
              theme={theme}
              hapticEnabled={hapticEnabled}
            />
          );
        })}

        {onClear && (
          <ClearButton
            onPress={() => {
              if (hapticEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              onClear();
            }}
          />
        )}
      </View>
    </View>
  );
}

// ============================================
// DRAGGABLE SYMBOL BUTTON
// ============================================

interface DraggableSymbolButtonProps {
  symbol: SudokuValue;
  isSelected: boolean;
  isUsed?: boolean;
  onPress: () => void;
  theme: string;
  hapticEnabled: boolean;
}

function DraggableSymbolButton({
  symbol,
  isSelected,
  isUsed = false,
  onPress,
  theme,
  hapticEnabled,
}: DraggableSymbolButtonProps) {
  const { startDrag, updateDragPosition, endDrag } = useDragDrop();

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(1);

  const isNumberTheme = theme === 'numbers';
  const isDisabled = isUsed || symbol === null;

  // Tap gesture for quick selection
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSequence(
        withSpring(0.9, { duration: 100 }),
        withSpring(1, { duration: 100 })
      );
    })
    .onEnd(() => {
      runOnJS(onPress)();
    });

  // Pan gesture for drag & drop
  const panGesture = Gesture.Pan()
    .enabled(!isDisabled)
    .activateAfterLongPress(150) // Long press to initiate drag
    .onStart((event) => {
      scale.value = withSpring(1.15);
      zIndex.value = 1000;

      if (hapticEnabled) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }

      runOnJS(startDrag)(
        symbol,
        'selector',
        null,
        { x: event.absoluteX, y: event.absoluteY }
      );
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      runOnJS(updateDragPosition)({
        x: event.absoluteX,
        y: event.absoluteY,
      });
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      zIndex.value = 1;

      runOnJS(endDrag)();
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.symbolButton,
          isSelected && styles.symbolButtonSelected,
          isUsed && styles.symbolButtonUsed,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.symbolText,
            isNumberTheme && styles.numberText,
            isSelected && styles.symbolTextSelected,
            isUsed && styles.symbolTextUsed,
          ]}
        >
          {symbol}
        </Text>
        {isUsed && <View style={styles.strikethrough} />}
      </Animated.View>
    </GestureDetector>
  );
}

// ============================================
// CLEAR BUTTON
// ============================================

interface ClearButtonProps {
  onPress: () => void;
}

function ClearButton({ onPress }: ClearButtonProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.symbolButton, styles.clearButton, animatedStyle]}>
        <Text style={styles.clearText}>{Icons.crossMark}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  symbolsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  symbolButton: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ui.border,
    ...shadows.sm,
  },
  symbolButtonSelected: {
    backgroundColor: colors.primary.light + '40',
    borderColor: colors.primary.main,
    borderWidth: 3,
  },
  clearButton: {
    backgroundColor: colors.feedback.warningLight,
    borderColor: colors.secondary.main,
  },
  symbolText: {
    fontSize: 32,
    textAlign: 'center',
  },
  numberText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  symbolTextSelected: {
    transform: [{ scale: 1.1 }],
  },
  clearText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary.dark,
  },
  symbolButtonUsed: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.ui.border,
    opacity: 0.6,
  },
  symbolTextUsed: {
    opacity: 0.4,
  },
  strikethrough: {
    position: 'absolute',
    width: '80%',
    height: 3,
    backgroundColor: colors.feedback.error,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
});
