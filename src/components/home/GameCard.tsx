import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Game, GameLevel, GameCategory } from '../../types/games';
import { theme } from '@/theme';

interface GameCardProps extends Game {
  onPress: () => void;
}

// Couleurs et labels pour chaque niveau
const LEVEL_CONFIG: Record<GameLevel, { colors: [string, string]; label: string; medal: string; textColor: string }> = {
  none: { colors: ['#E0E0E0', '#BDBDBD'], label: '', medal: '', textColor: '#9E9E9E' },
  bronze: { colors: ['#CD7F32', '#A0522D'], label: 'Bronze', medal: '🥉', textColor: '#FFFFFF' },
  silver: { colors: ['#C0C0C0', '#A8A8A8'], label: 'Argent', medal: '🥈', textColor: '#FFFFFF' },
  gold: { colors: ['#FFD700', '#FFA500'], label: 'Or', medal: '🥇', textColor: '#FFFFFF' },
  diamond: { colors: ['#B9F2FF', '#00CED1'], label: 'Diamant', medal: '💎', textColor: '#006666' },
};

// Couleurs par catégorie
const getCategoryColor = (category: GameCategory): string => {
  switch (category) {
    case 'logic': return '#5B8DEE';
    case 'spatial': return '#E056FD';
    case 'numbers': case 'math': return '#7BC74D';
    case 'memory': return '#FFB347';
    case 'language': return '#FF6B9D';
    default: return '#5B8DEE';
  }
};

export const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  icon,
  category,
  progress,
  level,
  levelProgress,
  isNew,
  isHot,
  isComingSoon,
  onPress,
}) => {
  const cardScale = useSharedValue(1);
  const cardTranslateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }, { translateY: cardTranslateY.value }],
  }));

  const handlePressIn = () => {
    if (isComingSoon) return;
    cardScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    if (isComingSoon) return;
    cardScale.value = withSpring(1.02, { damping: 10, stiffness: 200 });
    cardTranslateY.value = withSpring(-6, { damping: 10, stiffness: 200 });

    setTimeout(() => {
      cardScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      cardTranslateY.value = withSpring(0, { damping: 10, stiffness: 200 });
    }, 150);
  };

  const categoryColor = getCategoryColor(category as GameCategory);
  const levelConfig = LEVEL_CONFIG[level || 'none'];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isComingSoon}
      accessible
      accessibilityLabel={`${name}, niveau ${levelConfig.label || 'débutant'}, ${progress}% complété${
        isNew ? ', nouveau jeu' : ''
      }${isHot ? ', populaire' : ''}${isComingSoon ? ', bientôt disponible' : ''}`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          isComingSoon && styles.cardComingSoon,
        ]}
      >
        {/* Bande de couleur supérieure */}
        <View style={[styles.stripe, { backgroundColor: categoryColor }]} />

        {/* Badges */}
        {isNew && (
          <View style={[styles.badge, styles.badgeNew]}>
            <Text style={styles.badgeText}>Nouveau !</Text>
          </View>
        )}
        {isHot && !isNew && (
          <View style={[styles.badge, styles.badgeHot]}>
            <Text style={styles.badgeText}>🔥 Hot</Text>
          </View>
        )}
        {isComingSoon && (
          <View style={[styles.badge, styles.badgeSoon]}>
            <Text style={styles.badgeText}>Bientôt !</Text>
          </View>
        )}

        {/* Icône du jeu */}
        <Text style={[styles.icon, isComingSoon && styles.iconComingSoon]}>{icon}</Text>

        {/* Nom du jeu */}
        <Text style={styles.gameName}>{name}</Text>

        {/* Barre de progression */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: categoryColor }]} />
        </View>

        {/* Système de niveau */}
        <View style={styles.levelContainer}>
          {/* Badge de niveau */}
          {level && level !== 'none' && (
            <LinearGradient
              colors={levelConfig.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.levelBadge}
            >
              <Text style={styles.levelMedal}>{levelConfig.medal}</Text>
              <Text style={[styles.levelLabel, { color: levelConfig.textColor }]}>
                {levelConfig.label}
              </Text>
            </LinearGradient>
          )}

          {/* Indicateur de progression (dots) */}
          <View style={styles.levelIndicator}>
            {[0, 1, 2, 3, 4].map((dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.levelDot,
                  dotIndex < (levelProgress || 0) && { backgroundColor: categoryColor },
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
    minWidth: 150,
  },
  cardComingSoon: {
    opacity: 0.6,
  },
  stripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    zIndex: 10,
  },
  badgeNew: {
    backgroundColor: '#7BC74D',
  },
  badgeHot: {
    backgroundColor: '#FF6B6B',
  },
  badgeSoon: {
    backgroundColor: '#FFB347',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontFamily: 'Nunito_800ExtraBold',
  },
  icon: {
    fontSize: 40,
    marginTop: 6,
  },
  iconComingSoon: {
    opacity: 0.5,
  },
  gameName: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 18,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  levelMedal: {
    fontSize: 14,
  },
  levelLabel: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
  },
  levelIndicator: {
    flexDirection: 'row',
    gap: 3,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
});
