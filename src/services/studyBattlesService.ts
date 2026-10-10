import { BattleRival, BattleQuestion, BattleHistoryItem } from '../types/curriculum';

const BATTLES_STORAGE_KEY = 'eduplay_study_battles_history';
const USER_ELO_KEY = 'eduplay_user_battle_elo';

export const BOT_RIVALS: BattleRival[] = [
  {
    id: 'rival-1',
    name: 'Rohan Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    school: 'DPS R.K. Puram, New Delhi',
    rating: 1420,
    tier: 'Gold',
    accuracy: 82,
    avgSpeedSeconds: 4.8,
    specialty: 'Speed Math & Algebra',
  },
  {
    id: 'rival-2',
    name: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    school: 'South Point High School, Kolkata',
    rating: 1580,
    tier: 'Diamond',
    accuracy: 91,
    avgSpeedSeconds: 4.2,
    specialty: 'Chemical Kinetics & Optics',
  },
  {
    id: 'rival-3',
    name: 'Kabir Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    school: 'Allen Career Institute, Kota',
    rating: 1690,
    tier: 'Diamond',
    accuracy: 94,
    avgSpeedSeconds: 3.6,
    specialty: 'Mechanics & Calculus',
  },
  {
    id: 'rival-4',
    name: 'Meera Iyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    school: 'National Public School, Bengaluru',
    rating: 1490,
    tier: 'Gold',
    accuracy: 85,
    avgSpeedSeconds: 4.5,
    specialty: 'Cell Genetics & Organic Chemistry',
  },
  {
    id: 'rival-5',
    name: 'Aarav Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    school: 'St. Xavier’s High School, Mumbai',
    rating: 1310,
    tier: 'Silver',
    accuracy: 75,
    avgSpeedSeconds: 5.4,
    specialty: 'Biology Diagrams & Arithmetic',
  },
  {
    id: 'rival-6',
    name: 'Siddharth Gupta',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80',
    school: 'IIT Foundation Academy, Hyderabad',
    rating: 1840,
    tier: 'Grandmaster',
    accuracy: 97,
    avgSpeedSeconds: 2.9,
    specialty: 'All-Rounder Grandmaster',
  },
];

export const BATTLE_QUESTIONS_POOL: Record<string, BattleQuestion[]> = {
  Science: [
    {
      id: 'bq-s1',
      subject: 'Science',
      chapter: 'Chemical Reactions',
      question: 'Which gas is released when dilute hydrochloric acid is added to zinc granules?',
      options: ['Hydrogen gas (H₂)', 'Oxygen gas (O₂)', 'Chlorine gas (Cl₂)', 'Nitrogen dioxide (NO₂)'],
      correctIndex: 0,
      explanation: 'Zn + 2HCl → ZnCl₂ + H₂↑. Hydrogen gas burns with a characteristic pop sound.',
      points: 100,
      timeLimitSeconds: 12,
    },
    {
      id: 'bq-s2',
      subject: 'Science',
      chapter: 'Light Reflection & Refraction',
      question: 'What is the focal length of a spherical mirror whose radius of curvature is 32 cm?',
      options: ['16 cm', '64 cm', '32 cm', '8 cm'],
      correctIndex: 0,
      explanation: 'Focal length f = R / 2 = 32 / 2 = 16 cm.',
      points: 100,
      timeLimitSeconds: 10,
    },
    {
      id: 'bq-s3',
      subject: 'Science',
      chapter: 'Acids, Bases & Salts',
      question: 'What is the pH of a neutral aqueous solution at 25°C?',
      options: ['7.0', '1.0', '14.0', '0.0'],
      correctIndex: 0,
      explanation: 'At 25°C, pure water has [H⁺] = 10⁻⁷ M, making pH = -log(10⁻⁷) = 7.',
      points: 100,
      timeLimitSeconds: 10,
    },
    {
      id: 'bq-s4',
      subject: 'Science',
      chapter: 'Life Processes',
      question: 'Which enzyme in human saliva breaks down complex starch into simple maltose sugar?',
      options: ['Salivary Amylase (Ptyalin)', 'Pepsin', 'Trypsin', 'Lipase'],
      correctIndex: 0,
      explanation: 'Salivary amylase hydrolyzes starch into disaccharides like maltose.',
      points: 100,
      timeLimitSeconds: 12,
    },
    {
      id: 'bq-s5',
      subject: 'Science',
      chapter: 'Electricity',
      question: 'Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. What is the equivalent resistance?',
      options: ['1 Ω', '11 Ω', '2 Ω', '0.5 Ω'],
      correctIndex: 0,
      explanation: '1/Req = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1. Req = 1 Ω.',
      points: 120,
      timeLimitSeconds: 12,
    },
  ],
  Mathematics: [
    {
      id: 'bq-m1',
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      question: 'If the roots of quadratic equation 2x² - 8x + k = 0 are equal, what is the value of k?',
      options: ['8', '16', '4', '2'],
      correctIndex: 0,
      explanation: 'Equal roots require D = 0 → b² - 4ac = 0 → (-8)² - 4(2)(k) = 0 → 64 - 8k = 0 → k = 8.',
      points: 100,
      timeLimitSeconds: 12,
    },
    {
      id: 'bq-m2',
      subject: 'Mathematics',
      chapter: 'Trigonometry',
      question: 'What is the value of (sin² 30° + cos² 30°)?',
      options: ['1', '0.5', '√3 / 2', '2'],
      correctIndex: 0,
      explanation: 'By the fundamental trigonometric identity: sin²θ + cos²θ = 1 for any acute angle θ.',
      points: 100,
      timeLimitSeconds: 10,
    },
    {
      id: 'bq-m3',
      subject: 'Mathematics',
      chapter: 'Arithmetic Progressions',
      question: 'In an AP where first term a = 3 and common difference d = 4, what is the 10th term?',
      options: ['39', '43', '36', '40'],
      correctIndex: 0,
      explanation: 'a₁₀ = a + (10 - 1)d = 3 + 9(4) = 3 + 36 = 39.',
      points: 100,
      timeLimitSeconds: 10,
    },
    {
      id: 'bq-m4',
      subject: 'Mathematics',
      chapter: 'Real Numbers',
      question: 'If HCF(306, 657) = 9, what is LCM(306, 657)?',
      options: ['22,338', '20,442', '18,540', '24,120'],
      correctIndex: 0,
      explanation: 'LCM × HCF = Product of numbers → LCM = (306 × 657) / 9 = 34 × 657 = 22,338.',
      points: 120,
      timeLimitSeconds: 14,
    },
    {
      id: 'bq-m5',
      subject: 'Mathematics',
      chapter: 'Coordinate Geometry',
      question: 'What is the distance between points (0, 0) and (3, 4)?',
      options: ['5 units', '7 units', '25 units', '1 unit'],
      correctIndex: 0,
      explanation: 'Distance = √(3² + 4²) = √(9 + 16) = √25 = 5 units.',
      points: 100,
      timeLimitSeconds: 10,
    },
  ],
};

class StudyBattlesService {
  public getUserElo(): number {
    if (typeof window === 'undefined') return 1200;
    try {
      const saved = localStorage.getItem(USER_ELO_KEY);
      return saved ? parseInt(saved, 10) : 1200;
    } catch {
      return 1200;
    }
  }

  public setUserElo(elo: number): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USER_ELO_KEY, elo.toString());
    } catch (e) {
      console.warn('Failed to save user Elo:', e);
    }
  }

  public getHistory(): BattleHistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(BATTLES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public recordBattle(item: BattleHistoryItem): void {
    if (typeof window === 'undefined') return;
    try {
      const history = this.getHistory();
      history.unshift(item);
      localStorage.setItem(BATTLES_STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.warn('Failed to record battle history:', e);
    }
  }

  public calculateElo(userElo: number, rivalElo: number, won: boolean): number {
    const K = 32;
    const expected = 1 / (1 + Math.pow(10, (rivalElo - userElo) / 400));
    const actual = won ? 1 : 0;
    const change = Math.round(K * (actual - expected));
    return change;
  }

  public getRandomRival(): BattleRival {
    const idx = Math.floor(Math.random() * BOT_RIVALS.length);
    return BOT_RIVALS[idx];
  }

  public getQuestionsForSubject(subject: string): BattleQuestion[] {
    if (subject.toLowerCase().includes('math')) {
      return BATTLE_QUESTIONS_POOL.Mathematics;
    }
    return BATTLE_QUESTIONS_POOL.Science;
  }
}

export const studyBattlesService = new StudyBattlesService();
