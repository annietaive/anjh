# 🎮 Hướng Dẫn Hybrid Data Mode

## Tổng quan

EngMastery hỗ trợ **Hybrid Data Mode** - cho phép kết hợp linh hoạt giữa dữ liệu Demo (localStorage) và dữ liệu Thật (Supabase database).

## 🎯 3 Chế Độ Hoạt Động

### 1. ✨ Chế độ TỰ ĐỘNG (Auto Mode)
**Mặc định - Khuyến nghị cho hầu hết người dùng**

```typescript
Mode: 'auto'
Logic: Tự động chọn data source dựa trên điều kiện
```

**Cách hoạt động:**
- ✅ **Nếu có dữ liệu thật** trong database → Dùng Real Mode
- ✅ **Nếu chưa có dữ liệu thật** → Dùng Demo Mode  
- ✅ **Chuyển đổi tự động** khi import demo → real

**Ưu điểm:**
- Không cần quan tâm cấu hình
- Tự động chọn nguồn tốt nhất
- Mượt mà cho người mới

---

### 2. 🎮 Chế độ DEMO (Demo Mode)
**Test & Development - An toàn 100%**

```typescript
Mode: 'demo'
Storage: localStorage (trình duyệt)
```

**Đặc điểm:**
- 📦 Lưu trên trình duyệt (localStorage)
- 🔒 Không cần đăng nhập
- ⚡ Nhanh, không cần internet
- 🚫 **Không đồng bộ** giữa các thiết bị
- ⚠️ **Mất data** khi xóa cache trình duyệt

**Use Cases:**
- Test tính năng mới
- Thử nghiệm không lo mất data
- Offline learning
- Demo cho người khác

---

### 3. ☁️ Chế độ THẬT (Real Mode)
**Production - Đồng bộ mọi nơi**

```typescript
Mode: 'real'
Storage: Supabase PostgreSQL
```

**Đặc điểm:**
- ☁️ Lưu trên server (cloud database)
- 🔄 **Đồng bộ** mọi thiết bị
- 💾 **Bảo toàn** dữ liệu vĩnh viễn
- 📊 Hỗ trợ analytics phức tạp
- 🔐 Cần authentication

**Use Cases:**
- Học tập chính thức
- Cần đồng bộ nhiều thiết bị
- Tracking tiến độ dài hạn
- Giáo viên theo dõi học sinh

---

## 📁 Cấu Trúc Dữ Liệu

### Demo Mode (localStorage)
```javascript
localStorage.setItem('progress', JSON.stringify({
  1: {
    lessonId: 1,
    completed: true,
    vocabularyScore: 95,
    listeningScore: 88,
    // ...
  },
  // ...
}));

localStorage.setItem('exerciseResults', JSON.stringify([
  {
    lessonId: 1,
    exerciseType: 'vocabulary',
    score: 95,
    // ...
  },
  // ...
]));
```

### Real Mode (Supabase)
```sql
-- learning_progress table
user_id | lesson_id | completed | vocabulary_score | ...
--------|-----------|-----------|------------------|----
uuid    | 1         | true      | 95               | ...

-- exercise_results table  
user_id | lesson_id | exercise_type | score | ...
--------|-----------|---------------|-------|----
uuid    | 1         | vocabulary    | 95    | ...
```

---

## 🔄 Import Demo → Real

### Tự Động Import
Khi user đăng nhập lần đầu và có data demo:

```typescript
import { importDemoToReal } from '../utils/dataMode';

// Tự động convert localStorage → database
const result = await importDemoToReal(userId);

if (result.success) {
  // ✅ Chuyển sang Real Mode
  setDataModePreference('real');
}
```

### Flow Import
```
1. Kiểm tra localStorage có data demo không
   ↓
2. Convert format: localStorage → Database schema
   ↓  
3. Insert vào Supabase (upsert để tránh duplicate)
   ↓
4. Verify import thành công
   ↓
5. Auto switch sang Real Mode
   ↓
6. (Optional) Clear demo data
```

### Data Mapping
```typescript
// Demo format
const demoProgress = {
  lessonId: 1,
  vocabularyScore: 95,
  // camelCase
}

// ↓ Convert ↓

// Database format  
const dbProgress = {
  lesson_id: 1,
  vocabulary_score: 95,
  // snake_case
}
```

---

## 🎨 UI Components

### 1. DataModeToggle Component
**Location:** `/components/DataModeToggle.tsx`

```tsx
<DataModeToggle 
  userId={user.id}
  onModeChange={() => {
    // Reload để apply mode mới
    window.location.reload();
  }}
/>
```

**Features:**
- 🎯 3 options: Auto / Demo / Real
- 📊 Hiển thị status hiện tại
- 🔄 Button import demo → real
- 🗑️ Clear demo data
- ✅ Visual feedback

### 2. useHybridData Hook
**Location:** `/hooks/useHybridData.ts`

```tsx
import { useHybridData } from '../hooks/useHybridData';

function MyComponent() {
  const {
    dataSource,      // 'demo' | 'real' | null
    isLoading,       // boolean
    getProgress,     // async (lessonId) => Progress
    saveProgress,    // async (lessonId, data) => void
    // ...
  } = useHybridData(userId);
  
  // Tự động dùng đúng data source
  const progress = await getProgress(1);
}
```

**API Methods:**
```typescript
// Progress
getProgress(lessonId: number): Promise<Progress>
saveProgress(lessonId: number, data: Partial<Progress>): Promise<void>
getAllProgress(): Promise<Record<number, Progress>>

// Exercise Results
saveExerciseResult(result: ExerciseResult): Promise<void>
getExerciseResults(lessonId?: number): Promise<ExerciseResult[]>

// Daily Activity
getDailyActivity(): Promise<DailyActivity>
updateDailyActivity(): Promise<void>
```

---

## 🔧 Cài Đặt & Sử Dụng

### 1. Trong Account Management
```tsx
// /components/AccountManagement.tsx
import { DataModeToggle } from './DataModeToggle';

<DataModeToggle 
  userId={user.id}
  onModeChange={() => window.location.reload()}
/>
```

### 2. Trong Components Khác
```tsx
import { useHybridData } from '../hooks/useHybridData';
import { resolveDataSource } from '../utils/dataMode';

// Option 1: Hook (Recommended)
const { dataSource, getProgress } = useHybridData(userId);

// Option 2: Manual
const source = await resolveDataSource(userId);
if (source === 'demo') {
  // Load from localStorage
} else {
  // Load from Supabase
}
```

### 3. Manual Mode Control
```typescript
import { 
  getDataModePreference, 
  setDataModePreference 
} from '../utils/dataMode';

// Get current mode
const currentMode = getDataModePreference(); // 'auto' | 'demo' | 'real'

// Set new mode  
setDataModePreference('real');

// Reload để apply
window.location.reload();
```

---

## 📊 Status Checking

### Check nếu user có data thật
```typescript
import { hasRealData } from '../utils/dataMode';

const hasData = await hasRealData(userId);
// true = có data trong DB
// false = chưa có, đang dùng demo
```

### Get full status
```typescript
import { getDataModeStatus } from '../utils/dataMode';

const status = await getDataModeStatus(userId);
// {
//   mode: 'auto',        // preference
//   source: 'demo',      // actual source đang dùng
//   hasRealData: false,  // có data trong DB không
//   canSwitchToReal: false  // có thể switch sang Real không
// }
```

---

## ⚙️ Configuration

### localStorage Keys
```typescript
'engmastery_data_mode'           // 'auto' | 'demo' | 'real'
'engmastery_demo_mode_enabled'   // 'true' | 'false'
'progress'                       // Demo progress data
'exerciseResults'                // Demo exercise results
'dailyActivity'                  // Demo daily activity
'analyticsCache'                 // Demo analytics cache
```

### Clear Demo Data
```typescript
import { clearDemoData } from '../utils/dataMode';

// Xóa tất cả data demo từ localStorage
clearDemoData();
// Removes: progress, exerciseResults, dailyActivity, analyticsCache
```

---

## 🎯 Best Practices

### 1. Ưu tiên Auto Mode
```tsx
// ✅ Good - Để user tự chọn
<DataModeToggle userId={user.id} />

// ❌ Bad - Force mode
setDataModePreference('real'); // Không nên force
```

### 2. Luôn check dataSource
```tsx
// ✅ Good
const { dataSource, getProgress } = useHybridData(userId);
if (dataSource === 'demo') {
  // Show warning: "Dùng demo, chưa đồng bộ"
}

// ❌ Bad
const progress = localStorage.getItem('progress'); // Hardcode demo
```

### 3. Graceful Fallback
```tsx
// ✅ Good
const { dataSource, getProgress } = useHybridData(userId);
const progress = await getProgress(lessonId) || defaultProgress;

// ❌ Bad
const progress = await getProgress(lessonId);
// Crash nếu null
```

### 4. Import Prompt
```tsx
// ✅ Good - Suggest import
{!hasRealData && source === 'demo' && (
  <Button onClick={importDemo}>
    📤 Import demo vào database?
  </Button>
)}

// ❌ Bad - Auto import không hỏi
importDemoToReal(userId); // Scary!
```

---

## 🐛 Troubleshooting

### Lỗi: "Could not find table"
```
Nguyên nhân: Database chưa có tables
Fix: Chạy SQL script từ /docs/database-schema.sql
```

### Lỗi: Import failed
```
Nguyên nhân: RLS policy chặn insert
Fix: Dùng service_role key thay vì anon key
```

### Data không sync
```
Nguyên nhân: Đang ở Demo mode
Fix: 
1. Check mode hiện tại
2. Import demo → real
3. Switch sang Real mode
```

### Mất data sau khi reload
```
Nguyên nhân: Dùng Demo mode + xóa cache
Fix: Luôn dùng Real mode cho data quan trọng
```

---

## 📈 Performance

### Demo Mode
- ⚡ **Instant** - Không cần network
- 📦 **5-10MB** localStorage limit
- 🔒 Chỉ 1 thiết bị

### Real Mode  
- 🌐 **100-500ms** latency (tùy network)
- 💾 **Unlimited** storage
- 🔄 Mọi thiết bị

### Optimization
```tsx
// ✅ Cache trong memory
const [progressCache, setProgressCache] = useState<Record<number, Progress>>({});

// ✅ Batch operations
const allProgress = await getAllProgress(); // 1 query
// Instead of
for (const id of lessonIds) {
  await getProgress(id); // N queries ❌
}
```

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Offline sync queue (save locally, sync khi online)
- [ ] Conflict resolution (merge demo + real)
- [ ] Export data to JSON
- [ ] Scheduled auto-import
- [ ] Data migration tools

### Experimental
- [ ] Hybrid mode: Mix demo + real (fallback chain)
- [ ] P2P sync (không qua server)
- [ ] Differential sync (chỉ sync changes)

---

## 📚 Related Files

### Core Files
- `/utils/dataMode.ts` - Logic chính
- `/hooks/useHybridData.ts` - React hook
- `/components/DataModeToggle.tsx` - UI component
- `/lib/supabase.ts` - Supabase client

### Database
- `/docs/database-schema.sql` - Schema definition
- `/utils/supabase/client.ts` - Client setup

### Documentation
- `/docs/DATA_MODE_GUIDE.md` - File này
- `/BACKEND_SETUP.md` - Supabase setup
- `/QUICK_START_SUPABASE.md` - Quick start

---

## ❓ FAQ

**Q: Nên dùng mode nào?**
A: Auto mode cho hầu hết trường hợp. Demo cho test. Real cho production.

**Q: Import có xóa data demo không?**
A: Không. Data demo vẫn giữ nguyên. Bạn có thể xóa thủ công nếu muốn.

**Q: Có thể dùng cả 2 mode cùng lúc?**
A: Không. Chỉ 1 mode active tại 1 thời điểm. Nhưng data từ cả 2 nguồn vẫn tồn tại độc lập.

**Q: Chuyển mode có mất data không?**
A: Không. Data ở mỗi nguồn độc lập. Chuyển mode chỉ thay đổi nguồn đọc/ghi.

**Q: Import có ghi đè data thật không?**
A: Không. Dùng upsert - chỉ thêm mới hoặc update nếu chưa tồn tại.

---

## 🎉 Kết Luận

Hybrid Data Mode giúp EngMastery:
- ✅ Linh hoạt: Demo khi test, Real khi production
- ✅ An toàn: Không lo mất data
- ✅ Đơn giản: Auto mode tự động xử lý
- ✅ Mạnh mẽ: Hỗ trợ mọi use case

**Happy Learning! 🚀**
