/**
 * Goal Editor Modal
 * Create and edit parent-defined goals
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { useStore, useActiveProfile } from '@/store';
import { GOAL_TEMPLATES } from '@/store/slices/goalsSlice';
import type { ParentGoal, GoalType } from '@/types';

interface GoalEditorProps {
  goal: ParentGoal | null;
  onClose: () => void;
}

export function GoalEditor({ goal, onClose }: GoalEditorProps) {
  const profile = useActiveProfile();
  const createGoal = useStore((state) => state.createGoal);
  const updateGoal = useStore((state) => state.updateGoal);
  const deleteGoal = useStore((state) => state.deleteGoal);

  const [selectedType, setSelectedType] = useState<GoalType>(
    goal?.type || 'levels_week'
  );
  const [title, setTitle] = useState(goal?.title || '');
  const [target, setTarget] = useState(goal?.target?.toString() || '5');

  const selectedTemplate = GOAL_TEMPLATES.find((t) => t.type === selectedType);

  const handleSave = () => {
    if (!profile) return;

    const goalData = {
      profileId: profile.id,
      title: title || selectedTemplate?.title || 'Objectif',
      description: selectedTemplate?.description,
      type: selectedType,
      target: parseInt(target, 10) || selectedTemplate?.defaultTarget || 5,
    };

    if (goal) {
      updateGoal(goal.id, goalData);
    } else {
      createGoal(goalData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (goal) {
      deleteGoal(goal.id);
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {goal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Goal Type Selection */}
        <Text style={styles.sectionTitle}>Type d'objectif</Text>
        <View style={styles.templatesGrid}>
          {GOAL_TEMPLATES.map((template) => (
            <TouchableOpacity
              key={template.type}
              style={[
                styles.templateCard,
                selectedType === template.type && styles.templateCardSelected,
              ]}
              onPress={() => {
                setSelectedType(template.type);
                setTitle(template.title);
                setTarget(template.defaultTarget.toString());
              }}
            >
              <Text style={styles.templateIcon}>{template.icon}</Text>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDescription}>
                {template.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Title */}
        <Text style={styles.sectionTitle}>Titre personnalisé</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={selectedTemplate?.title}
          placeholderTextColor={colors.text.muted}
        />

        {/* Target Value */}
        <Text style={styles.sectionTitle}>
          Objectif ({selectedTemplate?.unit || 'unités'})
        </Text>
        <View style={styles.targetSelector}>
          <TouchableOpacity
            style={styles.targetButton}
            onPress={() =>
              setTarget((prev) => Math.max(1, parseInt(prev, 10) - 1).toString())
            }
          >
            <Text style={styles.targetButtonText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.targetInput}
            value={target}
            onChangeText={setTarget}
            keyboardType="number-pad"
            textAlign="center"
          />
          <TouchableOpacity
            style={styles.targetButton}
            onPress={() =>
              setTarget((prev) => (parseInt(prev, 10) + 1).toString())
            }
          >
            <Text style={styles.targetButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Button (only for existing goals) */}
        {goal && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Supprimer cet objectif</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
    backgroundColor: colors.background.card,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.text.muted,
  },
  headerTitle: {
    fontFamily: 'Fredoka',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  content: {
    flex: 1,
    padding: spacing[5],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[3],
    marginTop: spacing[4],
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  templateCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  templateCardSelected: {
    borderColor: colors.primary.main,
    backgroundColor: 'rgba(91, 141, 238, 0.1)',
  },
  templateIcon: {
    fontSize: 28,
    marginBottom: spacing[2],
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  templateDescription: {
    fontSize: 11,
    color: colors.text.muted,
    lineHeight: 14,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  targetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  targetButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  targetInput: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  deleteButton: {
    marginTop: spacing[8],
    padding: spacing[4],
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.feedback.error,
  },
});
