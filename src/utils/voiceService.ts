/**
 * Voice Service - Dịch vụ giọng nói cho Teacher Emma
 * Đảm bảo luôn sử dụng giọng nữ (female voice) cho text-to-speech
 */

export interface VoiceConfig {
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
}

const DEFAULT_CONFIG: VoiceConfig = {
  lang: 'en-US',
  rate: 0.9, // Tốc độ nói (0.1 - 10, mặc định 1)
  pitch: 1.1, // Cao độ giọng (0 - 2, mặc định 1)
  volume: 1, // Âm lượng (0 - 1)
};

/**
 * Lấy giọng nữ tốt nhất có sẵn trên thiết bị
 */
export function getBestFemaleVoice(lang: string = 'en-US'): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) {
    console.error('Speech Synthesis not supported');
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  
  // Danh sách ưu tiên giọng nữ tiếng Anh
  const preferredFemaleVoices = [
    // Google voices (chất lượng cao)
    'Google US English Female',
    'Google UK English Female',
    
    // Microsoft voices
    'Microsoft Zira Desktop',
    'Microsoft Zira',
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    
    // Apple voices
    'Samantha',
    'Victoria',
    'Karen',
    'Moira',
    'Tessa',
    'Veena',
    
    // Other quality voices
    'Female',
    'en-US-Female',
    'English Female',
  ];

  // Tìm giọng theo thứ tự ưu tiên
  for (const preferredName of preferredFemaleVoices) {
    const voice = voices.find(v => 
      v.name.includes(preferredName) || 
      v.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (voice) {
      console.log('Selected voice:', voice.name);
      return voice;
    }
  }

  // Fallback: Tìm bất kỳ giọng nữ nào
  const femaleVoice = voices.find(v => 
    (v.name.toLowerCase().includes('female') || 
     v.name.toLowerCase().includes('woman') ||
     v.name.toLowerCase().includes('zira') ||
     v.name.toLowerCase().includes('samantha') ||
     v.name.toLowerCase().includes('victoria') ||
     v.name.toLowerCase().includes('aria') ||
     v.name.toLowerCase().includes('jenny')) &&
    v.lang.startsWith(lang.substring(0, 2))
  );

  if (femaleVoice) {
    console.log('Selected fallback female voice:', femaleVoice.name);
    return femaleVoice;
  }

  // Last resort: Giọng mặc định của ngôn ngữ
  const defaultVoice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.substring(0, 2)));
  
  if (defaultVoice) {
    console.log('Selected default voice:', defaultVoice.name);
    return defaultVoice;
  }

  console.warn('No suitable voice found, using browser default');
  return voices[0] || null;
}

/**
 * Nói văn bản với giọng nữ Teacher Emma
 */
export function speakWithEmmaVoice(
  text: string,
  config: Partial<VoiceConfig> = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // Set voice configuration
    utterance.lang = finalConfig.lang;
    utterance.rate = finalConfig.rate;
    utterance.pitch = finalConfig.pitch;
    utterance.volume = finalConfig.volume;

    // Get and set female voice
    const femaleVoice = getBestFemaleVoice(finalConfig.lang);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Event handlers
    utterance.onend = () => {
      console.log('Speech completed');
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Dừng giọng nói hiện tại
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Kiểm tra xem có đang nói không
 */
export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

/**
 * Tạm dừng giọng nói
 */
export function pauseSpeaking(): void {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

/**
 * Tiếp tục giọng nói
 */
export function resumeSpeaking(): void {
  if ('speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

/**
 * Lấy danh sách tất cả giọng nữ có sẵn
 */
export function getAllFemaleVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  
  return voices.filter(voice => 
    voice.name.toLowerCase().includes('female') ||
    voice.name.toLowerCase().includes('woman') ||
    voice.name.toLowerCase().includes('zira') ||
    voice.name.toLowerCase().includes('samantha') ||
    voice.name.toLowerCase().includes('victoria') ||
    voice.name.toLowerCase().includes('aria') ||
    voice.name.toLowerCase().includes('jenny') ||
    voice.name.toLowerCase().includes('karen') ||
    voice.name.toLowerCase().includes('moira') ||
    voice.name.toLowerCase().includes('tessa')
  );
}

/**
 * Load voices (cần gọi khi app khởi động)
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', voices.length);
      resolve(voices);
    };

    // Fallback timeout
    setTimeout(() => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    }, 100);
  });
}

// Load voices when module is imported
if (typeof window !== 'undefined') {
  loadVoices();
}
