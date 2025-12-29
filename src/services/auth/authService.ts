/**
 * Auth Service
 * Wrapper Supabase Auth avec logique spécifique à l'app
 */

import { supabase } from '../supabase/supabaseClient';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import type { AuthResult } from '@/types/auth.types';

/**
 * Map les erreurs Supabase vers des messages français
 */
function mapAuthError(error: AuthError): string {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect';
  }
  if (message.includes('user already registered')) {
    return 'Un compte existe déjà avec cet email';
  }
  if (message.includes('password should be at least')) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  if (message.includes('invalid email')) {
    return 'Adresse email invalide';
  }
  if (message.includes('email not confirmed')) {
    return 'Vérifie ta boîte mail pour confirmer ton compte';
  }
  if (message.includes('rate limit')) {
    return 'Trop de tentatives. Réessaie dans quelques minutes.';
  }

  return 'Une erreur est survenue. Réessaie plus tard.';
}

export const authService = {
  /**
   * Inscription avec email et mot de passe
   */
  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: mapAuthError(error) };
      }

      // Supabase peut retourner un user sans session si email confirmation est requise
      const needsEmailConfirmation = Boolean(data.user && !data.session);

      return {
        success: true,
        user: data.user ?? undefined,
        session: data.session ?? undefined,
        needsEmailConfirmation,
      };
    } catch (err) {
      console.error('[AuthService] signUp error:', err);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },

  /**
   * Connexion avec email et mot de passe
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: mapAuthError(error) };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (err) {
      console.error('[AuthService] signIn error:', err);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },

  /**
   * Envoi d'un magic link par email
   */
  async sendMagicLink(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Deep link pour React Native
          emailRedirectTo: 'edu-games://auth/callback',
        },
      });

      if (error) {
        return { success: false, error: mapAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      console.error('[AuthService] sendMagicLink error:', err);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },

  /**
   * Vérifier un OTP (code reçu par email)
   */
  async verifyOtp(email: string, token: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        return { success: false, error: mapAuthError(error) };
      }

      return {
        success: true,
        user: data.user ?? undefined,
        session: data.session ?? undefined,
      };
    } catch (err) {
      console.error('[AuthService] verifyOtp error:', err);
      return { success: false, error: 'Erreur de vérification' };
    }
  },

  /**
   * Déconnexion
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AuthService] signOut error:', err);
    }
  },

  /**
   * Récupérer la session courante
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('[AuthService] getSession error:', error);
        return null;
      }
      return data.session;
    } catch (err) {
      console.error('[AuthService] getSession error:', err);
      return null;
    }
  },

  /**
   * Récupérer l'utilisateur courant
   */
  async getUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return null;
      }
      return data.user;
    } catch (err) {
      return null;
    }
  },

  /**
   * Écouter les changements d'état d'authentification
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'edu-games://auth/reset-password',
      });

      if (error) {
        return { success: false, error: mapAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      console.error('[AuthService] resetPassword error:', err);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  },

  /**
   * Mettre à jour le mot de passe
   */
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: mapAuthError(error) };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      console.error('[AuthService] updatePassword error:', err);
      return { success: false, error: 'Erreur de mise à jour' };
    }
  },
};

export default authService;
