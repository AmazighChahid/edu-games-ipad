/**
 * Auth Types
 * Types liés à l'authentification Supabase
 */

import type { Session, User } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  session?: Session;
  needsEmailConfirmation?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userEmail: string | null;
  session: Session | null;
}

export type AuthMethod = 'password' | 'magic_link';
