/**
 * LogixGrid Component
 *
 * Grille interactive pour le jeu de logique
 * Refactorisé avec theme et tailles minimales pour touch targets
 * Utilise onLayout pour s'adapter dynamiquement à l'espace disponible
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { theme } from '../../../theme';
import { Icons } from '../../../constants/icons';
import { useAccessibilityAnimations } from '../../../hooks';
import type { LogixGameState, Category, CellState } from '../types';
import { GridCell } from './GridCell';

// ============================================================================
// TYPES
// ============================================================================

interface LogixGridProps {
  /** Etat du jeu */
  gameState: LogixGameState;
  /** Erreurs dans la grille */
  errors: Array<{ rowItemId: string; colItemId: string }>;
  /** Callback toggle cellule */
  onCellToggle: (rowItemId: string, colItemId: string) => void;
  /** Callback selection cellule */
  onCellSelect: (rowItemId: string | null, colItemId: string | null) => void;
  /** Obtient l'etat d'une cellule */
  getCellState: (rowItemId: string, colItemId: string) => CellState;
  /** Afficher la legende en bas de la grille */
  showLegend?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const GRID_PADDING = 12;
const MIN_CELL_SIZE = 48; // Taille minimum pour touch targets enfants (48dp)
const HEADER_SIZE = 50; // Taille FIXE pour l'en-tête (ligne emoji du haut) et la colonne emoji
const GRID_WIDTH_RATIO = 0.95; // La grille utilise 95% de l'espace disponible

// ============================================================================
// COMPONENT
// ============================================================================

export function LogixGrid({
  gameState,
  errors,
  onCellToggle,
  onCellSelect,
  getCellState,
  showLegend = false,
}: LogixGridProps) {
  const { shouldAnimate } = useAccessibilityAnimations();
  const { puzzle, selectedCell, activeHint } = gameState;

  // État pour les dimensions du conteneur (mesurées dynamiquement)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Callback pour mesurer les dimensions du conteneur
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== containerSize.width || height !== containerSize.height) {
      setContainerSize({ width, height });
    }
  };

  // Calculer la taille des cellules basée sur l'espace disponible
  const categories = puzzle.categories;
  const itemCount = categories[0]?.items.length ?? 3;
  const categoryCount = categories.length;

  // Nombre de sections de grille selon le nombre de catégories
  // 2 catégories = 1 grille, 3 catégories = 3 grilles
  const gridSectionCount = categoryCount >= 3 ? 3 : 1;

  // Utiliser les dimensions du conteneur
  const availableWidth = containerSize.width > 0
    ? (containerSize.width - GRID_PADDING * 2) * GRID_WIDTH_RATIO
    : 400;
  const availableHeight = containerSize.height > 0
    ? (containerSize.height - GRID_PADDING * 2) * 0.9
    : 400;

  // Calculer la taille des cellules pour remplir l'espace
  // En soustrayant l'espace pour les headers fixes
  const cellsWidth = availableWidth - HEADER_SIZE; // Soustraire la colonne d'emojis

  // Pour la hauteur, on doit tenir compte de TOUTES les grilles + leurs headers + séparateurs
  const totalRows = itemCount * gridSectionCount; // Nombre total de lignes de cellules
  const totalHeaders = gridSectionCount; // Un header par section
  const separatorHeight = gridSectionCount > 1 ? (gridSectionCount - 1) * 16 : 0; // Espace pour séparateurs (réduit)
  const cellsHeight = availableHeight - (HEADER_SIZE * totalHeaders) - separatorHeight;

  const cellSizeFromWidth = Math.floor(cellsWidth / itemCount);
  const cellSizeFromHeight = Math.floor(cellsHeight / totalRows);

  // Prendre la plus petite des deux pour que ça rentre, mais respecter le minimum
  const cellSize = Math.max(MIN_CELL_SIZE, Math.min(cellSizeFromWidth, cellSizeFromHeight));

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
    <View style={styles.container} onLayout={handleLayout}>
      <ScrollView
        style={styles.scrollContainer}
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
              <View style={[styles.cornerCell, { width: HEADER_SIZE, height: HEADER_SIZE }]} />
              {categories[1].items.map((item) => (
                <View
                  key={item.id}
                  style={[styles.headerCell, { width: cellSize, height: HEADER_SIZE }]}
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
                  style={[styles.rowLabelCell, { width: HEADER_SIZE, height: cellSize }]}
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
                  <View style={[styles.cornerCell, { width: HEADER_SIZE, height: HEADER_SIZE }]} />
                  {categories[2].items.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.headerCell, { width: cellSize, height: HEADER_SIZE }]}
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
                      style={[styles.rowLabelCell, { width: HEADER_SIZE, height: cellSize }]}
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
                  <View style={[styles.cornerCell, { width: HEADER_SIZE, height: HEADER_SIZE }]} />
                  {categories[2].items.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.headerCell, { width: cellSize, height: HEADER_SIZE }]}
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
                      style={[styles.rowLabelCell, { width: HEADER_SIZE, height: cellSize }]}
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

          {/* Legende */}
          {showLegend && (
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, styles.legendIconYes]}>
                  <Text style={styles.legendIconText}>{Icons.checkmark}</Text>
                </View>
                <Text style={styles.legendText}>= Oui</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, styles.legendIconNo]}>
                  <Text style={styles.legendIconText}>{Icons.crossMark}</Text>
                </View>
                <Text style={styles.legendText}>= Non</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
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
    width: '100%',
    height: '100%',
    padding: GRID_PADDING,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridSection: {
    // Glass effect - iOS Liquid Glass Style
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 28,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // Shadow for glass effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  sectionSeparator: {
    height: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    marginBottom: theme.spacing[1],
    marginTop: theme.spacing[1],
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
    fontSize: 24, // Taille augmentee pour lisibilite
  },

  // Legende
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[8],
    marginTop: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: theme.borderRadius.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  legendIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendIconYes: {
    backgroundColor: '#E8F5E9',
  },
  legendIconNo: {
    backgroundColor: '#FFEBEE',
  },
  legendIconText: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.bold,
  },
  legendText: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fontFamily.medium,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
});

export default LogixGrid;
