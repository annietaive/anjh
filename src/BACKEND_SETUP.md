# 🔐 Backend Setup - An toàn cho API Key

## Vấn đề
API key đặt trong frontend = **BỊ LEAK 100%**

## Giải pháp: Tạo Backend Proxy Server

### Option 1: Node.js + Express (Vercel/Render)

#### 1. Tạo project backend
```bash
mkdir engmastery-backend
cd engmastery-backend
npm init -y
npm install express cors dotenv @google/generative-ai
```

#### 2. Tạo file `.env`
```env
GEMINI_API_KEY=AIzaSyDhfTadPHXco83K2_bkspZumcWafhXn0mI
PORT=3001
```

#### 3. Tạo file `server.js`
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI với API key từ .env (BẢO MẬT)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint - Frontend chỉ gọi endpoint này
app.post('/api/chat', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });
    
    const systemPrompt = `You are Teacher Emma, a friendly and encouraging AI teacher for Vietnamese middle school students (grades 6-9). You teach English, Math, Science and provide study advice. You are patient, supportive, and explain things clearly. You can respond in both Vietnamese and English. You use emojis appropriately to make learning fun.`;
    
    let fullPrompt = `${systemPrompt}\n\n`;
    if (context) {
      fullPrompt += `Context:\n${context}\n\nNew question: ${question}`;
    } else {
      fullPrompt += question;
    }
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();
    
    res.json({ 
      content: text, 
      confidence: 0.95 
    });
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'AI service error',
      message: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
```

#### 4. Tạo file `.gitignore`
```
node_modules/
.env
```

#### 5. Deploy lên Vercel (MIỄN PHÍ)
```bash
npm install -g vercel
vercel
```

Hoặc deploy lên Render, Railway, Fly.io (đều free tier)

---

### Option 2: Vercel Serverless Functions (Đơn giản hơn)

#### 1. Tạo folder structure
```
/api
  /chat.js
```

#### 2. File `/api/chat.js`
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { question, context } = req.body;
    
    // API key từ Environment Variables của Vercel (BẢO MẬT)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });
    
    const systemPrompt = `You are Teacher Emma...`;
    
    let fullPrompt = `${systemPrompt}\n\n`;
    if (context) {
      fullPrompt += `Context:\n${context}\n\nNew question: ${question}`;
    } else {
      fullPrompt += question;
    }
    
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    
    res.status(200).json({ 
      content: text, 
      confidence: 0.95 
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

#### 3. Deploy lên Vercel
1. Push code lên GitHub
2. Vào vercel.com → Import project
3. Thêm Environment Variable: `GEMINI_API_KEY`
4. Deploy → Lấy URL: `https://your-app.vercel.app`

---

## Cập nhật Frontend

Sau khi có backend, sửa `/utils/aiService.ts`:

```typescript
// Thay vì gọi trực tiếp Gemini API
const BACKEND_URL = 'https://your-backend.vercel.app'; // Hoặc localhost:3001 khi dev

async function callGemini(messages: AIMessage[]): Promise<string> {
  try {
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessage = messages.find(m => m.role === 'user');
    
    // GỌI BACKEND THAY VÌ GỌI TRỰC TIẾP GEMINI
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userMessage?.content || '',
        context: systemMessage?.content || ''
      })
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content;
    
  } catch (error: any) {
    console.error('Backend API Error:', error);
    throw error;
  }
}
```

---

## Bảo mật tăng cường

### 1. Rate limiting (Backend)
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 15, // Tối đa 15 requests/phút
  message: 'Too many requests, please try again later'
});

app.use('/api/chat', limiter);
```

### 2. API Key rotation
Thay API key định kỳ (1 tháng/lần)

### 3. Usage monitoring
Theo dõi usage trên Google AI Studio để phát hiện bất thường

### 4. CORS protection
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com', // Chỉ cho phép domain này
  methods: ['POST'],
  credentials: true
}));
```

---

## So sánh

| Cách | Bảo mật | Độ khó | Chi phí |
|------|---------|--------|---------|
| Hardcode trong frontend | ❌ 0/10 | ✅ Rất dễ | Free |
| localStorage | ❌ 0/10 | ✅ Dễ | Free |
| Backend proxy | ✅ 10/10 | ⚠️ Trung bình | Free (Vercel) |
| Serverless function | ✅ 10/10 | ⚠️ Dễ | Free (Vercel) |

---

## Kết luận

**Nếu bạn muốn app bảo mật:**
→ Tạo backend proxy server (Option 2 - Vercel Serverless đơn giản nhất)

**Nếu chỉ demo/học tập:**
→ Dùng localStorage, chấp nhận rủi ro bị leak

**Không bao giờ:**
→ Hardcode API key trong frontend code!
