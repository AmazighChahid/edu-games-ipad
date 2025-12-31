# 🎮 Création d'un Nouveau Jeu

> **Usage** : `nouveau-jeu.md <nom-du-jeu>`
> **Exemple** : `nouveau-jeu.md Code-Secret`

---

## Documents à lire AVANT de commencer

1. `TRAME_REFERENTIEL.md` — Architecture des activités, types universels
2. `GAME_ARCHITECTURE.md` — Pattern Hook+Template
3. `PROJECT_STRUCTURE.md` — Structure des fichiers
4. `MASCOTTES_REGISTRY.md` — Registre des mascottes
5. `DESIGN_SYSTEM.md` — Tokens UI
6. `/Fiches Educatives/01-Tour de Hanoï/` — Exemple de fiches complètes

---

## Processus en 4 phases

### Phase 1 : Préparation (Fiches Éducatives)

Créer le dossier `/Fiches Educatives/{XX-NomJeu}/` avec 4 fichiers :

| Fichier | Contenu |
|---------|---------|
| `FICHE_ACTIVITE.md` | Objectif pédagogique, règles, déroulement UX |
| `FICHE_PARENT.md` | Guide d'accompagnement parental |
| `DIALOGUES_IA.md` | Scripts mascotte par âge |
| `SPECS_TECHNIQUES.md` | Architecture, composants, animations |

> **Templates complets** → `fiche-educative.md`

### Phase 2 : Implémentation

Créer le dossier `/src/games/{XX-nomJeu}/` :

```
{XX-nomJeu}/
├── index.ts                    # Exports publics
├── types.ts                    # Types spécifiques au jeu
│
├── components/
│   ├── index.ts                # Exports
│   └── {Element}.tsx           # Composants UI spécifiques
│
├── hooks/
│   ├── use{NomJeu}Game.ts      # Logique de jeu PURE
│   ├── use{NomJeu}Sound.ts     # Sons (optionnel)
│   └── use{NomJeu}Intro.ts     # Hook orchestrateur
│
├── logic/
│   ├── {nomJeu}Engine.ts       # Logique métier pure (sans React)
│   └── validator.ts            # Validation des coups
│
├── data/
│   ├── levels.ts               # Configuration des niveaux
│   └── assistantScripts.ts     # Scripts IA par contexte
│
└── screens/
    └── {NomJeu}IntroScreen.tsx # Écran principal (~100-150 lignes)
```

#### Template types.ts

```typescript
// src/games/{XX-nomJeu}/types.ts

import { LevelConfig } from '@/types/game.types';

// État spécifique du jeu
export interface {NomJeu}State {
  // Définir l'état du jeu
}

// Configuration niveau spécifique
export interface {NomJeu}Level extends LevelConfig {
  // Paramètres spécifiques au jeu
}

// Coup/action du joueur
export interface {NomJeu}Move {
  // Définir une action
}
```

#### Template Hook principal

```typescript
// src/games/{XX-nomJeu}/hooks/use{NomJeu}Game.ts

import { useState, useCallback, useMemo } from 'react';
import type { {NomJeu}State, {NomJeu}Level } from '../types';

interface Use{NomJeu}GameProps {
  level: {NomJeu}Level;
  onVictory: () => void;
  onMove?: (move: {NomJeu}Move) => void;
}

export function use{NomJeu}Game({ level, onVictory, onMove }: Use{NomJeu}GameProps) {
  // 1. État du jeu
  const [gameState, setGameState] = useState<{NomJeu}State>(/* initial */);
  const [moveCount, setMoveCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // 2. Logique de validation
  const isValidMove = useCallback((move: {NomJeu}Move): boolean => {
    // Valider le coup
    return true;
  }, [gameState]);

  // 3. Exécution d'un coup
  const executeMove = useCallback((move: {NomJeu}Move) => {
    if (!isValidMove(move)) return false;
    
    setGameState(prev => {
      // Appliquer le coup
      return prev;
    });
    
    setMoveCount(prev => prev + 1);
    onMove?.(move);
    
    // Vérifier victoire
    // if (checkVictory()) onVictory();
    
    return true;
  }, [isValidMove, onMove, onVictory]);

  // 4. Reset
  const reset = useCallback(() => {
    setGameState(/* initial */);
    setMoveCount(0);
  }, [level]);

  // 5. Indice
  const getHint = useCallback(() => {
    setHintsUsed(prev => prev + 1);
    // Retourner un indice
    return null;
  }, [gameState]);

  return {
    gameState,
    moveCount,
    hintsUsed,
    isValidMove,
    executeMove,
    reset,
    getHint,
  };
}
```

### Phase 3 : Intégration

#### 1. Ajouter dans le registry

```typescript
// src/games/registry.ts

import type { GameMetadata } from '@/types/game.types';

export const gameRegistry: GameMetadata[] = [
  // ... autres jeux ...
  {
    id: '{nomjeu}',
    name: '{Nom du Jeu}',
    nameKey: 'games.{nomjeu}.name',
    description: '{Description courte}',
    descriptionKey: 'games.{nomjeu}.description',
    icon: null,
    minAge: 6,
    maxAge: 10,
    category: 'logic', // logic | memory | spatial | math | language
    skills: ['planning', 'problem_solving'], // 3-5 parmi les 22 CognitiveSkill
    status: 'available',
    route: '/(games)/{XX-nomjeu}',
  },
];
```

#### 2. Créer la route Expo Router

```
app/(games)/{XX-nomjeu}/
├── _layout.tsx    # Stack navigator
└── index.tsx      # Point d'entrée
```

**_layout.tsx** :
```typescript
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
```

**index.tsx** :
```typescript
import {NomJeu}IntroScreen from '@/games/{XX-nomjeu}/screens/{NomJeu}IntroScreen';

export default function {NomJeu}Page() {
  return <{NomJeu}IntroScreen />;
}
```

### Phase 4 : Validation

#### Checklist obligatoire

**Structure**
- [ ] Tous les fichiers créés selon le template
- [ ] Exports corrects dans `index.ts`
- [ ] Types TypeScript complets

**UI/UX**
- [ ] Utilise `GameIntroTemplate` ou structure équivalente
- [ ] Touch targets ≥ 64dp
- [ ] Texte courant ≥ 18pt
- [ ] Feedback jamais punitif

**Intégration**
- [ ] Ajouté dans `registry.ts`
- [ ] Route créée dans `app/(games)/`
- [ ] Mascotte assignée (voir `MASCOTTES_REGISTRY.md`)

**Pédagogie**
- [ ] Méthode enseignée clairement définie
- [ ] 3-5 compétences cognitives ciblées
- [ ] Dialogues IA adaptés par âge
- [ ] Fiches éducatives complètes

---

## Questions à poser avant de commencer

1. **Tranche d'âge cible** : 6-7 / 7-8 / 8-9 / 9-10 ans ?
2. **Catégorie** : logic / memory / spatial / math / language ?
3. **Compétences cognitives** : lesquelles parmi les 22 disponibles ?
4. **Mascotte** : laquelle assigner ? (voir `MASCOTTES_REGISTRY.md`)
5. **Niveaux** : combien ? quels paramètres varient ?
6. **Méthode enseignée** : quel processus de réflexion ?

---

## Règles critiques

> **Source complète** → `CLAUDE_CODE_RULES.md`

```typescript
// ✅ Imports obligatoires
import { theme } from '@/theme';
import { Icons } from '@/constants/icons';
import { PageContainer, ScreenHeader, GameModal } from '@/components/common';

// ✅ Touch targets enfant
minWidth: theme.touchTargets.child, // 64dp
minHeight: theme.touchTargets.child,

// ✅ Skills valides (parmi les 22)
skills: CognitiveSkill[]
```

---

*Préprompt création jeu — Décembre 2024*
