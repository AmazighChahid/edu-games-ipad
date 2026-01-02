---
name: nouveau-composant
description: Créer un nouveau composant UI réutilisable dans src/components/common/. Respecte les contraintes enfant (touch targets 64dp, texte 18pt), tokens du theme et accessibilité. Utiliser avec `/nouveau-composant <NomComposant>`.
model: opus
color: green
---

# Agent Nouveau Composant — Hello Guys

**Déclencheur**: `/nouveau-composant <NomComposant>` ou demande de création d'un composant UI

---

## Mission

Créer un nouveau composant UI réutilisable dans `src/components/common/`, en respectant strictement les règles du projet (contraintes enfant, tokens du theme, accessibilité).

---

## Documents de référence (LIRE EN PREMIER)

1. `docs/Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md` — Règles non-négociables
2. `docs/Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md` — Composants existants (NE PAS RECRÉER)
3. `docs/Méthodologies/RÈGLES/DESIGN_SYSTEM.md` — Tokens à utiliser

---

## Étape 1 : Vérifier que le composant n'existe pas

**AVANT de créer**, vérifier `src/components/common/` :

```bash
ls -la src/components/common/
```

**Composants existants (NE PAS RECRÉER)** :

- `BackButton`, `Button`, `IconButton`
- `ScreenHeader`, `ScreenBackground`, `PageContainer`
- `GameModal`, `VictoryCard`, `ParentGate`
- `GameIntroTemplate`, `MascotBubble`, `HintButton`
- `Confetti`, `ProgressIndicator`, `PetalsIndicator`

> Si le composant existe déjà → proposer de l'utiliser ou de l'améliorer

---

## Étape 2 : Définir l'interface

Demander à l'utilisateur :

1. Quelles props obligatoires ?
2. Quelles props optionnelles ?
3. Quels variants visuels ?
4. Quels callbacks nécessaires ?

---

## Étape 3 : Créer le composant

### Structure de fichiers

```
src/components/common/
├── {NomComposant}.tsx    # Composant
└── index.ts              # Ajouter l'export
```

### Template TypeScript

```typescript
// src/components/common/{NomComposant}.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

// IMPORTS OBLIGATOIRES
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';

// ============================================
// TYPES
// ============================================

export type {NomComposant}Variant = 'default' | 'primary' | 'secondary';

export interface {NomComposant}Props {
  children?: React.ReactNode;
  variant?: {NomComposant}Variant;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
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
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 0.95 : 1) }],
  }));

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
    // Touch target minimum enfant
    minWidth: theme.touchTargets.child,  // 64dp
    minHeight: theme.touchTargets.child, // 64dp
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
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
    fontSize: theme.fontSize.lg, // 18pt minimum
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.text.primary,
  },
});

export default {NomComposant};
```

### Ajouter l'export

```typescript
// src/components/common/index.ts

export { {NomComposant} } from './{NomComposant}';
export type { {NomComposant}Props, {NomComposant}Variant } from './{NomComposant}';
```

---

## Étape 4 : Mettre à jour la documentation

Après création, proposer d'ajouter au `UI_COMPONENTS_CATALOG.md` :

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
\`\`\`tsx
import { {NomComposant} } from '@/components/common';

<{NomComposant} variant="primary" onPress={handlePress}>
  Contenu
</{NomComposant}>
\`\`\`
```

---

## Checklist de validation

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

## Règles critiques (rappel)

```typescript
// INTERDIT
backgroundColor: '#4A90D9',  // Couleur hardcodée
padding: 16,                  // Spacing hardcodé
width: 48,                    // Touch target trop petit

// OBLIGATOIRE
backgroundColor: theme.colors.primary.main,  // #4A90D9
padding: theme.spacing[4],
minWidth: theme.touchTargets.child,  // 64dp
```

---

*Agent création composant — Janvier 2026*
