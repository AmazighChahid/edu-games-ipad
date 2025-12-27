/**
 * Balance Intro Screen
 * Onboarding flow for first-time players
 * Features: Animated introduction, tutorial steps, Dr. Hibou narrative
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  ZoomIn,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { DrHibou } from '../components/DrHibou';
import { BalanceScale } from '../components/BalanceScale';
import { createInitialState, addObjectToPlate } from '../logic/balanceEngine';
import { createObject } from '../data/objects';

// ============================================
// TYPES
// ============================================

interface IntroStep {
  id: number;
  mascotMessage: string;
  showBalance: boolean;
  balanceDemo?: 'empty' | 'unbalanced' | 'balanced';
  highlightArea?: 'left' | 'right' | 'both' | 'none';
  action?: 'tap' | 'drag' | 'none';
  buttonText: string;
}

// ============================================
// CONSTANTS
// ============================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INTRO_STEPS: IntroStep[] = [
  {
    id: 1,
    mascotMessage: 'Bienvenue dans mon laboratoire !\n\nJe suis Dr. Hibou, et j\'adore les expériences !',
    showBalance: false,
    buttonText: 'Salut Dr. Hibou !',
  },
  {
    id: 2,
    mascotMessage: 'Voici ma balance magique !\n\nElle peut mesurer tout ce qu\'on met dessus.',
    showBalance: true,
    balanceDemo: 'empty',
    buttonText: 'Waouh !',
  },
  {
    id: 3,
    mascotMessage: 'Regarde, la balance penche à gauche.\n\nC\'est parce que le côté gauche est plus lourd !',
    showBalance: true,
    balanceDemo: 'unbalanced',
    highlightArea: 'left',
    buttonText: 'Je comprends !',
  },
  {
    id: 4,
    mascotMessage: 'Ton défi : faire en sorte qu\'elle soit bien droite, parfaitement équilibrée !',
    showBalance: true,
    balanceDemo: 'balanced',
    highlightArea: 'both',
    buttonText: 'Compris !',
  },
  {
    id: 5,
    mascotMessage: 'Quand les deux côtés pèsent pareil, elle reste droite.\n\nMagie de la science ! ✨',
    showBalance: true,
    balanceDemo: 'balanced',
    buttonText: '🔬 Je suis prêt !',
  },
];

// ============================================
// DEMO BALANCE STATES
// ============================================

function createDemoBalance(type: 'empty' | 'unbalanced' | 'balanced') {
  let state = createInitialState();

  if (type === 'unbalanced') {
    const apple = createObject('apple', 'demo_apple_1');
    const banana = createObject('banana', 'demo_banana_1');
    state = addObjectToPlate(state, apple, 'left');
    state = addObjectToPlate(state, banana, 'left');
  } else if (type === 'balanced') {
    const apple1 = createObject('apple', 'demo_apple_1');
    const apple2 = createObject('apple', 'demo_apple_2');
    state = addObjectToPlate(state, apple1, 'left');
    state = addObjectToPlate(state, apple2, 'right');
  }

  return state;
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            index + 1 === currentStep && styles.stepDotActive,
            index + 1 < currentStep && styles.stepDotCompleted,
          ]}
        />
      ))}
    </View>
  );
}

interface SkipButtonProps {
  onPress: () => void;
}

function SkipButton({ onPress }: SkipButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.skipButton}>
      <Text style={styles.skipButtonText}>Passer</Text>
    </TouchableOpacity>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BalanceIntroScreen() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = INTRO_STEPS[currentStepIndex];

  // Animation values
  const buttonScale = useSharedValue(1);

  // Handle next step
  const handleNext = useCallback(() => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1)
    );

    if (currentStepIndex < INTRO_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Finish intro
      handleComplete();
    }
  }, [currentStepIndex]);

  // Handle skip/complete
  const handleComplete = useCallback(() => {
    // Navigate to game
    router.replace('/games/balance');
  }, [router]);

  // Button animation
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Get demo balance state
  const demoBalance = currentStep.balanceDemo
    ? createDemoBalance(currentStep.balanceDemo)
    : createInitialState();

  // Render plate content for demo
  const renderDemoPlateContent = (side: 'left' | 'right') => {
    const plate = side === 'left' ? demoBalance.leftPlate : demoBalance.rightPlate;

    return (
      <View style={styles.demoPlateContent}>
        {plate.objects.map((obj) => (
          <Animated.Text
            key={obj.id}
            entering={ZoomIn.delay(300)}
            style={styles.demoObjectEmoji}
          >
            {obj.emoji}
          </Animated.Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.gradientStart, colors.background.gradientEnd]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Skip button */}
          <View style={styles.header}>
            <SkipButton onPress={handleComplete} />
          </View>

          {/* Step indicator */}
          <StepIndicator
            currentStep={currentStepIndex + 1}
            totalSteps={INTRO_STEPS.length}
          />

          {/* Main content */}
          <View style={styles.content}>
            {/* Dr. Hibou mascot */}
            <Animated.View
              key={`mascot-${currentStep.id}`}
              entering={SlideInRight.springify()}
              style={styles.mascotSection}
            >
              <DrHibou
                mood={currentStep.id === INTRO_STEPS.length ? 'excited' : 'curious'}
                message={currentStep.mascotMessage}
                size="large"
                position="center"
                showBubble={true}
              />
            </Animated.View>

            {/* Balance demo */}
            {currentStep.showBalance && (
              <Animated.View
                entering={FadeIn.delay(200)}
                exiting={FadeOut}
                style={styles.balanceSection}
              >
                <BalanceScale
                  balanceState={demoBalance}
                  leftPlateContent={renderDemoPlateContent('left')}
                  rightPlateContent={renderDemoPlateContent('right')}
                  showWeightIndicators={false}
                />

                {/* Highlight indicator */}
                {currentStep.highlightArea && currentStep.highlightArea !== 'none' && (
                  <Animated.View
                    entering={FadeIn.delay(500)}
                    style={[
                      styles.highlightOverlay,
                      currentStep.highlightArea === 'left' && styles.highlightLeft,
                      currentStep.highlightArea === 'right' && styles.highlightRight,
                      currentStep.highlightArea === 'both' && styles.highlightBoth,
                    ]}
                  />
                )}
              </Animated.View>
            )}

            {/* Empty space when no balance */}
            {!currentStep.showBalance && (
              <View style={styles.emptySpace}>
                <Animated.Text
                  entering={ZoomIn.delay(300)}
                  style={styles.welcomeEmoji}
                >
                  ⚖️
                </Animated.Text>
              </View>
            )}
          </View>

          {/* Next button */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
              <Animated.View style={[styles.nextButton, buttonAnimatedStyle]}>
                <Text style={styles.nextButtonText}>{currentStep.buttonText}</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  skipButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },

  // Step indicator
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.ui.disabled,
  },
  stepDotActive: {
    backgroundColor: colors.primary.main,
    width: 24,
  },
  stepDotCompleted: {
    backgroundColor: colors.feedback.success,
  },

  // Content
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  balanceSection: {
    alignItems: 'center',
    height: 350,
    position: 'relative',
  },
  demoPlateContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  demoObjectEmoji: {
    fontSize: 28,
  },
  emptySpace: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeEmoji: {
    fontSize: 100,
  },

  // Highlight overlay
  highlightOverlay: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: colors.secondary.main,
    borderRadius: borderRadius.large,
    borderStyle: 'dashed',
  },
  highlightLeft: {
    left: 20,
    top: 150,
    width: 150,
    height: 150,
  },
  highlightRight: {
    right: 20,
    top: 150,
    width: 150,
    height: 150,
  },
  highlightBoth: {
    left: '10%',
    right: '10%',
    top: 100,
    bottom: 50,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  nextButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.large,
    alignItems: 'center',
    ...shadows.medium,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.inverse,
  },
});

export default BalanceIntroScreen;
