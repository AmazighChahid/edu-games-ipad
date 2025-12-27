/**
 * Equivalence Journal Component
 * Displays discovered equivalences in a beautiful notebook-style interface
 * Children can review and celebrate their discoveries
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '../../../theme';
import type { Equivalence, Phase } from '../types';
import { OBJECTS_LIBRARY } from '../data/objects';

// ============================================
// TYPES
// ============================================

interface EquivalenceJournalProps {
  equivalences: Equivalence[];
  isVisible: boolean;
  onClose: () => void;
  currentPhase?: Phase;
}

interface JournalEntryProps {
  equivalence: Equivalence;
  index: number;
  onPress?: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const PHASE_COLORS: Record<Phase, string> = {
  1: colors.home.categories.numbers,    // Green for fruits
  2: colors.home.categories.logic,      // Blue for equivalences
  3: colors.home.categories.spatial,    // Purple for numbers
  4: colors.home.categories.memory,     // Orange for equations
};

const PHASE_TITLES: Record<Phase, string> = {
  1: 'Objets Identiques',
  2: 'Équivalences',
  3: 'Nombres',
  4: 'Équations',
};

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Individual journal entry with animation
 */
function JournalEntry({ equivalence, index, onPress }: JournalEntryProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Format left side emojis
  const leftEmojis = equivalence.leftSide
    .map(item => {
      const obj = OBJECTS_LIBRARY[item.objectId];
      if (!obj) return '';
      return Array(item.count).fill(obj.emoji).join('');
    })
    .join(' ');

  // Format right side emojis
  const rightEmojis = equivalence.rightSide
    .map(item => {
      const obj = OBJECTS_LIBRARY[item.objectId];
      if (!obj) return '';
      return Array(item.count).fill(obj.emoji).join('');
    })
    .join(' ');

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 100).springify()}
      style={styles.entryContainer}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.entry, animatedStyle]}>
          {/* Entry number badge */}
          <View style={styles.entryBadge}>
            <Text style={styles.entryBadgeText}>{index + 1}</Text>
          </View>

          {/* Equivalence display */}
          <View style={styles.equivalenceRow}>
            <View style={styles.equivalenceSide}>
              <Text style={styles.emojiText}>{leftEmojis}</Text>
            </View>

            <View style={styles.equalsSign}>
              <Text style={styles.equalsText}>=</Text>
            </View>

            <View style={styles.equivalenceSide}>
              <Text style={styles.emojiText}>{rightEmojis}</Text>
            </View>
          </View>

          {/* Discovery info */}
          {equivalence.discoveredAt && (
            <View style={styles.discoveryInfo}>
              <Text style={styles.discoveryText}>
                Niveau {equivalence.discoveredInLevel || '?'}
              </Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

/**
 * Empty state when no discoveries yet
 */
function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📖</Text>
      <Text style={styles.emptyTitle}>Ton journal est vide!</Text>
      <Text style={styles.emptyText}>
        Équilibre la balance pour découvrir{'\n'}
        de nouvelles équivalences!
      </Text>
    </View>
  );
}

/**
 * Journal header with stats
 */
function JournalHeader({
  totalCount,
  onClose,
}: {
  totalCount: number;
  onClose: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerEmoji}>📖</Text>
        <View>
          <Text style={styles.headerTitle}>Mon Journal</Text>
          <Text style={styles.headerSubtitle}>
            {totalCount} découverte{totalCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Phase section header
 */
function PhaseSection({ phase, count }: { phase: Phase; count: number }) {
  return (
    <View style={[styles.phaseSection, { borderLeftColor: PHASE_COLORS[phase] }]}>
      <View
        style={[styles.phaseIcon, { backgroundColor: PHASE_COLORS[phase] }]}
      >
        <Text style={styles.phaseIconText}>
          {phase === 1 ? '🍎' : phase === 2 ? '⚖️' : phase === 3 ? '🔢' : '❓'}
        </Text>
      </View>
      <View>
        <Text style={styles.phaseName}>{PHASE_TITLES[phase]}</Text>
        <Text style={styles.phaseCount}>
          {count} équivalence{count !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function EquivalenceJournal({
  equivalences,
  isVisible,
  onClose,
  currentPhase,
}: EquivalenceJournalProps) {
  const [selectedEquivalence, setSelectedEquivalence] =
    useState<Equivalence | null>(null);

  // Group equivalences by phase (mock - would need phase info in Equivalence)
  const groupedEquivalences = React.useMemo(() => {
    // For now, just return all equivalences as a flat list
    // In production, you'd group by phase based on when they were discovered
    return equivalences;
  }, [equivalences]);

  const handleEntryPress = useCallback((equivalence: Equivalence) => {
    setSelectedEquivalence(equivalence);
    // Could show a detail modal or play animation
  }, []);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Notebook background texture */}
        <View style={styles.notebookBackground}>
          {/* Spiral binding holes */}
          <View style={styles.spiralBinding}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} style={styles.spiralHole} />
            ))}
          </View>

          {/* Red margin line */}
          <View style={styles.marginLine} />
        </View>

        {/* Header */}
        <JournalHeader totalCount={equivalences.length} onClose={onClose} />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {equivalences.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Journal entries */}
              {equivalences.map((equivalence, index) => (
                <JournalEntry
                  key={equivalence.id}
                  equivalence={equivalence}
                  index={index}
                  onPress={() => handleEntryPress(equivalence)}
                />
              ))}

              {/* Fun footer */}
              <Animated.View
                entering={FadeIn.delay(equivalences.length * 100 + 200)}
                style={styles.footer}
              >
                <Text style={styles.footerText}>
                  Continue à jouer pour{'\n'}découvrir plus d'équivalences!
                </Text>
                <Text style={styles.footerEmoji}>🎉⚖️🎉</Text>
              </Animated.View>
            </>
          )}
        </ScrollView>

        {/* Decoration - Owl stamp */}
        <View style={styles.owlStamp}>
          <Text style={styles.owlStampText}>🦉</Text>
          <Text style={styles.owlStampLabel}>Approuvé par{'\n'}Dr. Hibou</Text>
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC', // Cornsilk - notebook paper color
  },

  // Notebook decorations
  notebookBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  spiralBinding: {
    position: 'absolute',
    left: 30,
    top: 80,
    bottom: 40,
    width: 20,
    justifyContent: 'space-evenly',
  },
  spiralHole: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D4D4D4',
    borderWidth: 2,
    borderColor: '#A0A0A0',
  },
  marginLine: {
    position: 'absolute',
    left: 60,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FFB6C1', // Light pink
    opacity: 0.6,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
    backgroundColor: 'rgba(255, 248, 220, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  headerEmoji: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.text.secondary,
    fontWeight: '600',
  },

  // Scroll view
  scrollView: {
    flex: 1,
    marginLeft: 70, // Account for spiral binding
  },
  scrollContent: {
    padding: spacing[4],
    paddingBottom: 120,
  },

  // Phase sections
  phaseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
    marginTop: spacing[4],
    paddingLeft: spacing[3],
    borderLeftWidth: 4,
    borderRadius: 2,
  },
  phaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseIconText: {
    fontSize: 20,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  phaseCount: {
    fontSize: 12,
    color: colors.text.secondary,
  },

  // Journal entries
  entryContainer: {
    marginBottom: spacing[3],
  },
  entry: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.medium,
    padding: spacing[4],
    ...shadows.small,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  entryBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: colors.primary.main,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  entryBadgeText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: '700',
  },
  equivalenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  equivalenceSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  emojiText: {
    fontSize: 28,
    textAlign: 'center',
  },
  equalsSign: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.feedback.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  equalsText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  discoveryInfo: {
    marginTop: spacing[2],
    alignItems: 'center',
  },
  discoveryText: {
    fontSize: 11,
    color: colors.text.muted,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    marginTop: spacing[4],
  },
  footerText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerEmoji: {
    fontSize: 32,
    marginTop: spacing[3],
  },

  // Owl stamp decoration
  owlStamp: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    opacity: 0.8,
    transform: [{ rotate: '-10deg' }],
  },
  owlStampText: {
    fontSize: 40,
  },
  owlStampLabel: {
    fontSize: 10,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default EquivalenceJournal;
