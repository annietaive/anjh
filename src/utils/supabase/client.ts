import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const { projectId, publicAnonKey } = await import('./info.tsx');
  
  supabaseInstance = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
    {
      auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
      }
    }
  );

  return supabaseInstance;
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}
