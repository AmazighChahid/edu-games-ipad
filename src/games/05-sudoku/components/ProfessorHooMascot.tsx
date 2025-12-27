/**
 * Professor Hoo Mascot Component
 * The wise owl professor that guides players through Sudoku
 */

import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface ProfessorHooMascotProps {
  message: string;
  type?: 'intro' | 'hint' | 'encourage' | 'victory';
}

export function ProfessorHooMascot({ message, type = 'intro' }: ProfessorHooMascotProps) {
  const bobOffset = useSharedValue(0);
  const messageScale = useSharedValue(0);

  useEffect(() => {
    // Gentle bobbing animation
    bobOffset.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      false
    );

    // Message entrance animation
    messageScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, []);

  const owlStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobOffset.value }],
  }));

  const messageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: messageScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      {/* Professor Hoo Owl */}
      <Animated.View style={[styles.owlContainer, owlStyle]}>
        <View style={styles.owlBody}>
          {/* Owl Eyes */}
          <View style={[styles.owlEye, styles.owlEyeLeft]}>
            <View style={styles.owlPupil} />
          </View>
          <View style={[styles.owlEye, styles.owlEyeRight]}>
            <View style={styles.owlPupil} />
          </View>

          {/* Owl Beak */}
          <View style={styles.owlBeak} />

          {/* Professor Glasses */}
          <View style={styles.owlGlasses}>
            <View style={styles.glassesFrame} />
            <View style={styles.glassesBridge} />
          </View>
        </View>
      </Animated.View>

      {/* Speech Bubble */}
      <Animated.View style={[styles.speechBubble, messageStyle]}>
        <View style={styles.bubbleArrow} />
        <Text style={styles.speechText}>
          <Text style={styles.professorName}>Professeur Hoo : </Text>
          {message}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  owlContainer: {
    width: 70,
    height: 80,
  },
  owlBody: {
    width: 70,
    height: 80,
    backgroundColor: '#8B6914',
    borderRadius: 35,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    // Add shadow for depth
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  owlEye: {
    position: 'absolute',
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    top: 18,
    // Shadow for eye depth
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  owlEyeLeft: {
    left: 10,
  },
  owlEyeRight: {
    right: 10,
  },
  owlPupil: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#2C1810',
    borderRadius: 5,
    top: 6,
    left: 6,
  },
  owlBeak: {
    position: 'absolute',
    top: 38,
    left: 27,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFB347',
  },
  owlGlasses: {
    position: 'absolute',
    top: 15,
    left: 7.5,
    width: 55,
    height: 20,
  },
  glassesFrame: {
    width: 55,
    height: 20,
    borderWidth: 3,
    borderColor: '#4A4A4A',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  glassesBridge: {
    position: 'absolute',
    top: 6,
    left: 23.5,
    width: 8,
    height: 3,
    backgroundColor: '#4A4A4A',
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    paddingLeft: 18,
    maxWidth: 280,
    position: 'relative',
    // Shadow for bubble depth
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  bubbleArrow: {
    position: 'absolute',
    left: -10,
    top: 20,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#FFFFFF',
  },
  speechText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#4A4A4A',
  },
  professorName: {
    fontWeight: '700',
    color: '#5B8DEE',
  },
});
