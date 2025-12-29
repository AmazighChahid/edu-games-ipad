import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { theme } from '@/theme';
import { Direction } from '../types';

export interface Instruction {
  id: string;
  direction: Direction;
  executed: boolean;
  current: boolean;
}

interface Props {
  instructions: Instruction[];
  onRemoveInstruction: (id: string) => void;
  onClear: () => void;
  isExecuting: boolean;
  maxInstructions?: number;
}

const DIRECTION_ICONS: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

const DIRECTION_COLORS: Record<Direction, string> = {
  up: '#5B8DEE',    // Bleu
  down: '#68D391',  // Vert
  left: '#E53E3E',  // Rouge
  right: '#F6AD55', // Orange
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const InstructionCard: React.FC<{
  instruction: Instruction;
  index: number;
  onRemove: () => void;
  disabled: boolean;
}> = ({ instruction, index, onRemove, disabled }) => {
  const scale = useSharedValue(instruction.current ? 1.1 : 1);
  const backgroundColor = instruction.executed
    ? 'rgba(104, 211, 145, 0.3)'
    : instruction.current
      ? 'rgba(91, 141, 238, 0.2)'
      : '#FFFFFF';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  React.useEffect(() => {
    if (instruction.current) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.05),
          withSpring(1.1)
        ),
        -1,
        true
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [instruction.current]);

  return (
    <AnimatedPressable
      entering={FadeIn.delay(index * 50)}
      exiting={FadeOut}
      style={[
        styles.instructionCard,
        { backgroundColor },
        instruction.current && styles.currentInstruction,
        instruction.executed && styles.executedInstruction,
        animatedStyle,
      ]}
      onPress={disabled ? undefined : onRemove}
      disabled={disabled}
      accessibilityLabel={`Instruction ${index + 1}: ${instruction.direction}`}
    >
      <Text
        style={[
          styles.instructionIcon,
          { color: DIRECTION_COLORS[instruction.direction] },
          instruction.executed && styles.executedText,
        ]}
      >
        {DIRECTION_ICONS[instruction.direction]}
      </Text>
      {!disabled && !instruction.executed && (
        <View style={styles.removeButton}>
          <Text style={styles.removeButtonText}>×</Text>
        </View>
      )}
    </AnimatedPressable>
  );
};

export const InstructionQueue: React.FC<Props> = ({
  instructions,
  onRemoveInstruction,
  onClear,
  isExecuting,
  maxInstructions = 20,
}) => {
  const remainingSlots = maxInstructions - instructions.length;

  return (
    <View style={styles.container}>
      {/* Header avec titre et compteur */}
      <View style={styles.header}>
        <Text style={styles.title}>Programme</Text>
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {instructions.length}/{maxInstructions}
          </Text>
        </View>
        {instructions.length > 0 && !isExecuting && (
          <Pressable style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearButtonText}>Effacer</Text>
          </Pressable>
        )}
      </View>

      {/* Liste des instructions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.instructionsList}
      >
        {instructions.map((instruction, index) => (
          <InstructionCard
            key={instruction.id}
            instruction={instruction}
            index={index}
            onRemove={() => onRemoveInstruction(instruction.id)}
            disabled={isExecuting}
          />
        ))}

        {/* Emplacements vides */}
        {Array.from({ length: Math.min(remainingSlots, 5) }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.emptySlot}>
            <Text style={styles.emptySlotText}>{instructions.length + index + 1}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Message d'aide */}
      {instructions.length === 0 && (
        <Text style={styles.helpText}>
          Appuie sur les flèches pour créer ton programme !
        </Text>
      )}
    </View>
  );
};

// Taille compacte pour les cartes d'instruction
const CARD_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[2],
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
    gap: theme.spacing[2],
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  counter: {
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
    paddingHorizontal: theme.spacing[1],
    paddingVertical: 1,
    borderRadius: theme.borderRadius.sm,
  },
  counterText: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.primary,
  },
  clearButton: {
    marginLeft: 'auto',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    borderRadius: theme.borderRadius.sm,
    minHeight: 32,
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fontFamily.bold,
    color: theme.colors.error,
  },
  instructionsList: {
    flexDirection: 'row',
    gap: theme.spacing[1],
    paddingVertical: 2,
    minHeight: CARD_SIZE + 8,
  },
  instructionCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.3)',
    position: 'relative',
  },
  currentInstruction: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
    ...theme.shadows.md,
  },
  executedInstruction: {
    borderColor: theme.colors.success,
    opacity: 0.7,
  },
  instructionIcon: {
    fontSize: 22,
    fontFamily: theme.fontFamily.bold,
  },
  executedText: {
    opacity: 0.5,
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: theme.colors.background.primary,
    fontSize: 14,
    fontFamily: theme.fontFamily.bold,
    lineHeight: 16,
  },
  emptySlot: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.2)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(91, 141, 238, 0.05)',
  },
  emptySlotText: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fontFamily.bold,
    color: 'rgba(91, 141, 238, 0.4)',
  },
  helpText: {
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});
