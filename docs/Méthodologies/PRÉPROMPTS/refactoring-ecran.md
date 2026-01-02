# Refactoring d'un Écran

> **Usage** : Homogénéiser un écran existant avec les standards du projet
> **Principe** : Aligner sur les patterns existants, pas réinventer

---

## Protocole 3 étapes

### Étape 1 : Confirmer la lecture

```text
✅ J'ai lu : CLAUDE_CODE_RULES.md, DESIGN_SYSTEM.md, UI_COMPONENTS_CATALOG.md
✅ Écran cible : [chemin du fichier]
✅ Référence : src/games/02-suites-logiques/ (pattern à suivre)
```

### Étape 2 : Questions de clarification

1. Quel est l'objectif principal ? (UI / Performance / Structure / Tout)
2. Y a-t-il des fonctionnalités à préserver absolument ?
3. Le refactoring peut-il casser des tests existants ?
4. Priorité : conformité stricte ou amélioration progressive ?

### Étape 3 : Plan de refactoring

```text
📋 PLAN :
1. Audit de l'écran actuel (violations identifiées)
2. Liste des modifications par ordre de priorité
3. Composants communs à réutiliser
4. Points de vigilance (régressions possibles)

→ ATTENDRE VALIDATION avant de commencer
```

---

## Documents de référence

| Document | Contenu |
|----------|---------|
| `CLAUDE_CODE_RULES.md` | Règles d'imports, interdictions |
| `DESIGN_SYSTEM.md` | Tokens UI à utiliser |
| `UI_COMPONENTS_CATALOG.md` | Composants à réutiliser (NE PAS recréer) |
| `GAME_ARCHITECTURE.md` | Pattern Hook+Template si écran de jeu |

---

## Checklist d'audit pré-refactoring

### Imports

- [ ] Utilise `import { theme } from '@/theme'` (pas `/constants/`)
- [ ] Utilise `import { Icons } from '@/constants/icons'` (pas d'emojis hardcodés)
- [ ] Importe les composants communs depuis `@/components/common`

### Contraintes enfant

- [ ] Touch targets ≥ 64dp (`theme.touchTargets.child`)
- [ ] Texte courant ≥ 18pt (`theme.fontSize.lg`)
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

## Pattern de refactoring

### Étape A : Corriger les imports

```typescript
// ❌ AVANT
import { Colors } from '@/constants/colors';
import { TouchableOpacity, Text } from 'react-native';

// ✅ APRÈS
import { theme } from '@/theme';
import { Button } from '@/components/common';
```

### Étape B : Remplacer les composants custom

```typescript
// ❌ AVANT
<TouchableOpacity style={styles.button} onPress={onPress}>
  <Text>Jouer</Text>
</TouchableOpacity>

// ✅ APRÈS
<Button variant="primary" onPress={onPress}>
  Jouer
</Button>
```

### Étape C : Corriger les styles

```typescript
// ❌ AVANT
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

// ✅ APRÈS
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.main,
  },
  text: {
    fontSize: theme.fontSize.lg, // ≥ 18pt pour enfants
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
});
```

### Étape D : Restructurer si nécessaire

Si l'écran est un jeu, suivre le pattern Hook+Template :

```
screens/
└── {Nom}IntroScreen.tsx  # Écran principal (~100-150 lignes max)

hooks/
├── use{Nom}Game.ts       # Logique de jeu
└── use{Nom}Intro.ts      # Orchestration intro
```

---

## Checklist post-refactoring

- [ ] L'écran fonctionne comme avant (pas de régression)
- [ ] Tous les imports sont conformes
- [ ] Tous les composants standards sont utilisés
- [ ] Tous les styles utilisent `theme.xxx`
- [ ] Touch targets ≥ 64dp vérifiés
- [ ] Texte ≥ 18pt vérifié
- [ ] Pas de `console.log` oublié
- [ ] Pas de code mort

---

*Préprompt refactoring écran — Décembre 2024*
