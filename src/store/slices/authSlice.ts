/**
 * Auth Slice
 * Gestion de l'état d'authentification dans Zustand
 */

import { StateCreator } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  // État
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userId: string | null;
  userEmail: string | null;
}

export interface AuthActions {
  // Actions
  setAuthUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthFromSession: (session: Session | null) => void;
  clearAuth: () => void;
}

export type AuthSlice = AuthState & AuthActions;

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isAuthLoading: true,
  userId: null,
  userEmail: null,
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  ...initialAuthState,

  setAuthUser: (user) =>
    set({
      isAuthenticated: !!user,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      isAuthLoading: false,
    }),

  setAuthLoading: (loading) =>
    set({
      isAuthLoading: loading,
    }),

  setAuthFromSession: (session) =>
    set({
      isAuthenticated: !!session,
      userId: session?.user?.id ?? null,
      userEmail: session?.user?.email ?? null,
      isAuthLoading: false,
    }),

  clearAuth: () =>
    set({
      isAuthenticated: false,
      userId: null,
      userEmail: null,
      isAuthLoading: false,
    }),
});
