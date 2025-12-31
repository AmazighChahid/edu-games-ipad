# Parent Dashboard Guide

> Documentation de l'espace parent pour Claude Code

## Architecture

```
src/
├── types/parent.types.ts          # Types du dashboard
├── components/parent/             # Composants UI
│   ├── ParentDrawer.tsx          # Drawer principal (fiche éducative)
│   ├── ParentDashboard.tsx       # Dashboard complet
│   ├── ParentZone.tsx            # Zone parent sur écran intro
│   └── ...                       # Composants spécialisés
└── store/slices/
    ├── profileSlice.ts           # Profils enfants
    ├── goalsSlice.ts             # Objectifs
    └── screenTimeSlice.ts        # Temps d'écran
```

## Types principaux

### ChildProfile
```typescript
interface ChildProfile {
  id: string;
  name: string;
  avatar: string;           // emoji
  ageGroup: '3-5' | '6-7' | '8-10';
  birthDate?: number;       // timestamp optionnel
  createdAt: number;
  isActive: boolean;
}
```

### ParentGoal
```typescript
type GoalType =
  | 'levels_week'    // X niveaux cette semaine
  | 'streak'         // X jours d'affilée
  | 'new_game'       // Découvrir un jeu
  | 'time_total'     // X minutes total
  | 'game_mastery'   // X% d'un jeu
  | 'perfect_level'; // Niveau optimal

interface ParentGoal {
  id: string;
  profileId: string;
  title: string;
  type: GoalType;
  target: number;
  current: number;
  gameId?: string;     // Pour objectifs spécifiques
  status: 'active' | 'completed' | 'expired' | 'paused';
  deadline?: number;
  createdAt: number;
  completedAt?: number;
}
```

### ScreenTime
```typescript
interface DailyScreenTime {
  date: string;              // YYYY-MM-DD
  totalMinutes: number;
  sessions: SessionRecord[];
  gamesPlayed: string[];
}

interface ScreenTimeSettings {
  dailyLimitMinutes?: number;  // undefined = pas de limite
  reminderEnabled: boolean;
  reminderAfterMinutes: number;
}
```

## Composants

### ParentDrawer
Drawer slide-up pour la fiche éducative d'un jeu. Contient :
- Objectifs pédagogiques
- Compétences travaillées
- Conseils pour les parents
- Modes de jeu suggérés

**Props** : Voir `ParentDrawerProps` dans `src/components/parent/ParentDrawer.tsx`

### ParentZone
Zone "Espace Parent" sur l'écran intro d'un jeu. Affiche un résumé et ouvre le drawer.

```typescript
import { ParentZone } from '@/components/parent';

<ParentZone
  gameId="hanoi"
  onPress={() => setDrawerVisible(true)}
/>
```

### ParentDashboard
Dashboard complet avec onglets :
- **Overview** : Stats globales, graphique semaine
- **Activities** : Timeline des activités récentes
- **Skills** : Radar des compétences
- **Goals** : Gestion des objectifs

### Composants spécialisés

| Composant | Usage |
|-----------|-------|
| `WeeklyChart` | Graphique temps de jeu hebdomadaire |
| `SkillsRadarV2` | Radar des compétences cognitives |
| `GoalsSection` | Liste et gestion des objectifs |
| `GoalEditor` | Création/édition d'objectif |
| `ScreenTimeCard` | Affichage temps d'écran |
| `ActivityTimeline` | Historique des actions |
| `BadgesGallery` | Galerie de badges/récompenses |
| `ChildSelector` | Sélection profil enfant |
| `BehaviorInsights` | Insights comportementaux |
| `RecommendationsCard` | Recommandations IA |
| `StrengthsCard` | Points forts/faibles |

## Store - Accès aux données

```typescript
import { useStore, useActiveProfile, useActiveGoals } from '@/store';

// Profil actif
const profile = useActiveProfile();

// Tous les profils
const profiles = useStore(state => state.profiles);

// Objectifs actifs
const goals = useActiveGoals(profile?.id);

// Temps d'écran aujourd'hui
const today = useStore(state => state.getTodayScreenTime());

// Limite atteinte ?
const limitReached = useStore(state => state.isLimitReached());
```

## Actions courantes

```typescript
const store = useStore();

// Créer un profil
const id = store.createProfile('Emma', '👧', '6-7');

// Créer un objectif
store.createGoal({
  profileId: profile.id,
  title: '5 niveaux cette semaine',
  type: 'levels_week',
  target: 5,
});

// Mettre à jour progression objectif
store.updateGoalProgress(goalId, newValue);

// Démarrer session temps d'écran
store.startSession('hanoi');

// Terminer session
store.endSession('level_3');

// Modifier limite quotidienne
store.updateSettings({ dailyLimitMinutes: 30 });
```

## Types secondaires

```typescript
// Insights comportementaux
interface BehaviorInsights {
  bestPlayWindow: PlayTimeWindow;
  averageSessionMinutes: number;
  currentStreak: number;
  favoriteGame: string | null;
}

// Activité timeline
type ActivityType =
  | 'level_completed'
  | 'badge_unlocked'
  | 'goal_completed'
  | 'streak_milestone';

// Badge
interface Badge {
  id: string;
  name: string;
  icon: string;
  category: 'milestone' | 'streak' | 'mastery' | 'skill' | 'special';
  isLocked: boolean;
  progress?: number; // 0-100
}
```

## Templates d'objectifs

Utiliser `GOAL_TEMPLATES` depuis `goalsSlice.ts` pour créer des objectifs pré-configurés :

```typescript
import { GOAL_TEMPLATES } from '@/store/slices/goalsSlice';

// Templates disponibles :
// - levels_week (défaut: 5)
// - streak (défaut: 5 jours)
// - new_game (défaut: 1)
// - time_total (défaut: 60 min)
// - game_mastery (défaut: 50%)
// - perfect_level (défaut: 1)
```
