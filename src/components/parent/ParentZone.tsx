/**
 * ParentZone component
 * Sliding bottom panel with tips, progress, and game modes
 */

import { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius } from '@/theme';

const PANEL_HEIGHT = 320;
const COLLAPSED_HEIGHT = 0;

export type GameMode = 'discovery' | 'challenge' | 'expert';

interface ParentZoneProps {
  progression: number;
  maxProgression: number;
  personalRecord: number;
  hintsRemaining: number;
  maxHints: number;
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onHintPress: () => void;
  isVisible?: boolean;
}

interface TipItem {
  icon: 'check' | 'bulb' | 'stop';
  text: string;
  highlight?: string;
}

const tips: TipItem[] = [
  {
    icon: 'check',
    text: 'Laissez votre enfant ',
    highlight: 'déplacer les disques par lui-même',
  },
  {
    icon: 'bulb',
    text: 'Posez-lui des questions de logique comme\n« Comment pourrais-tu libérer le disque violet ? »',
  },
  {
    icon: 'stop',
    text: 'De ne lui dites pas les réponses si vous pouvez l\'éviter !',
  },
];

const TipIcon = ({ type }: { type: 'check' | 'bulb' | 'stop' }) => {
  const iconMap = {
    check: { bg: colors.parent.iconGreen, symbol: '✓' },
    bulb: { bg: colors.parent.iconYellow, symbol: '💡' },
    stop: { bg: colors.parent.iconRed, symbol: '🚫' },
  };

  const { bg, symbol } = iconMap[type];

  return (
    <View style={[styles.tipIcon, { backgroundColor: bg }]}>
      <Text style={styles.tipIconText}>{symbol}</Text>
    </View>
  );
};

export function ParentZone({
  progression,
  maxProgression,
  personalRecord,
  hintsRemaining,
  maxHints,
  currentMode,
  onModeChange,
  onHintPress,
  isVisible = true,
}: ParentZoneProps) {
  const animation = useSharedValue(isVisible ? 1 : 0);

  useEffect(() => {
    animation.value = withSpring(isVisible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
  }, [isVisible, animation]);

  const panelStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animation.value,
      [0, 1],
      [COLLAPSED_HEIGHT, PANEL_HEIGHT],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      animation.value,
      [0, 1],
      [PANEL_HEIGHT, 0],
      Extrapolate.CLAMP
    );

    return {
      height,
      transform: [{ translateY }],
      opacity: animation.value,
    };
  });

  return (
    <Animated.View style={[styles.container, panelStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>👨‍👩‍👧</Text>
        <Text style={styles.headerTitle}>ESPACE PARENT</Text>
        <Text style={styles.headerEmoji}>👶</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>
            Conseils pour accompagner{' '}
            <Text style={styles.tipsSubtitle}>votre enfant</Text>
          </Text>

          <View style={styles.tipsList}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <TipIcon type={tip.icon} />
                <Text style={styles.tipText}>
                  {tip.text}
                  {tip.highlight && (
                    <Text style={styles.tipHighlight}>{tip.highlight}</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Progression :</Text>
              <Text style={styles.statValue}>
                {progression} / {maxProgression}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.recordEmoji}>🏆</Text>
              <Text style={styles.statLabel}>Record perso :</Text>
              <Text style={styles.statValue}>{personalRecord}</Text>
            </View>
          </View>

          {/* Mode selector */}
          <View style={styles.modeSelector}>
            <Pressable
              style={[
                styles.modeButton,
                currentMode === 'discovery' && styles.modeButtonActive,
              ]}
              onPress={() => onModeChange('discovery')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  currentMode === 'discovery' && styles.modeButtonTextActive,
                ]}
              >
                Découverte {currentMode === 'discovery' ? '>' : ''}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                styles.modeButtonOutline,
                currentMode === 'challenge' && styles.modeButtonActive,
              ]}
              onPress={() => onModeChange('challenge')}
            >
              <Text
                style={[
                  styles.modeButtonTextOutline,
                  currentMode === 'challenge' && styles.modeButtonTextActive,
                ]}
              >
                Défi
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                styles.modeButtonOutline,
                currentMode === 'expert' && styles.modeButtonActive,
              ]}
              onPress={() => onModeChange('expert')}
            >
              <Text
                style={[
                  styles.modeButtonTextOutline,
                  currentMode === 'expert' && styles.modeButtonTextActive,
                ]}
              >
                Expert
              </Text>
            </Pressable>
          </View>

          {/* Hint button */}
          <Pressable
            style={[
              styles.hintButton,
              hintsRemaining <= 0 && styles.hintButtonDisabled,
            ]}
            onPress={onHintPress}
            disabled={hintsRemaining <= 0}
          >
            <Text style={styles.hintEmoji}>💡</Text>
            <Text style={styles.hintText}>
              Indice ({hintsRemaining}/{maxHints})
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom mode tabs */}
      <View style={styles.bottomTabs}>
        <Pressable
          style={[
            styles.bottomTab,
            currentMode === 'discovery' && styles.bottomTabActive,
          ]}
          onPress={() => onModeChange('discovery')}
        >
          <View style={styles.tabDot} />
          <Text style={styles.bottomTabText}>Découverte:</Text>
          <Text style={styles.tabSun}>☀️</Text>
        </Pressable>

        <Pressable
          style={[
            styles.bottomTab,
            currentMode === 'challenge' && styles.bottomTabActive,
          ]}
          onPress={() => onModeChange('challenge')}
        >
          <Text style={styles.bottomTabText}>Défi</Text>
        </Pressable>

        <Pressable
          style={[
            styles.bottomTab,
            currentMode === 'expert' && styles.bottomTabActive,
          ]}
          onPress={() => onModeChange('expert')}
        >
          <Text style={styles.bottomTabText}>Expert</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8DC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 2,
    borderColor: '#F5D78E',
    borderBottomWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#F5D78E',
  },
  headerEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5D4E37',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  tipsSection: {
    paddingVertical: spacing[3],
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4E37',
    marginBottom: spacing[3],
  },
  tipsSubtitle: {
    fontWeight: '400',
    color: '#8B7355',
  },
  tipsList: {
    gap: spacing[2],
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  tipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIconText: {
    fontSize: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#5D4E37',
    lineHeight: 20,
  },
  tipHighlight: {
    fontWeight: '700',
  },
  statsSection: {
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#F5D78E',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7355',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5D4E37',
  },
  recordEmoji: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  modeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  modeButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  modeButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8B7355',
  },
  modeButtonActive: {
    backgroundColor: colors.secondary.main,
    borderWidth: 0,
  },
  modeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modeButtonTextOutline: {
    color: '#5D4E37',
    fontSize: 14,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.xl,
    gap: spacing[2],
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  hintButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  hintEmoji: {
    fontSize: 20,
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F5D78E',
    backgroundColor: colors.secondary.main,
  },
  bottomTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
  bottomTabActive: {
    backgroundColor: colors.secondary.dark,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  bottomTabText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabSun: {
    fontSize: 14,
  },
});
