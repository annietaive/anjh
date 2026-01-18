# Username Sync System

## Overview
Hệ thống đồng bộ username giữa localStorage và database (user_profiles table) để đảm bảo tính nhất quán.

## Architecture

### Storage Layers
1. **localStorage** - Client-side cache
2. **user_profiles table** - Primary database storage (Supabase)
3. **kv_store_bf8225f3** - Legacy storage (optional, backward compatibility)

### Sync Priority
```
localStorage → user_profiles → kv_store
```

## Auto-Sync Triggers

### 1. On Login (AuthPage.tsx)
```typescript
// Sau khi login thành công
const { ensureUsernameConsistency } = await import('../utils/syncUsername');
await ensureUsernameConsistency(data.user.id);
```

### 2. On App Load (App.tsx)
```typescript
// Khi detect existing session
const { ensureUsernameConsistency } = await import('./utils/syncUsername');
ensureUsernameConsistency(data.user.id).catch(err => {
  console.warn('Silent username sync failed:', err);
});
```

## Manual Sync

### Debug Panel
User có thể mở Debug Panel (icon Bug ở góc phải dưới) để:
- Kiểm tra trạng thái sync
- Click "Fix Now" để manual sync

### API Functions

#### `syncUsernameToDatabase(userId, username)`
Sync username vào database.
```typescript
const success = await syncUsernameToDatabase(userId, username);
```

#### `getAuthoritativeUsername(userId)`
Lấy username từ nguồn đáng tin cậy nhất.
```typescript
const username = await getAuthoritativeUsername(userId);
```

#### `ensureUsernameConsistency(userId)`
Đảm bảo username đồng bộ trên tất cả storage layers.
```typescript
await ensureUsernameConsistency(userId);
```

## Error Handling

### Non-blocking
- Sync errors không block UI
- Chỉ log warning nếu fail
- kv_store sync là optional (không critical)

### Fallback Strategy
```
user_profiles (primary) → kv_store (legacy) → localStorage (cache)
```

## Debug & Monitoring

### Console Logs
```
🔍 Checking username consistency...
📝 Found authoritative username: An2011
🔄 Syncing username to database...
✅ Updated username in user_profiles
⚠️ kv_store sync skipped (table may not exist)
✅ Username sync complete
```

### Debug Panel Status
- ✅ **Đồng bộ**: localStorage == user_profiles == currentUser
- ⚠️ **Chưa đồng bộ**: Có sự khác biệt giữa các storage

## Best Practices

1. **Always use auto-sync** - Không cần manual intervention
2. **Check console logs** - Monitor sync status
3. **Use Debug Panel** - Only when troubleshooting
4. **Don't rely on kv_store** - It's legacy/optional

## Troubleshooting

### Username null trong database
**Solution**: Click "Fix Now" trong Debug Panel hoặc reload page

### Sync failed
**Check**:
1. Network connection
2. Supabase RLS policies
3. Console logs for errors
4. localStorage có username không

### Performance
- Auto-sync là **silent & non-blocking**
- Không ảnh hưởng loading time
- Chạy background sau authentication
