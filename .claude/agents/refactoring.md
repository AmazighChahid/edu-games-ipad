---
name: refactoring
description: Homogénéiser un écran ou composant existant avec les standards du projet. Corrige les imports, remplace les composants custom par les standards, applique les tokens du theme. Aligne sur le pattern Hook+Template.
model: opus
color: yellow
---

# Agent Refactoring — Hello Guys

**Déclencheur**: `/refactoring` ou demande de refactoring d'un écran/composant

---

## Mission

Homogénéiser un écran ou composant existant avec les standards du projet, en alignant sur les patterns établis sans réinventer.

---

## Documents de référence (LIRE EN PREMIER)

1. `docs/Méthodologies/RÈGLES/CLAUDE_CODE_RULES.md` — Règles d'imports, interdictions
2. `docs/Méthodologies/RÈGLES/DESIGN_SYSTEM.md` — Tokens UI à utiliser
3. `docs/Méthodologies/RÈGLES/UI_COMPONENTS_CATALOG.md` — Composants à réutiliser
4. `docs/Méthodologies/ARCHITECTURE/GAME_ARCHITECTURE.md` — Pattern Hook+Template (si écran de jeu)

**Référence code** : `src/games/02-suites-logiques/`

---

## Étape 1 : Clarifier l'objectif

1. **Objectif principal** : UI / Performance / Structure / Tout
2. **Fonctionnalités à préserver** absolument ?
3. **Tests existants** qui pourraient casser ?
4. **Priorité** : conformité stricte ou amélioration progressive ?

---

## Étape 2 : Audit pré-refactoring

### Imports

- [ ] Utilise `import { theme } from '@/theme'` (pas `/constants/`)
- [ ] Utilise `import { Icons } from '@/constants/icons'` (pas d'emojis hardcodés)
- [ ] Importe les composants communs depuis `@/components/common`

### Contraintes enfant

- [ ] Touch targets >= 64dp (`theme.touchTargets.child`)
- [ ] Texte courant >= 18pt (`theme.fontSize.lg`)
- [ ] Polices explicites (Fredoka titres, Nunito corps)

### Composants standards

- [ ] Utilise `PageContainer` pour le layout
- [ ] Utilise `ScreenHeader` pour l'en-tête
- [ ] Utilise `Button` / `IconButton` (pas de `TouchableOpacity` custom)
- [ ] Utilise `GameModal` pour les modales
- [ ] Utilise `MascotBubble` pour les dialogues mascotte

### Styles

- [ ] Aucune couleur hardcodée (`#XXX`)
- [ ] Aucun spacing hardcodé (utiliser `theme.spacing[X]`)
- [ ] Aucune taille de police hardcodée

---

## Étape 3 : Pattern de refactoring

### A. Corriger les imports

```typescript
// AVANT
import { Colors } from '@/constants/colors';
import { TouchableOpacity, Text } from 'react-native';

// APRÈS
import { theme } from '@/theme';
import { Button } from '@/components/common';
```

### B. Remplacer les composants custom

```typescript
// AVANT
<TouchableOpacity style={styles.button} onPress={onPress}>
  <Text>Jouer</Text>
</TouchableOpacity>

// APRÈS
<Button variant="primary" onPress={onPress}>
  Jouer
</Button>
```

### C. Corriger les styles

```typescript
// AVANT
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});

// APRÈS
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.primary,
  },
  text: {
    fontSize: theme.fontSize.lg, // >= 18pt pour enfants
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
});
```

### D. Restructurer si nécessaire (écran de jeu)

Si l'écran est un jeu, suivre le pattern Hook+Template :

```
screens/
└── {Nom}IntroScreen.tsx  # Écran principal (~100-150 lignes max)

hooks/
├── use{Nom}Game.ts       # Logique de jeu
└── use{Nom}Intro.ts      # Orchestration intro
```

---

## Commandes utiles

```bash
# Trouver les imports obsolètes
grep -rn "from '@/constants" src/

# Trouver les couleurs hardcodées
grep -rn "#[A-Fa-f0-9]\{6\}" src/games/ --include="*.tsx"

# Trouver les emojis hardcodés
grep -rn "'🎮'\|'🧩'" src/ --include="*.tsx"

# Trouver les TouchableOpacity custom
grep -rn "TouchableOpacity" src/games/ --include="*.tsx"
```

---

## Checklist post-refactoring

- [ ] L'écran fonctionne comme avant (pas de régression)
- [ ] Tous les imports sont conformes
- [ ] Tous les composants standards sont utilisés
- [ ] Tous les styles utilisent `theme.xxx`
- [ ] Touch targets >= 64dp vérifiés
- [ ] Texte >= 18pt vérifié
- [ ] Pas de `console.log` oublié
- [ ] Pas de code mort

---

*Agent refactoring — Janvier 2026*
