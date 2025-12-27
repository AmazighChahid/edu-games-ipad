/**
 * GameCardV10 - Widget style Edoki pour l'écran d'accueil
 * Design inspiré des widgets Edoki avec illustration thématique
 * Dimensions: 520×380, border-radius 28px
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { edokiWidgetThemes } from '@/theme/home-v10-colors';
import { fontFamily } from '@/theme/typography';

// Types pour les thèmes de widget Edoki
export type EdokiTheme = 'barres' | 'fuseaux' | 'chiffres' | 'plage' | 'numberland' | 'nouveaux';

interface GameCardV10Props {
  id: string;
  title: string;
  theme: EdokiTheme;
  progress: number; // 0-4
  isFavorite: boolean;
  onPress: () => void;
  onPlayAudio?: () => void;
  onToggleFavorite?: () => void;
}

// ========================================
// COMPOSANTS INTERNES
// ========================================

// Barre de progression (4 segments)
const ProgressBar = memo(({ progress, showIndicator = true }: { progress: number; showIndicator?: boolean }) => (
  <View style={styles.progressContainer}>
    {showIndicator && (
      <View style={styles.progressIndicator}>
        <Svg width={20} height={12} viewBox="0 0 20 12">
          <Path d="M10 12L0 0h20L10 12z" fill="#2B7CE9" />
        </Svg>
      </View>
    )}
    <View style={styles.progressBar}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.progressSegment,
            i < progress && styles.progressSegmentFilled,
          ]}
        />
      ))}
    </View>
  </View>
));
ProgressBar.displayName = 'ProgressBar';

// Bouton d'action (Play ou Favori)
const ActionButton = memo(({
  type,
  isFavorite,
  onPress,
}: {
  type: 'play' | 'favorite' | 'add';
  isFavorite?: boolean;
  onPress?: () => void;
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderIcon = () => {
    switch (type) {
      case 'play':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M8 5v14l11-7z" fill="#2B7CE9" />
          </Svg>
        );
      case 'favorite':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={isFavorite ? '#E91E63' : 'none'}
              stroke={isFavorite ? '#E91E63' : '#2B7CE9'}
              strokeWidth={2}
            />
          </Svg>
        );
      case 'add':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#2B7CE9" />
          </Svg>
        );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.actionButtonPressable}
    >
      <Animated.View style={[styles.actionButton, animatedStyle]}>
        {renderIcon()}
      </Animated.View>
    </Pressable>
  );
});
ActionButton.displayName = 'ActionButton';


// ========================================
// ILLUSTRATIONS THÉMATIQUES
// ========================================

// Barres Numériques
const BarresIllustration = memo(() => (
  <View style={styles.illustrationContainer}>
    {[2, 3, 4].map((num, rowIndex) => (
      <View key={rowIndex} style={styles.barRow}>
        <View style={styles.barNumber}>
          <Text style={styles.barNumberText}>{num}</Text>
        </View>
        <View style={styles.barBlocks}>
          {Array.from({ length: num }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.block,
                { backgroundColor: i % 2 === 0 ? '#E57373' : '#64B5F6' },
              ]}
            />
          ))}
        </View>
      </View>
    ))}
  </View>
));
BarresIllustration.displayName = 'BarresIllustration';

// Les Fuseaux
const FuseauxIllustration = memo(() => (
  <View style={styles.fuseauxContainer}>
    {[1, 2, 3].map((num) => (
      <View key={num} style={styles.spindleCard}>
        <Text style={[styles.spindleNumber, num === 3 ? styles.spindlePink : styles.spindleOrange]}>
          {num}
        </Text>
        <View style={styles.spindleDots}>
          {Array.from({ length: num }).map((_, i) => (
            <View key={i} style={styles.spindleDot} />
          ))}
        </View>
        <View style={styles.spindleBox}>
          {Array.from({ length: num }).map((_, i) => (
            <View key={i} style={styles.stick} />
          ))}
        </View>
      </View>
    ))}
  </View>
));
FuseauxIllustration.displayName = 'FuseauxIllustration';

// Chiffres Rugueux
const ChiffresIllustration = memo(() => (
  <View style={styles.chiffresContainer}>
    {[1, 2, 3].map((num, i) => (
      <View
        key={num}
        style={[
          styles.numberCard,
          {
            transform: [
              { rotate: `${(i - 1) * 8}deg` },
              { translateX: i * -20 },
            ],
            zIndex: i + 1,
          },
        ]}
      >
        <Text style={styles.numberCardText}>{num}</Text>
      </View>
    ))}
  </View>
));
ChiffresIllustration.displayName = 'ChiffresIllustration';

// La Plage des Chiffres
const PlageIllustration = memo(() => (
  <View style={styles.plageContainer}>
    <Text style={styles.sandNumber}>2</Text>
    <View style={styles.greenCard}>
      <Text style={styles.greenCardText}>2</Text>
    </View>
    <Text style={styles.crab}>🦀</Text>
    <Text style={[styles.shell, { right: 40, bottom: 30 }]}>🐚</Text>
    <Text style={[styles.shell, { right: 100, bottom: 20 }]}>🦪</Text>
  </View>
));
PlageIllustration.displayName = 'PlageIllustration';

// Numberland
const NumberlandIllustration = memo(() => (
  <View style={styles.numberlandContainer}>
    <View style={styles.mountain} />
    <Text style={styles.bigNumber}>3</Text>
    <Text style={[styles.tree, { left: 160 }]}>🌳</Text>
    <Text style={[styles.tree, { right: 160 }]}>🌲</Text>
  </View>
));
NumberlandIllustration.displayName = 'NumberlandIllustration';

// Nouveaux Jeux
const NouveauxIllustration = memo(() => (
  <View style={styles.nouveauxContainer}>
    <View style={styles.rays} />
    <View style={styles.badge}>
      <Text style={styles.badgeText}>NOUVEAUX JEUX</Text>
    </View>
    {['✦', '✦', '✦', '✦', '✦'].map((star, i) => (
      <Text
        key={i}
        style={[
          styles.star,
          {
            top: `${25 + (i * 12) % 45}%`,
            left: `${20 + (i * 18) % 60}%`,
          },
        ]}
      >
        {star}
      </Text>
    ))}
    <View style={styles.previewCards}>
      <View style={styles.previewCard}><Text style={styles.previewEmoji}>🧩</Text></View>
      <View style={styles.previewCard}><Text style={styles.previewEmoji}>🔢</Text></View>
      <View style={styles.previewCard}><Text style={styles.previewEmoji}>⏰</Text></View>
    </View>
  </View>
));
NouveauxIllustration.displayName = 'NouveauxIllustration';

// Map des illustrations
const illustrations: Record<EdokiTheme, React.ComponentType> = {
  barres: BarresIllustration,
  fuseaux: FuseauxIllustration,
  chiffres: ChiffresIllustration,
  plage: PlageIllustration,
  numberland: NumberlandIllustration,
  nouveaux: NouveauxIllustration,
};

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export const GameCardV10 = memo(({
  id: _id,
  title,
  theme,
  progress,
  isFavorite,
  onPress,
  onPlayAudio,
  onToggleFavorite,
}: GameCardV10Props) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const themeConfig = edokiWidgetThemes[theme] || edokiWidgetThemes.barres;
  const Illustration = illustrations[theme];

  const handlePressIn = () => {
    scale.value = withSpring(1.02, { damping: 15, stiffness: 200 });
    translateY.value = withSpring(-8, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const isLightTitle = themeConfig.titleColor === 'light';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Fond avec gradient ou couleur unie */}
        {themeConfig.gradient ? (
          <LinearGradient
            colors={themeConfig.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.background}
          />
        ) : (
          <View style={[styles.background, { backgroundColor: themeConfig.background }]} />
        )}

        {/* Illustration thématique */}
        <View style={styles.illustrationWrapper}>
          <Illustration />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              style={[
                styles.title,
                isLightTitle ? styles.titleLight : styles.titleDark,
              ]}
            >
              {title}
            </Text>
            {theme !== 'nouveaux' && progress >= 0 && (
              <ProgressBar progress={progress} />
            )}
          </View>

          {/* Boutons d'action */}
          <View style={styles.actions}>
            {onPlayAudio && (
              <ActionButton type="play" onPress={onPlayAudio} />
            )}
            {onToggleFavorite && (
              <ActionButton
                type="favorite"
                isFavorite={isFavorite}
                onPress={onToggleFavorite}
              />
            )}
            {!onPlayAudio && !onToggleFavorite && (
              <ActionButton type="add" />
            )}
          </View>
        </View>

      </Animated.View>
    </Pressable>
  );
});

GameCardV10.displayName = 'GameCardV10';

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  // Container principal
  container: {
    width: 520,
    height: 380,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.title,
    fontSize: 22,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleLight: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  titleDark: {
    color: '#333333',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Progress bar
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  progressIndicator: {
    width: 20,
    height: 12,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  progressSegment: {
    width: 28,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
  },
  progressSegmentFilled: {
    backgroundColor: '#FFFFFF',
  },

  // Actions
  actions: {
    flexDirection: 'column',
    gap: 10,
  },
  actionButtonPressable: {
    // Pour le hit area
  },
  actionButton: {
    width: 52,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },

  // Illustration wrapper
  illustrationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========================================
  // ILLUSTRATIONS - Barres Numériques
  // ========================================
  illustrationContainer: {
    position: 'absolute',
    left: 40,
    top: '50%',
    transform: [{ translateY: -60 }],
    gap: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  barNumber: {
    width: 48,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  barNumberText: {
    fontFamily: fontFamily.title,
    fontSize: 28,
    color: '#FFFFFF',
  },
  barBlocks: {
    flexDirection: 'row',
  },
  block: {
    width: 48,
    height: 36,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  // ========================================
  // ILLUSTRATIONS - Les Fuseaux
  // ========================================
  fuseauxContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 40,
  },
  spindleCard: {
    width: 90,
    height: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  spindleNumber: {
    fontFamily: fontFamily.title,
    fontSize: 42,
    lineHeight: 42,
  },
  spindleOrange: {
    color: '#F5A623',
  },
  spindlePink: {
    color: '#E91E63',
  },
  spindleDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  spindleDot: {
    width: 6,
    height: 6,
    backgroundColor: '#666666',
    borderRadius: 3,
  },
  spindleBox: {
    width: '100%',
    height: 60,
    backgroundColor: '#37474F',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 10,
    gap: 5,
  },
  stick: {
    width: 7,
    height: 40,
    backgroundColor: '#D4A574',
    borderRadius: 3,
  },

  // ========================================
  // ILLUSTRATIONS - Chiffres Rugueux
  // ========================================
  chiffresContainer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    flexDirection: 'row',
  },
  numberCard: {
    width: 110,
    height: 150,
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  numberCardText: {
    fontFamily: fontFamily.title,
    fontSize: 80,
    color: '#FFFFFF',
  },

  // ========================================
  // ILLUSTRATIONS - La Plage des Chiffres
  // ========================================
  plageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sandNumber: {
    position: 'absolute',
    right: 60,
    bottom: 80,
    fontFamily: fontFamily.title,
    fontSize: 150,
    color: 'rgba(139, 90, 43, 0.3)',
    lineHeight: 150,
  },
  greenCard: {
    position: 'absolute',
    left: 100,
    bottom: 80,
    width: 100,
    height: 130,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  greenCardText: {
    fontFamily: fontFamily.title,
    fontSize: 70,
    color: '#FFFFFF',
  },
  crab: {
    position: 'absolute',
    left: 80,
    bottom: 30,
    fontSize: 60,
  },
  shell: {
    position: 'absolute',
    fontSize: 28,
  },

  // ========================================
  // ILLUSTRATIONS - Numberland
  // ========================================
  numberlandContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mountain: {
    position: 'absolute',
    right: 80,
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 160,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#A8B896',
  },
  bigNumber: {
    position: 'absolute',
    left: 50,
    bottom: 30,
    fontFamily: fontFamily.title,
    fontSize: 170,
    color: '#E91E63',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 6, height: 6 },
    textShadowRadius: 12,
    lineHeight: 170,
  },
  tree: {
    position: 'absolute',
    bottom: 15,
    fontSize: 36,
  },

  // ========================================
  // ILLUSTRATIONS - Nouveaux Jeux
  // ========================================
  nouveauxContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  rays: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 600,
    height: 600,
    marginTop: -300,
    marginLeft: -300,
    backgroundColor: 'transparent',
  },
  badge: {
    position: 'absolute',
    top: 24,
    left: -10,
    backgroundColor: '#E53935',
    paddingVertical: 10,
    paddingHorizontal: 50,
    paddingRight: 60,
    transform: [{ rotate: '-5deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeText: {
    fontFamily: fontFamily.title,
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  star: {
    position: 'absolute',
    fontSize: 18,
    color: '#FFFFFF',
  },
  previewCards: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  previewCard: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF8E1',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 7,
    borderColor: '#FFECB3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  previewEmoji: {
    fontSize: 44,
  },
});

export default GameCardV10;
