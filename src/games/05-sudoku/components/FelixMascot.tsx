/**
 * Félix le Renard - Mascot Component
 * Le renard sage et malin qui guide les joueurs dans le Sudoku
 * Remplace le Hibou selon les spécifications CLAUDE.md
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

interface FelixMascotProps {
  message: string;
  type?: 'intro' | 'hint' | 'encourage' | 'victory';
}

export function FelixMascot({ message, type = 'intro' }: FelixMascotProps) {
  const bobOffset = useSharedValue(0);
  const messageScale = useSharedValue(0);
  const tailWag = useSharedValue(0);

  useEffect(() => {
    // Gentle bobbing animation
    bobOffset.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1,
      false
    );

    // Tail wagging animation
    tailWag.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 400 }),
        withTiming(8, { duration: 400 })
      ),
      -1,
      true
    );

    // Message entrance animation
    messageScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, []);

  const foxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobOffset.value }],
  }));

  const tailStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tailWag.value}deg` }],
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
      {/* Félix le Renard */}
      <Animated.View style={[styles.foxContainer, foxStyle]}>
        <View style={styles.foxBody}>
          {/* Fox Head */}
          <View style={styles.foxHead}>
            {/* Ears */}
            <View style={[styles.foxEar, styles.foxEarLeft]}>
              <View style={styles.foxEarInner} />
            </View>
            <View style={[styles.foxEar, styles.foxEarRight]}>
              <View style={styles.foxEarInner} />
            </View>

            {/* Face (White) */}
            <View style={styles.foxFace}>
              {/* Eyes */}
              <View style={[styles.foxEye, styles.foxEyeLeft]}>
                <View style={styles.foxPupil} />
                <View style={styles.foxEyeShine} />
              </View>
              <View style={[styles.foxEye, styles.foxEyeRight]}>
                <View style={styles.foxPupil} />
                <View style={styles.foxEyeShine} />
              </View>

              {/* Nose */}
              <View style={styles.foxNose} />

              {/* Smile */}
              <View style={styles.foxSmile} />
            </View>

            {/* Cheeks */}
            <View style={[styles.foxCheek, styles.foxCheekLeft]} />
            <View style={[styles.foxCheek, styles.foxCheekRight]} />
          </View>

          {/* Tail */}
          <Animated.View style={[styles.foxTail, tailStyle]}>
            <View style={styles.foxTailTip} />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Speech Bubble */}
      <Animated.View style={[styles.speechBubble, messageStyle]}>
        <View style={styles.bubbleArrow} />
        <Text style={styles.speechText}>
          <Text style={styles.mascotName}>Félix : </Text>
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
  foxContainer: {
    width: 75,
    height: 85,
  },
  foxBody: {
    width: 75,
    height: 85,
    position: 'relative',
  },
  foxHead: {
    width: 65,
    height: 60,
    backgroundColor: '#E67E22', // Orange renard
    borderRadius: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: 'absolute',
    top: 0,
    left: 5,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  foxEar: {
    position: 'absolute',
    width: 18,
    height: 24,
    backgroundColor: '#E67E22',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    top: -12,
  },
  foxEarLeft: {
    left: 8,
    transform: [{ rotate: '-15deg' }],
  },
  foxEarRight: {
    right: 8,
    transform: [{ rotate: '15deg' }],
  },
  foxEarInner: {
    position: 'absolute',
    width: 10,
    height: 14,
    backgroundColor: '#FADBD8', // Rose pâle intérieur oreille
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    top: 4,
    left: 4,
  },
  foxFace: {
    position: 'absolute',
    width: 40,
    height: 35,
    backgroundColor: '#FDFEFE', // Blanc crème
    borderRadius: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    bottom: 5,
    left: 12.5,
  },
  foxEye: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    top: 8,
    borderWidth: 1,
    borderColor: '#E67E22',
  },
  foxEyeLeft: {
    left: 4,
  },
  foxEyeRight: {
    right: 4,
  },
  foxPupil: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#2C3E50',
    borderRadius: 4,
    top: 2,
    left: 2,
  },
  foxEyeShine: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    top: 2,
    left: 2,
  },
  foxNose: {
    position: 'absolute',
    width: 10,
    height: 8,
    backgroundColor: '#2C3E50',
    borderRadius: 5,
    bottom: 12,
    left: 15,
  },
  foxSmile: {
    position: 'absolute',
    width: 16,
    height: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#2C3E50',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    bottom: 4,
    left: 12,
    backgroundColor: 'transparent',
  },
  foxCheek: {
    position: 'absolute',
    width: 12,
    height: 10,
    backgroundColor: '#FADBD8',
    borderRadius: 6,
    bottom: 15,
  },
  foxCheekLeft: {
    left: 2,
  },
  foxCheekRight: {
    right: 2,
  },
  foxTail: {
    position: 'absolute',
    width: 25,
    height: 40,
    backgroundColor: '#E67E22',
    borderRadius: 12,
    bottom: -5,
    right: -8,
    transformOrigin: 'top center',
  },
  foxTailTip: {
    position: 'absolute',
    width: 15,
    height: 20,
    backgroundColor: '#FDFEFE',
    borderRadius: 8,
    bottom: 0,
    left: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  mascotName: {
    fontWeight: '700',
    color: '#E67E22', // Orange renard
  },
});
