/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PrimaryGradeLevel = 'junior' | 'senior'; // Junior: Class 1-2, Senior: Class 3-5

export type GameCategory =
  | 'counting'
  | 'shapes'
  | 'nature_evs'
  | 'phonics'
  | 'patterns'
  | 'memory_match';

export interface RecognitionQuestion {
  id: string;
  category: GameCategory;
  gradeLevel: PrimaryGradeLevel;
  ncertSubject: string; // e.g. 'Joyful Mathematics', 'Looking Around (EVS)', 'English (Mridang)'
  prompt: string;
  spokenPrompt: string; // For text-to-speech audio reading
  visualContext?: {
    type: 'emoji_cluster' | 'single_image' | 'sequence';
    emojis?: string[];
    count?: number;
    size?: 'sm' | 'md' | 'lg';
  };
  options: {
    id: string;
    label: string;
    emoji?: string;
    subtext?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  funFact?: string;
}

export interface MemoryCard {
  id: string;
  pairId: string;
  content: string; // Emoji or word
  subtext?: string;
  type: 'emoji' | 'word';
}

export const RECOGNITION_QUESTIONS: RecognitionQuestion[] = [
  // --- 1. COUNTING & NUMBERS (Joyful Mathematics & Math-Magic) ---
  {
    id: 'cnt-1',
    category: 'counting',
    gradeLevel: 'junior',
    ncertSubject: 'Joyful Mathematics (Class 1)',
    prompt: 'How many juicy red apples 🍎 are in the basket?',
    spokenPrompt: 'How many juicy red apples are in the basket? Count them carefully!',
    visualContext: {
      type: 'emoji_cluster',
      emojis: ['🍎', '🍎', '🍎', '🍎', '🍎'],
      count: 5,
    },
    options: [
      { id: 'opt-3', label: '3 Apples', emoji: '3️⃣', isCorrect: false },
      { id: 'opt-5', label: '5 Apples', emoji: '5️⃣', isCorrect: true },
      { id: 'opt-6', label: '6 Apples', emoji: '6️⃣', isCorrect: false },
      { id: 'opt-7', label: '7 Apples', emoji: '7️⃣', isCorrect: false },
    ],
    explanation: 'Awesome counting! There are 5 red apples: 1, 2, 3, 4, and 5!',
    funFact: 'Did you know? An apple tree can live for more than 100 years!',
  },
  {
    id: 'cnt-2',
    category: 'counting',
    gradeLevel: 'junior',
    ncertSubject: 'Joyful Mathematics (Class 1-2)',
    prompt: 'Count the playful butterflies 🦋 flying in the garden!',
    spokenPrompt: 'Count the playful butterflies flying in the garden!',
    visualContext: {
      type: 'emoji_cluster',
      emojis: ['🦋', '🦋', '🦋', '🦋', '🦋', '🦋', '🦋'],
      count: 7,
    },
    options: [
      { id: 'opt-6', label: '6 Butterflies', emoji: '6️⃣', isCorrect: false },
      { id: 'opt-7', label: '7 Butterflies', emoji: '7️⃣', isCorrect: true },
      { id: 'opt-8', label: '8 Butterflies', emoji: '8️⃣', isCorrect: false },
      { id: 'opt-9', label: '9 Butterflies', emoji: '9️⃣', isCorrect: false },
    ],
    explanation: 'Super work! Count them together: 1, 2, 3, 4, 5, 6, 7 butterflies!',
    funFact: 'Butterflies taste their food with their tiny feet!',
  },
  {
    id: 'cnt-3',
    category: 'counting',
    gradeLevel: 'senior',
    ncertSubject: 'Math-Magic (Class 3)',
    prompt: 'Count the grouped pencils: 3 bundles of 5 pencils each = ?',
    spokenPrompt: 'Three bundles of five pencils each. How many pencils in total?',
    visualContext: {
      type: 'emoji_cluster',
      emojis: ['✏️✏️✏️✏️✏️', '✏️✏️✏️✏️✏️', '✏️✏️✏️✏️✏️'],
      count: 15,
    },
    options: [
      { id: 'opt-10', label: '10 Pencils', emoji: '🔟', isCorrect: false },
      { id: 'opt-12', label: '12 Pencils', emoji: '✏️', isCorrect: false },
      { id: 'opt-15', label: '15 Pencils', emoji: '🎉', isCorrect: true },
      { id: 'opt-18', label: '18 Pencils', emoji: '✏️', isCorrect: false },
    ],
    explanation: 'Multiplication as repeated addition: 5 + 5 + 5 = 15 pencils!',
    funFact: 'A single pencil can draw a line that is 56 kilometers long!',
  },

  // --- 2. SHAPES & SPATIAL DETECTIVE (Math-Magic & Geometry) ---
  {
    id: 'shp-1',
    category: 'shapes',
    gradeLevel: 'junior',
    ncertSubject: 'Joyful Mathematics (Class 1-2)',
    prompt: 'Which everyday object has the shape of a Cylinder 🛢️ (can roll and slide)?',
    spokenPrompt: 'Which everyday object has the shape of a cylinder? It can both roll and slide!',
    options: [
      { id: 'opt-can', label: 'Juice Can', emoji: '🥫', subtext: 'Cylinder', isCorrect: true },
      { id: 'opt-ball', label: 'Football', emoji: '⚽', subtext: 'Sphere', isCorrect: false },
      { id: 'opt-dice', label: 'Playing Dice', emoji: '🎲', subtext: 'Cube', isCorrect: false },
      { id: 'opt-book', label: 'Flat Storybook', emoji: '📖', subtext: 'Cuboid', isCorrect: false },
    ],
    explanation: 'Correct! A juice can has 2 flat circular ends and 1 curved face — that is a Cylinder!',
    funFact: 'A rolling cylinder was how ancient humans invented wheels and cart axles.',
  },
  {
    id: 'shp-2',
    category: 'shapes',
    gradeLevel: 'junior',
    ncertSubject: 'Joyful Mathematics (Class 1-2)',
    prompt: 'Which yummy food slice looks just like a Triangle 🔺?',
    spokenPrompt: 'Which yummy food slice looks just like a triangle with three straight sides?',
    options: [
      { id: 'opt-sandwich', label: 'Sandwich Slice', emoji: '🥪', subtext: '3 sides', isCorrect: true },
      { id: 'opt-cookie', label: 'Round Cookie', emoji: '🍪', subtext: 'Circle', isCorrect: false },
      { id: 'opt-donut', label: 'Ring Donut', emoji: '🍩', subtext: 'Circle', isCorrect: false },
      { id: 'opt-choc', label: 'Chocolate Bar', emoji: '🍫', subtext: 'Rectangle', isCorrect: false },
    ],
    explanation: 'Yum! When you cut a bread sandwich diagonally, you get two Triangles with 3 corners!',
  },
  {
    id: 'shp-3',
    category: 'shapes',
    gradeLevel: 'senior',
    ncertSubject: 'Math-Magic (Class 4-5)',
    prompt: 'Which 3D solid shape has 6 flat square faces and 8 corners (vertices)?',
    spokenPrompt: 'Which three-dimensional solid shape has six flat square faces and eight corners?',
    options: [
      { id: 'opt-cube', label: 'Cube (Rubik\'s Cube)', emoji: '🧊', subtext: '6 equal square faces', isCorrect: true },
      { id: 'opt-sphere', label: 'Sphere', emoji: '🌐', subtext: '1 curved face', isCorrect: false },
      { id: 'opt-cone', label: 'Cone (Party Hat)', emoji: '🍦', subtext: '1 apex, 1 circle base', isCorrect: false },
      { id: 'opt-pyramid', label: 'Triangular Prism', emoji: '⛺', subtext: 'Prism', isCorrect: false },
    ],
    explanation: 'Brilliant! A cube has 6 identical square faces, 12 straight edges, and 8 vertices!',
  },

  // --- 3. NATURE, ANIMALS & EVS (NCERT Looking Around Classes 3-5) ---
  {
    id: 'evs-1',
    category: 'nature_evs',
    gradeLevel: 'junior',
    ncertSubject: 'Looking Around (Class 3 EVS)',
    prompt: 'Which one is a Living Thing that can grow, breathe, and reproduce?',
    spokenPrompt: 'Which one is a living thing that can grow, breathe, and make babies?',
    options: [
      { id: 'opt-plant', label: 'Green Banyan Tree', emoji: '🌳', subtext: 'Living Thing', isCorrect: true },
      { id: 'opt-car', label: 'Toy Race Car', emoji: '🚗', subtext: 'Non-Living', isCorrect: false },
      { id: 'opt-phone', label: 'Smartphone', emoji: '📱', subtext: 'Non-Living', isCorrect: false },
      { id: 'opt-pencil', label: 'Pencil & Eraser', emoji: '✏️', subtext: 'Non-Living', isCorrect: false },
    ],
    explanation: 'Great job! Trees are living things — they drink water from the soil, make food from sunlight, and grow tall!',
    funFact: 'Plants can communicate with each other through fungal networks beneath the soil!',
  },
  {
    id: 'evs-2',
    category: 'nature_evs',
    gradeLevel: 'senior',
    ncertSubject: 'Looking Around (Class 4-5 EVS)',
    prompt: 'Which plant part absorbs water and minerals from deep inside the soil?',
    spokenPrompt: 'Which plant part absorbs water and nutrients from deep inside the soil?',
    options: [
      { id: 'opt-roots', label: 'Roots (जड़ें)', emoji: '🌱', subtext: 'Underground anchor', isCorrect: true },
      { id: 'opt-flower', label: 'Flower (फूल)', emoji: '🌸', subtext: 'Reproduction', isCorrect: false },
      { id: 'opt-leaf', label: 'Leaves (पत्तियां)', emoji: '🍃', subtext: 'Kitchen / Photosynthesis', isCorrect: false },
      { id: 'opt-fruit', label: 'Fruit (फल)', emoji: '🍎', subtext: 'Seed protector', isCorrect: false },
    ],
    explanation: 'Spot on! The roots anchor the plant firmly and suck up water and minerals like tiny straws!',
    funFact: 'A single rye plant root system can have over 600 kilometers of tiny root hairs!',
  },
  {
    id: 'evs-3',
    category: 'nature_evs',
    gradeLevel: 'senior',
    ncertSubject: 'Looking Around (Class 4-5 EVS)',
    prompt: 'Identify the National Bird of India with magnificent iridescent tail feathers:',
    spokenPrompt: 'Identify the national bird of India with magnificent tail feathers that dances in the monsoon rain.',
    options: [
      { id: 'opt-peacock', label: 'Indian Peacock (मोर)', emoji: '🦚', subtext: 'National Bird', isCorrect: true },
      { id: 'opt-parrot', label: 'Green Parrot (तोता)', emoji: '🦜', subtext: 'Seed eater', isCorrect: false },
      { id: 'opt-eagle', label: 'Bald Eagle (चील)', emoji: '🦅', subtext: 'Bird of prey', isCorrect: false },
      { id: 'opt-owl', label: 'Spotted Owl (उल्लू)', emoji: '🦉', subtext: 'Nocturnal', isCorrect: false },
    ],
    explanation: 'Jai Hind! The Indian Peacock (Pavo cristatus) is our proud National Bird, known for its majestic monsoon dance!',
  },

  // --- 4. PHONICS & WORD SAFARI (English & Hindi Phonics) ---
  {
    id: 'pho-1',
    category: 'phonics',
    gradeLevel: 'junior',
    ncertSubject: 'English (Mridang & Marigold)',
    prompt: 'Which cute animal begins with the letter sound /M/ (as in "M-M-M")?',
    spokenPrompt: 'Which cute animal begins with the letter sound M?',
    options: [
      { id: 'opt-monkey', label: 'Monkey', emoji: '🐒', subtext: 'Starts with M', isCorrect: true },
      { id: 'opt-tiger', label: 'Tiger', emoji: '🐅', subtext: 'Starts with T', isCorrect: false },
      { id: 'opt-elephant', label: 'Elephant', emoji: '🐘', subtext: 'Starts with E', isCorrect: false },
      { id: 'opt-lion', label: 'Lion', emoji: '🦁', subtext: 'Starts with L', isCorrect: false },
    ],
    explanation: 'M is for Monkey! /M/ - /o/ - /n/ - /k/ - /e/ - /y/!',
  },
  {
    id: 'pho-2',
    category: 'phonics',
    gradeLevel: 'junior',
    ncertSubject: 'English (Mridang & Marigold)',
    prompt: 'Find the rhyming pair: What word rhymes with "CAT" 🐱?',
    spokenPrompt: 'Which word rhymes with Cat? Cat, Bat, Hat!',
    options: [
      { id: 'opt-hat', label: 'HAT 🎩', emoji: '🎩', subtext: 'Rhymes with Cat', isCorrect: true },
      { id: 'opt-dog', label: 'DOG 🐶', emoji: '🐶', subtext: 'Does not rhyme', isCorrect: false },
      { id: 'opt-sun', label: 'SUN ☀️', emoji: '☀️', subtext: 'Does not rhyme', isCorrect: false },
      { id: 'opt-fish', label: 'FISH 🐟', emoji: '🐟', subtext: 'Does not rhyme', isCorrect: false },
    ],
    explanation: 'Awesome! Cat and Hat rhyme because they end with the same "-AT" sound!',
  },
  {
    id: 'pho-3',
    category: 'phonics',
    gradeLevel: 'senior',
    ncertSubject: 'English (Marigold Class 4)',
    prompt: 'Which vowel completes the word for our solar system star: S _ N ☀️?',
    spokenPrompt: 'Which vowel completes the word for our warm star in the sky: S blank N?',
    options: [
      { id: 'opt-u', label: 'U (SUN ☀️)', emoji: '☀️', isCorrect: true },
      { id: 'opt-a', label: 'A (SAN)', emoji: '❓', isCorrect: false },
      { id: 'opt-e', label: 'E (SEN)', emoji: '❓', isCorrect: false },
      { id: 'opt-i', label: 'I (SIN)', emoji: '❓', isCorrect: false },
    ],
    explanation: 'Perfect! S-U-N spells SUN, the bright star that gives us daylight!',
  },

  // --- 5. PATTERNS & SEQUENCES (Joyful Mathematics) ---
  {
    id: 'pat-1',
    category: 'patterns',
    gradeLevel: 'junior',
    ncertSubject: 'Joyful Mathematics (Class 2)',
    prompt: 'What comes next in the pattern? 🔴 🔷 🔴 🔷 🔴 ___?',
    spokenPrompt: 'Look at the pattern: Red circle, blue diamond, red circle, blue diamond, red circle. What comes next?',
    visualContext: {
      type: 'sequence',
      emojis: ['🔴', '🔷', '🔴', '🔷', '🔴', '❓'],
    },
    options: [
      { id: 'opt-diamond', label: 'Blue Diamond 🔷', emoji: '🔷', isCorrect: true },
      { id: 'opt-circle', label: 'Red Circle 🔴', emoji: '🔴', isCorrect: false },
      { id: 'opt-star', label: 'Yellow Star ⭐', emoji: '⭐', isCorrect: false },
      { id: 'opt-square', label: 'Green Square 🟩', emoji: '🟩', isCorrect: false },
    ],
    explanation: 'Brilliant pattern detection! The rule is alternating Circle, Diamond, Circle, Diamond!',
  },
  {
    id: 'pat-2',
    category: 'patterns',
    gradeLevel: 'senior',
    ncertSubject: 'Math-Magic (Class 3-4)',
    prompt: 'Complete the growing number pattern: 2, 4, 6, 8, ___?',
    spokenPrompt: 'Complete the number sequence: Two, four, six, eight. What comes next?',
    visualContext: {
      type: 'sequence',
      emojis: ['2️⃣', '4️⃣', '6️⃣', '8️⃣', '❓'],
    },
    options: [
      { id: 'opt-10', label: '10 (Ten)', emoji: '🔟', isCorrect: true },
      { id: 'opt-9', label: '9 (Nine)', emoji: '9️⃣', isCorrect: false },
      { id: 'opt-11', label: '11 (Eleven)', emoji: '1️⃣1️⃣', isCorrect: false },
      { id: 'opt-12', label: '12 (Twelve)', emoji: '1️⃣2️⃣', isCorrect: false },
    ],
    explanation: 'Super! Counting by twos (Skip counting by 2): 2, 4, 6, 8, and next is 10!',
  },
];

// Memory Matching Pairs Dataset
export const MEMORY_SETS = {
  animals: [
    { pairId: 'pair-lion', content: '🦁', subtext: 'Lion' },
    { pairId: 'pair-elephant', content: '🐘', subtext: 'Elephant' },
    { pairId: 'pair-monkey', content: '🐒', subtext: 'Monkey' },
    { pairId: 'pair-tiger', content: '🐅', subtext: 'Tiger' },
  ],
  shapes: [
    { pairId: 'pair-circle', content: '⭕', subtext: 'Circle' },
    { pairId: 'pair-square', content: '⏹️', subtext: 'Square' },
    { pairId: 'pair-triangle', content: '🔺', subtext: 'Triangle' },
    { pairId: 'pair-star', content: '⭐', subtext: 'Star' },
  ],
  math_sums: [
    { pairId: 'pair-sum1', content: '2 + 2', subtext: 'Sum' },
    { pairId: 'pair-sum1', content: '4', subtext: 'Answer' },
    { pairId: 'pair-sum2', content: '5 + 3', subtext: 'Sum' },
    { pairId: 'pair-sum2', content: '8', subtext: 'Answer' },
  ],
};
