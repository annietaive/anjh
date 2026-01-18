import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from info file
const getSupabaseCredentials = async () => {
  try {
    const info = await import('../utils/supabase/info.tsx');
    return {
      url: info.projectId ? `https://${info.projectId}.supabase.co` : '',
      key: info.publicAnonKey || '',
    };
  } catch (error) {
    console.warn('[Supabase] No credentials configured');
    return { url: '', key: '' };
  }
};

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseInstance = async () => {
  if (supabaseInstance) return supabaseInstance;
  
  const { url, key } = await getSupabaseCredentials();
  
  if (!url || !key) {
    throw new Error('Supabase not configured');
  }
  
  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      storageKey: 'sb-auth-token',
      autoRefreshToken: true,
    },
  });
  
  return supabaseInstance;
};

// Export a proxy that lazily initializes
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    return async (...args: any[]) => {
      const instance = await getSupabaseInstance();
      const value = (instance as any)[prop];
      
      if (typeof value === 'function') {
        return value.apply(instance, args);
      }
      
      return value;
    };
  },
});
