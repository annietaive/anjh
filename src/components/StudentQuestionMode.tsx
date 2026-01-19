import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';

interface Message {
  id: string;
  type: 'student' | 'ai';
  content: string;
  similarQuestion?: string;
  answer?: string;
  timestamp: Date;
}

export function StudentQuestionMode() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '👋 Chào em! Giáo viên Emma đây. Em có thắc mắc gì không? Cứ thoải mái hỏi bất kỳ câu hỏi nào về:\n\n📚 Tiếng Anh (ngữ pháp, từ vựng, phát âm...)\n🔢 Toán học\n🔬 Khoa học\n📖 Hoặc bất kỳ môn học nào khác!\n\nCô sẽ giải thích chi tiết và giúp em hiểu rõ nhé! 💡',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeAndRespond = async (question: string): Promise<Message> => {
    // Kiểm tra câu hỏi có hợp lệ không
    const trimmedQuestion = question.trim();
    
    if (trimmedQuestion.length < 5) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: '🤔 Em ơi, câu hỏi của em có vẻ hơi ngắn. Em có thể nói rõ hơn một chút được không? Cô muốn giúp em nhưng cần hiểu rõ em đang hỏi về gì nhé!',
        timestamp: new Date(),
      };
    }

    // Phân tích loại câu hỏi
    const questionLower = trimmedQuestion.toLowerCase();
    
    // Toán học
    if (
      questionLower.includes('tính') ||
      questionLower.includes('giải') ||
      questionLower.includes('calculate') ||
      questionLower.includes('solve') ||
      /\d+\s*[\+\-\*\/×÷]\s*\d+/.test(questionLower) ||
      questionLower.includes('bao nhiêu') ||
      questionLower.includes('phương trình') ||
      questionLower.includes('equation')
    ) {
      return generateMathResponse(trimmedQuestion);
    }

    // Tiếng Anh - Ngữ pháp
    if (
      questionLower.includes('ngữ pháp') ||
      questionLower.includes('grammar') ||
      questionLower.includes('thì') ||
      questionLower.includes('tense') ||
      questionLower.includes('present simple') ||
      questionLower.includes('past simple') ||
      questionLower.includes('present perfect') ||
      questionLower.includes('passive') ||
      questionLower.includes('bị động')
    ) {
      return generateGrammarResponse(trimmedQuestion);
    }

    // Tiếng Anh - Từ vựng
    if (
      questionLower.includes('nghĩa') ||
      questionLower.includes('meaning') ||
      questionLower.includes('từ vựng') ||
      questionLower.includes('vocabulary') ||
      questionLower.includes('dịch') ||
      questionLower.includes('translate') ||
      questionLower.includes('what is') ||
      questionLower.includes('what does')
    ) {
      return generateVocabularyResponse(trimmedQuestion);
    }

    // Khoa học
    if (
      questionLower.includes('khoa học') ||
      questionLower.includes('science') ||
      questionLower.includes('hóa học') ||
      questionLower.includes('chemistry') ||
      questionLower.includes('vật lý') ||
      questionLower.includes('physics') ||
      questionLower.includes('sinh học') ||
      questionLower.includes('biology')
    ) {
      return generateScienceResponse(trimmedQuestion);
    }

    // Câu hỏi chung
    return generateGeneralResponse(trimmedQuestion);
  };

  const generateMathResponse = (question: string): Message => {
    const responses = [
      {
        content: `📐 **Cô giải chi tiết nhé:**\n\n${generateMathExplanation(question)}`,
        similarQ: 'Tính: 25 × 8 + 15 ÷ 3',
        similarA: '**Đáp án:** 205\n\n**Giải:**\n- Bước 1: 25 × 8 = 200\n- Bước 2: 15 ÷ 3 = 5\n- Bước 3: 200 + 5 = 205',
      },
      {
        content: `🔢 **Được rồi, cô sẽ giúp em giải nhé:**\n\n${generateMathExplanation(question)}`,
        similarQ: 'Giải phương trình: 3x + 5 = 20',
        similarA: '**Đáp án:** x = 5\n\n**Giải:**\n- Bước 1: 3x = 20 - 5\n- Bước 2: 3x = 15\n- Bước 3: x = 15 ÷ 3 = 5',
      },
    ];

    const selected = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: selected.content,
      similarQuestion: `\n\n💡 **Câu hỏi tương tự để em luyện thêm:**\n${selected.similarQ}`,
      answer: `\n\n✅ **Đáp án:**\n${selected.similarA}`,
      timestamp: new Date(),
    };
  };

  const generateMathExplanation = (question: string): string => {
    // Tìm phép tính trong câu hỏi
    const mathMatch = question.match(/(\d+)\s*[\+\-\*\/×÷]\s*(\d+)/);
    
    if (mathMatch) {
      const num1 = parseInt(mathMatch[1]);
      const num2 = parseInt(mathMatch[2]);
      const operator = question.match(/[\+\-\*\/×÷]/)?.[0];
      
      let result = 0;
      let operatorName = '';
      
      switch (operator) {
        case '+':
          result = num1 + num2;
          operatorName = 'cộng';
          break;
        case '-':
          result = num1 - num2;
          operatorName = 'trừ';
          break;
        case '*':
        case '×':
          result = num1 * num2;
          operatorName = 'nhân';
          break;
        case '/':
        case '÷':
          result = num1 / num2;
          operatorName = 'chia';
          break;
      }
      
      return `**Bài toán:** ${num1} ${operatorName} ${num2}\n\n**Đáp án:** ${result}\n\n**Giải thích:**\nĐây là phép ${operatorName} đơn giản:\n- Lấy ${num1} ${operator} ${num2} = **${result}**\n\n✨ Dễ mà đúng không em! 😊`;
    }
    
    return `**Phân tích bài toán:**\n\nĐể giải bài này, em cần:\n\n1️⃣ **Xác định yêu cầu:** Bài toán hỏi gì?\n2️⃣ **Liệt kê dữ kiện:** Em có những số liệu nào?\n3️⃣ **Lập phương trình:** Dựa vào mối quan hệ giữa các đại lượng\n4️⃣ **Tính toán:** Giải từng bước một\n5️⃣ **Kiểm tra:** Xem kết quả có hợp lý không\n\n💡 **Tip:** Đọc kỹ đề bài và làm từng bước, không vội vàng nhé!`;
  };

  const generateGrammarResponse = (question: string): Message => {
    const responses = [
      {
        content: `📖 **Cô giải thích về ngữ pháp nhé:**\n\n${generateGrammarExplanation(question)}\n\n**Ví dụ minh họa:**\n- ✅ I **have studied** English for 5 years. (Tôi đã học tiếng Anh được 5 năm)\n- ✅ She **has been** to London twice. (Cô ấy đã đến London 2 lần)\n\n💡 **Lưu ý:** Thì này dùng khi hành động bắt đầu từ quá khứ và còn liên quan đến hiện tại!`,
        similarQ: 'Chia động từ: They (learn) _____ English since 2020.',
        similarA: '**Đáp án:** have learned / have been learning\n\n**Giải thích:** Dùng Present Perfect vì có "since" (kể từ) và hành động vẫn tiếp diễn đến hiện tại.',
      },
      {
        content: `✍️ **Đây là điểm ngữ pháp quan trọng:**\n\n${generateGrammarExplanation(question)}\n\n**Công thức:**\n- Khẳng định: S + have/has + V3\n- Phủ định: S + have/has + not + V3  \n- Nghi vấn: Have/Has + S + V3?\n\n🎯 **Dấu hiệu nhận biết:** already, yet, just, ever, never, since, for...`,
        similarQ: 'Sửa lỗi sai: I have saw that movie yesterday.',
        similarA: '**Đáp án:** I **saw** that movie yesterday.\n\n**Giải thích:** Có "yesterday" (hôm qua) nên dùng Past Simple (V2), không dùng Present Perfect.',
      },
    ];

    const selected = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: selected.content,
      similarQuestion: `\n\n💡 **Câu hỏi tương tự:**\n${selected.similarQ}`,
      answer: `\n\n✅ **Đáp án:**\n${selected.similarA}`,
      timestamp: new Date(),
    };
  };

  const generateGrammarExplanation = (question: string): string => {
    const qLower = question.toLowerCase();
    
    if (qLower.includes('present perfect') || qLower.includes('hiện tại hoàn thành')) {
      return `**Thì Hiện tại Hoàn thành (Present Perfect)**\n\n📌 **Cấu trúc:** have/has + V3 (Past Participle)\n\n📌 **Cách dùng:**\n- Hành động xảy ra trong quá khứ, kết quả còn ở hiện tại\n- Kinh nghiệm trong đời\n- Hành động bắt đầu từ quá khứ và vẫn tiếp tục`;
    }
    
    if (qLower.includes('past simple') || qLower.includes('quá khứ đơn')) {
      return `**Thì Quá khứ đơn (Past Simple)**\n\n📌 **Cấu trúc:** V2 / V-ed\n\n📌 **Cách dùng:**\n- Hành động đã xảy ra và kết thúc trong quá khứ\n- Có thời gian cụ thể: yesterday, last week, ago...`;
    }

    return `**Ngữ pháp tiếng Anh:**\n\nĐể hiểu rõ điểm ngữ pháp này, em cần chú ý:\n\n1️⃣ **Cấu trúc câu**\n2️⃣ **Cách dùng**\n3️⃣ **Dấu hiệu nhận biết**\n4️⃣ **Ví dụ minh họa**\n\nEm có thể hỏi cụ thể hơn về thì nào để cô giải thích chi tiết nhé!`;
  };

  const generateVocabularyResponse = (question: string): Message => {
    const responses = [
      {
        content: `📚 **Cô giải thích từ vựng nhé:**\n\n${generateVocabExplanation(question)}\n\n**Ví dụ trong câu:**\n- "She is very **confident** when speaking English." (Cô ấy rất tự tin khi nói tiếng Anh)\n- "I need to build my **confidence**." (Tôi cần xây dựng sự tự tin của mình)\n\n💡 **Tip:** Học từ trong ngữ cảnh sẽ nhớ lâu hơn đấy!`,
        similarQ: 'Từ "achievement" nghĩa là gì?',
        similarA: '**Đáp án:** achievement = thành tựu, thành tích\n\n**Ví dụ:** His greatest achievement was winning the gold medal.\n(Thành tích lớn nhất của anh ấy là giành huy chương vàng)',
      },
      {
        content: `🔤 **Từ này có nghĩa là:**\n\n${generateVocabExplanation(question)}\n\n**Từ đồng nghĩa:**\n- Similar words: confident, assured, self-assured\n- Opposite: shy, timid, uncertain\n\n📝 **Cách nhớ:** Con + fide + nt → Tin tưởng vào bản thân!`,
        similarQ: 'Phân biệt "affect" và "effect"',
        similarA: '**Đáp án:**\n- **Affect** (động từ) = ảnh hưởng đến\n- **Effect** (danh từ) = kết quả, hiệu ứng\n\n**Ví dụ:** The weather affects my mood. (Thời tiết ảnh hưởng đến tâm trạng)\nThe effect of music is amazing. (Hiệu ứng của âm nhạc thật tuyệt)',
      },
    ];

    const selected = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: selected.content,
      similarQuestion: `\n\n💡 **Câu hỏi tương tự:**\n${selected.similarQ}`,
      answer: `\n\n✅ **Đáp án:**\n${selected.similarA}`,
      timestamp: new Date(),
    };
  };

  const generateVocabExplanation = (question: string): string => {
    // Tìm từ trong dấu ngoặc hoặc từ được hỏi
    const wordMatch = question.match(/["']([^"']+)["']/) || question.match(/\b([A-Za-z]+)\b/);
    
    if (wordMatch) {
      const word = wordMatch[1];
      return `**Từ:** ${word}\n\n**Nghĩa:** [Nghĩa của từ]\n\n**Phát âm:** /${word}/\n\n**Loại từ:** (noun/verb/adjective/adverb)\n\n**Ghi nhớ:** Hãy đặt câu với từ này để nhớ lâu hơn nhé!`;
    }
    
    return `**Từ vựng tiếng Anh:**\n\nĐể học từ hiệu quả, em nên:\n\n1️⃣ **Hiểu nghĩa** chính xác\n2️⃣ **Phát âm** chuẩn\n3️⃣ **Đặt câu** ví dụ\n4️⃣ **Học từ đồng nghĩa** và trái nghĩa\n5️⃣ **Ôn tập** thường xuyên\n\nEm hỏi cụ thể từ nào để cô giải thích chi tiết nhé!`;
  };

  const generateScienceResponse = (question: string): Message => {
    const responses = [
      {
        content: `🔬 **Cô giải thích khoa học nhé:**\n\n${generateScienceExplanation(question)}\n\n**Ví dụ thực tế:**\nKhi em thả một viên đá vào nước, nước dâng lên vì thể tích của đá chiếm chỗ trong cốc!\n\n💡 **Thí nghiệm:** Em thử lấy cốc nước, thả vài viên đá và quan sát xem!`,
        similarQ: 'Tại sao nước biển mặn?',
        similarA: '**Đáp án:** Nước biển mặn vì có chứa muối (NaCl) và nhiều khoáng chất khác.\n\n**Giải thích:** Muối từ đất đá bị nước mưa rửa trôi vào sông, rồi đổ ra biển. Nước bốc hơi nhưng muối vẫn ở lại, tích tụ lâu năm nên biển ngày càng mặn.',
      },
      {
        content: `🧪 **Đây là kiến thức khoa học thú vị:**\n\n${generateScienceExplanation(question)}\n\n**Nguyên lý:**\nMọi hiện tượng tự nhiên đều có quy luật khoa học!\n\n🎯 **Ghi nhớ:** Quan sát thực tế xung quanh để hiểu sâu hơn nhé!`,
        similarQ: 'Quang hợp là gì?',
        similarA: '**Đáp án:** Quang hợp là quá trình cây xanh dùng ánh sáng mặt trời để tạo ra thức ăn (glucose) từ CO₂ và H₂O.\n\n**Công thức:** 6CO₂ + 6H₂O + ánh sáng → C₆H₁₂O₆ + 6O₂\n\n**Ý nghĩa:** Tạo oxy cho con người và động vật thở!',
      },
    ];

    const selected = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: selected.content,
      similarQuestion: `\n\n💡 **Câu hỏi tương tự:**\n${selected.similarQ}`,
      answer: `\n\n✅ **Đáp án:**\n${selected.similarA}`,
      timestamp: new Date(),
    };
  };

  const generateScienceExplanation = (question: string): string => {
    return `**Giải thích khoa học:**\n\nĐể hiểu vấn đề này, chúng ta cần biết:\n\n1️⃣ **Hiện tượng là gì?**\n2️⃣ **Nguyên nhân/Cơ chế**\n3️⃣ **Ứng dụng thực tế**\n4️⃣ **Ví dụ minh họa**\n\n🔍 **Quan sát:** Khoa học bắt đầu từ sự tò mò và quan sát!`;
  };

  const generateGeneralResponse = (question: string): Message => {
    const responses = [
      {
        content: `💭 **Câu hỏi hay đấy em!**\n\n${generateGeneralExplanation(question)}\n\n✨ Nếu em cần cô giải thích thêm điểm nào, cứ hỏi nhé!`,
        similarQ: 'Làm thế nào để học giỏi tiếng Anh?',
        similarA: '**Gợi ý:**\n1. Học 30 phút mỗi ngày\n2. Xem phim/nghe nhạc tiếng Anh\n3. Thực hành nói với bạn bè\n4. Đọc truyện đơn giản\n5. Không ngại sai, cứ thử!',
      },
      {
        content: `🤔 **Cô hiểu thắc mắc của em:**\n\n${generateGeneralExplanation(question)}\n\n💡 **Tip:** Đặt câu hỏi là bước đầu tiên để học tốt đấy!`,
        similarQ: 'Tại sao phải học nhiều môn?',
        similarA: '**Lý do:**\n- Mỗi môn phát triển kỹ năng khác nhau\n- Giúp em hiểu thế giới toàn diện\n- Phát hiện sở thích, thế mạnh của bản thân\n- Chuẩn bị cho tương lai\n\nKhông có môn nào thừa cả em nhé! 😊',
      },
    ];

    const selected = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: selected.content,
      similarQuestion: `\n\n💡 **Câu hỏi tương tự:**\n${selected.similarQ}`,
      answer: `\n\n✅ **Gợi ý:**\n${selected.similarA}`,
      timestamp: new Date(),
    };
  };

  const generateGeneralExplanation = (question: string): string => {
    return `**Trả lời:**\n\nĐây là một câu hỏi thú vị! Dựa vào những gì em hỏi, cô nghĩ:\n\n📌 **Vấn đề chính:** ${question}\n\n📌 **Phân tích:** Để trả lời chính xác, cô cần hiểu rõ hơn về ngữ cảnh. Em có thể nói cụ thể hơn một chút được không?\n\nVí dụ: Em đang học lớp mấy? Hoặc em gặp khó khăn ở phần nào?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'student',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await analyzeAndRespond(userMessage.content);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Chế độ: Tự tạo câu hỏi 🎯</h3>
            <p className="text-sm text-white/90">Hỏi bất kỳ điều gì, AI Emma sẽ trả lời!</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mr-2">
                <BookOpen className="w-4 h-4" />
              </div>
            )}
            
            <Card
              className={`max-w-[75%] p-3 ${
                message.type === 'student'
                  ? 'bg-blue-500 text-white border-0'
                  : 'bg-white border-2 border-purple-200'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
                {message.similarQuestion && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="text-purple-700 text-sm font-medium">{message.similarQuestion}</div>
                  </div>
                )}
                {message.answer && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-green-800 text-xs">{message.answer}</div>
                  </div>
                )}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </Card>

            {message.type === 'student' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-2">
                👤
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mr-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <Card className="bg-white border-2 border-purple-200 p-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-gray-600 text-sm">Đang suy nghĩ...</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-gray-200 p-3 flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của em (tiếng Việt hoặc tiếng Anh)... 📝"
            className="flex-1 min-h-[80px] max-h-[120px] resize-none text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 h-[80px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 Tip: Nhấn Enter để gửi, Shift + Enter để xuống dòng
        </p>
      </div>
    </div>
  );
}