/**
 * AI Service - Tích hợp Gemini AI thông minh cho Teacher Emma
 * 
 * 🎯 3 CHIẾN LƯỢC HOẠT ĐỘNG (Auto fallback):
 * 1. Gemini Direct API (Client-side) - Nhanh nhất, cần VITE_GEMINI_API_KEY
 * 2. Backend Server Proxy - Bảo mật hơn, cần VITE_SERVER_URL
 * 3. Built-in AI Pattern Matching - Fallback luôn hoạt động
 * 
 * 📝 SETUP GEMINI API (1 phút):
 * 1. Lấy FREE API key: https://makersuite.google.com/app/apikey
 * 2. Tạo file .env: VITE_GEMINI_API_KEY=your_key_here
 * 3. Restart server: npm run dev
 * 
 * ✅ Xem chi tiết: /GEMINI_SETUP.md
 */

import { getSupabaseClient } from './supabase/client';
import { getEnv } from './env';

export interface AIResponse {
  content: string;
  similarQuestion?: string;
  answer?: string;
  confidence?: number;
}

// ============================================================================
// MEMORY & CONTEXT MANAGEMENT
// ============================================================================

class ConversationMemory {
  private context: string[] = [];
  private maxContextLength = 5;

  addMessage(role: 'user' | 'assistant', content: string) {
    this.context.push(`${role}: ${content}`);
    if (this.context.length > this.maxContextLength * 2) {
      this.context = this.context.slice(-this.maxContextLength * 2);
    }
  }

  getContext(): string {
    return this.context.join('\n');
  }

  clear() {
    this.context = [];
  }
}

const memory = new ConversationMemory();

// ============================================================================
// BUILT-IN AI LOGIC (FALLBACK)
// ============================================================================

interface ResponsePattern {
  keywords: string[];
  responses: string[];
  confidence: number;
}

const responsePatterns: ResponsePattern[] = [
  // Math patterns
  {
    keywords: ['cộng', 'add', 'plus', '+', 'tổng'],
    responses: [
      'Để giải bài toán cộng, em cần cộng các số lại với nhau. Ví dụ: 5 + 3 = 8',
      'Phép cộng là phép tính đơn giản nhất! Em hãy thử cộng từng số một nhé.',
      'Cách làm: Lấy số thứ nhất, cộng thêm số thứ hai. Thử làm ví dụ xem!'
    ],
    confidence: 0.8
  },
  {
    keywords: ['trừ', 'subtract', 'minus', '-', 'hiệu'],
    responses: [
      'Phép trừ là lấy số lớn trừ đi số nhỏ. Ví dụ: 10 - 4 = 6',
      'Để tính hiệu, em lấy số bị trừ trừ đi số trừ nhé!',
      'Cách nhớ: Số trước dấu "-" là số bị trừ, số sau là số trừ.'
    ],
    confidence: 0.8
  },
  {
    keywords: ['nhân', 'multiply', 'times', '×', '*', 'tích'],
    responses: [
      'Phép nhn là cộng lặp lại nhiều lần. Ví dụ: 3 × 4 = 3 + 3 + 3 + 3 = 12',
      'Để nhân nhanh, em có thể học thuộc bảng cửu chương nhé!',
      'Mẹo: 3 × 4 nghĩa là "3 được lấy 4 lần" hoặc "4 được lấy 3 lần"'
    ],
    confidence: 0.8
  },
  {
    keywords: ['chia', 'divide', '÷', '/', 'thương'],
    responses: [
      'Phép chia là chia đều một số ra nhiều phần. Ví dụ: 12 ÷ 3 = 4',
      'Cách làm: Hỏi số lớn chứa bao nhiêu lần số nhỏ.',
      'Mẹo: Phép chia là phép nghịch đảo của phép nhân!'
    ],
    confidence: 0.8
  },

  // English Grammar patterns  
  {
    keywords: ['present simple', 'hiện tại đơn', 'thì hiện tại'],
    responses: [
      'Thì hiện tại đơn dùng để diễn tả:\n✅ Sự thật hiển nhiên: The sun rises in the east.\n✅ Thói quen: I go to school every day.\n✅ Sở thích: She likes music.\n\n**Công thức**: S + V(s/es) + O',
      'Present Simple có 3 dạng:\n• Khẳng định: I/You/We/They + V, He/She/It + V(s/es)\n• Phủ định: S + do/does not + V\n• Nghi vấn: Do/Does + S + V?',
      'Dấu hiệu nhận biết: always, usually, often, sometimes, never, every day/week/month'
    ],
    confidence: 0.9
  },
  {
    keywords: ['present continuous', 'hiện tại tiếp diễn', 'đang xảy ra'],
    responses: [
      'Thì hiện tại tiếp diễn dùng để diễn tả hành động đang xảy ra tại thời điểm nói.\n\n**Công thức**: S + am/is/are + V-ing\n\nVí dụ: I am studying English now.',
      'Cách thêm -ing:\n• Thường: play → playing\n• Tận cùng -e: make → making\n• 1 nguyên âm + 1 phụ âm: run → running',
      'Dấu hiệu: now, at the moment, at present, right now, Look!, Listen!'
    ],
    confidence: 0.9
  },
  {
    keywords: ['past simple', 'quá khứ đơn', 'đã xảy ra'],
    responses: [
      'Thì quá khứ đơn dùng để diễn tả hành động đã xảy ra và kết thúc trong quá khứ.\n\n**Công thức**: S + V-ed/V2 + O\n\nVí dụ: I visited Ha Long Bay last summer.',
      'Động từ có 2 loại:\n• Quy tắc: thêm -ed (play → played)\n• Bất quy tắc: go → went, eat → ate, see → saw',
      'Dấu hiệu: yesterday, last week/month/year, ago, in + năm quá khứ'
    ],
    confidence: 0.9
  },

  // Greetings
  {
    keywords: ['xin chào', 'hello', 'hi', 'chào'],
    responses: [
      'Xin chào em! 👋 Tôi là Teacher Emma, trợ lý học tập AI của em. Em cần giúp gì hôm nay?',
      'Hi em! 😊 Rất vui được gặp em. Em muốn học về chủ đề gì nào?',
      'Hello! 🌟 Tôi sẵn sàng giúp em học tập. Hãy đt câu hỏi nhé!'
    ],
    confidence: 0.9
  },

  // Thanks
  {
    keywords: ['cảm ơn', 'thank', 'thanks', 'cám ơn'],
    responses: [
      'Không có chi em! 😊 Tôi luôn sẵn sàng giúp em học tập.',
      'Em thật lịch sự! Cứ hỏi tôi bất cứ lúc nào em cần nhé! 🌟',
      'You\'re welcome! Chúc em học tốt! 💪'
    ],
    confidence: 0.9
  }
];

function generateSmartResponse(question: string, context?: string): AIResponse {
  const lowerQuestion = question.toLowerCase();
  
  // Try to find matching patterns
  for (const pattern of responsePatterns) {
    for (const keyword of pattern.keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        const randomResponse = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
        return {
          content: randomResponse,
          confidence: pattern.confidence
        };
      }
    }
  }

  // Default response if no pattern matches
  return {
    content: `Xin lỗi em, câu hỏi này hơi khó với tôi. 🤔

Tôi có thể giúp em về:
📚 **Tiếng Anh**: Grammar (6 thì), vocabulary, reading, writing
🔢 **Toán học**: Cộng, trừ, nhân, chia, phân số, hình học
🔬 **Khoa học**: Vật lý, hóa học, sinh học cơ bản
📖 **Phương pháp học tập**: Kỹ thuật ghi nhớ, ôn thi hiệu quả

Em hãy thử hỏi cụ thể hơn nhé! Ví dụ: "Thì hiện tại đơn là gì?" hoặc "Làm thế nào để học từ vựng hiệu quả?"`,
    confidence: 0.3
  };
}

// ============================================================================
// GEMINI API VIA BACKEND SERVER
// ============================================================================

async function callGeminiViaBackendServer(question: string, context?: string): Promise<string> {
  try {
    // Get server URL from environment manager
    const serverUrl = getEnv('VITE_SERVER_URL') || '';
    
    if (!serverUrl) {
      console.warn('⚠️ VITE_SERVER_URL not configured');
      throw new Error('Backend server URL not configured');
    }
    
    // Call backend server endpoint
    const response = await fetch(`${serverUrl}/make-server-bf8225f3/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, context })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Backend server error:', response.status, errorData);
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.content) {
      console.error('❌ Invalid response format:', data);
      throw new Error('Invalid AI response format');
    }

    console.log('✅ Gemini AI success (via Backend Server)');
    return data.content;

  } catch (error) {
    console.error('❌ Gemini Backend Server call failed:', error);
    throw error;
  }
}

// ============================================================================
// GEMINI API - DIRECT CALL (Client-side with API Key)
// ============================================================================

async function callGeminiDirectly(question: string, context?: string): Promise<string> {
  try {
    // Get API key from environment manager (will use hardcoded fallback)
    const apiKey = getEnv('VITE_GEMINI_API_KEY');
    
    if (!apiKey) {
      console.warn('⚠️ VITE_GEMINI_API_KEY not found');
      throw new Error('Gemini API key not configured');
    }
    
    console.log('✅ API Key loaded successfully');

    // System prompt for Teacher Emma
    const systemPrompt = `You are Teacher Emma, a friendly and encouraging AI teacher for Vietnamese middle school students (grades 6-9). 

Your capabilities:
✨ Explain English grammar, vocabulary clearly in Vietnamese
📚 Help with Math, Science, and other subjects
✍️ Check writing and provide detailed feedback
💬 Chat naturally and remember conversation context
🎯 Adapt explanations to student's level

Guidelines:
- Be patient, supportive, and encouraging
- Use simple language appropriate for middle school
- Provide examples and practice exercises
- Use emojis to make learning fun 😊
- Respond in Vietnamese unless asked in English
- Remember previous messages in the conversation
- Keep responses concise but informative (under 500 words)
- Break down complex topics into simple steps

${context ? `Previous conversation context:\n${context}\n\n` : ''}Student's question: ${question}`;

    // Use gemini-flash-latest as requested
    const models = [
      'gemini-flash-latest'
    ];

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: systemPrompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000,
                topP: 0.95,
                topK: 40,
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
              ]
            })
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          
          // Parse error to check if it's quota error (429)
          let isQuotaError = false;
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error?.code === 429 || errorData.error?.status === 'RESOURCE_EXHAUSTED') {
              isQuotaError = true;
              console.warn(`⚠️ Model ${model} quota exceeded, trying next model...`);
            } else {
              console.warn(`⚠️ Model ${model} error ${response.status}, trying next...`);
            }
          } catch (e) {
            console.warn(`⚠️ Model ${model} failed with status ${response.status}, trying next...`);
          }
          
          continue; // Try next model
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
          console.error(`❌ Invalid response from ${model}:`, data);
          continue; // Try next model
        }

        console.log(`✅ Gemini AI success with model: ${model}`);
        return aiText;

      } catch (modelError) {
        console.error(`❌ Error with model ${model}:`, modelError);
        continue; // Try next model
      }
    }

    throw new Error('All Gemini models failed to respond');

  } catch (error) {
    console.error('❌ Gemini Direct API call failed:', error);
    throw error;
  }
}

// ============================================================================
// MAIN AI SERVICE - WITH AUTO FALLBACK
// ============================================================================

export async function getAIResponse(question: string): Promise<AIResponse> {
  let response: AIResponse;
  const context = memory.getContext();

  try {
    // Strategy 1: Try Gemini API directly (fastest, client-side with default API key)
    console.log('🚀 Teacher Emma đang suy nghĩ...');
    const content = await callGeminiDirectly(question, context);
    response = { content, confidence: 0.95 };

    // Store in memory for context
    memory.addMessage('user', question);
    memory.addMessage('assistant', response.content);

    return response;

  } catch (error: any) {
    console.log('💭 Gemini API không khả dụng, đang chuyển sang Built-in AI...');
    
    // Strategy 2: Fallback to built-in AI (always works)
    // Note: Backend server strategy skipped due to deployment restrictions
    response = generateSmartResponse(question, context);
    
    memory.addMessage('user', question);
    memory.addMessage('assistant', response.content);
    
    return response;
  }
}

/**
 * Clear conversation memory
 */
export function clearMemory() {
  memory.clear();
}