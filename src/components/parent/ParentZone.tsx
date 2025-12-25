/**
 * ParentZone component
 * Clean sliding panel for parent tips and settings
 */

import { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { colors, spacing, borderRadius } from '@/theme';

const PANEL_HEIGHT = 280;
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
    check: { bg: '#4ADE80', symbol: '✓' },
    bulb: { bg: '#FBBF24', symbol: '?' },
    stop: { bg: '#F87171', symbol: '!' },
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
    backgroundColor: '#FFFBF0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    backgroundColor: '#FFF5E0',
  },
  headerEmoji: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  tipsSection: {
    paddingVertical: spacing[3],
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5D4E37',
    marginBottom: spacing[3],
  },
  tipsSubtitle: {
    fontWeight: '400',
    color: '#8B7355',
  },
  tipsList: {
    gap: spacing[3],
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  tipIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipIconText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#5D4E37',
    lineHeight: 19,
  },
  tipHighlight: {
    fontWeight: '600',
  },
  statsSection: {
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#F0E6D6',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing[4],
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#8B7355',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5D4E37',
    marginTop: 2,
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
    backgroundColor: '#FFA94D',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: 16,
  },
  modeButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#D4C5B0',
  },
  modeButtonActive: {
    backgroundColor: '#FFA94D',
    borderWidth: 0,
  },
  modeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  modeButtonTextOutline: {
    color: '#8B7355',
    fontSize: 13,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBBF24',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: 20,
    gap: spacing[2],
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  hintButtonDisabled: {
    backgroundColor: '#E0D5C5',
    opacity: 0.7,
  },
  hintEmoji: {
    fontSize: 18,
  },
  hintText: {
    color: '#5D4E37',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFA94D',
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
    backgroundColor: '#E8943D',
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  bottomTabText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabSun: {
    fontSize: 12,
  },
});
