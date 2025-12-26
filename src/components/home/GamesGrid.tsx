import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Game } from '../../types/games';
import { GameCard } from './GameCard';
import { theme } from '@/theme';

interface GamesGridProps {
  games: Game[];
  onGamePress: (gameId: string) => void;
}

export const GamesGrid: React.FC<GamesGridProps> = ({ games, onGamePress }) => {
  const { width } = useWindowDimensions();

  // Responsive columns based on iPad size
  const isIPadMini = width < 800;
  const isIPadPro12 = width > 1000;
  const columns = isIPadMini ? 3 : 4;

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.emoji}>🎮</Text>
        <Text style={styles.title}>Mes Aventures</Text>
      </View>

      <View style={[styles.grid, { gap: theme.homeLayout.gameCardGap }]}>
        {games.map((game) => (
          <View
            key={game.id}
            style={[
              styles.gameCardWrapper,
              {
                width: `${(100 - (columns - 1) * 2) / columns}%`,
              },
            ]}
          >
            <GameCard {...game} onPress={() => onGamePress(game.id)} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing[6],
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  emoji: {
    fontSize: 32, // HTML: 28px, augmenté pour être bien visible
  },
  title: {
    ...theme.textStyles.sectionTitle,
    color: theme.colors.text.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameCardWrapper: {
    marginBottom: theme.homeLayout.gameCardGap,
  },
});
