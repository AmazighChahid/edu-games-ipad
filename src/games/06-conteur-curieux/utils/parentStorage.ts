/**
 * Parent Storage Utilities
 *
 * Gestion du stockage des données pour l'espace parent
 * - Historique des sessions
 * - Scores de compétences
 * - Enregistrements audio
 * - Paramètres
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  SessionResult,
  ChildRecording,
  ParentSettings,
  CompetencyScores,
  ParentDashboardData,
  QuestionCategory,
  DEFAULT_PARENT_SETTINGS,
} from '../types';

// Storage keys
const STORAGE_KEYS = {
  SESSIONS: '@conteur_curieux_sessions',
  RECORDINGS: '@conteur_curieux_recordings',
  SETTINGS: '@conteur_curieux_parent_settings',
  COMPETENCY_SCORES: '@conteur_curieux_competency_scores',
};

// Maximum sessions to keep in history
const MAX_SESSIONS_HISTORY = 50;

// ============================================================================
// SESSION RESULTS
// ============================================================================

/**
 * Sauvegarder un résultat de session
 */
export async function saveSessionResult(result: SessionResult): Promise<void> {
  try {
    const sessions = await getSessionHistory();

    // Add new session at the beginning
    sessions.unshift(result);

    // Keep only the last MAX_SESSIONS_HISTORY sessions
    const trimmedSessions = sessions.slice(0, MAX_SESSIONS_HISTORY);

    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSIONS,
      JSON.stringify(trimmedSessions)
    );

    // Update competency scores
    await updateCompetencyScores(result);
  } catch (error) {
    console.error('Error saving session result:', error);
    throw error;
  }
}

/**
 * Récupérer l'historique des sessions
 */
export async function getSessionHistory(): Promise<SessionResult[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting session history:', error);
    return [];
  }
}

/**
 * Effacer l'historique des sessions
 */
export async function clearSessionHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS);
  } catch (error) {
    console.error('Error clearing session history:', error);
    throw error;
  }
}

// ============================================================================
// COMPETENCY SCORES
// ============================================================================

/**
 * Récupérer les scores de compétences agrégés
 */
export async function getCompetencyScores(): Promise<CompetencyScores> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPETENCY_SCORES);
    if (data) {
      return JSON.parse(data);
    }

    // Default scores
    return {
      factual: 0,
      sequential: 0,
      causal: 0,
      emotional: 0,
      inferential: 0,
      opinion: 0,
    };
  } catch (error) {
    console.error('Error getting competency scores:', error);
    return {
      factual: 0,
      sequential: 0,
      causal: 0,
      emotional: 0,
      inferential: 0,
      opinion: 0,
    };
  }
}

/**
 * Mettre à jour les scores de compétences avec une nouvelle session
 */
async function updateCompetencyScores(session: SessionResult): Promise<void> {
  try {
    const sessions = await getSessionHistory();

    // Calculate aggregated scores from all sessions
    const categoryTotals: Record<QuestionCategory, { correct: number; total: number }> = {
      factual: { correct: 0, total: 0 },
      sequential: { correct: 0, total: 0 },
      causal: { correct: 0, total: 0 },
      emotional: { correct: 0, total: 0 },
      inferential: { correct: 0, total: 0 },
      opinion: { correct: 0, total: 0 },
    };

    // Aggregate all session data
    for (const s of sessions) {
      if (s.questionsByCategory) {
        for (const [category, data] of Object.entries(s.questionsByCategory)) {
          const cat = category as QuestionCategory;
          if (data) {
            categoryTotals[cat].correct += data.correct;
            categoryTotals[cat].total += data.total;
          }
        }
      }
    }

    // Calculate percentage scores
    const scores: CompetencyScores = {
      factual: categoryTotals.factual.total > 0
        ? Math.round((categoryTotals.factual.correct / categoryTotals.factual.total) * 100)
        : 0,
      sequential: categoryTotals.sequential.total > 0
        ? Math.round((categoryTotals.sequential.correct / categoryTotals.sequential.total) * 100)
        : 0,
      causal: categoryTotals.causal.total > 0
        ? Math.round((categoryTotals.causal.correct / categoryTotals.causal.total) * 100)
        : 0,
      emotional: categoryTotals.emotional.total > 0
        ? Math.round((categoryTotals.emotional.correct / categoryTotals.emotional.total) * 100)
        : 0,
      inferential: categoryTotals.inferential.total > 0
        ? Math.round((categoryTotals.inferential.correct / categoryTotals.inferential.total) * 100)
        : 0,
      opinion: categoryTotals.opinion.total > 0
        ? Math.round((categoryTotals.opinion.correct / categoryTotals.opinion.total) * 100)
        : 0,
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.COMPETENCY_SCORES,
      JSON.stringify(scores)
    );
  } catch (error) {
    console.error('Error updating competency scores:', error);
  }
}

// ============================================================================
// RECORDINGS
// ============================================================================

/**
 * Sauvegarder un enregistrement audio
 */
export async function saveRecording(recording: ChildRecording): Promise<void> {
  try {
    const recordings = await getRecordings();
    recordings.unshift(recording);

    await AsyncStorage.setItem(
      STORAGE_KEYS.RECORDINGS,
      JSON.stringify(recordings)
    );
  } catch (error) {
    console.error('Error saving recording:', error);
    throw error;
  }
}

/**
 * Récupérer tous les enregistrements
 */
export async function getRecordings(): Promise<ChildRecording[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.RECORDINGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recordings:', error);
    return [];
  }
}

/**
 * Supprimer un enregistrement
 */
export async function deleteRecording(recordingId: string): Promise<void> {
  try {
    const recordings = await getRecordings();
    const filtered = recordings.filter((r) => r.id !== recordingId);

    await AsyncStorage.setItem(
      STORAGE_KEYS.RECORDINGS,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Error deleting recording:', error);
    throw error;
  }
}

/**
 * Effacer tous les enregistrements
 */
export async function clearRecordings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.RECORDINGS);
  } catch (error) {
    console.error('Error clearing recordings:', error);
    throw error;
  }
}

// ============================================================================
// PARENT SETTINGS
// ============================================================================

/**
 * Récupérer les paramètres parent
 */
export async function getParentSettings(): Promise<ParentSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }

    // Return default settings
    return {
      preferredDifficulty: 2,
      defaultReadingMode: 'mixed',
      soundEffectsEnabled: true,
      animationsEnabled: true,
      sessionTimeLimit: 0,
    };
  } catch (error) {
    console.error('Error getting parent settings:', error);
    return {
      preferredDifficulty: 2,
      defaultReadingMode: 'mixed',
      soundEffectsEnabled: true,
      animationsEnabled: true,
      sessionTimeLimit: 0,
    };
  }
}

/**
 * Mettre à jour les paramètres parent
 */
export async function updateParentSettings(
  settings: Partial<ParentSettings>
): Promise<ParentSettings> {
  try {
    const currentSettings = await getParentSettings();
    const updatedSettings = { ...currentSettings, ...settings };

    await AsyncStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(updatedSettings)
    );

    return updatedSettings;
  } catch (error) {
    console.error('Error updating parent settings:', error);
    throw error;
  }
}

// ============================================================================
// DASHBOARD DATA
// ============================================================================

/**
 * Récupérer toutes les données du dashboard parent
 */
export async function getParentDashboardData(): Promise<ParentDashboardData> {
  try {
    const [sessions, recordings, settings, competencyScores] = await Promise.all([
      getSessionHistory(),
      getRecordings(),
      getParentSettings(),
      getCompetencyScores(),
    ]);

    // Calculate aggregated metrics
    const totalStoriesCompleted = sessions.length;

    const averageScore = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.scorePercent, 0) / sessions.length)
      : 0;

    const totalReadingTime = sessions.reduce((sum, s) => sum + s.readingTimeSeconds, 0);

    return {
      totalStoriesCompleted,
      averageScore,
      totalReadingTime,
      competencyScores,
      recentSessions: sessions.slice(0, 20),
      recordings,
      settings,
    };
  } catch (error) {
    console.error('Error getting parent dashboard data:', error);
    throw error;
  }
}

/**
 * Effacer toutes les données (reset complet)
 */
export async function clearAllData(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS),
      AsyncStorage.removeItem(STORAGE_KEYS.RECORDINGS),
      AsyncStorage.removeItem(STORAGE_KEYS.COMPETENCY_SCORES),
      // Keep settings
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

/**
 * Générer un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
