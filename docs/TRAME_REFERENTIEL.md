# TRAME RÉFÉRENTIEL — Architecture des Activités

> **Version** : 1.0 — 28 Décembre 2024
> **Objectif** : Document de référence pour comprendre et étendre l'architecture commune des activités éducatives

---

## Table des Matières

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Couche 1 : Types Universels](#2-couche-1--types-universels)
3. [Couche 2 : Core Pédagogique](#3-couche-2--core-pédagogique)
4. [Couche 3 : Registre des Jeux](#4-couche-3--registre-des-jeux)
5. [Couche 4 : Structure d'un Jeu](#5-couche-4--structure-dun-jeu)
6. [Couche 5 : Fiches Éducatives](#6-couche-5--fiches-éducatives)
7. [Couche 6 : Store Global](#7-couche-6--store-global)
8. [Checklist Nouveau Jeu](#8-checklist-nouveau-jeu)
9. [Diagramme d'Architecture](#9-diagramme-darchitecture)

---

## 1. Vue d'Ensemble

L'application Hello Guys repose sur une **trame référentiel multi-couches** qui assure :

- **Cohérence** : Tous les jeux partagent les mêmes types, feedback et logique pédagogique
- **Scalabilité** : Ajouter un jeu = répliquer un pattern sans réinventer
- **Qualité** : Feedback bienveillant, adaptation Montessori, jamais punitif

### Principe Fondateur

> « Apprendre à penser, pas à répondre »

Chaque activité enseigne une **méthode de raisonnement**, pas juste un résultat.

### Architecture en Couches

```
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE 6 : Store Global                  │
│                  (Zustand - Progression, Sessions)          │
├─────────────────────────────────────────────────────────────┤
│                COUCHE 5 : Fiches Éducatives                 │
│          (FICHE_ACTIVITE, FICHE_PARENT, DIALOGUES_IA)       │
├─────────────────────────────────────────────────────────────┤
│                 COUCHE 4 : Structure Jeu                    │
│        (hooks/, components/, logic/, data/, screens/)       │
├─────────────────────────────────────────────────────────────┤
│                COUCHE 3 : Registre Central                  │
│                    (registry.ts - 15 jeux)                  │
├─────────────────────────────────────────────────────────────┤
│                 COUCHE 2 : Core Pédagogique                 │
│           (feedback.ts, difficulty.ts, childAssistant.ts)   │
├─────────────────────────────────────────────────────────────┤
│                 COUCHE 1 : Types Universels                 │
│              (game.types.ts, core.types.ts)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Couche 1 : Types Universels

### Fichier : `/src/types/game.types.ts`

Ce fichier définit les **types fondamentaux** partagés par TOUS les jeux.

### 2.1 Catégories de Jeux

```typescript
type GameCategory =
  | 'logic'     // Tour de Hanoï, Suites, Sudoku, Balance, Logix
  | 'memory'    // Memory, Chasseur de Papillons
  | 'spatial'   // Labyrinthe, Tangram
  | 'math'      // MathBlocks
  | 'language'; // Mots Croisés, Conteur Curieux
```

### 2.2 Compétences Cognitives (22 compétences)

```typescript
type CognitiveSkill =
  // Fonctions exécutives
  | 'planning'              // Planification stratégique
  | 'inhibition'            // Contrôle des impulsions
  | 'working_memory'        // Mémoire de travail
  | 'problem_solving'       // Résolution de problèmes
  | 'perseverance'          // Persévérance
  | 'concentration'         // Attention soutenue

  // Raisonnement
  | 'pattern_recognition'   // Reconnaissance de motifs
  | 'sequencing'            // Séquençage
  | 'deductive_reasoning'   // Raisonnement déductif
  | 'logical_thinking'      // Pensée logique
  | 'systematic_thinking'   // Pensée systématique

  // Spatial
  | 'spatial_reasoning'     // Raisonnement spatial

  // Mathématique
  | 'quantitative_reasoning' // Raisonnement quantitatif
  | 'equivalence'            // Équivalences
  | 'pre_algebra'            // Pré-algèbre

  // Langage
  | 'vocabulary'             // Vocabulaire
  | 'spelling'               // Orthographe
  | 'reading_comprehension'  // Compréhension lecture
  | 'inference'              // Inférence

  // Cognitif
  | 'visual_reasoning'       // Raisonnement visuel
  | 'memory'                 // Mémoire
  | 'patience';              // Patience
```

### 2.3 GameMetadata — Carte d'identité d'un jeu

```typescript
interface GameMetadata {
  id: string;                    // 'hanoi', 'sudoku', etc.
  name: string;                  // 'Tour de Hanoï'
  nameKey: string;               // Clé i18n
  description: string;           // Description courte
  descriptionKey: string;        // Clé i18n
  icon: ImageSourcePropType;     // Icône du jeu
  minAge: number;                // Âge minimum (5-7)
  maxAge: number;                // Âge maximum (8-12)
  category: GameCategory;        // Catégorie
  skills: CognitiveSkill[];      // 3-5 compétences ciblées
  status: 'available' | 'coming_soon' | 'locked';
  route: string;                 // '/(games)/01-hanoi'
}
```

### 2.4 GameSession — Session de jeu

```typescript
interface GameSession<TState = unknown> {
  gameId: string;
  levelId: string;
  startedAt: number;             // Timestamp début
  moveCount: number;             // Nombre de coups
  hintsUsed: number;             // Indices utilisés
  invalidMoves: number;          // Mouvements invalides
  gameState: TState;             // État spécifique au jeu
  status: 'intro' | 'playing' | 'paused' | 'victory' | 'abandoned';
}
```

### 2.5 LevelConfig — Configuration d'un niveau

```typescript
interface LevelConfig {
  id: string;                    // 'hanoi-level-1'
  gameId: string;                // 'hanoi'
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;          // Ordre d'affichage
  targetAge: number;             // Âge cible (6, 7, 8...)
  estimatedMinutes: number;      // Durée estimée
  optimalMoves?: number;         // Coups optimaux (optionnel)
}
```

### 2.6 Progression

```typescript
interface LevelCompletion {
  levelId: string;
  completedAt: number;
  bestMoveCount: number;
  bestTimeSeconds: number;
  timesCompleted: number;
  hintsUsed: number;
}

interface GameProgress {
  gameId: string;
  unlockedLevels: string[];
  completedLevels: Record<string, LevelCompletion>;
  totalPlayTimeMinutes: number;
  lastPlayedAt: number | null;
}
```

---

## 3. Couche 2 : Core Pédagogique

### Dossier : `/src/core/`

Le cœur de la logique pédagogique, **réutilisable par tous les jeux**.

```
src/core/
├── types/
│   └── core.types.ts       # Types pédagogiques
├── pedagogy/
│   ├── feedback.ts         # Messages de feedback
│   └── difficulty.ts       # Adaptation de difficulté
└── ai/
    ├── childAssistant.ts   # Assistant IA
    └── contextTracker.ts   # Suivi du contexte
```

### 3.1 Types Pédagogiques (`core.types.ts`)

#### Niveau d'aide Montessori

```typescript
type HelpLevel = 'full' | 'medium' | 'low' | 'none';
```

| Niveau | Description | Indices visuels |
|--------|-------------|-----------------|
| `full` | Aide maximale (débutant) | Zones cibles, chemin, pulsation |
| `medium` | Aide intermédiaire | Pulsation, options grisées |
| `low` | Aide minimale | Compteur de coups uniquement |
| `none` | Autonomie totale | Aucune aide visuelle |

#### Types de Feedback

```typescript
type FeedbackType =
  | 'success'       // Réussite d'une action
  | 'victory'       // Niveau terminé
  | 'error'         // Erreur (JAMAIS punitif)
  | 'hint'          // Indice donné
  | 'encouragement' // Encouragement général
  | 'streak'        // Série de succès
  | 'milestone';    // Accomplissement majeur
```

#### Déclencheurs de l'Assistant IA

```typescript
type AssistantTrigger =
  | 'game_start'      // Début du jeu
  | 'first_move'      // Premier mouvement
  | 'valid_move'      // Mouvement valide
  | 'invalid_move'    // Mouvement invalide
  | 'stuck'           // Enfant bloqué (inactivité)
  | 'repeated_error'  // Même erreur répétée
  | 'hint_requested'  // Indice demandé
  | 'near_victory'    // Proche de la victoire
  | 'victory'         // Victoire
  | 'level_up'        // Passage au niveau suivant
  | 'comeback'        // Retour après absence
  | 'streak';         // Série de réussites
```

### 3.2 Système de Feedback (`feedback.ts`)

**Principe fondamental** : Jamais de feedback punitif. Les erreurs sont des opportunités d'apprentissage.

#### Messages par type

| Type | Exemples | Mood |
|------|----------|------|
| **SUCCESS** | "Super !", "Bien joué !", "Bravo !" | `happy` |
| **VICTORY** | "Félicitations !", "Tu es un champion !" | `happy` + confetti |
| **ERROR** | "Essaie encore !", "Tu y es presque !" | `encouraging` |
| **HINT** | "Voici un petit indice...", "Regarde bien ici..." | `thinking` |
| **STREAK** | "3 de suite !", "Tu es en feu !" | `excited` |

#### Animations de Feedback

```typescript
const FEEDBACK_ANIMATIONS = {
  confetti: { type: 'confetti', duration: 2000, intensity: 'medium' },
  stars:    { type: 'stars', duration: 1000, intensity: 'light' },
  shake:    { type: 'shake', duration: 400, intensity: 'light' },
  pulse:    { type: 'pulse', duration: 800, intensity: 'light' },
  glow:     { type: 'glow', duration: 1500, color: '#F39C12' },
  bounce:   { type: 'bounce', duration: 600, intensity: 'light' },
};
```

#### Messages spécifiques par jeu

```typescript
// Tour de Hanoï
HANOI_MESSAGES.invalid_big_on_small
HANOI_MESSAGES.hint_free_big
HANOI_MESSAGES.method_learned

// Sudoku
SUDOKU_MESSAGES.conflict_row
SUDOKU_MESSAGES.conflict_column
SUDOKU_MESSAGES.hint_elimination

// Balance
BALANCE_MESSAGES.too_heavy_left
BALANCE_MESSAGES.almost_balanced
BALANCE_MESSAGES.discovery

// Suites Logiques
SUITES_MESSAGES.wrong_pattern
SUITES_MESSAGES.hint_observe
SUITES_MESSAGES.pattern_found
```

### 3.3 Adaptation de Difficulté (`difficulty.ts`)

Basé sur la **Zone de Développement Proximal (Vygotsky)** : ni trop facile, ni trop difficile.

#### Configuration par défaut

```typescript
const DEFAULT_ADAPTATION_CONFIG = {
  upgradeThreshold: {
    minCompletions: 3,      // 3 réussites minimum
    maxErrorRate: 0.2,      // 20% d'erreurs max
    maxHintsPerLevel: 1,    // 1 indice max
  },
  downgradeThreshold: {
    minErrors: 5,           // 5 erreurs → plus d'aide
    maxCompletionRate: 0.3, // Moins de 30% = simplifier
  },
  helpLevelProgression: {
    full:   { maxErrors: Infinity, maxCompletions: 0 },
    medium: { maxErrors: 5, maxCompletions: 2 },
    low:    { maxErrors: 3, maxCompletions: 4 },
    none:   { minCompletions: 6 },
  },
};
```

#### Indices visuels par niveau d'aide

```typescript
function getVisualHints(helpLevel: HelpLevel): VisualHintsConfig {
  // FULL : Toutes les aides
  // showTargetZones, highlightNextMove, showMovePath, pulseValidTargets,
  // dimInvalidOptions, showMoveCounter, showOptimalMoves

  // MEDIUM : Aide sélective
  // pulseValidTargets, dimInvalidOptions, showMoveCounter

  // LOW : Minimal
  // showMoveCounter uniquement

  // NONE : Aucune aide
}
```

### 3.4 Assistant IA Pédagogique (`childAssistant.ts`)

#### Principes

1. **Jamais punitif** — Encouragements personnalisés
2. **Non intrusif** — Cooldowns entre interventions
3. **Adaptatif** — Selon le rythme de l'enfant

#### Cooldowns d'intervention

```typescript
const INTERVENTION_COOLDOWNS = {
  AFTER_ENCOURAGEMENT: 10,  // 10s après encouragement
  AFTER_HINT: 15,           // 15s après indice
  AFTER_HELP: 20,           // 20s après aide
  AFTER_CELEBRATION: 5,     // 5s après célébration
  SAME_TYPE_COOLDOWN: 30,   // 30s entre même type
};
```

#### Probabilités d'intervention

```typescript
const INTERVENTION_PROBABILITIES = {
  ENCOURAGE_ON_SUCCESS: 0.3,  // 30% de chance d'encourager
  CELEBRATE_STREAK: 0.8,      // 80% pour streak
  HELP_WHEN_STUCK: 1.0,       // 100% si bloqué
};
```

#### Utilisation

```typescript
import { createChildAssistant } from '@/core/ai/childAssistant';

// Création
const assistant = createChildAssistant('hanoi', 'level-1', scripts);

// Enregistrement des actions
assistant.recordMove('moved_disk_1_to_tower_2');
assistant.recordError('tried_big_on_small');
assistant.recordHint();

// Obtention de messages
const welcomeMsg = assistant.getWelcomeMessage();
const victoryMsg = assistant.getVictoryMessage();
const errorMsg = assistant.getErrorMessage();
const hint = assistant.getHint();

// Intervention automatique
const intervention = assistant.getIntervention();
if (intervention) {
  showMessage(intervention.script.message);
}
```

---

## 4. Couche 3 : Registre des Jeux

### Fichier : `/src/games/registry.ts`

**Source unique de vérité** pour tous les jeux de l'application.

### 4.1 Structure

```typescript
export const gameRegistry: GameMetadata[] = [
  {
    id: 'hanoi',
    name: 'Tour de Hanoï',
    category: 'logic',
    skills: ['planning', 'problem_solving', 'sequencing', 'perseverance'],
    minAge: 6,
    maxAge: 10,
    status: 'available',
    route: '/(games)/01-hanoi',
  },
  // ... 14 autres jeux
];
```

### 4.2 Liste des 15 jeux

| # | ID | Nom | Catégorie | Statut |
|---|----|----|-----------|--------|
| 01 | `hanoi` | Tour de Hanoï | logic | available |
| 02 | `suites-logiques` | Suites Logiques | logic | available |
| 03 | `labyrinthe` | Labyrinthe | spatial | available |
| 04 | `balance` | Balance Logique | logic | available |
| 05 | `sudoku` | Sudoku Montessori | logic | available |
| 06 | `conteur-curieux` | Le Conteur Curieux | language | available |
| 07 | `memory` | Memory | memory | available |
| 08 | `tangram` | Puzzle Formes | spatial | available |
| 09 | `logix-grid` | Logix Grid | logic | available |
| 10 | `mots-croises` | Mots Croisés | language | available |
| 11 | `math-blocks` | MathBlocks | math | available |
| 12 | `matrices-magiques` | Matrices Magiques | logic | coming_soon |
| 13 | `embouteillage` | Embouteillage | logic | coming_soon |
| 14 | `fabrique-reactions` | Fabrique de Réactions | logic | coming_soon |
| 15 | `chasseur-papillons` | Chasseur de Papillons | memory | coming_soon |

### 4.3 Fonctions d'accès

```typescript
// Obtenir un jeu par ID
const hanoi = getGameById('hanoi');

// Obtenir tous les jeux disponibles
const availableGames = getAvailableGames();
```

---

## 5. Couche 4 : Structure d'un Jeu

### Pattern obligatoire

Chaque jeu dans `/src/games/{XX-nomJeu}/` doit suivre cette structure :

```
{nomJeu}/
├── index.ts                    # Exports publics (OBLIGATOIRE)
├── types.ts                    # Types spécifiques au jeu
│
├── components/                 # Composants UI
│   ├── index.ts                # Exports
│   ├── {Element}.tsx           # Éléments visuels
│   └── feedback/               # Écrans de victoire
│
├── hooks/
│   └── use{NomJeu}Game.ts      # Hook principal (~400 lignes)
│
├── logic/
│   ├── {nomJeu}Engine.ts       # Mécanique pure (pas de React)
│   └── validator.ts            # Validation des actions
│
├── data/
│   ├── levels.ts               # Configuration des niveaux
│   ├── assistantScripts.ts     # Scripts de l'assistant IA
│   └── themes.ts               # Thèmes visuels (optionnel)
│
└── screens/
    ├── index.ts
    ├── {NomJeu}IntroScreen.tsx  # Écran d'introduction
    └── {NomJeu}VictoryScreen.tsx # Écran de victoire
```

### 5.1 Hook Principal (`use{NomJeu}Game.ts`)

Structure type d'un hook de jeu (~400 lignes) :

```typescript
export function useHanoiGame(options: UseHanoiGameOptions = {}) {
  // ═══════════════════════════════════════════════════════════
  // 1. STATE INITIALIZATION
  // ═══════════════════════════════════════════════════════════
  const level = getDefaultLevel();
  const [gameState, setGameState] = useState(() => createInitialState(level));
  const [moveCount, setMoveCount] = useState(0);
  const [invalidMoveCount, setInvalidMoveCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // 2. STORE INTEGRATION
  // ═══════════════════════════════════════════════════════════
  const {
    startSession,
    incrementMoves,
    recordInvalidMove,
    endSession,
    recordCompletion,
  } = useStore();

  // ═══════════════════════════════════════════════════════════
  // 3. ASSISTANT IA
  // ═══════════════════════════════════════════════════════════
  const assistant = useMemo(
    () => createChildAssistant('hanoi', level.id, assistantScripts),
    [level.id]
  );

  // ═══════════════════════════════════════════════════════════
  // 4. SESSION LIFECYCLE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    startSession('hanoi', level.id, gameState);
    const welcome = assistant.getWelcomeMessage();
    if (welcome) showMessage(welcome);
  }, [level.id]);

  // ═══════════════════════════════════════════════════════════
  // 5. MOVE PROCESSING
  // ═══════════════════════════════════════════════════════════
  const makeMove = useCallback((from: TowerId, to: TowerId) => {
    const validation = validateMove(gameState, from, to);

    if (!validation.valid) {
      setInvalidMoveCount(c => c + 1);
      recordInvalidMove(validation.reason);
      assistant.recordError(validation.reason);
      // Feedback d'erreur bienveillant
      return;
    }

    // Appliquer le mouvement
    setGameState(prev => applyMove(prev, from, to));
    setMoveCount(c => c + 1);
    incrementMoves();
    assistant.recordMove(`${from}_to_${to}`);
  }, [gameState]);

  // ═══════════════════════════════════════════════════════════
  // 6. VICTORY DETECTION
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (checkVictory(gameState)) {
      setIsVictory(true);
      endSession();
      recordCompletion({
        gameId: 'hanoi',
        levelId: level.id,
        moveCount,
        timeSeconds: getElapsedTime(),
        hintsUsed: assistant.getSessionStats().hintsUsed,
      });
    }
  }, [gameState]);

  // ═══════════════════════════════════════════════════════════
  // 7. RETURN INTERFACE
  // ═══════════════════════════════════════════════════════════
  return {
    // État
    gameState,
    moveCount,
    invalidMoveCount,
    isVictory,
    level,

    // Actions
    makeMove,
    reset,
    showHint,
    nextLevel,

    // Assistant
    assistant,
  };
}
```

### 5.2 Engine (`{nomJeu}Engine.ts`)

Logique **pure** (pas de React, pas d'effets de bord) :

```typescript
// Création de l'état initial
export function createInitialState(config: LevelConfig): GameState { }

// Validation d'un mouvement
export function validateMove(state: GameState, action: Action): MoveValidation { }

// Application d'un mouvement
export function applyMove(state: GameState, action: Action): GameState { }

// Vérification de victoire
export function checkVictory(state: GameState): boolean { }

// Calcul de l'indice optimal
export function getOptimalHint(state: GameState): Hint { }
```

### 5.3 Niveaux (`levels.ts`)

```typescript
export const HANOI_LEVELS: LevelConfig[] = [
  {
    id: 'hanoi-easy-1',
    gameId: 'hanoi',
    difficulty: 'easy',
    displayOrder: 1,
    targetAge: 6,
    estimatedMinutes: 3,
    optimalMoves: 7,      // 2^3 - 1 pour 3 disques
    config: {
      diskCount: 3,
      towerCount: 3,
    },
  },
  // ...
];
```

### 5.4 Scripts Assistant (`assistantScripts.ts`)

```typescript
export const HANOI_ASSISTANT_SCRIPTS: AssistantScript[] = [
  {
    id: 'hanoi_welcome',
    gameId: 'hanoi',
    trigger: 'game_start',
    priority: 10,
    messages: [
      {
        id: 'welcome_1',
        text: 'Bienvenue ! Déplaçons ces disques ensemble.',
        mood: 'happy',
        duration: 3000,
        animation: 'wave',
      },
    ],
  },
  {
    id: 'hanoi_stuck',
    gameId: 'hanoi',
    trigger: 'stuck',
    priority: 100,
    conditions: [
      { field: 'idleTime', operator: 'gte', value: 30 },
    ],
    messages: [
      {
        id: 'stuck_1',
        text: 'Tu réfléchis ? Regarde le plus gros disque...',
        mood: 'thinking',
        duration: 3000,
      },
    ],
  },
  // ...
];
```

---

## 6. Couche 5 : Fiches Éducatives

### Dossier : `/Fiches Educatives/{XX-NomJeu}/`

Chaque jeu possède **4 fiches** standardisées :

### 6.1 FICHE_ACTIVITE.md

Pour l'implémentation technique et pédagogique.

```markdown
# Fiche Activité — [Nom du Jeu]

## Informations générales
- **Nom** : [Nom]
- **Tranche d'âge** : [6-7 / 7-8 / 8-9 / 9-10 ans]
- **Durée session** : [5-15 minutes]
- **Catégorie** : [logic / memory / spatial / math / language]

## Objectif pédagogique
[Ce que l'enfant apprend — 2-3 phrases]

## Méthode enseignée
[Le processus de réflexion explicité — la méthode que l'enfant doit intérioriser]

## Règles du jeu
1. [Règle 1]
2. [Règle 2]
3. [Règle 3]

## Déroulement UX
1. **Écran Intro** : [Description]
2. **Écran Jeu** : [Description]
3. **Écran Victoire** : [Description]

## Système de feedback
- **Succès** : [Réaction visuelle/sonore]
- **Erreur** : [Réaction encourageante]
- **Indice** : [Comment l'aide est présentée]
```

### 6.2 FICHE_PARENT.md (Documentation Markdown)

Guide d'accompagnement pour les parents (fichier Markdown, pas du code).

> ⚠️ **Distinction** : La "Fiche Parent" (`FICHE_PARENT.md`) est de la **documentation**. L'"Espace Parent" est le **dashboard dans l'app** (voir `src/types/parent.types.ts`).

```markdown
# Fiche Parent — [Nom du Jeu]

## Ce que développe cette activité
- [Compétence 1] : [Explication]
- [Compétence 2] : [Explication]
- ...

## Comment accompagner votre enfant
- [Conseil 1]
- [Conseil 2]
- [Conseil 3]

## Signaux de progression
- **Débutant** : [Comportement observé]
- **Intermédiaire** : [Comportement observé]
- **Avancé** : [Comportement observé]

## Transfert vie quotidienne
[Comment appliquer ces compétences au quotidien]
```

### 6.3 DIALOGUES_IA.md

Scripts de la mascotte par contexte.

```markdown
# Dialogues IA — [Nom du Jeu]

## Mascotte : [Nom] [Emoji]

## Avant de commencer
- "..." (6-7 ans)
- "..." (8-9 ans)

## Après une réussite
- "..."
- "..."

## Après une erreur
- "..."
- "..."

## Indices progressifs
1. "..." (indice léger)
2. "..." (indice moyen)
3. "..." (indice fort)
```

### 6.4 SPECS_TECHNIQUES.md

Spécifications techniques pour les développeurs.

```markdown
# Specs Techniques — [Nom du Jeu]

## Composants utilisés
- [Liste des composants]

## Animations (Reanimated 3)
- [Animation 1] : [spring/timing, durée]
- [Animation 2] : [spring/timing, durée]

## Sons
- [Son 1] : [Fichier, durée]
- [Son 2] : [Fichier, durée]

## États spécifiques
[Description de l'état du jeu]
```

---

## 7. Couche 6 : Store Global

### Fichier : `/src/store/useStore.ts`

État global partagé pour progression, sessions, profils.

### 7.1 Slices disponibles

```
src/store/slices/
├── appSlice.ts          # État app (loading, errors)
├── assistantSlice.ts    # Messages de l'assistant
├── collectionSlice.ts   # Collection de cartes
├── gameSessionSlice.ts  # Session de jeu en cours
├── goalsSlice.ts        # Objectifs parentaux
├── profileSlice.ts      # Profil utilisateur
├── progressSlice.ts     # Progression globale
└── screenTimeSlice.ts   # Temps d'écran
```

### 7.2 Interface principale

```typescript
interface GameStore {
  // Session
  currentSession: GameSession | null;
  startSession(gameId: string, levelId: string, state: unknown): void;
  incrementMoves(): void;
  recordInvalidMove(reason: string): void;
  endSession(): void;

  // Progression
  progress: Record<string, GameProgress>;
  recordCompletion(data: CompletedSession): void;
  unlockLevel(gameId: string, levelId: string): void;

  // Profil
  childProfile: ChildProfile;
  updateProfile(updates: Partial<ChildProfile>): void;
}
```

### 7.3 Utilisation

```typescript
import { useStore } from '@/store/useStore';

function MyGame() {
  const {
    startSession,
    incrementMoves,
    recordCompletion,
    progress,
  } = useStore();

  // Démarrer une session
  startSession('hanoi', 'level-1', initialState);

  // Enregistrer un mouvement
  incrementMoves();

  // Terminer avec succès
  recordCompletion({
    gameId: 'hanoi',
    levelId: 'level-1',
    moveCount: 15,
    timeSeconds: 120,
    hintsUsed: 1,
  });
}
```

---

## 8. Checklist Nouveau Jeu

### Phase 1 : Préparation

- [ ] Créer le dossier `/Fiches Educatives/{XX-NomJeu}/`
- [ ] Rédiger `FICHE_ACTIVITE.md`
- [ ] Rédiger `FICHE_PARENT.md`
- [ ] Rédiger `DIALOGUES_IA.md`
- [ ] Rédiger `SPECS_TECHNIQUES.md`

### Phase 2 : Implémentation

- [ ] Créer le dossier `/src/games/{XX-nomJeu}/`
- [ ] Créer `index.ts` (exports)
- [ ] Créer `types.ts` (types spécifiques)
- [ ] Créer `logic/{nomJeu}Engine.ts` (logique pure)
- [ ] Créer `data/levels.ts` (configuration niveaux)
- [ ] Créer `data/assistantScripts.ts` (scripts IA)
- [ ] Créer `hooks/use{NomJeu}Game.ts` (hook principal)
- [ ] Créer `components/` (composants UI)
- [ ] Créer `screens/{NomJeu}IntroScreen.tsx`
- [ ] Créer `screens/{NomJeu}VictoryScreen.tsx`

### Phase 3 : Intégration

- [ ] Ajouter dans `/src/games/registry.ts`
- [ ] Créer la route `/app/(games)/{XX-nomJeu}/`
- [ ] Créer `_layout.tsx` (Stack navigator)
- [ ] Créer `index.tsx` (point d'entrée)
- [ ] Créer `victory.tsx` (si écran séparé)

### Phase 4 : Validation

- [ ] Tester tous les niveaux
- [ ] Vérifier le feedback (jamais punitif)
- [ ] Vérifier l'assistant IA (cooldowns, messages)
- [ ] Vérifier la progression (store)
- [ ] Vérifier les touch targets (≥ 64dp)
- [ ] Vérifier les tailles de texte (≥ 18pt)

---

## 9. Diagramme d'Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATION                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│  │   Hanoi     │   │   Sudoku    │   │  MathBlocks │   ...     │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘           │
│         │                 │                 │                   │
│         └────────────────┼────────────────┘                    │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    REGISTRY.TS                          │   │
│  │              (GameMetadata × 15 jeux)                   │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         ▼                  ▼                  ▼                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│  │ feedback.ts │   │difficulty.ts│   │childAssist. │          │
│  │  (messages) │   │ (Vygotsky)  │   │    (IA)     │          │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘          │
│         │                 │                 │                   │
│         └────────────────┼────────────────┘                    │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  CORE.TYPES.TS                          │   │
│  │    (HelpLevel, FeedbackType, AssistantTrigger, etc.)    │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  GAME.TYPES.TS                          │   │
│  │  (GameMetadata, GameSession, LevelConfig, CognitiveSkill│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fichiers Clés (Récapitulatif)

| Couche | Fichier | Rôle |
|--------|---------|------|
| **Types** | `/src/types/game.types.ts` | Types universels (GameMetadata, CognitiveSkill) |
| **Core** | `/src/core/types/core.types.ts` | Types pédagogiques (HelpLevel, FeedbackType) |
| **Feedback** | `/src/core/pedagogy/feedback.ts` | Messages bienveillants + animations |
| **Difficulté** | `/src/core/pedagogy/difficulty.ts` | Adaptation Vygotsky/Montessori |
| **Assistant** | `/src/core/ai/childAssistant.ts` | IA pédagogique bienveillante |
| **Registry** | `/src/games/registry.ts` | Catalogue des 15 jeux |
| **Store** | `/src/store/useStore.ts` | État global (Zustand) |
| **Thème** | `/src/theme/index.ts` | Design system |

---

*Document de référence — Version 1.0 — 28 Décembre 2024*
