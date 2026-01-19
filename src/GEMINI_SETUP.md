# 🤖 Hướng dẫn tích hợp Gemini AI cho Teacher Emma

## 📋 Tổng quan

Teacher Emma sử dụng **Google Gemini AI** để trả lời câu hỏi thông minh. Hệ thống có 3 chế độ hoạt động:

1. **✅ Gemini Direct (Khuyến nghị)** - Gọi trực tiếp Gemini API từ browser
2. **🔧 Backend Server** - Gọi qua backend server (bảo mật hơn)
3. **🔄 Built-in AI (Fallback)** - AI cơ bản khi Gemini không khả dụng

---

## 🚀 Cách 1: Setup Gemini Direct (Client-side) - NHANH NHẤT

### Bước 1: Lấy Gemini API Key (MIỄN PHÍ)

1. Truy cập: **https://makersuite.google.com/app/apikey**
2. Đăng nhập bằng Google Account
3. Click **"Create API Key"**
4. Copy API key (dạng: `AIzaSy...`)

⏱️ **Thời gian**: < 1 phút

### Bước 2: Thêm API Key vào project

#### Option A: Tạo file `.env`

```bash
# Trong thư mục root của project
cp .env.example .env
```

Mở file `.env` và thêm API key:

```env
VITE_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Option B: Hoặc export trực tiếp (tạm thời)

```bash
export VITE_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Bước 3: Khởi động lại app

```bash
npm run dev
```

### ✅ Kiểm tra hoạt động

1. Mở app và click vào **Teacher Emma** (icon 💬 góc dưới phải)
2. Hỏi: "Xin chào Teacher Emma"
3. Check Console (F12):
   - ✅ Thấy: `🔄 Trying Gemini model: gemini-2.0-flash-exp...`
   - ✅ Thấy: `✅ Gemini AI success with model: ...`
4. Teacher Emma sẽ trả lời thông minh bằng Gemini AI! 🎉

---

## 🔒 Cách 2: Setup Backend Server (Bảo mật hơn)

### Khi nào dùng?

- Khi deploy production và muốn giấu API key
- Khi cần kiểm soát rate limiting
- Khi muốn log requests

### Bước 1: Deploy backend server

Backend server đã có sẵn trong `/supabase/functions/server/index.tsx`

Deploy lên Supabase Edge Functions hoặc platform khác (Vercel, Railway...)

### Bước 2: Thêm GEMINI_API_KEY vào server environment

**Supabase:**
```bash
supabase secrets set GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Vercel/Railway:**
Thêm environment variable trong dashboard

### Bước 3: Cấu hình frontend

Thêm vào `.env`:
```env
VITE_SERVER_URL=https://your-server-url.com
```

### ✅ Hệ thống sẽ tự động:
1. Thử Gemini Direct trước
2. Nếu fail → gọi Backend Server
3. Nếu fail → dùng Built-in AI

---

## 🎯 Cách 3: Chỉ dùng Built-in AI (Không cần API key)

Nếu không muốn setup Gemini, hệ thống sẽ tự động dùng Built-in AI pattern matching.

**Ưu điểm:**
- ✅ Không cần API key
- ✅ Hoạt động offline
- ✅ Miễn phí 100%

**Nhược điểm:**
- ❌ Chỉ trả lời được câu hỏi cơ bản (theo pattern)
- ❌ Không thông minh bằng Gemini

---

## 📊 So sánh các phương pháp

| Phương pháp | Tốc độ | Bảo mật | Chi phí | Độ thông minh |
|-------------|--------|---------|---------|---------------|
| Gemini Direct | ⚡⚡⚡ Nhanh nhất | ⚠️ API key lộ | 💰 FREE (1500 req/day) | 🧠🧠🧠🧠🧠 |
| Backend Server | ⚡⚡ Khá nhanh | 🔒 An toàn | 💰 FREE + hosting | 🧠🧠🧠🧠🧠 |
| Built-in AI | ⚡⚡⚡ Instant | 🔒 100% safe | 💰 FREE | 🧠🧠 Cơ bản |

---

## 🛠️ Troubleshooting

### ❌ Lỗi: "Gemini API key not configured"

**Giải pháp:**
1. Kiểm tra file `.env` có tồn tại không
2. Kiểm tra tên biến: `VITE_GEMINI_API_KEY` (có `VITE_` prefix)
3. Restart dev server: `npm run dev`

### ❌ Lỗi: "403 Forbidden" hoặc "Invalid API key"

**Giải pháp:**
1. Kiểm tra API key có đúng không
2. Enable Gemini API trong Google Cloud Console:
   - Truy cập: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click "Enable"

### ❌ Lỗi: "429 Rate Limit Exceeded"

**Giải pháp:**
1. Gemini FREE plan có giới hạn: 1500 requests/day
2. Đợi 1 phút rồi thử lại
3. Hoặc nâng cấp lên paid plan (không bắt buộc)

### ⚠️ Teacher Emma chỉ trả lời pattern matching

**Nguyên nhân:** Gemini API không hoạt động, đang dùng Built-in AI fallback

**Kiểm tra:**
1. Mở Console (F12)
2. Xem có log: `⚠️ Gemini Direct API failed...` không
3. Kiểm tra lại API key và internet connection

---

## 💡 Tips & Best Practices

### 1. Bảo mật API Key

❌ **ĐỪNG:**
```javascript
// Đừng hardcode API key trong code
const apiKey = "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
```

✅ **NÊN:**
```javascript
// Dùng environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

### 2. Giới hạn Rate Limiting

Gemini FREE plan: **1500 requests/day**

Nếu vượt quá:
- Nâng cấp lên paid plan ($0.35/1M tokens)
- Hoặc implement caching để giảm số requests

### 3. Production Deployment

Khi deploy production, nên:
1. ✅ Dùng Backend Server mode để giấu API key
2. ✅ Enable CORS properly
3. ✅ Setup monitoring & logging
4. ✅ Implement rate limiting

---

## 📝 Gemini Models Available

Hệ thống sẽ tự động thử các models theo thứ tự:

1. `gemini-2.0-flash-exp` - **Mới nhất, nhanh nhất** (Khuyến nghị)
2. `gemini-1.5-flash-latest` - Nhanh, ổn định
3. `gemini-1.5-flash` - Nhanh
4. `gemini-1.5-pro-latest` - Thông minh nhất (chậm hơn)

---

## 🎓 Tài liệu tham khảo

- **Gemini API Docs**: https://ai.google.dev/docs
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Pricing**: https://ai.google.dev/pricing (FREE tier rất generous!)
- **Rate Limits**: https://ai.google.dev/gemini-api/docs/rate-limits

---

## 🆘 Cần trợ giúp?

Nếu gặp vấn đề, check Console (F12) để xem error logs chi tiết.

Hệ thống đã được thiết kế để **tự động fallback**, nên Teacher Emma sẽ luôn hoạt động dù Gemini có lỗi! 🎉

---

**Happy Teaching with AI! 🤖👩‍🏫**
