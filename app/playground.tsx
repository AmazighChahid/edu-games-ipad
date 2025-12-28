/**
 * Playground - Page de test pour prévisualiser des composants isolément
 * Permet de sélectionner un composant via une recherche avec autocomplétion
 *
 * IMPORTANT: Le registre des composants est généré automatiquement.
 * Pour actualiser, exécutez: npm run generate:playground
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

// Import du registre auto-généré
import {
  COMPONENT_REGISTRY,
  PlaygroundComponent,
} from '../src/playground/registry.generated';

// Icône de fermeture
const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="#666"
    />
  </Svg>
);

// Icône de recherche
const SearchIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill="#999"
    />
  </Svg>
);

export default function PlaygroundScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<PlaygroundComponent | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filtrer les composants selon la recherche
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return COMPONENT_REGISTRY;

    const query = searchQuery.toLowerCase();
    return COMPONENT_REGISTRY.filter(
      (comp) =>
        comp.name.toLowerCase().includes(query) ||
        comp.category.toLowerCase().includes(query) ||
        comp.description?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Grouper par catégorie
  const groupedComponents = useMemo(() => {
    const groups: Record<string, PlaygroundComponent[]> = {};
    filteredComponents.forEach((comp) => {
      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category].push(comp);
    });
    return groups;
  }, [filteredComponents]);

  const handleSelectComponent = useCallback((comp: PlaygroundComponent) => {
    setSelectedComponent(comp);
    setSearchQuery('');
    setIsSearchFocused(false);
  }, []);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleClearSelection = useCallback(() => {
    setSelectedComponent(null);
  }, []);

  // Rendu du composant sélectionné
  const renderSelectedComponent = () => {
    if (!selectedComponent) return null;

    const Component = selectedComponent.component;
    return <Component {...selectedComponent.defaultProps} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>🎨 Playground</Text>
          <Text style={styles.subtitle}>
            {selectedComponent ? selectedComponent.name : `${COMPONENT_REGISTRY.length} composants disponibles`}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <CloseIcon />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un composant..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearch}>
              <Text style={styles.clearSearchText}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Dropdown de résultats */}
        {isSearchFocused && filteredComponents.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
              {Object.entries(groupedComponents).map(([category, components]) => (
                <View key={category}>
                  <Text style={styles.categoryHeader}>{category}</Text>
                  {components.map((comp) => (
                    <Pressable
                      key={comp.id}
                      style={({ pressed }) => [
                        styles.dropdownItem,
                        pressed && styles.dropdownItemPressed,
                      ]}
                      onPress={() => handleSelectComponent(comp)}
                    >
                      <View style={styles.dropdownItemHeader}>
                        <Text style={styles.dropdownItemName}>{comp.name}</Text>
                        <Text style={styles.dropdownItemCategory}>{comp.category}</Text>
                      </View>
                      {comp.filePath && (
                        <Text style={styles.dropdownItemPath}>{comp.filePath}</Text>
                      )}
                      {comp.description && (
                        <Text style={styles.dropdownItemDesc}>{comp.description}</Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Preview Area */}
      <View style={styles.previewContainer}>
        {selectedComponent ? (
          <>
            <View style={styles.previewHeader}>
              <View style={styles.componentInfo}>
                <Text style={styles.componentCategory}>{selectedComponent.category}</Text>
                <Text style={styles.componentName}>{selectedComponent.name}</Text>
                {selectedComponent.filePath && (
                  <Text style={styles.componentPath}>{selectedComponent.filePath}</Text>
                )}
              </View>
              <Pressable onPress={handleClearSelection} style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Changer</Text>
              </Pressable>
            </View>
            <ScrollView
              style={styles.previewScroll}
              contentContainerStyle={styles.previewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.componentWrapper}>
                {renderSelectedComponent()}
              </View>
            </ScrollView>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔍</Text>
            <Text style={styles.emptyStateTitle}>Aucun composant sélectionné</Text>
            <Text style={styles.emptyStateText}>
              Utilise la barre de recherche ci-dessus pour trouver et prévisualiser un composant
            </Text>
            <View style={styles.tipContainer}>
              <Text style={styles.tipText}>
                💡 Pour actualiser la liste des composants:
              </Text>
              <Text style={styles.tipCode}>npm run generate:playground</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  headerLeft: {
    gap: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: '#5B8DEE',
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearSearch: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 16,
    color: '#999',
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    maxHeight: 350,
    zIndex: 1000,
  },
  dropdownScroll: {
    padding: 8,
  },
  categoryHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemPressed: {
    backgroundColor: '#F0F4FF',
  },
  dropdownItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  dropdownItemCategory: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B8DEE',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dropdownItemPath: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  dropdownItemDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  componentInfo: {
    gap: 2,
  },
  componentCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B8DEE',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  componentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  componentPath: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B8DEE',
  },
  previewScroll: {
    flex: 1,
  },
  previewContent: {
    padding: 20,
    paddingBottom: 100,
  },
  componentWrapper: {
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  tipContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 13,
    color: '#5B8DEE',
    marginBottom: 8,
  },
  tipCode: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#333',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
