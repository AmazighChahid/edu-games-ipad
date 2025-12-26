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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  counter: {
    backgroundColor: 'rgba(91, 141, 238, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B8DEE',
  },
  clearButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E53E3E',
  },
  instructionsList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
    minHeight: 56,
  },
  instructionCard: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.3)',
    position: 'relative',
  },
  currentInstruction: {
    borderColor: '#5B8DEE',
    borderWidth: 3,
    shadowColor: '#5B8DEE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  executedInstruction: {
    borderColor: '#68D391',
    opacity: 0.7,
  },
  instructionIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  executedText: {
    opacity: 0.5,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  emptySlot: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(91, 141, 238, 0.2)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(91, 141, 238, 0.05)',
  },
  emptySlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(91, 141, 238, 0.4)',
  },
  helpText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
});
