import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TEXT_STYLES, TYPOGRAPHY } from '../../constants/typography';

interface ProgressGardenProps {
  flowers: number;
  gamesCompleted: number;
  totalPlayTime: string;
}

const PLANT_DATA = [
  { flower: '🌸', stemHeight: 30 },
  { flower: '🌻', stemHeight: 45 },
  { flower: '🌷', stemHeight: 35 },
  { flower: '🌺', stemHeight: 50 },
  { flower: '🌼', stemHeight: 20 },
];

export const ProgressGarden: React.FC<ProgressGardenProps> = ({
  flowers,
  gamesCompleted,
  totalPlayTime,
}) => {
  return (
    <View style={styles.container}>
      {/* Titre */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🌱</Text>
        <Text style={styles.title}>Mon Jardin</Text>
      </View>

      {/* Visualisation du jardin */}
      <LinearGradient
        colors={[COLORS.gardenSky, COLORS.gardenSkyMid, COLORS.gardenGrass]}
        style={styles.gardenVisual}
      >
        {/* Plantes */}
        <View style={styles.plantsContainer}>
          {PLANT_DATA.slice(0, flowers).map((plant, index) => (
            <Plant
              key={index}
              flower={plant.flower}
              stemHeight={plant.stemHeight}
              delay={index * 200}
            />
          ))}
        </View>

        {/* Sol */}
        <LinearGradient
          colors={[COLORS.gardenSoil, COLORS.gardenSoilDark]}
          style={styles.ground}
        />
      </LinearGradient>

      {/* Statistiques */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{flowers}</Text>
          <Text style={styles.statLabel}>Fleurs</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{gamesCompleted}</Text>
          <Text style={styles.statLabel}>Jeux finis</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalPlayTime}</Text>
          <Text style={styles.statLabel}>Temps</Text>
        </View>
      </View>
    </View>
  );
};

interface PlantProps {
  flower: string;
  stemHeight: number;
  delay: number;
}

const Plant: React.FC<PlantProps> = ({ flower, stemHeight, delay }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    };

    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.plant, animatedStyle]}>
      <Text style={styles.plantFlower}>{flower}</Text>
      <View style={[styles.plantStem, { height: stemHeight }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.radiusXl,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  emoji: {
    fontSize: 24, // HTML: 22px, augmenté pour visibilité
  },
  title: {
    ...TEXT_STYLES.h3,
    color: COLORS.textDark,
  },
  gardenVisual: {
    borderRadius: SPACING.radiusLg,
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  plantsContainer: {
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xl,
    zIndex: 2,
  },
  plant: {
    alignItems: 'center',
  },
  plantFlower: {
    fontSize: 32, // HTML: 28px, augmenté pour être bien visible
  },
  plantStem: {
    width: 4,
    backgroundColor: COLORS.plantStem,
    borderRadius: 2,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: SPACING.radiusLg,
    borderBottomRightRadius: SPACING.radiusLg,
    zIndex: 1,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 28, // HTML: 24px, augmenté pour visibilité
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 13, // HTML: 12px, légèrement augmenté
    color: COLORS.textMedium,
    fontFamily: 'Nunito_400Regular',
  },
});
