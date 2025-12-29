# Architecture - Suites Logiques (Suite Magique)

> Jeu de reconnaissance de patterns pour enfants de 6 à 12 ans

---

## Arborescence

```
02-suites-logiques/
├── index.ts                          # Point d'entrée du module
├── ARCHITECTURE_SuitesLogiques.md    # Ce document
│
├── types/
│   └── index.ts                      # Définitions TypeScript
│
├── constants/
│   └── gameConfig.ts                 # Configuration globale
│
├── data/
│   ├── patterns.ts                   # Définitions des 30+ patterns
│   ├── levels.ts                     # Configuration des 10 niveaux
│   ├── themes.ts                     # 6 thèmes visuels
│   ├── assistantScripts.ts           # Dialogues de Pixel le Robot
│   └── parentGuideData.ts            # Données fiche parent (ParentDrawer)
│
├── utils/
│   └── patternUtils.ts               # Fonctions utilitaires patterns
│
├── hooks/
│   ├── useSuitesGame.ts              # Logique principale du jeu
│   ├── useSuitesIntro.ts             # Hook orchestrateur (écran intro)
│   ├── useSequenceGenerator.ts       # Génération des séquences
│   ├── useSuitesSound.ts             # Gestion des sons
│   └── useStreakTracker.ts           # Suivi des séries
│
├── screens/
│   ├── index.ts                      # Export écran
│   └── SuitesIntroScreen.tsx         # Écran principal (GameIntroTemplate)
│
├── components/
│   ├── SuitesLogiquesGame.tsx        # Composant principal standalone
│   ├── SequenceDisplay.tsx           # Affichage séquence horizontale
│   ├── SequenceElement.tsx           # Élément individuel
│   ├── ChoicePanel.tsx               # Panneau des 4 choix
│   ├── MissingSlot.tsx               # Zone "?" manquante
│   ├── MascotRobot.tsx               # Pixel le Robot animé
│   └── svg/
│       ├── GeometricShapes.tsx       # Cercle, carré, triangle, losange, étoile
│       ├── FarmAnimals.tsx           # Vache, cochon, poule, mouton, cheval
│       ├── SpaceElements.tsx         # Fusée, lune, étoile, planète, alien
│       └── MusicElements.tsx         # Note, double croche, clé de sol, tambour
│
└── docs/
    └── CHANGELOG.md                  # Historique des modifications
```

---

## Description détaillée des fichiers

### 📄 index.ts
**Point d'entrée du module**

Exporte :
- `SuitesLogiquesGame` : composant principal
- Types : `ThemeType`, `SequenceElement`, `Sequence`, `GameState`, `SessionState`, `SessionStats`
- Données : `THEMES`, `DEFAULT_THEME`, `GAME_CONFIG`

---

### 📁 types/

#### 📄 index.ts
**Définitions TypeScript complètes**

| Type | Description |
|------|-------------|
| `ElementType` | Types d'éléments : `color`, `shape`, `number`, `image`, `size` |
| `PatternType` | 13 types de patterns : `ABAB`, `AABB`, `AAB`, `ABC`, `ABBC`, `AABBCC`, `increasing`, `decreasing`, `rotation`, `numeric_add`, `numeric_mult`, `fibonacci`, `custom` |
| `ThemeType` | 6 thèmes : `farm`, `space`, `shapes`, `colors`, `numbers`, `music` |
| `SequenceElement` | Structure d'un élément : `id`, `type`, `value`, `displayAsset`, `label`, `size?`, `rotation?` |
| `PatternDefinition` | Définition pattern : `type`, `cycle[]`, `transform?`, `step?`, `difficulty` (1-5) |
| `Sequence` | Séquence complète : `elements[]`, `missingIndex`, `correctAnswer`, `distractors[]`, `patternDef`, `theme`, `difficulty` |
| `Theme` | Config thème : `id`, `name`, `icon`, `elements[]`, `unlockCondition`, `ageRange` |
| `UnlockCondition` | Condition déblocage : `type` (`default`, `sequences`, `level`, `age`), `value?` |
| `GameState` | État jeu : `currentSequence`, `selectedAnswer`, `attempts`, `hintsUsed`, `currentHintLevel` (0-4), `isComplete`, `status` |
| `GameStatus` | Statuts : `idle`, `selected`, `checking`, `success`, `error`, `hint` |
| `SessionState` | État session : `sequencesCompleted`, `sequencesCorrectFirstTry`, `totalAttempts`, `totalHints`, `currentStreak`, `maxStreak`, `currentLevel`, `startTime`, `theme` |
| `PlayerProgress` | Progression : `currentLevel`, `sequencesPerLevel`, `totalSequences`, `unlockedThemes[]`, `badges[]` |
| `Badge` | Badge : `id`, `name`, `description`, `icon`, `unlockedAt` |
| `GameConfig` | Paramètres : `sequencesPerSession`, `maxAttempts`, `hintThresholds[]`, `levelUpThreshold`, `elementSize`, `choiceSize`, `animationDurations` |
| `SessionStats` | Stats fin session : `completed`, `correctFirstTry`, `maxStreak`, `totalTime` |

---

### 📁 constants/

#### 📄 gameConfig.ts
**Configuration globale du jeu**

| Constante | Description |
|-----------|-------------|
| `GAME_CONFIG` | 8 séquences/session, 5 tentatives max, indices auto après 2/3/4/5 erreurs, critères level-up (5 séquences, 60% premier essai, max 1 indice/suite), tailles (80dp éléments, 96dp choix), animations (100-500ms) |
| `HINT_CONFIG` | 5 niveaux d'indices : `none` → `verbal` (message) → `visual` (pulse) → `reduced` (2 choix) → `revealed` (réponse) |
| `PIXEL_MESSAGES` | Dialogues robot par situation : `intro`, `start`, `success`, `successFirstTry`, `error`, `hint1-4`, `thinking` |
| `ELEMENT_COLORS` | Palette : rouge `#E74C3C`, bleu `#3498DB`, vert `#27AE60`, jaune `#F1C40F`, violet `#9B59B6`, + couleurs UI |
| `DIMENSIONS` | Tailles : `sequenceElement` (80px, radius 12, spacing 16), `choice` (96px, radius 16, spacing 24), `missingSlot` (80px, border dashed 3px) |

---

### 📁 data/

#### 📄 patterns.ts
**Définitions des 30+ patterns par niveau**

| Niveau | Âge | Patterns | Description |
|--------|-----|----------|-------------|
| 1 | 6-7 ans | `ABAB`, `AABB`, `AAB` | Alternances simples |
| 2 | 7-8 ans | `ABC`, `ABBC`, `AAB` | Motifs à 3 éléments |
| 3 | 8 ans | `increasing`, `rotation`, `AABBCC` | Progressions visuelles (taille, rotation 90°) |
| 4 | 8-9 ans | `numeric_add` (+1, +2, +3) | Suites numériques simples |
| 5 | 9-10 ans | `numeric_mult` (×2), `fibonacci`, `custom` | Suites complexes |
| 6 | 9-10 ans | `mirror`, `ABCBA`, `rotation_45` | Motifs symétriques |
| 7 | 10 ans | `size_color`, `numeric_add` (+5), `AABBC` | Doubles transformations |
| 8 | 10-11 ans | `numeric_square`, `decreasing`, `ABCDCBA` | Suites avancées |
| 9 | 11 ans | `numeric_add` (+10), `nested`, `rotation_complex` | Combinaisons complexes |
| 10 | 11-12 ans | `numeric_mult` (×3), `prime`, `complex_pattern` | Expert |

**Helpers :**
- `getPatternsByDifficulty(difficulty)` : patterns d'un niveau
- `getRandomPattern(difficulty)` : pattern aléatoire
- `getSequenceLength(difficulty)` : longueur séquence (5→10 éléments)

---

#### 📄 levels.ts
**Configuration des 10 niveaux**

| Niveau | Difficulté | Âge cible | Durée | Indices | Nom |
|--------|------------|-----------|-------|---------|-----|
| 1 | easy | 6 ans | 3 min | 3 | Alternances |
| 2 | easy | 7 ans | 4 min | 3 | Trios |
| 3 | easy | 8 ans | 4 min | 3 | Transformations |
| 4 | medium | 8 ans | 5 min | 2 | Suites numériques |
| 5 | medium | 9 ans | 5 min | 2 | Fibonacci |
| 6 | medium | 9 ans | 6 min | 2 | Miroirs |
| 7 | medium | 10 ans | 6 min | 2 | Double défi |
| 8 | hard | 10 ans | 7 min | 1 | Carrés magiques |
| 9 | hard | 10 ans | 8 min | 1 | Expert |
| 10 | hard | 10 ans | 10 min | 1 | Maître des suites |

**Structure `SuitesLogiquesLevel` :**
```typescript
{
  id: string;
  gameId: 'suites-logiques';
  difficulty: 'easy' | 'medium' | 'hard';
  displayOrder: number;
  targetAge: number;
  estimatedMinutes: number;
  name: string;
  description: string;
  difficultyLevel: number; // 1-10
  patterns: PatternDefinition[];
  sequenceLength: number;
  hintsAvailable: number;
}
```

**Helpers :**
- `getLevel(levelId)` : niveau par ID
- `getDefaultLevel()` : niveau 1
- `getLevelByOrder(order)` : niveau par ordre
- `getLevelsByDifficulty(difficulty)` : niveaux par difficulté
- `getNextLevel(currentLevelId)` : niveau suivant
- `getRandomPatternForLevel(levelId)` : pattern aléatoire pour un niveau

---

#### 📄 themes.ts
**Configuration des 6 thèmes visuels**

| Thème | Icône | Éléments | Déblocage | Âge |
|-------|-------|----------|-----------|-----|
| `shapes` | 🔷 | cercle, carré, triangle, losange | défaut | 6-10 |
| `colors` | 🎨 | rouge, bleu, vert, jaune, violet | défaut | 6-7 |
| `farm` | 🐄 | vache, cochon, poule, mouton, cheval | défaut | 6-8 |
| `space` | 🚀 | fusée, lune, étoile, planète, alien | 10 séquences | 7-10 |
| `music` | 🎵 | note, double croche, clé de sol, tambour | niveau 2 | 7-9 |
| `numbers` | 🔢 | 1, 2, 3, 4, 5 (dynamique) | niveau 3 | 8-10 |

**Structure `Theme` :**
```typescript
{
  id: ThemeType;
  name: string;
  icon: string;
  ageRange: [number, number];
  unlockCondition: UnlockCondition;
  elements: SequenceElement[];
}
```

**Helpers :**
- `isThemeUnlocked(themeId, progress)` : vérifie si débloqué
- `getUnlockedThemes(progress)` : liste des thèmes débloqués

---

#### 📄 assistantScripts.ts
**Dialogues de Pixel le Robot**

| Trigger | Messages | Animation | Effet visuel |
|---------|----------|-----------|--------------|
| `level_start` | "Bip bip !", "Nouvelle suite !", "Cherche la logique !" | wave, scan, thinking | - |
| `first_move` | "Tu as fait un choix !", "Premier essai !" | processing, beep | - |
| `error` | "Pas celui-là...", "Essaie encore !", "Chaque erreur nous rapproche..." | error, thinking, encourage | - |
| `repeated_error` | "Je vais t'aider !", "Indice : cherche ce qui revient..." | helpful, pointing, scan | highlightPattern, showRepetition |
| `hint_requested` | "Compare le début et le milieu", "Scanne avec moi..." | detective, scan, musical | highlightComparison, stepByStep |
| `stuck` | "Prends ton temps !", "Besoin d'un scan ?" | idle, wave, thinking | - |
| `near_victory` | "Tu as presque trouvé !", "Plus qu'un élément !" | excited, encouraging | - |
| `victory` | "BINGO !", "Mission accomplie !", "Félicitations !" | celebrate, victory, proud | - |
| `streak` | "Vitesse lumière !", "Processeur en surchauffe !" | speed, fire | - |
| `comeback` | "Content de te revoir !", "Redémarrage..." | wave, bootup | - |

---

#### 📄 parentGuideData.ts
**Données pédagogiques pour le ParentDrawer**

Contient toutes les données structurées pour la fiche parent de l'activité :

| Export | Type | Description |
|--------|------|-------------|
| `suitesGameData` | `GameObjectiveData` | Objectif, règles, stratégie, tip |
| `suitesAppBehavior` | `AppBehaviorData` | Ce que fait / ne fait pas l'app |
| `suitesCompetences` | `CompetenceData[]` | 6 compétences (raisonnement inductif, classification, abstraction, mémoire, attention, patience) |
| `suitesScienceData` | `ScienceData` | Références scientifiques (Clements, Diamond, Rittle-Johnson) |
| `suitesAdvices` | `AdviceData[]` | 5 conseils situation → réponse parent |
| `suitesQuestionsDuring` | `QuestionData[]` | Questions pendant le jeu |
| `suitesQuestionsAfter` | `QuestionData[]` | Questions après le jeu |
| `suitesDailyActivities` | `DailyActivityData[]` | 4 activités quotidiennes (table, perles, voiture, frises) |
| `suitesResources` | `ResourceData[]` | Jeux recommandés (Dobble, Uno, Rummikub) |
| `suitesBadges` | `BadgeData[]` | Badges (observateur, persévérant, explicateur) |
| `suitesAgeExpectations` | `AgeExpectationData[]` | Attentes par âge (6-10 ans) |
| `suitesSettings` | `SettingData[]` | Paramètres parent (indices auto, voix, animations) |
| `suitesParentGuideData` | `object` | Export complet pour ParentDrawer |

---

### 📁 utils/

#### 📄 patternUtils.ts
**Fonctions utilitaires pour les patterns**

| Fonction | Description |
|----------|-------------|
| `selectBaseElements(elements, count)` | Sélectionne N éléments aléatoires du thème |
| `applySizeTransform(element, index, step)` | Applique transformation de taille : `small` → `medium` → `large` |
| `applyRotationTransform(element, index, step)` | Applique rotation progressive (0°, 90°, 180°...) |
| `applyNumericTransform(element, index, step, patternType)` | Génère suites numériques : `+n`, `×n`, Fibonacci |
| `fibonacci(n)` | Calcul du n-ième terme de Fibonacci |
| `generateDistractors(allElements, correctAnswer, count, pattern)` | Génère 3 mauvaises réponses intelligentes (proches numériquement ou visuellement différentes) |
| `shuffle<T>(array)` | Mélange Fisher-Yates |
| `generateId()` | Génère ID unique : `timestamp_random9chars` |

---

### 📁 hooks/

#### 📄 useSuitesGame.ts
**Hook principal - Logique complète du jeu**

**Props :**
```typescript
interface UseSuitesGameProps {
  theme: ThemeType;
  initialLevel?: number;
}
```

**États retournés :**
| État | Type | Description |
|------|------|-------------|
| `gameState` | `GameState` | Séquence courante, réponse sélectionnée, tentatives, indices, status |
| `sessionState` | `SessionState` | Compteurs session, streak, niveau courant |
| `currentSequence` | `Sequence \| null` | Séquence en cours |
| `isSessionComplete` | `boolean` | Vrai si 8 séquences terminées |

**Actions retournées :**
| Action | Description |
|--------|-------------|
| `selectAnswer(element)` | Sélectionne une réponse (status → `selected`) |
| `confirmAnswer()` | Vérifie la réponse, gère succès/erreur, indices auto après 2/3/4/5 erreurs, révèle après 5 tentatives |
| `requestHint()` | Demande un indice manuel (niveau 0→1→2→3→4) |
| `nextSequence()` | Génère la séquence suivante, reset état |
| `checkLevelUp()` | Vérifie critères de montée de niveau (5 séquences, 60% premier essai, max 1 indice/suite) |

---

#### 📄 useSequenceGenerator.ts
**Hook de génération de séquences**

**Entrée :** `theme: ThemeType`

**Retour :** `{ generateSequence: (difficulty: number) => Sequence }`

**Algorithme `generateSequence()` :**
1. Récupère un pattern aléatoire pour la difficulté
2. Calcule la longueur de séquence (5-10 selon difficulté)
3. Sélectionne les éléments de base du thème
4. Construit la séquence selon le cycle du pattern
5. Applique les transformations (size/rotation/numeric) si nécessaire
6. Retire le dernier élément → `correctAnswer`
7. Génère 3 distracteurs intelligents
8. Retourne la `Sequence` complète

---

#### 📄 useSuitesSound.ts
**Hook de gestion des sons**

**Sons disponibles :**
| Son | Fichier | Volume | Description |
|-----|---------|--------|-------------|
| `select` | `robot_select.mp3` | 0.6 | Bip court sélection |
| `correct` | `robot_correct.mp3` | 0.8 | Bips joyeux bonne réponse |
| `error` | `robot_error.mp3` | 0.7 | Bip descendant mauvaise réponse |
| `thinking` | `robot_thinking.mp3` | 0.5 | Bips espacés réflexion |
| `ambient` | `robot_ambient.mp3` | 0.15 | Fond sonore robotique (~10s loop) |

**Actions retournées :**
| Action | Description |
|--------|-------------|
| `playSound(name, volumeOverride?)` | Joue un son spécifique |
| `playSelect()` | Raccourci son sélection |
| `playCorrect()` | Raccourci son correct |
| `playError()` | Raccourci son erreur |
| `playThinking()` | Raccourci son réflexion |
| `startAmbient()` | Démarre boucle fond sonore |
| `stopAmbient()` | Arrête boucle fond sonore |

---

#### 📄 useStreakTracker.ts
**Hook de suivi des séries de réussites**

**Retour :**
| Valeur | Type | Description |
|--------|------|-------------|
| `streak` | `number` | Série actuelle |
| `maxStreak` | `number` | Meilleure série de la session |
| `incrementStreak()` | `() => void` | +1 et met à jour max si nécessaire |
| `resetStreak()` | `() => void` | Remet à 0 après une erreur |

---

#### 📄 useSuitesIntro.ts
**Hook orchestrateur pour l'écran d'introduction**

Encapsule toute la logique métier de l'écran d'introduction :
- Progression store (lecture/écriture)
- Paramètres URL
- Génération des niveaux
- Messages mascotte
- Sons
- Animations de transition
- Navigation

**Type de retour : `UseSuitesIntroReturn`**

| Propriété | Type | Description |
|-----------|------|-------------|
| `levels` | `LevelConfig[]` | Niveaux générés selon l'âge |
| `selectedLevel` | `LevelConfig \| null` | Niveau sélectionné |
| `handleSelectLevel` | `(level) => void` | Sélectionner un niveau |
| `isPlaying` | `boolean` | Mode jeu actif |
| `isVictory` | `boolean` | Session terminée |
| `showParentDrawer` | `boolean` | Fiche parent visible |
| `setShowParentDrawer` | `(show) => void` | Afficher/masquer fiche parent |
| `selectorStyle` | `AnimatedStyle` | Style animé du sélecteur |
| `progressPanelStyle` | `AnimatedStyle` | Style animé du panel progression |
| `mascotMessage` | `string` | Message de Pixel |
| `mascotEmotion` | `EmotionType` | Émotion actuelle |
| `gameState` | `GameState` | État du jeu (depuis useSuitesGame) |
| `sessionState` | `SessionState` | État de la session |
| `currentSequence` | `Sequence \| null` | Séquence en cours |
| `progressData` | `object` | Données pour ProgressPanel |
| `handleSelectAnswer` | `(element) => void` | Sélectionner une réponse |
| `handleConfirm` | `() => void` | Confirmer la réponse |
| `handleReset` | `() => void` | Nouvelle séquence |
| `handleHint` | `() => void` | Demander un indice |
| `handleBack` | `() => void` | Retour (jeu → sélection ou home) |
| `handleStartPlaying` | `() => void` | Démarrer le mode jeu |
| `handleParentPress` | `() => void` | Ouvrir fiche parent |
| `handleHelpPress` | `() => void` | Afficher aide |
| `handleForceComplete` | `() => void` | DEV: Forcer fin niveau |
| `hintsRemaining` | `number` | Indices restants (4 - hintLevel) |
| `canPlayAudio` | `boolean` | Audio autorisé (= isPlaying) |

**Animations :**
| Valeur partagée | Description |
|-----------------|-------------|
| `selectorY` | Translation Y du sélecteur (0 → -150) |
| `selectorOpacity` | Opacité du sélecteur (1 → 0) |
| `progressPanelOpacity` | Opacité du panel progression (0 → 1) |

**Constants :**
```typescript
const ANIMATION_CONFIG = {
  selectorSlideDuration: 400,
  selectorFadeDuration: 300,
  progressDelayDuration: 200,
  selectorSlideDistance: -150,
  springDamping: 15,
  springStiffness: 150,
};
const TOTAL_SEQUENCES = 8;
```

---

### 📁 screens/

#### 📄 SuitesIntroScreen.tsx
**Écran principal du jeu (architecture Hook + Template)**

Utilise le pattern **Hook + Template** :
- `useSuitesIntro()` : toute la logique métier
- `GameIntroTemplate` : UI partagée avec les autres jeux
- Composants spécifiques : `MascotRobot`, `SequenceDisplay`, `ChoicePanel`
- `ParentDrawer` : fiche pédagogique pour les parents

**Structure du composant :**
```tsx
<GameIntroTemplate
  // Header
  title="Suites Logiques"
  emoji="🔮"
  onBack, onParentPress, onHelpPress
  showParentButton, showHelpButton

  // Niveaux
  levels, selectedLevel, onSelectLevel
  renderLevelCard={SuitesLevelCard}

  // Jeu
  renderGame, isPlaying, onStartPlaying

  // Progress
  renderProgress

  // Mascot
  mascotComponent={<MascotRobot />}

  // Floating buttons
  showResetButton, onReset
  showHintButton, onHint
  hintsRemaining, hintsDisabled
  onForceComplete (DEV)

  // Victory
  isVictory
/>
<ParentDrawer {...suitesParentGuideData} />
```

**Composant SuitesLevelCard :**
- Carte personnalisée pour la grille de niveaux
- Affiche icône thème (🔷 ou 🔒), numéro, étoiles si complété
- États visuels : normal, complété (vert), sélectionné (bleu), verrouillé (grisé)

**renderGame() :**
- Si pas de séquence : message "Sélectionne un niveau"
- Zone séquence : `SequenceDisplay` + `MissingSlot`
- Zone choix (si isPlaying) : `ChoicePanel` avec animation FadeIn

**renderProgress() :**
- Panel de stats style Hanoi : COUPS | RÉUSSIES | ERREURS | RECORD
- Barre de progression + message d'encouragement

---

### 📁 components/

#### 📄 SuitesLogiquesGame.tsx
**Composant principal standalone**

**Props :**
```typescript
interface Props {
  theme?: ThemeType;        // défaut: 'shapes'
  initialLevel?: number;    // défaut: 1
  onSessionEnd?: (stats: SessionStats) => void;
  onExit?: () => void;
}
```

**Layout :**
```
┌────────────────────────────────────────┐
│ ←  🔮 Suites Logiques    Niveau 1 0/8  │  Header
├────────────────────────────────────────┤
│  [Robot]  "Message de Pixel..."        │  Mascotte
├────────────────────────────────────────┤
│   ○  □  △  ◇  ○  □  [?]               │  Séquence
├────────────────────────────────────────┤
│     [○]  [□]  [△]  [◇]                │  Choix
│           [✓ Valider]                  │
├────────────────────────────────────────┤
│  💡 Indice                             │  Actions
├────────────────────────────────────────┤
│      3 🔥 Streak  │  1 💡 Indices      │  Stats
└────────────────────────────────────────┘
```

---

#### 📄 SequenceDisplay.tsx
**Affichage de la séquence horizontale**

**Props :**
```typescript
interface Props {
  sequence: Sequence;
  selectedAnswer: SequenceElement | null;
  status: GameStatus;
  hintLevel: number;
  onDropInSlot?: () => void;
}
```

**Comportement :**
- ScrollView horizontal avec éléments + slot manquant
- Animation `FadeInRight` décalée (100ms × index)
- Indices niveau 1+ : surbrillance des 2 premiers éléments
- Indices niveau 2+ : pulsation des éléments similaires au pattern

---

#### 📄 SequenceElement.tsx
**Affichage d'un élément individuel**

**Props :**
```typescript
interface Props {
  element: SequenceElement;
  index?: number;
  isPulsing?: boolean;
  isHighlighted?: boolean;
  size?: number;
}
```

**Rendu selon `element.type` :**
| Type | Rendu |
|------|-------|
| `image` | Composant SVG (animaux, espace, musique) |
| `color` | Cercle coloré avec `backgroundColor` |
| `shape` | Forme géométrique SVG avec couleur/rotation |
| `number` | Texte centré avec fontSize proportionnelle |

**Animation pulsation :**
```typescript
scale: withRepeat(withSequence(
  withTiming(1.1, { duration: 500 }),
  withTiming(1.0, { duration: 500 })
), -1, true)
```

---

#### 📄 ChoicePanel.tsx
**Panneau des 4 choix de réponse**

**Props :**
```typescript
interface Props {
  choices: SequenceElement[];
  selectedId: string | undefined;
  onSelect: (element: SequenceElement) => void;
  onConfirm?: (element: SequenceElement) => void;
  disabled: boolean;
  hintLevel: number;
  correctAnswerId: string;
  status?: 'playing' | 'checking' | 'success' | 'error' | 'hint';
}
```

**Comportement :**
- Mélange les choix une seule fois (conservé via `useRef`)
- Filtrage selon niveau d'indice :
  - Normal : 4 choix
  - Niveau 3 : 2 choix (correct + 1 distracteur)
  - Niveau 4 : 1 choix (réponse seule)
- Animation shake sur erreur
- Couleur de fond selon status (vert/rouge)
- Bouton "✓ Valider" apparaît après sélection

---

#### 📄 MissingSlot.tsx
**Zone "?" pour l'élément manquant**

**Props :**
```typescript
interface Props {
  expectedElement: SequenceElement;
  placedElement: SequenceElement | null;
  status: GameStatus;
  onDrop?: () => void;
  size?: number;
}
```

**Comportement :**
- Affiche "?" avec bordure dashed pulsante quand vide
- Affiche l'élément placé/correct quand rempli
- Animation bordure : alternance `highlight` ↔ `border` color

---

#### 📄 MascotRobot.tsx
**Pixel le Robot - Mascotte animée**

**Props :**
```typescript
interface MascotRobotProps {
  message: string;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'encouraging';
  visible?: boolean;
  canPlayAudio?: boolean;
}
```

**Émotions :**
| Émotion | Bouche | Yeux | Couleur |
|---------|--------|------|---------|
| `neutral` | ligne droite | scale 1 | #4A4A4A |
| `happy` | sourire léger | scale 1.2 | #7BC74D |
| `thinking` | petite courbe | scale 0.8 | #5B8DEE |
| `excited` | grand sourire | scale 1.5 pulsant | #FFD700 |
| `encouraging` | sourire modéré | scale 1.1 | #FFB347 |

**Animations :**
| Animation | Description |
|-----------|-------------|
| `bodyY` | Flottement idle (-8px ↔ 0, 1500ms) |
| `antennaRotate` | Balancement antenne (-15° ↔ 15°, 1000ms) |
| `eyesPulse` | Pulsation yeux selon émotion |
| `screenGlow` | Lueur écran (opacity 0.5 ↔ 1, 2000ms) |

**Effet typewriter :**
- 35ms par caractère
- Curseur "|" pendant la frappe
- Audio MP3 si message reconnu (SL-01 à SL-05)

---

### 📁 components/svg/

#### 📄 GeometricShapes.tsx
**Formes géométriques SVG**

| Composant | Props | Description |
|-----------|-------|-------------|
| `CircleSVG` | size, color, rotation | Cercle plein avec bordure |
| `SquareSVG` | size, color, rotation | Carré avec coins arrondis (10%) |
| `TriangleSVG` | size, color, rotation | Triangle équilatéral |
| `DiamondSVG` | size, color, rotation | Losange (4 points) |
| `StarSVG` | size, color, rotation | Étoile 5 branches (calcul trigonométrique) |

---

#### 📄 FarmAnimals.tsx
**Animaux de ferme SVG (style plat vectoriel)**

| Composant | Éléments visuels |
|-----------|------------------|
| `CowSVG` | Corps blanc ellipse, taches noires, oreilles roses, museau rose, pattes noires |
| `PigSVG` | Corps rose, oreilles triangulaires, groin avec narines, queue tire-bouchon |
| `ChickenSVG` | Corps blanc, crête rouge, bec orange, aile, pattes orange |
| `SheepSVG` | Corps laineux (5 cercles flocons), tête noire ovale, pattes noires |
| `HorseSVG` | Corps marron, cou, tête allongée, oreilles, crinière, queue |

---

#### 📄 SpaceElements.tsx
**Éléments spatiaux SVG**

| Composant | Éléments visuels |
|-----------|------------------|
| `RocketSVG` | Corps rouge, pointe sombre, hublot bleu, ailerons jaunes, flammes orange/rouge |
| `MoonSVG` | Cercle beige, 4 cratères de tailles variées, détails de surface |
| `StarSpaceSVG` | Étoile jaune 5 branches (calcul trigonométrique), brillance centrale |
| `PlanetSVG` | Sphère bleue, bandes horizontales, anneaux dorés style Saturne |
| `AlienSVG` | Tête verte ovale, antennes violettes, grands yeux noirs, corps vert, bras |

---

#### 📄 MusicElements.tsx
**Éléments musicaux SVG**

| Composant | Éléments visuels |
|-----------|------------------|
| `NoteSVG` | Croche : tête ovale inclinée -20°, tige, drapeau courbe |
| `DoubleNoteSVG` | Double croche : 2 notes liées par barre horizontale |
| `ClefSVG` | Clé de sol simplifiée : path courbe complexe + point central |
| `DrumSVG` | Tambour : corps cylindrique, lacets zigzag dorés, 2 baguettes avec embouts roses |
| `StaffNoteSVG` | Portée 5 lignes + note avec drapeau (bonus) |

---

## Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                        SuitesIntroScreen                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Level Select │  │ MascotRobot  │  │    Game Area          │  │
│  │   (levels)   │  │  (message,   │  │ ┌──────────────────┐ │  │
│  │              │  │   emotion)   │  │ │ SequenceDisplay  │ │  │
│  └──────────────┘  └──────────────┘  │ │  + MissingSlot   │ │  │
│         │                            │ └──────────────────┘ │  │
│         ▼                            │ ┌──────────────────┐ │  │
│  useSuitesGame ◄─────────────────────┤ │   ChoicePanel    │ │  │
│  ┌────────────────────────────────┐  │ └──────────────────┘ │  │
│  │ gameState    │ sessionState    │  └──────────────────────┘  │
│  │ - sequence   │ - completed     │                            │
│  │ - selected   │ - streak        │                            │
│  │ - attempts   │ - level         │                            │
│  │ - hintLevel  │                 │                            │
│  │ - status     │                 │                            │
│  └────────────────────────────────┘                            │
│         │                                                      │
│         ▼                                                      │
│  useSequenceGenerator                                          │
│  ┌────────────────────────────────┐                            │
│  │ generateSequence(difficulty)   │                            │
│  │ - getRandomPattern()           │                            │
│  │ - selectBaseElements()         │                            │
│  │ - apply transforms             │                            │
│  │ - generateDistractors()        │                            │
│  └────────────────────────────────┘                            │
│         │                                                      │
│         ▼                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │   themes    │  │  patterns   │  │    patternUtils     │    │
│  │  (elements) │  │ (definitions)│  │ (transformations)   │    │
│  └─────────────┘  └─────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cycle de jeu

```
┌──────────────────────────────────────────────────────────────┐
│                         DÉMARRAGE                            │
│  1. Sélection niveau → generateSequence(difficulty)          │
│  2. Affichage séquence + 4 choix mélangés                    │
│  3. Mascotte : "Trouve ce qui vient après !"                 │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     SÉLECTION RÉPONSE                        │
│  1. Joueur sélectionne un choix → selectAnswer()             │
│  2. Choix surligné, bouton "Valider" apparaît                │
│  3. Mascotte : "Clique sur Valider !"                        │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                      CONFIRMATION                            │
│  confirmAnswer() → compare avec correctAnswer                │
└──────────────────────────────────────────────────────────────┘
                    │                    │
           CORRECT ▼                    ▼ ERREUR
┌─────────────────────────┐  ┌─────────────────────────────────┐
│       SUCCÈS            │  │           ERREUR                │
│ 1. playCorrect() 🎵     │  │ 1. playError() 🎵               │
│ 2. streak++             │  │ 2. attempts++                   │
│ 3. Mascotte excited     │  │ 3. Si attempts ∈ [2,3,4,5] :    │
│ 4. Délai 1.2s           │  │    → indice auto (hintLevel++)  │
│ 5. Si session complete: │  │ 4. Si attempts >= 5 :           │
│    → onSessionEnd()     │  │    → révéler réponse            │
│    Sinon: nextSequence()│  │ 5. Mascotte encouraging         │
└─────────────────────────┘  └─────────────────────────────────┘
                    │                    │
                    └────────┬───────────┘
                             ▼
                   ┌───────────────────┐
                   │ SÉQUENCE SUIVANTE │
                   │  nextSequence()   │
                   └───────────────────┘
```

---

## Système d'indices

```
┌────────────────────────────────────────────────────────────────┐
│ Niveau 0 : Aucun indice                                        │
│  → Aucun effet visuel                                          │
├────────────────────────────────────────────────────────────────┤
│ Niveau 1 : Verbal (après 2 erreurs)                            │
│  → Message : "Regarde les 2-3 premiers éléments..."            │
│  → Effet : Surbrillance des 2 premiers éléments                │
├────────────────────────────────────────────────────────────────┤
│ Niveau 2 : Visuel (après 3 erreurs)                            │
│  → Message : "Les éléments qui brillent sont pareils..."       │
│  → Effet : Pulsation des éléments similaires au pattern        │
├────────────────────────────────────────────────────────────────┤
│ Niveau 3 : Réduit (après 4 erreurs)                            │
│  → Message : "C'est forcément l'un de ces deux !"              │
│  → Effet : Filtrage à 2 choix (correct + 1 distracteur)        │
├────────────────────────────────────────────────────────────────┤
│ Niveau 4 : Révélé (après 5 erreurs)                            │
│  → Message : "Regarde, c'était celui-là !"                     │
│  → Effet : Seule la bonne réponse visible + highlight          │
└────────────────────────────────────────────────────────────────┘
```

---

## Dépendances externes

| Package | Usage |
|---------|-------|
| `react-native-reanimated` | Animations fluides (FadeIn, withSpring, withRepeat, useAnimatedStyle) |
| `react-native-svg` | Rendu des formes et illustrations |
| `expo-audio` | Lecture des sons (useAudioPlayer) |
| `expo-linear-gradient` | Dégradés de fond |
| `expo-router` | Navigation (useRouter, useLocalSearchParams) |
| `react-native-safe-area-context` | Gestion des zones sûres |

---

## Composants partagés utilisés

| Composant | Source | Usage |
|-----------|--------|-------|
| `GameIntroTemplate` | `components/common` | Template UI pour écran intro (header, niveaux, jeu, progress) |
| `LevelConfig` | `components/common` | Type pour configuration des niveaux |
| `generateDefaultLevels` | `components/common` | Génère les 10 niveaux selon l'âge |
| `ParentDrawer` | `components/parent/ParentDrawer` | Tiroir avec fiche pédagogique |
| `useStore` | `store/useStore` | Store Zustand (profils, progression) |
| `useActiveProfile` | `store/useStore` | Profil enfant actif |
| `useGameProgress` | `store/useStore` | Progression pour ce jeu |
| `colors`, `spacing`, etc. | `theme` | Constantes de design |

---

## Assets audio

| Fichier | Description |
|---------|-------------|
| `assets/sounds/robot_select.mp3` | Bip sélection |
| `assets/sounds/robot_correct.mp3` | Bips joyeux |
| `assets/sounds/robot_error.mp3` | Bip descendant |
| `assets/sounds/robot_thinking.mp3` | Bips espacés |
| `assets/sounds/robot_ambient.mp3` | Fond robotique (~10s) |
| `assets/audio/suites-logiques/SL-01.mp3` | "Trouve ce qui vient après..." |
| `assets/audio/suites-logiques/SL-02.mp3` | "Regarde bien cette suite..." |
| `assets/audio/suites-logiques/SL-03.mp3` | "Bip ! Nouvelle suite !" |
| `assets/audio/suites-logiques/SL-04.mp3` | "Clique sur Valider..." |
| `assets/audio/suites-logiques/SL-05.mp3` | "Qu'est-ce qui se répète ?" |

---

## Critères de progression

| Critère | Valeur | Description |
|---------|--------|-------------|
| Séquences par session | 8 | Nombre fixe avant fin de session |
| Tentatives max | 5 | Avant révélation automatique |
| Level up - séquences | 5 minimum | Séquences réussies requises |
| Level up - taux succès | 60% | Réussites au premier essai |
| Level up - taux indices | 1 max | Moyenne indices par séquence |

---

## Navigation (expo-router)

**Routes :**
| Route | Fichier | Description |
|-------|---------|-------------|
| `/(games)/02-suites-logiques` | `SuitesIntroScreen.tsx` | Écran principal |
| `/(games)/02-suites-logiques/victory` | `victory.tsx` | Écran de victoire |

**Paramètres URL :**

*Entrée (depuis victory.tsx) :*
| Param | Type | Description |
|-------|------|-------------|
| `level` | `string` | Niveau à pré-sélectionner |

*Sortie (vers victory.tsx) :*
| Param | Type | Description |
|-------|------|-------------|
| `completed` | `string` | Séquences complétées |
| `correctFirstTry` | `string` | Réussies au premier essai |
| `maxStreak` | `string` | Meilleure série |
| `totalTime` | `string` | Temps total (ms) |
| `level` | `string` | Niveau joué |
| `hintsUsed` | `string` | Indices utilisés |

**Navigation :**
```typescript
// Vers victory
router.push({
  pathname: '/(games)/02-suites-logiques/victory',
  params: { completed, correctFirstTry, maxStreak, totalTime, level, hintsUsed }
});

// Retour à l'accueil
router.replace('/');
```
