/**
 * Panneau Espace Parent
 * Panneau coulissant avec conseils et modes de jeu
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Layout } from '../../../constants';
import { GameMode, GAME_MODES } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = 320;
const COLLAPSED_HEIGHT = 50;

interface ParentPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  progress: number;
  optimal: number;
  personalBest: number | null;
  hintsRemaining: number;
  maxHints: number;
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onHint: () => void;
  hintsEnabled: boolean;
}

export const ParentPanel: React.FC<ParentPanelProps> = ({
  isOpen,
  onToggle,
  progress,
  optimal,
  personalBest,
  hintsRemaining,
  maxHints,
  gameMode,
  onModeChange,
  onHint,
  hintsEnabled,
}) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withSpring(isOpen ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
  }, [isOpen]);

  const panelStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animation.value,
      [0, 1],
      [COLLAPSED_HEIGHT, PANEL_HEIGHT],
      Extrapolate.CLAMP
    );

    return {
      height,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [
        {
          translateY: interpolate(
            animation.value,
            [0, 1],
            [20, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, panelStyle]}>
      {/* Header avec poignée */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        accessibilityLabel={isOpen ? "Fermer l'espace parent" : "Ouvrir l'espace parent"}
        accessibilityRole="button"
      >
        <View style={styles.headerContent}>
          <Text style={styles.parentIcon}>{'👨‍👩‍👧'}</Text>
          <Text style={styles.headerTitle}>ESPACE PARENT</Text>
          <Text style={styles.parentIcon}>{'👶'}</Text>
        </View>
        <Animated.Text style={[styles.chevron, chevronStyle]}>{'▼'}</Animated.Text>
      </TouchableOpacity>

      {/* Contenu du panneau */}
      <Animated.View style={[styles.content, contentStyle]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Section Conseils */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Conseils pour accompagner votre enfant
            </Text>

            <View style={styles.tipRow}>
              <Text style={styles.tipIcon}>{'✅'}</Text>
              <Text style={styles.tipText}>
                Laissez votre enfant <Text style={styles.tipBold}>déplacer les disques par lui-même</Text>
              </Text>
            </View>

            <View style={styles.tipRow}>
              <Text style={styles.tipIcon}>{'💡'}</Text>
              <Text style={styles.tipText}>
                Posez-lui des questions de logique comme{'\n'}
                <Text style={styles.tipQuote}>« Comment pourrais-tu libérer le disque violet ? »</Text>
              </Text>
            </View>

            <View style={styles.tipRow}>
              <Text style={styles.tipIcon}>{'🚫'}</Text>
              <Text style={styles.tipText}>
                De ne lui dites pas les réponses si vous pouvez l'éviter !
              </Text>
            </View>
          </View>

          {/* Section Stats et Progression */}
          <View style={styles.statsSection}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Progression :</Text>
              <Text style={styles.statValue}>{progress} / {optimal}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Record perso :</Text>
              <Text style={styles.statValue}>
                <Text style={styles.trophyIcon}>{'🏆'}</Text>
                {' '}{personalBest || 0}
              </Text>
            </View>
          </View>

          {/* Section Modes de jeu */}
          <View style={styles.modesSection}>
            <View style={styles.modesRow}>
              {GAME_MODES.map((mode) => {
                const isActive = gameMode === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.modeChip,
                      isActive && styles.modeChipActive,
                    ]}
                    onPress={() => onModeChange(mode.id)}
                  >
                    <Text
                      style={[
                        styles.modeChipText,
                        isActive && styles.modeChipTextActive,
                      ]}
                    >
                      {mode.label}
                    </Text>
                    {isActive && mode.id === 'discovery' && (
                      <Text style={styles.modeChevron}>{'>'}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bouton Indice */}
          {hintsEnabled && (
            <TouchableOpacity
              style={[
                styles.hintButton,
                hintsRemaining <= 0 && styles.hintButtonDisabled,
              ]}
              onPress={onHint}
              disabled={hintsRemaining <= 0}
              accessibilityLabel={`Utiliser un indice. ${hintsRemaining} restants sur ${maxHints}`}
            >
              <Text style={styles.hintButtonIcon}>{'💡'}</Text>
              <Text style={styles.hintButtonText}>
                Indice ({hintsRemaining}/{maxHints})
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: Colors.parent.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 2,
    borderColor: Colors.parent.border,
    borderBottomWidth: 0,
    overflow: 'hidden',
    ...Layout.shadow.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.parent.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parentIcon: {
    fontSize: 18,
    marginHorizontal: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.parent.text,
    letterSpacing: 1,
  },
  chevron: {
    fontSize: 14,
    color: Colors.parent.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.parent.text,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 20,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.parent.text,
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '700',
  },
  tipQuote: {
    fontStyle: 'italic',
    color: Colors.parent.textLight,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.parent.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.parent.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.parent.text,
  },
  trophyIcon: {
    fontSize: 14,
  },
  modesSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.parent.border,
  },
  modesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: Colors.parent.border,
  },
  modeChipActive: {
    backgroundColor: Colors.secondary.medium,
    borderColor: Colors.secondary.dark,
  },
  modeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.parent.text,
  },
  modeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modeChevron: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 4,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary.medium,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
    marginVertical: 12,
    alignSelf: 'center',
    ...Layout.shadow.small,
  },
  hintButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  hintButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  hintButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
