/**
 * ChoicePanel - Container for answer choices
 * Horizontal scrollable panel with 4-6 choice buttons
 */

import React, { memo, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeInDown,
  SlideInDown,
} from 'react-native-reanimated';

import {
  ShapeConfig,
  WorldTheme,
  ChoiceButtonProps,
} from '../../types';
import { WORLDS } from '../../data';
import { ChoiceButton } from './ChoiceButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// CONSTANTS
// ============================================================================

const BUTTON_SIZE = 100;
const BUTTON_SPACING = 12;
const PANEL_PADDING = 16;

// ============================================================================
// TYPES
// ============================================================================

type ChoiceState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'disabled';

interface ChoicePanelProps {
  choices: ShapeConfig[];
  selectedIndex: number | null;
  correctIndex?: number | null;
  incorrectIndex?: number | null;
  onChoiceSelect: (index: number) => void;
  theme: WorldTheme;
  disabled?: boolean;
  showLabels?: boolean;
}

// ============================================================================
// CHOICE PANEL COMPONENT
// ============================================================================

function ChoicePanelComponent({
  choices,
  selectedIndex,
  correctIndex = null,
  incorrectIndex = null,
  onChoiceSelect,
  theme,
  disabled = false,
  showLabels = false,
}: ChoicePanelProps) {
  const world = WORLDS[theme];
  const scrollViewRef = useRef<ScrollView>(null);

  // Determine button state
  const getButtonState = useCallback(
    (index: number): ChoiceState => {
      if (disabled) return 'disabled';
      if (correctIndex === index) return 'correct';
      if (incorrectIndex === index) return 'incorrect';
      if (selectedIndex === index) return 'selected';
      return 'idle';
    },
    [selectedIndex, correctIndex, incorrectIndex, disabled]
  );

  // Calculate if scrolling is needed
  const totalWidth =
    choices.length * BUTTON_SIZE + (choices.length - 1) * BUTTON_SPACING + PANEL_PADDING * 2;
  const needsScrolling = totalWidth > SCREEN_WIDTH;

  // Handle choice selection
  const handleSelect = useCallback(
    (index: number) => {
      if (!disabled && correctIndex === null) {
        onChoiceSelect(index);
      }
    },
    [disabled, correctIndex, onChoiceSelect]
  );

  const content = (
    <View style={styles.choicesRow}>
      {choices.map((shape, index) => (
        <Animated.View
          key={`choice-${index}`}
          entering={FadeInDown.delay(100 * index).duration(300).springify()}
          style={[
            styles.choiceWrapper,
            index < choices.length - 1 && { marginRight: BUTTON_SPACING },
          ]}
        >
          <ChoiceButton
            shape={shape}
            index={index}
            isSelected={selectedIndex === index}
            state={getButtonState(index)}
            onPress={handleSelect}
            size={BUTTON_SIZE}
          />
          {showLabels && (
            <Text style={styles.choiceLabel}>{index + 1}</Text>
          )}
        </Animated.View>
      ))}
    </View>
  );

  return (
    <Animated.View
      entering={SlideInDown.duration(400).springify()}
      style={styles.container}
    >
      {/* Title */}
      <Text style={[styles.title, { color: world.primaryColor }]}>
        Choisis la bonne réponse
      </Text>

      {/* Choices */}
      {needsScrolling ? (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={BUTTON_SIZE + BUTTON_SPACING}
          decelerationRate="fast"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.centeredContent}>{content}</View>
      )}

      {/* Scroll hint (if scrollable) */}
      {needsScrolling && (
        <View style={styles.scrollHintContainer}>
          <View style={[styles.scrollHint, { backgroundColor: world.primaryColor + '30' }]}>
            <Text style={[styles.scrollHintText, { color: world.primaryColor }]}>
              ← Glisse pour voir plus →
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

export const ChoicePanel = memo(ChoicePanelComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    paddingVertical: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: PANEL_PADDING,
  },
  centeredContent: {
    alignItems: 'center',
    paddingHorizontal: PANEL_PADDING,
  },
  choicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceWrapper: {
    alignItems: 'center',
  },
  choiceLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'Nunito-Medium',
  },
  scrollHintContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  scrollHint: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scrollHintText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Nunito-Medium',
  },
});
