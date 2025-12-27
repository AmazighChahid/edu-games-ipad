/**
 * LibraryBackground Component
 *
 * Fond décoratif représentant une bibliothèque
 * - Étagères avec livres colorés
 * - Fenêtre avec lumière
 * - Particules de poussière optionnelles
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface LibraryBackgroundProps {
  showDustParticles?: boolean;
  dustCount?: number;
}

// Book colors
const BOOK_COLORS = [
  ['#E74C3C', '#C0392B'], // Red
  ['#3498DB', '#2980B9'], // Blue
  ['#2ECC71', '#27AE60'], // Green
  ['#F39C12', '#E67E22'], // Orange
  ['#9B59B6', '#8E44AD'], // Purple
  ['#1ABC9C', '#16A085'], // Teal
  ['#E91E63', '#C2185B'], // Pink
  ['#FF9800', '#F57C00'], // Amber
];

export function LibraryBackground({
  showDustParticles = true,
  dustCount = 8,
}: LibraryBackgroundProps) {
  const { width, height } = useWindowDimensions();

  // Generate dust particles
  const dustParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < dustCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 3000,
        duration: 4000 + Math.random() * 2000,
      });
    }
    return particles;
  }, [width, height, dustCount]);

  // Generate books for shelves
  const books = useMemo(() => {
    const bookList = [];
    const shelfWidth = width;
    let currentX = 10;
    let bookIndex = 0;

    while (currentX < shelfWidth - 20) {
      const bookWidth = 15 + Math.random() * 20;
      const bookHeight = 40 + Math.random() * 25;
      const colors = BOOK_COLORS[bookIndex % BOOK_COLORS.length];

      bookList.push({
        id: bookIndex,
        x: currentX,
        width: bookWidth,
        height: bookHeight,
        colors,
      });

      currentX += bookWidth + 3;
      bookIndex++;
    }

    return bookList;
  }, [width]);

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Wall gradient */}
          <LinearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFF9F0" stopOpacity="1" />
            <Stop offset="1" stopColor="#F5E6D3" stopOpacity="1" />
          </LinearGradient>

          {/* Light beam gradient */}
          <LinearGradient id="lightBeam" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFACD" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#FFFACD" stopOpacity="0" />
          </LinearGradient>

          {/* Wood gradient for shelf */}
          <LinearGradient id="woodGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#8B7355" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#6B5344" stopOpacity="1" />
            <Stop offset="1" stopColor="#5D4537" stopOpacity="1" />
          </LinearGradient>

          {/* Book gradients */}
          {BOOK_COLORS.map((colors, index) => (
            <LinearGradient
              key={`book-gradient-${index}`}
              id={`bookGradient${index}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
              <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
            </LinearGradient>
          ))}
        </Defs>

        {/* Wall background */}
        <Rect x="0" y="0" width={width} height={height} fill="url(#wallGradient)" />

        {/* Window */}
        <G transform={`translate(${width - 150}, 40)`}>
          {/* Window frame */}
          <Rect
            x="0"
            y="0"
            width="120"
            height="100"
            fill="#8B7355"
            rx="4"
          />
          {/* Window glass */}
          <Rect
            x="6"
            y="6"
            width="108"
            height="88"
            fill="#87CEEB"
            rx="2"
          />
          {/* Window cross */}
          <Rect x="57" y="6" width="6" height="88" fill="#8B7355" />
          <Rect x="6" y="46" width="108" height="6" fill="#8B7355" />
          {/* Sun in window */}
          <Circle cx="90" cy="30" r="20" fill="#FFD93D" opacity="0.8" />
        </G>

        {/* Light beam from window */}
        <Path
          d={`M ${width - 30} 140 L ${width - 200} ${height} L ${width} ${height} L ${width} 40 Z`}
          fill="url(#lightBeam)"
        />

        {/* Bottom shelf */}
        <G transform={`translate(0, ${height - 80})`}>
          {/* Shelf board */}
          <Rect
            x="0"
            y="0"
            width={width}
            height="16"
            fill="url(#woodGradient)"
          />
          {/* Shelf shadow */}
          <Rect
            x="0"
            y="16"
            width={width}
            height="4"
            fill="rgba(0,0,0,0.1)"
          />

          {/* Books on shelf */}
          {books.map((book) => (
            <G key={book.id}>
              <Rect
                x={book.x}
                y={-book.height}
                width={book.width}
                height={book.height}
                fill={`url(#bookGradient${book.id % BOOK_COLORS.length})`}
                rx="2"
              />
              {/* Book spine highlight */}
              <Rect
                x={book.x + 2}
                y={-book.height + 5}
                width={2}
                height={book.height - 10}
                fill="rgba(255,255,255,0.2)"
              />
            </G>
          ))}
        </G>

        {/* Side bookshelf decoration (left) */}
        <G transform="translate(0, 150)">
          {/* Vertical shelf board */}
          <Rect x="0" y="0" width="20" height="300" fill="url(#woodGradient)" />
          {/* Small horizontal shelves */}
          {[0, 100, 200].map((y, i) => (
            <G key={i}>
              <Rect x="0" y={y} width="60" height="12" fill="url(#woodGradient)" />
              {/* Mini books */}
              <Rect x="5" y={y - 30} width="10" height="30" fill={BOOK_COLORS[i][0]} rx="1" />
              <Rect x="17" y={y - 25} width="10" height="25" fill={BOOK_COLORS[i + 3][0]} rx="1" />
              <Rect x="29" y={y - 35} width="10" height="35" fill={BOOK_COLORS[i + 1][0]} rx="1" />
              <Rect x="41" y={y - 28} width="10" height="28" fill={BOOK_COLORS[i + 2][0]} rx="1" />
            </G>
          ))}
        </G>
      </Svg>

      {/* Dust particles */}
      {showDustParticles &&
        dustParticles.map((particle) => (
          <DustParticle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            size={particle.size}
            delay={particle.delay}
            duration={particle.duration}
          />
        ))}
    </View>
  );
}

interface DustParticleProps {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function DustParticle({ x, y, size, delay, duration }: DustParticleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.6, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(30, { duration: duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dustParticle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  dustParticle: {
    position: 'absolute',
    backgroundColor: '#FFE4B5',
  },
});

export default LibraryBackground;
