/**
 * Supabase Services Export
 */

export {
  default as supabase,
  isSupabaseConfigured,
  getSupabaseUrl,
  checkSupabaseConnection,
} from './supabaseClient';

export { profileService } from './profileService';
