/**
 * StoryIllustration Component
 *
 * Affiche l'illustration correspondante au thème de l'histoire
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { spacing, borderRadius, shadows, fontFamily } from '../../../theme';
import type { StoryTheme } from '../types';

import {
  ForestScene,
  AdventureScene,
  MagicScene,
  FamilyScene,
  FriendshipScene,
} from '../assets/illustrations';

interface StoryIllustrationProps {
  theme: StoryTheme;
  title?: string;
  width?: number;
  height?: number;
  animated?: boolean;
  showTitle?: boolean;
}

export function StoryIllustration({
  theme,
  title,
  width = 300,
  height = 225,
  animated = true,
  showTitle = true,
}: StoryIllustrationProps) {
  // Get the appropriate scene component based on theme
  const renderScene = () => {
    const sceneProps = { width, height, animated };

    switch (theme) {
      case 'nature':
        return <ForestScene {...sceneProps} />;
      case 'adventure':
        return <AdventureScene {...sceneProps} />;
      case 'magic':
        return <MagicScene {...sceneProps} />;
      case 'family':
        return <FamilyScene {...sceneProps} />;
      case 'friendship':
        return <FriendshipScene {...sceneProps} />;
      case 'discovery':
        // Use adventure scene for discovery as fallback
        return <AdventureScene {...sceneProps} />;
      default:
        // Default to forest scene
        return <ForestScene {...sceneProps} />;
    }
  };

  const Container = animated ? Animated.View : View;
  const containerProps = animated ? { entering: FadeIn.duration(500) } : {};

  return (
    <Container
      style={[styles.container, { width, height: showTitle && title ? height + 50 : height }]}
      {...containerProps}
    >
      <View style={[styles.illustrationWrapper, { width, height }]}>
        {renderScene()}
      </View>

      {showTitle && title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  illustrationWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...shadows.lg,
  },
  titleContainer: {
    marginTop: spacing[3],
    paddingHorizontal: spacing[2],
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamily.displayBold,
    color: '#2D3748',
    textAlign: 'center',
  },
});

export default StoryIllustration;
