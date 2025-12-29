---
description: Créer un nouveau composant UI réutilisable
argument-hint: <NomComposant> [category: common|game|parent]
---

# Création d'un Composant : $ARGUMENTS

## Documents de référence

CHARGER ces documents :

1. `@docs/UI_COMPONENTS_CATALOG.md` — Composants existants
2. `@docs/DESIGN_SYSTEM.md` — Tokens UI
3. `@docs/UI_PATTERNS.md` — Patterns à suivre

## Vérifications préalables

### Le composant existe-t-il déjà ?

Composants communs existants (NE PAS recréer) :

| Composant | Usage |
|-----------|-------|
| `PageContainer` | Wrapper de tout écran |
| `ScreenHeader` | Header standardisé |
| `BackButton` | Bouton retour |
| `GameModal` | Toute modale |
| `VictoryCard` | Écran de victoire |
| `Button` | Boutons standards |
| `IconButton` | Boutons icône |

## Template de composant

```typescript
/**
 * {NomComposant}
 *
 * {Description du composant}
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme';

// ============================================
// TYPES
// ============================================

interface {NomComposant}Props {
  /** Description de la prop */
  children?: React.ReactNode;
  /** Style personnalisé */
  style?: ViewStyle;
  /** Callback optionnel */
  onPress?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function {NomComposant}({
  children,
  style,
  onPress,
}: {NomComposant}Props) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    // Touch target minimum pour enfants
    minWidth: theme.touchTargets.child,
    minHeight: theme.touchTargets.child,
    // Padding standard
    padding: theme.spacing.md,
    // Couleurs du thème
    backgroundColor: theme.colors.background,
  },
});
```

## Règles obligatoires

### Imports

```typescript
// ✅ OBLIGATOIRE
import { theme } from '@/theme';
import { colors, spacing, typography } from '@/theme';

// ❌ INTERDIT
import { Colors } from '@/constants/colors';
```

### Touch Targets

```typescript
// ✅ Minimum 64dp pour enfants
minWidth: 64,
minHeight: 64,
// ou
width: theme.touchTargets.child,
height: theme.touchTargets.child,
```

### Typographie

```typescript
// ✅ Minimum 18pt pour texte courant
fontSize: theme.fontSize.lg,           // 18pt
fontFamily: theme.fontFamily.regular,  // Nunito

// ✅ Titres en Fredoka
fontFamily: theme.fontFamily.display,  // Fredoka

// ✅ Autres polices disponibles
fontFamily: theme.fontFamily.bold,     // Nunito-Bold
fontFamily: theme.fontFamily.medium,   // Nunito-Medium
fontFamily: theme.fontFamily.semiBold, // Nunito-SemiBold
```

### Accessibilité

```typescript
// ✅ Toujours ajouter
accessibilityLabel="Description pour VoiceOver"
accessibilityRole="button" // ou "text", "image", etc.
```

## Emplacement du fichier

| Catégorie | Chemin |
|-----------|--------|
| `common` | `/src/components/common/{NomComposant}.tsx` |
| `game` | `/src/games/{nomJeu}/components/{NomComposant}.tsx` |
| `parent` | `/src/components/parent/{NomComposant}.tsx` |
| `home` | `/src/components/home-v10/{NomComposant}.tsx` |

## Checklist finale

- [ ] Import depuis `@/theme`
- [ ] Touch targets ≥ 64dp
- [ ] Texte ≥ 18pt
- [ ] Props typées avec interface
- [ ] accessibilityLabel ajouté
- [ ] Export dans `index.ts` du dossier
