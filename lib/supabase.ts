import { createClient } from "@supabase/supabase-js";
import {
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/auth/config";

/**
 * Local-first mode:
 * - Ikiwa env vars za Supabase zipo, client itawashwa
 * - Ikiwa hazipo, app itatumia local mode bila kuvunjika
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey,
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export { supabaseAnonKey, supabaseUrl };