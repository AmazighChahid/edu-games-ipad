/**
 * LogixGrid Component
 *
 * Grille interactive pour le jeu de logique
 * Refactorisé avec theme et tailles minimales pour touch targets
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { theme } from '../../../theme';
import { useAccessibilityAnimations } from '../../../hooks';
import type { LogixGameState, Category, CellState } from '../types';
import { GridCell } from './GridCell';

// ============================================================================
// TYPES
// ============================================================================

interface LogixGridProps {
  /** État du jeu */
  gameState: LogixGameState;
  /** Erreurs dans la grille */
  errors: Array<{ rowItemId: string; colItemId: string }>;
  /** Callback toggle cellule */
  onCellToggle: (rowItemId: string, colItemId: string) => void;
  /** Callback sélection cellule */
  onCellSelect: (rowItemId: string | null, colItemId: string | null) => void;
  /** Obtient l'état d'une cellule */
  getCellState: (rowItemId: string, colItemId: string) => CellState;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const MIN_CELL_SIZE = 48; // Taille minimum pour touch targets (avec margin = ~52-54dp)
const LABEL_WIDTH = 60; // Largeur des labels emoji

// ============================================================================
// COMPONENT
// ============================================================================

export function LogixGrid({
  gameState,
  errors,
  onCellToggle,
  onCellSelect,
  getCellState,
}: LogixGridProps) {
  const { shouldAnimate } = useAccessibilityAnimations();
  const { puzzle, selectedCell, activeHint } = gameState;

  // Calculer la taille des cellules
  const categories = puzzle.categories;
  const itemCount = categories[0]?.items.length ?? 3;
  const availableWidth = SCREEN_WIDTH - GRID_PADDING * 2 - LABEL_WIDTH;
  const cellSize = Math.max(MIN_CELL_SIZE, Math.floor(availableWidth / itemCount));

  // Vérifier si une cellule est en erreur
  const isCellError = (rowId: string, colId: string) => {
    return errors.some(
      (e) =>
        (e.rowItemId === rowId && e.colItemId === colId) ||
        (e.rowItemId === colId && e.colItemId === rowId)
    );
  };

  // Vérifier si une cellule est mise en évidence
  const isCellHighlighted = (rowId: string, colId: string) => {
    if (!activeHint) return false;
    return activeHint.highlightedCells.some(
      (h) =>
        (h.rowItemId === rowId && h.colItemId === colId) ||
        (h.rowItemId === colId && h.colItemId === rowId)
    );
  };

  // Vérifier si une cellule est sélectionnée
  const isCellSelected = (rowId: string, colId: string) => {
    if (!selectedCell) return false;
    return (
      (selectedCell.rowItemId === rowId && selectedCell.colItemId === colId) ||
      (selectedCell.rowItemId === colId && selectedCell.colItemId === rowId)
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={styles.gridContainer}
        entering={shouldAnimate ? FadeIn.duration(300) : undefined}
      >
        {/* Pour simplifier, affichons une grille 2D entre les 2 premières catégories */}
        {categories.length >= 2 && (
          <View style={styles.gridSection}>
            {/* Header avec les items de la deuxième catégorie */}
            <View style={styles.headerRow}>
              <View style={[styles.cornerCell, { width: LABEL_WIDTH, height: cellSize, minHeight: MIN_CELL_SIZE }]} />
              {categories[1].items.map((item) => (
                <View
                  key={item.id}
                  style={[styles.headerCell, { width: cellSize, minWidth: MIN_CELL_SIZE, minHeight: MIN_CELL_SIZE }]}
                  accessible={true}
                  accessibilityLabel={`Colonne ${item.name}`}
                >
                  <Text style={styles.headerEmoji}>{item.emoji}</Text>
                </View>
              ))}
            </View>

            {/* Lignes de la grille */}
            {categories[0].items.map((rowItem) => (
              <View key={rowItem.id} style={styles.gridRow}>
                {/* Label de la ligne */}
                <View
                  style={[styles.rowLabelCell, { width: LABEL_WIDTH, height: cellSize, minHeight: MIN_CELL_SIZE }]}
                  accessible={true}
                  accessibilityLabel={`Ligne ${rowItem.name}`}
                >
                  <Text style={styles.rowEmoji}>{rowItem.emoji}</Text>
                </View>

                {/* Cellules */}
                {categories[1].items.map((colItem) => (
                  <GridCell
                    key={`${rowItem.id}-${colItem.id}`}
                    state={getCellState(rowItem.id, colItem.id)}
                    isSelected={isCellSelected(rowItem.id, colItem.id)}
                    isError={isCellError(rowItem.id, colItem.id)}
                    isHighlighted={isCellHighlighted(rowItem.id, colItem.id)}
                    size={cellSize}
                    onPress={() => onCellToggle(rowItem.id, colItem.id)}
                    disabled={gameState.phase !== 'playing'}
                  />
                ))}
              </View>
            ))}

            {/* Si 3 catégories, afficher la section supplémentaire */}
            {categories.length >= 3 && (
              <>
                {/* Séparateur */}
                <View style={styles.sectionSeparator} />

                {/* Header pour la 3ème catégorie */}
                <View style={styles.headerRow}>
                  <View style={[styles.cornerCell, { width: LABEL_WIDTH, height: cellSize, minHeight: MIN_CELL_SIZE }]} />
                  {categories[2].items.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.headerCell, { width: cellSize, minWidth: MIN_CELL_SIZE, minHeight: MIN_CELL_SIZE }]}
                      accessible={true}
                      accessibilityLabel={`Colonne ${item.name}`}
                    >
                      <Text style={styles.headerEmoji}>{item.emoji}</Text>
                    </View>
                  ))}
                </View>

                {/* Grille catégorie 1 vs catégorie 3 */}
                {categories[0].items.map((rowItem) => (
                  <View key={`${rowItem.id}-cat3`} style={styles.gridRow}>
                    <View
                      style={[styles.rowLabelCell, { width: LABEL_WIDTH, height: cellSize, minHeight: MIN_CELL_SIZE }]}
                      accessible={true}
                      accessibilityLabel={`Ligne ${rowItem.name}`}
                    >
                      <Text style={styles.rowEmoji}>{rowItem.emoji}</Text>
                    </View>
                    {categories[2].items.map((colItem) => (
                      <GridCell
                        key={`${rowItem.id}-${colItem.id}`}
                        state={getCellState(rowItem.id, colItem.id)}
                        isSelected={isCellSelected(rowItem.id, colItem.id)}
                        isError={isCellError(rowItem.id, colItem.id)}
                        isHighlighted={isCellHighlighted(rowItem.id, colItem.id)}
                        size={cellSize}
                        onPress={() => onCellToggle(rowItem.id, colItem.id)}
                        disabled={gameState.phase !== 'playing'}
                      />
                    ))}
                  </View>
                ))}

                {/* Grille catégorie 2 vs catégorie 3 */}
                <View style={styles.sectionSeparator} />
                <View style={styles.headerRow}>
                  <View style={[styles.cornerCell, { width: LABEL_WIDTH, height: cellSize, minHeight: MIN_CELL_SIZE }]} />
                  {categories[2].items.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.headerCell, { width: cellSize, minWidth: MIN_CELL_SIZE, minHeight: MIN_CELL_SIZE }]}
                      accessible={true}
                      accessibilityLabel={`Colonne ${item.name}`}
                    >
                      <Text style={styles.headerEmoji}>{item.emoji}</Text>
                    </View>
                  ))}
                </View>
                {categories[1].items.map((rowItem) => (
                  <View key={`cat2-${rowItem.id}-cat3`} style={styles.gridRow}>
                    <View
                      style={[styles.rowLabelCell, { width: LABEL_WIDTH, height: cellSize, minHeight: MIN_CELL_SIZE }]}
                      accessible={true}
                      accessibilityLabel={`Ligne ${rowItem.name}`}
                    >
                      <Text style={styles.rowEmoji}>{rowItem.emoji}</Text>
                    </View>
                    {categories[2].items.map((colItem) => (
                      <GridCell
                        key={`${rowItem.id}-${colItem.id}`}
                        state={getCellState(rowItem.id, colItem.id)}
                        isSelected={isCellSelected(rowItem.id, colItem.id)}
                        isError={isCellError(rowItem.id, colItem.id)}
                        isHighlighted={isCellHighlighted(rowItem.id, colItem.id)}
                        size={cellSize}
                        onPress={() => onCellToggle(rowItem.id, colItem.id)}
                        disabled={gameState.phase !== 'playing'}
                      />
                    ))}
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Génère les sections de la grille à partir des catégories
 */
function generateGridSections(
  categories: Category[]
): Array<{ rowCategory: Category; colCategory: Category }> {
  const sections: Array<{ rowCategory: Category; colCategory: Category }> = [];

  for (let i = 0; i < categories.length; i++) {
    for (let j = i + 1; j < categories.length; j++) {
      sections.push({
        rowCategory: categories[i],
        colCategory: categories[j],
      });
    }
  }

  return sections;
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: GRID_PADDING,
  },
  gridContainer: {
    alignItems: 'center',
  },
  gridSection: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  sectionSeparator: {
    height: theme.spacing[4],
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: theme.spacing[2],
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  cornerCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  headerEmoji: {
    fontSize: 24, // Taille augmentée pour lisibilité
  },
  gridRow: {
    flexDirection: 'row',
  },
  rowLabelCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowEmoji: {
    fontSize: 24, // Taille augmentée pour lisibilité
  },
});

export default LogixGrid;
