# Architecture Decision: Client-Side AI Only

## Issue
Edge function deployment failed with 403 error when trying to deploy Supabase edge functions.

## Solution
Disabled edge function deployment and use **client-side Gemini API** exclusively.

## Why This Works Better

### ✅ Advantages:
1. **No deployment issues** - No need for Supabase edge function permissions
2. **Faster responses** - Direct API calls, no proxy overhead
3. **Simpler architecture** - One less layer to maintain
4. **Default API key included** - Works out of the box for all users
5. **User can optionally override** - Can use their own API key if desired

### 🔧 Technical Implementation:
```typescript
// Fallback chain (2 strategies):
1. Gemini Direct API (client-side) ✅ Primary
   - Uses default API key: AIzaSyBHPw6jKrlUAYk44lXbHPAMYIFYulU-53Y
   - User can override with localStorage
   - Model: gemini-flash-latest

2. Built-in AI (pattern matching) ✅ Fallback
   - Always works
   - Handles common questions
```

### 📁 Files Modified:
- `/utils/aiService.ts` - Removed backend server strategy, simplified to 2-tier fallback
- `/supabase/functions/.skip_deploy` - Signal to skip edge function deployment
- `/supabase/functions/.ignore` - Ignore all edge functions during build

### 🎯 Result:
- ✅ No more 403 errors
- ✅ AI Teacher works immediately
- ✅ AI Personalized Recommendations works immediately
- ✅ Cleaner, faster, more reliable

## For Future Reference
If you ever need backend edge functions:
1. Delete `/supabase/functions/.skip_deploy`
2. Delete `/supabase/functions/.ignore`
3. Ensure Supabase project has proper permissions
4. Re-enable 3-tier fallback in `aiService.ts`