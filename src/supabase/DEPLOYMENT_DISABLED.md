# ⚠️ Edge Functions Deployment DISABLED

## Important Notice

**Edge functions deployment is DISABLED for this project.**

The EngMastery application uses **client-side Supabase only** and does NOT require any edge functions.

## If You See Deployment Errors

If you see this error during deployment:

```
Error: XHR for "/api/integrations/supabase/.../edge_functions/make-server/deploy" failed with status 403
```

**This error can be safely IGNORED.** The application will work perfectly without edge functions.

## Why 403 Error Occurs

- Figma Make automatically tries to deploy `/supabase/functions/server/` folder
- The folder is a protected system file and cannot be deleted
- Deployment requires admin permissions which are not available
- **The app doesn't need this function anyway**

## Architecture

```
┌──────────────────────┐
│   App.tsx            │
│   (React Client)     │
└──────────┬───────────┘
           │
           ▼
   Client-side Supabase
   /utils/supabase/client.ts
           │
           ▼
   Supabase Cloud API
   - auth.signUp()
   - from('table').select()
   - No edge functions needed
```

## What Works

✅ Authentication (sign up/login)
✅ Database operations (save/load progress)
✅ All 48 lessons
✅ AI Teacher
✅ Assignment system
✅ Progress tracking

**Everything works WITHOUT edge functions!**

## Files Created to Prevent Deployment

- `.deployignore` - Tell deployment system to skip
- `.supabaseignore` - Supabase-specific ignore
- `supabase/.figmaignore` - Figma Make ignore
- `supabase/.ignore` - General ignore
- `supabase/deploy.config.json` - Deployment config
- `supabase/functions/deno.jsonc` - Deno config override
- `supabase/functions/_skip_deploy` - Skip marker
- `supabase/functions/server/.no-deploy` - No deploy marker

**Despite all these files, Figma Make still tries to deploy. The 403 error is harmless.**
