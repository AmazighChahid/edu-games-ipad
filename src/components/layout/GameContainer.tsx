/**
 * GameContainer component
 * Modern game layout with styled header and gradient
 */

import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, textStyles, borderRadius, touchTargets } from '@/theme';

interface GameContainerProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  levelNumber?: number;
  moveCount?: number;
  optimalMoves?: number;
  onReset?: () => void;
  onHome?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

export function GameContainer({
  children,
  showHeader = true,
  title,
  levelNumber,
  moveCount,
  optimalMoves,
  onReset,
  onHome,
  onSettings,
  onHelp,
}: GameContainerProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      router.push('/');
    }
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <>
          {/* Header avec dégradé bleu */}
          <LinearGradient
            colors={['#5BA3E8', '#4A90D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.header, { paddingTop: insets.top + spacing[2] }]}
          >
            {/* Top row: Menu button, Title, Status dots */}
            <View style={styles.topRow}>
              {/* Menu Button */}
              <Pressable
                onPress={handleHome}
                style={styles.menuButton}
                accessibilityLabel={t('common.home')}
              >
                <Text style={styles.menuIcon}>{'◀'}</Text>
                <Text style={styles.menuText}>Menu</Text>
              </Pressable>

              {/* Title with level */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {title || 'Tour de Hanoï'}
                  {levelNumber !== undefined && ` — Niveau ${levelNumber}`}
                </Text>
              </View>

              {/* Status dots */}
              <View style={styles.statusDots}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          i <= (levelNumber || 1)
                            ? '#FFFFFF'
                            : 'rgba(255,255,255,0.3)',
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>

          {/* Stats and buttons row */}
          <View style={styles.statsRow}>
            {/* Move counter */}
            <View style={styles.moveCounterBox}>
              <Text style={styles.moveCounterLabel}>Coups</Text>
              <Text style={styles.moveCounterValue}>{moveCount ?? 0}</Text>
            </View>

            {optimalMoves !== undefined && (
              <Text style={styles.optimalText}>
                Objectif : {optimalMoves} (optimal)
              </Text>
            )}

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              {onHelp && (
                <Pressable
                  onPress={onHelp}
                  style={styles.helpButton}
                  accessibilityLabel="Aide"
                >
                  <Text style={styles.buttonIcon}>💡</Text>
                  <Text style={styles.buttonText}>Aide</Text>
                </Pressable>
              )}

              {onReset && (
                <Pressable
                  onPress={onReset}
                  style={styles.resetButton}
                  accessibilityLabel={t('common.reset')}
                >
                  <Text style={styles.buttonIcon}>↻</Text>
                  <Text style={styles.buttonText}>Reset</Text>
                </Pressable>
              )}
            </View>
          </View>
        </>
      )}

      <View
        style={[
          styles.content,
          !showHeader && { paddingTop: insets.top + spacing[2] },
          { paddingBottom: insets.bottom + spacing[2] },
        ]}
      >
        {children}
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
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing[3],
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusDots: {
    flexDirection: 'row',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  moveCounterBox: {
    backgroundColor: colors.background.card,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moveCounterLabel: {
    color: colors.text.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  moveCounterValue: {
    color: colors.primary.dark,
    fontSize: 32,
    fontWeight: 'bold',
  },
  optimalText: {
    color: colors.text.muted,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
});
