import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Mic, Volume2, Square, Loader2, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MarkdownText } from './MarkdownText';
import { getAIResponse, clearMemory } from '../utils/aiService';
import { speakWithEmmaVoice, stopSpeaking, isSpeaking, loadVoices } from '../utils/voiceService';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  similarQuestion?: string;
  answer?: string;
}

interface AITeacherProps {
  onBack: () => void;
}

export function AITeacher({ onBack }: AITeacherProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào em! 👋 Cô là Teacher Emma - giáo viên AI thông minh của em. \n\n🌟 **Cô có thể giúp em:**\n✨ Giải đáp mọi thắc mắc về tiếng Anh\n📚 Hướng dẫn ngữ pháp, từ vựng một cách dễ hiểu\n✍️ Chấm bài và sửa lỗi chi tiết\n💬 Trò chuyện tự nhiên như người thật\n🎯 Nhớ ngữ cảnh cuộc trò chuyện để hỗ trợ tốt hơn\n🔢 Giải đáp câu hỏi Toán, Khoa học và các môn học khác\n\nĐừng ngại hỏi bất cứ điều gì em thắc mắc nhé! Cô luôn sẵn sàng lắng nghe và giúp đỡ. 🤗\n\nHôm nay em muốn học về gì?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize voices on mount
  useEffect(() => {
    loadVoices();
    
    return () => {
      // Cleanup: stop any ongoing speech
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const quickQuestions = [
    "Giải thích thì hiện tại đơn",
    "Tính: 15 × 3 + 20",
    "Từ vựng về trường học",
    "Tại sao trời xanh?",
  ];

  // Language detection function
  const detectLanguage = (text: string): 'vi' | 'en' => {
    // Vietnamese keywords
    const vietnameseKeywords = [
      'là', 'của', 'có', 'được', 'này', 'đó', 'không', 'cho', 'và', 'để', 
      'với', 'các', 'một', 'những', 'trong', 'thì', 'như', 'khi', 'bằng',
      'giải', 'tính', 'hỏi', 'ti sao', 'làm', 'gì', 'sao', 'nào', 'thế',
      'cô', 'em', 'chào', 'cảm ơn', 'từ vựng', 'ngữ pháp'
    ];
    
    // Check for Vietnamese diacritics
    const vietnameseDiacritics = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    
    const lowerText = text.toLowerCase();
    
    // If has Vietnamese diacritics, definitely Vietnamese
    if (vietnameseDiacritics.test(text)) {
      return 'vi';
    }
    
    // Count Vietnamese keywords
    const vietnameseKeywordCount = vietnameseKeywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length;
    
    // If has 2+ Vietnamese keywords, consider it Vietnamese
    if (vietnameseKeywordCount >= 2) {
      return 'vi';
    }
    
    // If has 1 Vietnamese keyword and text is short, consider it Vietnamese
    if (vietnameseKeywordCount >= 1 && text.length < 30) {
      return 'vi';
    }
    
    // Otherwise, English
    return 'en';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call AI service
      const aiResponse = await getAIResponse(input);
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: messages.length + 2,
          role: 'assistant',
          content: aiResponse.content,
          similarQuestion: aiResponse.similarQuestion,
          answer: aiResponse.answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 800 + Math.random() * 400); // Shorter delay since AI is fast
    } catch (error) {
      console.error('AI Error:', error);
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartListening = () => {
    if (typeof window !== 'undefined') {
      // Support both webkitSpeechRecognition and SpeechRecognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('❌ Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.\n\n✅ Vui lòng sử dụng:\n• Google Chrome\n• Microsoft Edge\n• Brave Browser');
        return;
      }

      const recognition = new SpeechRecognition();
      
      // Try to detect language - default to Vietnamese
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('✅ Mic started listening...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('✅ Recognized:', transcript);
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        
        // Show user-friendly error messages
        if (event.error === 'not-allowed') {
          alert('🎤 QUYỀN TRUY CẬP MICROPHONE BỊ TỪ CHỐI\n\n' +
                '📌 Cách sửa lỗi:\n\n' +
                '1️⃣ Nhấn vào biểu tượng 🔒 hoặc 🎤 bên trái thanh địa chỉ\n\n' +
                '2️⃣ Chọn "Cho phép" (Allow) cho quyền Microphone\n\n' +
                '3️⃣ Tải lại trang (F5) và thử lại\n\n' +
                '💡 Lưu ý: Tính năng này chỉ hoạt động trên HTTPS hoặc localhost');
        } else if (event.error === 'no-speech') {
          alert('🔇 Không nghe thấy giọng nói\n\nVui lòng:\n✅ Kiểm tra microphone đã bật chưa\n✅ Nói rõ hơn và thử lại');
        } else if (event.error === 'audio-capture') {
          alert('🎤 Không tìm thấy microphone\n\nVui lòng:\n✅ Kết nối microphone\n✅ Kiểm tra microphone trong cài đặt hệ thống');
        } else if (event.error === 'network') {
          alert('🌐 Lỗi kết nối mạng\n\nVui lòng kiểm tra kết nối internet và thử lại');
        } else {
          alert('❌ Lỗi nhận diện giọng nói: ' + event.error + '\n\nVui lòng thử lại hoặc kiểm tra cài đặt microphone');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('🛑 Mic stopped listening');
      };

      recognitionRef.current = recognition;
      
      try {
        recognition.start();
        console.log('🎤 Requesting microphone access...');
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        setIsListening(false);
        alert('❌ Không thể khởi động mic\n\n' +
              'Nguyên nhân có thể:\n' +
              '• Microphone đang được sử dụng bởi ứng dụng khác\n' +
              '• Chưa cấp quyền truy cập microphone\n' +
              '• Microphone bị lỗi\n\n' +
              'Vui lòng kiểm tra và thử lại!');
      }
    } else {
      alert('❌ Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.\n\n✅ Vui lòng sử dụng Chrome hoặc Edge.');
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSpeak = async (text: string, language: 'vi' | 'en' = 'vi') => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ đọc văn bản. Vui lòng sử dụng Chrome hoặc Edge.');
      return;
    }

    // Stop any ongoing speech
    stopSpeaking();

    // Clean text - remove markdown formatting and special characters
    const cleanText = text
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/→/g, '') // Remove arrows
      .replace(/•/g, '') // Remove bullets
      .replace(/\n\n+/g, '. ') // Replace multiple line breaks with period
      .replace(/\n/g, ', '); // Replace single line breaks with comma

    // Detect language
    const detectedLang = detectLanguage(text);
    const voiceLang = detectedLang === 'vi' ? 'vi-VN' : 'en-US';

    try {
      setIsSpeaking(true);
      await speakWithEmmaVoice(cleanText, { lang: voiceLang });
      setIsSpeaking(false);
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại trang chủ</span>
      </button>

      <div className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-200/30 to-yellow-200/30 rounded-full blur-3xl -z-0"></div>
        
        {/* Header */}
        <div className="border-b border-purple-100/50 p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-md opacity-60 animate-pulse"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1746513534315-caa52d3f462c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGZlbWFsZSUyMHRlYWNoZXJ8ZW58MXx8fHwxNzY0NDcwMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Teacher Emma"
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
              />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1 border-2 border-white shadow-md z-20">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-gray-900 flex items-center gap-2">
                <span>Giáo viên AI - Teacher Emma</span>
                <span className="text-xl">👩‍🏫</span>
              </h2>
              <p className="text-gray-600 text-sm">Hỏi bất cứ điều gì: Tiếng Anh, Toán, Khoa học... 🌟</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md relative ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1746513534315-caa52d3f462c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGZlbWFsZSUyMHRlYWNoZXJ8ZW58MXx8fHwxNzY0NDcwMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Teacher Emma"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>

              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className="relative group">
                  <div
                    className={`inline-block p-4 rounded-2xl shadow-md hover:shadow-lg transition-all ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-white to-purple-50/50 text-gray-900 border border-purple-100'
                        : 'bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 text-white'
                    }`}
                  >
                    <MarkdownText content={message.content} />
                    
                    {/* Similar Question */}
                    {message.similarQuestion && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <div className="text-purple-700 text-sm">{message.similarQuestion}</div>
                      </div>
                    )}
                    
                    {/* Answer */}
                    {message.answer && (
                      <div className="mt-2 p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
                        <div className="text-green-800 text-sm">{message.answer}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Speaker button for assistant messages */}
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleSpeak(message.content)}
                      className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full p-2 shadow-md hover:shadow-xl hover:scale-110"
                      title="Đọc câu trả lời"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1746513534315-caa52d3f462c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGZlbWFsZSUyMHRlYWNoZXJ8ZW58MXx8fHwxNzY0NDcwMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Teacher Emma"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              </div>
              <div className="bg-gradient-to-br from-white to-purple-50/50 p-4 rounded-2xl shadow-md border border-purple-100">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 relative z-10">
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Câu hỏi gợi ý:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-purple-100 hover:shadow-md transition-all text-sm text-left border border-blue-100 hover:scale-105 hover:-translate-y-0.5"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-purple-100/50 p-4 bg-white/80 backdrop-blur-sm relative z-10">
          <div className="flex gap-2 items-stretch">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn... (tiếng Việt hoặc tiếng Anh)"
              className="flex-1 px-4 py-3 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 border border-purple-100 transition-all"
            />
            
            {/* Desktop layout - All buttons in one row */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                disabled={isTyping}
                className={`${
                  isListening 
                    ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse shadow-lg shadow-red-500/50' 
                    : 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600'
                } text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                title={isListening ? 'Nhấn để dừng ghi âm' : 'Nhấn để nói'}
              >
                {isListening ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <Mic className="w-5 h-5" />
                  </div>
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={isSpeaking ? handleStopSpeaking : () => handleSpeak(messages[messages.length - 1].content)}
                disabled={isTyping || messages.length <= 1}
                className={`${
                  isSpeaking 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50' 
                    : 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600'
                } text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                title={isSpeaking ? 'Nhấn để dừng đọc' : 'Nghe câu trả lời cuối'}
              >
                {isSpeaking ? <Square className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile layout - Send button only, mic/speaker below */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="sm:hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile - Mic and Speaker buttons row */}
          <div className="sm:hidden mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={isTyping}
              className={`${
                isListening 
                  ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600'
              } text-white py-4 rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isListening ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <Mic className="w-6 h-6" />
                  <span className="font-medium">Đang nghe...</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  <span className="font-medium">Nói</span>
                </>
              )}
            </button>
            
            <button
              onClick={isSpeaking ? handleStopSpeaking : () => handleSpeak(messages[messages.length - 1].content)}
              disabled={isTyping || messages.length <= 1}
              className={`${
                isSpeaking 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50' 
                  : 'bg-gradient-to-br from-blue-500 via-cyan-600 to-purple-600'
              } text-white py-4 rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-6 h-6" />
                  <span className="font-medium">Dừng</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6" />
                  <span className="font-medium">Nghe</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center hidden sm:block">
            🎤 Nhấn mic để nói | 🔊 Nhấn loa để nghe | 💡 Hỏi về tiếng Anh, toán, khoa học...
          </p>
          <p className="text-xs text-gray-500 mt-2 text-center sm:hidden">
            💡 Hỏi về tiếng Anh, toán, khoa học, lịch sử...
          </p>
        </div>
      </div>
    </div>
  );
}