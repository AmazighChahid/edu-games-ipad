/**
 * Écran d'accueil enfant
 * Menu principal avec grosses icônes pour les activités
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { SafeAreaContainer } from '../components/core';
import { Colors, Layout, Typography } from '../constants';
import { MainStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

// Carte d'activité animée
interface ActivityCardProps {
  icon: string;
  title: string;
  onPress: () => void;
  available?: boolean;
  accessibilityLabel: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActivityCard: React.FC<ActivityCardProps> = ({
  icon,
  title,
  onPress,
  available = true,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (available) {
      scale.value = withSpring(0.95, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    if (available) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <AnimatedPressable
      style={[
        styles.activityCard,
        !available && styles.activityCardDisabled,
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !available }}
    >
      <Text style={styles.activityIcon}>{icon}</Text>
      <Text style={[styles.activityTitle, !available && styles.activityTitleDisabled]}>
        {title}
      </Text>
      {!available && (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Bientôt</Text>
        </View>
      )}
    </AnimatedPressable>
  );
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleTowerOfHanoi = useCallback(() => {
    navigation.navigate('TowerOfHanoi');
  }, [navigation]);

  const handleParentZone = useCallback(() => {
    navigation.navigate('ParentZone');
  }, [navigation]);

  return (
    <SafeAreaContainer backgroundColor={Colors.neutral.background}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Bonjour !</Text>
        <Text style={styles.subtitle}>Que veux-tu faire aujourd'hui ?</Text>
      </View>

      {/* Grille d'activités */}
      <View style={styles.activitiesGrid}>
        <ActivityCard
          icon="🗼"
          title="Tour de Hanoï"
          onPress={handleTowerOfHanoi}
          available={true}
          accessibilityLabel="Jouer au puzzle Tour de Hanoï"
        />
        <ActivityCard
          icon="🧩"
          title="Tangram"
          onPress={() => {}}
          available={false}
          accessibilityLabel="Tangram, bientôt disponible"
        />
        <ActivityCard
          icon="🌀"
          title="Labyrinthe"
          onPress={() => {}}
          available={false}
          accessibilityLabel="Labyrinthe, bientôt disponible"
        />
        <ActivityCard
          icon="🔷"
          title="Formes"
          onPress={() => {}}
          available={false}
          accessibilityLabel="Tri de formes, bientôt disponible"
        />
      </View>

      {/* Bouton accès parent */}
      <View style={styles.footer}>
        <Pressable
          style={styles.parentButton}
          onPress={handleParentZone}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Accès espace parent"
          accessibilityHint="Ouvre l'espace réservé aux parents"
        >
          <Text style={styles.parentButtonIcon}>👨‍👩‍👧</Text>
          <Text style={styles.parentButtonText}>Espace Parent</Text>
        </Pressable>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.dark,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.neutral.textLight,
  },
  activitiesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
  },
  activityCard: {
    width: 150,
    height: 150,
    backgroundColor: Colors.neutral.surface,
    borderRadius: Layout.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Layout.shadow.medium,
  },
  activityCardDisabled: {
    backgroundColor: Colors.neutral.border,
    opacity: 0.7,
  },
  activityIcon: {
    fontSize: 60,
    marginBottom: Layout.spacing.sm,
  },
  activityTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.neutral.text,
    textAlign: 'center',
  },
  activityTitleDisabled: {
    color: Colors.neutral.textLight,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
    backgroundColor: Colors.secondary.soft,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  comingSoonText: {
    fontSize: Typography.sizes.xs,
    color: Colors.secondary.dark,
    fontWeight: Typography.weights.medium,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.lg,
  },
  parentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    ...Layout.shadow.small,
  },
  parentButtonIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.sm,
  },
  parentButtonText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral.textLight,
    fontWeight: Typography.weights.medium,
  },
});
