/**
 * Home Screen V9 - "Forêt Magique"
 * Immersive animated forest background with widgets and game categories
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Background
import { ForestBackground } from '@/components/background';

// Home components V9
import { HomeHeaderV9 } from '@/components/home/HomeHeaderV9';
import { WidgetsSection } from '@/components/home/widgets';
import { GameCategoriesSection } from '@/components/home/GameCategoriesSection';

// Hooks
import { useHomeData } from '@/hooks/useHomeData';

// Parent drawer (keeping existing functionality)
import { ParentDrawer } from '@/components/parent/ParentDrawer';
import { useStore } from '@/store/useStore';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get home data from hook
  const {
    profile,
    piouAdvice,
    gardenStats,
    streakData,
    collectionData,
    gameCategories,
  } = useHomeData();

  // Parent drawer state
  const [isParentDrawerVisible, setIsParentDrawerVisible] = useState(false);

  // Get game progress for parent drawer stats
  const gameProgress = useStore((state) => state.gameProgress);

  // Calculate stats for parent drawer
  const totalGames = Object.values(gameProgress).reduce(
    (sum, gp) => sum + Object.keys(gp.completedLevels).length,
    0
  );
  const successfulGames = totalGames; // All completed are successful

  // Handlers
  const handleParentPress = useCallback(() => {
    setIsParentDrawerVisible(true);
  }, []);

  const handleParentDrawerClose = useCallback(() => {
    setIsParentDrawerVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated forest background */}
      <ForestBackground>
        {/* Content layer */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header */}
          <HomeHeaderV9 profile={profile} onParentPress={handleParentPress} />

          {/* Widgets section (2x2 grid) */}
          <WidgetsSection
            piouAdvice={piouAdvice}
            gardenStats={gardenStats}
            streakData={streakData}
            collectionData={collectionData}
          />

          {/* Game categories with horizontal scroll */}
          <GameCategoriesSection categories={gameCategories} />
        </ScrollView>
      </ForestBackground>

      {/* Parent drawer overlay */}
      <ParentDrawer
        isVisible={isParentDrawerVisible}
        onClose={handleParentDrawerClose}
        totalGames={totalGames}
        successfulGames={successfulGames}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
