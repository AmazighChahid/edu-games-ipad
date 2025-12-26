/**
 * ShapeRenderer - Generic shape renderer using react-native-svg
 * Renders any shape type with proper styling and transformations
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import {
  ShapeConfig,
  ShapeType,
  ShapeColor,
  ShapeSize,
  RotationAngle,
  FillStyle,
  ShapeRendererProps,
} from '../../types';
import { SHAPE_COLORS, SHAPE_METADATA, getPatternForColor } from '../../data';
import { renderBasicShape } from './BasicShapes';
import { renderForestShape } from './ForestShapes';
import { renderSpaceShape } from './SpaceShapes';
import { renderCastleShape } from './CastleShapes';
import { renderArtShape } from './ArtShapes';

const AnimatedView = Animated.createAnimatedComponent(View);

// ============================================================================
// SIZE MAPPING
// ============================================================================

const SIZE_SCALE: Record<ShapeSize, number> = {
  small: 0.6,
  medium: 0.8,
  large: 1.0,
};

// ============================================================================
// SHAPE RENDERER
// ============================================================================

function ShapeRendererComponent({
  config,
  size = 80,
  animated = false,
  onPress,
  testID,
}: ShapeRendererProps) {
  const metadata = SHAPE_METADATA[config.type];
  const colorHex = SHAPE_COLORS[config.color];
  const sizeScale = SIZE_SCALE[config.size];
  const actualSize = size * sizeScale;
  const viewBox = metadata.viewBox;

  // Animation values
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Determine which renderer to use based on category
  const renderShape = () => {
    const shapeProps = {
      type: config.type,
      color: colorHex,
      fill: config.fill,
      size: viewBox,
      rotation: config.rotation,
      strokeWidth: config.fill === 'outline' ? 4 : 0,
      count: config.count || 1,
      pattern: config.pattern,
    };

    switch (metadata.category) {
      case 'basic':
        return renderBasicShape(shapeProps);
      case 'forest':
        return renderForestShape(shapeProps);
      case 'space':
        return renderSpaceShape(shapeProps);
      case 'castle':
        return renderCastleShape(shapeProps);
      case 'art':
        return renderArtShape(shapeProps);
      case 'mystery':
        // Mystery shapes combine other shapes - for now, use basic
        return renderBasicShape(shapeProps);
      default:
        return renderBasicShape(shapeProps);
    }
  };

  const containerStyle = animated
    ? [styles.container, { width: size, height: size }]
    : [styles.container, { width: size, height: size }];

  const content = (
    <Svg
      width={actualSize}
      height={actualSize}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
    >
      <G
        transform={
          config.rotation !== 0
            ? `rotate(${config.rotation}, ${viewBox / 2}, ${viewBox / 2})`
            : undefined
        }
      >
        {renderShape()}
      </G>
    </Svg>
  );

  if (animated) {
    return (
      <AnimatedView style={[containerStyle, animatedStyle]} testID={testID}>
        {content}
      </AnimatedView>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      {content}
    </View>
  );
}

export const ShapeRenderer = memo(ShapeRendererComponent);

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
