/**
 * MathBlocks Victory Screen
 * Displays results after game completion
 */

import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore } from '@/store/useStore';

export function MathVictoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentSession = useStore((state) => state.currentSession);

  const handlePlayAgain = () => {
    router.replace('/(games)/math-blocks/play');
  };

  const handleNextLevel = () => {
    // TODO: Implement level progression
    router.push('/(games)/math-blocks');
  };

  const handleMenu = () => {
    router.push('/(games)/math-blocks');
  };

  const handleHome = () => {
    router.push('/');
  };

  // Get session data
  const moveCount = currentSession?.moveCount || 0;
  const isVictory = currentSession?.status === 'victory';

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[8],
          paddingBottom: insets.bottom + spacing[4],
        },
      ]}
    >
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {isVictory ? 'Felicitations !' : 'Partie terminee'}
        </Text>
        <Text style={styles.subtitle}>
          {isVictory
            ? 'Tu as reussi le niveau !'
            : 'Le temps est ecoule...'}
        </Text>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Paires trouvees</Text>
          <Text style={styles.statValue}>{moveCount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Statut</Text>
          <Text
            style={[
              styles.statValue,
              { color: isVictory ? colors.feedback.success : colors.feedback.error },
            ]}
          >
            {isVictory ? 'Victoire !' : 'Echoue'}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.primaryButton} onPress={handlePlayAgain}>
          <Text style={styles.primaryButtonText}>Rejouer</Text>
        </Pressable>

        {isVictory && (
          <Pressable style={styles.secondaryButton} onPress={handleNextLevel}>
            <Text style={styles.secondaryButtonText}>Niveau suivant</Text>
          </Pressable>
        )}

        <Pressable style={styles.outlineButton} onPress={handleMenu}>
          <Text style={styles.outlineButtonText}>Choisir un niveau</Text>
        </Pressable>

        <Pressable style={styles.textButton} onPress={handleHome}>
          <Text style={styles.textButtonText}>Retour au menu principal</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing[6],
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    width: '100%',
    maxWidth: 400,
    marginBottom: spacing[8],
    ...shadows.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  statLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.divider,
    marginVertical: spacing[2],
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: spacing[3],
  },
  primaryButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  secondaryButtonText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  outlineButtonText: {
    color: colors.primary.main,
    fontSize: 18,
    fontWeight: '600',
  },
  textButton: {
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  textButtonText: {
    color: colors.text.muted,
    fontSize: 16,
  },
});
