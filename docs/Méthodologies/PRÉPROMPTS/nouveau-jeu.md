# Création d'un Nouveau Jeu

---

## Documents à lire

| Document | Contenu |
|----------|---------|
| `ARCHITECTURE/GAME_ARCHITECTURE.md` | Pattern Hook+Template, structure fichiers |
| `RÈGLES/DESIGN_SYSTEM.md` | Tokens UI |
| `CONTEXTE/MASCOTTES_GUIDELINES.md` | Règles mascottes |

**Référence code** : `src/games/02-suites-logiques/` (implémentation complète)

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

**Exemple complet** : `/Fiches Educatives/01-Tour de Hanoï/`

#### Template FICHE_ACTIVITE.md

```markdown
# Fiche Activité — {Nom du Jeu}

## Informations générales

| Champ | Valeur |
|-------|--------|
| **Nom** | {Nom} |
| **Tranche d'âge** | {6-7 / 7-8 / 8-9 / 9-10 ans} |
| **Durée session** | {5-15 minutes} |
| **Catégorie** | {logic / memory / spatial / math / language} |
| **Mascotte** | {Nom + Emoji} |

## Objectif pédagogique

{Ce que l'enfant apprend — 2-3 phrases claires}

## Méthode enseignée

{Le processus de réflexion explicité — la méthode que l'enfant doit intérioriser}

> Principe : "Apprendre à penser, pas à répondre"

## Règles du jeu

1. {Règle 1}
2. {Règle 2}
3. {Règle 3}

## Compétences cognitives

| Compétence | Description |
|------------|-------------|
| `{skill_1}` | {Comment elle est mobilisée} |
| `{skill_2}` | {Comment elle est mobilisée} |

## Déroulement UX

### Écran 1 : Introduction
{Description}

### Écran 2 : Jeu
{Description}

### Écran 3 : Victoire
{Description}

## Système de feedback

| Situation | Feedback |
|-----------|----------|
| Succès | {Réaction visuelle/sonore} |
| Erreur | {Message encourageant, jamais punitif} |
| Indice | {Comment l'aide est présentée} |
| Victoire | {Célébration} |

## Niveaux de difficulté

| Niveau | Âge cible | Paramètres |
|--------|-----------|------------|
| Facile | 6-7 ans | {Paramètres} |
| Moyen | 7-8 ans | {Paramètres} |
| Difficile | 9-10 ans | {Paramètres} |
```

#### Template FICHE_PARENT.md

```markdown
# Fiche Parent — {Nom du Jeu}

## Ce que développe cette activité

### Compétences principales

1. **{Compétence 1}** : {Explication accessible pour les parents}
2. **{Compétence 2}** : {Explication accessible pour les parents}

### Compétences transversales

- {Compétence transversale 1}
- {Compétence transversale 2}

## Comment accompagner votre enfant

### À faire

- {Conseil positif 1}
- {Conseil positif 2}

### À éviter

- {Ce qu'il ne faut pas faire 1}
- {Ce qu'il ne faut pas faire 2}

## Signaux de progression

### Niveau débutant
{Comportements observés quand l'enfant découvre}

### Niveau avancé
{Comportements observés quand l'enfant maîtrise}

## Transfert vie quotidienne

{Comment appliquer ces compétences au quotidien}

## Questions à poser à votre enfant

1. "{Question pour faire verbaliser la méthode}"
2. "{Question pour valoriser l'effort}"
```

#### Template DIALOGUES_IA.md

```markdown
# Dialogues IA — {Nom du Jeu}

## Mascotte : {Nom} {Emoji}

### Personnalité
- {Trait 1}
- {Trait 2}
- {Trait 3}

---

## Avant de commencer

### 6-7 ans
> "{Message simple et court}"

### 8-10 ans
> "{Message avec plus de détails}"

---

## Après une réussite

- "{Message 1}"
- "{Message 2}"
- "{Message 3}"

---

## Après une erreur (JAMAIS punitif)

- "{Message encourageant 1}"
- "{Message encourageant 2}"

---

## Indices progressifs

### Indice 1 (léger)
> "{Indice qui oriente sans donner la réponse}"

### Indice 2 (fort)
> "{Indice qui montre presque la solution}"

---

## Enfant bloqué (inactivité > 30s)

> "{Message pour relancer l'attention}"

---

## Victoire

### Victoire normale
> "{Célébration}"

### Victoire sans erreur
> "{Célébration exceptionnelle}"
```

#### Template SPECS_TECHNIQUES.md

```markdown
# Specs Techniques — {Nom du Jeu}

## Architecture

| Fichier | Rôle |
|---------|------|
| `use{Nom}Game.ts` | Hook principal |
| `{nom}Engine.ts` | Logique pure |
| `levels.ts` | Configuration niveaux |
| `assistantScripts.ts` | Scripts IA |

## Types spécifiques

\`\`\`typescript
interface {Nom}State {
  // État du jeu
}

interface {Nom}Level extends LevelConfig {
  // Configuration spécifique
}
\`\`\`

## Composants UI

| Composant | Description |
|-----------|-------------|
| `{Composant1}.tsx` | {Description} |

## Animations (Reanimated 3)

| Animation | Type | Durée |
|-----------|------|-------|
| {Animation 1} | spring | ~300ms |

## Sons

| Son | Déclencheur |
|-----|-------------|
| Succès | Coup valide |
| Erreur | Coup invalide |
| Victoire | Niveau terminé |
```

---

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
- [ ] Mascotte créée (voir `MASCOTTES_GUIDELINES.md`)

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
4. **Mascotte** : créer selon `MASCOTTES_GUIDELINES.md`
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
