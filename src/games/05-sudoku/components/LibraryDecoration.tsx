/**
 * Library Decoration Component
 * Decorative elements for the Sudoku library theme
 * Includes bookshelf, books, plants, clouds, and stars
 */

import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface CloudProps {
  left?: number;
  right?: number;
  top: number;
  width: number;
  delay?: number;
}

function AnimatedCloud({ left, right, top, width, delay = 0 }: CloudProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          left,
          right,
          top,
          width,
          height: width * 0.4,
        },
        animatedStyle,
      ]}
    />
  );
}

interface StarProps {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  delay?: number;
}

function AnimatedStar({ left, right, top, bottom, delay = 0 }: StarProps) {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left,
          right,
          top,
          bottom,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.starText}>
        <View style={styles.starShape} />
      </View>
    </Animated.View>
  );
}

function Book({ color, height }: { color: string; height: number }) {
  return (
    <View
      style={[
        styles.book,
        {
          backgroundColor: color,
          height,
        },
      ]}
    />
  );
}

function PlantPot() {
  return (
    <View style={styles.plant}>
      <View style={styles.plantLeaves}>
        <View style={[styles.leaf, styles.leafLeft]} />
        <View style={[styles.leaf, styles.leafCenter]} />
        <View style={[styles.leaf, styles.leafRight]} />
      </View>
      <View style={styles.plantPot} />
    </View>
  );
}

export function LibraryDecoration() {
  return (
    <View style={styles.container}>
      {/* Clouds */}
      <AnimatedCloud left={50} top={40} width={90} delay={0} />
      <AnimatedCloud right={100} top={70} width={75} delay={2000} />
      <AnimatedCloud left={380} top={30} width={65} delay={4000} />

      {/* Stars */}
      <AnimatedStar left={80} top={120} delay={0} />
      <AnimatedStar right={120} top={180} delay={1000} />
      <AnimatedStar right={250} top={90} delay={2000} />
      <AnimatedStar left={60} bottom={200} delay={500} />
      <AnimatedStar right={80} bottom={250} delay={1500} />

      {/* Bookshelf at bottom */}
      <View style={styles.bookshelf}>
        <View style={styles.bookshelfTop} />
        <View style={styles.bookshelfBody}>
          {/* Left books */}
          <View style={styles.booksLeft}>
            <Book color="#E74C3C" height={70} />
            <Book color="#3498DB" height={60} />
            <Book color="#27AE60" height={75} />
            <Book color="#F39C12" height={55} />
            <Book color="#9B59B6" height={65} />
          </View>

          {/* Right books */}
          <View style={styles.booksRight}>
            <Book color="#27AE60" height={75} />
            <Book color="#E74C3C" height={70} />
            <Book color="#9B59B6" height={65} />
            <Book color="#3498DB" height={60} />
            <Book color="#F39C12" height={55} />
          </View>
        </View>
      </View>

      {/* Plants */}
      <View style={styles.plantLeft}>
        <PlantPot />
      </View>
      <View style={styles.plantRight}>
        <PlantPot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },

  // Clouds
  cloud: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    opacity: 0.7,
  },

  // Stars
  star: {
    position: 'absolute',
  },
  starText: {
    fontSize: 20,
  },
  starShape: {
    width: 20,
    height: 20,
    backgroundColor: '#FFD700',
    transform: [{ rotate: '45deg' }],
  },

  // Bookshelf
  bookshelf: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  bookshelfTop: {
    height: 12,
    backgroundColor: '#A08060',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bookshelfBody: {
    flex: 1,
    backgroundColor: '#8B7355',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  booksLeft: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    paddingBottom: 12,
  },
  booksRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    paddingBottom: 12,
  },
  book: {
    width: 25,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    // Shadow for depth
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)',
  },

  // Plants
  plantLeft: {
    position: 'absolute',
    bottom: 100,
    left: 40,
  },
  plantRight: {
    position: 'absolute',
    bottom: 100,
    right: 40,
  },
  plant: {
    alignItems: 'center',
  },
  plantLeaves: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: -5,
  },
  leaf: {
    width: 20,
    height: 35,
    backgroundColor: '#27AE60',
    borderRadius: 20,
  },
  leafLeft: {
    transform: [{ rotate: '-30deg' }],
  },
  leafCenter: {
    height: 45,
  },
  leafRight: {
    transform: [{ rotate: '30deg' }],
  },
  plantPot: {
    width: 50,
    height: 45,
    backgroundColor: '#D35400',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});
