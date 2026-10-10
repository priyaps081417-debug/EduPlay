import { RevisionCard, RevisionRating } from '../types/curriculum';

const STORAGE_KEY = 'eduplay_spaced_repetition_deck';

const DEFAULT_DECK: RevisionCard[] = [
  {
    id: 'rev-c10-chem-1',
    classGrade: 10,
    subjectId: 'sub-c10-sci',
    subjectName: 'Science',
    chapterId: 'chap-c10-s1',
    chapterTitle: 'Chemical Reactions and Equations',
    topic: 'Balancing Chemical Equations',
    front: 'Why must every chemical equation be balanced according to NCERT Chapter 1?',
    back: 'To satisfy the Law of Conservation of Mass (Lavoisier): "Mass can neither be created nor destroyed in a chemical reaction." Total number of atoms of each element must remain equal on both sides.',
    formula: 'Total mass of reactants = Total mass of products',
    difficulty: 'Easy',
    repetition: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextDueDate: new Date().toISOString().split('T')[0],
    masteryScore: 40,
  },
  {
    id: 'rev-c10-chem-2',
    classGrade: 10,
    subjectId: 'sub-c10-sci',
    subjectName: 'Science',
    chapterId: 'chap-c10-s1',
    chapterTitle: 'Chemical Reactions and Equations',
    topic: 'Redox Reactions & Oxidation-Reduction',
    front: 'In the reaction: CuO + H₂ → Cu + H₂O, which substance is oxidized and which is reduced?',
    back: 'H₂ is oxidized to H₂O (gain of oxygen). CuO is reduced to Cu (loss of oxygen). This is a classic Redox reaction.',
    formula: 'Oxidation = Gain of O₂ / Loss of e⁻ | Reduction = Loss of O₂ / Gain of e⁻',
    difficulty: 'Medium',
    repetition: 1,
    intervalDays: 1,
    easeFactor: 2.5,
    nextDueDate: new Date().toISOString().split('T')[0],
    masteryScore: 65,
  },
  {
    id: 'rev-c10-math-1',
    classGrade: 10,
    subjectId: 'sub-c10-math',
    subjectName: 'Mathematics',
    chapterId: 'chap-c10-m4',
    chapterTitle: 'Quadratic Equations',
    topic: 'Nature of Roots (Discriminant)',
    front: 'What does the Discriminant D = b² - 4ac reveal about roots of ax² + bx + c = 0?',
    back: '1. If D > 0: Two distinct real roots.\n2. If D = 0: Two equal real roots (x = -b/2a).\n3. If D < 0: No real roots (roots are complex/imaginary).',
    formula: 'D = b² - 4ac, x = (-b ± √D) / (2a)',
    difficulty: 'Medium',
    repetition: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextDueDate: new Date().toISOString().split('T')[0],
    masteryScore: 50,
  },
  {
    id: 'rev-c10-math-2',
    classGrade: 10,
    subjectId: 'sub-c10-math',
    subjectName: 'Mathematics',
    chapterId: 'chap-c10-m8',
    chapterTitle: 'Introduction to Trigonometry',
    topic: 'Pythagorean Trigonometric Identity',
    front: 'State the 3 fundamental trigonometric identities derived from Pythagoras theorem.',
    back: '1. sin²θ + cos²θ = 1\n2. 1 + tan²θ = sec²θ (or sec²θ - tan²θ = 1)\n3. 1 + cot²θ = cosec²θ (or cosec²θ - cot²θ = 1)',
    formula: 'sin²θ + cos²θ = 1',
    difficulty: 'Hard',
    repetition: 0,
    intervalDays: 1,
    easeFactor: 2.4,
    nextDueDate: new Date().toISOString().split('T')[0],
    masteryScore: 45,
  },
  {
    id: 'rev-c12-phy-1',
    classGrade: 12,
    subjectId: 'sub-c12-phy',
    subjectName: 'Physics (PCM/PCB)',
    chapterId: 'chap-c12-p1',
    chapterTitle: 'Electric Charges and Fields',
    topic: "Gauss's Law in Electrostatics",
    front: "State Gauss's Law and its mathematical expression for a closed Gaussian surface.",
    back: 'The total electric flux (Φ) through any closed surface is equal to 1/ε₀ times the total electric charge (q_enclosed) enclosed within that surface.',
    formula: 'Φ = ∮ E · dA = q_in / ε₀',
    difficulty: 'Hard',
    repetition: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextDueDate: new Date().toISOString().split('T')[0],
    masteryScore: 35,
  },
  {
    id: 'rev-c12-bio-1',
    classGrade: 12,
    subjectId: 'sub-c12-bio',
    subjectName: 'Biology (PCB)',
    chapterId: 'chap-c12-b1',
    chapterTitle: 'Molecular Basis of Inheritance',
    topic: "Central Dogma of Molecular Biology",
    front: 'Define Francis Crick’s Central Dogma and the reverse exception.',
    back: 'Central dogma states genetic information flows unidirectionally: DNA → (Transcription) → mRNA → (Translation) → Protein.\nException: Retroviruses (e.g. HIV) perform Reverse Transcription (RNA → DNA via reverse transcriptase).',
    formula: 'DNA ⇄ RNA → Protein',
    difficulty: 'Medium',
    repetition: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextDueDate: new Date().toISOString().split('T')[0],
    masteryScore: 60,
  },
];

class SpacedRepetitionService {
  private getDeck(): RevisionCard[] {
    if (typeof window === 'undefined') return DEFAULT_DECK;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DECK));
        return DEFAULT_DECK;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse revision deck:', e);
      return DEFAULT_DECK;
    }
  }

  private saveDeck(deck: RevisionCard[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
    } catch (e) {
      console.warn('Failed to save revision deck:', e);
    }
  }

  public getAllCards(): RevisionCard[] {
    return this.getDeck();
  }

  public getDueCards(): RevisionCard[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getDeck().filter((card) => card.nextDueDate <= today);
  }

  public getDueCount(): number {
    return this.getDueCards().length;
  }

  /**
   * SuperMemo SM-2 Interval Calculation
   */
  public gradeCard(cardId: string, rating: RevisionRating): { updatedCard: RevisionCard; xpEarned: number } {
    const deck = this.getDeck();
    const index = deck.findIndex((c) => c.id === cardId);
    if (index === -1) {
      throw new Error(`Card ${cardId} not found`);
    }

    const card = { ...deck[index] };
    let quality = 4;
    let xpEarned = 15;

    switch (rating) {
      case 'again':
        quality = 1;
        xpEarned = 5;
        break;
      case 'hard':
        quality = 3;
        xpEarned = 10;
        break;
      case 'good':
        quality = 4;
        xpEarned = 20;
        break;
      case 'easy':
        quality = 5;
        xpEarned = 30;
        break;
    }

    // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    let newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    let newRepetition = card.repetition;
    let newIntervalDays = 1;

    if (quality < 3) {
      // Failed recall: reset repetition
      newRepetition = 0;
      newIntervalDays = 1;
      card.masteryScore = Math.max(10, card.masteryScore - 15);
    } else {
      // Successful recall
      if (newRepetition === 0) {
        newIntervalDays = 1;
      } else if (newRepetition === 1) {
        newIntervalDays = 6;
      } else {
        newIntervalDays = Math.round(card.intervalDays * newEaseFactor);
      }

      if (rating === 'easy') {
        newIntervalDays = Math.round(newIntervalDays * 1.3);
      }

      newRepetition += 1;
      card.masteryScore = Math.min(100, card.masteryScore + (rating === 'easy' ? 20 : 12));
    }

    // Calculate next due date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newIntervalDays);
    const nextDueDateStr = nextDate.toISOString().split('T')[0];

    card.repetition = newRepetition;
    card.intervalDays = newIntervalDays;
    card.easeFactor = Number(newEaseFactor.toFixed(2));
    card.lastReviewedAt = new Date().toISOString();
    card.nextDueDate = nextDueDateStr;

    deck[index] = card;
    this.saveDeck(deck);

    return { updatedCard: card, xpEarned };
  }

  public addCard(cardData: Omit<RevisionCard, 'id' | 'repetition' | 'intervalDays' | 'easeFactor' | 'nextDueDate' | 'masteryScore'>): RevisionCard {
    const deck = this.getDeck();
    const newCard: RevisionCard = {
      ...cardData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      nextDueDate: new Date().toISOString().split('T')[0],
      masteryScore: 30,
    };
    deck.push(newCard);
    this.saveDeck(deck);
    return newCard;
  }

  public getStats() {
    const deck = this.getDeck();
    const dueCount = this.getDueCount();
    const totalCount = deck.length;
    const masteredCount = deck.filter((c) => c.masteryScore >= 80).length;
    const averageMastery = totalCount > 0 ? Math.round(deck.reduce((acc, c) => acc + c.masteryScore, 0) / totalCount) : 0;

    return {
      totalCount,
      dueCount,
      masteredCount,
      averageMastery,
    };
  }
}

export const spacedRepetitionService = new SpacedRepetitionService();
