/**
 * ButterflySprite component
 * Composant papillon optimisé avec React.memo pour les performances
 * Utilisé dans le champ de jeu du Chasseur de Papillons
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

import type { Butterfly, ButterflyColor, ButterflySize } from '../types';
import { colors } from '../../../theme';

// ============================================
// TYPES
// ============================================

interface ButterflyComponentProps {
  butterfly: Butterfly;
  onCatch: (id: string) => void;
  hintLevel: number;
}

// ============================================
// CONSTANTS - Utilisation des tokens Design System
// ============================================

const BUTTERFLY_SIZE_MAP: Record<ButterflySize, number> = {
  small: 40,
  medium: 55,
  large: 70,
};

// Couleurs des papillons mappées sur le Design System
// Note: Ces couleurs sont spécifiques au jeu mais suivent la palette
const BUTTERFLY_COLOR_MAP: Record<ButterflyColor, string> = {
  red: colors.feedback.error,      // #EF4444
  blue: colors.primary.main,       // Bleu principal
  yellow: colors.feedback.warning, // #F59E0B
  green: colors.feedback.success,  // #22C55E
  purple: '#9B59B6',               // Violet papillon (thème du jeu)
  orange: '#E67E22',               // Orange vif
  pink: '#FD79A8',                 // Rose doux
};

// ID de gradient partagé pour éviter les recréations
const SHARED_GRADIENT_IDS: Record<ButterflyColor, string> = {
  red: 'wing_gradient_red',
  blue: 'wing_gradient_blue',
  yellow: 'wing_gradient_yellow',
  green: 'wing_gradient_green',
  purple: 'wing_gradient_purple',
  orange: 'wing_gradient_orange',
  pink: 'wing_gradient_pink',
};

// ============================================
// COMPONENT
// ============================================

function ButterflySpritePure({ butterfly, onCatch, hintLevel }: ButterflyComponentProps) {
  const size = BUTTERFLY_SIZE_MAP[butterfly.size];
  const color = BUTTERFLY_COLOR_MAP[butterfly.color] || '#9B59B6';
  const showHint = hintLevel > 0 && butterfly.isTarget;
  const gradientId = SHARED_GRADIENT_IDS[butterfly.color];

  // Memoize le style de position pour éviter les recréations d'objets
  const containerStyle = useMemo(
    () => [
      styles.butterflyContainer,
      {
        left: `${butterfly.x}%`,
        top: `${butterfly.y}%`,
        width: size,
        height: size * 0.8,
        transform: [{ rotate: `${butterfly.rotation}deg` }],
      },
      showHint && styles.butterflyHint,
    ],
    [butterfly.x, butterfly.y, butterfly.rotation, size, showHint]
  );

  // Handler memoizé
  const handlePress = useMemo(
    () => () => onCatch(butterfly.id),
    [onCatch, butterfly.id]
  );

  return (
    <Pressable onPress={handlePress} style={containerStyle}>
      <Svg width={size} height={size * 0.8} viewBox="0 0 50 40">
        <Defs>
          <SvgLinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.7} />
          </SvgLinearGradient>
        </Defs>

        {/* Aile gauche */}
        <Ellipse cx="15" cy="18" rx="14" ry="12" fill={`url(#${gradientId})`} />

        {/* Aile droite */}
        <Ellipse cx="35" cy="18" rx="14" ry="12" fill={`url(#${gradientId})`} />

        {/* Corps */}
        <Ellipse cx="25" cy="20" rx="3" ry="10" fill={colors.text.primary} />

        {/* Antennes */}
        <Path
          d="M 23 12 Q 20 5, 18 3"
          stroke={colors.text.primary}
          strokeWidth="1"
          fill="none"
        />
        <Path
          d="M 27 12 Q 30 5, 32 3"
          stroke={colors.text.primary}
          strokeWidth="1"
          fill="none"
        />

        {/* Motifs selon le pattern */}
        {butterfly.pattern === 'spotted' && (
          <>
            <Circle cx="12" cy="16" r="2" fill="white" opacity={0.8} />
            <Circle cx="38" cy="16" r="2" fill="white" opacity={0.8} />
          </>
        )}
        {butterfly.pattern === 'striped' && (
          <>
            <Path d="M 8 15 L 22 15" stroke="white" strokeWidth="1.5" opacity={0.7} />
            <Path d="M 28 15 L 42 15" stroke="white" strokeWidth="1.5" opacity={0.7} />
          </>
        )}
        {butterfly.pattern === 'hearts' && (
          <>
            <Path
              d="M 12 14 C 10 12, 8 14, 12 18 C 16 14, 14 12, 12 14"
              fill="white"
              opacity={0.7}
            />
            <Path
              d="M 38 14 C 36 12, 34 14, 38 18 C 42 14, 40 12, 38 14"
              fill="white"
              opacity={0.7}
            />
          </>
        )}
        {butterfly.pattern === 'stars' && (
          <>
            <Path
              d="M 12 14 L 13 17 L 16 17 L 14 19 L 15 22 L 12 20 L 9 22 L 10 19 L 8 17 L 11 17 Z"
              fill="white"
              opacity={0.7}
              transform="scale(0.5) translate(12, 20)"
            />
            <Path
              d="M 38 14 L 39 17 L 42 17 L 40 19 L 41 22 L 38 20 L 35 22 L 36 19 L 34 17 L 37 17 Z"
              fill="white"
              opacity={0.7}
              transform="scale(0.5) translate(52, 20)"
            />
          </>
        )}
        {butterfly.pattern === 'gradient' && (
          <>
            <Ellipse cx="12" cy="16" rx="4" ry="3" fill="white" opacity={0.3} />
            <Ellipse cx="38" cy="16" rx="4" ry="3" fill="white" opacity={0.3} />
          </>
        )}
      </Svg>

      {/* Indicateur d'indice */}
      {showHint && (
        <View style={styles.hintStar}>
          <Text style={styles.hintStarText}>⭐</Text>
        </View>
      )}
    </Pressable>
  );
}

// ============================================
// MEMOIZATION
// ============================================

/**
 * Comparateur personnalisé pour React.memo
 * Ne re-render que si les props importantes changent
 */
function arePropsEqual(
  prevProps: ButterflyComponentProps,
  nextProps: ButterflyComponentProps
): boolean {
  const prevButterfly = prevProps.butterfly;
  const nextButterfly = nextProps.butterfly;

  return (
    prevButterfly.id === nextButterfly.id &&
    prevButterfly.x === nextButterfly.x &&
    prevButterfly.y === nextButterfly.y &&
    prevButterfly.rotation === nextButterfly.rotation &&
    prevButterfly.isCaught === nextButterfly.isCaught &&
    prevButterfly.isTarget === nextButterfly.isTarget &&
    prevProps.hintLevel === nextProps.hintLevel &&
    prevProps.onCatch === nextProps.onCatch
  );
}

export const ButterflySprite = React.memo(ButterflySpritePure, arePropsEqual);

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  butterflyContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  butterflyHint: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  hintStar: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  hintStarText: {
    fontSize: 14,
  },
});

export default ButterflySprite;
