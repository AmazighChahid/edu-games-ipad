/**
 * Écran Zone Parent
 * Dashboard pour les parents avec progression et paramètres
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaContainer, Button, IconButton } from '../components/core';
import { ParentalGate } from '../components/parental/ParentalGate';
import { useAppStore } from '../store';
import { Colors, Layout, Typography } from '../constants';

export const ParentZoneScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isUnlocked, setIsUnlocked] = useState(false);

  const {
    gamesCompleted,
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
    useDyslexiaFont,
    setDyslexiaFont,
    resetProgress,
  } = useAppStore();

  const handleGateSuccess = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  const handleGateCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleResetProgress = useCallback(() => {
    resetProgress();
  }, [resetProgress]);

  // Si non déverrouillé, afficher la porte parentale
  if (!isUnlocked) {
    return (
      <SafeAreaContainer>
        <ParentalGate
          onSuccess={handleGateSuccess}
          onCancel={handleGateCancel}
        />
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer backgroundColor={Colors.neutral.background}>
      {/* En-tête */}
      <View style={styles.header}>
        <IconButton
          icon="←"
          onPress={handleBack}
          size="medium"
          variant="ghost"
          accessibilityLabel="Retour"
        />
        <Text style={styles.title}>Espace Parent</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Section Progression */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progression</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Parties terminées</Text>
              <Text style={styles.statValue}>{gamesCompleted}</Text>
            </View>
          </View>
        </View>

        {/* Section Paramètres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Sons</Text>
                <Text style={styles.settingDescription}>
                  Effets sonores du jeu
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{
                  false: Colors.neutral.border,
                  true: Colors.primary.soft,
                }}
                thumbColor={soundEnabled ? Colors.primary.medium : Colors.neutral.surface}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Vibrations</Text>
                <Text style={styles.settingDescription}>
                  Retour haptique tactile
                </Text>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={setHapticEnabled}
                trackColor={{
                  false: Colors.neutral.border,
                  true: Colors.primary.soft,
                }}
                thumbColor={hapticEnabled ? Colors.primary.medium : Colors.neutral.surface}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Police Dyslexie</Text>
                <Text style={styles.settingDescription}>
                  Utiliser OpenDyslexic pour les textes
                </Text>
              </View>
              <Switch
                value={useDyslexiaFont}
                onValueChange={setDyslexiaFont}
                trackColor={{
                  false: Colors.neutral.border,
                  true: Colors.primary.soft,
                }}
                thumbColor={useDyslexiaFont ? Colors.primary.medium : Colors.neutral.surface}
              />
            </View>
          </View>
        </View>

        {/* Section À propos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              <Text style={styles.aboutBold}>Bonjour</Text> est une application éducative
              inspirée des principes Montessori, conçue pour développer la logique
              et la résolution de problèmes chez les enfants de 6 à 10 ans.
            </Text>
            <Text style={styles.aboutText}>
              La Tour de Hanoï est un puzzle classique qui encourage la planification
              et la pensée séquentielle.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Button
            label="Réinitialiser la progression"
            onPress={handleResetProgress}
            variant="outline"
            accessibilityLabel="Réinitialiser toute la progression"
            accessibilityHint="Efface toutes les données de jeu"
          />
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.neutral.text,
    marginBottom: Layout.spacing.md,
  },
  card: {
    backgroundColor: Colors.neutral.surface,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    ...Layout.shadow.small,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral.textLight,
  },
  statValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary.medium,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  settingLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral.text,
  },
  settingDescription: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral.textLight,
    marginTop: Layout.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral.border,
    marginVertical: Layout.spacing.sm,
  },
  aboutText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral.text,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
    marginBottom: Layout.spacing.md,
  },
  aboutBold: {
    fontWeight: Typography.weights.bold,
  },
});
