# Analytics Fallback System - EngMastery

## 📋 Tổng quan

EngMastery có hệ thống **dual storage** cho analytics:
1. **Primary**: Supabase Database (khi đã setup)
2. **Fallback**: localStorage (luôn hoạt động)

## 🎯 Cơ chế hoạt động

### Flow lưu kết quả bài tập:

```
User hoàn thành bài tập
  ↓
Try to save to Supabase Database
  ↓
Database save successful?
  ├─ YES → ✅ Saved to database
  │         └─ Update analytics table
  │
  └─ NO (Table not found: PGRST205)
            ↓
        ✅ Save to localStorage (fallback)
            └─ Still fully functional
```

## 🔧 Implementation Details

### 1. Save Exercise Results (Exercises.tsx)

```typescript
// Try to save to database
const savedResult = await saveExerciseResult({...});
const savedProgress = await updateLearningProgress(...);

// FALLBACK: Save to localStorage if database save failed
if (!savedResult || !savedProgress) {
  console.log('Database save failed. Saving to localStorage as fallback.');
  
  // Save to localStorage
  const localResults = JSON.parse(localStorage.getItem('exercise_results') || '[]');
  localResults.push({...});
  localStorage.setItem('exercise_results', JSON.stringify(localResults));
  
  // Save progress
  const localProgress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
  localProgress[`${userId}_${lessonId}`] = {...};
  localStorage.setItem('learning_progress', JSON.stringify(localProgress));
}
```

### 2. Load Statistics (analytics.ts)

```typescript
export async function getUserStatistics(userId: string) {
  const analytics = await getLearningAnalytics(userId);
  
  // If no database analytics, try localStorage
  if (!analytics) {
    const { getLocalStatistics } = await import('./localStorageAnalytics');
    return getLocalStatistics(userId);
  }
  
  // Return database analytics
  return {...};
}
```

### 3. Load Progress (Progress.tsx)

```typescript
// Try localStorage first if no accessToken
if (user && !accessToken) {
  const localStats = getLocalStatistics(user.id);
  if (localStats) {
    setUserProgress({...});
  }
  return;
}

// Try database with fallback
try {
  const data = await fetchUserProgress(accessToken);
  setUserProgress(data.overall);
} catch (error) {
  // Fallback to localStorage if API fails
  if (user) {
    const localStats = getLocalStatistics(user.id);
    if (localStats) {
      setUserProgress({...});
    }
  }
}
```

## 📊 localStorage Schema

### exercise_results (Array)
```json
[
  {
    "userId": "user-123",
    "lessonId": 1,
    "exerciseType": "mixed",
    "score": 85,
    "totalQuestions": 18,
    "correctAnswers": 15,
    "answers": [...],
    "completedAt": "2025-12-06T10:30:00.000Z"
  }
]
```

### learning_progress (Object)
```json
{
  "user-123_1": {
    "userId": "user-123",
    "lessonId": 1,
    "grade": 6,
    "progressPercentage": 100,
    "completedAt": "2025-12-06T10:30:00.000Z",
    "lastAccessedAt": "2025-12-06T10:30:00.000Z"
  }
}
```

## 🎯 Features Supported

### ✅ With localStorage (No database):
- ✅ Save exercise results
- ✅ Track learning progress
- ✅ View statistics (Progress page)
- ✅ View analytics (Analytics Dashboard)
- ✅ Calculate streak
- ✅ Identify weak skills
- ✅ Get recommendations
- ⚠️ **NO sync across devices**
- ⚠️ **Data lost if localStorage cleared**

### ✅ With Database (Full features):
- ✅ All features above
- ✅ **Sync across devices**
- ✅ **Persistent storage**
- ✅ **Cloud backup**
- ✅ **Stored procedures for analytics**
- ✅ **Teacher dashboard access**

## 🔧 Error Handling

### Graceful Degradation

```typescript
// analytics.ts
if (error.code === 'PGRST205') {
  // Table not found - silently fallback
  console.log('Table not created yet. Skipping save.');
  return null;  // Don't throw error
}
```

### User Experience

```
❌ Before:
   Error: Could not find table 'exercise_results'
   → Toast error pops up
   → User confused

✅ After:
   Console: "Database save failed. Saving to localStorage as fallback."
   → App continues working
   → User sees success message
   → No disruption
```

## 📚 Files Modified

### Core Analytics
- `/utils/analytics.ts` - Database functions with graceful errors
- `/utils/localStorageAnalytics.ts` - localStorage fallback functions

### Components
- `/components/Exercises.tsx` - Dual save (DB + localStorage)
- `/components/Progress.tsx` - Load from localStorage fallback
- `/components/LearningAnalyticsDashboard.tsx` - Auto-fallback

### Documentation
- `/docs/DATABASE_SCHEMA.sql` - Full SQL schema
- `/docs/SUPABASE_SETUP.md` - Setup guide
- `/docs/ANALYTICS_FALLBACK.md` - This file

## 🚀 Migration Path

### Current State → With Database

User đã có data trong localStorage:
```
1. User continues using app (localStorage)
2. Admin creates database tables (run DATABASE_SCHEMA.sql)
3. Next exercise → Saves to BOTH database and localStorage
4. Future: Import localStorage data to database (manual tool)
```

### Benefits:
- ✅ Zero downtime
- ✅ No data loss
- ✅ Smooth transition
- ✅ User not affected

## ⚡ Performance

### localStorage:
- ✅ Instant read/write
- ✅ No network latency
- ✅ Works offline
- ⚠️ Limited to ~5-10MB
- ⚠️ Slower with large datasets

### Database:
- ✅ Unlimited storage
- ✅ Fast queries with indexes
- ✅ Server-side analytics
- ⚠️ Requires internet
- ⚠️ Network latency

## 🔐 Data Privacy

### localStorage:
- ✅ Stored locally on user's device
- ✅ Not transmitted to server
- ⚠️ No encryption (use device security)
- ⚠️ Accessible via browser DevTools

### Database:
- ✅ Encrypted in transit (HTTPS)
- ✅ Row Level Security (RLS)
- ✅ Server-side encryption
- ✅ Audit logs
- ✅ Backup and recovery

## 🎯 Best Practices

### For Students:
1. ✅ Use app normally - system handles fallback automatically
2. ✅ Setup database when you want sync across devices
3. ✅ Don't clear browser data to preserve localStorage

### For Teachers/Admins:
1. ✅ Setup database for all features
2. ✅ Run `/docs/DATABASE_SCHEMA.sql` in Supabase
3. ✅ Enable RLS for security
4. ✅ Monitor database usage

### For Developers:
1. ✅ Always save to localStorage as fallback
2. ✅ Check for PGRST205 errors (table not found)
3. ✅ Don't throw errors on fallback
4. ✅ Log to console for debugging

## 🐛 Troubleshooting

### "Không thấy tiến độ học tập"

**Check:**
1. Browser localStorage enabled?
2. Incognito mode? (localStorage cleared on close)
3. User ID consistent?

**Solution:**
```javascript
// Check in browser console
localStorage.getItem('exercise_results')
localStorage.getItem('learning_progress')
```

### "Analytics không cập nhật"

**Check:**
1. Database tables created?
2. RLS policies correct?
3. localStorage fallback working?

**Solution:**
```javascript
// Force reload from localStorage
const { getLocalStatistics } = await import('/utils/localStorageAnalytics');
getLocalStatistics(userId);
```

## 📖 Related Documentation

- `/docs/DATABASE_SCHEMA.sql` - Database schema
- `/docs/SUPABASE_SETUP.md` - Setup guide
- `/utils/analytics.ts` - Database functions
- `/utils/localStorageAnalytics.ts` - Fallback functions
