/**
 * Environment Variables Manager
 * Handles environment variables across different deployment environments
 * (Vite dev, production build, Figma Make, etc.)
 */

interface EnvironmentConfig {
  VITE_GEMINI_API_KEY?: string;
  VITE_SERVER_URL?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

class EnvironmentManager {
  private config: EnvironmentConfig = {};

  constructor() {
    this.loadEnvironmentVariables();
  }

  private loadEnvironmentVariables() {
    // Method 1: Try import.meta.env (Vite standard)
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        this.config = {
          VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
          VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
          VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
        };
        console.log('✅ Environment loaded from import.meta.env');
        return;
      }
    } catch (e) {
      console.log('⚠️ import.meta.env not available');
    }

    // Method 2: Try window object (for runtime injection)
    if (typeof window !== 'undefined') {
      const win = window as any;
      this.config = {
        VITE_GEMINI_API_KEY: win.VITE_GEMINI_API_KEY || win.__ENV?.VITE_GEMINI_API_KEY,
        VITE_SERVER_URL: win.VITE_SERVER_URL || win.__ENV?.VITE_SERVER_URL,
        VITE_SUPABASE_URL: win.VITE_SUPABASE_URL || win.__ENV?.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: win.VITE_SUPABASE_ANON_KEY || win.__ENV?.VITE_SUPABASE_ANON_KEY,
      };
      
      if (this.config.VITE_GEMINI_API_KEY) {
        console.log('✅ Environment loaded from window object');
        return;
      }
    }

    // Method 3: Hardcoded fallback for production use
    this.config = {
      VITE_GEMINI_API_KEY: 'AIzaSyBInyBTBFSmhyVXgixuUAMnuLyNGukkYck',
      VITE_SERVER_URL: '',
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
    };
    console.log('✅ Using default Gemini API key');
  }

  get(key: keyof EnvironmentConfig): string | undefined {
    const value = this.config[key];
    console.log(`🔍 getEnv('${key}') = ${value ? '✅ Found' : '❌ Not found'}`);
    return value;
  }

  getAll(): EnvironmentConfig {
    return { ...this.config };
  }

  has(key: keyof EnvironmentConfig): boolean {
    return !!this.config[key];
  }

  set(key: keyof EnvironmentConfig, value: string) {
    this.config[key] = value;
    
    // Also set in window for persistence
    if (typeof window !== 'undefined') {
      (window as any)[key] = value;
    }
  }
}

// Singleton instance
export const env = new EnvironmentManager();

// Helper functions
export const getEnv = (key: keyof EnvironmentConfig): string | undefined => env.get(key);
export const hasEnv = (key: keyof EnvironmentConfig): boolean => env.has(key);
export const setEnv = (key: keyof EnvironmentConfig, value: string) => env.set(key, value);
export const getAllEnv = (): EnvironmentConfig => env.getAll();