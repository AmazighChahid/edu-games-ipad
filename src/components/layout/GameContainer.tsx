/**
 * GameContainer component
 * Standard layout wrapper for game screens
 */

import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { colors, spacing, textStyles, borderRadius, touchTargets } from '@/theme';

interface GameContainerProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  moveCount?: number;
  optimalMoves?: number;
  onReset?: () => void;
  onHome?: () => void;
  onSettings?: () => void;
}

export function GameContainer({
  children,
  showHeader = true,
  title,
  moveCount,
  optimalMoves,
  onReset,
  onHome,
  onSettings,
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
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing[2],
          paddingBottom: insets.bottom + spacing[2],
          paddingLeft: insets.left + spacing[4],
          paddingRight: insets.right + spacing[4],
        },
      ]}
    >
      {showHeader && (
        <View style={styles.header}>
          <Pressable
            onPress={handleHome}
            style={styles.headerButton}
            accessibilityLabel={t('common.home')}
          >
            <Text style={styles.headerButtonText}>🏠</Text>
          </Pressable>

          {title && <Text style={styles.title}>{title}</Text>}

          <View style={styles.headerRight}>
            {moveCount !== undefined && (
              <View style={styles.moveCounter}>
                <Text style={styles.moveLabel}>{t('common.moves')}</Text>
                <Text style={styles.moveCount}>
                  {moveCount}
                  {optimalMoves !== undefined && (
                    <Text style={styles.optimalMoves}> / {optimalMoves}</Text>
                  )}
                </Text>
              </View>
            )}

            {onSettings && (
              <Pressable
                onPress={onSettings}
                style={styles.headerButton}
                accessibilityLabel={t('common.settings')}
              >
                <Text style={styles.headerButtonText}>⚙️</Text>
              </Pressable>
            )}

            {onReset && (
              <Pressable
                onPress={onReset}
                style={styles.headerButton}
                accessibilityLabel={t('common.reset')}
              >
                <Text style={styles.headerButtonText}>🔄</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.game,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  headerButton: {
    width: touchTargets.medium,
    height: touchTargets.medium,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 24,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  moveCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    gap: spacing[2],
  },
  moveLabel: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  moveCount: {
    ...textStyles.moveCounter,
    color: colors.primary.main,
  },
  optimalMoves: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
  },
});
