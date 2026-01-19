export interface Vocabulary {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  image?: string;
}

export interface Grammar {
  title: string;
  explanation: string;
  examples: string[];
  rule: string;
}

export interface Exercise {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'true-false' | 'word-order' | 'sentence-completion';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface Listening {
  title: string;
  audioScript: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Speaking {
  title: string;
  type: 'conversation' | 'presentation' | 'discussion';
  prompt: string;
  example: string;
  tips: string[];
}

export interface Reading {
  title: string;
  passage: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Writing {
  title: string;
  type: 'essay' | 'email' | 'paragraph' | 'story';
  prompt: string;
  example: string;
  tips: string[];
}

export interface Lesson {
  id: number;
  unit: number;
  title: string;
  description: string;
  level: string;
  grade: 6 | 7 | 8 | 9;
  topics: string[];
  vocabulary: Vocabulary[];
  grammar: Grammar[];
  exercises: Exercise[];
  listening: Listening;
  speaking: Speaking;
  reading: Reading;
  writing: Writing;
}

export const lessons: Lesson[] = [
  // ========== GRADE 6 (12 UNITS) ==========
  {
    id: 1,
    unit: 1,
    title: "My New School",
    description: "Learn about school subjects and school activities",
    level: "Lớp 6",
    grade: 6,
    topics: ["School subjects", "School facilities", "Present simple"],
    vocabulary: [
      { word: "calculator", pronunciation: "/ˈkælkjəleɪtər/", meaning: "máy tính", example: "I use a calculator in maths class." },
      { word: "uniform", pronunciation: "/ˈjuːnɪfɔːm/", meaning: "đồng phục", example: "Students wear uniforms to school." },
      { word: "compass", pronunciation: "/ˈkʌmpəs/", meaning: "com-pa", example: "I need a compass for geometry." },
      { word: "notebook", pronunciation: "/ˈnəʊtbʊk/", meaning: "vở ghi chép", example: "Write this in your notebook." },
      { word: "playground", pronunciation: "/ˈpleɪɡraʊnd/", meaning: "sân chơi", example: "We play football in the playground." }
    ],
    grammar: [
      { title: "Present Simple Tense", explanation: "Use for habits, routines and facts", examples: ["I go to school every day.", "She studies English on Monday."], rule: "S + V(s/es)" },
      { title: "Adverbs of frequency", explanation: "Show how often", examples: ["I always do my homework.", "She never arrives late."], rule: "Subject + adverb + verb" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "She ___ to school by bus every day.", options: ["go", "goes", "going", "went"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "They ___ Math on Monday.", options: ["have", "has", "having", "had"], correctAnswer: 0 }
    ],
    listening: {
      title: "First Day at School",
      audioScript: "Hi, I'm Nam. Today is my first day at the new school. My school is big and modern. It has 30 classrooms, a library, and a large playground. My favorite subject is English.",
      questions: [
        { question: "How many classrooms are there?", options: ["20", "30", "40", "50"], correctAnswer: 1 },
        { question: "What is Nam's favorite subject?", options: ["Math", "English", "Science", "History"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Introduce Your School", 
      type: "presentation", 
      prompt: "Describe your school to a new friend.",
      example: "My school is Nguyen Trai School. It has 25 classrooms and a big library. I study English, Math, Science and many other subjects. My favorite place is the playground.",
      tips: ["Say the school name", "Describe facilities", "Mention your favorite subject or place"]
    },
    reading: { 
      title: "My School Life",
      passage: "I'm a student at Doan Thi Diem School. My school is beautiful with many trees and flowers. There are 800 students and 40 teachers. We study from Monday to Friday. My favorite subject is Music because I love singing.",
      questions: [
        { question: "How many students are there?", options: ["700", "800", "900", "1000"], correctAnswer: 1 },
        { question: "What is the student's favorite subject?", options: ["Math", "English", "Music", "PE"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "My School",
      type: "paragraph",
      prompt: "Write about your school (60-80 words).",
      example: "My school is Tran Phu School. It is in the city center. There are 30 classrooms, a library, and a computer room. I study many subjects like Math, English, and Science. My teachers are friendly and helpful. I love my school very much.",
      tips: ["Introduce your school name and location", "Describe facilities", "Mention subjects you study"]
    }
  },

  {
    id: 2,
    unit: 2,
    title: "My House",
    description: "Learn about rooms and furniture in a house",
    level: "Lớp 6",
    grade: 6,
    topics: ["Rooms", "Furniture", "There is/There are", "Prepositions of place"],
    vocabulary: [
      { word: "attic", pronunciation: "/ˈætɪk/", meaning: "gác mái", example: "The attic is on the top floor." },
      { word: "basement", pronunciation: "/ˈbeɪsmənt/", meaning: "tầng hầm", example: "We keep old things in the basement." },
      { word: "wardrobe", pronunciation: "/ˈwɔːdrəʊb/", meaning: "tủ quần áo", example: "My clothes are in the wardrobe." },
      { word: "ceiling", pronunciation: "/ˈsiːlɪŋ/", meaning: "trần nhà", example: "The lamp hangs from the ceiling." },
      { word: "chest of drawers", pronunciation: "/tʃest əv drɔːz/", meaning: "tủ ngăn kéo", example: "I put my socks in the chest of drawers." }
    ],
    grammar: [
      { title: "There is / There are", explanation: "Describe existence of things", examples: ["There is a TV in the living room.", "There are three bedrooms upstairs."], rule: "There is + singular noun / There are + plural noun" },
      { title: "Prepositions of place", explanation: "Describe location", examples: ["The book is on the table.", "The cat is under the chair.", "The picture is between two windows."], rule: "in, on, at, under, behind, in front of, next to, between" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "There ___ two beds in my room.", options: ["is", "are", "am", "be"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "The sofa is ___ the TV.", options: ["next", "in front of", "between", "at"], correctAnswer: 1 }
    ],
    listening: {
      title: "My Dream House",
      audioScript: "My dream house is a big villa by the sea. It has five bedrooms, a large living room, and a modern kitchen. There is a swimming pool in the garden. My bedroom has a balcony with an ocean view.",
      questions: [
        { question: "Where is the dream house?", options: ["In the city", "In the mountains", "By the sea", "In the forest"], correctAnswer: 2 },
        { question: "What is in the garden?", options: ["A pond", "A swimming pool", "A fountain", "A playground"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Describe Your House",
      type: "conversation",
      prompt: "Tell your friend about your house.",
      example: "I live in a small house. It has a living room, two bedrooms, a kitchen, and a bathroom. My bedroom has a bed, a desk, and a bookshelf. There is a small garden in front of the house.",
      tips: ["Say what rooms you have", "Describe your bedroom", "Mention outdoor space"]
    },
    reading: { 
      title: "Traditional Vietnamese House",
      passage: "Traditional Vietnamese houses are usually made of wood and bamboo. They have a simple design with a living room in the middle and bedrooms on the sides. The kitchen is often separate from the main house. Many houses have a small garden with fruit trees and vegetables.",
      questions: [
        { question: "What are traditional houses made of?", options: ["Stone and brick", "Wood and bamboo", "Glass and steel", "Plastic and metal"], correctAnswer: 1 },
        { question: "Where is the living room?", options: ["At the back", "In the middle", "Upstairs", "In the garden"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "My Bedroom",
      type: "paragraph",
      prompt: "Describe your bedroom (60-80 words).",
      example: "My bedroom is small but cozy. There is a bed next to the window. My desk is opposite the bed. There is a bookshelf on the wall with many books. I have a wardrobe for my clothes. The walls are blue, my favorite color. I love my bedroom!",
      tips: ["Describe furniture and position", "Use prepositions of place", "Say what you like about it"]
    }
  },

  {
    id: 3,
    unit: 3,
    title: "My Friends",
    description: "Learn about personality and appearance",
    level: "Lớp 6",
    grade: 6,
    topics: ["Personality", "Appearance", "Present continuous"],
    vocabulary: [
      { word: "creative", pronunciation: "/kriˈeɪtɪv/", meaning: "sáng tạo", example: "She is very creative with art." },
      { word: "patient", pronunciation: "/ˈpeɪʃnt/", meaning: "kiên nhẫn", example: "My teacher is patient and kind." },
      { word: "curly", pronunciation: "/ˈkɜːli/", meaning: "quăn", example: "He has curly brown hair." },
      { word: "confident", pronunciation: "/ˈkɒnfɪdənt/", meaning: "tự tin", example: "She is confident when speaking English." },
      { word: "personality", pronunciation: "/ˌpɜːsəˈnæləti/", meaning: "tính cách", example: "He has a friendly personality." }
    ],
    grammar: [
      { title: "Present Continuous Tense", explanation: "Actions happening now", examples: ["I am studying now.", "They are playing football.", "She is reading a book."], rule: "S + am/is/are + V-ing" },
      { title: "Present Simple vs Continuous", explanation: "Habits vs actions now", examples: ["I go to school every day. (habit)", "I am going to school now. (now)"], rule: "Simple for routine, Continuous for now" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "Look! The children ___ in the playground.", options: ["play", "plays", "are playing", "played"], correctAnswer: 2 },
      { id: 2, type: "multiple-choice", question: "She ___ a book at the moment.", options: ["read", "reads", "is reading", "reading"], correctAnswer: 2 }
    ],
    listening: {
      title: "My Best Friend",
      audioScript: "My best friend is Lan. She is tall and has long black hair. She always wears glasses. Lan is very kind and helpful. She is good at Math and often helps me with homework. We have been friends since primary school.",
      questions: [
        { question: "What does Lan look like?", options: ["Short with curly hair", "Tall with long hair", "Short with short hair", "Tall with curly hair"], correctAnswer: 1 },
        { question: "What subject is Lan good at?", options: ["English", "Math", "Science", "History"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Describe Your Best Friend",
      type: "presentation",
      prompt: "Tell about your best friend's appearance and personality.",
      example: "My best friend is Minh. He is tall and thin. He has short black hair and brown eyes. Minh is very funny and friendly. He loves playing basketball. We often play together after school.",
      tips: ["Describe appearance first", "Talk about personality", "Mention activities you do together"]
    },
    reading: { 
      title: "Making New Friends",
      passage: "Making new friends is important when you start at a new school. Be friendly and smile at others. Join clubs or sports teams to meet people with similar interests. Don't be shy - introduce yourself! Listen when others talk and show interest in them. Remember, good friends are kind, honest, and supportive.",
      questions: [
        { question: "What should you do to make new friends?", options: ["Be rude", "Be friendly", "Stay alone", "Ignore others"], correctAnswer: 1 },
        { question: "Good friends are NOT:", options: ["Kind", "Honest", "Selfish", "Supportive"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "My Best Friend",
      type: "paragraph",
      prompt: "Write about your best friend (70-90 words).",
      example: "My best friend is Hoa. She is 12 years old. She has long straight hair and big brown eyes. Hoa is very friendly and funny. She makes everyone laugh. She is also smart and always gets good grades. We have been friends for 5 years. We often study together and play badminton on weekends. I am lucky to have such a good friend.",
      tips: ["Describe appearance", "Describe personality", "Say what you do together"]
    }
  },

  {
    id: 4,
    unit: 4,
    title: "My Neighborhood",
    description: "Learn about places and directions in your area",
    level: "Lớp 6",
    grade: 6,
    topics: ["Places", "Directions", "Comparative adjectives"],
    vocabulary: [
      { word: "suburb", pronunciation: "/ˈsʌbɜːb/", meaning: "ngoại ô", example: "I live in the suburbs of the city." },
      { word: "memorial", pronunciation: "/məˈmɔːriəl/", meaning: "đài tưởng niệm", example: "The war memorial is in the center." },
      { word: "statue", pronunciation: "/ˈstætʃuː/", meaning: "tượng", example: "There is a statue in the square." },
      { word: "convenient", pronunciation: "/kənˈviːniənt/", meaning: "tiện lợi", example: "Living here is very convenient." },
      { word: "crowded", pronunciation: "/ˈkraʊdɪd/", meaning: "đông đúc", example: "The market is crowded on weekends." }
    ],
    grammar: [
      { title: "Comparative adjectives", explanation: "Compare two things", examples: ["My house is bigger than yours.", "The city is more crowded than the countryside."], rule: "Short adj + er / more + long adj" },
      { title: "Giving directions", explanation: "Help people find places", examples: ["Turn left at the corner.", "Go straight for 2 blocks.", "It's opposite the bank."], rule: "Turn left/right, go straight, opposite, next to" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "This street is ___ than that one.", options: ["busy", "busier", "busiest", "more busy"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "The museum is ___ the post office.", options: ["next", "in", "opposite", "at"], correctAnswer: 2 }
    ],
    listening: {
      title: "Around My Neighborhood",
      audioScript: "I live in a quiet neighborhood. There is a big park near my house where children play. The supermarket is very convenient, just 5 minutes away. We also have a library, a post office, and a small cinema. I love living here because it's peaceful.",
      questions: [
        { question: "What is the neighborhood like?", options: ["Noisy", "Quiet", "Dirty", "Dangerous"], correctAnswer: 1 },
        { question: "How far is the supermarket?", options: ["2 minutes", "5 minutes", "10 minutes", "15 minutes"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Describe Your Neighborhood",
      type: "conversation",
      prompt: "Tell a visitor about places in your neighborhood.",
      example: "My neighborhood is nice and quiet. There is a park where people exercise in the morning. The supermarket is near my house. There's also a bakery that makes delicious bread. The people here are friendly and helpful.",
      tips: ["Mention important places", "Describe the atmosphere", "Talk about the people"]
    },
    reading: { 
      title: "City Life vs Country Life",
      passage: "Living in the city and countryside are very different. Cities are more crowded and noisier, but they have better facilities like shopping malls, hospitals, and schools. The countryside is quieter and more peaceful. The air is fresher and people are friendlier. However, there are fewer job opportunities in rural areas.",
      questions: [
        { question: "What is better in the city?", options: ["Fresh air", "Facilities", "Peace", "Friendliness"], correctAnswer: 1 },
        { question: "What is the countryside like?", options: ["Crowded", "Noisy", "Peaceful", "Polluted"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "My Neighborhood",
      type: "paragraph",
      prompt: "Describe your neighborhood (70-90 words).",
      example: "I live in a small neighborhood in the suburbs. It is very quiet and peaceful. There are many trees and parks. Near my house, there is a supermarket, a bakery, and a small market. The people here are very friendly. Everyone knows each other. I like my neighborhood because it is safe and convenient. However, it is a bit far from the city center.",
      tips: ["Describe the atmosphere", "Mention places nearby", "Say what you like/dislike"]
    }
  },

  {
    id: 5,
    unit: 5,
    title: "Natural Wonders of the World",
    description: "Learn about famous natural places and travel",
    level: "Lớp 6",
    grade: 6,
    topics: ["Geography", "Travel", "Must/mustn't"],
    vocabulary: [
      { word: "waterfall", pronunciation: "/ˈwɔːtəfɔːl/", meaning: "thác nước", example: "Niagara Falls is a famous waterfall." },
      { word: "desert", pronunciation: "/ˈdezət/", meaning: "sa mạc", example: "The Sahara is the largest desert." },
      { word: "valley", pronunciation: "/ˈvæli/", meaning: "thung lũng", example: "The valley is between two mountains." },
      { word: "cave", pronunciation: "/keɪv/", meaning: "hang động", example: "Son Doong is the world's largest cave." },
      { word: "wonder", pronunciation: "/ˈwʌndər/", meaning: "kỳ quan", example: "Ha Long Bay is a natural wonder." }
    ],
    grammar: [
      { title: "Must/Mustn't", explanation: "Talk about rules and obligations", examples: ["You must wear a helmet.", "You mustn't litter in the park."], rule: "must + V (obligation) / mustn't + V (prohibition)" },
      { title: "Superlative adjectives", explanation: "Show the highest degree", examples: ["Mount Everest is the highest mountain.", "It's the most beautiful place I've ever seen."], rule: "the + adj + est / the most + long adj" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "You ___ take photos in the museum.", options: ["must", "mustn't", "can't", "don't"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "This is ___ place in the country.", options: ["beautiful", "more beautiful", "most beautiful", "the most beautiful"], correctAnswer: 3 }
    ],
    listening: {
      title: "Visiting Ha Long Bay",
      audioScript: "Ha Long Bay is one of Vietnam's most famous tourist destinations. It has over 1,600 islands and islets. The scenery is breathtaking with limestone rocks and emerald water. Visitors can take boat tours, visit caves, and swim. You must try the fresh seafood here!",
      questions: [
        { question: "How many islands are there?", options: ["Over 1,000", "Over 1,600", "Over 2,000", "Over 2,600"], correctAnswer: 1 },
        { question: "What should visitors try?", options: ["Rice", "Seafood", "Noodles", "Fruits"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "A Place You Want to Visit",
      type: "presentation",
      prompt: "Describe a natural wonder you want to visit.",
      example: "I want to visit Phong Nha Cave. It is in Quang Binh province. The cave is very big and beautiful with amazing rock formations. I want to explore it and take lots of photos. It must be an exciting adventure!",
      tips: ["Say where it is", "Describe its features", "Explain why you want to go"]
    },
    reading: { 
      title: "Son Doong Cave",
      passage: "Son Doong Cave in Vietnam is the world's largest cave. It was discovered in 1990 by a local man. The cave is so big that it has its own river, jungle, and climate. It can fit a 40-story building inside! Exploring Son Doong is difficult and expensive, but it's a once-in-a-lifetime experience.",
      questions: [
        { question: "When was Son Doong discovered?", options: ["1980", "1990", "2000", "2010"], correctAnswer: 1 },
        { question: "What makes Son Doong special?", options: ["It's the deepest", "It's the longest", "It's the largest", "It's the oldest"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "A Natural Wonder",
      type: "paragraph",
      prompt: "Write about a natural place in Vietnam (80-100 words).",
      example: "Ha Long Bay is one of the most beautiful places in Vietnam. It is located in Quang Ninh province. There are thousands of limestone islands rising from the emerald water. The scenery is spectacular, especially at sunrise and sunset. Tourists can take boat cruises, visit caves, and enjoy fresh seafood. Ha Long Bay was recognized as a UNESCO World Heritage Site. It is truly a wonder of nature that every Vietnamese person should visit.",
      tips: ["Introduce the place", "Describe its beauty", "Mention activities"]
    }
  },

  {
    id: 6,
    unit: 6,
    title: "Our Tet Holiday",
    description: "Learn about Vietnamese New Year celebrations",
    level: "Lớp 6",
    grade: 6,
    topics: ["Festivals", "Customs", "Should/Shouldn't"],
    vocabulary: [
      { word: "lucky money", pronunciation: "/ˈlʌki ˈmʌni/", meaning: "tiền lì xì", example: "Children receive lucky money during Tet." },
      { word: "blossom", pronunciation: "/ˈblɒsəm/", meaning: "hoa", example: "Peach blossoms are popular at Tet." },
      { word: "ancestor", pronunciation: "/ˈænsestər/", meaning: "tổ tiên", example: "We worship our ancestors during Tet." },
      { word: "fireworks", pronunciation: "/ˈfaɪəwɜːks/", meaning: "pháo hoa", example: "We watch fireworks at midnight." },
      { word: "decorate", pronunciation: "/ˈdekəreɪt/", meaning: "trang trí", example: "We decorate the house with flowers." }
    ],
    grammar: [
      { title: "Should/Shouldn't", explanation: "Give advice", examples: ["You should visit relatives during Tet.", "You shouldn't break things at Tet."], rule: "should/shouldn't + V (advice)" },
      { title: "Some/Any", explanation: "Talk about quantity", examples: ["There are some flowers on the table.", "Are there any apples?"], rule: "some (positive), any (negative/question)" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "We ___ clean the house before Tet.", options: ["should", "shouldn't", "must", "mustn't"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "Do you have ___ banh chung?", options: ["some", "any", "a", "an"], correctAnswer: 1 }
    ],
    listening: {
      title: "Tet Traditions",
      audioScript: "Tet is the most important holiday in Vietnam. Before Tet, families clean their houses and buy new clothes. They also prepare special food like banh chung and pickled onions. On Tet day, people visit relatives and give lucky money to children. Everyone wishes each other good luck and health.",
      questions: [
        { question: "What do people prepare?", options: ["Pizza", "Banh chung", "Hamburger", "Sushi"], correctAnswer: 1 },
        { question: "What do children receive?", options: ["Toys", "Books", "Lucky money", "Clothes"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Tet Celebration",
      type: "conversation",
      prompt: "Describe how your family celebrates Tet.",
      example: "My family celebrates Tet every year. Before Tet, we clean the house and decorate it with flowers. My mother cooks special food. On the first day of Tet, we visit our grandparents. I receive lucky money from adults. We also watch fireworks at night. Tet is my favorite holiday!",
      tips: ["Talk about preparations", "Describe Tet day activities", "Say what you like about Tet"]
    },
    reading: { 
      title: "Tet Around Vietnam",
      passage: "Tet, or Lunar New Year, is Vietnam's biggest festival. In the North, people display peach blossoms, while in the South, apricot blossoms are more common. Traditional food varies by region but includes banh chung, pickled vegetables, and candied fruits. During Tet, people visit pagodas to pray for good luck. The atmosphere is joyful with everyone wearing new clothes and exchanging wishes.",
      questions: [
        { question: "What is Vietnam's biggest festival?", options: ["Christmas", "Tet", "Mid-Autumn", "Hung King"], correctAnswer: 1 },
        { question: "What flower is common in the South?", options: ["Peach", "Apricot", "Rose", "Lotus"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "My Tet Holiday",
      type: "paragraph",
      prompt: "Write about what you do during Tet (80-100 words).",
      example: "Tet is my favorite holiday. Before Tet, my family cleans and decorates the house with kumquat trees and flowers. My mother cooks traditional food like banh chung and spring rolls. On the first day of Tet, I wear new clothes and visit my grandparents. They give me lucky money and good wishes. We also visit relatives and friends. In the evening, we watch fireworks together. I love Tet because the whole family gets together and I can eat delicious food.",
      tips: ["Describe preparations", "Talk about Tet day", "Explain why you like it"]
    }
  },

  {
    id: 7,
    unit: 7,
    title: "Television",
    description: "Learn about TV programs and entertainment",
    level: "Lớp 6",
    grade: 6,
    topics: ["TV programs", "Entertainment", "Question words", "Conjunctions"],
    vocabulary: [
      { word: "documentary", pronunciation: "/ˌdɒkjuˈmentri/", meaning: "phim tài liệu", example: "I enjoy watching documentaries about nature." },
      { word: "channel", pronunciation: "/ˈtʃænl/", meaning: "kênh (TV)", example: "What channel is the football match on?" },
      { word: "remote control", pronunciation: "/rɪˌməʊt kənˈtrəʊl/", meaning: "điều khiển từ xa", example: "Where is the remote control?" },
      { word: "viewer", pronunciation: "/ˈvjuːər/", meaning: "người xem", example: "The program has many viewers." },
      { word: "comedian", pronunciation: "/kəˈmiːdiən/", meaning: "diễn viên hài", example: "He is a famous comedian." }
    ],
    grammar: [
      { title: "Wh-questions", explanation: "Ask for information", examples: ["What do you watch?", "When does it start?", "Why do you like it?"], rule: "Wh-word + do/does + S + V?" },
      { title: "Conjunctions: and, but, so, because", explanation: "Connect ideas", examples: ["I like news and documentaries.", "It's boring but educational.", "I'm tired, so I'll go to bed."], rule: "Use to connect two clauses" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "___ program do you like best?", options: ["What", "When", "Where", "Who"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "I like cartoons ___ they're funny.", options: ["and", "but", "so", "because"], correctAnswer: 3 }
    ],
    listening: {
      title: "My Favorite TV Show",
      audioScript: "My favorite TV show is 'Vietnam's Got Talent'. It's on VTV3 every Sunday evening at 8 PM. The show features talented people performing amazing acts. Some sing, some dance, and others do magic tricks. I watch it with my family every week because it's entertaining and inspiring.",
      questions: [
        { question: "When is the show on?", options: ["Monday", "Friday", "Sunday", "Saturday"], correctAnswer: 2 },
        { question: "Why does the speaker like it?", options: ["It's short", "It's entertaining", "It's free", "It's old"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Talk About TV Programs",
      type: "discussion",
      prompt: "Discuss your favorite TV program with a partner.",
      example: "My favorite TV program is the news. I watch it every evening at 7 PM. It helps me know what's happening in the world. I also like watching sports programs on weekends, especially football matches.",
      tips: ["Say the program name", "When you watch it", "Why you like it"]
    },
    reading: { 
      title: "The Impact of Television",
      passage: "Television is an important part of modern life. It provides entertainment, news, and education. However, watching too much TV can be harmful. It can affect your health, especially your eyes. It also takes time away from other activities like reading, exercising, or spending time with family. Experts recommend watching no more than 2 hours per day and choosing quality programs.",
      questions: [
        { question: "What does TV provide?", options: ["Only news", "Only entertainment", "Entertainment, news and education", "Only education"], correctAnswer: 2 },
        { question: "How much TV should we watch per day?", options: ["No more than 2 hours", "As much as possible", "At least 5 hours", "Never"], correctAnswer: 0 }
      ]
    },
    writing: { 
      title: "My TV Habits",
      type: "paragraph",
      prompt: "Write about your TV watching habits (80-100 words).",
      example: "I watch TV every day after finishing my homework. My favorite programs are cartoons and science documentaries. I usually watch for about one hour in the evening. I like cartoons because they're funny and colorful. Documentaries are interesting and teach me new things. On weekends, I watch movies with my family. However, I try not to watch too much TV because I know it's not good for my eyes. I also need time for other activities like reading and playing sports.",
      tips: ["Say when you watch TV", "Mention favorite programs", "Explain why you like them"]
    }
  },

  {
    id: 8,
    unit: 8,
    title: "Sports and Games",
    description: "Learn about different sports and outdoor activities",
    level: "Lớp 6",
    grade: 6,
    topics: ["Sports", "Games", "Past simple"],
    vocabulary: [
      { word: "tournament", pronunciation: "/ˈtʊənəmənt/", meaning: "giải đấu", example: "Our school won the football tournament." },
      { word: "champion", pronunciation: "/ˈtʃæmpiən/", meaning: "vô địch", example: "He is the national champion." },
      { word: "racket", pronunciation: "/ˈrækɪt/", meaning: "vợt", example: "I need a new tennis racket." },
      { word: "stadium", pronunciation: "/ˈsteɪdiəm/", meaning: "sân vận động", example: "The match is at the national stadium." },
      { word: "goggles", pronunciation: "/ˈɡɒɡlz/", meaning: "kính bơi", example: "Don't forget your swimming goggles." }
    ],
    grammar: [
      { title: "Past Simple Tense", explanation: "Talk about completed actions in the past", examples: ["I played football yesterday.", "She won the race last week."], rule: "S + V2/V-ed (regular) or irregular form" },
      { title: "Past Simple Questions", explanation: "Ask about past events", examples: ["Did you watch the match?", "When did it start?"], rule: "Did + S + V(base)?" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "I ___ badminton yesterday.", options: ["play", "played", "playing", "plays"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "Did she ___ the race?", options: ["win", "won", "wins", "winning"], correctAnswer: 0 }
    ],
    listening: {
      title: "The School Sports Day",
      audioScript: "Last week, our school had a sports day. Students competed in many events like running, swimming, and volleyball. My class won the relay race. I participated in the long jump and came second. It was a fun and exciting day. Everyone cheered for their classmates.",
      questions: [
        { question: "When was the sports day?", options: ["Yesterday", "Last week", "Last month", "Last year"], correctAnswer: 1 },
        { question: "What did the speaker do?", options: ["Swimming", "Running", "Long jump", "Volleyball"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Your Favorite Sport",
      type: "presentation",
      prompt: "Talk about a sport you like to play or watch.",
      example: "My favorite sport is football. I play it with my friends every weekend in the park. I started playing when I was 7 years old. I like football because it's exciting and helps me stay fit. My favorite footballer is Nguyen Quang Hai.",
      tips: ["Say what sport", "When/where you play", "Why you like it"]
    },
    reading: { 
      title: "The Olympics",
      passage: "The Olympic Games are the world's biggest sports event. They happen every four years. Athletes from over 200 countries compete in various sports like running, swimming, gymnastics, and many more. The Olympics promote peace and friendship among nations. Winners receive gold, silver, or bronze medals. The Olympic motto is 'Faster, Higher, Stronger'.",
      questions: [
        { question: "How often are the Olympics held?", options: ["Every year", "Every 2 years", "Every 4 years", "Every 10 years"], correctAnswer: 2 },
        { question: "What is the Olympic motto?", options: ["Faster, Higher, Stronger", "Peace and Love", "Win and Celebrate", "Never Give Up"], correctAnswer: 0 }
      ]
    },
    writing: { 
      title: "A Sports Event",
      type: "paragraph",
      prompt: "Write about a sports event you participated in or watched (80-100 words).",
      example: "Last month, I participated in my school's sports day. I joined the 100-meter race and the long jump. I was very nervous at first, but my friends cheered for me. In the race, I came third and won a bronze medal. I was happy with my result. The long jump didn't go well, but I tried my best. It was a memorable experience. I learned that taking part is more important than winning. Next year, I will train harder.",
      tips: ["Say when and where", "Describe what happened", "Share your feelings"]
    }
  },

  {
    id: 9,
    unit: 9,
    title: "Cities of the World",
    description: "Learn about famous cities and their landmarks",
    level: "Lớp 6",
    grade: 6,
    topics: ["Cities", "Landmarks", "Possessive adjectives and pronouns"],
    vocabulary: [
      { word: "landmark", pronunciation: "/ˈlændmɑːk/", meaning: "địa danh", example: "The Eiffel Tower is a famous landmark." },
      { word: "continent", pronunciation: "/ˈkɒntɪnənt/", meaning: "châu lục", example: "Europe is a continent with many countries." },
      { word: "palace", pronunciation: "/ˈpæləs/", meaning: "cung điện", example: "Buckingham Palace is in London." },
      { word: "modern", pronunciation: "/ˈmɒdn/", meaning: "hiện đại", example: "Singapore is a modern city." },
      { word: "ancient", pronunciation: "/ˈeɪnʃənt/", meaning: "cổ đại", example: "Rome has many ancient buildings." }
    ],
    grammar: [
      { title: "Possessive adjectives", explanation: "Show ownership", examples: ["This is my city.", "Their house is beautiful."], rule: "my, your, his, her, its, our, their + noun" },
      { title: "Possessive pronouns", explanation: "Replace noun showing ownership", examples: ["This book is mine.", "That car is hers."], rule: "mine, yours, his, hers, its, ours, theirs (no noun after)" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "This is ___ favorite city.", options: ["I", "my", "mine", "me"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "Is this book ___?", options: ["you", "your", "yours", "you're"], correctAnswer: 2 }
    ],
    listening: {
      title: "A Tour of Paris",
      audioScript: "Paris is the capital of France. It's called the City of Light. The most famous landmark is the Eiffel Tower, which is 330 meters tall. Paris also has the Louvre Museum, one of the world's largest museums. The city is known for its delicious food, especially croissants and cheese. Millions of tourists visit Paris every year.",
      questions: [
        { question: "What is Paris called?", options: ["City of Love", "City of Light", "City of Dreams", "City of Art"], correctAnswer: 1 },
        { question: "How tall is the Eiffel Tower?", options: ["300 meters", "320 meters", "330 meters", "350 meters"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Describe a City",
      type: "presentation",
      prompt: "Talk about a city you know or want to visit.",
      example: "I want to visit New York City in America. It's a big, modern city with tall buildings. The Statue of Liberty is there. New York is famous for Times Square, Central Park, and Broadway shows. I want to see the city lights at night.",
      tips: ["Say where it is", "Mention famous places", "Explain why you're interested"]
    },
    reading: { 
      title: "London - A Historic City",
      passage: "London is the capital of the United Kingdom. It's a historic city with over 2,000 years of history. Famous landmarks include Big Ben, Tower Bridge, and the London Eye. London has excellent museums like the British Museum, which is free to enter. The city has a diverse population and is a center of culture, finance, and education. You can travel around London easily using the Underground, also called the Tube.",
      questions: [
        { question: "How old is London?", options: ["Over 1,000 years", "Over 2,000 years", "Over 3,000 years", "500 years"], correctAnswer: 1 },
        { question: "What is the Underground also called?", options: ["Metro", "Subway", "Tube", "Train"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "My Dream City",
      type: "paragraph",
      prompt: "Write about a city you would like to visit (90-110 words).",
      example: "My dream city is Tokyo, Japan. I have always wanted to visit this amazing city. Tokyo is modern and traditional at the same time. It has tall skyscrapers and ancient temples. I want to see the famous Shibuya crossing and visit Mount Fuji nearby. Japanese culture is very interesting, and I want to try authentic sushi and ramen. I also want to experience the cherry blossom season when the city is covered in pink flowers. Tokyo is clean, safe, and has excellent public transportation. I hope I can visit Tokyo someday.",
      tips: ["Introduce the city", "Describe what you want to see", "Explain why you want to go"]
    }
  },

  {
    id: 10,
    unit: 10,
    title: "Our Houses in the Future",
    description: "Learn about future technology and houses",
    level: "Lớp 6",
    grade: 6,
    topics: ["Future predictions", "Technology", "Will for future"],
    vocabulary: [
      { word: "solar energy", pronunciation: "/ˈsəʊlər ˈenədʒi/", meaning: "năng lượng mặt trời", example: "Future houses will use solar energy." },
      { word: "wireless", pronunciation: "/ˈwaɪələs/", meaning: "không dây", example: "We have wireless internet." },
      { word: "automatic", pronunciation: "/ˌɔːtəˈmætɪk/", meaning: "tự động", example: "The door is automatic." },
      { word: "robot", pronunciation: "/ˈrəʊbɒt/", meaning: "người máy", example: "Robots will do housework." },
      { word: "appliance", pronunciation: "/əˈplaɪəns/", meaning: "thiết bị", example: "Smart appliances save energy." }
    ],
    grammar: [
      { title: "Future Simple with 'will'", explanation: "Make predictions and promises", examples: ["Houses will be smarter.", "I will help you.", "It won't rain tomorrow."], rule: "S + will + V / S + won't + V" },
      { title: "Might for possibility", explanation: "Talk about possibility", examples: ["We might live on Mars.", "It might rain tonight."], rule: "S + might + V" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "Robots ___ help us in the future.", options: ["will", "are", "do", "can"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "We ___ live under the sea.", options: ["will", "might", "can", "do"], correctAnswer: 1 }
    ],
    listening: {
      title: "Smart Homes",
      audioScript: "In the future, our houses will be very smart. They will use solar panels for electricity. Robots will clean the house and cook meals. You can control everything with your voice or smartphone. The house will know when you're home and adjust the temperature automatically. Windows will clean themselves!",
      questions: [
        { question: "What will provide electricity?", options: ["Coal", "Solar panels", "Wind", "Water"], correctAnswer: 1 },
        { question: "How can you control the house?", options: ["Buttons", "Switches", "Voice", "Remote"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "My Future House",
      type: "presentation",
      prompt: "Describe your ideal house in the future.",
      example: "My future house will be on the beach. It will have big windows with ocean views. I will have a robot helper that cooks and cleans. The house will use solar energy, so it's eco-friendly. There will be a smart garden that waters itself.",
      tips: ["Say where it will be", "Describe special features", "Mention technology"]
    },
    reading: { 
      title: "Living on Mars",
      passage: "Scientists believe that humans might live on Mars in the future. Mars is the most Earth-like planet in our solar system. However, living there will be very challenging. The temperature is extremely cold, around -60°C. There's no oxygen to breathe. Future Mars houses will need to protect people from radiation. They will be underground or inside domes. Water and food will be limited, so people will need to grow their own food.",
      questions: [
        { question: "What is the temperature on Mars?", options: ["Around 0°C", "Around -60°C", "Around -100°C", "Around 20°C"], correctAnswer: 1 },
        { question: "Where will Mars houses be?", options: ["On top of mountains", "Underground or in domes", "Floating in air", "On the surface"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "Future House Description",
      type: "paragraph",
      prompt: "Describe what houses will be like in 50 years (90-110 words).",
      example: "In 50 years, houses will be very different from today. They will be much smarter and more eco-friendly. Solar panels will provide all the electricity needed. Houses will have robots to do all the housework like cooking, cleaning, and gardening. Everything will be controlled by AI - you just need to speak and the house will respond. The walls might change color based on your mood. Houses will use less water and recycle everything. Some houses might even fly or be underwater! Technology will make our lives easier and more comfortable.",
      tips: ["Make predictions with 'will'", "Mention technology", "Talk about environment"]
    }
  },

  {
    id: 11,
    unit: 11,
    title: "Our Greener World",
    description: "Learn about environmental protection",
    level: "Lớp 6",
    grade: 6,
    topics: ["Environment", "Recycling", "Conditional sentences type 1"],
    vocabulary: [
      { word: "recycle", pronunciation: "/ˌriːˈsaɪkl/", meaning: "tái chế", example: "We should recycle plastic bottles." },
      { word: "reusable", pronunciation: "/ˌriːˈjuːzəbl/", meaning: "có thể tái sử dụng", example: "Use reusable bags instead of plastic." },
      { word: "pollution", pronunciation: "/pəˈluːʃn/", meaning: "ô nhiễm", example: "Air pollution is harmful to health." },
      { word: "reduce", pronunciation: "/rɪˈdjuːs/", meaning: "giảm thiểu", example: "We need to reduce waste." },
      { word: "protect", pronunciation: "/prəˈtekt/", meaning: "bảo vệ", example: "We must protect the environment." }
    ],
    grammar: [
      { title: "Conditional Sentences Type 1", explanation: "Talk about real future possibilities", examples: ["If we recycle, we will help the Earth.", "If you don't save water, there won't be enough."], rule: "If + present simple, will + V" },
      { title: "Articles: a, an, the", explanation: "Use articles correctly", examples: ["A tree, an apple, the environment"], rule: "a/an for general, the for specific" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "If we ___ trees, the air will be cleaner.", options: ["plant", "plants", "planted", "planting"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "We should protect ___ environment.", options: ["a", "an", "the", "x"], correctAnswer: 2 }
    ],
    listening: {
      title: "3Rs: Reduce, Reuse, Recycle",
      audioScript: "The 3Rs are important for protecting our environment. Reduce means using less. For example, turn off lights when you leave a room. Reuse means using things again instead of throwing them away. You can reuse plastic bottles as plant pots. Recycle means turning old items into new products. We can recycle paper, plastic, and glass.",
      questions: [
        { question: "What does 'Reduce' mean?", options: ["Using more", "Using less", "Throwing away", "Buying new"], correctAnswer: 1 },
        { question: "What can we recycle?", options: ["Only paper", "Only plastic", "Paper, plastic and glass", "Nothing"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "How to Protect the Environment",
      type: "discussion",
      prompt: "Discuss ways to protect the environment at school.",
      example: "At school, we can protect the environment in many ways. First, we should turn off lights and fans when leaving classrooms. Second, we can use both sides of paper. Third, we should bring reusable water bottles instead of buying plastic ones. We can also plant trees in the school garden.",
      tips: ["Give multiple ideas", "Use 'First, Second, Third'", "Be specific"]
    },
    reading: { 
      title: "Plastic Pollution",
      passage: "Plastic pollution is a serious global problem. Every year, millions of tons of plastic end up in the oceans. Marine animals often eat plastic, thinking it's food, and die. Plastic takes hundreds of years to decompose. To solve this problem, we need to use less plastic. Bring reusable bags when shopping. Choose products with less packaging. Support laws that ban single-use plastics. Every small action helps protect our planet.",
      questions: [
        { question: "What happens to marine animals?", options: ["They enjoy it", "They eat plastic and die", "They ignore it", "They play with it"], correctAnswer: 1 },
        { question: "How long does plastic take to decompose?", options: ["Days", "Weeks", "Months", "Hundreds of years"], correctAnswer: 3 }
      ]
    },
    writing: { 
      title: "Protecting the Environment",
      type: "paragraph",
      prompt: "Write about how you can help protect the environment (90-110 words).",
      example: "I believe everyone can help protect the environment. In my daily life, I try to do several things. First, I always turn off lights and electronics when I don't use them to save electricity. Second, I bring a reusable water bottle to school instead of buying bottled water. Third, I separate trash for recycling at home. My family also uses cloth bags when shopping. On weekends, I sometimes join clean-up activities in the park with my friends. If everyone does these small things, we can make a big difference. Protecting the Earth is our responsibility.",
      tips: ["Give personal examples", "Use 'First, Second, Third'", "Mention family or friends"]
    }
  },

  {
    id: 12,
    unit: 12,
    title: "Robots",
    description: "Learn about robots and their uses",
    level: "Lớp 6",
    grade: 6,
    topics: ["Technology", "Robots", "Could for past ability"],
    vocabulary: [
      { word: "guard", pronunciation: "/ɡɑːd/", meaning: "bảo vệ", example: "Security robots can guard buildings." },
      { word: "recognize", pronunciation: "/ˈrekəɡnaɪz/", meaning: "nhận diện", example: "Robots can recognize faces." },
      { word: "repair", pronunciation: "/rɪˈpeər/", meaning: "sửa chữa", example: "This robot can repair machines." },
      { word: "deliver", pronunciation: "/dɪˈlɪvər/", meaning: "giao hàng", example: "Delivery robots bring food to your door." },
      { word: "artificial intelligence", pronunciation: "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", meaning: "trí tuệ nhân tạo", example: "AI helps robots learn." }
    ],
    grammar: [
      { title: "Could for past ability", explanation: "Talk about what was possible before", examples: ["I could swim when I was 5.", "She couldn't speak English last year."], rule: "S + could/couldn't + V" },
      { title: "Agreement with will", explanation: "Talk about future abilities", examples: ["Robots will be able to do many things.", "They won't be able to feel emotions."], rule: "will be able to + V" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "I ___ ride a bike when I was 6.", options: ["can", "could", "will", "am"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "Robots ___ help us in the future.", options: ["will can", "will be able to", "could", "can be"], correctAnswer: 1 }
    ],
    listening: {
      title: "Types of Robots",
      audioScript: "There are many types of robots today. Home robots can vacuum floors and mow lawns. Medical robots help doctors perform surgery with great precision. Industrial robots work in factories making cars and electronics. Social robots can talk to people and provide companionship. In the future, robots will do even more jobs.",
      questions: [
        { question: "What can home robots do?", options: ["Cook food", "Vacuum floors", "Teach students", "Drive cars"], correctAnswer: 1 },
        { question: "Where do industrial robots work?", options: ["Hospitals", "Schools", "Factories", "Homes"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Robots in Our Lives",
      type: "discussion",
      prompt: "Discuss what robots can and can't do.",
      example: "Robots can do many things today. They can clean houses, build cars, and even perform surgery. However, robots can't feel emotions like humans. They can't be creative or make their own decisions. In my opinion, robots are helpful but they can't replace humans completely.",
      tips: ["Mention what robots can do", "Say what they can't do", "Give your opinion"]
    },
    reading: { 
      title: "The Future of Robots",
      passage: "Robots are becoming more advanced every year. In the future, they will be more intelligent and helpful. AI will allow robots to learn and adapt to new situations. They might become teachers, nurses, or even friends. Some people worry that robots will take human jobs. However, robots will also create new jobs in technology and maintenance. The key is to use robots wisely to improve our lives while ensuring humans remain important.",
      questions: [
        { question: "What will make robots more intelligent?", options: ["Batteries", "AI", "Wheels", "Colors"], correctAnswer: 1 },
        { question: "What do some people worry about?", options: ["Robots are too slow", "Robots will take jobs", "Robots are expensive", "Robots are ugly"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "My Robot Helper",
      type: "paragraph",
      prompt: "Describe a robot you would like to have (90-110 words).",
      example: "I would like to have a homework robot. This robot could help me with difficult math problems and check my grammar in English essays. It would be small and portable, so I can carry it in my backpack. The robot would have a friendly voice and could explain things patiently. However, it wouldn't do all my homework for me - it would just help me understand better. It could also remind me of deadlines and organize my study schedule. Having this robot would make studying easier and more fun. I think this robot will be possible in the near future!",
      tips: ["Describe the robot", "Say what it can do", "Explain why you want it"]
    }
  },

  // ========== GRADE 7 (12 UNITS) ==========
 {
  id: 13,
  unit: 1,
  title: "Hobbies",
  description: "Learn about free-time activities and personal interests",
  level: "Lớp 7",
  grade: 7,
  topics: ["Free-time activities", "Sports", "Collecting things", "Indoor & outdoor hobbies"],

  vocabulary: [
    { word: "collect stamps", pronunciation: "/kəˈlekt stæmps/", meaning: "sưu tầm tem", example: "Many students like to collect stamps." },
    { word: "go camping", pronunciation: "/ɡoʊ ˈkæmpɪŋ/", meaning: "đi cắm trại", example: "We go camping every summer." },
    { word: "play the guitar", pronunciation: "/pleɪ ðə ɡɪˈtɑːr/", meaning: "chơi đàn guitar", example: "My brother can play the guitar very well." },
    { word: "do karate", pronunciation: "/duː kəˈrɑːti/", meaning: "tập karate", example: "She does karate twice a week." },
    { word: "draw pictures", pronunciation: "/drɔː ˈpɪktʃərz/", meaning: "vẽ tranh", example: "I like to draw pictures in my free time." },
    { word: "read comics", pronunciation: "/riːd ˈkɒmɪks/", meaning: "đọc truyện tranh", example: "He often reads comics after school." }
  ],

  grammar: [
    { 
      title: "Like / Love / Enjoy + V-ing", 
      explanation: "Use V-ing to talk about hobbies and interests.", 
      examples: ["I enjoy reading books.", "She loves playing badminton."],
      rule: "S + like/love/enjoy + V-ing"
    },
    { 
      title: "Adverbs of frequency", 
      explanation: "Show how often an action happens.", 
      examples: ["I usually play chess on weekends.", "He never watches TV in the morning."],
      rule: "always/usually/often/sometimes/never + V"
    }
  ],

  exercises: [
    { id: 1, type: "multiple-choice", question: "I ___ reading comics.", options: ["enjoy", "enjoys", "enjoyed", "to enjoy"], correctAnswer: 0 },
    { id: 2, type: "multiple-choice", question: "She ___ goes fishing.", options: ["never", "not", "no", "doesn't"], correctAnswer: 0 }
  ],

  listening: {
    title: "Talking About Hobbies",
    audioScript:
      "Hi, I'm Minh. In my free time, I enjoy playing the guitar. I started this hobby when I was ten. I usually practice for one hour every evening. Playing the guitar helps me relax after school. My sister likes different hobbies. She loves reading comics and drawing pictures. On weekends, we sometimes go camping together because we both like nature.",
    questions: [
      { question: "What hobby does Minh enjoy?", options: ["Drawing", "Playing the guitar", "Fishing", "Reading"], correctAnswer: 1 },
      { question: "What does his sister love?", options: ["Reading comics", "Cycling", "Cooking", "Swimming"], correctAnswer: 0 }
    ]
  },

  speaking: { 
    title: "Talk About Your Hobby",
    type: "conversation",
    prompt: "Describe your favorite hobby and explain why you like it.",
    example:
      "My favorite hobby is playing badminton. I play it with my friends every weekend. It helps me stay healthy and makes me feel relaxed. I started playing badminton two years ago. I also enjoy watching professional matches on TV. In the future, I want to become better and join a local club.",
    tips: ["Mention when you started", "Explain why you like it", "Say how often you do it"]
  },

  reading: { 
    title: "Popular Hobbies",
    passage:
      "People around the world enjoy many different hobbies. Some hobbies are relaxing, like reading books or listening to music. Other hobbies are active, such as playing sports or cycling. Many teenagers enjoy collecting things, like stamps or comic books. Hobbies are important because they help people reduce stress and improve skills. Everyone should have at least one hobby to enjoy in their free time.",
    questions: [
      { question: "Why are hobbies important?", options: ["They make people busy", "They help reduce stress", "They cost a lot of money", "They are for children only"], correctAnswer: 1 },
      { question: "Which hobby is active?", options: ["Reading books", "Listening to music", "Cycling", "Drawing"], correctAnswer: 2 }
    ]
  },

  writing: { 
    title: "My Favorite Hobby",
    type: "paragraph",
    prompt: "Write about your favorite hobby (80-100 words).",
    example:
      "My favorite hobby is reading books. I read almost every day, especially in the evening. Reading helps me relax and learn new things about the world. I enjoy many kinds of books, but adventure stories are my favorite. I started this hobby when I was in grade 5. Whenever I feel stressed, reading makes me feel better. I believe reading is a great hobby because it improves knowledge and imagination.",
    tips: ["Use time phrases", "Explain the benefits", "Describe when you started"]
  }
},
  
  {
    id: 14,
    unit: 2,
    title: "Healthy Living",
    description: "Learn about health problems and staying healthy",
    level: "Lớp 7",
    grade: 7,
    topics: ["Health problems", "Healthy habits", "Advice", "Imperatives"],
    vocabulary: [
      { word: "obesity", pronunciation: "/əʊˈbiːsəti/", meaning: "béo phì", example: "Obesity is a serious health problem." },
      { word: "allergic", pronunciation: "/əˈlɜːdʒɪk/", meaning: "dị ứng", example: "I am allergic to seafood." },
      { word: "vitamin", pronunciation: "/ˈvɪtəmɪn/", meaning: "vitamin", example: "Fruit has a lot of vitamins." },
      { word: "sunburn", pronunciation: "/ˈsʌnbɜːn/", meaning: "cháy nắng", example: "Wear sunscreen to avoid sunburn." },
      { word: "flu", pronunciation: "/fluː/", meaning: "cúm", example: "I caught the flu last week." },
      { word: "disease", pronunciation: "/dɪˈziːz/", meaning: "bệnh tật", example: "Exercise helps prevent disease." }
    ],
    grammar: [
      { title: "Imperatives", explanation: "Give advice or commands", examples: ["Eat more vegetables.", "Don't stay up late.", "Exercise regularly."], rule: "V (base form) / Don't + V" },
      { title: "Compound sentences", explanation: "Join two ideas", examples: ["I eat healthy food, and I exercise daily.", "She was tired, so she went to bed early."], rule: "Use: and, or, but, so" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "___ more water every day.", options: ["Drinks", "Drink", "Drinking", "To drink"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "I was sick, ___ I stayed home.", options: ["and", "but", "so", "or"], correctAnswer: 2 }
    ],
    listening: {
      title: "Healthy Living Tips",
      audioScript: "To stay healthy, you should follow these tips. First, eat a balanced diet with lots of fruits and vegetables. They provide vitamins and minerals. Second, exercise at least 30 minutes a day. This keeps your body strong. Third, get enough sleep - about 8 hours per night. Fourth, drink plenty of water, at least 2 liters daily. Finally, avoid junk food and soft drinks. They have too much sugar and fat.",
      questions: [
        { question: "How long should we exercise each day?", options: ["15 minutes", "30 minutes", "1 hour", "2 hours"], correctAnswer: 1 },
        { question: "How much sleep do we need?", options: ["5 hours", "6 hours", "7 hours", "8 hours"], correctAnswer: 3 }
      ]
    },
    speaking: { 
      title: "Give Health Advice",
      type: "conversation",
      prompt: "Your friend has a cold. Give him/her advice.",
      example: "You should stay in bed and rest. Don't go to school when you're sick. Drink warm water with honey - it helps your throat. Eat soup and fruit for vitamins. Take some medicine if necessary. Don't go out in cold weather. You'll feel better in a few days.",
      tips: ["Use 'should/shouldn't'", "Give specific advice", "Be caring and supportive"]
    },
    reading: { 
      title: "Healthy Lifestyle Habits",
      passage: "Having healthy habits is important for everyone, especially teenagers. You should eat three balanced meals a day. Don't skip breakfast - it gives you energy for the day. Include protein, carbohydrates, fruits, and vegetables in your diet. Exercise regularly to stay fit and maintain a healthy weight. Good activities include swimming, cycling, and playing sports. Sleep at least 8 hours every night because your body needs rest to grow. Limit screen time and spend more time outdoors. Avoid junk food, soft drinks, and smoking. Wash your hands frequently to prevent infections. If you follow these habits, you'll live a healthier, happier life.",
      questions: [
        { question: "Which meal should you NOT skip?", options: ["Lunch", "Dinner", "Breakfast", "Snack"], correctAnswer: 2 },
        { question: "Why is sleep important?", options: ["To dream", "Body needs rest to grow", "To waste time", "To avoid work"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "How to Stay Healthy",
      type: "paragraph",
      prompt: "Write about your healthy habits (90-110 words).",
      example: "I try to maintain healthy habits every day. For breakfast, I usually eat bread, eggs, and drink milk. At lunch and dinner, I eat rice with vegetables, fish, or chicken. I love fruits, especially apples and bananas. I exercise three times a week by playing football with my friends. This helps me stay fit and strong. I also try to sleep before 10 PM every night to get 8 hours of sleep. On weekends, I go cycling in the park. I avoid eating too much fast food or drinking soda. I also wash my hands before meals. These habits help me feel energetic and healthy.",
      tips: ["Describe eating habits", "Mention exercise routine", "Talk about sleep"]
    }
  },

  {
    id: 15,
    unit: 3,
    title: "Community Service",
    description: "Learn about helping the community and volunteer work",
    level: "Lớp 7",
    grade: 7,
    topics: ["Volunteer activities", "Community help", "Past simple and present perfect"],
    vocabulary: [
      { word: "volunteer", pronunciation: "/ˌvɒlənˈtɪər/", meaning: "tình nguyện viên", example: "She works as a volunteer at the hospital." },
      { word: "donate", pronunciation: "/dəʊˈneɪt/", meaning: "quyên góp", example: "We donate old clothes to charity." },
      { word: "community", pronunciation: "/kəˈmjuːnəti/", meaning: "cộng đồng", example: "Our community is very friendly." },
      { word: "charity", pronunciation: "/ˈtʃærəti/", meaning: "từ thiện", example: "The charity helps poor children." },
      { word: "homeless", pronunciation: "/ˈhəʊmləs/", meaning: "vô gia cư", example: "We provide food for homeless people." },
      { word: "disabled", pronunciation: "/dɪsˈeɪbld/", meaning: "khuyết tật", example: "The center supports disabled children." }
    ],
    grammar: [
      { title: "Present Perfect Tense", explanation: "Actions from past with present result", examples: ["I have volunteered for 2 years.", "She has helped many people.", "Have you donated blood?"], rule: "S + have/has + V3/V-ed" },
      { title: "Past Simple vs Present Perfect", explanation: "Specific past time vs unspecified time", examples: ["I volunteered last year. (specific)", "I have volunteered many times. (general)"], rule: "Past simple: specific time, Present perfect: unspecified" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "I ___ many old people this year.", options: ["help", "helped", "have helped", "helping"], correctAnswer: 2 },
      { id: 2, type: "multiple-choice", question: "She ___ clothes to charity last month.", options: ["donate", "donated", "has donated", "donating"], correctAnswer: 1 }
    ],
    listening: {
      title: "Volunteering at the Orphanage",
      audioScript: "Last Saturday, our class went to the orphanage to do volunteer work. We brought toys, books, and clothes for the children. Some students taught the kids to draw and paint. Others played games with them. We also helped clean the playground and plant flowers in the garden. The children were very happy. It was a meaningful experience. We plan to visit them again next month.",
      questions: [
        { question: "When did they go to the orphanage?", options: ["Last Sunday", "Last Saturday", "Last Friday", "Yesterday"], correctAnswer: 1 },
        { question: "What did some students do?", options: ["Cooked food", "Taught drawing", "Sang songs", "Danced"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Talk About Volunteer Work",
      type: "presentation",
      prompt: "Describe a volunteer activity you have done or want to do.",
      example: "I have volunteered at the local library for six months. Every Saturday afternoon, I help organize books and clean the reading area. I also read stories to young children. It's very rewarding to see them enjoy the books. In the future, I want to volunteer at a nursing home to spend time with elderly people.",
      tips: ["Say what volunteer work", "Describe what you do", "Explain why it's important"]
    },
    reading: { 
      title: "The Benefits of Volunteering",
      passage: "Volunteering is good for both the community and the volunteer. When you volunteer, you help people in need and make your community better. You can volunteer in many ways: teaching children, helping the elderly, cleaning the environment, or donating blood. Volunteering also benefits you personally. It helps you develop new skills and make friends. You learn to be more responsible and caring. Many studies show that volunteers are happier and healthier than people who don't volunteer. Even a few hours of volunteer work each month can make a big difference.",
      questions: [
        { question: "Who benefits from volunteering?", options: ["Only the community", "Only the volunteer", "Both", "Neither"], correctAnswer: 2 },
        { question: "What do studies show about volunteers?", options: ["They're sad", "They're happier", "They're tired", "They're busy"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "A Volunteer Experience",
      type: "paragraph",
      prompt: "Write about a volunteer activity you participated in (100-120 words).",
      example: "Last summer, I participated in a volunteer program in my neighborhood. Our group helped clean the local park. We collected trash, planted trees, and painted the playground equipment. There were about 30 volunteers, mostly students and young people. We worked from 7 AM to 11 AM for three days. It was hard work, but we felt proud when we finished. The park looked much better and cleaner. The local people thanked us and appreciated our effort. This experience taught me that even small actions can improve our community. I learned the importance of teamwork and caring for the environment. I plan to join more volunteer activities in the future.",
      tips: ["Say what you did", "Describe the experience", "Share what you learned"]
    }
  },

  {
    id: 16,
    unit: 4,
    title: "Music and Arts",
    description: "Learn about different types of music and arts",
    level: "Lớp 7",
    grade: 7,
    topics: ["Music genres", "Paintings", "Comparisons"],
    vocabulary: [
      { word: "orchestra", pronunciation: "/ˈɔːkɪstrə/", meaning: "dàn nhạc", example: "The orchestra played beautifully." },
      { word: "composer", pronunciation: "/kəmˈpəʊzər/", meaning: "nhà soạn nhạc", example: "Mozart was a famous composer." },
      { word: "portrait", pronunciation: "/ˈpɔːtrət/", meaning: "tranh chân dung", example: "This is a portrait of my grandmother." },
      { word: "sculpture", pronunciation: "/ˈskʌlptʃər/", meaning: "điêu khắc", example: "The sculpture is made of stone." },
      { word: "exhibition", pronunciation: "/ˌeksɪˈbɪʃn/", meaning: "triển lãm", example: "There's an art exhibition at the museum." },
      { word: "gallery", pronunciation: "/ˈɡæləri/", meaning: "phòng trưng bày", example: "We visited the national gallery." }
    ],
    grammar: [
      { title: "(Not) as...as comparisons", explanation: "Compare similar or different things", examples: ["Pop music is as popular as rock.", "Jazz is not as loud as rock music."], rule: "as + adj + as / not as + adj + as" },
      { title: "Comparison with different from", explanation: "Show differences", examples: ["Classical music is different from pop music.", "This painting is quite different from that one."], rule: "S + be + different from + N" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "This song is not ___ good as that one.", options: ["so", "as", "than", "to"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "Rock music is ___ from classical music.", options: ["difference", "differ", "different", "differently"], correctAnswer: 2 }
    ],
    listening: {
      title: "Vietnamese Traditional Music",
      audioScript: "Vietnamese traditional music is very diverse. In the North, we have Quan ho folk songs, which are sung by pairs of male and female singers. In Central Vietnam, Hue royal court music is famous for its elegance. The South is known for Don ca tai tu, often performed at festivals. Traditional instruments include the dan tranh (zither), dan bau (monochord), and trong (drums). This music is an important part of our cultural heritage.",
      questions: [
        { question: "What is famous in the North?", options: ["Quan ho", "Hue music", "Don ca tai tu", "Rock music"], correctAnswer: 0 },
        { question: "What is the dan tranh?", options: ["A drum", "A zither", "A flute", "A guitar"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Your Favorite Music",
      type: "discussion",
      prompt: "Talk about the type of music you like and why.",
      example: "I really enjoy pop music. It's energetic and makes me feel happy. My favorite singer is Taylor Swift. I like her songs because they have meaningful lyrics and catchy melodies. I listen to music every day, especially when I'm studying or exercising. I think music is important because it can express our emotions.",
      tips: ["Say what type of music", "Mention favorite artists", "Explain why you like it"]
    },
    reading: { 
      title: "The Importance of Arts in Education",
      passage: "Arts education is essential for students' development. Learning music, painting, or drama helps develop creativity and self-expression. Students who study arts often perform better in other subjects too. Music training improves memory and concentration. Drawing and painting enhance visual-spatial skills. Drama builds confidence and communication skills. Despite these benefits, many schools reduce arts programs due to budget cuts. However, research shows that arts education is not a luxury but a necessity. It prepares students for the future by teaching them to think creatively and work collaboratively.",
      questions: [
        { question: "What does music training improve?", options: ["Only memory", "Memory and concentration", "Only concentration", "Nothing"], correctAnswer: 1 },
        { question: "Why do schools reduce arts programs?", options: ["Students don't like it", "Teachers are busy", "Budget cuts", "It's too easy"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "Music and Arts in My Life",
      type: "essay",
      prompt: "Write about the role of music or arts in your life (120-140 words).",
      example: "Music plays an important role in my life. I have been learning to play the piano for three years, and I really enjoy it. Playing music helps me relax after a long day at school. It's like meditation for me. I practice for about 30 minutes every evening. My favorite pieces to play are classical music by Chopin and Beethoven. I also enjoy listening to many types of music, from pop to rock to traditional Vietnamese songs. Music helps me express my emotions when I can't find the words. It makes me happy when I'm sad and energizes me when I'm tired. I believe music education should be available to all students because it develops creativity and discipline. In the future, I hope to join the school orchestra and perform at concerts.",
      tips: ["Introduce your interest", "Describe what you do", "Explain the benefits"]
    }
  },

  {
    id: 17,
    unit: 5,
    title: "Food and Drink",
    description: "Learn about traditional Vietnamese cuisine",
    level: "Lớp 7",
    grade: 7,
    topics: ["Food", "Cooking", "Countable and uncountable nouns"],
    vocabulary: [
      { word: "ingredient", pronunciation: "/ɪnˈɡriːdiənt/", meaning: "nguyên liệu", example: "What ingredients do we need for pho?" },
      { word: "recipe", pronunciation: "/ˈresəpi/", meaning: "công thức nấu ăn", example: "Can you give me the recipe for spring rolls?" },
      { word: "spicy", pronunciation: "/ˈspaɪsi/", meaning: "cay", example: "Vietnamese food can be very spicy." },
      { word: "flavor", pronunciation: "/ˈfleɪvər/", meaning: "hương vị", example: "This dish has a unique flavor." },
      { word: "fragrant", pronunciation: "/ˈfreɪɡrənt/", meaning: "thơm", example: "The soup smells fragrant." },
      { word: "cuisine", pronunciation: "/kwɪˈziːn/", meaning: "ẩm thực", example: "Vietnamese cuisine is world-famous." }
    ],
    grammar: [
      { title: "Quantifiers: some, any, much, many", explanation: "Talk about quantity", examples: ["How much sugar?", "How many tomatoes?", "There aren't any onions."], rule: "much/a little + uncountable, many/a few + countable" },
      { title: "A/An/Some/Any", explanation: "Talk about nouns", examples: ["I need an egg.", "There's some rice.", "Do you have any milk?"], rule: "a/an + singular countable, some/any + plural/uncountable" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "How ___ water do you need?", options: ["many", "much", "a few", "any"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "There are ___ apples in the basket.", options: ["much", "a little", "some", "any"], correctAnswer: 2 }
    ],
    listening: {
      title: "Making Vietnamese Spring Rolls",
      audioScript: "Today I'll show you how to make Vietnamese spring rolls, or nem ran. You'll need some rice paper, minced pork, shrimp, vermicelli noodles, and vegetables like carrots and cabbage. First, soak the vermicelli in water. Then, mix all ingredients in a bowl with some fish sauce and pepper. Put a spoonful of the mixture on the rice paper and roll it tightly. Finally, deep-fry the rolls until they're golden brown. Serve with fish sauce and fresh vegetables.",
      questions: [
        { question: "What is the Vietnamese name for spring rolls?", options: ["Banh mi", "Nem ran", "Pho", "Bun"], correctAnswer: 1 },
        { question: "How should you cook the rolls?", options: ["Boil them", "Steam them", "Deep-fry them", "Grill them"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Describe a Vietnamese Dish",
      type: "presentation",
      prompt: "Talk about your favorite Vietnamese food.",
      example: "My favorite Vietnamese dish is pho. It's a noodle soup with beef or chicken. The broth is very flavorful because it's cooked with bones, herbs, and spices for many hours. Pho is usually served with fresh herbs, lime, and chili. Vietnamese people often eat pho for breakfast. It's healthy, delicious, and makes me feel warm and satisfied.",
      tips: ["Describe the dish", "Mention ingredients", "Say when people eat it"]
    },
    reading: { 
      title: "Vietnamese Cuisine - A Cultural Treasure",
      passage: "Vietnamese cuisine is one of the healthiest and most diverse in the world. It emphasizes fresh ingredients, minimal use of oil, and a balance of flavors - sweet, sour, salty, spicy, and bitter. Rice is the staple food, accompanied by fish sauce, fresh herbs, and vegetables. Famous dishes include pho (noodle soup), banh mi (sandwich), spring rolls, and bun cha (grilled pork with noodles). Each region has its own specialties. Northern food is milder, Central cuisine is spicier, and Southern dishes are sweeter. Vietnamese food is not just about eating; it's about sharing and family bonding. Meals are often communal, with everyone sharing dishes.",
      questions: [
        { question: "How many flavors does Vietnamese cuisine balance?", options: ["Three", "Four", "Five", "Six"], correctAnswer: 2 },
        { question: "Which region has the spiciest food?", options: ["North", "Central", "South", "All the same"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "A Traditional Vietnamese Dish",
      type: "paragraph",
      prompt: "Describe how to make a simple Vietnamese dish (120-140 words).",
      example: "Banh mi is a popular Vietnamese sandwich that's easy to make. First, you need a crispy baguette, which is lighter than French bread. Cut it lengthwise and spread some butter or pate inside. Then add your choice of filling - it can be grilled pork, chicken, or tofu for vegetarians. Next, add fresh vegetables like cucumber, pickled carrots, daikon, and cilantro. Don't forget to add some chili and a little soy sauce for flavor. The key to a good banh mi is the combination of crispy bread, savory meat, fresh vegetables, and spicy-sweet sauce. It's a perfect balance of textures and flavors. Banh mi is cheap, convenient, and nutritious. You can find it everywhere in Vietnam, from street vendors to fancy restaurants. It's truly a Vietnamese treasure!",
      tips: ["List ingredients", "Describe preparation steps", "Mention taste and texture"]
    }
  },

  {
  id: 18,
  unit: 6,
  title: "A Visit to a School",
  description: "Learn about school facilities and school life",
  level: "Lớp 7",
  grade: 7,
  topics: ["School visit", "Facilities", "Descriptions"],
  vocabulary: [
    { word: "principal", pronunciation: "/ˈprɪnsəpl/", meaning: "hiệu trưởng", example: "The principal welcomed us at the school gate." },
    { word: "laboratory", pronunciation: "/ˈlæbrətɔːri/", meaning: "phòng thí nghiệm", example: "The science laboratory is modern and well-equipped." },
    { word: "canteen", pronunciation: "/kænˈtiːn/", meaning: "nhà ăn", example: "We had lunch in the school canteen." },
    { word: "playground", pronunciation: "/ˈpleɪɡraʊnd/", meaning: "sân chơi", example: "Students were playing on the playground." },
    { word: "auditorium", pronunciation: "/ˌɔːdɪˈtɔːriəm/", meaning: "hội trường", example: "The school auditorium can hold 500 students." },
    { word: "corridor", pronunciation: "/ˈkɒrɪdɔːr/", meaning: "hành lang", example: "The corridors were clean and bright." }
  ],
  grammar: [
    { 
      title: "Descriptive Sentences (There is / There are)",
      explanation: "Used to describe the existence of things",
      examples: ["There is a big library in the school.", "There are many classrooms on the second floor."],
      rule: "There is + singular noun; There are + plural noun"
    },
    { 
      title: "Adjectives for Description",
      explanation: "Use adjectives to describe facilities or impressions",
      examples: ["The classroom is spacious.", "The playground is very large."],
      rule: "Adj + noun / be + adjective"
    }
  ],
  exercises: [
    { id: 1, type: "multiple-choice", question: "There ___ a big playground behind the school.", options: ["is", "are", "be", "have"], correctAnswer: 0 },
    { id: 2, type: "multiple-choice", question: "The science lab is very ___.", options: ["modern", "modernly", "modernest", "moderning"], correctAnswer: 0 }
  ],
  listening: {
    title: "A Visit to Greenfield Secondary School",
    audioScript: "Last Friday, our class visited Greenfield Secondary School. When we arrived, the principal welcomed us warmly at the gate. First, we toured the classrooms. They were clean, bright, and spacious. Next, we visited the science laboratory where students were doing experiments. Then, we went to the library. It was quiet and full of books. After that, we had lunch in the canteen. In the afternoon, we watched a performance in the school auditorium. At the end of the visit, we took photos on the playground. It was an exciting and memorable day for all of us.",
    questions: [
      { question: "Where did the class have lunch?", options: ["In the library", "In the canteen", "In the laboratory", "In the auditorium"], correctAnswer: 1 },
      { question: "What did they do in the afternoon?", options: ["Play sports", "Visit classrooms", "Watch a performance", "Go home early"], correctAnswer: 2 }
    ]
  },
  speaking: { 
    title: "Talk About a School Visit",
    type: "presentation",
    prompt: "Describe a school you have visited or want to visit.",
    example: "Last month, I visited Nguyen Du Secondary School. The school was large and very clean. I liked the library because it had many English books. The science lab was modern, and students were doing interesting experiments. The teachers were friendly and helpful. I enjoyed walking around the playground and talking with students there. It was a memorable visit that helped me learn more about school life.",
    tips: ["Describe the facilities", "Say what you saw and did", "Give your feelings or impressions"]
  },
  reading: { 
    title: "A Modern School",
    passage: "Sunrise Secondary School is one of the most modern schools in the city. It has three main buildings with more than forty classrooms. Each classroom is bright and well-equipped with projectors and computers. The school also has a large library, a modern science laboratory, and an art room. Students enjoy spending time on the playground during breaks. The school encourages creativity, teamwork, and independent learning. Many visitors come to Sunrise Secondary School every year to learn about its teaching methods and advanced facilities.",
    questions: [
      { question: "How many classrooms does the school have?", options: ["Less than 20", "About 30", "More than 40", "Only 10"], correctAnswer: 2 },
      { question: "What does the school encourage?", options: ["Sports only", "Creativity and teamwork", "Silent study only", "Uniform design"], correctAnswer: 1 }
    ]
  },
  writing: { 
    title: "A Visit to a School",
    type: "paragraph",
    prompt: "Write about a visit to a school and describe what impressed you (120–140 words).",
    example: "Last week, I visited Hoa Sen Secondary School with my class. The school was bigger and more modern than I expected. The first place we visited was the library. It had thousands of books and many computers for students to use. I was also impressed by the science laboratory because it was very clean and well-equipped. The teachers were friendly and explained everything clearly. During break time, we walked around the playground, where many students were playing games. The school felt lively and welcoming. This visit helped me understand how modern schools work and inspired me to study harder. It was a memorable experience that I will never forget.",
    tips: ["Describe places you saw", "Explain what impressed you", "Give your feelings"]
  }
},

  {
  id: 19,
  unit: 7,
  title: "Traffic",
  description: "Learn about traffic rules and road safety",
  level: "Lớp 7",
  grade: 7,
  topics: ["Traffic signs", "Transportation", "Road safety", "Distance"],
  vocabulary: [
    { word: "traffic jam", pronunciation: "/ˈtræfɪk dʒæm/", meaning: "kẹt xe", example: "There was a traffic jam during rush hour." },
    { word: "crosswalk", pronunciation: "/ˈkrɒswɔːk/", meaning: "vạch sang đường", example: "Always use the crosswalk when crossing the street." },
    { word: "helmet", pronunciation: "/ˈhelmɪt/", meaning: "mũ bảo hiểm", example: "You must wear a helmet when riding a motorbike." },
    { word: "speed limit", pronunciation: "/spiːd ˈlɪmɪt/", meaning: "giới hạn tốc độ", example: "The speed limit here is 50 km/h." },
    { word: "pedestrian", pronunciation: "/pəˈdestriən/", meaning: "người đi bộ", example: "Drivers should slow down for pedestrians." },
    { word: "intersection", pronunciation: "/ˌɪntəˈsekʃən/", meaning: "ngã tư", example: "Be careful when driving through intersections." }
  ],
  grammar: [
    { 
      title: "Modal Verbs for Obligation (must / have to)",
      explanation: "Used to express rules or strong obligation",
      examples: ["You must wear a helmet.", "Pedestrians have to cross at the crosswalk."],
      rule: "must + V / have to + V"
    },
    { 
      title: "Suggestions (should / shouldn't)",
      explanation: "Used to give advice or suggestions",
      examples: ["You should slow down.", "You shouldn't use your phone while driving."],
      rule: "should + V / shouldn't + V"
    }
  ],
  exercises: [
    { id: 1, type: "multiple-choice", question: "You ___ wear a helmet when riding a motorbike.", options: ["should", "must", "can", "might"], correctAnswer: 1 },
    { id: 2, type: "multiple-choice", question: "You ___ use your phone while driving.", options: ["should", "shouldn't", "must", "can"], correctAnswer: 1 }
  ],
  listening: {
    title: "Road Safety Tips",
    audioScript: "Every day, many people travel on the road, so it is important to follow traffic rules. First, always wear a helmet when you ride a motorbike or bicycle. Second, you must not use your phone while driving because it can cause accidents. When you cross the street, use the crosswalk and look both ways. At intersections, be careful and watch for traffic lights. Finally, remember to keep the speed limit. These simple rules can help keep everyone safe.",
    questions: [
      { question: "What should you do when crossing the street?", options: ["Run quickly", "Use the crosswalk", "Use your phone", "Ignore the traffic lights"], correctAnswer: 1 },
      { question: "Why shouldn’t you use your phone while driving?", options: ["It’s boring", "It’s illegal", "It can cause accidents", "It’s too loud"], correctAnswer: 2 }
    ]
  },
  speaking: { 
    title: "Talk About Road Safety",
    type: "presentation",
    prompt: "Talk about road safety rules in your city.",
    example: "There are many road safety rules in my city. When riding a motorbike, you must wear a helmet. Cars and motorbikes must follow the speed limit. At intersections, people have to stop when the light is red. Pedestrians should cross the street at the crosswalk. Everyone should pay attention and shouldn’t use their phone while driving. These rules help reduce accidents and keep people safe.",
    tips: ["Mention rules", "Give reasons", "Talk about good or bad behaviors"]
  },
  reading: { 
    title: "Traffic Problems in Cities",
    passage: "Many big cities face serious traffic problems. One common problem is traffic jams, especially during rush hour. The streets are full of cars, motorbikes, and buses. Another problem is that some people do not follow traffic rules. For example, drivers sometimes run red lights, and pedestrians cross the street without using the crosswalk. These behaviors can cause accidents. To solve these problems, cities need better public transport and stricter traffic laws.",
    questions: [
      { question: "When do traffic jams often happen?", options: ["At night", "Early morning only", "During rush hour", "On weekends"], correctAnswer: 2 },
      { question: "What can cause accidents?", options: ["Following rules", "Running red lights", "Using public transport", "Walking slowly"], correctAnswer: 1 }
    ]
  },
  writing: { 
    title: "Road Safety Rules",
    type: "paragraph",
    prompt: "Write a paragraph about the importance of road safety rules (120–140 words).",
    example: "Road safety rules are very important because they help protect people on the road. When drivers and pedestrians follow the rules, accidents can be avoided. Wearing a helmet, keeping the speed limit, and stopping at red lights are simple actions that save lives. Using the crosswalk and looking both ways help pedestrians stay safe. However, some people still use their phones while driving or drive too fast. These dangerous behaviors can cause serious accidents. Everyone should understand and follow road safety rules to keep themselves and others safe. Road safety is not only the responsibility of drivers but also of pedestrians and cyclists.",
    tips: ["Give reasons", "Describe common rules", "Explain why they matter"]
  }
},

  {
    id: 20,
    unit: 8,
    title: "Films",
    description: "Learn about different types of films and movie reviews",
    level: "Lớp 7",
    grade: 7,
    topics: ["Film genres", "Movie reviews", "Connectors"],
    vocabulary: [
      { word: "gripping", pronunciation: "/ˈɡrɪpɪŋ/", meaning: "hấp dẫn, lôi cuốn", example: "The film has a gripping plot." },
      { word: "hilarious", pronunciation: "/hɪˈleəriəs/", meaning: "vô cùng hài hước", example: "It was a hilarious comedy." },
      { word: "moving", pronunciation: "/ˈmuːvɪŋ/", meaning: "cảm động", example: "The ending was very moving." },
      { word: "predictable", pronunciation: "/prɪˈdɪktəbl/", meaning: "dễ đoán trước", example: "The plot was too predictable." },
      { word: "critic", pronunciation: "/ˈkrɪtɪk/", meaning: "nhà phê bình", example: "The film received good reviews from critics." },
      { word: "documentary", pronunciation: "/ˌdɒkjuˈmentri/", meaning: "phim tài liệu", example: "I enjoy watching nature documentaries." }
    ],
    grammar: [
      { title: "Connectors: although, despite, however, nevertheless", explanation: "Show contrast", examples: ["Although it rained, we enjoyed the film.", "Despite being old, the movie is still popular.", "The film was long. However, it was interesting."], rule: "Connect contrasting ideas" },
      { title: "-ed and -ing adjectives", explanation: "Describe feelings and characteristics", examples: ["I'm bored. (feeling)", "The film is boring. (characteristic)"], rule: "-ed for feelings, -ing for characteristics" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "___ the film was scary, I watched it.", options: ["Because", "Although", "So", "And"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "The movie was ___ .", options: ["interest", "interested", "interesting", "interestingly"], correctAnswer: 2 }
    ],
    listening: {
      title: "Movie Review",
      audioScript: "I watched 'The Lost City' last weekend. It's an adventure comedy film starring Sandra Bullock. The story is about a romance novelist who gets kidnapped and must find an ancient treasure. Although the plot is predictable, the film is entertaining. The acting is excellent, and there are many hilarious moments. The special effects are impressive. Despite being over two hours long, the movie doesn't feel boring. I would recommend it for a fun family night.",
      questions: [
        { question: "What type of film is it?", options: ["Horror", "Drama", "Adventure comedy", "Documentary"], correctAnswer: 2 },
        { question: "How long is the movie?", options: ["1 hour", "90 minutes", "Over 2 hours", "3 hours"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Describe Your Favorite Film",
      type: "presentation",
      prompt: "Talk about a film you enjoyed recently.",
      example: "My favorite film is 'Coco'. It's an animated film about a Mexican boy who loves music. Although his family forbids music, he pursues his dream. The film is moving and teaches us about family and following your passion. The animation is beautiful, and the music is fantastic. I was amazed by the colorful visuals and touching story.",
      tips: ["Say the film title and type", "Describe the plot briefly", "Give your opinion"]
    },
    reading: { 
      title: "The Magic of Cinema",
      passage: "Cinema has been entertaining people for over a century. Films can make us laugh, cry, think, and dream. There are many genres: action films with exciting fights, comedies that make us laugh, horror films that scare us, dramas that touch our hearts, and science fiction that explores the future. Good films combine several elements: a compelling story, strong performances, impressive cinematography, and a memorable soundtrack. However, not everyone enjoys the same type of film. Some prefer blockbusters with amazing special effects, while others enjoy independent films with deep messages. The film industry has evolved dramatically. Today, we can watch movies in cinemas with incredible sound systems, or stream them at home. Despite these technological changes, the core purpose remains the same: to tell stories that entertain and inspire audiences.",
      questions: [
        { question: "How long has cinema entertained people?", options: ["50 years", "Over a century", "200 years", "500 years"], correctAnswer: 1 },
        { question: "What makes a good film?", options: ["Only special effects", "Only famous actors", "Several combined elements", "Only music"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "Write a Movie Review",
      type: "paragraph",
      prompt: "Review a film you have watched recently (130-150 words).",
      example: "Last week I watched 'Spider-Man: No Way Home' with my friends. It's an action-packed superhero film that I absolutely loved. The film continues Peter Parker's story as he deals with the consequences of his identity being revealed. Although the beginning starts slowly, the action picks up quickly. The special effects are mind-blowing, especially the fight scenes with multiple Spider-Men. The acting is superb, particularly Tom Holland's emotional performance. What impressed me most was how the film balanced humor with serious moments. Despite being nearly three hours long, I wasn't bored at all. The ending was both exciting and moving. However, some plot points were confusing if you haven't seen the previous films. Overall, I would highly recommend this film to Marvel fans. It's entertaining, emotional, and visually stunning. I give it 9 out of 10 stars!",
      tips: ["Start with film title and genre", "Briefly describe plot", "Give opinions with connectors", "Mention acting/effects", "Conclude with recommendation"]
    }
  },

  {
    id: 21,
    unit: 9,
    title: "Festivals Around the World",
    description: "Learn about different cultural festivals globally",
    level: "Lớp 7",
    grade: 7,
    topics: ["World festivals", "Celebrations", "Question words"],
    vocabulary: [
      { word: "carnival", pronunciation: "/ˈkɑːnɪvl/", meaning: "lễ hội hóa trang", example: "The Rio Carnival is world-famous." },
      { word: "parade", pronunciation: "/pəˈreɪd/", meaning: "cuộc diễu hành", example: "There's a big parade during the festival." },
      { word: "costume", pronunciation: "/ˈkɒstjuːm/", meaning: "trang phục", example: "People wear colorful costumes." },
      { word: "ceremony", pronunciation: "/ˈserəməni/", meaning: "nghi lễ", example: "The opening ceremony was spectacular." },
      { word: "feast", pronunciation: "/fiːst/", meaning: "bữa tiệc lớn", example: "Families gather for a big feast." },
      { word: "fireworks", pronunciation: "/ˈfaɪəwɜːks/", meaning: "pháo hoa", example: "Fireworks light up the night sky." }
    ],
    grammar: [
      { title: "H/Wh-questions review", explanation: "Ask for information", examples: ["What is the festival?", "When does it take place?", "Where is it celebrated?", "Why do people celebrate it?"], rule: "Wh-word + auxiliary + subject + main verb?" },
      { title: "Adverbial phrases", explanation: "Show time, place, manner", examples: ["The festival happens in March.", "People celebrate with music and dance.", "It takes place in the city center."], rule: "Provide additional information about when, where, how" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "___ is the festival held?", options: ["What", "When", "Why", "Who"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "___ do people celebrate it?", options: ["What", "When", "Why", "Where"], correctAnswer: 2 }
    ],
    listening: {
      title: "La Tomatina Festival",
      audioScript: "La Tomatina is a famous festival in Spain. It takes place in the town of Buñol on the last Wednesday of August every year. During this festival, thousands of people throw tomatoes at each other for fun. The tradition started in 1945 when some young people had a food fight during a parade. Now it's a major tourist attraction. The festival lasts for about one hour, and trucks bring over 100 tons of tomatoes. Afterward, fire trucks spray water to clean the streets.",
      questions: [
        { question: "Where does La Tomatina take place?", options: ["France", "Italy", "Spain", "Portugal"], correctAnswer: 2 },
        { question: "When does it happen?", options: ["First Wednesday", "Last Wednesday", "Every Monday", "Every Friday"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Talk About a Festival",
      type: "presentation",
      prompt: "Describe a festival you know about.",
      example: "I want to tell you about Diwali, the Festival of Lights in India. It usually takes place in October or November. During Diwali, people light candles and oil lamps called 'diyas'. They also set off fireworks and give gifts to family and friends. People wear new clothes and prepare special sweets. The festival celebrates the victory of light over darkness. It's one of the most important Hindu festivals.",
      tips: ["Say what and where", "Describe when it happens", "Explain activities and meaning"]
    },
    reading: { 
      title: "Oktoberfest - The World's Largest Beer Festival",
      passage: "Oktoberfest is the world's largest folk festival, held annually in Munich, Germany. Despite its name, it actually starts in late September and ends in early October. The festival originated in 1810 as a celebration of a royal wedding and has continued ever since. Over 6 million people from around the world attend Oktoberfest each year. The festival features large tents where people drink beer, eat traditional German food like pretzels and sausages, and enjoy live music. People often wear traditional Bavarian clothing - lederhosen for men and dirndls for women. Beyond drinking and eating, there are amusement rides, games, and parades. The festival has a family-friendly atmosphere during the day, though evenings can be more lively. Oktoberfest has become a symbol of Bavarian culture and is now celebrated in many other countries too.",
      questions: [
        { question: "When does Oktoberfest actually start?", options: ["Early October", "Late September", "August", "November"], correctAnswer: 1 },
        { question: "How many people attend yearly?", options: ["2 million", "4 million", "Over 6 million", "10 million"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "A Festival Description",
      type: "paragraph",
      prompt: "Write about a festival in your country or one you'd like to attend (130-150 words).",
      example: "Mid-Autumn Festival, or Tet Trung Thu, is one of the most beloved festivals in Vietnam. It takes place on the 15th day of the 8th lunar month, usually in September or October. The festival celebrates the full moon and the harvest season. Children are the focus of this festival. They carry colorful lanterns in parades through the streets, often shaped like stars, fish, or butterflies. Families gather to eat mooncakes, which are round pastries filled with sweet or savory ingredients. Traditional lion dances are performed in the streets, with dancers jumping and moving to drum beats. The festival has ancient origins related to agricultural traditions. Parents give children toys and treats, making it similar to Children's Day. Although it's an old tradition, Mid-Autumn Festival remains very popular today. It's a beautiful time when families come together under the bright full moon.",
      tips: ["Use Wh-questions answered: What, When, Where, How, Why", "Describe activities", "Explain cultural significance"]
    }
  },

  {
    id: 22,
    unit: 10,
    title: "Energy Sources",
    description: "Learn about renewable and non-renewable energy",
    level: "Lớp 7",
    grade: 7,
    topics: ["Energy types", "Environment", "Future simple passive"],
    vocabulary: [
      { word: "renewable", pronunciation: "/rɪˈnjuːəbl/", meaning: "có thể tái tạo", example: "Solar power is a renewable energy source." },
      { word: "fossil fuel", pronunciation: "/ˈfɒsl fjuːəl/", meaning: "nhiên liệu hóa thạch", example: "Fossil fuels cause pollution." },
      { word: "turbine", pronunciation: "/ˈtɜːbaɪn/", meaning: "tua-bin", example: "Wind turbines generate electricity." },
      { word: "abundant", pronunciation: "/əˈbʌndənt/", meaning: "dồi dào", example: "Solar energy is abundant in Vietnam." },
      { word: "alternative", pronunciation: "/ɔːlˈtɜːnətɪv/", meaning: "thay thế", example: "We need alternative energy sources." },
      { word: "nuclear", pronunciation: "/ˈnjuːkliər/", meaning: "hạt nhân", example: "Nuclear energy is controversial." }
    ],
    grammar: [
      { title: "Future Simple Passive", explanation: "Future actions with focus on action, not doer", examples: ["Solar panels will be installed on every roof.", "Fossil fuels will be replaced by clean energy."], rule: "S + will be + V3/V-ed" },
      { title: "Questions in Future Simple", explanation: "Ask about future", examples: ["Will renewable energy be used more?", "What will be done to save energy?"], rule: "Will + S + be + V3/V-ed?" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "Wind energy ___ more in the future.", options: ["will use", "will be use", "will be used", "will using"], correctAnswer: 2 },
      { id: 2, type: "multiple-choice", question: "___ solar panels ___ on your house?", options: ["Will/installed", "Will/install", "Will/be installed", "Are/installed"], correctAnswer: 2 }
    ],
    listening: {
      title: "The Future of Energy",
      audioScript: "The world is moving towards renewable energy sources. Solar energy, which comes from the sun, will become more affordable and efficient. Wind farms will be built both on land and offshore. Hydroelectric dams will continue to provide clean electricity. In the future, even ocean waves and tides will be used to generate power. Electric vehicles will replace gas-powered cars. Buildings will have solar panels on roofs. Nuclear fusion might provide unlimited clean energy. These changes are necessary because fossil fuels are running out and damaging our environment.",
      questions: [
        { question: "What will become more affordable?", options: ["Gas", "Coal", "Solar energy", "Oil"], correctAnswer: 2 },
        { question: "What will replace gas-powered cars?", options: ["Bicycles", "Electric vehicles", "Horses", "Trains"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Discuss Energy Sources",
      type: "discussion",
      prompt: "Compare different energy sources and their advantages/disadvantages.",
      example: "There are many types of energy. Fossil fuels like coal and oil are cheap but pollute the environment. Solar energy is clean and abundant, especially in tropical countries like Vietnam. Wind energy is also renewable but requires windy locations. Nuclear energy is powerful but dangerous if accidents happen. In my opinion, we should use more renewable energy to protect our planet.",
      tips: ["Mention different types", "Compare advantages", "Give your opinion"]
    },
    reading: { 
      title: "Vietnam's Renewable Energy Potential",
      passage: "Vietnam has excellent potential for renewable energy development. Located in a tropical region, the country receives abundant sunlight throughout the year, making it ideal for solar power. The long coastline and mountain ranges provide opportunities for wind energy. Central Vietnam, in particular, has some of the best wind resources in Southeast Asia. Hydropower is already a major source of electricity in Vietnam, accounting for about 30% of the country's power generation. The government has set ambitious targets to increase renewable energy to 30% of total energy by 2030. However, there are challenges. Building renewable energy infrastructure requires significant investment. Storage technology for solar and wind power is still expensive. The electrical grid needs upgrading to handle variable renewable sources. Despite these challenges, the transition to clean energy is essential. Fossil fuels are finite and contribute to climate change and air pollution. By investing in renewable energy now, Vietnam can ensure a sustainable energy future.",
      questions: [
        { question: "Why is Vietnam good for solar power?", options: ["It's cold", "Abundant sunlight", "No electricity", "Too rainy"], correctAnswer: 1 },
        { question: "What is the government's target by 2030?", options: ["10%", "20%", "30%", "50%"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "The Energy Crisis and Solutions",
      type: "essay",
      prompt: "Write about energy problems and renewable energy solutions (150-170 words).",
      example: "The world is facing an energy crisis. Fossil fuels, which currently provide most of our energy, are running out and causing serious environmental problems. When we burn coal, oil, and gas, they release greenhouse gases that contribute to global warming. Air pollution from fossil fuels causes respiratory diseases and premature deaths. We urgently need to transition to renewable energy sources. Solar power will be used more widely as the technology becomes cheaper. Wind farms will be built in areas with strong winds. Wave and tidal energy will be harnessed from oceans. Homes and buildings will be equipped with solar panels and energy-efficient appliances. Electric cars will replace gasoline vehicles. Governments should provide incentives for renewable energy development and invest in research. Individuals can help by using less energy and choosing green options. If we act now, renewable energy will provide a clean, sustainable future for generations to come. The technology exists; we just need the will to implement it.",
      tips: ["Explain the problem", "Describe multiple renewable sources", "Use future passive voice", "Suggest actions"]
    }
  },

  {
    id: 23,
    unit: 11,
    title: "Travelling in the Future",
    description: "Learn about future transportation and travel",
    level: "Lớp 7",
    grade: 7,
    topics: ["Future transport", "Technology", "Will vs might"],
    vocabulary: [
      { word: "driverless", pronunciation: "/ˈdraɪvələs/", meaning: "không người lái", example: "Driverless cars will be common." },
      { word: "supersonic", pronunciation: "/ˌsuːpəˈsɒnɪk/", meaning: "siêu thanh", example: "Supersonic jets travel faster than sound." },
      { word: "hover", pronunciation: "/ˈhɒvər/", meaning: "lơ lửng", example: "Flying cars will hover above the ground." },
      { word: "hyperloop", pronunciation: "/ˈhaɪpəluːp/", meaning: "tàu siêu tốc trong ống chân không", example: "The Hyperloop will revolutionize travel." },
      { word: "autopilot", pronunciation: "/ˈɔːtəʊpaɪlət/", meaning: "lái tự động", example: "Planes have autopilot systems." },
      { word: "eco-friendly", pronunciation: "/ˌiːkəʊ ˈfrendli/", meaning: "thân thiện môi trường", example: "We need eco-friendly transportation." }
    ],
    grammar: [
      { title: "Future Simple: Will vs Might", explanation: "Certainty vs possibility", examples: ["Cars will be electric. (certain)", "We might travel to Mars. (possible)"], rule: "will for certain, might for possible" },
      { title: "Possessive Pronouns", explanation: "Ownership without noun", examples: ["This flying car is mine.", "That spaceship is theirs."], rule: "mine, yours, his, hers, ours, theirs" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "Flying cars ___ be common in 50 years.", options: ["will", "are", "do", "can"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "Is this bicycle ___?", options: ["you", "your", "yours", "you're"], correctAnswer: 2 }
    ],
    listening: {
      title: "Transportation in 2050",
      audioScript: "By 2050, transportation will be very different from today. Most cars will be electric and driverless. You'll simply enter your destination, and the car will take you there safely. Flying taxis might operate in big cities, reducing traffic congestion. Hyperloop trains will travel at 1,000 km per hour through vacuum tubes, connecting major cities. For long distances, supersonic planes will make international travel much faster. Space tourism might become affordable for more people. All these vehicles will be eco-friendly, using renewable energy. Traffic accidents will be rare because AI will control most vehicles.",
      questions: [
        { question: "What will most cars be?", options: ["Gas-powered", "Electric and driverless", "Steam-powered", "Solar only"], correctAnswer: 1 },
        { question: "How fast will Hyperloop travel?", options: ["500 km/h", "1,000 km/h", "2,000 km/h", "5,000 km/h"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Your Dream Transportation",
      type: "presentation",
      prompt: "Describe a futuristic vehicle you'd like to use.",
      example: "I would love to have a flying car. It would look like a regular car but with wings that fold out. The car would take off vertically like a helicopter and then fly horizontally. It would be electric and quiet. With a flying car, I could avoid traffic jams and travel much faster. The car would have autopilot, so I could relax or work while traveling. I think flying cars will become reality within 20 years.",
      tips: ["Describe the vehicle", "Explain how it works", "Say why you want it"]
    },
    reading: { 
      title: "The Hyperloop: Future of Transportation?",
      passage: "The Hyperloop is a proposed high-speed transportation system that could revolutionize travel. Invented by entrepreneur Elon Musk, the Hyperloop would transport passengers in pods through low-pressure tubes at speeds up to 1,200 km per hour. This is nearly as fast as an airplane but without the need for airports or security checks. The pods would levitate using magnetic technology, eliminating friction. The system would be powered by renewable energy, making it environmentally friendly. A trip from Los Angeles to San Francisco, which currently takes about 6 hours by car, would take only 30 minutes by Hyperloop. Several companies are developing Hyperloop prototypes, and test tracks have been built in various countries. However, there are challenges. Building the infrastructure would be extremely expensive. Safety concerns need to be addressed. Despite these obstacles, many experts believe the Hyperloop will become a reality within the next decade. It represents a glimpse into the future of sustainable, high-speed travel.",
      questions: [
        { question: "Who invented the Hyperloop concept?", options: ["Bill Gates", "Steve Jobs", "Elon Musk", "Mark Zuckerberg"], correctAnswer: 2 },
        { question: "How fast could it travel?", options: ["500 km/h", "800 km/h", "1,200 km/h", "2,000 km/h"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "Transportation in the Future",
      type: "essay",
      prompt: "Describe how you think people will travel in 50 years (150-170 words).",
      example: "I believe transportation will be completely transformed in 50 years. Most vehicles will be autonomous, meaning they will drive themselves using artificial intelligence. This will make travel much safer because human error causes most accidents today. Cars will be electric and powered by renewable energy, so pollution will be greatly reduced. In cities, people might use flying taxis to avoid traffic congestion. These taxis will take off and land vertically, like helicopters. For longer distances, Hyperloop trains will connect major cities, traveling at incredible speeds through vacuum tubes. A trip that takes 5 hours by car today might take only 30 minutes. International travel will also be faster with supersonic jets. Space tourism might even become affordable, allowing ordinary people to experience space. However, traditional methods like bicycles will still be popular for short distances and exercise. Personal flying devices, like jet packs, might exist but will probably be expensive and require special licenses. Overall, future transportation will be faster, safer, cleaner, and more convenient than today.",
      tips: ["Describe multiple transport types", "Use will and might appropriately", "Explain benefits", "Be creative but logical"]
    }
  },

  {
    id: 24,
    unit: 12,
    title: "English-speaking Countries",
  description: "Learn about countries where English is the main or official language",
  level: "Lớp 7",
  grade: 7,
  topics: ["Geography", "Culture", "Countries", "National symbols"],
  vocabulary: [
    { word: "capital city", pronunciation: "/ˈkæpɪtl ˈsɪti/", meaning: "thủ đô", example: "London is the capital city of the UK." },
    { word: "official language", pronunciation: "/əˈfɪʃəl ˈlæŋɡwɪdʒ/", meaning: "ngôn ngữ chính thức", example: "English is the official language of Australia." },
    { word: "population", pronunciation: "/ˌpɒpjʊˈleɪʃən/", meaning: "dân số", example: "The population of Canada is about 38 million." },
    { word: "symbol", pronunciation: "/ˈsɪmbəl/", meaning: "biểu tượng", example: "The maple leaf is a national symbol of Canada." },
    { word: "landscape", pronunciation: "/ˈlændskeɪp/", meaning: "cảnh quan", example: "New Zealand is famous for its beautiful landscapes." },
    { word: "continent", pronunciation: "/ˈkɒntɪnənt/", meaning: "lục địa", example: "Australia is both a country and a continent." }
  ],
  grammar: [
    { 
      title: "Comparative and Superlative Adjectives",
      explanation: "Used to compare people, places, or things",
      examples: ["Canada is larger than the UK.", "Australia is the smallest continent."],
      rule: "Adj + -er + than / the + Adj + -est"
    },
    { 
      title: "Present Simple for Facts",
      explanation: "Used to describe general truths or facts",
      examples: ["People speak English in many countries.", "The USA has 50 states."],
      rule: "S + V(s/es) + O"
    }
  ],
  exercises: [
    { id: 1, type: "multiple-choice", question: "London is the ___ of the UK.", options: ["country", "capital city", "continent", "symbol"], correctAnswer: 1 },
    { id: 2, type: "multiple-choice", question: "Australia is ___ than New Zealand.", options: ["small", "smaller", "largest", "larger"], correctAnswer: 3 }
  ],
  listening: {
    title: "English-speaking Countries Around the World",
    audioScript: "English is spoken in many countries around the world. Some of the most famous English-speaking countries include the United Kingdom, the United States, Canada, Australia, and New Zealand. Each country has its own culture, traditions, and landmarks. For example, the United Kingdom is known for Big Ben and the River Thames. The United States has the Statue of Liberty. Canada is famous for its maple trees and national parks. Australia is known for the Sydney Opera House and kangaroos. New Zealand has beautiful mountains and beaches. Although all these countries speak English, their accents and vocabulary can be different.",
    questions: [
      { question: "Which country is famous for the Statue of Liberty?", options: ["UK", "USA", "Canada", "Australia"], correctAnswer: 1 },
      { question: "What is New Zealand known for?", options: ["Kangaroos", "Maple trees", "Beautiful landscapes", "Big Ben"], correctAnswer: 2 }
    ]
  },
  speaking: { 
    title: "Talk About an English-speaking Country",
    type: "presentation",
    prompt: "Choose one English-speaking country and talk about it.",
    example: "One English-speaking country I want to talk about is Australia. It is a large country and also a continent. The capital city is Canberra, but Sydney is the biggest city. English is the official language. Australia is famous for the Sydney Opera House, beautiful beaches, and unique animals like kangaroos and koalas. The weather is warm, and people are friendly. I want to visit Australia in the future because I love its landscapes and culture.",
    tips: ["Say where it is", "Give key facts (population, capital, symbols)", "Explain why you like it"]
  },
  reading: { 
    title: "The United Kingdom",
    passage: "The United Kingdom, or the UK, is an English-speaking country in Europe. It is made up of four countries: England, Scotland, Wales, and Northern Ireland. The capital city is London, one of the most famous cities in the world. The UK has a population of about 67 million people. English is the official language. The UK is known for its long history, castles, museums, and traditional festivals. Famous symbols of the UK include Big Ben, the red telephone box, and the double-decker bus. Many tourists visit the UK every year to explore its culture, food, and beautiful countryside.",
    questions: [
      { question: "How many countries make up the UK?", options: ["Two", "Three", "Four", "Five"], correctAnswer: 2 },
      { question: "What is a famous symbol of the UK?", options: ["Maple leaf", "Big Ben", "Kangaroo", "Eagle"], correctAnswer: 1 }
    ]
  },
  writing: { 
    title: "An English-speaking Country",
    type: "paragraph",
    prompt: "Write a paragraph about an English-speaking country you know (120–140 words).",
    example: "Canada is one of the largest English-speaking countries in the world. It is located in North America and has a population of about 38 million people. The capital city is Ottawa, while Toronto is the biggest city. Canada is famous for its natural beauty, including forests, lakes, and national parks. A well-known symbol of Canada is the maple leaf, which appears on the national flag. The country has two official languages: English and French. People in Canada are known for being polite and friendly. I would love to visit Canada because I want to see its beautiful landscapes and experience the snowy winter. It is a peaceful and multicultural country.",
    tips: ["Give basic facts: location, capital, population", "Describe symbols or landscapes", "Explain your feelings or reasons for choosing it"]
  }
},

  // ========== GRADE 8 (12 UNITS) ==========
  {
    id: 25,
    unit: 1,
    title: "Leisure Activities",
    description: "Learn about hobbies and free time activities",
    level: "Lớp 8",
    grade: 8,
    topics: ["Hobbies", "Free time", "Verbs of liking + gerunds"],
    vocabulary: [
      { word: "leisure", pronunciation: "/ˈleʒər/", meaning: "thời gian rảnh rỗi", example: "What do you do in your leisure time?" },
      { word: "origami", pronunciation: "/ˌɒrɪˈɡɑːmi/", meaning: "nghệ thuật gấp giấy", example: "Origami is a Japanese art." },
      { word: "socializing", pronunciation: "/ˈsəʊʃəlaɪzɪŋ/", meaning: "giao lưu", example: "Teenagers love socializing with friends." },
      { word: "DIY", pronunciation: "/ˌdiː aɪ ˈwaɪ/", meaning: "tự làm (Do It Yourself)", example: "I enjoy DIY projects." },
      { word: "surfing", pronunciation: "/ˈsɜːfɪŋ/", meaning: "lướt web", example: "I spend hours surfing the net." },
      { word: "crafts", pronunciation: "/krɑːfts/", meaning: "đồ thủ công", example: "She makes beautiful crafts." }
    ],
    grammar: [
      { title: "Verbs of liking + gerunds/to-infinitives", explanation: "Express preferences", examples: ["I love playing football.", "She enjoys reading books.", "They prefer to stay home."], rule: "like/love/enjoy/hate + V-ing OR prefer + to V" },
      { title: "Comparative forms of adverbs", explanation: "Compare actions", examples: ["He runs faster than me.", "She studies more carefully than before."], rule: "adverb + er / more + long adverb" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "She enjoys ___ photos.", options: ["take", "takes", "taking", "to take"], correctAnswer: 2 },
      { id: 2, type: "multiple-choice", question: "He works ___ than his brother.", options: ["hard", "harder", "more hard", "hardest"], correctAnswer: 1 }
    ],
    listening: {
      title: "Teen Hobbies Survey",
      audioScript: "A recent survey shows how teenagers spend their leisure time. 60% prefer surfing the internet and using social media. 45% enjoy playing video games. Only 25% like outdoor sports and activities. Reading books dropped to 15%. Traditional hobbies like crafts and DIY are becoming less popular. However, new hobbies like making videos for social media are trending.",
      questions: [
        { question: "What do most teenagers prefer?", options: ["Playing sports", "Surfing the internet", "Reading", "Cooking"], correctAnswer: 1 },
        { question: "What percentage like outdoor sports?", options: ["15%", "25%", "45%", "60%"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Talk About Your Hobbies",
      type: "presentation",
      prompt: "Describe your favorite leisure activity.",
      example: "My favorite hobby is playing guitar. I started learning it two years ago. I practice every evening for about 30 minutes. Playing guitar helps me relax after studying. I can play several songs now. My dream is to join a band someday. I think everyone should have a hobby they're passionate about.",
      tips: ["Say what hobby", "When you started", "Why you like it", "What you've achieved"]
    },
    reading: { 
      title: "Digital vs Traditional Hobbies",
      passage: "Today's teenagers spend more time on digital activities than traditional hobbies. While previous generations played outdoor games and sports, modern teens prefer video games, social media, and streaming content online. This shift has both advantages and disadvantages. Digital hobbies can develop technical skills and connect people globally. However, excessive screen time can harm physical health and reduce face-to-face social interaction. Some traditional hobbies like reading, crafts, and playing musical instruments are making a comeback as people seek balance. Experts recommend a mix of both digital and traditional activities for healthy development.",
      questions: [
        { question: "What do modern teens prefer?", options: ["Outdoor games", "Digital activities", "Reading only", "Crafts only"], correctAnswer: 1 },
        { question: "What do experts recommend?", options: ["Only digital", "Only traditional", "A mix of both", "No hobbies"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "My Favorite Hobby",
      type: "essay",
      prompt: "Write about a hobby you enjoy and explain why (130-150 words).",
      example: "My favorite hobby is photography. I started taking photos when I was 12 years old. I love capturing beautiful moments and interesting places. Every weekend, I go out with my camera to take pictures of nature, people, and city scenes. Photography teaches me to observe the world carefully and appreciate small details. It also helps me express my creativity and emotions. I have learned a lot about composition, lighting, and editing through online tutorials and practice. My photos are improving gradually, which makes me very happy. Sometimes I share my photos on social media, and my friends say they enjoy them. Photography is not just a hobby for me; it's a way to see the world differently. In the future, I dream of becoming a professional photographer and traveling to beautiful places around the world to capture stunning images.",
      tips: ["Introduction: state your hobby", "Body: describe what you do and why", "Conclusion: future aspirations"]
    }
  },

  {
    id: 26,
    unit: 2,
    title: "Life in the Countryside",
    description: "Learn about rural life and compare it with city life",
    level: "Lớp 8",
    grade: 8,
    topics: ["Countryside", "Rural activities", "Comparative adjectives review"],
    vocabulary: [
      { word: "harvest", pronunciation: "/ˈhɑːvɪst/", meaning: "thu hoạch", example: "Farmers harvest rice in autumn." },
      { word: "paddy field", pronunciation: "/ˈpædi fiːld/", meaning: "ruộng lúa", example: "The paddy fields are green and beautiful." },
      { word: "buffalo", pronunciation: "/ˈbʌfələʊ/", meaning: "trâu", example: "Buffaloes work in the rice fields." },
      { word: "peaceful", pronunciation: "/ˈpiːsfl/", meaning: "yên bình", example: "The countryside is peaceful and quiet." },
      { word: "hospitable", pronunciation: "/hɒˈspɪtəbl/", meaning: "hiếu khách", example: "Country people are very hospitable." },
      { word: "vast", pronunciation: "/vɑːst/", meaning: "rộng lớn", example: "There are vast green fields." }
    ],
    grammar: [
      { title: "Comparative forms review", explanation: "Compare two things", examples: ["Life in the countryside is more peaceful than in the city.", "People work harder during harvest season."], rule: "adj/adv + er OR more + adj/adv + than" },
      { title: "Articles: a, an, the", explanation: "Use articles correctly", examples: ["I live in a village.", "The village is near the river.", "An ox helps with farming."], rule: "a/an = general, the = specific" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "The countryside is ___ than the city.", options: ["quiet", "quieter", "more quiet", "quietest"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "I live in ___ small village.", options: ["a", "an", "the", "no article"], correctAnswer: 0 }
    ],
    listening: {
      title: "A Day in a Vietnamese Village",
      audioScript: "Life in a Vietnamese village starts early. Farmers wake up at 5 AM to work in the paddy fields. Children help feed chickens and ducks before school. At noon, families gather for lunch together. In the afternoon, some people weave baskets or make crafts. Evenings are for relaxing and chatting with neighbors. Life is slower and more peaceful than in cities. People know each other well and help one another. Although farming is hard work, villagers feel connected to nature and their community.",
      questions: [
        { question: "What time do farmers wake up?", options: ["4 AM", "5 AM", "6 AM", "7 AM"], correctAnswer: 1 },
        { question: "What do villagers do in the evening?", options: ["Work in fields", "Go shopping", "Relax and chat", "Watch TV only"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Compare City and Countryside",
      type: "discussion",
      prompt: "Compare living in the city with living in the countryside.",
      example: "City life and country life are very different. Cities are more crowded and noisier, but they have better facilities like schools, hospitals, and shopping centers. The countryside is quieter and more peaceful. The air is fresher and cleaner. However, there are fewer job opportunities in rural areas. People in cities often feel stressed, while country people are more relaxed and friendly. I think both places have advantages and disadvantages.",
      tips: ["Compare facilities", "Compare lifestyle", "Mention advantages of each", "Give your opinion"]
    },
    reading: { 
      title: "The Changing Countryside",
      passage: "Vietnam's countryside is changing rapidly. Many young people are leaving villages to find work in cities, leading to an aging rural population. Modern farming equipment is replacing traditional methods, making agriculture more efficient. Roads and infrastructure are improving, connecting remote areas to cities. However, these changes bring both benefits and challenges. While living standards improve, traditional culture and community bonds weaken. Many villages are losing their unique character. The government is working to develop rural areas sustainably, creating local jobs to discourage migration. Eco-tourism is emerging as a way to preserve rural beauty while generating income. The goal is to modernize the countryside without losing its cultural identity and natural charm.",
      questions: [
        { question: "Why are young people leaving villages?", options: ["For fun", "To find work", "For holidays", "To study only"], correctAnswer: 1 },
        { question: "What is eco-tourism doing?", options: ["Destroying villages", "Preserving beauty while generating income", "Building factories", "Creating pollution"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "City Life vs Country Life",
      type: "essay",
      prompt: "Compare living in the city and countryside. Which do you prefer? (140-160 words)",
      example: "Living in the city and the countryside offers very different experiences. Cities are modern and convenient with shopping malls, cinemas, and good public transportation. There are more job opportunities and better schools. However, cities are crowded, noisy, and polluted. Life is fast-paced and stressful. In contrast, the countryside is peaceful and quiet. The air is fresh, and people are closer to nature. Villages have strong community bonds, and neighbors help each other. But rural areas lack modern facilities and entertainment options. Jobs are limited, mostly in agriculture. Personally, I prefer living in the countryside because I value peace and community. City life is too stressful for me. I enjoy waking up to birdsong instead of traffic noise. However, I understand why many people choose cities for career opportunities. The ideal solution might be living in a small town that combines the best of both worlds - access to facilities while maintaining a peaceful environment.",
      tips: ["Compare systematically", "Give advantages and disadvantages of each", "State your preference clearly", "Explain your reasons"]
    }
  },

  {
    id: 27,
    unit: 3,
    title: "Peoples of Viet Nam",
    description: "Learn about Vietnam's ethnic groups and cultures",
    level: "Lớp 8",
    grade: 8,
    topics: ["Ethnic minorities", "Culture", "Questions review"],
    vocabulary: [
      { word: "ethnic", pronunciation: "/ˈeθnɪk/", meaning: "dân tộc", example: "Vietnam has 54 ethnic groups." },
      { word: "minority", pronunciation: "/maɪˈnɒrəti/", meaning: "thiểu số", example: "Ethnic minorities live in mountainous areas." },
      { word: "stilt house", pronunciation: "/stɪlt haʊs/", meaning: "nhà sàn", example: "They live in traditional stilt houses." },
      { word: "costume", pronunciation: "/ˈkɒstjuːm/", meaning: "trang phục", example: "Each group has unique traditional costumes." },
      { word: "heritage", pronunciation: "/ˈherɪtɪdʒ/", meaning: "di sản", example: "Cultural heritage must be preserved." },
      { word: "terraced", pronunciation: "/ˈterəst/", meaning: "ruộng bậc thang", example: "Terraced fields are beautiful." }
    ],
    grammar: [
      { title: "Questions with H/Wh-words", explanation: "Ask for information", examples: ["How many ethnic groups are there?", "What do they wear?", "Where do they live?"], rule: "Use Wh-words for specific information" },
      { title: "Articles review", explanation: "a, an, the, zero article", examples: ["The Tay are the largest minority.", "They wear a traditional costume.", "They grow rice."], rule: "Use the for specific groups" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "___ many ethnic groups are there in Vietnam?", options: ["What", "How", "Where", "When"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "___ Hmong people live in the mountains.", options: ["A", "An", "The", "No article"], correctAnswer: 2 }
    ],
    listening: {
      title: "The Hmong People",
      audioScript: "The Hmong are one of Vietnam's largest ethnic minorities. They live mainly in the mountainous regions of northern Vietnam. The Hmong are famous for their colorful traditional costumes with intricate embroidery. Their main occupation is farming on terraced fields. They grow rice, corn, and herbs. The Hmong celebrate the Lunar New Year with special rituals and festivals. They have rich oral traditions, passing down stories and songs through generations. Their culture is unique and valuable to Vietnam's diversity.",
      questions: [
        { question: "Where do the Hmong live?", options: ["Cities", "Coastal areas", "Mountainous regions", "Islands"], correctAnswer: 2 },
        { question: "What are they famous for?", options: ["Dancing", "Colorful costumes", "Fishing", "Trading"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Describe an Ethnic Group",
      type: "presentation",
      prompt: "Talk about an ethnic minority in Vietnam.",
      example: "I'd like to talk about the Tay people. They are the largest ethnic minority in Vietnam, with about 1.9 million people. Most Tay people live in northern provinces like Cao Bang and Lang Son. They traditionally live in stilt houses and practice wet rice cultivation. The Tay have a rich culture with unique music, dances, and festivals. They celebrate Lunar New Year similarly to the Kinh people but with their own special customs. Tay women wear dark indigo clothing. Their language belongs to the Tai language family. Today, many Tay people have integrated into modern life while maintaining their cultural identity.",
      tips: ["Say which group", "Where they live", "Their culture and traditions", "Current situation"]
    },
    reading: { 
      title: "Vietnam's Cultural Diversity",
      passage: "Vietnam is home to 54 ethnic groups, each with distinct languages, customs, and traditions. The Kinh (Viet) people make up about 86% of the population, while 53 ethnic minorities live mainly in mountainous and remote areas. The largest minorities include the Tay, Thai, Muong, Khmer, and Hmong. Each group has unique traditional clothing, music, and festivals. For example, the Hmong are known for their colorful embroidered costumes, while the Khmer in the Mekong Delta have distinct Buddhist temples. Stilt houses are common among many groups in mountainous regions, protecting from floods and animals. Traditional livelihoods include rice farming, weaving, and handicrafts. The government protects ethnic minority rights and promotes cultural preservation. However, modernization and migration are changing traditional ways of life. Young people often move to cities for education and work, risking cultural loss. Organizations work to document languages and traditions before they disappear. Vietnam's ethnic diversity is a source of national pride and cultural richness.",
      questions: [
        { question: "How many ethnic groups does Vietnam have?", options: ["45", "50", "54", "60"], correctAnswer: 2 },
        { question: "What percentage are Kinh people?", options: ["75%", "80%", "86%", "90%"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "An Ethnic Minority Group",
      type: "paragraph",
      prompt: "Write about an ethnic minority in Vietnam (120-140 words).",
      example: "The Thai people are one of Vietnam's major ethnic minorities, with a population of about 1.5 million. They mainly live in the northwestern provinces such as Son La, Dien Bien, and Lai Chau. The Thai are divided into several subgroups, including the Black Thai and White Thai, named after their traditional clothing colors. They typically live in stilt houses built near rivers and streams. The Thai are skilled farmers, growing wet rice in valleys and terraced fields on mountain slopes. Their culture is rich with traditional music performed on instruments like the tinh tau (a type of guitar). Thai women are famous for their weaving skills, creating beautiful textiles with intricate patterns. They celebrate many festivals throughout the year, with the Xen Ban festival being one of the most important. Today, while maintaining their cultural identity, many Thai people have adopted modern lifestyles and education.",
      tips: ["Introduce the group and population", "Describe where they live", "Explain their culture and lifestyle", "Mention current situation"]
    }
  },

  // ========== GRADE 8 - UNITS 4-12 ==========
  {
    id: 28,
    unit: 4,
    title: "Our Customs and Traditions",
    description: "Learn about Vietnamese customs and traditions",
    level: "Lớp 8",
    grade: 8,
    topics: ["Customs", "Traditions", "Should/Have to"],
    vocabulary: [
      { word: "custom", pronunciation: "/ˈkʌstəm/", meaning: "phong tục", example: "It's a custom to take off shoes before entering a house." },
      { word: "tradition", pronunciation: "/trəˈdɪʃn/", meaning: "truyền thống", example: "Our family has a tradition of gathering on Tet." },
      { word: "ancestor", pronunciation: "/ˈænsestər/", meaning: "tổ tiên", example: "We worship our ancestors." },
      { word: "ceremony", pronunciation: "/ˈserəməni/", meaning: "nghi lễ", example: "The wedding ceremony was beautiful." },
      { word: "ritual", pronunciation: "/ˈrɪtʃuəl/", meaning: "nghi thức", example: "They perform rituals during festivals." },
      { word: "offering", pronunciation: "/ˈɒfərɪŋ/", meaning: "lễ vật", example: "We prepare offerings for the altar." }
    ],
    grammar: [
      { title: "Should/Shouldn't for advice", explanation: "Give advice about customs", examples: ["You should respect elderly people.", "You shouldn't wear shoes inside."], rule: "should/shouldn't + V (base)" },
      { title: "Have to/Don't have to", explanation: "Talk about obligations", examples: ["We have to follow traditions.", "You don't have to bring gifts."], rule: "have to = obligation, don't have to = not necessary" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "You ___ respect older people in Vietnam.", options: ["should", "shouldn't", "can", "might"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "You ___ wear a uniform to the party.", options: ["must", "have to", "don't have to", "mustn't"], correctAnswer: 2 }
    ],
    listening: {
      title: "Vietnamese Family Customs",
      audioScript: "Vietnamese families have many important customs. Children should show respect to parents and grandparents by using polite language. During meals, elderly people eat first. On Tet holiday, children receive lucky money in red envelopes. Families gather to clean ancestors' graves during Tet. When visiting someone's home, you should bring a small gift. It's considered rude to point at people or use one hand to give something to elders. These customs strengthen family bonds and show respect.",
      questions: [
        { question: "What should children do at meals?", options: ["Eat first", "Let elderly eat first", "Eat alone", "Skip meals"], correctAnswer: 1 },
        { question: "What do children receive on Tet?", options: ["Toys", "Books", "Lucky money", "Clothes"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Customs in Your Family",
      type: "presentation",
      prompt: "Talk about a custom or tradition in your family.",
      example: "My family has a beautiful tradition every Tet holiday. On New Year's Eve, all family members gather at my grandparents' house. We prepare traditional foods together, like banh chung and pickled vegetables. At midnight, we visit the ancestors' altar to pray for good luck. The next morning, children receive lucky money from adults. We wear new clothes and visit relatives. This tradition has been passed down for generations. It helps us stay connected as a family and remember our roots. I love this tradition because it brings everyone together.",
      tips: ["Name the tradition", "Describe what you do", "Explain its meaning", "Share your feelings"]
    },
    reading: { 
      title: "Customs vs Traditions",
      passage: "Customs and traditions are important parts of culture, but they're slightly different. A custom is a regular practice or habit, like taking off shoes before entering a house or giving gifts when visiting. Traditions are customs passed down through generations, with deeper cultural or historical meaning, like celebrating Tet or worshipping ancestors. Vietnam has rich customs and traditions. The custom of addressing people properly based on age and relationship shows respect. The tradition of ancestor worship connects families to their heritage. Wedding customs include engagement ceremonies and tea ceremonies. Some customs are changing with modern life, while core traditions remain strong. Young people are finding ways to balance traditional values with contemporary lifestyles. Understanding and respecting customs helps preserve cultural identity while adapting to change.",
      questions: [
        { question: "What is a tradition?", options: ["A new habit", "Customs passed down through generations", "A foreign practice", "A modern idea"], correctAnswer: 1 },
        { question: "What connects families to their heritage?", options: ["Social media", "Ancestor worship", "Shopping", "Gaming"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "A Vietnamese Custom",
      type: "paragraph",
      prompt: "Write about an interesting Vietnamese custom (120-140 words).",
      example: "One interesting Vietnamese custom is the practice of xông đất, or 'first-footing,' on Tet holiday. Vietnamese people believe that the first person to enter their home on New Year's Day will determine their luck for the entire year. Therefore, families carefully choose who will be their first guest. They usually invite someone who is successful, happy, and well-respected. This person should arrive early in the morning, bring good wishes, and perhaps a small gift like fruits or flowers. The family welcomes them warmly and offers tea and traditional foods. This custom shows how Vietnamese people value luck and positive energy. It also demonstrates the importance of community and good relationships. Although modern life is changing many customs, xông đất remains popular, especially in rural areas and among traditional families who want to start their year with good fortune.",
      tips: ["Introduce the custom clearly", "Explain how it's practiced", "Describe its significance", "Mention its current status"]
    }
  },

  {
    id: 29,
    unit: 5,
    title: "Festivals in Viet Nam",
    description: "Explore Vietnamese festivals and celebrations",
    level: "Lớp 8",
    grade: 8,
    topics: ["Festivals", "Celebrations", "Simple and compound sentences"],
    vocabulary: [
      { word: "celebrate", pronunciation: "/ˈselɪbreɪt/", meaning: "ăn mừng, tổ chức", example: "We celebrate Tet with family." },
      { word: "carnival", pronunciation: "/ˈkɑːnɪvl/", meaning: "lễ hội hóa trang", example: "The carnival has colorful parades." },
      { word: "procession", pronunciation: "/prəˈseʃn/", meaning: "đám rước", example: "The procession goes through the village." },
      { word: "lantern", pronunciation: "/ˈlæntən/", meaning: "đèn lồng", example: "Children carry lanterns during Mid-Autumn Festival." },
      { word: "worship", pronunciation: "/ˈwɜːʃɪp/", meaning: "thờ cúng", example: "People worship at the temple during festivals." },
      { word: "commemorate", pronunciation: "/kəˈmeməreɪt/", meaning: "tưởng nhớ", example: "The festival commemorates a historical event." }
    ],
    grammar: [
      { title: "Simple sentences", explanation: "One independent clause", examples: ["People celebrate Tet in January or February.", "The festival lasts three days."], rule: "Subject + Verb + Object/Complement" },
      { title: "Compound sentences", explanation: "Two independent clauses joined by conjunctions", examples: ["Tet is important, and everyone celebrates it.", "We can visit temples, or we can stay home."], rule: "Clause 1 + and/but/or/so + Clause 2" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "Tet is important, ___ everyone celebrates it.", options: ["and", "but", "because", "although"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "Which is a compound sentence?", options: ["Festivals are fun.", "We visit temples and enjoy food.", "It's cold, but we go out.", "People celebrate together."], correctAnswer: 2 }
    ],
    listening: {
      title: "Hung Kings' Temple Festival",
      audioScript: "The Hung Kings' Temple Festival is one of Vietnam's most important festivals. It takes place from the 8th to the 11th day of the third lunar month in Phu Tho Province. The festival commemorates the Hung Kings, who were the first kings of Vietnam. During the festival, there are many activities. People carry offerings to the temple, including banh chung and banh day. There are traditional music performances, lion dances, and wrestling competitions. Millions of people attend the festival to honor their ancestors and pray for good fortune. In 2007, it became a national holiday.",
      questions: [
        { question: "When does the festival take place?", options: ["First month", "Second month", "Third month", "Fourth month"], correctAnswer: 2 },
        { question: "Who do people commemorate?", options: ["Parents", "Hung Kings", "Teachers", "Friends"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Describe a Festival",
      type: "presentation",
      prompt: "Describe a Vietnamese festival you know or have attended.",
      example: "I'd like to talk about the Mid-Autumn Festival, also called the Children's Festival. It takes place on the 15th day of the eighth lunar month, usually in September. This festival celebrates the harvest and the full moon. Children are the main focus of the celebration. They carry colorful lanterns in various shapes like stars, fish, and butterflies. Families gather to eat mooncakes, which are round pastries with sweet or savory fillings. There are also lion dances and drum performances in the streets. Children participate in lantern parades and enjoy the festive atmosphere. The festival represents family reunion and happiness. I love this festival because of the beautiful lanterns and the joyful atmosphere.",
      tips: ["Name the festival and when it happens", "Explain its meaning", "Describe activities", "Share personal experience or feelings"]
    },
    reading: { 
      title: "Vietnamese Festivals Throughout the Year",
      passage: "Vietnam celebrates numerous festivals throughout the year, reflecting its rich cultural heritage. Tet Nguyen Dan, the Lunar New Year, is the most important festival, marking the arrival of spring. Families reunite, clean their homes, and prepare special foods. The Perfume Pagoda Festival attracts thousands of pilgrims seeking blessings. The Hue Festival showcases traditional arts and culture from across Vietnam. In central Vietnam, the Whale Worship Festival honors whales as sacred animals. Southern Vietnam celebrates Tet with floating markets and flower festivals. The Mid-Autumn Festival focuses on children with lanterns and mooncakes. Many festivals combine religious worship, cultural performances, and community gatherings. They preserve traditions while bringing communities together. Modern life has changed some festivals, but their core values remain. The government has recognized several festivals as national intangible cultural heritage, ensuring their preservation for future generations.",
      questions: [
        { question: "What is the most important festival?", options: ["Mid-Autumn", "Tet Nguyen Dan", "Hue Festival", "Perfume Pagoda"], correctAnswer: 1 },
        { question: "What does Mid-Autumn Festival focus on?", options: ["Adults", "Children", "Elderly", "Workers"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "My Favorite Festival",
      type: "essay",
      prompt: "Write about your favorite Vietnamese festival (140-160 words).",
      example: "My favorite Vietnamese festival is Tet Nguyen Dan, the Lunar New Year. It is the most important and exciting celebration in Vietnam, usually taking place in late January or early February. Tet marks the beginning of spring and a new year. The preparation starts weeks before, with families cleaning their houses thoroughly to sweep away bad luck. We decorate homes with peach blossoms in the north or apricot blossoms in the south, and kumquat trees. Traditional foods are prepared, especially banh chung, a square sticky rice cake. On New Year's Eve, families gather for a reunion dinner. At midnight, fireworks light up the sky. During Tet, people visit relatives and friends, exchange wishes for good health and prosperity, and children receive lucky money in red envelopes. Everyone wears new clothes. I love Tet because it brings my whole family together. We have time to relax, enjoy delicious food, and appreciate our traditions. The festive atmosphere, with flowers and decorations everywhere, makes me feel happy and hopeful for the new year.",
      tips: ["Introduction: name the festival", "Body: describe preparations and activities", "Explain why you like it", "Conclusion: personal feelings"]
    }
  },

  {
    id: 30,
    unit: 6,
    title: "Folk Tales",
    description: "Learn about Vietnamese folk tales and storytelling",
    level: "Lớp 8",
    grade: 8,
    topics: ["Stories", "Legends", "Past continuous"],
    vocabulary: [
      { word: "folk tale", pronunciation: "/fəʊk teɪl/", meaning: "truyện dân gian", example: "Vietnamese folk tales teach moral lessons." },
      { word: "legend", pronunciation: "/ˈledʒənd/", meaning: "truyền thuyết", example: "The legend of Lac Long Quan and Au Co is famous." },
      { word: "fairy", pronunciation: "/ˈfeəri/", meaning: "tiên", example: "The fairy helped the poor girl." },
      { word: "evil", pronunciation: "/ˈiːvl/", meaning: "xấu xa, ác", example: "The evil witch cast a spell." },
      { word: "magical", pronunciation: "/ˈmædʒɪkl/", meaning: "kỳ diệu, thần kỳ", example: "He had a magical sword." },
      { word: "moral", pronunciation: "/ˈmɒrəl/", meaning: "bài học đạo đức", example: "The story has a good moral." }
    ],
    grammar: [
      { title: "Past continuous", explanation: "Actions in progress in the past", examples: ["She was walking in the forest.", "They were living happily."], rule: "was/were + V-ing" },
      { title: "Past continuous vs Past simple", explanation: "Interrupted actions", examples: ["While she was sleeping, the prince arrived.", "He was reading when the phone rang."], rule: "Past continuous (longer action) + when/while + Past simple (shorter action)" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "She ___ in the forest when she met the fairy.", options: ["walks", "walked", "was walking", "is walking"], correctAnswer: 2 },
      { id: 2, type: "multiple-choice", question: "While the prince ___, the princess was dancing.", options: ["sang", "singing", "was singing", "sings"], correctAnswer: 2 }
    ],
    listening: {
      title: "The Story of Tam and Cam",
      audioScript: "Tam and Cam is a famous Vietnamese folk tale, similar to Cinderella. Tam was a kind and beautiful girl who lived with her cruel stepmother and stepsister Cam. While Tam was working hard in the fields, Cam and her mother were relaxing at home. One day, Tam was crying by the riverbank when a fairy appeared. The fairy helped Tam attend the king's festival, where she met the king. However, she lost her shoe while running away. The king found the shoe and searched for its owner. Eventually, he found Tam, and they got married. The story teaches that kindness and patience are rewarded.",
      questions: [
        { question: "Who helped Tam?", options: ["Her mother", "A fairy", "The king", "Cam"], correctAnswer: 1 },
        { question: "What did Tam lose?", options: ["Her dress", "Her shoe", "Her bag", "Her ring"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Retell a Folk Tale",
      type: "presentation",
      prompt: "Retell a Vietnamese folk tale you know.",
      example: "I'll tell you about 'The Story of the Watermelon.' Long ago, there was a king who had three sons. The youngest son, Mai An Tiem, was the smartest and kindest. However, he accidentally offended the king, so the king sent him to a deserted island. Mai An Tiem was living on the island with his family when he found some black seeds. He planted them, and they grew into plants with large, round fruits - watermelons. The watermelons had sweet red flesh and were very delicious. He carved his name on some watermelons and threw them into the sea. People found them, loved the taste, and started looking for the island. Eventually, the king learned that his son had discovered this wonderful fruit. He forgave Mai An Tiem and brought him home. This story teaches us to be resilient and creative in difficult times.",
      tips: ["Start with 'Once upon a time' or 'Long ago'", "Use past tenses correctly", "Include main events in order", "End with the moral lesson"]
    },
    reading: { 
      title: "The Importance of Folk Tales",
      passage: "Folk tales are traditional stories passed down through generations orally before being written down. Vietnamese folk tales are rich and diverse, reflecting the country's culture, values, and history. They typically feature common people, animals, fairies, and supernatural beings. Most folk tales contain moral lessons about virtues like kindness, honesty, hard work, and filial piety. Stories like 'The Story of Tam and Cam' teach that good triumphs over evil. 'The Watermelon Prince' shows the importance of resilience. 'The Legend of Lac Long Quan and Au Co' explains Vietnam's origins. Folk tales serve multiple purposes: they entertain, educate, and preserve cultural identity. They were especially important when few people could read, serving as the primary way to teach values to children. Today, while modern media offers many entertainment options, folk tales remain relevant. Schools teach them as part of cultural education. Parents still tell these stories to children at bedtime. Folk tales connect younger generations to their heritage and provide timeless wisdom applicable to modern life.",
      questions: [
        { question: "How were folk tales originally passed down?", options: ["In books", "Orally", "On TV", "Through email"], correctAnswer: 1 },
        { question: "What do most folk tales contain?", options: ["Jokes", "Recipes", "Moral lessons", "News"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "Write a Simple Folk Tale",
      type: "story",
      prompt: "Create a short folk tale with a moral lesson (140-160 words).",
      example: "Once upon a time, there was a poor but honest fisherman named Minh. Every day, he was fishing in the river to feed his family. One morning, while he was casting his net, he caught a beautiful golden fish. The fish spoke: 'Please release me, and I will grant you three wishes.' Minh was surprised but agreed. However, he only wished for enough food for his family. The grateful fish gave him a magic pot that produced rice whenever needed. Minh's greedy neighbor heard about this and went fishing. He also caught the golden fish and demanded ten wishes. The fish warned him to be modest, but the neighbor insisted. Angry, the fish disappeared, and the neighbor caught nothing ever again. Meanwhile, Minh and his family lived happily with their magic pot, sharing rice with neighbors in need. The moral of this story is that greed brings nothing but loss, while honesty and modesty are rewarded. We should be content with what we have and help others.",
      tips: ["Start with a traditional opening", "Use past tenses", "Include a problem and solution", "End with a clear moral"]
    }
  },

  {
    id: 31,
    unit: 7,
    title: "Pollution",
    description: "Learn about environmental pollution and solutions",
    level: "Lớp 8",
    grade: 8,
    topics: ["Environment", "Pollution", "Conditional type 1"],
    vocabulary: [
      { word: "pollution", pronunciation: "/pəˈluːʃn/", meaning: "ô nhiễm", example: "Air pollution is a serious problem." },
      { word: "contaminate", pronunciation: "/kənˈtæmɪneɪt/", meaning: "làm ô nhiễm", example: "Chemicals contaminate the water." },
      { word: "dump", pronunciation: "/dʌmp/", meaning: "đổ, vứt", example: "Don't dump waste into rivers." },
      { word: "poisonous", pronunciation: "/ˈpɔɪzənəs/", meaning: "độc hại", example: "Poisonous gases harm our health." },
      { word: "radioactive", pronunciation: "/ˌreɪdiəʊˈæktɪv/", meaning: "phóng xạ", example: "Radioactive waste is dangerous." },
      { word: "thermal", pronunciation: "/ˈθɜːml/", meaning: "nhiệt", example: "Thermal pollution affects aquatic life." }
    ],
    grammar: [
      { title: "Conditional sentences type 1", explanation: "Real conditions in present/future", examples: ["If we pollute the water, fish will die.", "If you recycle, you will help the environment."], rule: "If + present simple, will + base verb" },
      { title: "Conditional type 1 variations", explanation: "Using can, may, should", examples: ["If we reduce waste, we can save resources.", "If it rains, we should stay inside."], rule: "If + present simple, modal + base verb" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "If we ___ trees, we will have more oxygen.", options: ["plant", "plants", "planted", "will plant"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "We will reduce pollution if we ___ public transport.", options: ["used", "use", "will use", "using"], correctAnswer: 1 }
    ],
    listening: {
      title: "Types of Pollution",
      audioScript: "There are many types of pollution affecting our planet. Air pollution comes from vehicle emissions, factories, and burning fossil fuels. It causes respiratory diseases and climate change. Water pollution occurs when harmful substances contaminate rivers, lakes, and oceans. It kills aquatic life and makes water unsafe to drink. Soil pollution results from pesticides, industrial waste, and littering, making land infertile. Noise pollution from traffic and construction affects our health and well-being. Light pollution from excessive artificial lighting disturbs ecosystems. If we don't act now, pollution will worsen. However, if everyone makes small changes, we can make a big difference.",
      questions: [
        { question: "What causes air pollution?", options: ["Clean energy", "Vehicle emissions", "Planting trees", "Recycling"], correctAnswer: 1 },
        { question: "What does water pollution kill?", options: ["Plants only", "Nothing", "Aquatic life", "Birds only"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "Environmental Problems and Solutions",
      type: "discussion",
      prompt: "Talk about pollution in your area and suggest solutions.",
      example: "In my city, air pollution is a major problem. There are too many vehicles on the roads, and exhaust fumes make the air dirty. Factories also release smoke and chemicals. This pollution affects our health, causing coughs and breathing problems. If the government builds more public transportation, fewer people will use private vehicles. If factories install filters, they will reduce emissions. We can also help by planting trees. If every family plants just one tree, we will have cleaner air. Additionally, if we use bicycles for short distances, we will reduce pollution and improve our health. We must act now because if we wait, the problem will get worse.",
      tips: ["Identify specific pollution types", "Explain causes and effects", "Suggest practical solutions", "Use conditional sentences"]
    },
    reading: { 
      title: "Plastic Pollution Crisis",
      passage: "Plastic pollution has become one of the world's most pressing environmental issues. Every year, millions of tons of plastic waste enter our oceans, harming marine life and ecosystems. Plastic doesn't decompose naturally; it breaks into smaller pieces called microplastics that persist for hundreds of years. Sea animals mistake plastic for food and die from ingestion or entanglement. Microplastics have entered the food chain, potentially affecting human health. The problem extends beyond oceans. Plastic litter covers beaches, parks, and streets worldwide. If current trends continue, there will be more plastic than fish in the ocean by 2050. However, solutions exist. If governments ban single-use plastics, waste will decrease significantly. If companies use biodegradable materials, environmental damage will reduce. If individuals refuse, reduce, reuse, and recycle plastic, collective impact can be substantial. Many countries are taking action: Kenya banned plastic bags, the EU restricted single-use plastics, and some cities tax plastic products. But global cooperation is essential. If we all work together, we can solve this crisis.",
      questions: [
        { question: "How long does plastic persist?", options: ["Weeks", "Months", "Hundreds of years", "Days"], correctAnswer: 2 },
        { question: "What can reduce plastic waste?", options: ["Using more plastic", "Banning single-use plastics", "Ignoring the problem", "Burning plastic"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "Environmental Protection",
      type: "essay",
      prompt: "Write about pollution and how we can protect the environment (150-170 words).",
      example: "Pollution is one of the biggest threats to our planet today. It affects the air we breathe, the water we drink, and the soil that grows our food. The main causes of pollution include industrial activities, vehicle emissions, deforestation, and improper waste disposal. If we don't take action immediately, the consequences will be catastrophic - more diseases, loss of biodiversity, and climate change. Fortunately, everyone can contribute to solving this problem. If we reduce, reuse, and recycle, we will produce less waste. If we use public transportation or bicycles instead of cars, we will decrease air pollution. If we plant more trees, they will absorb carbon dioxide and produce oxygen. If governments enforce stricter environmental laws, industries will pollute less. Education is also crucial; if we teach children about environmental protection, they will develop eco-friendly habits. Small actions matter. If each person makes environmentally conscious choices daily, together we can create significant change. The Earth is our only home, and if we protect it now, future generations will have a healthy planet to inherit.",
      tips: ["Introduce the problem", "Explain causes and effects", "Suggest multiple solutions using conditionals", "Conclude with call to action"]
    }
  },

  {
    id: 32,
    unit: 8,
    title: "English Speaking Countries",
    description: "Explore English-speaking countries and their cultures",
    level: "Lớp 8",
    grade: 8,
    topics: ["Countries", "Culture", "Present tenses review"],
    vocabulary: [
      { word: "native", pronunciation: "/ˈneɪtɪv/", meaning: "bản ngữ, bản xứ", example: "He is a native English speaker." },
      { word: "accent", pronunciation: "/ˈæksent/", meaning: "giọng", example: "British and American accents are different." },
      { word: "official", pronunciation: "/əˈfɪʃl/", meaning: "chính thức", example: "English is the official language." },
      { word: "unique", pronunciation: "/juˈniːk/", meaning: "độc đáo", example: "Each country has unique traditions." },
      { word: "iconic", pronunciation: "/aɪˈkɒnɪk/", meaning: "biểu tượng", example: "The Statue of Liberty is iconic." },
      { word: "multicultural", pronunciation: "/ˌmʌltiˈkʌltʃərəl/", meaning: "đa văn hóa", example: "Australia is a multicultural society." }
    ],
    grammar: [
      { title: "Present simple review", explanation: "Facts and habits", examples: ["English is spoken in many countries.", "Australians celebrate Christmas in summer."], rule: "Subject + V(s/es)" },
      { title: "Present continuous review", explanation: "Actions happening now or around now", examples: ["Tourism is growing in New Zealand.", "The population is increasing."], rule: "am/is/are + V-ing" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "English ___ the official language of Canada.", options: ["is", "are", "be", "am"], correctAnswer: 0 },
      { id: 2, type: "multiple-choice", question: "The number of tourists ___ increasing.", options: ["is", "are", "be", "were"], correctAnswer: 0 }
    ],
    listening: {
      title: "English Around the World",
      audioScript: "English is one of the most widely spoken languages in the world. It is the official language in over 50 countries, including the UK, USA, Canada, Australia, and New Zealand. However, each country has its own variety of English with unique vocabulary, pronunciation, and accents. British English and American English have many differences. For example, Brits say 'flat' while Americans say 'apartment.' Australians have their own slang like 'G'day' for 'Good day.' English is also important as a global language for business, science, and technology. Learning English opens doors to international communication and opportunities.",
      questions: [
        { question: "How many countries have English as official language?", options: ["20", "30", "Over 50", "100"], correctAnswer: 2 },
        { question: "What do Americans call a 'flat'?", options: ["House", "Apartment", "Room", "Building"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "An English-Speaking Country",
      type: "presentation",
      prompt: "Talk about an English-speaking country you would like to visit.",
      example: "I would love to visit Australia. It is a large country in the Southern Hemisphere and is famous for its unique wildlife, beautiful beaches, and iconic landmarks. Australia's official language is English, but Australians have a distinctive accent and use interesting slang. The capital is Canberra, but Sydney is the most well-known city with its famous Opera House and Harbor Bridge. Australia is home to unique animals like kangaroos, koalas, and platypuses. The Great Barrier Reef, the world's largest coral reef system, is located there. Australian culture is laid-back and friendly. People enjoy outdoor activities like surfing and barbecues. I'm fascinated by Australia's natural beauty and diverse landscapes, from tropical rainforests to vast deserts. I hope to visit someday.",
      tips: ["Introduce the country", "Describe location and language", "Mention famous places and culture", "Explain why you're interested"]
    },
    reading: { 
      title: "The United Kingdom",
      passage: "The United Kingdom consists of four countries: England, Scotland, Wales, and Northern Ireland. Located off the northwestern coast of Europe, the UK has a rich history spanning thousands of years. London, the capital, is one of the world's most influential cities, known for Big Ben, the Tower of London, and Buckingham Palace. The UK has given the world many things: the English language, parliamentary democracy, Shakespeare, the Beatles, and Harry Potter. British culture values tradition alongside modernity. The Royal Family remains an important symbol, though the government is a constitutional monarchy with an elected Parliament. Scottish bagpipes, Welsh rugby, and Irish folk music reflect regional diversity. The UK experiences mild weather with frequent rain, leading to the stereotype of Brits always carrying umbrellas. British people are often perceived as polite and reserved, famous for queuing patiently. Tea drinking is a beloved tradition. The UK has influenced global culture through literature, music, fashion, and sport. Despite its small size, it remains a major economic and cultural power.",
      questions: [
        { question: "How many countries make up the UK?", options: ["Two", "Three", "Four", "Five"], correctAnswer: 2 },
        { question: "What is the UK's capital?", options: ["Manchester", "Edinburgh", "London", "Cardiff"], correctAnswer: 2 }
      ]
    },
    writing: { 
      title: "An English-Speaking Country",
      type: "paragraph",
      prompt: "Write about an English-speaking country (130-150 words).",
      example: "Canada is the second-largest country in the world by area, located in North America. It has two official languages: English and French, reflecting its British and French colonial history. Canada is famous for its stunning natural beauty, including the Rocky Mountains, Niagara Falls, and vast forests. The capital is Ottawa, but Toronto, Vancouver, and Montreal are larger and more well-known cities. Canadians are known for being friendly, polite, and welcoming to immigrants. Canada is a multicultural country where people from all over the world live together peacefully. The country experiences extreme weather, with very cold winters and warm summers. Ice hockey is the most popular sport, and maple syrup is a national symbol. Canada's education and healthcare systems are excellent. The country is politically stable and economically developed. Many people consider Canada one of the best countries to live in because of its high quality of life, safety, and natural beauty.",
      tips: ["Introduce the country and location", "Mention language and culture", "Describe famous features", "Add interesting facts"]
    }
  },

  {
    id: 33,
    unit: 9,
    title: "Natural Disasters",
    description: "Learn about natural disasters and safety measures",
    level: "Lớp 8",
    grade: 8,
    topics: ["Disasters", "Safety", "Passive voice"],
    vocabulary: [
      { word: "earthquake", pronunciation: "/ˈɜːθkweɪk/", meaning: "động đất", example: "The earthquake destroyed many buildings." },
      { word: "tsunami", pronunciation: "/tsuːˈnɑːmi/", meaning: "sóng thần", example: "A tsunami hit the coastal area." },
      { word: "typhoon", pronunciation: "/taɪˈfuːn/", meaning: "bão nhiệt đới", example: "The typhoon caused severe flooding." },
      { word: "drought", pronunciation: "/draʊt/", meaning: "hạn hán", example: "The drought lasted for months." },
      { word: "erupt", pronunciation: "/ɪˈrʌpt/", meaning: "phun trào", example: "The volcano erupted suddenly." },
      { word: "evacuate", pronunciation: "/ɪˈvækjueɪt/", meaning: "sơ tán", example: "People were evacuated before the storm." }
    ],
    grammar: [
      { title: "Passive voice - Present simple", explanation: "Focus on action, not doer", examples: ["Many houses are destroyed by typhoons.", "People are warned about disasters."], rule: "am/is/are + past participle" },
      { title: "Passive voice - Past simple", explanation: "Past actions with unknown or unimportant doer", examples: ["The village was flooded last week.", "Many people were rescued."], rule: "was/were + past participle" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "Many buildings ___ by the earthquake.", options: ["destroy", "destroyed", "were destroyed", "are destroying"], correctAnswer: 2 },
      { id: 2, type: "multiple-choice", question: "Food and water ___ to the victims now.", options: ["are being sent", "is sending", "sent", "send"], correctAnswer: 0 }
    ],
    listening: {
      title: "Preparing for Natural Disasters",
      audioScript: "Natural disasters can happen without warning, so preparation is essential. Before a disaster strikes, emergency kits should be prepared with food, water, medicines, and flashlights. Important documents should be kept in waterproof bags. Family members should know evacuation routes and meeting points. During a typhoon, windows must be secured and people should stay indoors. If an earthquake occurs, people should drop, cover, and hold on under sturdy furniture. After a disaster, damaged areas should be avoided, and only safe water should be drunk. Help should be offered to neighbors who need it. Following these safety measures can save lives.",
      questions: [
        { question: "What should be prepared before a disaster?", options: ["Nothing", "Emergency kits", "Party supplies", "Toys"], correctAnswer: 1 },
        { question: "What should you do during an earthquake?", options: ["Run outside", "Drop, cover, hold on", "Stand still", "Jump"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Natural Disaster Experience",
      type: "presentation",
      prompt: "Talk about a natural disaster and how to stay safe.",
      example: "Typhoons are common natural disasters in Vietnam, especially in central regions. A typhoon is a powerful tropical storm with strong winds and heavy rain. Last year, our area was hit by a severe typhoon. Days before, warnings were broadcast on TV and radio. People prepared by securing their houses, storing food and water, and moving to safe areas. When the typhoon arrived, trees were blown down, roofs were damaged, and streets were flooded. Electricity was cut off for several days. After the storm, rescue teams were sent to help affected areas. Temporary shelters were set up for people whose homes were destroyed. To stay safe during typhoons, we should follow weather forecasts, prepare emergency supplies, and evacuate if ordered. We shouldn't go outside during the storm.",
      tips: ["Identify the disaster type", "Describe what happens", "Explain safety measures", "Share experience if you have one"]
    },
    reading: { 
      title: "Climate Change and Natural Disasters",
      passage: "Natural disasters have always occurred, but climate change is making them more frequent and severe. Rising global temperatures cause extreme weather events. Hurricanes and typhoons are becoming stronger due to warmer ocean waters. Droughts are lasting longer in some regions, while others experience unprecedented flooding. Glaciers are melting, contributing to sea level rise and threatening coastal communities. Wildfires are spreading more rapidly in hotter, drier conditions. Scientists warn that if greenhouse gas emissions aren't reduced, disasters will intensify. However, technology helps predict and prepare for disasters better than before. Early warning systems are installed in vulnerable areas. Satellites monitor weather patterns. Buildings are designed to withstand earthquakes and strong winds. Despite these advances, prevention is better than cure. If we reduce carbon emissions and protect natural environments like forests and wetlands, we can mitigate climate change impacts. Governments, businesses, and individuals must work together. Every action counts in building a more resilient world.",
      questions: [
        { question: "What makes disasters more severe?", options: ["Technology", "Climate change", "Buildings", "Satellites"], correctAnswer: 1 },
        { question: "What helps predict disasters?", options: ["Ignoring them", "Early warning systems", "Hoping", "Nothing"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "Natural Disaster Safety",
      type: "paragraph",
      prompt: "Write about a natural disaster and how to prepare for it (130-150 words).",
      example: "Earthquakes are one of the most dangerous natural disasters because they strike suddenly without warning. An earthquake occurs when tectonic plates beneath the Earth's surface shift, causing the ground to shake violently. Buildings can collapse, roads can crack, and tsunamis may be triggered if the earthquake happens under the ocean. Although earthquakes cannot be prevented, proper preparation can save lives. Buildings should be constructed using earthquake-resistant designs. Heavy furniture should be secured to walls. Every family should have an emergency kit with water, food, first aid supplies, and a flashlight. During an earthquake, people should drop to the ground, take cover under sturdy furniture, and hold on until the shaking stops. If outdoors, they should move away from buildings and power lines. After the earthquake, gas lines should be checked for leaks, and aftershocks should be expected. Education and drills help people respond correctly when earthquakes occur.",
      tips: ["Describe the disaster", "Explain its dangers", "List preparation steps", "Describe safety actions during and after"]
    }
  },

  {
    id: 34,
    unit: 10,
    title: "Communication",
    description: "Learn about modern communication and technology",
    level: "Lớp 8",
    grade: 8,
    topics: ["Communication", "Technology", "Future tenses"],
    vocabulary: [
      { word: "communicate", pronunciation: "/kəˈmjuːnɪkeɪt/", meaning: "giao tiếp", example: "We communicate through social media." },
      { word: "video conference", pronunciation: "/ˈvɪdiəʊ ˈkɒnfərəns/", meaning: "hội nghị truyền hình", example: "We had a video conference with partners abroad." },
      { word: "body language", pronunciation: "/ˈbɒdi ˈlæŋɡwɪdʒ/", meaning: "ngôn ngữ cơ thể", example: "Body language is important in communication." },
      { word: "chat", pronunciation: "/tʃæt/", meaning: "trò chuyện", example: "I chat with friends online every day." },
      { word: "multimedia", pronunciation: "/ˌmʌltiˈmiːdiə/", meaning: "đa phương tiện", example: "Multimedia presentations are more engaging." },
      { word: "telepathy", pronunciation: "/təˈlepəθi/", meaning: "thần giao cách cảm", example: "Telepathy is communication through the mind." }
    ],
    grammar: [
      { title: "Future simple review", explanation: "Predictions and decisions", examples: ["In the future, we will communicate through holograms.", "I think robots will help us."], rule: "will + base verb" },
      { title: "Future continuous", explanation: "Actions in progress at a specific time in future", examples: ["This time tomorrow, I will be having a video call.", "At 8 PM tonight, we will be chatting online."], rule: "will be + V-ing" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "In 2050, people ___ through telepathy.", options: ["communicate", "will communicate", "communicated", "are communicating"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "At 3 PM tomorrow, I ___ a video conference.", options: ["will have", "will be having", "have", "had"], correctAnswer: 1 }
    ],
    listening: {
      title: "Evolution of Communication",
      audioScript: "Communication has evolved dramatically over time. In the past, people communicated face-to-face or through written letters that took days or weeks to arrive. The invention of the telephone revolutionized communication in the 19th century. The 20th century brought radio, television, and later, the internet. Today, we can instantly communicate with anyone worldwide through emails, text messages, and social media. Video calls let us see and talk to people thousands of miles away. In the future, communication will become even more advanced. Scientists predict that we will be using virtual reality and augmented reality for more immersive interactions. Some experts believe telepathy might become possible through brain-computer interfaces. Translation devices will break down language barriers instantly.",
      questions: [
        { question: "How did letters travel in the past?", options: ["Instantly", "In days or weeks", "In hours", "Never arrived"], correctAnswer: 1 },
        { question: "What will we use in the future?", options: ["Only letters", "Virtual reality", "No technology", "Smoke signals"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Future Communication",
      type: "discussion",
      prompt: "How do you think people will communicate in the future?",
      example: "I think communication will change dramatically in the future. First, I believe we will be using more virtual and augmented reality. Instead of video calls, we will meet in virtual spaces that feel almost real. Second, language barriers will disappear. Advanced translation devices will instantly translate any language, so everyone will be able to understand each other. Third, communication will become faster and more convenient. We might use brain-computer interfaces to send thoughts directly. Some scientists are already working on this technology. However, I hope people won't forget the importance of face-to-face communication. While technology is useful, nothing can replace real human interaction and body language. We should balance modern technology with traditional communication methods.",
      tips: ["Discuss technological advances", "Make predictions using future tenses", "Consider both benefits and concerns", "Give personal opinion"]
    },
    reading: { 
      title: "Non-verbal Communication",
      passage: "Communication is not just about words. Non-verbal communication, including body language, facial expressions, gestures, and tone of voice, conveys as much or more information than verbal communication. Research suggests that in face-to-face communication, only 7% of meaning comes from words, while 38% comes from tone of voice and 55% from body language. A smile can express friendliness across all cultures, though some gestures have different meanings in different countries. For example, a thumbs-up means 'good' in many Western countries but can be offensive in some Middle Eastern cultures. Eye contact also varies: in Western cultures, it shows confidence and honesty, while in some Asian cultures, too much eye contact can seem aggressive or disrespectful. Understanding non-verbal cues is crucial for effective communication, especially in our globalized world. In the digital age, where much communication happens through text and emails, we miss these non-verbal signals, leading to misunderstandings. Emojis and emoticons attempt to fill this gap by adding emotional context to written messages. As communication technology advances, video calls and virtual reality will restore some non-verbal elements. However, the richness of face-to-face interaction remains irreplaceable.",
      questions: [
        { question: "What percentage of meaning comes from body language?", options: ["7%", "38%", "55%", "100%"], correctAnswer: 2 },
        { question: "Why do we use emojis?", options: ["They're fun", "To add emotional context", "Everyone uses them", "No reason"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "Communication in the Future",
      type: "essay",
      prompt: "Write about how communication will change in the future (150-170 words).",
      example: "Communication technology is advancing rapidly, and the future promises even more exciting changes. In my opinion, several major developments will transform how we interact. First, virtual and augmented reality will become mainstream. Instead of simple video calls, people will be meeting in virtual environments that simulate physical presence. You will be able to attend meetings, classes, or social gatherings from anywhere in the world while feeling like you're actually there. Second, language barriers will disappear. Real-time translation devices will instantly convert any language, making global communication effortless. Third, brain-computer interfaces might enable telepathic communication. Scientists are already developing technology that can read brain signals and convert thoughts into messages. Fourth, holographic communication will allow 3D projections of people, making remote conversations more lifelike. However, these advances bring concerns. People might become too dependent on technology and lose face-to-face communication skills. Privacy could be threatened if thoughts can be read. Therefore, while embracing new technology, we must preserve human connection and protect personal boundaries. The future of communication will be exciting but requires responsible development.",
      tips: ["Introduce the topic", "Describe future technologies", "Use future tenses", "Discuss both benefits and concerns"]
    }
  },

  {
    id: 35,
    unit: 11,
    title: "Science and Technology",
    description: "Explore scientific and technological advancements",
    level: "Lớp 8",
    grade: 8,
    topics: ["Science", "Innovation", "Future continuous"],
    vocabulary: [
      { word: "invention", pronunciation: "/ɪnˈvenʃn/", meaning: "phát minh", example: "The Internet is a great invention." },
      { word: "robot", pronunciation: "/ˈrəʊbɒt/", meaning: "người máy", example: "Robots will do many tasks in the future." },
      { word: "artificial intelligence", pronunciation: "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", meaning: "trí tuệ nhân tạo", example: "AI is changing our lives." },
      { word: "laboratory", pronunciation: "/ləˈbɒrətri/", meaning: "phòng thí nghiệm", example: "Scientists work in laboratories." },
      { word: "breakthrough", pronunciation: "/ˈbreɪkθruː/", meaning: "đột phá", example: "This is a medical breakthrough." },
      { word: "explore", pronunciation: "/ɪkˈsplɔːr/", meaning: "khám phá", example: "Humans will explore Mars soon." }
    ],
    grammar: [
      { title: "Future continuous", explanation: "Actions happening at a specific time in future", examples: ["At 9 AM tomorrow, scientists will be conducting experiments.", "This time next year, we will be using new technology."], rule: "will be + V-ing" },
      { title: "Future continuous vs Future simple", explanation: "Different future meanings", examples: ["I will help you (decision).", "I will be helping you at 3 PM (action in progress)."], rule: "Future simple = decisions/predictions; Future continuous = actions in progress" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "At 10 AM tomorrow, robots ___ in factories.", options: ["will work", "will be working", "work", "worked"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "Scientists ___ a cure for cancer soon.", options: ["will find", "will be finding", "find", "found"], correctAnswer: 0 }
    ],
    listening: {
      title: "Robots in Daily Life",
      audioScript: "Robots are becoming increasingly common in our daily lives. In factories, industrial robots are assembling cars and electronic devices. In homes, robot vacuum cleaners are cleaning floors automatically. Some restaurants use robots to serve food. In hospitals, surgical robots are helping doctors perform precise operations. Japan and South Korea are leading in robot development, with robots caring for elderly people. In the future, robots will be doing even more tasks. They will be driving our cars, delivering packages, and teaching in classrooms. However, there are concerns. Some people worry that robots will take jobs from humans. Others fear becoming too dependent on technology. Despite these concerns, robots will continue advancing and improving our lives.",
      questions: [
        { question: "Where do industrial robots work?", options: ["In homes", "In factories", "In schools", "In parks"], correctAnswer: 1 },
        { question: "What is one concern about robots?", options: ["They're too colorful", "They take jobs", "They're too small", "They're too slow"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Technology and the Future",
      type: "presentation",
      prompt: "Talk about how technology will change our lives.",
      example: "Technology is developing extremely fast, and I believe it will transform our lives in amazing ways. In education, students will be learning through virtual reality instead of traditional classrooms. They will be exploring ancient Rome or the solar system as if they were really there. In healthcare, doctors will be using AI to diagnose diseases more accurately. Nanobots will be traveling through our bodies to fight illnesses. In transportation, self-driving cars will be taking us to our destinations safely while we relax or work. In our homes, smart systems will be controlling everything from temperature to security. However, we must be careful. We shouldn't let technology control us. We should use it wisely to improve our lives while maintaining human values and connections.",
      tips: ["Discuss different areas (education, health, transport)", "Use future continuous for ongoing future actions", "Consider both advantages and cautions", "Give specific examples"]
    },
    reading: { 
      title: "Artificial Intelligence",
      passage: "Artificial Intelligence (AI) is transforming the world at an unprecedented pace. AI refers to computer systems that can perform tasks normally requiring human intelligence, such as visual perception, speech recognition, decision-making, and language translation. AI is already integrated into our daily lives. Virtual assistants like Siri and Alexa use AI to understand and respond to our commands. Social media platforms use AI to recommend content. Online shopping sites use AI to suggest products based on browsing history. In healthcare, AI helps diagnose diseases by analyzing medical images. In finance, AI detects fraudulent transactions. Self-driving cars use AI to navigate roads safely. The potential benefits are enormous. AI could solve complex problems in climate change, disease treatment, and resource management. However, AI also raises concerns. Job displacement is a major worry as AI automates tasks previously done by humans. Privacy issues arise as AI systems collect and analyze vast amounts of personal data. Some experts warn about AI becoming too powerful and difficult to control. Ethical questions emerge: Who is responsible when an AI system makes a mistake? How do we ensure AI is used fairly and doesn't discriminate? As AI continues advancing, society must address these challenges while harnessing its potential for good.",
      questions: [
        { question: "What does AI stand for?", options: ["Advanced Internet", "Artificial Intelligence", "Automatic Information", "Applied Innovation"], correctAnswer: 1 },
        { question: "What is a major concern about AI?", options: ["It's too colorful", "Job displacement", "It's too slow", "It's too cheap"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "A Future Invention",
      type: "paragraph",
      prompt: "Describe an invention you think will exist in the future (130-150 words).",
      example: "In the future, I believe scientists will invent a universal translator device that makes communication across all languages instant and effortless. This small device will be worn like an earpiece or embedded in glasses. When someone speaks any language, the device will instantly translate it into your language in real-time. It will work both ways, translating your words into the listener's language. Unlike current translation apps that are sometimes inaccurate, this future device will use advanced AI to understand context, idioms, and cultural nuances perfectly. It will even translate sign languages and written text through visual recognition. This invention will revolutionize global communication, making travel easier, improving international business, and helping people connect across cultures. Language barriers will no longer exist, promoting better understanding and cooperation worldwide. Students will be studying any subject in any language. This device will truly make the world a smaller, more connected place.",
      tips: ["Describe the invention clearly", "Explain how it works", "Discuss its benefits", "Use future tenses appropriately"]
    }
  },

  {
    id: 36,
    unit: 12,
    title: "Life on Other Planets",
    description: "Explore the possibility of extraterrestrial life",
    level: "Lớp 8",
    grade: 8,
    topics: ["Space", "Planets", "May/Might for possibility"],
    vocabulary: [
      { word: "alien", pronunciation: "/ˈeɪliən/", meaning: "người ngoài hành tinh", example: "Do aliens exist?" },
      { word: "planet", pronunciation: "/ˈplænɪt/", meaning: "hành tinh", example: "Earth is the third planet from the Sun." },
      { word: "gravity", pronunciation: "/ˈɡrævəti/", meaning: "trọng lực", example: "The Moon has less gravity than Earth." },
      { word: "atmosphere", pronunciation: "/ˈætməsfɪər/", meaning: "khí quyển", example: "Mars has a thin atmosphere." },
      { word: "oxygen", pronunciation: "/ˈɒksɪdʒən/", meaning: "ôxy", example: "Humans need oxygen to breathe." },
      { word: "spacecraft", pronunciation: "/ˈspeɪskrɑːft/", meaning: "tàu vũ trụ", example: "The spacecraft landed on Mars." }
    ],
    grammar: [
      { title: "May/Might for possibility", explanation: "Express possibility or uncertainty", examples: ["There may be life on other planets.", "We might find water on Mars."], rule: "may/might + base verb" },
      { title: "Conditional sentences type 2 review", explanation: "Unreal or unlikely situations", examples: ["If I were an astronaut, I would travel to Mars.", "If aliens existed, we might meet them."], rule: "If + past simple, would/could/might + base verb" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "There ___ be water on Mars.", options: ["can", "may", "will", "must"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "If I ___ an alien, I would visit Earth.", options: ["am", "was", "were", "be"], correctAnswer: 2 }
    ],
    listening: {
      title: "Mars Exploration",
      audioScript: "Mars has fascinated humans for centuries. It is the fourth planet from the Sun and is often called the Red Planet because of its reddish color. Scientists believe Mars may have had water in the past, which means there might have been life there. NASA and other space agencies have sent many rovers to explore Mars. These robots are searching for signs of water and life. Mars has a thin atmosphere made mostly of carbon dioxide, so humans couldn't breathe there. The temperature is extremely cold, averaging minus 60 degrees Celsius. Despite the harsh conditions, scientists think humans might live on Mars in the future. They would need to build special habitats with oxygen and protection from radiation. Traveling to Mars takes about six to eight months with current technology.",
      questions: [
        { question: "Why is Mars called the Red Planet?", options: ["It's hot", "Its reddish color", "It's small", "It's far"], correctAnswer: 1 },
        { question: "What are rovers searching for?", options: ["Gold", "Signs of water and life", "Aliens", "Rocks only"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Life on Other Planets",
      type: "discussion",
      prompt: "Do you think there is life on other planets? Why or why not?",
      example: "I believe there may be life on other planets, although we haven't found definite proof yet. The universe is incredibly vast with billions of galaxies and trillions of planets. It seems unlikely that Earth is the only planet with life. Scientists have discovered planets in the 'habitable zone' where conditions might support life. They've found water on Mars and some moons of Jupiter and Saturn. However, this life might not be like humans or animals. It could be simple microorganisms like bacteria. If intelligent aliens exist, they might be very different from us, adapted to their planet's environment. Some people think aliens might have already visited Earth, but I'm skeptical about that. I think if we continue exploring space, we might eventually find evidence of extraterrestrial life. It would be the most exciting discovery in human history.",
      tips: ["State your opinion clearly", "Use may/might for possibilities", "Give reasons and examples", "Consider different perspectives"]
    },
    reading: { 
      title: "The Search for Extraterrestrial Life",
      passage: "Are we alone in the universe? This question has intrigued humanity for centuries. Scientists are actively searching for extraterrestrial life through various methods. The Search for Extraterrestrial Intelligence (SETI) uses radio telescopes to listen for signals from alien civilizations. So far, no confirmed signals have been detected. Astrobiologists study extreme environments on Earth where life survives in harsh conditions, helping them understand where life might exist elsewhere. NASA's rovers on Mars are searching for evidence of past or present microbial life. The discovery of extremophiles - organisms living in Earth's most extreme environments - has expanded ideas about where life could exist. Scientists have found planets in the habitable zone, the region around a star where liquid water could exist. Europa, Jupiter's moon, has an ocean beneath its icy surface that might harbor life. Enceladus, Saturn's moon, shoots water geysers into space, suggesting a subsurface ocean. The James Webb Space Telescope is analyzing the atmospheres of distant planets for biosignatures - gases that might indicate life. If life exists elsewhere, it may be very different from Earth's life forms, adapted to different environments and chemistry. The discovery of even simple microbial life would revolutionize our understanding of biology and our place in the cosmos.",
      questions: [
        { question: "What does SETI search for?", options: ["Rocks", "Water", "Signals from aliens", "Gold"], correctAnswer: 2 },
        { question: "What moon has an ocean beneath ice?", options: ["The Moon", "Europa", "Mars", "Venus"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "Imagine Life on Another Planet",
      type: "essay",
      prompt: "Imagine what life might be like on another planet (150-170 words).",
      example: "If humans colonize another planet in the future, life would be completely different from Earth. Let's imagine living on Mars. First, we would need to live in sealed habitats because Mars has no breathable atmosphere. These domes would contain oxygen and maintain suitable temperatures. We couldn't go outside without spacesuits because the atmosphere is mostly carbon dioxide and extremely cold. Food would be grown in greenhouses using artificial light and hydroponic systems since Mars has no fertile soil. Water would be precious and carefully recycled. Every drop would be reused. Communication with Earth would have a delay of several minutes because of the distance, making real-time conversations impossible. The reduced gravity on Mars - about 38% of Earth's - would affect our bodies. People might become taller but weaker. Children born on Mars might never be able to visit Earth because they wouldn't adapt to Earth's stronger gravity. Despite these challenges, living on Mars would offer unique experiences: stunning red sunsets, views of two moons, and the pride of being pioneers of a new world. Life would be difficult but meaningful.",
      tips: ["Describe living conditions", "Explain challenges and adaptations", "Use may/might/would for speculation", "Be creative but logical"]
    }
  },

  // ========== GRADE 9 (12 UNITS) ==========
  {
  "id": 37,
  "unit": 1,
  "title": "Local Community",
  "description": "Explore the members, activities and roles of the local community",
  "level": "Lớp 9",
  "grade": 9,
  "topics": ["Community", "Volunteer work", "Relative clauses"],
  "vocabulary": [
    { "word": "initiative", "pronunciation": "/ɪˈnɪʃətɪv/", "meaning": "sáng kiến", "example": "The community launched a recycling initiative." },
    { "word": "neighborly", "pronunciation": "/ˈneɪbəli/", "meaning": "thân thiện với hàng xóm", "example": "They have a neighborly relationship." },
    { "word": "civic", "pronunciation": "/ˈsɪvɪk/", "meaning": "thuộc công dân, dân sự", "example": "Civic duties include voting." },
    { "word": "amenity", "pronunciation": "/əˈmenəti/", "meaning": "tiện ích", "example": "The park is an important amenity." },
    { "word": "donation", "pronunciation": "/dəʊˈneɪʃən/", "meaning": "sự quyên góp", "example": "They made a donation to the food bank." },
    { "word": "grassroots", "pronunciation": "/ˈɡræsruːts/", "meaning": "từ cơ sở", "example": "A grassroots movement changed local policy." }
  ],
  "grammar": [
    { "title": "Relative clauses", "explanation": "Use who/which/that to give extra information", "examples": ["The volunteers who cleaned the park were students.", "The market that sells local food is busy."], "rule": "Use relative pronoun + clause to modify a noun" },
    { "title": "Modal verbs for advice", "explanation": "Use should/ought to/must to give recommendations", "examples": ["You should join a community club.", "The council must improve street lighting."], "rule": "Modal + base verb expresses advice or obligation" }
  ],
  "exercises": [
    { "id": 1, "type": "multiple-choice", "question": "The people ___ organized the event were experienced.", "options": ["who", "which", "where", "when"], "correctAnswer": 0 },
    { "id": 2, "type": "multiple-choice", "question": "You ____ volunteer to help the elderly every weekend.", "options": ["should", "might", "used to", "can"], "correctAnswer": 0 }
  ],
  "listening": {
    "title": "A Neighborhood Clean-up",
    "audioScript": "Last Saturday, a group of students organized a neighborhood clean-up. They collected rubbish, planted small trees and painted benches in the local park. The local council provided bags and gloves, while nearby shop owners donated drinks. Because many residents joined, the street looked much better by the afternoon. The event encouraged people to take responsibility for the environment and sparked ideas for more community activities.",
    "questions": [
      { "question": "What did the students do?", "options": ["Cook food", "Collect rubbish", "Play games", "Sell things"], "correctAnswer": 1 },
      { "question": "Who provided materials?", "options": ["Students", "Local council", "Tourists", "Shop owners"], "correctAnswer": 1 }
    ]
  },
  "speaking": {
    "title": "Describe Your Neighborhood",
    "type": "presentation",
    "prompt": "Describe your neighborhood and suggest one improvement.",
    "example": "My neighborhood has a small park where children play. Although it is pleasant, the playground equipment is old. Because safety is important, I suggest the council replace the swings and repaint the fences. If we organize a fundraiser, we can contribute to the cost.",
    "tips": ["Mention location and features", "Use relative clauses to describe places", "Give a clear suggestion using modal verbs"]
  },
  "reading": {
    "title": "The Value of Local Markets",
    "passage": "Local markets bring people together and support small producers. They provide fresh food and a place for social interaction. Although supermarkets are convenient, markets offer variety and cultural value. Vendors who sell traditional products keep local customs alive. Supporting markets helps the local economy and preserves identity.",
    "questions": [
      { "question": "What do local markets provide?", "options": ["Only cheap goods", "Fresh food and social space", "Machines", "Nothing"], "correctAnswer": 1 },
      { "question": "Why are local vendors important?", "options": ["They are expensive", "They keep customs alive", "They close markets", "They export goods"], "correctAnswer": 1 }
    ]
  },
  "writing": {
    "title": "A Short Proposal",
    "type": "paragraph",
    "prompt": "Write a short paragraph (80-100 words) proposing one idea to improve your local community.",
    "example": "To improve our neighborhood, I propose creating a community garden. Although space is limited, we can transform an empty lot into a green area. Volunteers would plant vegetables and flowers, and the produce could be shared among residents. Because gardening promotes cooperation and healthy eating, it would benefit everyone.",
    "tips": ["State the idea clearly", "Use because/although to explain benefits and challenges", "Keep it concise"]
  }
},

  {
    id: 38,
    unit: 2,
    title: "City Life",
    description: "Explore urban living and its challenges",
    level: "Lớp 9",
    grade: 9,
    topics: ["Urban life", "Problems", "Phrasal verbs"],
    vocabulary: [
      { word: "urban", pronunciation: "/ˈɜːbən/", meaning: "thành thị", example: "Urban areas are crowded." },
      { word: "metropolitan", pronunciation: "/ˌmetrəˈpɒlɪtən/", meaning: "đô thị lớn", example: "Ho Chi Minh is a metropolitan city." },
      { word: "skyscraper", pronunciation: "/ˈskaɪskreɪpər/", meaning: "nhà chọc trời", example: "The city has many skyscrapers." },
      { word: "traffic congestion", pronunciation: "/ˈtræfɪk kənˈdʒestʃən/", meaning: "tắc nghẽn giao thông", example: "Traffic congestion is a daily problem." },
      { word: "rush hour", pronunciation: "/rʌʃ aʊər/", meaning: "giờ cao điểm", example: "Avoid driving during rush hour." },
      { word: "infrastructure", pronunciation: "/ˈɪnfrəstrʌktʃər/", meaning: "cơ sở hạ tầng", example: "The city needs better infrastructure." }
    ],
    grammar: [
      { title: "Phrasal verbs", explanation: "Common phrasal verbs about city life", examples: ["The city is growing. = The city is getting bigger.", "I get around by bus. = I travel by bus.", "They set up a new business.", "We need to deal with pollution."], rule: "Verb + particle(s) = specific meaning" },
      { title: "Comparison of adjectives", explanation: "Compare city and countryside", examples: ["Cities are more crowded than villages.", "City life is as exciting as it is stressful.", "The bigger the city, the more problems it has."], rule: "Use comparative and superlative forms" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "The city is ___ than the countryside.", options: ["noisy", "noisier", "more noisy", "noisiest"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "I usually get ___ by bicycle.", options: ["around", "up", "off", "on"], correctAnswer: 0 }
    ],
    listening: {
      title: "Living in a Big City",
      audioScript: "Living in a big city has both advantages and disadvantages. On the positive side, cities offer better job opportunities and higher salaries. There are excellent schools, hospitals, and entertainment options. Public transportation helps people get around easily. Shopping malls, restaurants, and cultural venues are abundant. However, city life also has problems. Traffic congestion during rush hour can be terrible, and commuting takes hours. Air pollution from vehicles and factories affects health. The cost of living is much higher than in rural areas. Housing is expensive, and spaces are small. Cities are noisier and more stressful. Crime rates are higher. Despite these challenges, millions of people move to cities seeking better lives. They must learn to deal with urban problems while enjoying the opportunities cities provide.",
      questions: [
        { question: "What helps people get around in cities?", options: ["Horses", "Public transportation", "Walking only", "Nothing"], correctAnswer: 1 },
        { question: "What is a disadvantage of city life?", options: ["Fresh air", "Low prices", "Traffic congestion", "Quiet streets"], correctAnswer: 2 }
      ]
    },
    speaking: { 
      title: "City Life vs Rural Life",
      type: "discussion",
      prompt: "Compare living in a city with living in the countryside.",
      example: "City life and rural life are very different. Cities are much more crowded and noisier than villages. During rush hour, traffic congestion makes getting around difficult, while countryside roads are usually clear. Cities offer more job opportunities and higher salaries, but the cost of living is also higher. In the countryside, life is more peaceful and the air is fresher. People in cities have access to better facilities like schools, hospitals, and shopping centers. However, they deal with stress, pollution, and crowds. Countryside residents enjoy closer community bonds and connection to nature, but they have fewer entertainment options and job choices. Personally, I think each has advantages. If you want career opportunities and modern facilities, cities are better. If you prefer peace and nature, the countryside is ideal. The best solution might be living in a smaller city that offers opportunities while keeping some rural qualities.",
      tips: ["Use comparative forms", "Discuss advantages and disadvantages", "Give specific examples", "State personal preference"]
    },
    reading: { 
      title: "Urbanization Challenges",
      passage: "Urbanization is happening rapidly worldwide, with more people moving from rural areas to cities. By 2050, nearly 70% of the global population will live in urban areas. This shift brings both opportunities and challenges. Cities are economic engines, generating jobs, innovation, and growth. They offer better education, healthcare, and cultural experiences. However, rapid urbanization creates serious problems. Infrastructure can't keep up with population growth. Roads become congested, public transport is overwhelmed, and housing shortages force people into slums. Cities consume enormous amounts of energy and resources while producing vast quantities of waste and pollution. Water scarcity, inadequate sanitation, and environmental degradation are common issues. Social problems also arise. Income inequality widens as expensive housing pushes poor residents to outskirts. Crime rates increase in overcrowded areas. Mental health issues grow due to stress, isolation, and fast-paced lifestyles. However, sustainable urban planning can address these challenges. Smart cities use technology to manage traffic, energy, and waste efficiently. Green spaces improve air quality and residents' well-being. Affordable housing policies help diverse populations live together. Investing in public transportation reduces congestion and pollution. If cities are planned and managed well, they can be sustainable, livable, and prosperous.",
      questions: [
        { question: "What percentage will live in cities by 2050?", options: ["50%", "60%", "70%", "80%"], correctAnswer: 2 },
        { question: "What can smart cities manage efficiently?", options: ["Nothing", "Traffic, energy, waste", "Only traffic", "Only waste"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "Problems of City Life",
      type: "essay",
      prompt: "Write about problems of living in a big city and suggest solutions (170-190 words).",
      example: "Living in a big city offers many opportunities, but it also comes with significant problems that affect residents' quality of life. The most obvious issue is traffic congestion. During rush hour, roads are packed with vehicles, and commuters waste hours stuck in traffic. This causes stress and reduces productivity. Air pollution is another serious problem. Exhaust fumes from millions of vehicles, combined with factory emissions, create smog that harms health and causes respiratory diseases. The high cost of living is also challenging. Housing is extremely expensive, forcing many people to live far from their workplaces or in overcrowded conditions. Cities are also noisier and more stressful than rural areas, leading to mental health issues. Crime rates tend to be higher in urban areas. To address these problems, several solutions should be implemented. Governments must invest in public transportation systems to reduce car dependency. Building more subway lines and bus routes will ease traffic congestion. Promoting cycling and walking through better infrastructure would reduce pollution and improve health. Affordable housing policies are essential to help low-income residents. Creating green spaces and parks gives people places to relax and improves air quality. If cities implement these solutions, they will become more livable and sustainable for everyone.",
      tips: ["List main problems clearly", "Explain impact of each problem", "Suggest realistic solutions", "Use phrasal verbs and comparatives"]
    }
  },

  {
    id: 39,
    unit: 3,
    title: "Heathy living for teens",
    description: "Understand teenage stress and coping strategies",
    level: "Lớp 9",
    grade: 9,
    topics: ["Stress", "Mental health", "Reported speech"],
    vocabulary: [
      { word: "pressure", pronunciation: "/ˈpreʃər/", meaning: "áp lực", example: "Students face a lot of pressure." },
      { word: "stressed", pronunciation: "/strest/", meaning: "căng thẳng", example: "I feel stressed about exams." },
      { word: "frustrated", pronunciation: "/frʌˈstreɪtɪd/", meaning: "thất vọng, bực bội", example: "She's frustrated with her grades." },
      { word: "depressed", pronunciation: "/dɪˈprest/", meaning: "trầm cảm, chán nản", example: "He feels depressed lately." },
      { word: "cope with", pronunciation: "/kəʊp wɪð/", meaning: "đối phó với", example: "How do you cope with stress?" },
      { word: "counselor", pronunciation: "/ˈkaʊnsələr/", meaning: "cố vấn, tư vấn viên", example: "Talk to a school counselor." }
    ],
    grammar: [
      { title: "Reported speech - statements", explanation: "Report what someone said", examples: ["Direct: 'I am stressed.' → Reported: She said (that) she was stressed.", "Direct: 'I will study harder.' → Reported: He said he would study harder."], rule: "Change tense, pronouns, and time expressions" },
      { title: "Reported speech - questions", explanation: "Report questions", examples: ["Direct: 'Are you stressed?' → Reported: She asked if/whether I was stressed.", "Direct: 'What do you do?' → Reported: He asked what I did."], rule: "Use if/whether for yes/no questions; use question word for wh-questions; change to statement word order" }
    ],
    exercises: [
      { id: 1, type: "multiple-choice", question: "She said she ___ stressed about the exam.", options: ["is", "was", "has been", "will be"], correctAnswer: 1 },
      { id: 2, type: "multiple-choice", question: "He asked me ___ I felt better.", options: ["that", "if", "what", "why"], correctAnswer: 1 }
    ],
    listening: {
      title: "Teen Stress Sources",
      audioScript: "Teenagers today face many sources of stress. A recent survey asked students about their main worries. Most students said they felt pressured about academic performance. They reported that their parents expected them to get high grades and attend good universities. Many said they were stressed about exams and homework. Some students mentioned they were worried about their appearance and fitting in with peers. Others said they felt anxious about their future careers. Social media also creates pressure - teens compare themselves to others and worry about likes and comments. One student said he was frustrated because he couldn't balance schoolwork and his social life. A girl reported that she felt depressed when her friends excluded her. Experts recommend that teens talk to counselors, do physical exercise, and practice relaxation techniques to cope with stress.",
      questions: [
        { question: "What do most students feel pressured about?", options: ["Sports", "Academic performance", "Money", "Games"], correctAnswer: 1 },
        { question: "What do experts recommend?", options: ["Ignore stress", "Talk to counselors and exercise", "Quit school", "Use social media more"], correctAnswer: 1 }
      ]
    },
    speaking: { 
      title: "Dealing with Stress",
      type: "discussion",
      prompt: "Talk about what causes you stress and how you deal with it.",
      example: "Like most teenagers, I experience stress from various sources. My main source of pressure is academic expectations. My parents always say that I must study hard to have a good future. They tell me that I should get into a top university. Sometimes I feel like their expectations are too high. I also feel stressed about exams. My teachers say that these exams will determine our future, which makes me anxious. Social pressures add to my stress too. My friends often talk about the latest trends, and I sometimes feel frustrated when I can't keep up. To cope with stress, I use several strategies. First, I talk to my close friends about my problems. They usually understand because they face similar pressures. I also exercise regularly - running helps me clear my mind. When I feel overwhelmed, I listen to music or read books to relax. My counselor told me that taking breaks is important, so I try not to study for too long without rest. These methods help me manage stress better.",
      tips: ["Identify your stress sources", "Use reported speech when quoting others", "Describe coping strategies", "Be honest about feelings"]
    },
    reading: { 
      title: "Mental Health Awareness",
      passage: "Mental health awareness among teenagers is increasingly important as stress and anxiety levels rise. Recent studies show that more teenagers are experiencing mental health issues than previous generations. Researchers report that social media, academic pressure, and family expectations contribute significantly to teen stress. Psychologists say that many teenagers don't seek help because they're embarrassed or don't recognize their problems. Signs of mental health issues include persistent sadness, loss of interest in activities, changes in sleep or eating patterns, difficulty concentrating, and physical symptoms like headaches. Experts emphasize that mental health is as important as physical health. They recommend that teenagers who feel overwhelmed should talk to trusted adults - parents, teachers, or counselors. Schools are implementing mental health programs. Teachers are being trained to recognize signs of distress. Some schools have introduced meditation and mindfulness classes. Counselors work with students to develop coping strategies. They teach stress management techniques like deep breathing, exercise, and time management. Parents play a crucial role too. Experts advise that parents should create open communication, avoid excessive pressure, and show understanding rather than judgment. They suggest that families should spend quality time together and maintain realistic expectations. If problems persist, professional help from psychologists or therapists may be necessary. The message is clear: it's okay not to be okay, and asking for help is a sign of strength, not weakness.",
      questions: [
        { question: "What contributes to teen stress?", options: ["Nothing", "Social media and academic pressure", "Only weather", "Only food"], correctAnswer: 1 },
        { question: "Who should teenagers talk to?", options: ["No one", "Trusted adults", "Only strangers", "Only celebrities"], correctAnswer: 1 }
      ]
    },
    writing: { 
      title: "Teen Stress and Solutions",
      type: "essay",
      prompt: "Write about causes of teen stress and suggest ways to cope (180-200 words).",
      example: "Teenagers today face unprecedented levels of stress and pressure from multiple sources. Psychologists report that teen mental health issues have increased significantly in recent years. The main causes are academic pressure, social expectations, and family demands. Many students say they feel pressured to achieve perfect grades. Their teachers tell them that their exam results will determine their entire future. Parents often say their children must attend prestigious universities to succeed. This creates enormous pressure. Social media adds another layer of stress. Teenagers compare themselves constantly to others' seemingly perfect lives. My friends often say they feel inadequate when they see others' achievements online. Peer pressure is also significant. Students report that they feel stressed about fitting in, wearing trendy clothes, and having many friends. Family problems, such as parental conflicts or financial difficulties, contribute to teen anxiety. Experts emphasize that teenagers need effective coping strategies. Counselors recommend that teens should talk openly about their feelings with trusted adults. They suggest that regular physical exercise significantly reduces stress hormones. Teachers advise that students should practice time management to balance study and relaxation. Psychologists say that teens must learn to set realistic goals and accept that perfection is impossible. Parents should understand that excessive pressure harms rather than helps. They should say supportive things and show unconditional love. Schools must provide counseling services and mental health education. If we address teen stress comprehensively, we can help young people develop resilience and lead healthier, happier lives.",
      tips: ["Identify multiple stress sources", "Use reported speech to cite opinions", "Suggest practical solutions", "Include advice from experts and personal views"]
    }
  },

  {
  "id": 40,
  "unit": 4,
  "title": "Remembering the Past",
  "description": "Learn about memories, historical events, and how to talk about the past",
  "level": "Lớp 9",
  "grade": 9,
  "topics": ["Memories", "Past experiences", "Used to"],
  "vocabulary": [
    { "word": "nostalgic", "pronunciation": "/nɒˈstældʒɪk/", "meaning": "hoài niệm", "example": "She felt nostalgic when she saw her old school." },
    { "word": "artifact", "pronunciation": "/ˈɑːtɪfækt/", "meaning": "hiện vật", "example": "The museum displayed ancient artifacts." },
    { "word": "heritage", "pronunciation": "/ˈherɪtɪdʒ/", "meaning": "di sản", "example": "We should protect our cultural heritage." },
    { "word": "reminisce", "pronunciation": "/ˌremɪˈnɪs/", "meaning": "hồi tưởng", "example": "They reminisced about their childhood." },
    { "word": "preserve", "pronunciation": "/prɪˈzɜːv/", "meaning": "bảo tồn", "example": "Old photos help preserve memories." },
    { "word": "decade", "pronunciation": "/ˈdekeɪd/", "meaning": "thập kỉ", "example": "A lot has changed over the past decade." }
  ],
  "grammar": [
    { 
      "title": "Used to",
      "explanation": "Use 'used to' to talk about past habits or states that no longer happen",
      "examples": ["I used to walk to school.", "There used to be a cinema here."],
      "rule": "used to + base verb describes a past habit or repeated action"
    },
    { 
      "title": "Past simple vs. Past continuous",
      "explanation": "Use past simple for completed actions; past continuous for actions in progress",
      "examples": ["I was walking when it started to rain.", "She visited her grandparents last weekend."],
      "rule": "past simple = finished action; past continuous = background action"
    }
  ],
  "exercises": [
    { "id": 1, "type": "multiple-choice", "question": "I ___ play hide and seek when I was a child.", "options": ["used to", "use to", "am used to", "was use to"], "correctAnswer": 0 },
    { "id": 2, "type": "multiple-choice", "question": "They were cooking dinner when the lights ____.", "options": ["go out", "went out", "are going out", "gone"], "correctAnswer": 1 }
  ],
  "listening": {
    "title": "A Visit to the Old Village",
    "audioScript": "Last month, Minh returned to his old village with his parents. The village had changed a lot, but some familiar places remained. He visited the small bridge where he used to catch fish with his friends. He also saw the old banyan tree, which the villagers have preserved for decades. Although many new houses were built, the village still kept its peaceful atmosphere.",
    "questions": [
      { "question": "What did Minh used to do at the bridge?", "options": ["Swim", "Catch fish", "Study", "Wash clothes"], "correctAnswer": 1 },
      { "question": "What has the village preserved?", "options": ["A school", "The banyan tree", "A market", "A temple"], "correctAnswer": 1 }
    ]
  },
  "speaking": {
    "title": "Talk About a Childhood Memory",
    "type": "presentation",
    "prompt": "Describe a childhood memory and explain why it is special.",
    "example": "One of my favourite childhood memories is playing in my grandparents' garden. We used to climb trees and pick mangoes. Although the garden was small, it felt magical. This memory is special because it reminds me of simple, happy times with my cousins.",
    "tips": ["Use 'used to' for past habits", "Explain the time, place, and people involved", "Say why the memory is meaningful"]
  },
  "reading": {
    "title": "Saving Family History",
    "passage": "Family history helps us understand who we are and where we come from. Old photos, letters, and objects preserve the stories of earlier generations. Although technology changes quickly, these memories stay valuable. People who record their family history protect traditions and strengthen connections between the past and the present.",
    "questions": [
      { "question": "What helps preserve family stories?", "options": ["New smartphones", "Old photos and letters", "Only videos", "Music"], "correctAnswer": 1 },
      { "question": "Why is family history important?", "options": ["It is expensive", "It helps connect past and present", "It replaces traditions", "It changes quickly"], "correctAnswer": 1 }
    ]
  },
  "writing": {
    "title": "Write About a Tradition",
    "type": "paragraph",
    "prompt": "Write a paragraph (80–100 words) describing a tradition your family or community has kept.",
    "example": "My family has kept the tradition of gathering for a big meal every Lunar New Year. We used to prepare the dishes together, and my grandmother always told stories about the past. Although our lives are busy now, we still try to continue this tradition because it brings everyone closer and helps us remember our roots.",
    "tips": ["Describe what the tradition is", "Explain its history", "Use past simple and 'used to'"]
  }
}
];

// Helper functions
export function getAllGrades(): Array<6 | 7 | 8 | 9> {
  return [6, 7, 8, 9];
}

export function getLessonsByGrade(grade: 6 | 7 | 8 | 9): Lesson[] {
  return lessons.filter(lesson => lesson.grade === grade);
}
