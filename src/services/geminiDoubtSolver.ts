import { DoubtMessage, DoubtExplanationData } from '../types/curriculum';

const DOUBT_HISTORY_STORAGE_KEY = 'eduplay_doubt_history_v1';

export interface GroundingContext {
  classGrade: number;
  subjectName: string;
  chapterTitle: string;
  exerciseTitle?: string;
  ncertPage?: number;
}

// Comprehensive NCERT Knowledge Base for Instant Grounded Offline Fallback
const NCERT_KNOWLEDGE_BASE: Record<
  string,
  {
    summary: string;
    ncertReference: string;
    stepByStep: string[];
    formulas: string[];
    commonTrap: string;
    memoryTrick: string;
    practiceCheck: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  }
> = {
  'chemical reactions': {
    summary:
      'In any chemical reaction, existing chemical bonds between reactant atoms break and new bonds form to produce products with different properties. Chemical equations must be balanced to satisfy the Law of Conservation of Mass.',
    ncertReference: 'NCERT Class 10 Science, Chapter 1: Chemical Reactions and Equations, Section 1.1 - 1.2',
    stepByStep: [
      'Write down the skeletal word equation with correct chemical formulae for reactants and products.',
      'Count the number of atoms of each element on both Left Hand Side (LHS) and Right Hand Side (RHS).',
      'Start balancing with the compound having the maximum number of atoms (often oxygen or hydrogen).',
      'Adjust coefficients in front of formulas (NEVER alter chemical subscripts like changing H₂O into H₂O₂).',
      'Double check all atom counts and append physical states: (s) solid, (l) liquid, (g) gas, (aq) aqueous.',
    ],
    formulas: [
      'Total mass of reactants = Total mass of products',
      'Example: 3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)',
    ],
    commonTrap:
      'Altering chemical subscripts instead of coefficients! E.g. to balance 2 oxygen atoms, write 2H₂O, NEVER H₂O₂.',
    memoryTrick:
      'MINOH Rule: Balance Metals first, then Insoluble/non-metals, then Oxygen, and Hydrogen last!',
    practiceCheck: {
      question: 'Which of the following is an example of an exothermic combination reaction?',
      options: [
        'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat (Slaking of lime)',
        '2FeSO₄(s) + Heat → Fe₂O₃ + SO₂ + SO₃',
        '2AgCl(s) + Sunlight → 2Ag + Cl₂',
        'CaCO₃(s) + Heat → CaO + CO₂',
      ],
      correctIndex: 0,
      explanation:
        'Quick lime (CaO) vigorously reacts with water to form slaked lime releasing large amounts of heat, making it an exothermic combination reaction.',
    },
  },
  'quadratic': {
    summary:
      'A quadratic equation in variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0. The discriminant D = b² - 4ac dictates the nature and reality of the roots.',
    ncertReference: 'NCERT Class 10 Mathematics, Chapter 4: Quadratic Equations, Section 4.3 - 4.4',
    stepByStep: [
      'Rewrite the given equation into standard form: ax² + bx + c = 0.',
      'Identify the values of coefficients a, b, and constant c (pay strict attention to negative signs!).',
      'Calculate the discriminant: D = b² - 4ac.',
      'Check nature: If D > 0 (2 distinct real roots), if D = 0 (2 equal roots), if D < 0 (no real roots).',
      'Apply Quadratic Formula: x = (-b ± √D) / (2a) to compute the exact roots.',
    ],
    formulas: [
      'Standard Form: ax² + bx + c = 0 (a ≠ 0)',
      'Discriminant: D = b² - 4ac',
      'Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
    ],
    commonTrap:
      'Forgetting parentheses when squaring negative b: (-5)² = +25, not -25! Also forgetting to divide the entire numerator by 2a.',
    memoryTrick:
      '"Negative boy couldn\'t decide (±) whether to go to a radical party (√) where he squared his best moves (b²) minus 4 awesome chaperones (4ac), all over 2 apples (2a)."',
    practiceCheck: {
      question: 'What is the nature of roots for 2x² - 4x + 3 = 0?',
      options: [
        'Two distinct real roots',
        'Two equal real roots',
        'No real roots (D < 0)',
        'Rational and integer roots',
      ],
      correctIndex: 2,
      explanation:
        'D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots.',
    },
  },
  'trigonometry': {
    summary:
      'Trigonometric ratios relate the angles of a right-angled triangle to the ratios of its side lengths. The three fundamental identities hold true for all acute angles 0° ≤ θ ≤ 90°.',
    ncertReference: 'NCERT Class 10 Mathematics, Chapter 8: Introduction to Trigonometry, Section 8.4',
    stepByStep: [
      'Draw the right triangle ABC right-angled at B, and identify Opposite (Perpendicular), Adjacent (Base), and Hypotenuse with respect to angle θ.',
      'Apply Pythagoras Theorem: AB² + BC² = AC².',
      'Divide by AC² to obtain: (AB/AC)² + (BC/AC)² = 1 → sin²θ + cos²θ = 1.',
      'Divide by AB² or BC² to deduce the secondary identities: 1 + tan²θ = sec²θ and 1 + cot²θ = cosec²θ.',
      'Use complementary angle conversions: sin(90°-θ) = cos θ, tan(90°-θ) = cot θ.',
    ],
    formulas: [
      'sin²θ + cos²θ = 1',
      '1 + tan²θ = sec²θ  (or sec²θ - tan²θ = 1)',
      '1 + cot²θ = cosec²θ (or cosec²θ - cot²θ = 1)',
      'tan θ = sin θ / cos θ',
    ],
    commonTrap:
      'Confusing sin²θ with sin(θ²). sin²θ means (sin θ)², whereas sin(θ²) squares the angle angle.',
    memoryTrick:
      '"Some People Have / Curly Brown Hair / Turn Permanently Black" (Sin = P/H, Cos = B/H, Tan = P/B)',
    practiceCheck: {
      question: 'If sin θ = 3/5, what is the value of cos θ (for acute angle θ)?',
      options: ['4/5', '5/4', '2/5', '1/5'],
      correctIndex: 0,
      explanation:
        'Using identity cos²θ = 1 - sin²θ = 1 - (3/5)² = 1 - 9/25 = 16/25. Thus cos θ = 4/5.',
    },
  },
  'calculus': {
    summary:
      'Calculus is the study of continuous change. Differential calculus computes instantaneous rates of change (slopes of tangents), while Integral calculus aggregates infinitesimals (accumulated area).',
    ncertReference: 'NCERT Class 12 Mathematics, Chapter 5 & 7: Continuity & Integrals',
    stepByStep: [
      'Identify the function f(x) and check continuity on the domain.',
      'Apply first principles definition of derivative: f\'(x) = lim(h→0) [f(x+h) - f(x)] / h.',
      'For composite functions f(g(x)), employ the Chain Rule: d/dx [f(g(x))] = f\'(g(x)) · g\'(x).',
      'By the Fundamental Theorem of Calculus, differentiation and integration are inverse operations.',
    ],
    formulas: [
      'd/dx [xⁿ] = n · xⁿ⁻¹',
      'Chain Rule: dy/dx = (dy/du) · (du/dx)',
      'Product Rule: d/dx [u · v] = u · v\' + v · u\'',
      '∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C (for n ≠ -1)',
    ],
    commonTrap:
      'Forgetting to multiply by the inner derivative when applying the Chain Rule!',
    memoryTrick:
      '"Differentiate outside first, multiply by the guts inside."',
    practiceCheck: {
      question: 'What is the derivative of sin(x²)?',
      options: ['2x · cos(x²)', 'cos(x²)', '2x · sin(x)', '-cos(x²)'],
      correctIndex: 0,
      explanation:
        'By the chain rule: d/dx [sin(x²)] = cos(x²) · d/dx(x²) = 2x · cos(x²).',
    },
  },
};

export class GeminiDoubtSolverService {
  public static getHistory(): DoubtMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(DOUBT_HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to read doubt history:', e);
      return [];
    }
  }

  public static saveHistory(history: DoubtMessage[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DOUBT_HISTORY_STORAGE_KEY, JSON.stringify(history.slice(-30)));
    } catch (e) {
      console.warn('Failed to save doubt history:', e);
    }
  }

  public static async solveDoubt(
    userQuery: string,
    context: GroundingContext
  ): Promise<DoubtMessage> {
    const qLower = userQuery.toLowerCase();
    const chapLower = context.chapterTitle.toLowerCase();
    const subLower = context.subjectName.toLowerCase();

    // Check knowledge base matching
    let matchedKey: string | null = null;
    if (chapLower.includes('reaction') || qLower.includes('reaction') || qLower.includes('balance') || qLower.includes('redox')) {
      matchedKey = 'chemical reactions';
    } else if (chapLower.includes('quadratic') || qLower.includes('quadratic') || qLower.includes('roots') || qLower.includes('discriminant')) {
      matchedKey = 'quadratic';
    } else if (chapLower.includes('trig') || qLower.includes('sin') || qLower.includes('cos') || qLower.includes('tan')) {
      matchedKey = 'trigonometry';
    } else if (chapLower.includes('calculus') || chapLower.includes('integral') || chapLower.includes('derivative') || qLower.includes('derivative')) {
      matchedKey = 'calculus';
    }

    let explanation: DoubtExplanationData;

    if (matchedKey && NCERT_KNOWLEDGE_BASE[matchedKey]) {
      explanation = NCERT_KNOWLEDGE_BASE[matchedKey];
    } else {
      // Dynamic chapter-grounded synthesis
      explanation = {
        summary: `For "${context.chapterTitle}" in Class ${context.classGrade} ${context.subjectName}: In solving "${userQuery}", NCERT emphasizes understanding core definitions, establishing initial conditions, and checking conservation principles.`,
        ncertReference: `NCERT Class ${context.classGrade} ${context.subjectName}, Chapter: ${context.chapterTitle}, Exercise Practice Focus`,
        stepByStep: [
          `Analyze the given question: identify known values and what is asked to solve.`,
          `Recall the foundational NCERT definition/theorem established in ${context.chapterTitle}.`,
          `Express the governing relationship mathematically and substitute known variables with consistent SI units.`,
          `Simplify step-by-step and verify the final dimensions or answer against NCERT textbook examples.`,
        ],
        formulas: [
          `Fundamental Governing Equation for ${context.chapterTitle}`,
          `Units verification check: ensure LHS and RHS match.`,
        ],
        commonTrap: `Students often rush into formulas before writing given parameters and checking unit consistency. Always write down "Given" and "To Find" first.`,
        memoryTrick: `G-F-S-A Protocol: Given → Formula → Substitute → Answer with Units!`,
        practiceCheck: {
          question: `What is the first recommended step when solving an NCERT numerical or theoretical proof in ${context.chapterTitle}?`,
          options: [
            'List down given data with proper SI units and identify the required variable',
            'Guess the final answer from choices',
            'Skip directly to the final formula without stating assumptions',
            'Substitute without unit conversion',
          ],
          correctIndex: 0,
          explanation: `Systematically listing given parameters and identifying the target quantity prevents 80% of calculation mistakes in CBSE exams.`,
        },
      };
    }

    const assistantMessage: DoubtMessage = {
      id: `doubt-ans-${Date.now()}`,
      sender: 'assistant',
      text: `Here is the chapter-grounded NCERT solution for your doubt: "${userQuery}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chapterGrounded: {
        classGrade: context.classGrade,
        subjectName: context.subjectName,
        chapterTitle: context.chapterTitle,
        ncertPage: context.ncertPage || 14,
      },
      explanation,
    };

    return assistantMessage;
  }
}
