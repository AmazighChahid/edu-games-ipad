/**
 * GameContainer component
 * Clean modern layout with blue gradient header
 */

import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, borderRadius } from '@/theme';

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
          {/* Clean blue gradient header */}
          <LinearGradient
            colors={['#4A9FE8', '#3B82D6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.header, { paddingTop: insets.top + spacing[3] }]}
          >
            <View style={styles.headerContent}>
              {/* Menu Button */}
              <Pressable
                onPress={handleHome}
                style={styles.menuButton}
                accessibilityLabel={t('common.home')}
              >
                <Text style={styles.menuIcon}>{'←'}</Text>
                <Text style={styles.menuText}>Menu</Text>
              </Pressable>

              {/* Title with level */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {title || 'Tour de Hanoï'}
                </Text>
                {levelNumber !== undefined && (
                  <Text style={styles.levelText}>Niveau {levelNumber}</Text>
                )}
              </View>

              {/* Action buttons */}
              <View style={styles.headerButtons}>
                {onHelp && (
                  <Pressable
                    onPress={onHelp}
                    style={styles.iconButton}
                    accessibilityLabel="Aide"
                  >
                    <Text style={styles.iconButtonText}>?</Text>
                  </Pressable>
                )}

                {onReset && (
                  <Pressable
                    onPress={onReset}
                    style={styles.iconButton}
                    accessibilityLabel={t('common.reset')}
                  >
                    <Text style={styles.iconButtonText}>↻</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </LinearGradient>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statsContent}>
              {/* Move counter */}
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Coups</Text>
                <Text style={styles.statValue}>{moveCount ?? 0}</Text>
              </View>

              {optimalMoves !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Objectif</Text>
                  <Text style={styles.statValueSmall}>{optimalMoves}</Text>
                </View>
              )}

              {/* Progress dots */}
              <View style={styles.progressDots}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressDot,
                      i <= (levelNumber || 1) && styles.progressDotActive,
                    ]}
                  />
                ))}
              </View>
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
    backgroundColor: '#F5F0E8',
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: 20,
    gap: spacing[2],
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  statsRow: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#8B7355',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#4A9FE8',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 2,
  },
  statValueSmall: {
    color: '#69DB7C',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 2,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: spacing[4],
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0D5C5',
  },
  progressDotActive: {
    backgroundColor: '#4ADE80',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[2],
  },
});
