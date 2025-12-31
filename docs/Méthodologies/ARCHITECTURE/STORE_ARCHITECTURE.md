# Store Architecture (Zustand)

> Documentation du store global pour Claude Code

## Vue d'ensemble

Store Zustand persisté avec 9 slices. Persistance via SQLite (mobile) ou AsyncStorage (web).

```
src/store/
├── index.ts          # Re-exports
├── useStore.ts       # Store combiné + selectors
└── slices/
    ├── appSlice.ts         # Settings, lifecycle
    ├── progressSlice.ts    # Progression jeux
    ├── gameSessionSlice.ts # Session active (non persistée)
    ├── assistantSlice.ts   # Mascotte IA
    ├── profileSlice.ts     # Profils enfants
    ├── goalsSlice.ts       # Objectifs parents
    ├── screenTimeSlice.ts  # Temps d'écran
    ├── collectionSlice.ts  # Cartes à collectionner
    └── authSlice.ts        # Authentification
```

## Import

```typescript
import { useStore } from '@/store';
// ou selectors spécialisés
import { useAppSettings, useGameProgress, useActiveProfile } from '@/store';
```

## Slices

### AppSlice (persisté)

| State | Type | Description |
|-------|------|-------------|
| `soundEnabled` | `boolean` | Sons activés |
| `musicEnabled` | `boolean` | Musique activée |
| `hapticEnabled` | `boolean` | Vibrations activées |
| `language` | `'fr' \| 'en'` | Langue |
| `dyslexicFontEnabled` | `boolean` | Police dyslexie |
| `daltonismMode` | `DaltonismMode` | Mode daltonien |
| `hasCompletedOnboarding` | `boolean` | Onboarding terminé |
| `favoriteGameIds` | `string[]` | Jeux favoris |
| `devMode` | `boolean` | Mode développeur |

**Actions** : `setSoundEnabled()`, `setLanguage()`, `toggleFavoriteGame()`, `toggleDevMode()`

### ProgressSlice (persisté)

| State | Type | Description |
|-------|------|-------------|
| `gameProgress` | `Record<string, GameProgress>` | Progression par jeu |
| `recentSessions` | `CompletedSession[]` | 50 dernières sessions |
| `unlockedCards` | `string[]` | Cartes débloquées |

**Actions** : `initGameProgress()`, `recordCompletion()`, `unlockLevel()`, `addPlayTime()`

```typescript
// Exemple
const progress = useStore(state => state.gameProgress['hanoi']);
// { gameId, unlockedLevels[], completedLevels{}, totalPlayTimeMinutes, lastPlayedAt }
```

### GameSessionSlice (NON persisté)

Session de jeu active. Réinitialisée au redémarrage.

| State | Type | Description |
|-------|------|-------------|
| `currentSession` | `GameSession \| null` | Session active |
| `sessionStartTime` | `number \| null` | Timestamp début |

**Actions** :
- `startSession<S>(gameId, levelId, initialState)` - Démarre une session
- `updateGameState<S>(state)` - Met à jour l'état du jeu
- `incrementMoves()` - +1 coup
- `useHint()` - +1 indice utilisé
- `endSession()` - Termine et retourne `CompletedSession`
- `clearSession()` - Abandonne

### ProfileSlice (persisté)

| State | Type | Description |
|-------|------|-------------|
| `profiles` | `ChildProfile[]` | Profils enfants |
| `activeProfileId` | `string \| null` | Profil actif |

**Actions** : `createProfile()`, `updateProfile()`, `deleteProfile()`, `setActiveProfile()`

### GoalsSlice (persisté)

Objectifs définis par les parents.

| State | Type | Description |
|-------|------|-------------|
| `goals` | `ParentGoal[]` | Tous les objectifs |

**Types d'objectifs** : `levels_week`, `streak`, `new_game`, `time_total`, `game_mastery`, `perfect_level`

**Actions** : `createGoal()`, `updateGoalProgress()`, `completeGoal()`, `pauseGoal()`

### ScreenTimeSlice (partiellement persisté)

| State | Type | Description |
|-------|------|-------------|
| `dailyRecords` | `Record<string, DailyScreenTime>` | Par date YYYY-MM-DD |
| `settings` | `ScreenTimeSettings` | Limites et rappels |

**Actions** : `startSession(gameId)`, `endSession()`, `getTotalMinutesToday()`, `isLimitReached()`

## Selectors prédéfinis

```typescript
// Settings
const settings = useAppSettings();

// Progression d'un jeu
const progress = useGameProgress('hanoi');

// Session active
const session = useCurrentSession();

// Profil actif
const profile = useActiveProfile();

// Objectifs actifs d'un profil
const goals = useActiveGoals(profileId);

// Temps d'écran aujourd'hui
const today = useTodayScreenTime();

// Collection
const { collectionData, unlockCard } = useCollection();
```

## Persistance

**Clés persistées** (voir `PERSISTED_KEYS` dans useStore.ts) :
- AppSlice : settings, favoris, devMode
- ProgressSlice : gameProgress, recentSessions, unlockedCards
- ProfileSlice : profiles, activeProfileId
- GoalsSlice : goals
- ScreenTimeSlice : dailyRecords, settings
- CollectionSlice : collectionData, newCardIds, favoriteCardIds
- AuthSlice : isAuthenticated, userId, userEmail

**NON persisté** : GameSessionSlice (éphémère), AssistantSlice (messages temporaires)

## Hydratation

```typescript
const hasHydrated = useHasHydrated();

// Attendre hydratation avant affichage
if (!hasHydrated) return <SplashScreen />;
```

## Créer un nouveau slice

1. Créer `src/store/slices/xxxSlice.ts` :
```typescript
import { StateCreator } from 'zustand';

export interface XxxState { /* ... */ }
export interface XxxActions { /* ... */ }
export type XxxSlice = XxxState & XxxActions;

export const initialXxxState: XxxState = { /* ... */ };

export const createXxxSlice: StateCreator<XxxSlice, [], [], XxxSlice> = (set, get) => ({
  ...initialXxxState,
  // actions
});
```

2. Ajouter dans `useStore.ts` :
   - Import du slice
   - Ajouter au type `RootStore`
   - Ajouter dans `create()` : `...createXxxSlice(...args)`
   - Si persisté : ajouter clés dans `PERSISTED_KEYS`
