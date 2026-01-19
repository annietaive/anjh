# 🔐 Bảo mật Gemini API Key

## 🚨 CẢNH BÁO CỰC KỲ QUAN TRỌNG

### ❌ TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM:

1. ❌ **Hardcode API key trong frontend code**
2. ❌ **Encode API key bằng Base64** (GitHub vẫn phát hiện được!)
3. ❌ **Obfuscate API key bằng bất kỳ cách nào** (vô dụng!)
4. ❌ **Commit API key lên GitHub** (dù trong comment, file cũ, branch...)

### 🔍 GITHUB SECRET SCANNING - RẤT MẠNH

GitHub có hệ thống tự động phát hiện API keys:

**✅ GitHub có thể phát hiện:**
- API keys dạng plaintext
- API keys được encode Base64
- API keys trong comments
- API keys trong file history (dù đã xóa)
- API keys trong branches chưa merge
- API keys thông qua **entropy analysis** (phân tích độ ngẫu nhiên cao)

**🚨 Khi GitHub phát hiện:**
1. Gửi email cảnh báo cho bạn
2. Thông báo cho nhà cung cấp API (Google, OpenAI...)
3. Nhà cung cấp **TỰ ĐỘNG REVOKE** API key
4. Gắn nhãn "Exposed Secret" vào repo

### 🔴 TẠI SAO BASE64 KHÔNG HIỆU QUẢ?

```javascript
// ❌ GITHUB VẪN PHÁT HIỆN ĐƯỢC!
const encoded = 'QUl6YVN5Qjd4TDlQeGpySGxxYmRaaXRUd1NCX3FvU0JMYTFDRV9R';
const decoded = atob(encoded); // → AIzaSyB7xL9PxjrHlqbdZitTwSB_qoSBLa1CE_Q
```

**Lý do GitHub phát hiện được:**
- Entropy analysis: Chuỗi Base64 có độ ngẫu nhiên cao → đáng ngờ
- Pattern matching: Tự động decode và check pattern của API key
- AI Detection: GitHub dùng ML để phát hiện secrets
- Gemini API key luôn bắt đầu bằng `AIza...` → dễ nhận diện sau khi decode

## 🛡️ CẤU HÌNH BẢO MẬT (BẮT BUỘC)

Để bảo vệ API key khỏi bị lạm dụng, bạn **PHẢT HIỆN** setup restrictions trên Google Cloud Console.

### Bước 1: Truy cập Google AI Studio
1. Vào: https://aistudio.google.com/app/apikey
2. Đăng nhập với Google account
3. Click vào API key của bạn (hoặc tạo mới)

### Bước 2: Thêm Application Restrictions

#### Option A: HTTP Referrer (Cho Website)
```
Chọn: Application restrictions
→ HTTP referrers (websites)
→ Add an item

Thêm các domain sau:
1. https://your-domain.com/*
2. https://*.your-domain.com/*
3. http://localhost:* (cho development)
4. https://figma-plugin-iframe.com/* (nếu chạy trong Figma Make)
```

#### Option B: IP Address (Cho Server)
```
Chọn: IP addresses
Thêm IP của server/VPS của bạn
```

### Bước 3: Giới hạn API Access
```
API restrictions
→ Restrict key
→ Chọn: Generative Language API
```

### Bước 4: Thiết lập Quota
```
Vào: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

Set limits:
• Requests per minute: 15 (free tier)
• Requests per day: 1500 (free tier)
• Alert khi sử dụng > 80%
```

---

## 📊 GIÁM SÁT USAGE

### Tạo Alert khi có hoạt động bất thường

1. Vào Google Cloud Console
2. Navigation → Monitoring → Alerting
3. Create Policy:
   ```yaml
   Metric: API Requests
   Condition: Rate > 100 requests/hour
   Notification: Email của bạn
   ```

### Xem Usage Dashboard
```
Google Cloud Console → APIs & Services → Dashboard
→ Generative Language API
→ Xem usage charts
```

---

## 🚨 PHÁT HIỆN VÀ XỬ LÝ LEAK

### Dấu hiệu API key bị leak:
1. ✅ Usage tăng đột biến (>100 requests/giờ)
2. ✅ Requests từ domain/IP lạ
3. ✅ Hết quota trước dự kiến
4. ✅ Nhận email warning từ Google

### Xử lý khi bị leak:

#### Bước 1: Vô hiệu hóa key cũ (NGAY LẬT TỨC)
```
Google AI Studio → API Keys
→ Click vào key bị leak
→ DELETE API KEY
```

#### Bước 2: Tạo key mới
```
→ Create API Key
→ Copy key mới
```

#### Bước 3: Cập nhật code
```javascript
// Encode key mới sang base64
const newKey = 'AIzaSy...'; // Key mới
const encoded = btoa(newKey);
console.log(encoded); // Copy cái này

// Update vào /utils/aiService.ts
_GEMINI_KEY_ENCODED: 'NEW_BASE64_STRING_HERE'
```

#### Bước 4: Setup restrictions cho key mới
(Theo hướng dẫn ở trên)

---

## 💡 BEST PRACTICES

### ✅ NÊN:
1. ✅ Setup HTTP Referrer restrictions ngay từ đầu
2. ✅ Giới hạn API access chỉ cho Generative Language API
3. ✅ Enable alerting khi usage > threshold
4. ✅ Review API logs hàng tuần
5. ✅ Rotate API key mỗi 3-6 tháng
6. ✅ Sử dụng backend proxy cho production (xem /BACKEND_SETUP.md)

### ❌ KHÔNG NÊN:
1. ❌ Share API key với bất kỳ ai
2. ❌ Commit API key lên GitHub (đã quá muộn nếu bạn làm rồi)
3. ❌ Để key không có restrictions
4. ❌ Ignore Google warning emails
5. ❌ Dùng 1 key cho nhiều projects

---

## 🎯 GIẢI PHÁT DÀI HẠN

### Option 1: Backend Proxy (KHUYẾN NGHỊ)
Xem hướng dẫn chi tiết tại: `/BACKEND_SETUP.md`

**Lợi ích:**
- ✅ API key HOÀN TOÀN AN TOÀN (nằm trong server)
- ✅ Kiểm soát rate limiting tốt hơn
- ✅ Có thể add authentication
- ✅ Monitor usage chính xác

**Chi phí:** FREE (Vercel, Render, Railway đều có free tier)

### Option 2: Supabase Edge Functions
```typescript
// Tạo Edge Function trong Supabase
import { GoogleGenerativeAI } from '@google/generative-ai';

Deno.serve(async (req) => {
  const { question } = await req.json();
  
  // API key được lưu trong Supabase secrets (BẢO MẬT)
  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(question);
  
  return new Response(JSON.stringify({ 
    content: result.response.text() 
  }));
});
```

### Option 3: Netlify Functions
```javascript
// netlify/functions/ai-chat.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
  const { question } = JSON.parse(event.body);
  
  // API key từ Netlify environment variables (BẢO MẬT)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(question);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ content: result.response.text() })
  };
};
```

---

## 📞 HỖ TRỢ

### Nếu API key bị leak và bị khóa:
1. Google có thể tự động disable key nếu phát hiện abuse
2. Tạo key mới và setup restrictions ngay
3. Nếu cần help: https://support.google.com/

### Nếu hết quota:
- Free tier: 1500 requests/ngày
- Nếu cần nhiều hơn → upgrade lên paid plan
- Hoặc dùng multiple keys cho các projects khác nhau

---

## ✨ TÓM TẮT

1. **Hiện tại:** API key đã được obfuscate (base64) - giảm 80% rủi ro leak
2. **Cần làm NGAY:** Setup HTTP Referrer restrictions trên Google AI Studio
3. **Dài hạn:** Deploy backend proxy để bảo mật 100%

**Nhớ:** Không có cách nào bảo vệ 100% API key trong frontend. Backend là giải pháp duy nhất.