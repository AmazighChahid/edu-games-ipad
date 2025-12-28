/**
 * Playground - Page de test pour prévisualiser des composants isolément
 * Permet de sélectionner un composant via une recherche avec autocomplétion
 * et de naviguer dans l'arborescence des composants
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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

// Import du registre auto-généré
import {
  COMPONENT_REGISTRY,
  PlaygroundComponent,
} from '../src/playground/registry.generated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(300, SCREEN_WIDTH * 0.4);

// Types pour l'arborescence
interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  components: PlaygroundComponent[];
  isFolder: boolean;
}

// Construire l'arborescence à partir des chemins de fichiers
const buildFileTree = (components: PlaygroundComponent[]): TreeNode => {
  const root: TreeNode = {
    name: 'src',
    path: 'src',
    children: new Map(),
    components: [],
    isFolder: true,
  };

  components.forEach((comp) => {
    if (!comp.filePath) return;

    // Séparer le chemin en parties (ex: "components/common/Button.tsx")
    const parts = comp.filePath.split('/');
    let current = root;

    // Parcourir chaque partie du chemin sauf le fichier
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          children: new Map(),
          components: [],
          isFolder: true,
        });
      }
      current = current.children.get(part)!;
    }

    // Ajouter le composant au dossier parent
    current.components.push(comp);
  });

  return root;
};

// Error Boundary pour capturer les erreurs de rendu des composants
interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ComponentErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset l'erreur si on change de composant
    if (prevProps.componentName !== this.props.componentName && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.icon}>⚠️</Text>
          <Text style={errorStyles.title}>Erreur de rendu</Text>
          <Text style={errorStyles.componentName}>{this.props.componentName}</Text>
          <Text style={errorStyles.message}>
            Ce composant nécessite des props obligatoires pour fonctionner correctement.
          </Text>
          {this.state.error && (
            <View style={errorStyles.errorBox}>
              <Text style={errorStyles.errorText}>{this.state.error.message}</Text>
            </View>
          )}
          <Pressable style={errorStyles.button} onPress={this.props.onReset}>
            <Text style={errorStyles.buttonText}>Changer de composant</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

// Styles pour l'Error Boundary
const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    margin: 16,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#C53030',
    marginBottom: 8,
  },
  componentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#FED7D7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#C53030',
  },
  button: {
    backgroundColor: '#5B8DEE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

// Styles pour la prévisualisation avec info
const previewInfoStyles = StyleSheet.create({
  componentContainer: {
    minHeight: 200,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F4FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 10,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#5B8DEE',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
    overflow: 'hidden',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#5B8DEE',
    lineHeight: 18,
  },
});

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

// Icône menu hamburger
const MenuIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="#666" />
  </Svg>
);

// Icône chevron droit
const ChevronRightIcon = ({ expanded }: { expanded: boolean }) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}
  >
    <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="#666" />
  </Svg>
);

// Icône dossier
const FolderIcon = ({ open }: { open: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d={
        open
          ? 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z'
          : 'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'
      }
      fill={open ? '#5B8DEE' : '#FFB74D'}
    />
  </Svg>
);

// Icône composant
const ComponentIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="#5B8DEE"
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

export default function PlaygroundScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<PlaygroundComponent | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['src']));

  // Construire l'arborescence des fichiers
  const fileTree = useMemo(() => buildFileTree(COMPONENT_REGISTRY), []);

  // Toggle un dossier
  const toggleFolder = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

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

  // Rendu du composant sélectionné avec Error Boundary
  const renderSelectedComponent = () => {
    if (!selectedComponent) return null;

    const Component = selectedComponent.component;
    return (
      <ComponentErrorBoundary
        componentName={selectedComponent.name}
        onReset={handleClearSelection}
      >
        <View style={previewInfoStyles.componentContainer}>
          <Component {...selectedComponent.defaultProps} />
        </View>
        {/* Message d'information si le composant nécessite des props */}
        <View style={previewInfoStyles.infoBox}>
          <Text style={previewInfoStyles.infoIcon}>i</Text>
          <Text style={previewInfoStyles.infoText}>
            Ce composant peut nécessiter des props pour afficher du contenu.
            Consultez le fichier source pour les props disponibles.
          </Text>
        </View>
      </ComponentErrorBoundary>
    );
  };

  // Rendu récursif d'un noeud de l'arborescence
  const renderTreeNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedPaths.has(node.path);
    const hasChildren = node.children.size > 0 || node.components.length > 0;
    const childFolders = Array.from(node.children.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedComponents = [...node.components].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return (
      <View key={node.path}>
        {/* Dossier */}
        <Pressable
          style={({ pressed }) => [
            styles.treeItem,
            pressed && styles.treeItemPressed,
            { paddingLeft: 12 + depth * 16 },
          ]}
          onPress={() => toggleFolder(node.path)}
        >
          {hasChildren ? (
            <ChevronRightIcon expanded={isExpanded} />
          ) : (
            <View style={{ width: 16 }} />
          )}
          <FolderIcon open={isExpanded} />
          <Text style={styles.treeFolderName}>{node.name}</Text>
        </Pressable>

        {/* Contenu du dossier si ouvert */}
        {isExpanded && (
          <>
            {/* Sous-dossiers */}
            {childFolders.map((child) => renderTreeNode(child, depth + 1))}

            {/* Fichiers/Composants */}
            {sortedComponents.map((comp) => (
              <Pressable
                key={comp.id}
                style={({ pressed }) => [
                  styles.treeItem,
                  styles.treeFileItem,
                  pressed && styles.treeItemPressed,
                  selectedComponent?.id === comp.id && styles.treeItemSelected,
                  { paddingLeft: 12 + (depth + 1) * 16 },
                ]}
                onPress={() => handleSelectComponent(comp)}
              >
                <ComponentIcon />
                <Text
                  style={[
                    styles.treeFileName,
                    selectedComponent?.id === comp.id && styles.treeFileNameSelected,
                  ]}
                  numberOfLines={1}
                >
                  {comp.name}
                </Text>
              </Pressable>
            ))}
          </>
        )}
      </View>
    );
  };

  // Rendu du sidebar
  const renderSidebar = () => (
    <View style={[styles.sidebar, !isSidebarOpen && styles.sidebarClosed]}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>Explorateur</Text>
        <Pressable onPress={() => setIsSidebarOpen(false)} style={styles.sidebarCloseBtn}>
          <Text style={styles.sidebarCloseBtnText}>«</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.sidebarScroll} showsVerticalScrollIndicator={false}>
        {renderTreeNode(fileTree)}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isSidebarOpen && (
            <Pressable onPress={() => setIsSidebarOpen(true)} style={styles.menuButton}>
              <MenuIcon />
            </Pressable>
          )}
          <View>
            <Text style={styles.title}>Playground</Text>
            <Text style={styles.subtitle}>
              {selectedComponent ? selectedComponent.name : `${COMPONENT_REGISTRY.length} composants`}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <CloseIcon />
          </Pressable>
        </View>
      </View>

      {/* Layout principal */}
      <View style={styles.mainLayout}>
        {/* Sidebar */}
        {isSidebarOpen && renderSidebar()}

        {/* Contenu principal */}
        <View style={styles.mainContent}>
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
                  Sélectionne un composant dans l&apos;arborescence ou utilise la recherche
                </Text>
                <View style={styles.tipContainer}>
                  <Text style={styles.tipText}>
                    Pour actualiser la liste:
                  </Text>
                  <Text style={styles.tipCode}>npm run generate:playground</Text>
                </View>
              </View>
            )}
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
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
  // Layout principal
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
  // Sidebar styles
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E8ECF0',
  },
  sidebarClosed: {
    width: 0,
    overflow: 'hidden',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  sidebarCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarCloseBtnText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  sidebarScroll: {
    flex: 1,
    paddingVertical: 4,
  },
  // Tree view styles
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 12,
    gap: 4,
  },
  treeItemPressed: {
    backgroundColor: '#E8ECF0',
  },
  treeItemSelected: {
    backgroundColor: '#E8F0FF',
  },
  treeFileItem: {
    paddingVertical: 5,
  },
  treeFolderName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  treeFileName: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  treeFileNameSelected: {
    color: '#5B8DEE',
    fontWeight: '600',
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
