/**
 * WoodenBase component
 * Enhanced wooden platform with 3D effects and wood grain texture
 * Child-friendly design for 6-10 year olds
 */

import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface WoodenBaseProps {
  width: number;
  pegCount?: number;
  pegHeight?: number;
  highlightedPeg?: number | null;
  platformHeight?: number;
}

// Rich wood color palette
const WOOD_PALETTE = {
  // Top surface (lighter)
  surface: ['#E8D4B8', '#D4B896', '#C4A574'] as const,
  // Front face (darker for 3D depth)
  front: ['#B8956A', '#A07850', '#8B6B45'] as const,
  // Pole colors
  pole: {
    light: '#C9A66B',
    main: '#A67C52',
    dark: '#8B5E3C',
  },
  // Effects
  shadow: 'rgba(139, 107, 69, 0.35)',
  grain: 'rgba(255, 255, 255, 0.12)',
  bevel: 'rgba(255, 255, 255, 0.25)',
  highlight: '#4ADE80',
};

export function WoodenBase({
  width,
  pegCount = 3,
  pegHeight = 180,
  highlightedPeg = null,
  platformHeight = 60,
}: WoodenBaseProps) {
  const pegSpacing = width / (pegCount + 1);
  const poleWidth = 14;
  const topHeight = platformHeight * 0.6;
  const frontHeight = platformHeight * 0.4;

  return (
    <View style={[styles.container, { width }]}>
      {/* Ground shadow */}
      <View style={[styles.groundShadow, { width: width * 0.95 }]} />

      {/* Platform container */}
      <View style={styles.platformWrapper}>
        {/* Top surface with wood grain */}
        <LinearGradient
          colors={[...WOOD_PALETTE.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.topSurface, { height: topHeight }]}
        >
          {/* Wood grain lines */}
          <View style={styles.grainContainer}>
            <View style={[styles.grainLine, { top: '20%', width: '70%', left: '15%' }]} />
            <View style={[styles.grainLine, { top: '45%', width: '50%', left: '25%' }]} />
            <View style={[styles.grainLine, { top: '70%', width: '60%', left: '20%' }]} />
          </View>

          {/* Top bevel highlight */}
          <View style={styles.bevelTop} />
        </LinearGradient>

        {/* Front face (3D depth) */}
        <LinearGradient
          colors={[...WOOD_PALETTE.front]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.frontFace, { height: frontHeight }]}
        >
          {/* Front wood grain */}
          <View style={[styles.frontGrain, { top: '30%' }]} />
          <View style={[styles.frontGrain, { top: '60%', width: '40%' }]} />
        </LinearGradient>
      </View>

      {/* Poles */}
      {Array.from({ length: pegCount }, (_, i) => {
        const isHighlighted = highlightedPeg === i;
        const poleX = pegSpacing * (i + 1) - poleWidth / 2;

        return (
          <AnimatedPole
            key={i}
            x={poleX}
            width={poleWidth}
            height={pegHeight}
            isHighlighted={isHighlighted}
            bottomOffset={topHeight}
          />
        );
      })}
    </View>
  );
}

// Animated pole component with highlight effect
interface AnimatedPoleProps {
  x: number;
  width: number;
  height: number;
  isHighlighted: boolean;
  bottomOffset: number;
}

function AnimatedPole({ x, width, height, isHighlighted, bottomOffset }: AnimatedPoleProps) {
  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isHighlighted ? 0.6 : 0, { damping: 20 }),
    transform: [{ scale: withSpring(isHighlighted ? 1.1 : 1, { damping: 20 }) }],
  }));

  return (
    <View style={[styles.poleContainer, { left: x, bottom: bottomOffset }]}>
      {/* Glow effect when highlighted */}
      <Animated.View
        style={[
          styles.poleGlow,
          { width: width + 16, height: height + 8 },
          animatedGlowStyle,
        ]}
      />

      {/* Main pole */}
      <LinearGradient
        colors={[WOOD_PALETTE.pole.light, WOOD_PALETTE.pole.main, WOOD_PALETTE.pole.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.pole, { width, height }]}
      >
        {/* Pole highlight */}
        <View style={styles.poleHighlight} />
      </LinearGradient>

      {/* Rounded pole top */}
      <View style={[styles.poleTop, { width: width + 4 }]}>
        <LinearGradient
          colors={[WOOD_PALETTE.pole.light, WOOD_PALETTE.pole.main]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.poleTopGradient}
        />
      </View>

      {/* Pole base (where it meets platform) */}
      <View style={[styles.poleBase, { width: width + 6 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  groundShadow: {
    position: 'absolute',
    bottom: -8,
    height: 16,
    backgroundColor: WOOD_PALETTE.shadow,
    borderRadius: 50,
    opacity: 0.5,
  },
  platformWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 12,
    shadowColor: '#5C4033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  topSurface: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  grainContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  grainLine: {
    position: 'absolute',
    height: 4,
    backgroundColor: WOOD_PALETTE.grain,
    borderRadius: 2,
  },
  bevelTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: WOOD_PALETTE.bevel,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  frontFace: {
    width: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  frontGrain: {
    position: 'absolute',
    left: '30%',
    width: '30%',
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 2,
  },
  poleContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  poleGlow: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: WOOD_PALETTE.highlight,
    borderRadius: 10,
    zIndex: -1,
  },
  pole: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    overflow: 'hidden',
  },
  poleHighlight: {
    position: 'absolute',
    left: 2,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  poleTop: {
    position: 'absolute',
    top: -4,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  poleTopGradient: {
    flex: 1,
    borderRadius: 4,
  },
  poleBase: {
    position: 'absolute',
    bottom: -3,
    height: 6,
    backgroundColor: 'rgba(139, 94, 60, 0.4)',
    borderRadius: 3,
  },
});
