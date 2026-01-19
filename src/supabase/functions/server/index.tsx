import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';

const app = new Hono();

// Open CORS for all origins (required for Figma Make)
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger
app.use('*', logger(console.log));

// ============================================================================
// AI CHAT ROUTE - Backend Proxy for Gemini API
// ============================================================================
app.post('/make-server-bf8225f3/ai-chat', async (c) => {
  try {
    const { question, context } = await c.req.json();
    
    if (!question) {
      return c.json({ error: 'Question is required' }, 400);
    }

    // Get Gemini API key from environment (100% SECURE - never exposed to frontend)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return c.json({ 
        error: 'AI service not configured. Please upload GEMINI_API_KEY in Supabase secrets.',
        details: 'Administrator needs to add GEMINI_API_KEY to environment variables'
      }, 500);
    }

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
- Use emojis to make learning fun
- Respond in Vietnamese unless asked in English
- Remember previous messages in the conversation

Current context: ${context || 'New conversation'}

Student's question: ${question}`;

    // Use gemini-flash-latest as requested
    const models = [
      'gemini-flash-latest'
    ];
    
    let lastError: any = null;
    
    for (const model of models) {
      try {
        console.log(`🔄 Trying model: ${model}...`);
        
        // Call Gemini API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
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
                maxOutputTokens: 1000,
              }
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ Gemini API error:', response.status, errorData);
          
          if (response.status === 429) {
            return c.json({ 
              error: 'Rate limit exceeded. Please try again in a moment.',
              code: 'RATE_LIMIT'
            }, 429);
          }
          
          if (response.status === 403) {
            return c.json({ 
              error: 'Invalid API key or API not enabled. Please check Gemini API configuration.',
              code: 'INVALID_KEY'
            }, 403);
          }
          
          lastError = { 
            error: 'AI service error',
            details: errorData,
            status: response.status
          };
          continue;
        }

        const data = await response.json();
        
        // Extract text from Gemini response
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!aiText) {
          console.error('❌ Unexpected Gemini response format:', JSON.stringify(data));
          return c.json({ 
            error: 'Invalid AI response format',
            details: 'Could not extract text from AI response'
          }, 500);
        }

        console.log('✅ AI chat successful:', question.substring(0, 50) + '...');
        
        return c.json({
          content: aiText,
          confidence: 0.95,
          provider: 'gemini',
          timestamp: new Date().toISOString()
        });

      } catch (error: any) {
        console.error('❌ AI chat error:', error);
        lastError = { 
          error: 'Server error while processing AI request',
          message: error.message || 'Unknown error',
          stack: Deno.env.get('DEBUG') ? error.stack : undefined
        };
      }
    }

    // If all models fail, return the last error
    if (lastError) {
      return c.json(lastError, 500);
    }

    return c.json({ 
      error: 'All AI models failed to respond. Please try again later.',
      code: 'ALL_MODELS_FAILED'
    }, 500);

  } catch (error: any) {
    console.error('❌ AI chat error:', error);
    return c.json({ 
      error: 'Server error while processing AI request',
      message: error.message || 'Unknown error',
      stack: Deno.env.get('DEBUG') ? error.stack : undefined
    }, 500);
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/make-server-bf8225f3/health', (c) => {
  return c.json({ 
    status: 'ok',
    service: 'EngMastery AI Backend',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!Deno.env.get('GEMINI_API_KEY')
  });
});

// Start server
Deno.serve(app.fetch);