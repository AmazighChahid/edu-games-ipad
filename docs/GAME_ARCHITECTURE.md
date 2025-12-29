# Architecture des Jeux Éducatifs

> **Dernière mise à jour** : 29 Décembre 2024

## Pattern Hook + Template

Chaque jeu éducatif **devrait** suivre une architecture standardisée pour maximiser le code partagé et minimiser la duplication.

> **⚠️ IMPORTANT** : Actuellement, seul **02-suites-logiques** implémente l'architecture complète.
> C'est la **RÉFÉRENCE** à suivre pour tous les nouveaux jeux.

```
┌─────────────────────────────────────────────────────────────┐
│                    GameIntroTemplate                        │
│  (UI pure, réutilisable pour TOUTES les activités)          │
│  - Header, Level selector, Layout, Animations               │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ props
┌─────────────────────────────────────────────────────────────┐
│                    XxxIntroScreen.tsx                       │
│  (Assemblage minimal ~100-150 lignes)                       │
│  - Appelle le hook + passe les props au template            │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ utilise
┌─────────────────────────────────────────────────────────────┐
│                    useXxxIntro.ts                           │
│  (Hook orchestrateur - toute la logique métier)             │
│  - Progression, Niveaux, Mascot, Sons, Navigation           │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ utilise
┌─────────────────────────────────────────────────────────────┐
│              useXxxGame.ts + useXxxSound.ts                 │
│  (Hooks spécifiques - logique de jeu pure)                  │
│  - Règles du jeu, état de partie, sons                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Structure des fichiers

```
src/games/XX-nom-jeu/
├── hooks/
│   ├── useXxxGame.ts       # Logique de jeu pure (règles, état, validation)
│   ├── useXxxSound.ts      # Chargement et lecture des sons
│   └── useXxxIntro.ts      # ORCHESTRATEUR : progression, UI state, navigation
├── screens/
│   └── XxxIntroScreen.tsx  # Assemblage minimal (~100-150 lignes)
├── components/
│   ├── XxxMascot.tsx       # Mascotte spécifique au jeu
│   └── ...                 # Composants visuels spécifiques
├── constants/
│   └── gameConfig.ts       # Messages, config, thèmes
├── data/
│   └── levels.ts           # Définition des niveaux
└── types/
    └── index.ts            # Types TypeScript
```

---

## Responsabilités des fichiers

| Fichier | Responsabilité | Partageable |
|---------|----------------|-------------|
| `useXxxGame.ts` | Règles du jeu, état de partie, validation | Non |
| `useXxxSound.ts` | Chargement et lecture des sons | Non |
| `useXxxIntro.ts` | Progression store, niveaux, mascot, animations, navigation | Pattern réutilisable |
| `XxxIntroScreen.tsx` | JSX minimal, utilise hook + template | Non |
| `GameIntroTemplate` | Header, selector, layout, boutons flottants | **Oui (100%)** |
| `ProgressPanel` | Affichage des métriques de progression | **Oui (100%)** |
| `VictoryCard` | Écran de victoire | **Oui (100%)** |
| `PageContainer` | Container avec background | **Oui (100%)** |
| `ScreenHeader` | Header standardisé | **Oui (100%)** |

---

## Hook useXxxIntro - Structure type

```typescript
// src/games/XX-nom-jeu/hooks/useXxxIntro.ts

export interface UseXxxIntroReturn {
  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  handleSelectLevel: (level: LevelConfig) => void;

  // État jeu
  isPlaying: boolean;
  isVictory: boolean;

  // Animations (Reanimated styles)
  selectorStyle: AnimatedStyle;
  progressPanelStyle: AnimatedStyle;

  // Mascot
  mascotMessage: string;
  mascotEmotion: EmotionType;

  // Game state (depuis useXxxGame)
  gameState: GameState;
  sessionState: SessionState;

  // Progress data
  progressData: {
    current: number;
    total: number;
    streak?: number;
  };

  // Handlers
  handleBack: () => void;
  handleStartPlaying: () => void;
  handleReset: () => void;
  handleHint: () => void;
  handleParentPress: () => void;
  handleHelpPress: () => void;
  // + handlers spécifiques au jeu

  // Hints
  hintsRemaining: number;
  canPlayAudio: boolean;
}

export function useXxxIntro(): UseXxxIntroReturn {
  // 1. Router et params URL
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string }>();

  // 2. Store - progression
  const gameProgress = useGameProgress('xxx-game');
  const initGameProgress = useStore((state) => state.initGameProgress);

  // 3. Hooks de jeu existants
  const gameHook = useXxxGame({ ... });
  const { playSound } = useXxxSound();

  // 4. État local
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("...");

  // 5. Animations
  const selectorY = useSharedValue(0);
  const selectorOpacity = useSharedValue(1);
  // ...

  // 6. Effects (sélection auto niveau, feedback jeu, etc.)
  useEffect(() => { ... }, []);

  // 7. Handlers
  const handleSelectLevel = useCallback(() => { ... }, []);
  const handleBack = useCallback(() => { ... }, []);
  // ...

  // 8. Return
  return {
    levels, selectedLevel, handleSelectLevel,
    isPlaying, isVictory,
    selectorStyle, progressPanelStyle,
    mascotMessage, mascotEmotion,
    gameState, sessionState, progressData,
    handleBack, handleStartPlaying, handleReset, handleHint,
    hintsRemaining, canPlayAudio,
  };
}
```

---

## Screen XxxIntroScreen - Structure type

```typescript
// src/games/XX-nom-jeu/screens/XxxIntroScreen.tsx

export default function XxxIntroScreen() {
  // Hook orchestrateur - toute la logique métier
  const intro = useXxxIntro();

  // Render functions pour les slots
  const renderLevelCard = useCallback((level, isSelected) => (
    <XxxLevelCard level={level} isSelected={isSelected} />
  ), []);

  const renderGame = useCallback(() => (
    <XxxGameArea {...intro} />
  ), [intro]);

  const renderProgress = useCallback(() => (
    <ProgressPanel
      currentMoves={intro.progressData.current}
      optimalMoves={intro.progressData.total}
      progress={intro.progressData.current / intro.progressData.total}
      visible={intro.isPlaying}
    />
  ), [intro.progressData, intro.isPlaying]);

  return (
    <GameIntroTemplate
      // Header
      title="Nom du Jeu"
      emoji="🎮"
      onBack={intro.handleBack}
      onParentPress={intro.handleParentPress}
      onHelpPress={intro.handleHelpPress}

      // Niveaux
      levels={intro.levels}
      selectedLevel={intro.selectedLevel}
      onSelectLevel={intro.handleSelectLevel}
      renderLevelCard={renderLevelCard}

      // Jeu
      renderGame={renderGame}
      isPlaying={intro.isPlaying}
      onStartPlaying={intro.handleStartPlaying}

      // Progress
      renderProgress={renderProgress}

      // Mascot
      mascotComponent={
        <XxxMascot
          message={intro.mascotMessage}
          emotion={intro.mascotEmotion}
        />
      }

      // Floating buttons
      onReset={intro.handleReset}
      onHint={intro.handleHint}
      hintsRemaining={intro.hintsRemaining}

      // Victory
      isVictory={intro.isVictory}
    />
  );
}
```

---

## Créer un nouveau jeu

### Étape 1 : Copier la structure

```bash
cp -r src/games/02-suites-logiques src/games/XX-nouveau-jeu
```

### Étape 2 : Implémenter useXxxGame.ts

Le hook de logique de jeu pure :
- Règles du jeu
- État de partie (gameState)
- État de session (sessionState)
- Actions (selectAnswer, confirmAnswer, requestHint, nextRound, etc.)

### Étape 3 : Implémenter useXxxSound.ts

```typescript
export function useXxxSound() {
  const player1 = useAudioPlayer(require('...'));
  const player2 = useAudioPlayer(require('...'));

  return {
    playSelect: () => player1.play(),
    playCorrect: () => player2.play(),
    // ...
  };
}
```

### Étape 4 : Créer useXxxIntro.ts

Suivre le pattern de `useSuitesIntro.ts` :
1. Importer les hooks de jeu
2. Gérer la progression store
3. Gérer les animations de transition
4. Gérer les messages mascotte
5. Gérer la navigation

### Étape 5 : Créer les composants spécifiques

- `XxxMascot.tsx` - Mascotte animée
- `XxxGameArea.tsx` - Zone de jeu
- `XxxLevelCard.tsx` - Carte de niveau (si différent du défaut)

### Étape 6 : Assembler dans XxxIntroScreen.tsx

Utiliser `GameIntroTemplate` avec les slots appropriés.

---

## Composants partagés

### GameIntroTemplate

Props principales :
```typescript
interface GameIntroTemplateProps {
  // Header
  title: string;
  emoji: string;
  onBack: () => void;
  onParentPress?: () => void;
  onHelpPress?: () => void;

  // Niveaux
  levels: LevelConfig[];
  selectedLevel: LevelConfig | null;
  onSelectLevel: (level: LevelConfig) => void;
  renderLevelCard?: (level: LevelConfig, isSelected: boolean) => ReactNode;

  // Jeu
  renderGame: () => ReactNode;
  isPlaying: boolean;
  onStartPlaying?: () => void;

  // Progress
  renderProgress?: () => ReactNode;

  // Mascot
  mascotComponent?: ReactNode;

  // Floating buttons
  onReset?: () => void;
  onHint?: () => void;
  hintsRemaining?: number;

  // Victory
  isVictory?: boolean;
  victoryComponent?: ReactNode;
}
```

### ProgressPanel

```typescript
interface ProgressPanelProps {
  currentMoves: number;
  optimalMoves: number;
  progress: number; // 0-1
  bestMoves?: number;
  visible?: boolean;
}
```

### VictoryCard

```typescript
interface VictoryCardProps {
  title: string;
  message: string;
  stats: {
    timeElapsed: number;
    hintsUsed?: number;
    customStats?: Array<{ label: string; value: string; icon?: string }>;
  };
  badge: VictoryBadge;
  onReplay: () => void;
  onNextLevel?: () => void;
  onHome: () => void;
  onCollection?: () => void;
}
```

---

## Bénéfices de cette architecture

| Aspect | Avant | Après |
|--------|-------|-------|
| Lignes de code par écran | ~700-800 | ~100-150 |
| Duplication | Élevée | Minimale |
| Testabilité | Difficile | Facile (hooks isolés) |
| Maintenance | Complexe | Ciblée |
| Ajout nouveau jeu | Tout réécrire | Copier + adapter |

---

## Exemples d'implémentation

- **Suites Logiques** : `src/games/02-suites-logiques/` — **RÉFÉRENCE COMPLÈTE** ✅
- **Tour de Hanoi** : `src/games/01-hanoi/` — Architecture partielle

---

## 📊 État de conformité des 15 jeux

| # | Jeu | useXxxGame | useXxxSound | useXxxIntro | GameIntroTemplate | Mascotte | Statut |
|---|-----|:---:|:---:|:---:|:---:|:---:|:---:|
| 01 | hanoi | ✅ | ❌ | ❌ | ❌ | ✅ MascotOwl | Partiel |
| 02 | suites-logiques | ✅ | ✅ | ✅ | ✅ | ✅ MascotRobot | **RÉFÉRENCE** |
| 03 | labyrinthe | ✅ | ❌ | ❌ | ✅ | ❌ | Partiel |
| 04 | balance | ✅ | ❌ | ❌ | ✅ | ✅ DrHibou | Partiel |
| 05 | sudoku | ✅ | ❌ | ❌ | ❌ | ✅ ProfessorHoo | Partiel |
| 06 | conteur-curieux | ✅ | ❌ | ❌ | ❌ | ✅ PlumeMascot | Partiel |
| 07 | memory | ✅ | ❌ | ❌ | ✅ | ❌ TBD | Partiel |
| 08 | tangram | ✅ | ❌ | ❌ | ❌ | ❌ TBD | Partiel |
| 09 | logix-grid | ✅ | ❌ | ❌ | ❌ | ❌ TBD | Partiel |
| 10 | mots-croises | ✅ | ❌ | ❌ | ❌ | ❌ TBD | Partiel |
| 11 | math-blocks | ✅ | ❌ | ❌ | ✅ | ❌ TBD | Partiel |
| 12 | matrices-magiques | ✅ | ❌ | ❌ | ❌ | ✅ PixelMascot | Partiel |
| 13 | embouteillage | ❌ | ❌ | ❌ | ❌ | ❌ | **STUB** |
| 14 | fabrique-reactions | ❌ | ❌ | ❌ | ❌ | ❌ | **STUB** |
| 15 | chasseur-papillons | ❌ | ❌ | ❌ | ❌ | ❌ | **STUB** |

### Légende

- **✅** : Implémenté
- **❌** : Non implémenté
- **TBD** : Mascotte planifiée mais pas encore créée
- **STUB** : Jeu en placeholder (uniquement types.ts + index.ts)
- **RÉFÉRENCE** : Architecture complète à suivre
- **Partiel** : Architecture incomplète, à refactoriser

### Résumé

- **1 jeu** avec architecture complète (02-suites-logiques)
- **5 jeux** utilisant GameIntroTemplate (02, 03, 04, 07, 11)
- **6 jeux** avec mascottes implémentées
- **3 jeux** en stub/placeholder (13-15)
- **11 jeux** nécessitent useXxxSound.ts
- **11 jeux** nécessitent useXxxIntro.ts

---

## Points d'attention critiques

### 1. Gestion du BackButton

Le template `GameIntroTemplate` DOIT toujours appeler `onBack()` :

```typescript
// GameIntroTemplate.tsx
const handleBack = useCallback(() => {
  if (isPlaying && !isVictory) {
    transitionToSelectionMode(); // Animation locale
  }
  onBack(); // TOUJOURS appeler
}, [...]);
```

Le hook `useXxxIntro` gère les deux cas :

```typescript
// useXxxIntro.ts
const handleBack = useCallback(() => {
  if (isPlaying) {
    transitionToSelectionMode(); // setIsPlaying(false)
    // NE PAS naviguer !
  } else {
    router.replace('/');
  }
}, [...]);
```

### 2. Centrage sur iPad

Ne JAMAIS utiliser `width: '100%'` avec `maxWidth` :

```typescript
// ❌ MAUVAIS
gameContainer: {
  maxWidth: 600,
  width: '100%', // Annule maxWidth !
}

// ✅ BON
gameContainer: {
  maxWidth: 600,
  alignSelf: 'center',
}
```

### 3. Organisation des styles

```typescript
// Couleurs spécifiques en constante
const COLORS = {
  buttonPrimary: '#5B8DEE',
};

const styles = StyleSheet.create({
  // ============================================
  // SECTION NAME
  // ============================================
  element: { /* ... */ },
});
```

---

## Checklist nouveau jeu

- [ ] Structure de dossiers créée
- [ ] `useXxxGame.ts` implémenté (logique de jeu)
- [ ] `useXxxSound.ts` implémenté (sons)
- [ ] `useXxxIntro.ts` implémenté (orchestration)
- [ ] Composants visuels créés
- [ ] `XxxIntroScreen.tsx` assemblé avec GameIntroTemplate
- [ ] Route ajoutée dans `app/(games)/`
- [ ] Écran de victoire créé
- [ ] Tests manuels effectués
