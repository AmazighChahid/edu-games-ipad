/**
 * Home Screen V10 - "Forêt Immersive"
 * Immersive animated forest background with floating widgets and game grid
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, AppState, AppStateStatus } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

// Home V10 Components
import {
  ForestBackgroundV10,
  PiouFloating,
  CollectionFloating,
  HomeHeaderV10,
  GameCardV10,
} from '@/components/home-v10';
import { HomeV10Layout } from '@/theme/home-v10-colors';

// Hooks
import { useHomeData } from '@/hooks/useHomeData';

// Parent dashboard (full-screen modal)
import { ParentDashboard } from '@/components/parent/ParentDashboard';
import { useStore } from '@/store';

// Game color mapping
const GAME_COLORS: Record<string, 'blue' | 'purple' | 'orange' | 'teal' | 'pink' | 'indigo' | 'coral' | 'cyan' | 'amber'> = {
  hanoi: 'blue',
  'suites-logiques': 'indigo',
  'logix-grid': 'cyan',
  'math-blocks': 'purple',
  sudoku: 'teal',
  tangram: 'pink',
  labyrinthe: 'amber',
  memory: 'orange',
  'mots-croises': 'coral',
  'conteur-curieux': 'purple',
  balance: 'amber',
  'matrices-magiques': 'cyan',
};

// Game route mapping
const GAME_ROUTES: Record<string, string> = {
  hanoi: '/(games)/01-hanoi',
  'suites-logiques': '/(games)/02-suites-logiques',
  'logix-grid': '/(games)/09-logix-grid',
  'math-blocks': '/(games)/11-math-blocks',
  sudoku: '/(games)/05-sudoku',
  tangram: '/(games)/08-tangram',
  labyrinthe: '/(games)/03-labyrinthe',
  memory: '/(games)/07-memory',
  'mots-croises': '/(games)/10-mots-croises',
  'conteur-curieux': '/(games)/06-conteur-curieux',
  balance: '/(games)/04-balance',
  'matrices-magiques': '/(games)/12-matrices-magiques',
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const soundRef = useRef<Audio.Sound | null>(null);
  const appState = useRef(AppState.currentState);

  // Forest ambiance audio
  useEffect(() => {
    let isMounted = true;

    const loadAndPlayAudio = async () => {
      try {
        // Configure audio mode for background playback
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Load and play forest ambiance
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/forest-ambiance.mp3'),
          {
            isLooping: true,
            volume: 0.3,
            shouldPlay: true,
          }
        );

        if (isMounted) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch (error) {
        console.warn('Failed to load forest ambiance audio:', error);
      }
    };

    loadAndPlayAudio();

    // Handle app state changes (pause when app goes to background)
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        // App going to background - pause audio
        soundRef.current?.pauseAsync();
      } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App coming to foreground - resume audio
        soundRef.current?.playAsync();
      }
      appState.current = nextAppState;
    });

    return () => {
      isMounted = false;
      subscription.remove();
      soundRef.current?.unloadAsync();
    };
  }, []);

  // Get home data from hook
  const {
    profile,
    piouAdvice,
    collectionData,
    gameCategories,
  } = useHomeData();

  // Parent dashboard state
  const [isParentDashboardVisible, setIsParentDashboardVisible] = useState(false);

  // Get game progress for parent drawer stats
  const gameProgress = useStore((state) => state.gameProgress);

  // Calculate stats for parent drawer
  const totalGames = Object.values(gameProgress).reduce(
    (sum, gp) => sum + Object.keys(gp.completedLevels).length,
    0
  );
  const successfulGames = totalGames;

  // Flatten games from categories for grid display
  const allGames = useMemo(() => {
    const games: Array<{
      id: string;
      name: string;
      icon: string;
      color: 'blue' | 'purple' | 'orange' | 'teal' | 'pink' | 'indigo' | 'coral' | 'cyan' | 'amber';
      medal: 'none' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'locked';
      badge?: 'new' | 'hot' | 'soon';
      isLocked: boolean;
    }> = [];

    gameCategories.forEach((category) => {
      category.games.forEach((game) => {
        // Si le jeu est verrouillé explicitement -> 'locked'
        // Si le jeu n'a pas de médaille mais est accessible -> 'none' (À jouer)
        // Sinon -> la médaille obtenue
        const medal = game.isLocked
          ? 'locked'
          : (game.medal as 'none' | 'bronze' | 'silver' | 'gold' | 'diamond');

        games.push({
          id: game.id,
          name: game.name,
          icon: game.icon,
          color: GAME_COLORS[game.id] || 'blue',
          medal,
          badge: game.badge as 'new' | 'hot' | 'soon' | undefined,
          isLocked: game.isLocked,
        });
      });
    });

    return games;
  }, [gameCategories]);

  // Group games into rows of 3
  const gameRows = useMemo(() => {
    const rows: typeof allGames[] = [];
    for (let i = 0; i < allGames.length; i += 3) {
      rows.push(allGames.slice(i, i + 3));
    }
    return rows;
  }, [allGames]);

  // Handlers
  const handleParentPress = useCallback(() => {
    setIsParentDashboardVisible(true);
  }, []);

  const handleParentDashboardClose = useCallback(() => {
    setIsParentDashboardVisible(false);
  }, []);

  const handleGamePress = useCallback((gameId: string) => {
    const route = GAME_ROUTES[gameId];
    if (route) {
      router.push(route as any);
    }
  }, [router]);

  const handlePiouActionPress = useCallback(() => {
    if (piouAdvice.targetGameId) {
      handleGamePress(piouAdvice.targetGameId);
    }
  }, [piouAdvice.targetGameId, handleGamePress]);

  const handleCollectionPress = useCallback(() => {
    router.push('/(games)/collection' as any);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Animated forest background V10 */}
      <ForestBackgroundV10>
        {/* Fixed Header with mask - doesn't scroll */}
        <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
          {/* Gradient mask to hide scrolled content */}
          <LinearGradient
            colors={[
              'rgba(126, 200, 227, 0.95)',
              'rgba(168, 224, 240, 0.9)',
              'rgba(168, 224, 240, 0.7)',
              'rgba(168, 224, 240, 0)',
            ]}
            locations={[0, 0.5, 0.8, 1]}
            style={styles.headerMask}
          />
          <HomeHeaderV10
            profile={profile}
            onParentPress={handleParentPress}
          />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 200,
              paddingBottom: insets.bottom + HomeV10Layout.gamesSectionPaddingBottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Piou and Collection - now in scroll */}
          <View style={styles.floatingRow}>
            <PiouFloating
              message={piouAdvice.message}
              highlightedPart={piouAdvice.highlightedPart}
              actionLabel={piouAdvice.actionLabel}
              onActionPress={handlePiouActionPress}
            />

            <CollectionFloating
              cardCount={collectionData.unlockedCards.length}
              onPress={handleCollectionPress}
            />
          </View>

          {/* Games Grid */}
          <View style={styles.gamesSection}>
            {gameRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gamesRow}>
                {row.map((game) => (
                  <GameCardV10
                    key={game.id}
                    name={game.name}
                    icon={game.icon}
                    color={game.color}
                    medal={game.medal}
                    badge={game.badge}
                    isLocked={game.isLocked}
                    onPress={() => handleGamePress(game.id)}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ForestBackgroundV10>

      {/* Parent dashboard modal */}
      <ParentDashboard
        isVisible={isParentDashboardVisible}
        onClose={handleParentDashboardClose}
        childName={profile.name}
        levelsCompleted={totalGames}
        successRate={totalGames > 0 ? Math.round((successfulGames / totalGames) * 100) : 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  floatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  gamesSection: {
    paddingTop: 60,
    paddingHorizontal: HomeV10Layout.gamesSectionPaddingH,
  },
  gamesRow: {
    flexDirection: 'row',
    gap: HomeV10Layout.gamesRowGap,
    marginBottom: HomeV10Layout.gamesRowMarginBottom,
  },
});
