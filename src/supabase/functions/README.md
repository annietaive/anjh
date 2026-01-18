# Edge Functions - NOT IN USE

⚠️ **IMPORTANT: These edge functions are NOT deployed or used by the application.**

## Why?

This application uses **client-side Supabase** for all operations:
- Authentication: `supabase.auth.signUp()`, `supabase.auth.signIn()`
- Database: Direct access to `kv_store_bf8225f3` table
- No server-side endpoints needed

## Architecture

```
App.tsx
  ↓
utils/supabase/client.ts (Client-side Supabase)
  ↓
Supabase Cloud
  ↓
PostgreSQL Database
```

## Files in this folder

- `server/index.tsx` - Legacy edge function (not deployed)
- `server/kv_store.tsx` - Legacy KV store (not used)
- `deno.json` - Config to exclude from deployment
- `.funcignore` - Ignore file for deployment

## Deployment

Edge functions are **disabled** via:
1. `/supabase/config.toml` - `[functions] enabled = false`
2. `/supabase/functions/.funcignore` - Ignores all files
3. `/supabase/functions/deno.json` - Excludes server folder

This prevents 403 errors during deployment.
