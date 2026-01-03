/**
 * GlassContainer component
 * Liquid glass effect wrapper with blur and transparency
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { borderRadius, spacing, shadows } from '../../theme';

type ShadowLevel = 'none' | 'sm' | 'md' | 'lg';

export interface GlassContainerProps {
  children: React.ReactNode;
  /** Blur intensity (0-100). Default: 70 */
  intensity?: number;
  /** Background color with alpha. Default: rgba(255,255,255,0.85) */
  backgroundColor?: string;
  /** Border radius. Default: borderRadius.xl (24) */
  borderRadiusValue?: number;
  /** Padding inside container. Default: spacing[4] (16) */
  padding?: number;
  /** Shadow level. Default: 'md' */
  shadow?: ShadowLevel;
  /** Additional container style */
  style?: ViewStyle;
  /** Disable blur for performance (fallback to solid background) */
  disableBlur?: boolean;
}

export function GlassContainer({
  children,
  intensity = 70,
  backgroundColor = 'rgba(255, 255, 255, 0.85)',
  borderRadiusValue = borderRadius.xl,
  padding = spacing[4],
  shadow = 'md',
  style,
  disableBlur = false,
}: GlassContainerProps) {
  const containerStyle: ViewStyle = {
    borderRadius: borderRadiusValue,
    overflow: 'hidden',
    ...shadows[shadow],
    ...style,
  };

  const contentStyle: ViewStyle = {
    padding,
  };

  // Use BlurView on iOS, fallback on Android for better performance
  const shouldUseBlur = !disableBlur && Platform.OS === 'ios';

  if (shouldUseBlur) {
    return (
      <View style={containerStyle}>
        <BlurView
          intensity={intensity}
          tint="light"
          style={[styles.blurView, { backgroundColor }]}
        >
          <View style={contentStyle}>{children}</View>
        </BlurView>
      </View>
    );
  }

  // Fallback for Android or when blur is disabled
  return (
    <View style={[containerStyle, { backgroundColor }, contentStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
  },
});
