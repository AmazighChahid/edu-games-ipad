/**
 * ScreenBackground - Backgrounds standardisés pour toutes les pages
 *
 * Variants:
 * - 'playful': Gradient animé + décorations (Home, intro jeux)
 * - 'neutral': Fond uni crème apaisant (pages simples)
 * - 'parent': Fond sobre pour espace parents
 * - 'transparent': Transparent (pour layouts custom)
 *
 * Caractéristiques:
 * - Cohérence visuelle
 * - Adapté à la cible (enfants vs parents)
 * - Performance optimisée
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

// Décorations (optionnel, uniquement pour variant playful)
import { AnimatedSun } from '../decorations/AnimatedSun';
import { AnimatedCloud } from '../decorations/AnimatedCloud';
import { AnimatedTree } from '../decorations/AnimatedTree';
import { AnimatedButterfly } from '../decorations/AnimatedButterfly';
import { FloatingFlowers } from '../decorations/FloatingFlowers';
import { Hills } from '../decorations/Hills';

export type ScreenBackgroundVariant = 'playful' | 'neutral' | 'parent' | 'transparent';

export interface ScreenBackgroundProps {
  variant?: ScreenBackgroundVariant;
  children: React.ReactNode;
  showDecorations?: boolean; // Pour variant playful
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  variant = 'neutral',
  children,
  showDecorations = true,
}) => {
  // PLAYFUL variant (Home-like)
  if (variant === 'playful') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[
            theme.colors.home.gradients.skyTop,
            theme.colors.home.gradients.skyMid1,
            theme.colors.home.gradients.skyMid2,
            theme.colors.home.gradients.grassBottom,
          ]}
          locations={[0, 0.3, 0.6, 1]}
          style={styles.gradient}
        >
          {showDecorations && (
            <>
              {/* Decorative elements - z-index 1-5 */}
              <AnimatedSun />
              <AnimatedCloud position="left" delay={0} />
              <AnimatedCloud position="center" delay={2000} />
              <AnimatedCloud position="right" delay={4000} />
              <AnimatedButterfly position={1} />
              <AnimatedButterfly position={2} />
              <FloatingFlowers position="left" />
              <FloatingFlowers position="right" />

              {/* Hills - z-index 2 */}
              <Hills />

              {/* Trees - z-index 5 */}
              <AnimatedTree position={1} />
              <AnimatedTree position={2} />
              <AnimatedTree position={3} />
              <AnimatedTree position={4} />
            </>
          )}

          {/* Content - z-index 10 */}
          <View style={styles.content}>{children}</View>
        </LinearGradient>
      </View>
    );
  }

  // NEUTRAL variant (crème apaisant)
  if (variant === 'neutral') {
    return (
      <View style={[styles.container, styles.neutralBackground]}>
        {children}
      </View>
    );
  }

  // PARENT variant (sobre, adulte)
  if (variant === 'parent') {
    return (
      <View style={[styles.container, styles.parentBackground]}>
        {children}
      </View>
    );
  }

  // TRANSPARENT variant
  if (variant === 'transparent') {
    return <View style={styles.container}>{children}</View>;
  }

  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  neutralBackground: {
    backgroundColor: theme.colors.background.primary,
  },
  parentBackground: {
    backgroundColor: theme.colors.background.primary,
  },
});
