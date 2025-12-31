# Testing Strategy

> Guide des tests pour Claude Code

## Configuration

**Stack** : Jest 29 + ts-jest + jest-expo

```
jest.config.js      # Configuration principale
jest.setup.js       # Mocks globaux (Reanimated, Haptics, Audio, etc.)
__tests__/          # Dossier des tests
```

## Commandes

```bash
npm test              # Exécuter tous les tests
npm run test:watch    # Mode watch
npm run test:coverage # Avec couverture
```

## Structure des tests

```
__tests__/
├── unit/
│   ├── hooks/        # Tests hooks custom
│   ├── utils/        # Tests fonctions utilitaires
│   └── logic/        # Tests logique de jeu
├── components/       # Tests composants (si besoin)
└── integration/      # Tests d'intégration
```

## Écrire un test

### Test unitaire (fonction pure)

```typescript
// __tests__/unit/utils/scoring.test.ts
import { calculateScore } from '@/utils/scoring';

describe('calculateScore', () => {
  it('should return max score for optimal moves', () => {
    const score = calculateScore({
      moves: 7,
      optimalMoves: 7,
      timeSeconds: 30,
      hintsUsed: 0,
    });
    expect(score).toBe(3); // 3 étoiles
  });

  it('should reduce score for extra moves', () => {
    const score = calculateScore({
      moves: 15,
      optimalMoves: 7,
      timeSeconds: 30,
      hintsUsed: 0,
    });
    expect(score).toBeLessThan(3);
  });
});
```

### Test logique de jeu

```typescript
// __tests__/unit/logic/hanoi.test.ts
import { isValidMove, checkVictory } from '@/games/01-hanoi/logic/gameLogic';

describe('Hanoi Game Logic', () => {
  describe('isValidMove', () => {
    it('should allow moving smaller disk onto larger', () => {
      const towers = [[3, 2], [1], []];
      expect(isValidMove(towers, 1, 2)).toBe(true);
    });

    it('should reject moving larger disk onto smaller', () => {
      const towers = [[3], [1], [2]];
      expect(isValidMove(towers, 0, 1)).toBe(false);
    });
  });

  describe('checkVictory', () => {
    it('should detect victory when all disks on tower 3', () => {
      const towers = [[], [], [3, 2, 1]];
      expect(checkVictory(towers, 3)).toBe(true);
    });
  });
});
```

### Test hook custom

```typescript
// __tests__/unit/hooks/useGameTimer.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useGameTimer } from '@/hooks/useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start at 0', () => {
    const { result } = renderHook(() => useGameTimer());
    expect(result.current.seconds).toBe(0);
  });

  it('should increment after 1 second', () => {
    const { result } = renderHook(() => useGameTimer());

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(1);
  });
});
```

### Test store Zustand

```typescript
// __tests__/unit/store/progressSlice.test.ts
import { useStore } from '@/store';

describe('ProgressSlice', () => {
  beforeEach(() => {
    // Reset store entre les tests
    useStore.setState({
      gameProgress: {},
      recentSessions: [],
    });
  });

  it('should initialize game progress', () => {
    useStore.getState().initGameProgress('hanoi');

    const progress = useStore.getState().gameProgress['hanoi'];
    expect(progress).toBeDefined();
    expect(progress.unlockedLevels).toHaveLength(10);
  });

  it('should record completion', () => {
    useStore.getState().initGameProgress('hanoi');
    useStore.getState().recordCompletion({
      gameId: 'hanoi',
      levelId: 'level_1',
      completedAt: Date.now(),
      moveCount: 7,
      timeSeconds: 30,
      hintsUsed: 0,
    });

    const progress = useStore.getState().gameProgress['hanoi'];
    expect(progress.completedLevels['level_1']).toBeDefined();
  });
});
```

## Mocks disponibles (jest.setup.js)

Les mocks suivants sont déjà configurés :

| Module | Mock |
|--------|------|
| `react-native-reanimated` | Mock complet |
| `expo-haptics` | `impactAsync`, `notificationAsync`, etc. |
| `expo-audio` | `Sound.createAsync` |
| `@react-native-async-storage/async-storage` | Mock in-memory |
| `expo-font` | `useFonts` retourne `[true, null]` |

## Ajouter un mock

Dans `jest.setup.js` :

```javascript
jest.mock('expo-new-module', () => ({
  newFunction: jest.fn(),
}));
```

## Couverture de code

Seuils configurés (jest.config.js) :
- Branches : 70%
- Functions : 70%
- Lines : 70%
- Statements : 70%

Fichiers exclus :
- `*.d.ts`
- `index.ts` (re-exports)
- `*.types.ts`

## Bonnes pratiques

1. **Tester la logique, pas l'UI** : Focus sur les fonctions pures et hooks
2. **Un fichier de test par fichier source** : `gameLogic.ts` → `gameLogic.test.ts`
3. **Nommer clairement** : `describe` pour le sujet, `it` pour le comportement attendu
4. **Isoler les tests** : Reset du store/mocks entre chaque test
5. **Éviter les tests flaky** : Utiliser `jest.useFakeTimers()` pour le temps

## Quand écrire des tests

| Scénario | Test requis |
|----------|-------------|
| Nouvelle logique de jeu | Oui (logicEngine, validation) |
| Nouveau hook métier | Oui |
| Nouvelle action store | Oui |
| Fonction utilitaire | Oui |
| Composant UI simple | Non (sauf logique complexe) |
| Refactoring | Garder les tests existants |

## Exécution CI

```bash
# Vérification avant commit
npm test -- --passWithNoTests
```
