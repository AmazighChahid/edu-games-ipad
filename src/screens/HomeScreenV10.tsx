/**
 * HomeScreen V10 - "Forêt Immersive"
 * Immersive animated forest background with floating widgets and game grid
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForestBackgroundV10, CategoryFilterBar, CategoryFilterId } from '../components/home-v10';
import { HomeV10Layout } from '../theme/home-v10-colors';

export const HomeScreenV10: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterId>('all');

  const handleCategoryChange = useCallback((category: CategoryFilterId) => {
    setSelectedCategory(category);
    // TODO: Filtrer les jeux selon la catégorie sélectionnée
  }, []);

  return (
    <View style={styles.container}>
      {/* Background immersif */}
      <ForestBackgroundV10>
        {/* Contenu scrollable */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + HomeV10Layout.headerPaddingVertical,
              paddingBottom: insets.bottom + HomeV10Layout.gamesSectionPaddingBottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Placeholder pour le header - sera implémenté en Phase 5-6 */}
          <View style={styles.headerPlaceholder}>
            <Text style={styles.placeholderText}>Header V10 (Phase 6)</Text>
          </View>

          {/* Zone de jeux avec padding top pour laisser l'espace aux widgets flottants */}
          <View style={styles.gamesSection}>
            <Text style={styles.placeholderText}>Games Grid (Phase 6)</Text>
            <Text style={styles.subText}>
              Le background V10 est prêt !{'\n'}
              Les prochaines phases ajouteront :{'\n'}
              - Piou volant avec bulle{'\n'}
              - Collection flottante{'\n'}
              - Animaux animés{'\n'}
              - Header et grille de jeux
            </Text>
          </View>
        </ScrollView>

        {/* Barre de filtres par catégorie en bas */}
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </ForestBackgroundV10>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerPlaceholder: {
    paddingHorizontal: HomeV10Layout.screenPadding,
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: HomeV10Layout.screenPadding,
    borderRadius: 16,
    marginBottom: 20,
  },
  gamesSection: {
    paddingTop: HomeV10Layout.gamesSectionPaddingTop,
    paddingHorizontal: HomeV10Layout.gamesSectionPaddingH,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});

export default HomeScreenV10;
