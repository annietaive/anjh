# 🤖 Teacher Emma - Gemini AI

## ✅ Trạng thái: Chưa deploy

Teacher Emma đang dùng **Built-in AI** (trả lời cơ bản). Để có Gemini AI thông minh, cần deploy Edge Function.

---

## 🚀 Quick Start (5 phút)

```bash
# 1. Cài Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link project (lấy Project Ref từ Supabase Dashboard)
supabase link --project-ref YOUR_PROJECT_REF

# 4. Set API key (đã có sẵn)
supabase secrets set GEMINI_API_KEY=AIzaSyB7xL9PxjrHlqbdZitTwSB_qoSBLa1CE_Q

# 5. Deploy
supabase functions deploy gemini-chat
```

---

## 🎯 Sau khi deploy

Teacher Emma sẽ:
- ✅ Trả lời thông minh như ChatGPT
- ✅ Giải thích chi tiết với ví dụ cụ thể
- ✅ Nhớ context cuộc trò chuyện
- ✅ Chấm bài viết tự động

---

## 📖 Hướng dẫn chi tiết

Xem file `/DEPLOY_GEMINI_AI.md` để biết thêm chi tiết.

---

## 🔐 Bảo mật

- ✅ API key được lưu trong **Supabase Secrets**
- ✅ KHÔNG BAO GIỜ lộ ra frontend
- ✅ Hoàn toàn an toàn

---

**Chúc bạn deploy thành công!** 🚀
