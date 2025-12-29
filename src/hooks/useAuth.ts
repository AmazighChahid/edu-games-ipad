/**
 * useAuth Hook
 * Gestion de l'authentification avec Supabase
 */

import { useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import { authService } from '@/services/auth';
import type { AuthResult } from '@/types/auth.types';

export function useAuth() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const isAuthLoading = useStore((s) => s.isAuthLoading);
  const userId = useStore((s) => s.userId);
  const userEmail = useStore((s) => s.userEmail);
  const setAuthFromSession = useStore((s) => s.setAuthFromSession);
  const setAuthLoading = useStore((s) => s.setAuthLoading);
  const clearAuth = useStore((s) => s.clearAuth);

  // Initialiser l'état auth au montage
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      setAuthLoading(true);
      const session = await authService.getSession();
      if (mounted) {
        setAuthFromSession(session);
      }
    };

    initAuth();

    // Écouter les changements d'auth
    const { data: subscription } = authService.onAuthStateChange((session) => {
      if (mounted) {
        setAuthFromSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [setAuthFromSession, setAuthLoading]);

  // Actions
  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setAuthLoading(true);
      const result = await authService.signUp(email, password);
      if (result.success && result.session) {
        setAuthFromSession(result.session);
      } else {
        setAuthLoading(false);
      }
      return result;
    },
    [setAuthFromSession, setAuthLoading]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setAuthLoading(true);
      const result = await authService.signIn(email, password);
      if (result.success && result.session) {
        setAuthFromSession(result.session);
      } else {
        setAuthLoading(false);
      }
      return result;
    },
    [setAuthFromSession, setAuthLoading]
  );

  const sendMagicLink = useCallback(
    async (email: string): Promise<AuthResult> => {
      return await authService.sendMagicLink(email);
    },
    []
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    clearAuth();
  }, [clearAuth]);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    return await authService.resetPassword(email);
  }, []);

  return {
    // État
    isAuthenticated,
    isLoading: isAuthLoading,
    userId,
    userEmail,

    // Actions
    signUp,
    signIn,
    sendMagicLink,
    signOut,
    resetPassword,
  };
}

export default useAuth;
