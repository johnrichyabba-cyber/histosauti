import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function cleanEnv(value?: string | null) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const isSupabaseConfigured =
  isValidHttpUrl(supabaseUrl) && supabaseAnonKey.length > 0;

let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "[supabase] Not configured correctly. Falling back to demo/local mode.",
    {
      hasUrl: Boolean(supabaseUrl),
      urlLooksValid: isValidHttpUrl(supabaseUrl),
      hasAnonKey: Boolean(supabaseAnonKey),
    },
  );
}

export const supabase = supabaseInstance;
export { supabaseUrl, supabaseAnonKey };