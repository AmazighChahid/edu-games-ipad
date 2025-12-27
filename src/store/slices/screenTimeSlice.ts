/**
 * Screen Time Slice
 * Tracks daily screen time and session records
 */

import { StateCreator } from 'zustand';
import type { DailyScreenTime, SessionRecord, ScreenTimeSettings } from '../../types';

export interface ScreenTimeState {
  dailyRecords: Record<string, DailyScreenTime>; // Key: YYYY-MM-DD
  currentSessionStart: number | null;
  currentGameId: string | null;
  settings: ScreenTimeSettings;
}

export interface ScreenTimeActions {
  // Session tracking
  startSession: (gameId: string) => void;
  endSession: (levelId?: string) => void;

  // Settings
  updateSettings: (settings: Partial<ScreenTimeSettings>) => void;

  // Getters
  getTodayScreenTime: () => DailyScreenTime | null;
  getWeekScreenTime: () => DailyScreenTime[];
  getTotalMinutesToday: () => number;
  isLimitReached: () => boolean;

  // Data access
  getDailyRecord: (date: string) => DailyScreenTime | undefined;
  getAverageSessionLength: () => number;
  getMostActiveHour: () => number;
}

export type ScreenTimeSlice = ScreenTimeState & ScreenTimeActions;

// Format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get today's date string
const getToday = (): string => formatDate(new Date());

// Create empty daily record
const createEmptyDailyRecord = (date: string): DailyScreenTime => ({
  date,
  totalMinutes: 0,
  sessions: [],
  gamesPlayed: [],
});

export const initialScreenTimeState: ScreenTimeState = {
  dailyRecords: {},
  currentSessionStart: null,
  currentGameId: null,
  settings: {
    dailyLimitMinutes: undefined, // No limit by default
    reminderEnabled: true,
    reminderAfterMinutes: 30,
  },
};

export const createScreenTimeSlice: StateCreator<ScreenTimeSlice, [], [], ScreenTimeSlice> = (
  set,
  get
) => ({
  ...initialScreenTimeState,

  startSession: (gameId) => {
    // End any existing session first
    const state = get();
    if (state.currentSessionStart) {
      get().endSession();
    }

    set({
      currentSessionStart: Date.now(),
      currentGameId: gameId,
    });
  },

  endSession: (levelId) => {
    const state = get();
    if (!state.currentSessionStart || !state.currentGameId) {
      return;
    }

    const endTime = Date.now();
    const durationMinutes = (endTime - state.currentSessionStart) / 60000;
    const today = getToday();

    const sessionRecord: SessionRecord = {
      startedAt: state.currentSessionStart,
      endedAt: endTime,
      gameId: state.currentGameId,
      levelId,
    };

    set((prevState) => {
      const todayRecord = prevState.dailyRecords[today] || createEmptyDailyRecord(today);

      // Add game to list if not already present
      const gamesPlayed = todayRecord.gamesPlayed.includes(state.currentGameId!)
        ? todayRecord.gamesPlayed
        : [...todayRecord.gamesPlayed, state.currentGameId!];

      return {
        dailyRecords: {
          ...prevState.dailyRecords,
          [today]: {
            ...todayRecord,
            totalMinutes: todayRecord.totalMinutes + durationMinutes,
            sessions: [...todayRecord.sessions, sessionRecord],
            gamesPlayed,
          },
        },
        currentSessionStart: null,
        currentGameId: null,
      };
    });
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  getTodayScreenTime: () => {
    const today = getToday();
    return get().dailyRecords[today] || null;
  },

  getWeekScreenTime: () => {
    const records: DailyScreenTime[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      const record = get().dailyRecords[dateStr];
      records.push(record || createEmptyDailyRecord(dateStr));
    }

    return records;
  },

  getTotalMinutesToday: () => {
    const today = get().getTodayScreenTime();
    if (!today) return 0;

    // Include current session if ongoing
    const state = get();
    let total = today.totalMinutes;

    if (state.currentSessionStart) {
      const currentDuration = (Date.now() - state.currentSessionStart) / 60000;
      total += currentDuration;
    }

    return Math.round(total);
  },

  isLimitReached: () => {
    const state = get();
    const { dailyLimitMinutes } = state.settings;

    if (!dailyLimitMinutes) return false;

    return get().getTotalMinutesToday() >= dailyLimitMinutes;
  },

  getDailyRecord: (date) => {
    return get().dailyRecords[date];
  },

  getAverageSessionLength: () => {
    const records = Object.values(get().dailyRecords);
    let totalSessions = 0;
    let totalMinutes = 0;

    records.forEach((record) => {
      record.sessions.forEach((session) => {
        const duration = (session.endedAt - session.startedAt) / 60000;
        totalMinutes += duration;
        totalSessions++;
      });
    });

    if (totalSessions === 0) return 0;
    return Math.round(totalMinutes / totalSessions);
  },

  getMostActiveHour: () => {
    const hourCounts: number[] = new Array(24).fill(0);

    Object.values(get().dailyRecords).forEach((record) => {
      record.sessions.forEach((session) => {
        const hour = new Date(session.startedAt).getHours();
        hourCounts[hour]++;
      });
    });

    let maxHour = 9; // Default to 9 AM
    let maxCount = 0;

    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = hour;
      }
    });

    return maxHour;
  },
});
