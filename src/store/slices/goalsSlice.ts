/**
 * Goals Slice
 * Manages parent-defined goals for children
 */

import { StateCreator } from 'zustand';
import type { ParentGoal, GoalType, GoalStatus, GoalTemplate } from '@/types';

export interface GoalsState {
  goals: ParentGoal[];
}

export interface GoalsActions {
  // Goal management
  createGoal: (goal: Omit<ParentGoal, 'id' | 'createdAt' | 'current' | 'status'>) => string;
  updateGoal: (id: string, updates: Partial<ParentGoal>) => void;
  deleteGoal: (id: string) => void;

  // Progress tracking
  updateGoalProgress: (id: string, current: number) => void;
  incrementGoalProgress: (id: string, amount?: number) => void;
  completeGoal: (id: string) => void;
  pauseGoal: (id: string) => void;
  resumeGoal: (id: string) => void;

  // Getters
  getGoal: (id: string) => ParentGoal | undefined;
  getActiveGoals: (profileId: string) => ParentGoal[];
  getCompletedGoals: (profileId: string) => ParentGoal[];
  getAllGoals: (profileId: string) => ParentGoal[];

  // Auto-check goals based on game progress
  checkAndUpdateGoals: (profileId: string, gameProgress: Record<string, unknown>) => void;
}

export type GoalsSlice = GoalsState & GoalsActions;

// Generate unique ID
const generateId = () => `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Goal templates for easy creation
export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    type: 'levels_week',
    title: 'Niveaux cette semaine',
    description: 'Compléter X niveaux cette semaine',
    icon: '🎯',
    defaultTarget: 5,
    unit: 'niveaux',
  },
  {
    type: 'streak',
    title: 'Série de jours',
    description: 'Jouer X jours d\'affilée',
    icon: '🔥',
    defaultTarget: 5,
    unit: 'jours',
  },
  {
    type: 'new_game',
    title: 'Découvrir un nouveau jeu',
    description: 'Essayer un jeu jamais joué',
    icon: '🆕',
    defaultTarget: 1,
    unit: 'jeu',
  },
  {
    type: 'time_total',
    title: 'Temps de jeu',
    description: 'Jouer X minutes au total',
    icon: '⏱️',
    defaultTarget: 60,
    unit: 'minutes',
  },
  {
    type: 'game_mastery',
    title: 'Maîtriser un jeu',
    description: 'Compléter X% d\'un jeu spécifique',
    icon: '🏆',
    defaultTarget: 50,
    unit: '%',
  },
  {
    type: 'perfect_level',
    title: 'Niveau parfait',
    description: 'Réussir un niveau avec le nombre optimal de coups',
    icon: '⭐',
    defaultTarget: 1,
    unit: 'niveau',
  },
];

export const initialGoalsState: GoalsState = {
  goals: [],
};

export const createGoalsSlice: StateCreator<GoalsSlice, [], [], GoalsSlice> = (
  set,
  get
) => ({
  ...initialGoalsState,

  createGoal: (goalData) => {
    const id = generateId();
    const newGoal: ParentGoal = {
      ...goalData,
      id,
      current: 0,
      status: 'active',
      createdAt: Date.now(),
    };

    set((state) => ({
      goals: [...state.goals, newGoal],
    }));

    return id;
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    }));
  },

  deleteGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    }));
  },

  updateGoalProgress: (id, current) => {
    set((state) => ({
      goals: state.goals.map((goal) => {
        if (goal.id !== id) return goal;

        const isCompleted = current >= goal.target;
        return {
          ...goal,
          current,
          status: isCompleted ? 'completed' : goal.status,
          completedAt: isCompleted && !goal.completedAt ? Date.now() : goal.completedAt,
        };
      }),
    }));
  },

  incrementGoalProgress: (id, amount = 1) => {
    const goal = get().goals.find((g) => g.id === id);
    if (goal) {
      get().updateGoalProgress(id, goal.current + amount);
    }
  },

  completeGoal: (id) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              status: 'completed' as GoalStatus,
              current: goal.target,
              completedAt: Date.now(),
            }
          : goal
      ),
    }));
  },

  pauseGoal: (id) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, status: 'paused' as GoalStatus } : goal
      ),
    }));
  },

  resumeGoal: (id) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, status: 'active' as GoalStatus } : goal
      ),
    }));
  },

  getGoal: (id) => {
    return get().goals.find((g) => g.id === id);
  },

  getActiveGoals: (profileId) => {
    return get().goals.filter(
      (g) => g.profileId === profileId && g.status === 'active'
    );
  },

  getCompletedGoals: (profileId) => {
    return get().goals.filter(
      (g) => g.profileId === profileId && g.status === 'completed'
    );
  },

  getAllGoals: (profileId) => {
    return get().goals.filter((g) => g.profileId === profileId);
  },

  checkAndUpdateGoals: (profileId, gameProgress) => {
    const activeGoals = get().getActiveGoals(profileId);

    activeGoals.forEach((goal) => {
      let newProgress = goal.current;

      switch (goal.type) {
        case 'levels_week': {
          // Count levels completed this week
          const weekStart = getWeekStart();
          const progress = gameProgress as Record<string, { completedLevels: Record<string, { completedAt: number }> }>;
          let weekLevels = 0;

          Object.values(progress).forEach((game) => {
            if (game.completedLevels) {
              Object.values(game.completedLevels).forEach((level) => {
                if (level.completedAt >= weekStart) {
                  weekLevels++;
                }
              });
            }
          });

          newProgress = weekLevels;
          break;
        }

        case 'new_game': {
          // Count games with at least one level completed
          const progress = gameProgress as Record<string, { completedLevels: Record<string, unknown> }>;
          const gamesPlayed = Object.values(progress).filter(
            (game) => game.completedLevels && Object.keys(game.completedLevels).length > 0
          ).length;
          newProgress = gamesPlayed >= goal.target ? goal.target : 0;
          break;
        }

        case 'time_total': {
          // Sum total play time
          const progress = gameProgress as Record<string, { totalPlayTimeMinutes: number }>;
          const totalTime = Object.values(progress).reduce(
            (sum, game) => sum + (game.totalPlayTimeMinutes || 0),
            0
          );
          newProgress = Math.floor(totalTime);
          break;
        }

        case 'game_mastery': {
          // Calculate completion percentage for specific game
          if (goal.gameId) {
            const progress = gameProgress as Record<string, { completedLevels: Record<string, unknown> }>;
            const game = progress[goal.gameId];
            if (game?.completedLevels) {
              const completedCount = Object.keys(game.completedLevels).length;
              const totalLevels = 10; // Assuming 10 levels per game
              newProgress = Math.floor((completedCount / totalLevels) * 100);
            }
          }
          break;
        }

        // streak and perfect_level are handled elsewhere (on session completion)
      }

      if (newProgress !== goal.current) {
        get().updateGoalProgress(goal.id, newProgress);
      }
    });
  },
});

// Helper function to get the start of the current week (Monday)
function getWeekStart(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}
