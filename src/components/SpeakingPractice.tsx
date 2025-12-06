import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Volume2, Brain, CheckCircle, XCircle, TrendingUp, BookOpen, Zap, Award } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Speaking } from '../data/allLessons';
import { speakWithEmmaVoice, loadVoices } from '../utils/voiceService';

interface SpeakingPracticeProps {
  speaking: Speaking;
  grade: number;
}

interface SpeakingFeedback {
  overallScore: number;
  pronunciation: {
    score: number;
    comments: string[];
  };
  grammar: {
    score: number;
    comments: string[];
  };
  fluency: {
    score: number;
    comments: string[];
  };
  vocabulary: {
    score: number;
    comments: string[];
  };
  suggestions: string[];
}

export function SpeakingPractice({ speaking, grade }: SpeakingPracticeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          toast.error('Không nhận được giọng nói. Vui lòng thử lại!');
        } else if (event.error === 'not-allowed') {
          toast.error('Cần cấp quyền microphone để ghi âm!');
        }
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          // Restart if still recording
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Recognition restart failed:', e);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Trình duyệt của bạn không hỗ trợ ghi âm!');
      return;
    }

    setTranscript('');
    setFeedback(null);
    setIsRecording(true);
    setIsListening(true);
    setRecordingTime(0);

    try {
      recognitionRef.current.start();
      toast.success('Bắt đầu ghi âm. Hãy nói theo prompt!');

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setIsListening(false);
    toast.info('Đã dừng ghi âm');
  };

  const analyzeSpeech = () => {
    if (transcript.trim().length < 10) {
      toast.error('Bài nói quá ngắn! Vui lòng nói ít nhất một vài câu.');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis (in production, this would call an actual AI API)
    setTimeout(() => {
      const analysis = performSpeechAnalysis(transcript, speaking, grade);
      setFeedback(analysis);
      setIsAnalyzing(false);
      toast.success('Phân tích hoàn tất!');
    }, 2000);
  };

  const performSpeechAnalysis = (text: string, speakingData: Speaking, gradeLevel: number): SpeakingFeedback => {
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Initialize scores
    let pronunciationScore = 8;
    let grammarScore = 8;
    let fluencyScore = 8;
    let vocabularyScore = 7;

    const pronunciationComments: string[] = [];
    const grammarComments: string[] = [];
    const fluencyComments: string[] = [];
    const vocabularyComments: string[] = [];
    const suggestions: string[] = [];

    // FLUENCY ANALYSIS
    if (wordCount < 30) {
      fluencyScore -= 2;
      fluencyComments.push('❌ Bài nói hơi ngắn. Hãy cố gắng nói đầy đủ hơn.');
      suggestions.push('Luyện tập nói dài hơn, khoảng 50-100 từ cho mỗi prompt.');
    } else if (wordCount > 100) {
      fluencyScore += 1;
      fluencyComments.push('✅ Độ dài bài nói tốt!');
    } else {
      fluencyComments.push('✅ Độ dài bài nói phù hợp.');
    }

    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    if (avgWordsPerSentence < 5) {
      fluencyScore -= 1;
      fluencyComments.push('⚠️ Câu của bạn hơi ngắn. Thử kết hợp câu dài và ngắn.');
    } else if (avgWordsPerSentence > 20) {
      fluencyComments.push('⚠️ Câu có thể hơi dài. Hãy chia thành câu ngắn hơn.');
    }

    // PRONUNCIATION ANALYSIS (based on text patterns)
    const hasCapitalization = /[A-Z]/.test(text);
    if (!hasCapitalization) {
      pronunciationScore -= 1;
      pronunciationComments.push('⚠️ Nên bắt đầu câu bằng chữ hoa.');
    }

    // Check for common pronunciation-related spelling issues
    const commonErrors = [
      { pattern: /\bstudying\b/gi, correct: 'studying' },
      { pattern: /\bi am\b/gi, correct: "I'm" }
    ];

    const lowerText = text.toLowerCase();
    if (lowerText.includes('gonna') || lowerText.includes('wanna')) {
      pronunciationComments.push('⚠️ Trong giao tiếp trang trọng, nên dùng "going to" thay vì "gonna".');
    } else {
      pronunciationScore += 1;
      pronunciationComments.push('✅ Phát âm rõ ràng, không dùng từ viết tắt không phù hợp.');
    }

    // Check if speaking aligns with the prompt
    const promptKeywords = speakingData.prompt.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const transcriptLower = text.toLowerCase();
    let matchedKeywords = 0;
    promptKeywords.forEach(keyword => {
      if (transcriptLower.includes(keyword)) {
        matchedKeywords++;
      }
    });

    if (matchedKeywords < promptKeywords.length / 3) {
      vocabularyScore -= 2;
      vocabularyComments.push('❌ Bài nói chưa tập trung vào chủ đề của prompt.');
      suggestions.push('Đọc kỹ prompt và đảm bảo trả lời đúng trọng tâm.');
    } else {
      vocabularyComments.push('✅ Bài nói liên quan đến chủ đề.');
    }

    // GRAMMAR ANALYSIS
    const grammarIssues = checkGrammar(text, gradeLevel);
    grammarScore -= grammarIssues.penalties;
    grammarComments.push(...grammarIssues.comments);

    // VOCABULARY ANALYSIS
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyRichness = uniqueWords.size / words.length;

    if (vocabularyRichness > 0.7) {
      vocabularyScore += 2;
      vocabularyComments.push('✅ Từ vựng đa dạng và phong phú!');
    } else if (vocabularyRichness < 0.4) {
      vocabularyScore -= 1;
      vocabularyComments.push('⚠️ Từ vựng hơi lặp lại. Hãy sử dụng nhiều từ khác nhau hơn.');
      suggestions.push('Học thêm từ đồng nghĩa để tăng vốn từ vựng.');
    }

    // Check vocabulary level appropriate for grade
    const advancedWords = countAdvancedVocabulary(text);
    if (gradeLevel >= 8 && advancedWords < 2) {
      vocabularyComments.push('💡 Với lớp ' + gradeLevel + ', nên sử dụng thêm từ vựng nâng cao.');
      suggestions.push('Học thêm collocations và idioms phù hợp với trình độ.');
    } else if (advancedWords > 3) {
      vocabularyScore += 1;
      vocabularyComments.push('✅ Sử dụng từ vựng nâng cao tốt!');
    }

    // GRADE-SPECIFIC FEEDBACK
    if (gradeLevel === 6) {
      if (text.match(/present simple/i)) {
        grammarComments.push('✅ Sử dụng thì hiện tại đơn tốt!');
      }
      suggestions.push('Luyện tập thêm với các câu đơn giản về hoạt động hàng ngày.');
    } else if (gradeLevel === 7) {
      if (text.match(/\b(was|were|did|went|had)\b/i)) {
        grammarComments.push('✅ Sử dụng thì quá khứ đơn tốt!');
      }
      suggestions.push('Thử kết hợp nhiều thì khác nhau trong một đoạn hội thoại.');
    } else if (gradeLevel === 8) {
      if (text.match(/\b(have|has)\s+\w+(ed|en)\b/i)) {
        grammarComments.push('✅ Sử dụng thì hiện tại hoàn thành tốt!');
      }
      suggestions.push('Luyện tập với các cấu trúc phức tạp hơn như câu điều kiện.');
    } else if (gradeLevel === 9) {
      if (text.match(/\b(would|could|should)\b/i)) {
        grammarComments.push('✅ Sử dụng modal verbs tốt!');
      }
      suggestions.push('Thử sử dụng câu phức và mệnh đề quan hệ để nâng cao trình độ.');
    }

    // Ensure scores are in valid range
    pronunciationScore = Math.max(0, Math.min(10, pronunciationScore));
    grammarScore = Math.max(0, Math.min(10, grammarScore));
    fluencyScore = Math.max(0, Math.min(10, fluencyScore));
    vocabularyScore = Math.max(0, Math.min(10, vocabularyScore));

    const overallScore = Math.round(
      (pronunciationScore * 0.25 + grammarScore * 0.3 + fluencyScore * 0.25 + vocabularyScore * 0.2) * 10
    );

    return {
      overallScore,
      pronunciation: { score: pronunciationScore, comments: pronunciationComments },
      grammar: { score: grammarScore, comments: grammarComments },
      fluency: { score: fluencyScore, comments: fluencyComments },
      vocabulary: { score: vocabularyScore, comments: vocabularyComments },
      suggestions
    };
  };

  const checkGrammar = (text: string, gradeLevel: number) => {
    let penalties = 0;
    const comments: string[] = [];

    // Check for basic grammar issues
    if (!/^[A-Z]/.test(text)) {
      penalties += 1;
      comments.push('❌ Câu nên bắt đầu bằng chữ in hoa.');
    }

    if (!/[.!?]$/.test(text.trim())) {
      penalties += 0.5;
      comments.push('⚠️ Nên kết thúc câu bằng dấu chấm câu.');
    }

    // Check for subject-verb agreement (simple cases)
    const agreementErrors = [
      /\bI is\b/gi,
      /\bhe are\b/gi,
      /\bshe are\b/gi,
      /\bthey is\b/gi,
      /\bit are\b/gi
    ];

    agreementErrors.forEach(pattern => {
      if (pattern.test(text)) {
        penalties += 1;
        comments.push('❌ Lỗi chủ ngữ - động từ không hòa hợp (subject-verb agreement).');
      }
    });

    // Check for double negatives
    if (/\b(don\'t|doesn\'t|didn\'t)\s+\w+\s+(no|nothing|never)\b/i.test(text)) {
      penalties += 1;
      comments.push('❌ Tránh dùng phủ định kép (double negative).');
    }

    // Check for article usage (basic)
    if (/\ba\s+[aeiou]/i.test(text)) {
      penalties += 0.5;
      comments.push('⚠️ Dùng "an" trước nguyên âm (a/e/i/o/u).');
    }

    // Grade-specific checks
    if (gradeLevel >= 8) {
      // Check for sentence variety
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      if (sentences.length > 2 && sentences.every(s => s.split(/\s+/).length < 8)) {
        comments.push('💡 Thử sử dụng câu phức (complex sentences) để nâng cao trình độ.');
      }
    }

    if (penalties === 0) {
      comments.push('✅ Ngữ pháp cơ bản chính xác!');
    }

    return { penalties, comments };
  };

  const countAdvancedVocabulary = (text: string): number => {
    const advancedWords = [
      'furthermore', 'moreover', 'nevertheless', 'consequently', 'subsequently',
      'significant', 'essential', 'crucial', 'fundamental', 'substantial',
      'enhance', 'facilitate', 'implement', 'demonstrate', 'acquire',
      'profound', 'comprehensive', 'inevitable', 'tremendous', 'magnificent'
    ];

    const lowerText = text.toLowerCase();
    return advancedWords.filter(word => lowerText.includes(word)).length;
  };

  const playExample = async () => {
    try {
      await speakWithEmmaVoice(speaking.example, { lang: 'en-US', rate: 0.85 });
      toast.success('Đang phát ví dụ...');
    } catch (error) {
      toast.error('Trình duyệt không hỗ trợ text-to-speech!');
    }
  };

  const resetPractice = () => {
    setTranscript('');
    setFeedback(null);
    setRecordingTime(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Speaking Prompt */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center gap-2 mb-4">
          <Mic className="w-5 h-5 text-orange-600" />
          <h3 className="text-gray-900">Speaking Prompt</h3>
        </div>
        <p className="text-gray-800 mb-4">{speaking.prompt}</p>
        <div className="flex gap-3">
          <Button onClick={playExample} variant="outline" size="sm">
            <Volume2 className="w-4 h-4 mr-2" />
            Nghe ví dụ
          </Button>
        </div>
      </div>

      {/* Example Response */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <h4 className="text-gray-900">Sample Response</h4>
        </div>
        <p className="text-gray-700 italic leading-relaxed">{speaking.example}</p>
      </div>

      {/* Recording Controls */}
      <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-900">Your Recording</h4>
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-4">
          {!isRecording ? (
            <Button onClick={startRecording} className="bg-orange-600 hover:bg-orange-700">
              <Mic className="w-4 h-4 mr-2" />
              Bắt đầu ghi âm
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Dừng ghi âm
            </Button>
          )}
          
          {transcript && !isRecording && (
            <>
              <Button onClick={analyzeSpeech} disabled={isAnalyzing}>
                <Brain className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Đang phân tích...' : 'Phân tích AI'}
              </Button>
              <Button onClick={resetPractice} variant="outline">
                Làm lại
              </Button>
            </>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 mb-2">📝 Transcript:</p>
            <p className="text-gray-800">{transcript}</p>
            <p className="text-sm text-gray-600 mt-2">Số từ: {transcript.trim().split(/\s+/).length}</p>
          </div>
        )}

        {isListening && !transcript && (
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-orange-600">🎤 Đang lắng nghe... Hãy bắt đầu nói!</p>
          </div>
        )}
      </div>

      {/* AI Feedback */}
      {feedback && (
        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-900">AI Feedback</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl text-green-600">{feedback.overallScore}/100</span>
                <span className="text-sm text-gray-600">điểm</span>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Pronunciation */}
            <div className={`rounded-lg p-4 ${getScoreBgColor(feedback.pronunciation.score)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">Phát âm</span>
                </div>
                <span className={`${getScoreColor(feedback.pronunciation.score)}`}>
                  {feedback.pronunciation.score}/10
                </span>
              </div>
              <div className="space-y-1">
                {feedback.pronunciation.comments.map((comment, idx) => (
                  <p key={idx} className="text-sm text-gray-700">{comment}</p>
                ))}
              </div>
            </div>

            {/* Grammar */}
            <div className={`rounded-lg p-4 ${getScoreBgColor(feedback.grammar.score)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900">Ngữ pháp</span>
                </div>
                <span className={`${getScoreColor(feedback.grammar.score)}`}>
                  {feedback.grammar.score}/10
                </span>
              </div>
              <div className="space-y-1">
                {feedback.grammar.comments.map((comment, idx) => (
                  <p key={idx} className="text-sm text-gray-700">{comment}</p>
                ))}
              </div>
            </div>

            {/* Fluency */}
            <div className={`rounded-lg p-4 ${getScoreBgColor(feedback.fluency.score)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-900">Độ lưu loát</span>
                </div>
                <span className={`${getScoreColor(feedback.fluency.score)}`}>
                  {feedback.fluency.score}/10
                </span>
              </div>
              <div className="space-y-1">
                {feedback.fluency.comments.map((comment, idx) => (
                  <p key={idx} className="text-sm text-gray-700">{comment}</p>
                ))}
              </div>
            </div>

            {/* Vocabulary */}
            <div className={`rounded-lg p-4 ${getScoreBgColor(feedback.vocabulary.score)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900">Từ vựng</span>
                </div>
                <span className={`${getScoreColor(feedback.vocabulary.score)}`}>
                  {feedback.vocabulary.score}/10
                </span>
              </div>
              <div className="space-y-1">
                {feedback.vocabulary.comments.map((comment, idx) => (
                  <p key={idx} className="text-sm text-gray-700">{comment}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {feedback.suggestions.length > 0 && (
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h4 className="text-gray-900">Gợi ý cải thiện</h4>
              </div>
              <div className="space-y-2">
                {feedback.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">💡</span>
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
        <h4 className="text-gray-900 mb-3">💡 Speaking Tips</h4>
        <div className="space-y-2">
          {speaking.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}