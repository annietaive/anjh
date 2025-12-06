# 🚀 Hướng dẫn Deploy Gemini AI với Supabase Secrets

## 🔐 BẢO MẬT HOÀN HẢO
API key được lưu an toàn trong **Supabase Secrets**, KHÔNG BAO GIỜ lộ ra frontend!

---

## 📋 Bước 1: Cài Supabase CLI

### macOS/Linux:
```bash
brew install supabase/tap/supabase
```

### Windows (PowerShell):
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Hoặc dùng NPM:
```bash
npm install -g supabase
```

---

## 🔑 Bước 2: Login Supabase

```bash
supabase login
```

Trình duyệt sẽ mở, đăng nhập vào tài khoản Supabase của bạn.

---

## 🔗 Bước 3: Link Project

```bash
# Lấy Project Reference ID từ Supabase Dashboard > Settings > General
supabase link --project-ref YOUR_PROJECT_REF
```

**Lấy Project Ref ở đâu?**
1. Vào https://supabase.com/dashboard
2. Chọn project của bạn
3. Settings > General > Reference ID

---

## 🔒 Bước 4: Tạo Secret cho API Key

```bash
supabase secrets set GEMINI_API_KEY=AIzaSyB7xL9PxjrHlqbdZitTwSB_qoSBLa1CE_Q
```

✅ API key giờ đã được lưu an toàn trong Supabase!

**Verify secret:**
```bash
supabase secrets list
```

---

## 🚀 Bước 5: Deploy Edge Function

```bash
supabase functions deploy gemini-chat
```

Đợi ~30 giây để deploy hoàn tất.

---

## ✅ Bước 6: Test Edge Function

```bash
# Lấy Project URL và Anon Key từ Supabase Dashboard
supabase functions invoke gemini-chat \
  --body '{"question":"Hello, what is present simple tense?"}' \
  --method POST
```

Nếu trả về JSON với `content` → **THÀNH CÔNG!** ✅

---

## 🎉 Bước 7: Verify trong App

1. Mở Teacher Emma 👩‍🏫
2. Hỏi: **"Giải thích thì hiện tại đơn chi tiết"**
3. Nếu AI trả lời dài, chi tiết → **HOẠT ĐỘNG!** 🎊

---

## 📊 Kiểm tra Logs

```bash
# Xem logs real-time
supabase functions logs gemini-chat --tail
```

---

## ❓ Troubleshooting

### "Project not linked"
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### "Secret not found" 
```bash
# List all secrets
supabase secrets list

# Set lại secret
supabase secrets set GEMINI_API_KEY=AIzaSyB7xL9PxjrHlqbdZitTwSB_qoSBLa1CE_Q
```

### "Function not deployed"
```bash
# Deploy lại
supabase functions deploy gemini-chat

# Force deploy
supabase functions deploy gemini-chat --no-verify-jwt
```

### "CORS error" trong app
- CORS đã được config sẵn trong Edge Function
- Thử clear cache (Ctrl+Shift+R)

### AI vẫn dùng Built-in AI
- Check Console (F12) xem lỗi gì
- Verify Edge Function đã deploy: Dashboard > Edge Functions
- Test Edge Function bằng curl:
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/gemini-chat \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"question":"test"}'
```

---

## 🔄 Update API Key

Nếu cần đổi API key mới:

```bash
# Set API key mới
supabase secrets set GEMINI_API_KEY=NEW_API_KEY_HERE

# Deploy lại function để apply changes
supabase functions deploy gemini-chat
```

---

## 💰 Chi phí

- ✅ **Supabase Edge Functions**: MIỄN PHÍ (500k invocations/tháng)
- ✅ **Gemini API**: MIỄN PHÍ (15 requests/phút, 1500 requests/ngày)

**Tổng**: HOÀN TOÀN MIỄN PHÍ! 🎉

---

## 🎯 Tóm tắt Commands

```bash
# 1. Login
supabase login

# 2. Link project
supabase link --project-ref YOUR_PROJECT_REF

# 3. Set secret
supabase secrets set GEMINI_API_KEY=AIzaSyB7xL9PxjrHlqbdZitTwSB_qoSBLa1CE_Q

# 4. Deploy function
supabase functions deploy gemini-chat

# 5. Test
supabase functions invoke gemini-chat \
  --body '{"question":"test"}' \
  --method POST
```

---

## 🔐 Bảo mật tối đa

Với cách này:
- ✅ API key **KHÔNG BAO GIỜ** lộ ra frontend
- ✅ API key được mã hóa trong Supabase backend
- ✅ Chỉ Edge Function mới truy cập được API key
- ✅ Frontend chỉ gọi Edge Function qua HTTPS

**100% AN TOÀN!** 🔒

---

**Chúc bạn deploy thành công!** 🚀
