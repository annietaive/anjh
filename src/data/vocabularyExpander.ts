import { Vocabulary } from './allLessons';
import { getVocabularyByUnitNumber, hasVocabularyForUnit } from './unitVocabularyDatabase';

// Comprehensive vocabulary database by topic for Global Success THCS
export const vocabularyByTopic: Record<string, Vocabulary[]> = {
  // SCHOOL & EDUCATION
  'school': [
    { word: "calculator", pronunciation: "/ˈkælkjəleɪtər/", meaning: "máy tính", example: "I use a calculator in maths class." },
    { word: "uniform", pronunciation: "/ˈjuːnɪfɔːm/", meaning: "đồng phục", example: "Students wear uniforms to school." },
    { word: "compass", pronunciation: "/ˈkʌmpəs/", meaning: "com-pa", example: "I need a compass for geometry." },
    { word: "notebook", pronunciation: "/ˈnəʊtbʊk/", meaning: "vở ghi chép", example: "Write this in your notebook." },
    { word: "playground", pronunciation: "/ˈpleɪɡraʊnd/", meaning: "sân chơi", example: "We play football in the playground." },
    { word: "library", pronunciation: "/ˈlaɪbrəri/", meaning: "thư viện", example: "I borrow books from the library." },
    { word: "canteen", pronunciation: "/kænˈtiːn/", meaning: "căng-tin", example: "We have lunch in the canteen." },
    { word: "laboratory", pronunciation: "/ləˈbɒrətri/", meaning: "phòng thí nghiệm", example: "We do experiments in the laboratory." },
    { word: "gymnasium", pronunciation: "/dʒɪmˈneɪziəm/", meaning: "phòng tập thể dục", example: "PE lessons are in the gymnasium." },
    { word: "blackboard", pronunciation: "/ˈblækbɔːd/", meaning: "bảng đen", example: "The teacher writes on the blackboard." },
    { word: "timetable", pronunciation: "/ˈtaɪmteɪbl/", meaning: "thời khóa biểu", example: "Check your timetable for today's lessons." },
    { word: "classmate", pronunciation: "/ˈklɑːsmeɪt/", meaning: "bạn cùng lớp", example: "My classmates are very friendly." },
    { word: "headmaster", pronunciation: "/hedˈmɑːstər/", meaning: "hiệu trưởng", example: "The headmaster gave a speech today." },
    { word: "scholarship", pronunciation: "/ˈskɒləʃɪp/", meaning: "học bổng", example: "She won a scholarship to study abroad." },
    { word: "assignment", pronunciation: "/əˈsaɪnmənt/", meaning: "bài tập được giao", example: "I finished my English assignment." },
    { word: "examination", pronunciation: "/ɪɡˌzæmɪˈneɪʃn/", meaning: "kỳ thi", example: "The examination will be next week." },
    { word: "semester", pronunciation: "/sɪˈmestər/", meaning: "học kỳ", example: "This semester started in September." },
    { word: "curriculum", pronunciation: "/kəˈrɪkjələm/", meaning: "chương trình học", example: "The new curriculum includes more science." },
    { word: "certificate", pronunciation: "/səˈtɪfɪkət/", meaning: "chứng chỉ", example: "I received a certificate for my achievement." },
    { word: "attendance", pronunciation: "/əˈtendəns/", meaning: "sự có mặt", example: "Attendance is taken every morning." },
    { word: "principal", pronunciation: "/ˈprɪnsəpl/", meaning: "hiệu trưởng", example: "The principal visited our class today." },
    { word: "locker", pronunciation: "/ˈlɒkər/", meaning: "tủ khóa", example: "I keep my books in my locker." },
    { word: "cafeteria", pronunciation: "/ˌkæfəˈtɪəriə/", meaning: "quán ăn tự phục vụ", example: "We eat lunch in the cafeteria." },
    { word: "auditorium", pronunciation: "/ˌɔːdɪˈtɔːriəm/", meaning: "hội trường", example: "The assembly was held in the auditorium." },
    { word: "dormitory", pronunciation: "/ˈdɔːmətri/", meaning: "ký túc xá", example: "Many students live in the dormitory." },
    { word: "tuition", pronunciation: "/tjuˈɪʃn/", meaning: "học phí", example: "The tuition fee is paid each semester." },
    { word: "diploma", pronunciation: "/dɪˈpləʊmə/", meaning: "bằng cấp", example: "She received her diploma at graduation." },
    { word: "coursework", pronunciation: "/ˈkɔːswɜːk/", meaning: "bài tập khóa học", example: "The coursework includes essays and presentations." },
    { word: "tutorial", pronunciation: "/tjuːˈtɔːriəl/", meaning: "lớp học nhóm nhỏ", example: "We have a tutorial session every Friday." },
    { word: "extracurricular", pronunciation: "/ˌekstrəkəˈrɪkjələr/", meaning: "ngoại khóa", example: "I join many extracurricular activities." }
  ],
  
  // HOUSE & HOME
  'house': [
    { word: "attic", pronunciation: "/ˈætɪk/", meaning: "gác mái", example: "The attic is on the top floor." },
    { word: "basement", pronunciation: "/ˈbeɪsmənt/", meaning: "tầng hầm", example: "We keep old things in the basement." },
    { word: "wardrobe", pronunciation: "/ˈwɔːdrəʊb/", meaning: "tủ quần áo", example: "My clothes are in the wardrobe." },
    { word: "ceiling", pronunciation: "/ˈsiːlɪŋ/", meaning: "trần nhà", example: "The lamp hangs from the ceiling." },
    { word: "drawer", pronunciation: "/drɔːr/", meaning: "ngăn kéo", example: "I put my socks in the drawer." },
    { word: "balcony", pronunciation: "/ˈbælkəni/", meaning: "ban công", example: "We have plants on the balcony." },
    { word: "hallway", pronunciation: "/ˈhɔːlweɪ/", meaning: "hành lang", example: "The hallway leads to the bedrooms." },
    { word: "staircase", pronunciation: "/ˈsteəkeɪs/", meaning: "cầu thang", example: "The staircase is made of wood." },
    { word: "chimney", pronunciation: "/ˈtʃɪmni/", meaning: "ống khói", example: "Smoke comes out of the chimney." },
    { word: "garage", pronunciation: "/ˈɡærɑːʒ/", meaning: "nhà để xe", example: "The car is parked in the garage." },
    { word: "living room", pronunciation: "/ˈlɪvɪŋ ruːm/", meaning: "phòng khách", example: "We watch TV in the living room." },
    { word: "kitchen", pronunciation: "/ˈkɪtʃɪn/", meaning: "nhà bếp", example: "Mom is cooking in the kitchen." },
    { word: "bathroom", pronunciation: "/ˈbɑːθruːm/", meaning: "phòng tắm", example: "The bathroom has a shower and bathtub." },
    { word: "bedroom", pronunciation: "/ˈbedruːm/", meaning: "phòng ngủ", example: "I sleep in my bedroom." },
    { word: "dining room", pronunciation: "/ˈdaɪnɪŋ ruːm/", meaning: "phòng ăn", example: "We have dinner in the dining room." },
    { word: "cupboard", pronunciation: "/ˈkʌbəd/", meaning: "tủ chén", example: "Plates are in the cupboard." },
    { word: "bookshelf", pronunciation: "/ˈbʊkʃelf/", meaning: "giá sách", example: "My books are on the bookshelf." },
    { word: "armchair", pronunciation: "/ˈɑːmtʃeər/", meaning: "ghế bành", example: "Dad sits in his armchair." },
    { word: "sofa", pronunciation: "/ˈsəʊfə/", meaning: "ghế sofa", example: "The sofa is very comfortable." },
    { word: "curtain", pronunciation: "/ˈkɜːtn/", meaning: "rèm cửa", example: "Close the curtains at night." },
    { word: "carpet", pronunciation: "/ˈkɑːpɪt/", meaning: "thảm", example: "There's a red carpet on the floor." },
    { word: "pillow", pronunciation: "/ˈpɪləʊ/", meaning: "gối", example: "I sleep with two pillows." },
    { word: "blanket", pronunciation: "/ˈblæŋkɪt/", meaning: "chăn", example: "I need a warm blanket in winter." },
    { word: "mattress", pronunciation: "/ˈmætrəs/", meaning: "đệm", example: "The mattress is very soft." },
    { word: "mirror", pronunciation: "/ˈmɪrər/", meaning: "gương", example: "I look at myself in the mirror." },
    { word: "lamp", pronunciation: "/læmp/", meaning: "đèn", example: "Turn on the lamp, please." },
    { word: "sink", pronunciation: "/sɪŋk/", meaning: "bồn rửa", example: "Wash your hands in the sink." },
    { word: "fridge", pronunciation: "/frɪdʒ/", meaning: "tủ lạnh", example: "Keep the milk in the fridge." },
    { word: "oven", pronunciation: "/ˈʌvn/", meaning: "lò nướng", example: "Bake the cake in the oven." },
    { word: "dishwasher", pronunciation: "/ˈdɪʃwɒʃər/", meaning: "máy rửa chén", example: "Put the plates in the dishwasher." }
  ],

  // FRIENDS & PERSONALITY
  'friends': [
    { word: "friendly", pronunciation: "/ˈfrendli/", meaning: "thân thiện", example: "My classmates are very friendly." },
    { word: "kind", pronunciation: "/kaɪnd/", meaning: "tử tế", example: "She is a kind person." },
    { word: "generous", pronunciation: "/ˈdʒenərəs/", meaning: "hào phóng", example: "He is generous with his time." },
    { word: "honest", pronunciation: "/ˈɒnɪst/", meaning: "trung thực", example: "An honest friend is a treasure." },
    { word: "patient", pronunciation: "/ˈpeɪʃnt/", meaning: "kiên nhẫn", example: "Teachers need to be patient." },
    { word: "creative", pronunciation: "/kriˈeɪtɪv/", meaning: "sáng tạo", example: "She has a creative mind." },
    { word: "confident", pronunciation: "/ˈkɒnfɪdənt/", meaning: "tự tin", example: "He is confident when speaking English." },
    { word: "shy", pronunciation: "/ʃaɪ/", meaning: "nhút nhát", example: "She is too shy to speak in class." },
    { word: "talkative", pronunciation: "/ˈtɔːkətɪv/", meaning: "nói nhiều", example: "My friend is very talkative." },
    { word: "helpful", pronunciation: "/ˈhelpfl/", meaning: "hay giúp đỡ", example: "He is always helpful to others." },
    { word: "cheerful", pronunciation: "/ˈtʃɪəfl/", meaning: "vui vẻ", example: "She has a cheerful personality." },
    { word: "reliable", pronunciation: "/rɪˈlaɪəbl/", meaning: "đáng tin cậy", example: "He is a reliable friend." },
    { word: "loyal", pronunciation: "/ˈlɔɪəl/", meaning: "trung thành", example: "A loyal friend never betrays you." },
    { word: "sociable", pronunciation: "/ˈsəʊʃəbl/", meaning: "hòa đồng", example: "She is very sociable and has many friends." },
    { word: "polite", pronunciation: "/pəˈlaɪt/", meaning: "lịch sự", example: "Always be polite to your elders." },
    { word: "hardworking", pronunciation: "/ˌhɑːdˈwɜːkɪŋ/", meaning: "chăm chỉ", example: "She is a hardworking student." },
    { word: "lazy", pronunciation: "/ˈleɪzi/", meaning: "lười biếng", example: "Don't be lazy in your studies." },
    { word: "selfish", pronunciation: "/ˈselfɪʃ/", meaning: "ích kỷ", example: "Selfish people only think of themselves." },
    { word: "outgoing", pronunciation: "/ˈaʊtɡəʊɪŋ/", meaning: "hướng ngoại", example: "He has an outgoing personality." },
    { word: "intelligent", pronunciation: "/ɪnˈtelɪdʒənt/", meaning: "thông minh", example: "She is an intelligent student." },
    { word: "curious", pronunciation: "/ˈkjʊəriəs/", meaning: "tò mò", example: "Children are naturally curious." },
    { word: "brave", pronunciation: "/breɪv/", meaning: "dũng cảm", example: "He was brave to speak up." },
    { word: "modest", pronunciation: "/ˈmɒdɪst/", meaning: "khiêm tốn", example: "Despite his success, he remains modest." },
    { word: "ambitious", pronunciation: "/æmˈbɪʃəs/", meaning: "tham vọng", example: "She is ambitious and wants to succeed." },
    { word: "responsible", pronunciation: "/rɪˈspɒnsəbl/", meaning: "có trách nhiệm", example: "He is responsible for his actions." },
    { word: "funny", pronunciation: "/ˈfʌni/", meaning: "hài hước", example: "My friend is very funny." },
    { word: "sensitive", pronunciation: "/ˈsensətɪv/", meaning: "nhạy cảm", example: "She is sensitive to others' feelings." },
    { word: "enthusiastic", pronunciation: "/ɪnˌθjuːziˈæstɪk/", meaning: "nhiệt tình", example: "He is enthusiastic about learning." },
    { word: "stubborn", pronunciation: "/ˈstʌbən/", meaning: "bướng bỉnh", example: "Sometimes he can be quite stubborn." },
    { word: "compassionate", pronunciation: "/kəmˈpæʃənət/", meaning: "thương người", example: "She has a compassionate heart." }
  ],

  // Add more topic categories...
  'neighbourhood': [
    { word: "statue", pronunciation: "/ˈstætʃuː/", meaning: "bức tượng", example: "There's a statue in the park." },
    { word: "cathedral", pronunciation: "/kəˈθiːdrəl/", meaning: "nhà thờ lớn", example: "The cathedral is very old." },
    { word: "memorial", pronunciation: "/məˈmɔːriəl/", meaning: "đài tưởng niệm", example: "We visited the war memorial." },
    { word: "square", pronunciation: "/skweər/", meaning: "quảng trường", example: "People gather in the town square." },
    { word: "avenue", pronunciation: "/ˈævənjuː/", meaning: "đại lộ", example: "The shops are on Fifth Avenue." },
    { word: "bakery", pronunciation: "/ˈbeɪkəri/", meaning: "tiệm bánh", example: "I buy bread from the bakery." },
    { word: "pharmacy", pronunciation: "/ˈfɑːməsi/", meaning: "hiệu thuốc", example: "Get your medicine at the pharmacy." },
    { word: "post office", pronunciation: "/ˈpəʊst ɒfɪs/", meaning: "bưu điện", example: "Send letters at the post office." },
    { word: "suburb", pronunciation: "/ˈsʌbɜːb/", meaning: "ngoại ô", example: "They live in a quiet suburb." },
    { word: "pavement", pronunciation: "/ˈpeɪvmənt/", meaning: "vỉa hè", example: "Walk on the pavement, not the road." },
    { word: "crossroads", pronunciation: "/ˈkrɒsrəʊdz/", meaning: "ngã tư", example: "Turn left at the crossroads." },
    { word: "junction", pronunciation: "/ˈdʒʌŋkʃn/", meaning: "ngã ba đường", example: "There's a traffic light at the junction." },
    { word: "market", pronunciation: "/ˈmɑːkɪt/", meaning: "chợ", example: "Fresh vegetables are sold at the market." },
    { word: "cinema", pronunciation: "/ˈsɪnəmə/", meaning: "rạp chiếu phim", example: "Let's go to the cinema tonight." },
    { word: "museum", pronunciation: "/mjuˈziːəm/", meaning: "viện bảo tàng", example: "The museum has ancient artifacts." },
    { word: "hospital", pronunciation: "/ˈhɒspɪtl/", meaning: "bệnh viện", example: "She works at the hospital." },
    { word: "restaurant", pronunciation: "/ˈrestrɒnt/", meaning: "nhà hàng", example: "We had dinner at a nice restaurant." },
    { word: "café", pronunciation: "/ˈkæfeɪ/", meaning: "quán cà phê", example: "I meet friends at the café." },
    { word: "supermarket", pronunciation: "/ˈsuːpəmɑːkɪt/", meaning: "siêu thị", example: "I shop at the supermarket weekly." },
    { word: "bank", pronunciation: "/bæŋk/", meaning: "ngân hàng", example: "I need to go to the bank." },
    { word: "temple", pronunciation: "/ˈtempl/", meaning: "đền, chùa", example: "The temple is very peaceful." },
    { word: "bridge", pronunciation: "/brɪdʒ/", meaning: "cây cầu", example: "Cross the bridge to get there." },
    { word: "fountain", pronunciation: "/ˈfaʊntən/", meaning: "đài phun nước", example: "There's a beautiful fountain in the square." },
    { word: "skyscraper", pronunciation: "/ˈskaɪskreɪpər/", meaning: "nhà chọc trời", example: "The city has many skyscrapers." },
    { word: "boulevard", pronunciation: "/ˈbuːləvɑːd/", meaning: "đại lộ rộng", example: "Trees line the boulevard." },
    { word: "alley", pronunciation: "/ˈæli/", meaning: "ngõ hẻm", example: "The shop is down that alley." },
    { word: "district", pronunciation: "/ˈdɪstrɪkt/", meaning: "quận", example: "I live in the central district." },
    { word: "neighbourhood", pronunciation: "/ˈneɪbəhʊd/", meaning: "khu phố", example: "It's a friendly neighbourhood." },
    { word: "community", pronunciation: "/kəˈmjuːnəti/", meaning: "cộng đồng", example: "Our community is very welcoming." },
    { word: "pedestrian", pronunciation: "/pəˈdestriən/", meaning: "người đi bộ", example: "This is a pedestrian-only zone." }
  ]
};

// Function to get vocabulary by unit theme/topic
export function getVocabularyForUnit(unitTitle: string, unitNumber: number, grade: number): Vocabulary[] {
  // PRIORITY 1: Always use unit-specific vocabulary from database if available
  if (hasVocabularyForUnit(unitNumber)) {
    const specificVocab = getVocabularyByUnitNumber(unitNumber);
    // Database always returns exactly 30 words per unit - use them directly
    return specificVocab;
  }
  
  // FALLBACK: This should never happen as database covers all 48 units
  // But keep as safety net
  console.warn(`Using fallback vocabulary for unit ${unitNumber} - this should not happen`);
  const title = unitTitle.toLowerCase();
  let vocab: Vocabulary[] = [];
  
  // Match unit title to topic
  if (title.includes('school')) {
    vocab = vocabularyByTopic['school'];
  } else if (title.includes('house') || title.includes('home')) {
    vocab = vocabularyByTopic['house'];
  } else if (title.includes('friend')) {
    vocab = vocabularyByTopic['friends'];
  } else if (title.includes('neighbourhood') || title.includes('city') || title.includes('town')) {
    vocab = vocabularyByTopic['neighbourhood'];
  } else {
    // Generate topic-appropriate vocabulary based on unit number and grade
    vocab = generateVocabularyForUnit(unitTitle, unitNumber, grade);
  }
  
  // Ensure we have at least 30 words
  while (vocab.length < 30) {
    vocab = [...vocab, ...vocabularyByTopic['school'].slice(0, 30 - vocab.length)];
  }
  
  // Return exactly 30 words
  return vocab.slice(0, 30);
}

// Generate vocabulary dynamically for any unit
function generateVocabularyForUnit(title: string, unitNumber: number, grade: number): Vocabulary[] {
  const baseVocab: Vocabulary[] = [];
  const topics = extractTopicsFromTitle(title);
  
  // Collect vocabulary from all matching topics
  topics.forEach(topic => {
    if (vocabularyByTopic[topic]) {
      baseVocab.push(...vocabularyByTopic[topic]);
    }
  });
  
  // If we still don't have enough, add from general categories
  if (baseVocab.length < 30) {
    const generalTopics = ['school', 'friends', 'house', 'neighbourhood'];
    generalTopics.forEach(topic => {
      if (baseVocab.length < 30) {
        baseVocab.push(...vocabularyByTopic[topic].slice(0, 30 - baseVocab.length));
      }
    });
  }
  
  return baseVocab.slice(0, 30);
}

// Extract topics from unit title
function extractTopicsFromTitle(title: string): string[] {
  const titleLower = title.toLowerCase();
  const topics: string[] = [];
  
  // Check for each topic keyword
  Object.keys(vocabularyByTopic).forEach(topic => {
    if (titleLower.includes(topic)) {
      topics.push(topic);
    }
  });
  
  // Add default topic based on common keywords
  if (titleLower.includes('people') || titleLower.includes('family')) {
    topics.push('friends');
  }
  if (titleLower.includes('place') || titleLower.includes('community')) {
    topics.push('neighbourhood');
  }
  if (titleLower.includes('education') || titleLower.includes('study')) {
    topics.push('school');
  }
  
  return topics.length > 0 ? topics : ['school']; // Default to school if no match
}