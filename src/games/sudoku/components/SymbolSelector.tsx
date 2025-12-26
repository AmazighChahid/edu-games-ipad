/**
 * SymbolSelector Component
 * Bottom panel for selecting symbols to place in the grid
 */

import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store';
import type { SudokuValue } from '../types';

interface SymbolSelectorProps {
  symbols: SudokuValue[];
  onSymbolSelect: (symbol: SudokuValue) => void;
  selectedSymbol?: SudokuValue;
  onClear?: () => void;
  theme: string;
  usedSymbols?: Set<SudokuValue>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
            <SymbolButton
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
            />
          );
        })}

        {onClear && (
          <SymbolButton
            symbol="✗"
            isSelected={false}
            onPress={() => {
              if (hapticEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              onClear();
            }}
            theme={theme}
            isClearButton
          />
        )}
      </View>
    </View>
  );
}

interface SymbolButtonProps {
  symbol: SudokuValue;
  isSelected: boolean;
  isUsed?: boolean;
  onPress: () => void;
  theme: string;
  isClearButton?: boolean;
}

function SymbolButton({
  symbol,
  isSelected,
  isUsed = false,
  onPress,
  theme,
  isClearButton = false,
}: SymbolButtonProps) {
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

  const isNumberTheme = theme === 'numbers';

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.symbolButton,
        isSelected && styles.symbolButtonSelected,
        isClearButton && styles.clearButton,
        isUsed && styles.symbolButtonUsed,
        animatedStyle,
      ]}
    >
      <Text
        style={[
          styles.symbolText,
          isNumberTheme && styles.numberText,
          isClearButton && styles.clearText,
          isSelected && styles.symbolTextSelected,
          isUsed && styles.symbolTextUsed,
        ]}
      >
        {symbol}
      </Text>
      {isUsed && (
        <View style={styles.strikethrough} />
      )}
    </AnimatedPressable>
  );
}

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
    // Slightly larger when selected
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
