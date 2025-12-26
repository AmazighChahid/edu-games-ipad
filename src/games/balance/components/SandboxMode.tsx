/**
 * Sandbox Mode Component
 * Free play mode where children can experiment without objectives
 * Features: All objects available, discovery tracking, weight visibility toggle
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import type { WeightObject, Equivalence, ObjectCategory } from '../types';
import { OBJECTS_LIBRARY, SANDBOX_OBJECTS, createObject } from '../data/objects';
import { BalanceScale } from './BalanceScale';
import { DrHibou } from './DrHibou';
import {
  createInitialState,
  addObjectToPlate,
  removeObjectFromPlate,
  detectEquivalence,
} from '../logic/balanceEngine';

// ============================================
// TYPES
// ============================================

interface SandboxModeProps {
  onDiscovery?: (equivalence: Equivalence) => void;
  onExit?: () => void;
  discoveredEquivalences?: Equivalence[];
}

// ============================================
// CONSTANTS
// ============================================

const CATEGORY_INFO: Record<ObjectCategory, { label: string; emoji: string; color: string }> = {
  fruit: { label: 'Fruits', emoji: '🍎', color: colors.home.categories.numbers },
  animal: { label: 'Animaux', emoji: '🐾', color: colors.home.categories.memory },
  weight: { label: 'Poids', emoji: '🔢', color: colors.home.categories.spatial },
  unknown: { label: 'Mystère', emoji: '❓', color: colors.home.categories.logic },
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface ObjectButtonProps {
  objectId: string;
  onPress: () => void;
  showWeight: boolean;
}

function ObjectButton({ objectId, onPress, showWeight }: ObjectButtonProps) {
  const template = OBJECTS_LIBRARY[objectId];
  if (!template) return null;

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.objectButton, animatedStyle]}>
        <Text style={styles.objectEmoji}>{template.emoji}</Text>
        {showWeight && (
          <View style={styles.weightBadge}>
            <Text style={styles.weightBadgeText}>{template.value}</Text>
          </View>
        )}
        <Text style={styles.objectName}>{template.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

interface CategorySectionProps {
  category: ObjectCategory;
  objects: string[];
  onObjectPress: (objectId: string) => void;
  showWeight: boolean;
}

function CategorySection({
  category,
  objects,
  onObjectPress,
  showWeight,
}: CategorySectionProps) {
  const info = CATEGORY_INFO[category];

  return (
    <View style={styles.categorySection}>
      <View style={[styles.categoryHeader, { borderLeftColor: info.color }]}>
        <Text style={styles.categoryEmoji}>{info.emoji}</Text>
        <Text style={styles.categoryLabel}>{info.label}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.objectsRow}
      >
        {objects.map((objectId) => (
          <ObjectButton
            key={objectId}
            objectId={objectId}
            onPress={() => onObjectPress(objectId)}
            showWeight={showWeight}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface PlateObjectProps {
  object: WeightObject;
  onRemove: () => void;
}

function PlateObject({ object, onRemove }: PlateObjectProps) {
  return (
    <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={styles.plateObject}
      >
        <Text style={styles.plateObjectEmoji}>{object.emoji}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function SandboxMode({
  onDiscovery,
  onExit,
  discoveredEquivalences = [],
}: SandboxModeProps) {
  // State
  const [balanceState, setBalanceState] = useState(() => createInitialState());
  const [showWeight, setShowWeight] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');
  const [lastDiscovery, setLastDiscovery] = useState<string | null>(null);
  const [mascotContext, setMascotContext] = useState<'sandbox_start' | 'sandbox_discovery' | 'idle'>('sandbox_start');

  // Group objects by category
  const objectsByCategory = useMemo(() => {
    const groups: Record<ObjectCategory, string[]> = {
      fruit: [],
      animal: [],
      weight: [],
      unknown: [],
    };

    SANDBOX_OBJECTS.forEach((objectId) => {
      const template = OBJECTS_LIBRARY[objectId];
      if (template) {
        groups[template.type].push(objectId);
      }
    });

    return groups;
  }, []);

  // Handle adding object to balance
  const handleAddObject = useCallback((objectId: string) => {
    const newObject = createObject(objectId);
    setBalanceState((prev) => {
      const newState = addObjectToPlate(prev, newObject, selectedSide);

      // Check for equivalence discovery
      if (newState.isBalanced) {
        const equivalenceStr = detectEquivalence(
          newState.leftPlate.objects,
          newState.rightPlate.objects
        );

        if (equivalenceStr && equivalenceStr !== lastDiscovery) {
          setLastDiscovery(equivalenceStr);
          setMascotContext('sandbox_discovery');

          // Create equivalence object
          const equivalence: Equivalence = {
            id: `eq_${Date.now()}`,
            leftSide: newState.leftPlate.objects.map((obj) => ({
              objectId: obj.id.split('_')[0], // Extract base object id
              count: 1,
            })),
            rightSide: newState.rightPlate.objects.map((obj) => ({
              objectId: obj.id.split('_')[0],
              count: 1,
            })),
            displayString: equivalenceStr,
            discoveredAt: new Date(),
          };

          onDiscovery?.(equivalence);
        }
      }

      return newState;
    });
  }, [selectedSide, lastDiscovery, onDiscovery]);

  // Handle removing object from balance
  const handleRemoveObject = useCallback((objectId: string, side: 'left' | 'right') => {
    setBalanceState((prev) => removeObjectFromPlate(prev, objectId, side));
  }, []);

  // Reset balance
  const handleReset = useCallback(() => {
    setBalanceState(createInitialState());
    setLastDiscovery(null);
    setMascotContext('idle');
  }, []);

  // Render plate content
  const renderPlateContent = (side: 'left' | 'right') => {
    const plate = side === 'left' ? balanceState.leftPlate : balanceState.rightPlate;

    return (
      <View style={styles.plateContentWrapper}>
        {plate.objects.map((obj) => (
          <PlateObject
            key={obj.id}
            object={obj}
            onRemove={() => handleRemoveObject(obj.id, side)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'} Retour</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mode Libre</Text>
          <Text style={styles.subtitle}>Expérimente librement !</Text>
        </View>

        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Vider</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Scale */}
      <View style={styles.balanceContainer}>
        <BalanceScale
          balanceState={balanceState}
          leftPlateContent={renderPlateContent('left')}
          rightPlateContent={renderPlateContent('right')}
          showWeightIndicators={showWeight}
          onVictory={() => {
            // Victory handled in handleAddObject
          }}
        />
      </View>

      {/* Side selector */}
      <View style={styles.sideSelector}>
        <TouchableOpacity
          style={[
            styles.sideButton,
            selectedSide === 'left' && styles.sideButtonActive,
          ]}
          onPress={() => setSelectedSide('left')}
        >
          <Text style={[
            styles.sideButtonText,
            selectedSide === 'left' && styles.sideButtonTextActive,
          ]}>
            Gauche
          </Text>
        </TouchableOpacity>

        <View style={styles.sideDivider} />

        <TouchableOpacity
          style={[
            styles.sideButton,
            selectedSide === 'right' && styles.sideButtonActive,
          ]}
          onPress={() => setSelectedSide('right')}
        >
          <Text style={[
            styles.sideButtonText,
            selectedSide === 'right' && styles.sideButtonTextActive,
          ]}>
            Droite
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weight visibility toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Voir les poids</Text>
        <Switch
          value={showWeight}
          onValueChange={setShowWeight}
          trackColor={{
            false: colors.ui.disabled,
            true: colors.primary.light,
          }}
          thumbColor={showWeight ? colors.primary.main : '#f4f3f4'}
        />
      </View>

      {/* Objects palette */}
      <ScrollView
        style={styles.objectsPalette}
        contentContainerStyle={styles.objectsPaletteContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Fruits */}
        {objectsByCategory.fruit.length > 0 && (
          <CategorySection
            category="fruit"
            objects={objectsByCategory.fruit}
            onObjectPress={handleAddObject}
            showWeight={showWeight}
          />
        )}

        {/* Animals */}
        {objectsByCategory.animal.length > 0 && (
          <CategorySection
            category="animal"
            objects={objectsByCategory.animal}
            onObjectPress={handleAddObject}
            showWeight={showWeight}
          />
        )}

        {/* Weights */}
        {objectsByCategory.weight.length > 0 && (
          <CategorySection
            category="weight"
            objects={objectsByCategory.weight}
            onObjectPress={handleAddObject}
            showWeight={showWeight}
          />
        )}
      </ScrollView>

      {/* Dr. Hibou mascot */}
      <View style={styles.mascotContainer}>
        <DrHibou
          context={mascotContext}
          mood={balanceState.isBalanced ? 'celebratory' : 'curious'}
          size="small"
          position="right"
          autoHideDelay={5000}
          onMessageDismiss={() => setMascotContext('idle')}
        />
      </View>

      {/* Discovery notification */}
      {balanceState.isBalanced && lastDiscovery && (
        <Animated.View
          entering={SlideInUp.springify()}
          exiting={FadeOut}
          style={styles.discoveryBanner}
        >
          <Text style={styles.discoveryEmoji}>🔬</Text>
          <View>
            <Text style={styles.discoveryTitle}>Découverte !</Text>
            <Text style={styles.discoveryText}>{lastDiscovery}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[3],
    backgroundColor: colors.background.card,
    ...shadows.small,
  },
  backButton: {
    paddingVertical: spacing[2],
    paddingRight: spacing[3],
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary.main,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  resetButton: {
    backgroundColor: colors.feedback.warning,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.medium,
  },
  resetButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  // Balance
  balanceContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateContentWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  plateObject: {
    padding: 2,
  },
  plateObjectEmoji: {
    fontSize: 24,
  },

  // Side selector
  sideSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.large,
    ...shadows.small,
  },
  sideButton: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    borderRadius: borderRadius.large,
  },
  sideButtonActive: {
    backgroundColor: colors.primary.main,
  },
  sideButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  sideButtonTextActive: {
    color: colors.text.inverse,
  },
  sideDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.ui.divider,
  },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },

  // Objects palette
  objectsPalette: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.medium,
  },
  objectsPaletteContent: {
    padding: spacing[4],
    paddingBottom: 100,
  },
  categorySection: {
    marginBottom: spacing[4],
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
    paddingLeft: spacing[2],
    borderLeftWidth: 4,
    borderRadius: 2,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  objectsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[1],
  },
  objectButton: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.medium,
    padding: spacing[2],
    alignItems: 'center',
    minWidth: 70,
    ...shadows.small,
  },
  objectEmoji: {
    fontSize: 32,
    marginBottom: spacing[1],
  },
  objectName: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  weightBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primary.main,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightBadgeText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: '700',
  },

  // Mascot
  mascotContainer: {
    position: 'absolute',
    bottom: 120,
    right: spacing[4],
  },

  // Discovery banner
  discoveryBanner: {
    position: 'absolute',
    top: 100,
    left: spacing[4],
    right: spacing[4],
    backgroundColor: colors.feedback.success,
    borderRadius: borderRadius.large,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    ...shadows.medium,
  },
  discoveryEmoji: {
    fontSize: 32,
  },
  discoveryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  discoveryText: {
    fontSize: 20,
    color: colors.text.inverse,
    marginTop: 2,
  },
});

export default SandboxMode;
