/**
 * CollectibleCardFlip Component
 * Card flip animation with backface-culling workaround
 * Starts showing back, flips to reveal front after 1200ms delay
 */

import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import type { CollectibleCard } from '../../data/collectibleCards';
import { CardBack } from './CardBack';
import { CardFront } from './CardFront';

interface CollectibleCardFlipProps {
  card: CollectibleCard;
  isNew?: boolean;
}

export function CollectibleCardFlip({ card, isNew }: CollectibleCardFlipProps) {
  const rotateY = useSharedValue(0);

  useEffect(() => {
    // Delay 1200ms, then flip over 1000ms duration
    rotateY.value = withDelay(1200, withTiming(180, { duration: 1000 }));
  }, []);

  // Front face animation (starts hidden, becomes visible)
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 90, 180], [0, 90, 180]);
    const opacityValue = interpolate(rotateY.value, [0, 89, 91, 180], [0, 0, 1, 1]);

    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: opacityValue,
    };
  });

  // Back face animation (starts visible, becomes hidden)
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotateY.value, [0, 90, 180], [180, 90, 0]);
    const opacityValue = interpolate(rotateY.value, [0, 89, 91, 180], [1, 1, 0, 0]);

    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      opacity: opacityValue,
    };
  });

  return (
    <View style={styles.cardContainer}>
      {/* Card Back (initially visible) */}
      <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
        <CardBack />
      </Animated.View>

      {/* Card Front (initially hidden) */}
      <Animated.View style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}>
        <CardFront card={card} isNew={isNew} />
      </Animated.View>
    </View>
  );
}

const CARD_WIDTH = 180;
const CARD_HEIGHT = 250;

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  cardFace: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
