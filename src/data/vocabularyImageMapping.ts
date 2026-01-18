/**
 * VOCABULARY IMAGE MAPPING SYSTEM
 * Maps vocabulary words to appropriate Unsplash search queries
 * Ensures relevant, high-quality images for each word
 */

// Category-based image mapping for better organization
type VocabularyCategory = 
  | 'school' | 'house' | 'personality' | 'places' | 'nature' 
  | 'food' | 'sports' | 'technology' | 'entertainment' | 'travel'
  | 'science' | 'career' | 'abstract';

/**
 * Maps specific words to their best Unsplash search queries
 * Use specific, visual terms that yield good results on Unsplash
 */
const specificWordImageMap: Record<string, string> = {
  // School & Education
  "pencil case": "pencil case stationery",
  "compass": "geometry compass drawing",
  "calculator": "calculator math",
  "rubber": "eraser rubber",
  "notebook": "notebook writing",
  "school bag": "backpack school",
  "ruler": "ruler measure",
  "uniform": "school uniform students",
  "playground": "school playground children",
  "library": "library books shelves",
  "canteen": "school cafeteria",
  "laboratory": "science laboratory",
  "blackboard": "chalkboard classroom",
  "timetable": "schedule planner",
  "classmate": "students classroom",
  "headmaster": "school principal",
  "homework": "homework study desk",
  "lesson": "classroom teaching",
  "exercise": "exercise book writing",
  "exam": "exam test paper",
  
  // House & Home
  "living room": "modern living room",
  "kitchen": "modern kitchen",
  "bathroom": "modern bathroom",
  "bedroom": "bedroom interior",
  "dining room": "dining room table",
  "attic": "attic room interior",
  "basement": "basement room",
  "wardrobe": "wardrobe closet",
  "ceiling": "ceiling interior",
  "drawer": "drawer cabinet",
  "balcony": "balcony apartment",
  "hallway": "hallway corridor",
  "staircase": "staircase stairs",
  "garage": "garage car",
  "garden": "home garden flowers",
  "fence": "fence yard",
  "gate": "house gate entrance",
  "roof": "house roof",
  "chimney": "chimney roof",
  "window": "window view",
  "sofa": "comfortable sofa",
  "curtain": "window curtains",
  "carpet": "carpet rug",
  "pillow": "pillow bed",
  "blanket": "blanket bed",
  "mirror": "mirror reflection",
  "lamp": "table lamp",
  "sink": "kitchen sink",
  "fridge": "refrigerator kitchen",
  "oven": "oven kitchen",
  
  // Personality & Traits
  "friendly": "friends smiling happy",
  "kind": "kindness helping",
  "helpful": "helping hand support",
  "cheerful": "cheerful person smiling",
  "honest": "trust honesty",
  "patient": "patience calm",
  "creative": "creative art painting",
  "confident": "confident person",
  "shy": "shy person",
  "talkative": "people talking conversation",
  "polite": "polite greeting",
  "hardworking": "studying hard work",
  "lazy": "lazy person sleeping",
  "funny": "laughing funny",
  "clever": "smart thinking",
  "brave": "courage brave",
  "caring": "caring love heart",
  "generous": "generosity giving",
  "reliable": "trust reliable",
  "loyal": "loyalty friendship",
  
  // Places & Neighbourhood
  "bakery": "bakery bread shop",
  "pharmacy": "pharmacy drugstore",
  "post office": "post office mail",
  "market": "market vegetables",
  "cinema": "cinema theater",
  "museum": "museum art",
  "hospital": "hospital building",
  "restaurant": "restaurant dining",
  "café": "cafe coffee shop",
  "supermarket": "supermarket shopping",
  "bank": "bank building",
  "temple": "temple buddhist",
  "bridge": "bridge river",
  "statue": "statue monument",
  "square": "town square plaza",
  "avenue": "avenue street trees",
  "pavement": "sidewalk pavement",
  "crossroads": "crossroads intersection",
  "fountain": "fountain water",
  
  // Nature & Travel
  "mountain": "mountain landscape",
  "river": "river flowing water",
  "lake": "lake scenic view",
  "forest": "forest trees nature",
  "beach": "beach ocean sand",
  "ocean": "ocean waves blue",
  "island": "tropical island",
  "desert": "desert sand dunes",
  "valley": "valley mountains",
  "waterfall": "waterfall nature",
  "cave": "cave rock formation",
  "cliff": "cliff ocean view",
  "hill": "green hill landscape",
  "field": "field grass meadow",
  "countryside": "countryside rural",
  "village": "village houses",
  "path": "path trail nature",
  "scenery": "scenic landscape",
  "view": "panoramic view",
  
  // Food & Cooking
  "vegetable": "fresh vegetables",
  "fruit": "fresh fruits colorful",
  "meat": "meat food",
  "fish": "fish fresh",
  "rice": "rice bowl",
  "bread": "fresh bread",
  "butter": "butter spread",
  "cheese": "cheese varieties",
  "milk": "milk glass",
  "egg": "eggs fresh",
  "sugar": "sugar cubes",
  "salt": "sea salt",
  "pepper": "black pepper",
  "oil": "olive oil",
  "soup": "soup bowl",
  "salad": "fresh salad",
  "sandwich": "sandwich meal",
  "noodles": "noodles bowl",
  "healthy": "healthy food nutrition",
  "diet": "healthy diet",
  "ingredient": "cooking ingredients",
  "recipe": "recipe cookbook",
  "cuisine": "cuisine food",
  "delicious": "delicious food",
  "flavor": "flavor spices",
  "nutrition": "nutrition healthy",
  
  // Sports & Activities
  "tournament": "sports tournament",
  "championship": "championship trophy",
  "competition": "sports competition",
  "stadium": "sports stadium",
  "court": "tennis court",
  "referee": "referee sports",
  "coach": "sports coach",
  "team": "sports team",
  "victory": "victory celebration",
  "medal": "gold medal",
  "trophy": "trophy award",
  "athlete": "athlete running",
  "training": "sports training",
  "fitness": "fitness gym",
  
  // Technology
  "technology": "modern technology",
  "computer": "computer laptop",
  "internet": "internet network",
  "website": "website design",
  "smartphone": "smartphone mobile",
  "download": "download icon",
  "upload": "upload cloud",
  "password": "password security",
  "email": "email envelope",
  "social media": "social media icons",
  "digital": "digital technology",
  "screen": "computer screen",
  "keyboard": "keyboard typing",
  
  // Entertainment & Media
  "documentary": "documentary film",
  "cartoon": "cartoon animation",
  "comedy": "comedy laughing",
  "drama": "theater drama",
  "horror": "horror movie",
  "action": "action movie",
  "animation": "animation movie",
  "audience": "audience theater",
  "broadcast": "broadcast studio",
  "character": "movie character",
  
  // Environment
  "pollution": "pollution environment",
  "environment": "nature environment",
  "recycling": "recycling symbol",
  "waste": "waste garbage",
  "plastic": "plastic waste",
  "renewable": "solar panels renewable",
  "energy": "energy power",
  "climate": "climate earth",
  "wildlife": "wildlife animals",
  "endangered": "endangered species",
  "sustainable": "sustainable green",
  
  // Travel & Tourism
  "destination": "travel destination",
  "tourism": "tourism travel",
  "tourist": "tourist camera",
  "souvenir": "souvenirs gifts",
  "luggage": "luggage suitcase",
  "passport": "passport travel",
  "visa": "visa passport stamp",
  "ticket": "flight ticket",
  "hotel": "hotel building",
  "resort": "beach resort",
  "guide": "tour guide",
  "landmark": "famous landmark",
  "attraction": "tourist attraction",
  
  // Science
  "experiment": "science experiment",
  "laboratory": "science laboratory",
  "research": "research scientist",
  "discovery": "discovery science",
  "scientist": "scientist laboratory",
  "microscope": "microscope science",
  "telescope": "telescope stars",
  "molecule": "molecule chemistry",
  "atom": "atom structure",
  "chemical": "chemical laboratory",
  "gravity": "gravity physics",
  "electricity": "electricity power",
  "magnet": "magnet magnetic",
  
  // Career & Future
  "career": "career success",
  "profession": "professional work",
  "employment": "employment work",
  "interview": "job interview",
  "resume": "resume cv",
  "office": "modern office",
  "meeting": "business meeting",
  "project": "project teamwork",
  "colleague": "colleagues working",
  
  // Abstract Concepts
  "peace": "peace dove",
  "freedom": "freedom bird flying",
  "justice": "justice scales",
  "equality": "equality diversity",
  "democracy": "democracy voting",
  "happiness": "happiness smiling",
  "success": "success achievement",
  "friendship": "friendship together",
  "love": "love heart",
  "education": "education learning"
};

/**
 * Category mapping for words not in specific map
 */
const categoryImageMap: Record<VocabularyCategory, string> = {
  school: "school education classroom",
  house: "house home interior",
  personality: "people character portrait",
  places: "city urban places",
  nature: "nature landscape scenery",
  food: "food cooking meal",
  sports: "sports activity fitness",
  technology: "technology digital modern",
  entertainment: "entertainment media fun",
  travel: "travel journey adventure",
  science: "science research laboratory",
  career: "career work professional",
  abstract: "concept idea abstract"
};

/**
 * Categorize a word based on its semantic meaning
 */
export function getCategoryFromWord(word: string): VocabularyCategory {
  const wordLower = word.toLowerCase();
  
  // School & Education
  if (/school|class|study|learn|teach|exam|homework|lesson|book|pencil|ruler|calculator/.test(wordLower)) {
    return 'school';
  }
  
  // House & Home
  if (/room|kitchen|bedroom|house|home|furniture|sofa|table|chair|bed|window|door/.test(wordLower)) {
    return 'house';
  }
  
  // Personality & Traits
  if (/kind|friendly|honest|brave|shy|happy|sad|angry|patient|generous|helpful/.test(wordLower)) {
    return 'personality';
  }
  
  // Places
  if (/shop|store|market|mall|bank|hospital|cinema|museum|restaurant|cafe|street/.test(wordLower)) {
    return 'places';
  }
  
  // Nature
  if (/mountain|river|tree|flower|forest|ocean|sea|lake|beach|sky|cloud|nature/.test(wordLower)) {
    return 'nature';
  }
  
  // Food
  if (/food|eat|drink|fruit|vegetable|meat|fish|rice|bread|cook|meal|dish/.test(wordLower)) {
    return 'food';
  }
  
  // Sports
  if (/sport|game|play|football|basketball|tennis|swim|run|exercise|gym|fitness/.test(wordLower)) {
    return 'sports';
  }
  
  // Technology
  if (/computer|internet|phone|digital|online|app|software|technology|robot/.test(wordLower)) {
    return 'technology';
  }
  
  // Entertainment
  if (/movie|film|music|song|dance|art|paint|draw|show|concert|theater/.test(wordLower)) {
    return 'entertainment';
  }
  
  // Travel
  if (/travel|trip|journey|tour|vacation|holiday|ticket|hotel|airport|train/.test(wordLower)) {
    return 'travel';
  }
  
  // Science
  if (/science|experiment|research|chemistry|physics|biology|laboratory|test/.test(wordLower)) {
    return 'science';
  }
  
  // Career
  if (/work|job|career|office|business|professional|employee|salary|meeting/.test(wordLower)) {
    return 'career';
  }
  
  // Default to abstract
  return 'abstract';
}

/**
 * Get Unsplash search query for a specific vocabulary word
 */
export function getVocabularyImage(word: string): string | null {
  // Check if we have a specific mapping for this word
  const wordLower = word.toLowerCase().trim();
  
  if (specificWordImageMap[wordLower]) {
    // Return null - will use Unsplash tool
    return null;
  }
  
  // No specific mapping found
  return null;
}

/**
 * Get Unsplash search query based on category
 */
export function getImageByCategory(category: VocabularyCategory): string {
  // This will be used as fallback - return a default query
  return categoryImageMap[category] || "education learning";
}

/**
 * Get the best Unsplash search query for a word
 */
export function getUnsplashQuery(word: string): string {
  const wordLower = word.toLowerCase().trim();
  
  // First try specific mapping
  if (specificWordImageMap[wordLower]) {
    return specificWordImageMap[wordLower];
  }
  
  // Then use category-based mapping
  const category = getCategoryFromWord(word);
  return `${word} ${categoryImageMap[category]}`;
}

/**
 * Check if a word has a specific image mapping
 */
export function hasSpecificImageMapping(word: string): boolean {
  const wordLower = word.toLowerCase().trim();
  return specificWordImageMap[wordLower] !== undefined;
}
