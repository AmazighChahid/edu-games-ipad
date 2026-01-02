/**
 * Supabase Client Service
 *
 * Client Supabase configuré pour l'application éducative.
 * Utilisé pour :
 * - Authentification (future)
 * - Base de données (progression, profils)
 * - Storage (assets, avatars)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] Missing environment variables. Check your .env file:\n' +
      '- EXPO_PUBLIC_SUPABASE_URL\n' +
      '- EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// ============================================================================
// CLIENT INSTANCE
// ============================================================================

/**
 * Client Supabase avec stockage persistant via AsyncStorage
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Important pour React Native
    },
  }
);

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Vérifie si Supabase est correctement configuré
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};

/**
 * Récupère l'URL du projet Supabase
 */
export const getSupabaseUrl = (): string | undefined => {
  return SUPABASE_URL;
};

/**
 * Vérifie la connexion à Supabase
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.warn('[Supabase] Not configured');
    return false;
  }

  try {
    // Test simple : récupérer la session (ne nécessite pas d'auth)
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.error('[Supabase] Connection check failed:', error.message);
      return false;
    }
    if (__DEV__) console.log('[Supabase] Connection OK');
    return true;
  } catch (error) {
    console.error('[Supabase] Connection error:', error);
    return false;
  }
};

export default supabase;
