# 🆕 Création d'un Nouveau Composant UI

> **Usage** : `nouveau-composant.md <NomComposant>`
> **Exemple** : `nouveau-composant.md StreakBadge`

---

## Documents à lire AVANT de commencer

1. `CLAUDE_CODE_RULES.md` — Règles non-négociables
2. `UI_COMPONENTS_CATALOG.md` — Composants existants (NE PAS RECRÉER)
3. `DESIGN_SYSTEM.md` — Tokens à utiliser

---

## Étape 1 : Vérifier que le composant n'existe pas

**AVANT de créer**, vérifier `src/components/common/` :

```bash
ls -la src/components/common/
```

Composants existants (NE PAS RECRÉER) :
- `BackButton`, `Button`, `IconButton`
- `ScreenHeader`, `ScreenBackground`, `PageContainer`
- `GameModal`, `VictoryCard`, `ParentGate`
- `GameIntroTemplate`, `MascotBubble`, `HintButton`
- `Confetti`, `ProgressIndicator`, `PetalsIndicator`

> **Si le composant existe** → l'utiliser tel quel ou proposer une amélioration

---

## Étape 2 : Définir l'interface

```typescript
// Répondre à ces questions :

// 1. Quelles props obligatoires ?
// 2. Quelles props optionnelles ?
// 3. Quels variants ?
// 4. Callbacks nécessaires ?
```

---

## Étape 3 : Template de composant

### Structure de fichier

```
src/components/common/
├── {NomComposant}.tsx    # Composant
└── index.ts              # Ajouter l'export
```

### Template TypeScript

```typescript
// src/components/common/{NomComposant}.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

// ⚠️ IMPORTS OBLIGATOIRES
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';

// ============================================
// TYPES
// ============================================

export type {NomComposant}Variant = 'default' | 'primary' | 'secondary';

export interface {NomComposant}Props {
  /** Contenu principal */
  children?: React.ReactNode;
  
  /** Variant visuel */
  variant?: {NomComposant}Variant;
  
  /** Désactivé */
  disabled?: boolean;
  
  /** Callback au press */
  onPress?: () => void;
  
  /** Accessibilité */
  accessibilityLabel?: string;
  
  /** Style personnalisé */
  style?: StyleProp<ViewStyle>;
}

// ============================================
// COMPOSANT
// ============================================

export function {NomComposant}({
  children,
  variant = 'default',
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: {NomComposant}Props) {
  // Animation press
  const pressed = useSharedValue(false);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 0.95 : 1) }],
  }));

  // Styles selon variant
  const containerStyle = [
    styles.container,
    styles[`container_${variant}`],
    disabled && styles.disabled,
    style,
  ];

  return (
    <Pressable
      onPressIn={() => { pressed.value = true; }}
      onPressOut={() => { pressed.value = false; }}
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Animated.View style={[containerStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    // ⚠️ Touch target minimum enfant
    minWidth: theme.touchTargets.child,  // 64dp
    minHeight: theme.touchTargets.child, // 64dp
    
    // Layout
    alignItems: 'center',
    justifyContent: 'center',
    
    // Spacing
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    
    // Couleur par défaut
    backgroundColor: theme.colors.background.card,
  },
  
  container_default: {
    backgroundColor: theme.colors.background.card,
  },
  
  container_primary: {
    backgroundColor: theme.colors.primary.main,
  },
  
  container_secondary: {
    backgroundColor: theme.colors.secondary.main,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  text: {
    // ⚠️ Taille minimum enfant
    fontSize: theme.fontSize.lg, // 18pt
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.primary,
  },
});

// ============================================
// EXPORT DEFAULT
// ============================================

export default {NomComposant};
```

### Ajouter l'export

```typescript
// src/components/common/index.ts

// Ajouter la ligne :
export { {NomComposant} } from './{NomComposant}';
export type { {NomComposant}Props, {NomComposant}Variant } from './{NomComposant}';
```

---

## Étape 4 : Checklist de validation

### Structure
- [ ] Fichier dans `src/components/common/`
- [ ] Export ajouté dans `index.ts`
- [ ] Types exportés

### Imports
- [ ] `import { theme } from '@/theme'`
- [ ] `import { Icons } from '@/constants/icons'` (si emojis)
- [ ] Aucun import depuis `/constants/` deprecated

### Contraintes enfant
- [ ] `minWidth: theme.touchTargets.child` (64dp)
- [ ] `minHeight: theme.touchTargets.child` (64dp)
- [ ] `fontSize: theme.fontSize.lg` minimum pour texte (18pt)
- [ ] `fontFamily` explicite sur tous les Text

### Accessibilité
- [ ] `accessible={true}`
- [ ] `accessibilityLabel` prop
- [ ] `accessibilityRole` approprié

### Animations
- [ ] Utiliser Reanimated 3
- [ ] `withSpring` pour les transitions
- [ ] Feedback visuel sur press

### Styles
- [ ] Aucune couleur hardcodée (`#XXX`)
- [ ] Aucun spacing hardcodé
- [ ] Utiliser `theme.xxx` pour tout

---

## Étape 5 : Documentation

Après création, mettre à jour `UI_COMPONENTS_CATALOG.md` :

```markdown
### {NomComposant}

{Description du composant}

**Props** :
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'primary' | 'default' | Style visuel |
| disabled | boolean | false | État désactivé |
| onPress | () => void | — | Callback au press |

**Exemple** :
```tsx
import { {NomComposant} } from '@/components/common';

<{NomComposant} variant="primary" onPress={handlePress}>
  Contenu
</{NomComposant}>
```
```

---

## Règles critiques (rappel)

> **Source complète** → `CLAUDE_CODE_RULES.md`

```typescript
// ❌ INTERDIT
backgroundColor: '#5B8DEE',  // Couleur hardcodée
padding: 16,                  // Spacing hardcodé
width: 48,                    // Touch target trop petit

// ✅ OBLIGATOIRE
backgroundColor: theme.colors.primary.main,
padding: theme.spacing[4],
minWidth: theme.touchTargets.child,
```

---

*Préprompt création composant — Décembre 2024*
