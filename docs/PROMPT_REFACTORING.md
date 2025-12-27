# 🔧 PROMPT REFACTORING HOMOGÉNÉISATION

> **Copier-coller ce prompt dans Claude Code pour homogénéiser les interfaces**

---

## PROMPT PRINCIPAL

```
Tu es un expert React Native/Expo spécialisé dans les applications éducatives enfants.

## MISSION
Refactoriser les écrans de jeux pour garantir une homogénéité UI complète en utilisant EXCLUSIVEMENT les composants communs existants.

## RÈGLES ABSOLUES (NON-NÉGOCIABLES)

### 1. COMPOSANTS OBLIGATOIRES
Tu DOIS utiliser ces composants de `@/components/common` — NE JAMAIS les recréer :
- `BackButton` → pour TOUT bouton retour
- `ScreenHeader` → pour TOUT header (variant: 'home' | 'game' | 'parent')
- `PageContainer` → pour TOUT wrapper de page
- `GameModal` → pour TOUTE modale
- `VictoryCard` → pour TOUT écran victoire
- `Button` → pour TOUT bouton
- `IconButton` → pour TOUT bouton icône

### 2. IMPORTS OBLIGATOIRES
```tsx
// ✅ TOUJOURS
import { theme } from '@/theme';
import { ScreenHeader, PageContainer, GameModal, Button } from '@/components/common';

// ❌ JAMAIS
import { Colors } from '@/constants/theme'; // DEPRECATED
```

### 3. TOKENS THEME UNIQUEMENT
- Couleurs : `theme.colors.xxx`
- Espacements : `theme.spacing[n]`
- Typography : `theme.typography.xxx`
- Border radius : `theme.borderRadius.xxx`
- Touch targets : `theme.touchTargets.child` (64dp minimum)

### 4. CONTRAINTES ENFANT
- Touch targets ≥ 64dp
- Texte courant ≥ 18pt (`theme.typography.sizes.body`)
- Polices explicites (`theme.typography.fonts.xxx`)
- Feedback visuel sur toute interaction

## PROCESSUS DE REFACTORING

Pour CHAQUE fichier écran (`*Screen.tsx`), effectue ces étapes :

### Étape 1 : Audit
1. Identifier les imports obsolètes (`/constants/`)
2. Identifier les headers custom
3. Identifier les boutons custom
4. Identifier les couleurs/spacing hardcodés

### Étape 2 : Migration
1. Remplacer les imports `/constants/` par `/theme/`
2. Remplacer le header custom par `<ScreenHeader variant="game" />`
3. Encapsuler le contenu dans `<PageContainer />`
4. Remplacer les modales custom par `<GameModal />`
5. Remplacer les boutons custom par `<Button />` ou `<IconButton />`

### Étape 3 : Styles
1. Remplacer toutes les couleurs hardcodées par `theme.colors.xxx`
2. Remplacer tous les spacing hardcodés par `theme.spacing[n]`
3. Ajouter `fontFamily` explicite sur tous les Text
4. Vérifier touch targets ≥ 64dp

### Étape 4 : Validation
1. Tester les animations (spring config standard)
2. Vérifier l'accessibilité (accessibilityLabel)
3. Tester les transitions

## TEMPLATE RÉSULTAT ATTENDU

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PageContainer, ScreenHeader, GameModal, Button } from '@/components/common';
import { theme } from '@/theme';

export default function [Nom]Screen() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <PageContainer variant="playful">
      <ScreenHeader
        variant="game"
        title="Nom du Jeu"
        emoji="🎮"
        onBack={() => router.back()}
        showParentButton
        onParentPress={() => router.push('/(parent)')}
        showHelpButton
        onHelpPress={() => setShowHelp(true)}
      />

      <View style={styles.content}>
        {/* Contenu */}
      </View>

      <GameModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        variant="info"
        title="Aide"
        emoji="❓"
        content="..."
        buttons={[{ label: 'OK', onPress: () => setShowHelp(false), variant: 'primary' }]}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.spacing[4],
  },
});
```

## FICHIERS À REFACTORISER

Commence par ces fichiers dans l'ordre :

1. `src/games/hanoi/screens/HanoiIntroScreen.tsx`
2. `src/games/hanoi/screens/HanoiGameScreen.tsx`
3. `src/games/sudoku/screens/SudokuIntroScreen.tsx`
4. `src/games/sudoku/screens/SudokuGameScreen.tsx`
5. `src/games/math-blocks/screens/MathIntroScreen.tsx`
6. `src/games/math-blocks/screens/MathPlayScreen.tsx`
7. `src/games/balance/screens/BalanceIntroScreen.tsx`
8. `src/games/memory/screens/MemoryIntroScreen.tsx`
9. `src/games/labyrinthe/screens/LabyrintheIntroScreen.tsx`
10. `src/games/logix-grid/screens/LogixGridIntroScreen.tsx`
11. `src/games/suites-logiques/screens/SuitesLogiquesIntroScreen.tsx`
12. Tous les écrans Victory (`*VictoryScreen.tsx`)

## RAPPORT

Après chaque fichier, fournis un rapport :
- ✅ Changements effectués
- ⚠️ Points d'attention
- 📊 Conformité (%) avec les guidelines

Lance le refactoring en commençant par HanoiIntroScreen.tsx.
```

---

## PROMPT DE VÉRIFICATION (à lancer après refactoring)

```
## AUDIT POST-REFACTORING

Vérifie la conformité de tous les écrans refactorisés :

### Checklist par fichier

Pour chaque `*Screen.tsx` :

1. **Imports**
   - [ ] Aucun import depuis `/constants/`
   - [ ] Import `{ theme }` depuis `@/theme`
   - [ ] Import composants depuis `@/components/common`

2. **Structure**
   - [ ] `PageContainer` comme wrapper racine
   - [ ] `ScreenHeader` avec variant correct
   - [ ] Aucun header/bouton retour custom

3. **Styles**
   - [ ] Aucune couleur hardcodée (#XXX)
   - [ ] Aucun spacing hardcodé
   - [ ] `fontFamily` explicite sur tous Text
   - [ ] Touch targets ≥ 64dp

4. **Accessibilité**
   - [ ] `accessibilityLabel` sur éléments interactifs
   - [ ] `accessibilityRole` défini

### Commandes de vérification

```bash
# Chercher imports obsolètes
grep -r "from '@/constants" src/games/

# Chercher couleurs hardcodées
grep -rn "#[A-Fa-f0-9]\{6\}" src/games/ --include="*.tsx"

# Chercher spacing hardcodés
grep -rn "padding: [0-9]" src/games/ --include="*.tsx"
grep -rn "margin: [0-9]" src/games/ --include="*.tsx"
```

### Rapport final

Génère un tableau récapitulatif :

| Fichier | Imports | Structure | Styles | A11y | Score |
|---------|---------|-----------|--------|------|-------|
| HanoiIntroScreen | ✅ | ✅ | ✅ | ⚠️ | 90% |
| ... | | | | | |

Objectif : 95%+ de conformité sur tous les fichiers.
```

---

## PROMPT POUR NOUVEAUX ÉCRANS

```
## CRÉATION D'UN NOUVEL ÉCRAN

Tu dois créer un nouvel écran pour le jeu [NOM].

### RÈGLES OBLIGATOIRES

AVANT de coder, lis ces fichiers :
1. `CLAUDE_CODE_RULES.md` — Règles non-négociables
2. `UI_COMPONENTS_CATALOG.md` — Composants à utiliser

### COMPOSANTS OBLIGATOIRES

Tu DOIS utiliser :
- `PageContainer` — wrapper racine
- `ScreenHeader variant="game"` — header standard
- `GameModal` — toute modale
- `Button` / `IconButton` — boutons
- `VictoryCard` — écran victoire

### IMPORTS OBLIGATOIRES

```tsx
import { PageContainer, ScreenHeader, GameModal, Button } from '@/components/common';
import { theme } from '@/theme';
```

### STRUCTURE OBLIGATOIRE

```tsx
<PageContainer variant="playful">
  <ScreenHeader variant="game" ... />
  <View style={styles.content}>
    {/* contenu */}
  </View>
  <GameModal ... />
</PageContainer>
```

### STYLES OBLIGATOIRES

```tsx
const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.spacing[4], // ✅ Token
    // padding: 16, // ❌ INTERDIT
  },
  text: {
    fontSize: theme.typography.sizes.body, // ✅ 18pt minimum
    fontFamily: theme.typography.fonts.body, // ✅ Explicite
    color: theme.colors.text.primary, // ✅ Token
  },
  button: {
    minWidth: theme.touchTargets.child, // ✅ 64dp
    minHeight: theme.touchTargets.child, // ✅ 64dp
  },
});
```

Maintenant, crée l'écran [NOM] en respectant STRICTEMENT ces règles.
```

---

## CONSEILS D'UTILISATION

### Quand utiliser quel prompt

| Situation | Prompt à utiliser |
|-----------|-------------------|
| Première homogénéisation | PROMPT PRINCIPAL |
| Après refactoring | PROMPT DE VÉRIFICATION |
| Nouveau jeu/écran | PROMPT POUR NOUVEAUX ÉCRANS |

### Fréquence recommandée

1. **Début de session** : Toujours rappeler les règles avec CLAUDE_CODE_RULES.md
2. **Nouveau fichier** : Demander de consulter UI_COMPONENTS_CATALOG.md
3. **Fin de session** : Lancer le prompt de vérification

### En cas de non-respect

Si Claude Code recrée des composants malgré les instructions :

```
STOP. Tu as recréé un [composant] alors qu'il existe dans @/components/common.

RÈGLE : NE JAMAIS recréer ces composants :
- BackButton
- ScreenHeader
- PageContainer
- GameModal
- VictoryCard
- Button
- IconButton

Utilise OBLIGATOIREMENT l'import :
import { [composant] } from '@/components/common';

Corrige immédiatement.
```

---

*Ces prompts garantissent l'homogénéité UI sur l'ensemble du projet.*
