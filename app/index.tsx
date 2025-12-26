import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, Href, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, textStyles, borderRadius, shadows, touchTargets } from '@/theme';
import { gameRegistry } from '@/games/registry';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleParentPress = () => {
    router.push('/(parent)');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[4],
          paddingBottom: insets.bottom + spacing[4],
          paddingLeft: insets.left + spacing[6],
          paddingRight: insets.right + spacing[6],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Pressable
          onLongPress={handleParentPress}
          delayLongPress={2000}
          style={styles.parentButton}
        >
          <Text style={styles.parentButtonText}>{t('home.parentAccess')}</Text>
        </Pressable>
      </View>

      <View style={styles.gamesGrid}>
        {gameRegistry.map((game) => (
          game.status === 'available' ? (
            <Link
              key={game.id}
              href={game.route as Href}
              asChild
            >
              <Pressable
                style={({ pressed }) => [
                  styles.gameCard,
                  pressed && styles.gameCardPressed,
                ]}
              >
                <View style={styles.gameIconContainer}>
                  <Text style={styles.gameIcon}>
                    {game.id === 'hanoi' ? '🗼' : game.id === 'math-blocks' ? '🧮' : game.id === 'sudoku' ? '🧩' : '🎮'}
                  </Text>
                </View>
                <Text style={styles.gameName}>{t(game.nameKey)}</Text>
              </Pressable>
            </Link>
          ) : (
            <View
              key={game.id}
              style={[styles.gameCard, styles.gameCardDisabled]}
            >
              <View style={styles.gameIconContainer}>
                <Text style={styles.gameIcon}>
                  {game.id === 'hanoi' ? '🗼' : game.id === 'math-blocks' ? '🧮' : game.id === 'sudoku' ? '🧩' : '🎮'}
                </Text>
              </View>
              <Text style={styles.gameName}>{t(game.nameKey)}</Text>
              {game.status === 'coming_soon' && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>{t('common.comingSoon')}</Text>
                </View>
              )}
            </View>
          )
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  title: {
    ...textStyles.h1,
    color: colors.text.primary,
  },
  parentButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  parentButtonText: {
    ...textStyles.bodySmall,
    color: colors.text.muted,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[6],
  },
  gameCard: {
    width: touchTargets.homeCard,
    height: touchTargets.homeCard + 40,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  gameCardDisabled: {
    opacity: 0.5,
  },
  gameCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  gameIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  gameIcon: {
    fontSize: 40,
  },
  gameName: {
    ...textStyles.button,
    color: colors.text.primary,
    textAlign: 'center',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.sm,
  },
  comingSoonText: {
    ...textStyles.label,
    color: colors.secondary.contrast,
    fontSize: 10,
  },
});
