import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/auth/config";

export async function createServerSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("hs-access-token")?.value;
  const refreshToken = cookieStore.get("hs-refresh-token")?.value;

  return createClient(supabaseUrl as string, supabaseAnonKey as string, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

export async function getAuthenticatedUser() {
  const client = await createServerSupabaseClient();
  if (!client) return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("hs-access-token")?.value;
  if (!accessToken) return null;

  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) {
    return null;
  }

  return data.user;
}
