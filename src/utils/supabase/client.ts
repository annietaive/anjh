import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let connectionError: Error | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If we had a previous connection error, throw it immediately
  if (connectionError) {
    throw connectionError;
  }

  try {
    const { projectId, publicAnonKey } = await import('./info.tsx');
    
    // Validate credentials
    if (!projectId || !publicAnonKey) {
      connectionError = new Error('Supabase credentials not configured');
      throw connectionError;
    }
    
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          persistSession: true,
          storageKey: 'sb-auth-token',
          autoRefreshToken: true,
        },
        global: {
          headers: {
            'x-application-name': 'engmastery',
          },
        },
      }
    );

    return supabaseInstance;
  } catch (error: any) {
    connectionError = error;
    throw error;
  }
}

export function resetSupabaseClient() {
  supabaseInstance = null;
  connectionError = null;
}

// Check if Supabase is available
export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const client = await getSupabaseClient();
    // Try a simple health check
    const { error } = await client.from('kv_store_bf8225f3').select('key').limit(1);
    return !error || error.code !== 'PGRST301'; // PGRST301 = network error
  } catch (error) {
    console.warn('[Supabase] Connection unavailable:', error);
    return false;
  }
}