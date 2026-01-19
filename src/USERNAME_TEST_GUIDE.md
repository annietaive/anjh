# 🧪 HƯỚNG DẪN TEST USERNAME PERSISTENCE

## 📋 Checklist để test

### ✅ Test 1: Đăng ký mới
**Bước:**
1. Vào trang đăng nhập/đăng ký
2. Chọn tab "Đăng ký"
3. Điền thông tin:
   - Họ tên: "Nguyễn Văn Test"
   - Email: "test2@example.com"
   - Mật khẩu: "test1234"
   - Khối lớp: 6
   - Vai trò: Học sinh
4. Nhấn "Đăng ký"

**Kết quả mong đợi:**
- ✅ Toast hiển thị: "Đăng ký thành công! Chào mừng bạn đến với EngMastery! 🎉"
- ✅ Description: "Username của bạn: nguyenvantest"
- ✅ Tự động login

**Console logs để xem:**
```
🔄 Updating user profile: { ..., username: "nguyenvantest" }
```

---

### ✅ Test 2: Xem username trong Account Management
**Bước:**
1. Login (nếu chưa login)
2. Click vào avatar/menu → "Tài khoản"
3. Kiểm tra phần "Username"

**Kết quả mong đợi:**
- ✅ Username hiển thị: "nguyenvantest"
- ✅ Không hiển thị "Chưa đặt username"

---

### ✅ Test 3: Sửa username
**Bước:**
1. Vào Account Management
2. Click "Chỉnh sửa"
3. Thay đổi username thành "testuser123"
4. Click "Lưu"

**Kết quả mong đợi:**
- ✅ Toast: "Cập nhật thông tin thành công ✓"
- ✅ Username hiển thị thành "testuser123"

**Console logs để xem:**
```
🔄 Updating user profile: { ..., username: "testuser123" }
📝 Updating user_profiles table: { ..., username: "testuser123" }
✅ user_profiles updated successfully
📝 Updating kv_store: { ..., username: "testuser123" }
✅ kv_store updated successfully
```

---

### ✅ Test 4: Logout và Login lại
**Bước:**
1. Đang ở trang chủ với username "testuser123"
2. Click "Đăng xuất"
3. Đăng nhập lại với email + password
4. Vào Account Management

**Kết quả mong đợi:**
- ✅ Toast khi login: "Đăng nhập thành công! 🎓" + "Chào mừng trở lại, @testuser123!"
- ✅ Account Management hiển thị username: "testuser123"
- ✅ **USERNAME KHÔNG BỊ MẤT!**

**Console logs để xem:**
```
Attempting login with email: test2@example.com
📝 Merging user data from user_profiles table
✅ Username loaded: testuser123
```

---

### ✅ Test 5: Reload page
**Bước:**
1. Đang login với username "testuser123"
2. Nhấn F5 (refresh page)
3. Vào Account Management

**Kết quả mong đợi:**
- ✅ Không cần login lại
- ✅ Username vẫn hiển thị: "testuser123"
- ✅ Tự động restore session

**Console logs để xem:**
```
Checking existing session...
Re-fetching user profile from database...
✅ Username restored: testuser123
```

---

### ✅ Test 6: Đóng browser và mở lại
**Bước:**
1. Login với username "testuser123"
2. Đóng browser hoàn toàn (tất cả tabs)
3. Mở browser lại
4. Vào EngMastery (URL cũ)
5. Vào Account Management

**Kết quả mong đợi:**
- ✅ Tự động login (không cần nhập lại)
- ✅ Username hiển thị: "testuser123"
- ✅ Session được restore từ localStorage + database

---

## 🔍 Debugging - Nếu có lỗi

### Lỗi: Username không hiển thị sau login

**Kiểm tra:**
1. Mở Developer Tools (F12)
2. Vào Console tab
3. Tìm logs:
   ```
   📝 Updating user_profiles table: ...
   ✅ user_profiles updated successfully
   ```
4. Nếu có `❌ Error updating user_profiles:`, copy error message

**Giải pháp:**
- Check xem Supabase có connected không
- Check RLS policies trong Supabase dashboard
- Verify user_profiles table có username column không

---

### Lỗi: "Username đã được sử dụng"

**Kiểm tra:**
1. Thử username khác
2. Hoặc check trong Supabase:
   ```sql
   SELECT username FROM user_profiles WHERE username = 'testuser123';
   ```

**Giải pháp:**
- Dùng username khác, unique hơn
- Hoặc xóa user cũ trong database:
   ```sql
   DELETE FROM user_profiles WHERE username = 'testuser123';
   ```

---

### Lỗi: "Cập nhật local thành công, nhưng không thể lưu vào database"

**Nguyên nhân:**
- Supabase chưa connected
- RLS policies chặn update
- Network issue

**Giải pháp:**
1. Check Supabase connection status
2. Check RLS policies:
   ```sql
   -- Users should be able to update own profile
   CREATE POLICY "Users can update own profile" ON public.user_profiles
     FOR UPDATE USING (auth.uid() = user_id);
   ```
3. Retry sau vài giây

---

## 📊 Expected Database State

### Sau khi signup:
**user_profiles table:**
```sql
user_id         | name              | username       | email              | grade | role
----------------|-------------------|----------------|-------------------|-------|--------
abc-123-def     | Nguyễn Văn Test   | nguyenvantest  | test2@example.com | 6     | student
```

**kv_store_bf8225f3 table:**
```sql
key                          | value
-----------------------------|--------------------------------------------------
user:abc-123-def:profile     | {"name":"Nguyễn Văn Test","username":"nguyenvantest",...}
user:abc-123-def:progress    | {"totalLessons":0,"completedLessons":0,...}
```

### Sau khi update username:
**user_profiles table:**
```sql
user_id         | name              | username       | email              | grade | role
----------------|-------------------|----------------|-------------------|-------|--------
abc-123-def     | Nguyễn Văn Test   | testuser123    | test2@example.com | 6     | student
```

**kv_store_bf8225f3 table:**
```sql
key                          | value
-----------------------------|--------------------------------------------------
user:abc-123-def:profile     | {"name":"Nguyễn Văn Test","username":"testuser123",...}
```

✅ **Both tables should have the same username!**

---

## 🎯 Success Criteria

### Tất cả tests pass khi:
- [x] Signup tạo username tự động
- [x] Username hiển thị trong Account Management
- [x] Có thể sửa username
- [x] Logout → Login lại → Username vẫn còn
- [x] Reload page → Username vẫn hiển thị
- [x] Đóng browser → Mở lại → Username vẫn còn
- [x] Console không có error liên quan đến username
- [x] Toast notifications hoạt động đúng
- [x] Database có đầy đủ data (user_profiles + kv_store)

---

## 🚀 Quick Test Script (for developers)

```javascript
// Run in browser console
async function testUsernameFlow() {
  console.log('🧪 Testing username persistence...');
  
  // 1. Check localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('1️⃣ User in localStorage:', user);
  console.log('   Username:', user?.username || '❌ NOT FOUND');
  
  // 2. Check Supabase
  const { getSupabaseClient } = await import('./utils/supabase/client');
  const supabase = await getSupabaseClient();
  
  const { data: userData } = await supabase.auth.getUser();
  console.log('2️⃣ Current user ID:', userData?.user?.id);
  
  // 3. Check user_profiles
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('username, role')
    .eq('user_id', userData?.user?.id)
    .single();
  console.log('3️⃣ Username in user_profiles:', profile?.username || '❌ NOT FOUND');
  
  // 4. Check kv_store
  const { data: kvData } = await supabase
    .from('kv_store_bf8225f3')
    .select('value')
    .eq('key', `user:${userData?.user?.id}:profile`)
    .single();
  console.log('4️⃣ Username in kv_store:', kvData?.value?.username || '❌ NOT FOUND');
  
  // Result
  if (user?.username && profile?.username && kvData?.value?.username) {
    console.log('✅ ALL TESTS PASSED! Username is persisted correctly.');
  } else {
    console.log('❌ TESTS FAILED! Username is not synced across storage.');
  }
}

testUsernameFlow();
```

---

## 💡 Tips

1. **Always check console logs** - Tất cả updates có emoji logs rõ ràng
2. **Use unique email** - Mỗi lần test dùng email mới để tránh conflicts
3. **Clear localStorage if stuck** - `localStorage.clear()` và login lại
4. **Check Supabase dashboard** - Verify data trực tiếp trong database
5. **Use demo mode for quick testing** - Không cần đăng ký thật

---

## 📞 Support

Nếu bạn gặp vấn đề:
1. Check console logs (F12 → Console)
2. Copy error messages
3. Check `/USERNAME_PERSISTENCE_FIX.md` để hiểu flow
4. Báo cáo với đầy đủ:
   - Error message
   - Console logs
   - Steps to reproduce

**Happy testing! 🎉**
