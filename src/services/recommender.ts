import {
  SuggestedTopic,
  ExerciseItem,
  ChapterItem,
  SubjectItem,
  AcademicStream,
  FutureTopicRoadmap,
} from '../types/curriculum';

export const FUTURE_STREAM_ROADMAPS: Record<AcademicStream, FutureTopicRoadmap[]> = {
  pcm: [
    {
      id: 'ft-pcm-1',
      title: 'Calculus: Derivatives & Rates of Change',
      gradeLevel: 'Class 11 & 12 Entrance',
      stream: 'pcm',
      targetCourse: 'B.Tech / JEE Main & Advanced',
      importance: 'Critical High-Yield',
      description: 'Foundational tool for physics kinematic motion and 35% of engineering entrance questions.',
      prerequisiteTopic: 'Quadratic Equations & Polynomial Functions',
      chapterId: 'chap-c10-m4',
      exerciseId: 'ex-c10-m4-1',
      subjectId: 'sub-c10-math',
      classId: 'class-10',
      tags: ['Calculus', 'JEE Advanced', 'Engineering Core'],
    },
    {
      id: 'ft-pcm-2',
      title: 'Rotational Dynamics & Torque Vectors',
      gradeLevel: 'Class 11 Competitive Track',
      stream: 'pcm',
      targetCourse: 'Mechanical / Aerospace & JEE Advanced',
      importance: 'Critical High-Yield',
      description: 'Rigid body angular momentum, moment of inertia tensors, and planetary orbit mechanics.',
      prerequisiteTopic: "Newton's Second Law (F = ma)",
      chapterId: 'chap-c9-s9',
      exerciseId: 'ex-c9-s9-1',
      subjectId: 'sub-c9-sci',
      classId: 'class-9',
      tags: ['Mechanics', 'Physics Olympiad', 'Aerospace'],
    },
    {
      id: 'ft-pcm-3',
      title: 'Electrostatics & Capacitor Circuit Theory',
      gradeLevel: 'Class 12 Board & JEE',
      stream: 'pcm',
      targetCourse: 'Electrical Engineering & Silicon Hardware',
      importance: 'Core Fundamental',
      description: "Coulomb's Law, electric potential fields, and dielectric capacitance in microchips.",
      prerequisiteTopic: 'Electric Current & Resistance (NCERT Ch 12)',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Electronics', 'Semiconductors', 'Hardware'],
    },
    {
      id: 'ft-pcm-4',
      title: 'Organic Reaction Mechanisms & Stereochemistry',
      gradeLevel: 'Class 12 High-Scoring Section',
      stream: 'pcm',
      targetCourse: 'Chemical Engineering & Material Science',
      importance: 'Competitive Advantage',
      description: 'Electrophilic aromatic substitution, SN1/SN2 pathways, and optical chiral symmetry.',
      prerequisiteTopic: 'Balancing Chemical Equations & Redox',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-3',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Organic Chemistry', 'Nanotech', 'Synthetics'],
    },
  ],

  pcb: [
    {
      id: 'ft-pcb-1',
      title: 'Molecular Genetics: DNA Transcription & CRISPR',
      gradeLevel: 'Class 12 NEET Flagship',
      stream: 'pcb',
      targetCourse: 'MBBS Medical / Biotechnology',
      importance: 'Critical High-Yield',
      description: 'DNA replication fork, messenger RNA processing, genetic code, and therapeutic gene editing.',
      prerequisiteTopic: 'Life Processes & Cellular Division',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Genetics', 'NEET Biology (12% Weightage)', 'Biotech'],
    },
    {
      id: 'ft-pcb-2',
      title: 'Human Neurophysiology & Synaptic Transduction',
      gradeLevel: 'Class 11 Pre-Med Foundation',
      stream: 'pcb',
      targetCourse: 'Neuroscience / Clinical Medicine',
      importance: 'Critical High-Yield',
      description: 'Action potential ion channels, neurotransmitter release, and autonomic reflex arcs.',
      prerequisiteTopic: 'Nervous System & Tissues',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-2',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Human Anatomy', 'NEET Rank Booster', 'Clinical'],
    },
    {
      id: 'ft-pcb-3',
      title: 'Coordination Chemistry & Bioinorganic Complexes',
      gradeLevel: 'Class 12 Medical Chemistry',
      stream: 'pcb',
      targetCourse: 'Pharmaceutical Chemistry / BDS',
      importance: 'Core Fundamental',
      description: 'Hemoglobin iron porphyrin coordination, anti-cancer cisplatin mechanisms, and ligand field theory.',
      prerequisiteTopic: 'Chemical Bonding & Metals',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Inorganic Chemistry', 'Pharmacology', 'NEET'],
    },
    {
      id: 'ft-pcb-4',
      title: 'Chemical Bioenergetics & Metabolic Enthalpy',
      gradeLevel: 'Class 11 Physical Bio-Chemistry',
      stream: 'pcb',
      targetCourse: 'Biochemistry / Medical Research',
      importance: 'Competitive Advantage',
      description: 'Gibbs free energy coupling, enzyme kinetics (Km), and aerobic ATP synthesis.',
      prerequisiteTopic: 'Exothermic Chemical Reactions',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-2',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Biochemistry', 'Thermodynamics', 'Metabolism'],
    },
  ],

  pcmb: [
    {
      id: 'ft-pcmb-1',
      title: 'Biophysical Modeling & Neural Networks',
      gradeLevel: 'Class 12 Interdisciplinary',
      stream: 'pcmb',
      targetCourse: 'Biomedical Engineering & AI Medicine',
      importance: 'Critical High-Yield',
      description: 'Combining differential calculus with cardiac electrophysiology and MRI imaging physics.',
      prerequisiteTopic: 'Quadratic Equations & Electric Fields',
      chapterId: 'chap-c10-m4',
      exerciseId: 'ex-c10-m4-1',
      subjectId: 'sub-c10-math',
      classId: 'class-10',
      tags: ['Bio-Tech', 'AI Medicine', 'High-Scoring Dual Track'],
    },
    {
      id: 'ft-pcmb-2',
      title: 'Genomic Data Algorithms & Biostatistics',
      gradeLevel: 'Class 12 Advanced',
      stream: 'pcmb',
      targetCourse: 'Computational Biology / Bioinformatics',
      importance: 'Competitive Advantage',
      description: 'Mathematical probability distributions applied to Mendelian inheritance and genome sequencing.',
      prerequisiteTopic: 'Fractions & Proportions',
      chapterId: 'chap-c6-m7',
      exerciseId: 'ex-c6-m7-1',
      subjectId: 'sub-c6-math',
      classId: 'class-6',
      tags: ['Bioinformatics', 'Olympiad', 'Statistics'],
    },
  ],

  commerce_maths: [
    {
      id: 'ft-comm-1',
      title: 'Corporate Financial Statement Analysis',
      gradeLevel: 'Class 12 Accountancy Core',
      stream: 'commerce_maths',
      targetCourse: 'Chartered Accountancy (CA) / Investment Banking',
      importance: 'Critical High-Yield',
      description: 'Cash flow reconciliation, liquidity solvency ratios, and audited corporate balance sheets.',
      prerequisiteTopic: 'Algebraic Ratios & Percentages',
      chapterId: 'chap-c10-m4',
      exerciseId: 'ex-c10-m4-1',
      subjectId: 'sub-c10-math',
      classId: 'class-10',
      tags: ['CA Foundation', 'Equity Research', 'Corporate Law'],
    },
    {
      id: 'ft-comm-2',
      title: 'Linear Programming & Portfolio Optimization',
      gradeLevel: 'Class 12 Applied Mathematics',
      stream: 'commerce_maths',
      targetCourse: 'Quantitative Finance / Actuarial Science',
      importance: 'Core Fundamental',
      description: 'Simplex constraint optimization, capital allocation bounds, and return maximization.',
      prerequisiteTopic: 'Quadratic Equations & Inequations',
      chapterId: 'chap-c10-m4',
      exerciseId: 'ex-c10-m4-1',
      subjectId: 'sub-c10-math',
      classId: 'class-10',
      tags: ['FinTech', 'Operations Research', 'CUET Commerce'],
    },
    {
      id: 'ft-comm-3',
      title: 'Macroeconomics: National Income & Monetary Policy',
      gradeLevel: 'Class 12 Economics Flagship',
      stream: 'commerce_maths',
      targetCourse: 'B.Com (Hons) / Economic Policy',
      importance: 'Critical High-Yield',
      description: 'GDP calculation metrics, Keynesian investment multiplier, and Central Bank repo rates.',
      prerequisiteTopic: 'Social Studies & Economic Foundations',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Macroeconomics', 'RBI Policy', 'B.Com Hons'],
    },
  ],

  commerce: [
    {
      id: 'ft-comm-basic-1',
      title: 'Principles of Business Management & Marketing',
      gradeLevel: 'Class 12 Business Studies',
      stream: 'commerce',
      targetCourse: 'BBA / Entrepreneurship / Marketing Management',
      importance: 'Critical High-Yield',
      description: "Fayol's administrative principles, consumer behavior analytics, and supply-chain logistics.",
      prerequisiteTopic: 'Economic Sectors (Primary, Secondary, Tertiary)',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Business Studies', 'BBA', 'Management'],
    },
    {
      id: 'ft-comm-basic-2',
      title: 'Corporate Accounting for Share Capital',
      gradeLevel: 'Class 12 Accountancy',
      stream: 'commerce',
      targetCourse: 'Chartered Accountancy (CA) / CS Executive',
      importance: 'Critical High-Yield',
      description: 'Issue, forfeiture, and reissue of equity shares in publicly traded companies.',
      prerequisiteTopic: 'Accounting Ledgers & Journal Entries',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Corporate Accounting', 'CA Track', 'Stock Markets'],
    },
  ],

  humanities: [
    {
      id: 'ft-hum-1',
      title: 'Constitutional Law & Fundamental Rights (Part III)',
      gradeLevel: 'Class 11 & 12 Legal Studies',
      stream: 'humanities',
      targetCourse: 'BA LLB (CLAT) / UPSC Civil Services',
      importance: 'Critical High-Yield',
      description: 'Articles 12-35, writ jurisdictions (Habeas Corpus), and constitutional judicial review.',
      prerequisiteTopic: 'Democratic Politics & Separation of Powers',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Constitutional Law', 'CLAT Core', 'UPSC Prelims'],
    },
    {
      id: 'ft-hum-2',
      title: 'Modern Indian History: Freedom Movement & Partition',
      gradeLevel: 'Class 12 History Specialized',
      stream: 'humanities',
      targetCourse: 'UPSC Civil Services / Public Administration',
      importance: 'Critical High-Yield',
      description: 'Agrarian rebellions, Non-Cooperation, Civil Disobedience, and post-independence integration.',
      prerequisiteTopic: 'Nationalism in India (NCERT History Ch 2)',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Modern History', 'UPSC Mains GS-1', 'Civil Services'],
    },
    {
      id: 'ft-hum-3',
      title: 'Global Geopolitics & Multilateral Trade Treaties',
      gradeLevel: 'Class 12 Political Science',
      stream: 'humanities',
      targetCourse: 'International Relations / Journalism / Diplomacy',
      importance: 'Competitive Advantage',
      description: 'Post-Cold War multipolarity, UN Security Council reforms, and global climate governance.',
      prerequisiteTopic: 'Global World & World Trade',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['International Relations', 'Diplomacy', 'Journalism'],
    },
  ],

  foundation: [
    {
      id: 'ft-found-1',
      title: 'Senior Secondary STEM Bridge: Vectors & 2D Kinematics',
      gradeLevel: 'Class 10 to 11 Transition Bridge',
      stream: 'foundation',
      targetCourse: 'JEE / NEET Early Foundation & NTSE',
      importance: 'Critical High-Yield',
      description: 'Vector dot & cross products, resolution of forces, and projectile trajectories.',
      prerequisiteTopic: 'Laws of Motion & Trigonometry',
      chapterId: 'chap-c10-m4',
      exerciseId: 'ex-c10-m4-1',
      subjectId: 'sub-c10-math',
      classId: 'class-10',
      tags: ['Bridge Course', 'NTSE', 'Early Starter'],
    },
    {
      id: 'ft-found-2',
      title: 'Chemical Bonding & Hybridization Geometry',
      gradeLevel: 'Class 10 to 11 Transition Bridge',
      stream: 'foundation',
      targetCourse: 'National Science Olympiad (NSO)',
      importance: 'Core Fundamental',
      description: 'VSEPR orbital shapes, sp/sp²/sp³ hybridization, and dipole moment electrochemistry.',
      prerequisiteTopic: 'Chemical Reactions & Balancing',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      tags: ['Olympiad', 'Chemistry Bridge', 'CBSE Top 1%'],
    },
  ],
};

export function getFutureStreamRoadmap(
  stream: AcademicStream,
  targetCourse?: string
): FutureTopicRoadmap[] {
  const topics = FUTURE_STREAM_ROADMAPS[stream] || FUTURE_STREAM_ROADMAPS.pcm;
  if (!targetCourse) return topics;

  // Prioritize topics matching target course keywords
  const normalized = targetCourse.toLowerCase();
  return [...topics].sort((a, b) => {
    const aMatch = a.targetCourse.toLowerCase().includes(normalized) ? 1 : 0;
    const bMatch = b.targetCourse.toLowerCase().includes(normalized) ? 1 : 0;
    return bMatch - aMatch;
  });
}


export const TOPIC_SUGGESTIONS_MAP: Record<string, SuggestedTopic[]> = {
  // Class 10 - Science - Chapter 1 - Exercise 1: Balancing Chemical Equations
  'ex-c10-s1-1': [
    {
      id: 'sug-1',
      title: 'Combination & Decomposition Reactions',
      chapterTitle: 'Chapter 1: Chemical Reactions & Equations',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-2',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      reason: 'Natural next step: See how balanced stoichiometry applies when quicklime reacts with water or limestone decomposes on heating.',
      difficulty: 'Medium',
      estimatedMinutes: 20,
    },
    {
      id: 'sug-2',
      title: 'Acids, Bases & Neutralization Balancing',
      chapterTitle: 'Chapter 2: Acids, Bases and Salts',
      chapterId: 'chap-c10-s2',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      reason: 'Cross-topic link: Apply equation balancing to acid-base salt formation (HCl + NaOH → NaCl + H₂O).',
      difficulty: 'Medium',
      estimatedMinutes: 25,
    },
    {
      id: 'sug-3',
      title: 'Displacement & Redox Chemistry',
      chapterTitle: 'Chapter 1: Chemical Reactions & Equations',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-3',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      reason: 'Board exam favorite: Understand single and double displacement precipitates before tackling Redox.',
      difficulty: 'Hard',
      estimatedMinutes: 25,
    },
  ],

  // Class 10 - Science - Chapter 1 - Exercise 2: Combination & Decomposition
  'ex-c10-s1-2': [
    {
      id: 'sug-4',
      title: 'Displacement, Double Displacement & Redox',
      chapterTitle: 'Chapter 1: Chemical Reactions & Equations',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-3',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      reason: 'Completes Chapter 1: Master the remaining two fundamental reaction types with precipitate identification.',
      difficulty: 'Medium',
      estimatedMinutes: 25,
    },
    {
      id: 'sug-5',
      title: 'Life Processes & Cellular Respiration',
      chapterTitle: 'Chapter 6: Life Processes',
      chapterId: 'chap-c10-s6',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      reason: 'Interdisciplinary link: Connect exothermic chemical combustion directly to ATP cellular respiration in biology.',
      difficulty: 'Medium',
      estimatedMinutes: 30,
    },
  ],

  // Class 10 - Science - Chapter 1 - Exercise 3: Displacement & Redox
  'ex-c10-s1-3': [
    {
      id: 'sug-6',
      title: 'Metals & The Reactivity Series',
      chapterTitle: 'Chapter 3: Metals and Non-metals',
      chapterId: 'chap-c10-s3',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      reason: 'Deepens intuition: Understand why iron displaces copper from copper sulfate solution using the electrochemical reactivity series.',
      difficulty: 'Hard',
      estimatedMinutes: 35,
    },
    {
      id: 'sug-7',
      title: 'Corrosion Prevention & Rancidity',
      chapterTitle: 'Chapter 1: Chemical Reactions & Equations',
      chapterId: 'chap-c10-s1',
      exerciseId: 'ex-c10-s1-1',
      subjectId: 'sub-c10-sci',
      classId: 'class-10',
      reason: 'Everyday applications: Galvanization, sacrificial zinc protection, and inert gas packaging.',
      difficulty: 'Easy',
      estimatedMinutes: 15,
    },
  ],

  // Class 10 - Mathematics - Chapter 4: Quadratic Equations
  'ex-c10-m4-1': [
    {
      id: 'sug-8',
      title: 'Real Numbers & Fundamental Theorem of Arithmetic',
      chapterTitle: 'Chapter 1: Real Numbers',
      chapterId: 'chap-c10-m1',
      exerciseId: 'ex-c10-m4-1',
      subjectId: 'sub-c10-math',
      classId: 'class-10',
      reason: 'Algebraic foundation: Strengthen radical roots (√D) and irrational numbers like √2 and √3.',
      difficulty: 'Easy',
      estimatedMinutes: 20,
    },
    {
      id: 'sug-9',
      title: 'Introduction to Trigonometry',
      chapterTitle: 'Chapter 8: Introduction to Trigonometry',
      chapterId: 'chap-c10-m8',
      exerciseId: 'ex-c10-m4-1',
      subjectId: 'sub-c10-math',
      classId: 'class-10',
      reason: 'Next geometric algebra milestone: Apply quadratic trigonometric identities (sin²θ + cos²θ = 1).',
      difficulty: 'Hard',
      estimatedMinutes: 40,
    },
  ],

  // Class 9 - Science - Chapter 9: Force & Laws of Motion
  'ex-c9-s9-1': [
    {
      id: 'sug-10',
      title: "Newton's Third Law & Conservation of Momentum",
      chapterTitle: 'Chapter 9: Force and Laws of Motion',
      chapterId: 'chap-c9-s9',
      exerciseId: 'ex-c9-s9-1',
      subjectId: 'sub-c9-sci',
      classId: 'class-9',
      reason: "Complete the Newtonian framework: Pair force acceleration (F=ma) with equal-and-opposite reaction pairs.",
      difficulty: 'Medium',
      estimatedMinutes: 25,
    },
  ],

  // Class 6 - Mathematics - Chapter 7: Fractions
  'ex-c6-m7-1': [
    {
      id: 'sug-11',
      title: 'Decimals and Place Value',
      chapterTitle: 'Chapter 8: Decimals',
      chapterId: 'chap-c6-m7',
      exerciseId: 'ex-c6-m7-1',
      subjectId: 'sub-c6-math',
      classId: 'class-6',
      reason: 'Direct progression: Convert tenths and hundredths from fractions into base-10 decimal notation.',
      difficulty: 'Easy',
      estimatedMinutes: 20,
    },
  ],
};

/**
 * Returns tailored topic recommendations for any exercise or topic studied.
 */
export function getSuggestedTopics(
  exercise: ExerciseItem,
  chapter?: ChapterItem,
  subject?: SubjectItem
): SuggestedTopic[] {
  // 1. Explicitly configured suggestions
  if (TOPIC_SUGGESTIONS_MAP[exercise.id]) {
    return TOPIC_SUGGESTIONS_MAP[exercise.id];
  }

  if (exercise.concept.suggestedTopics && exercise.concept.suggestedTopics.length > 0) {
    return exercise.concept.suggestedTopics;
  }

  // 2. Dynamic intelligent fallback based on chapter & subject
  const currentSubjectName = subject ? subject.name : 'Science';
  const currentSubjectId = subject ? subject.id : 'sub-c10-sci';
  const currentChapterId = chapter ? chapter.id : 'chap-c10-s1';
  const classId = subject ? subject.classId : 'class-10';

  return [
    {
      id: `dyn-sug-${exercise.id}-1`,
      title: `Advanced Practice: ${exercise.title}`,
      chapterTitle: chapter ? chapter.title : 'Current Unit',
      chapterId: currentChapterId,
      exerciseId: exercise.id,
      subjectId: currentSubjectId,
      classId,
      reason: `Reinforce your high-scoring retention on ${exercise.title} with diagnostic variations.`,
      difficulty: 'Medium',
      estimatedMinutes: 15,
    },
    {
      id: `dyn-sug-${exercise.id}-2`,
      title: `Next NCERT Concept in ${currentSubjectName}`,
      chapterTitle: chapter ? chapter.title : 'Next Chapter',
      chapterId: currentChapterId,
      exerciseId: exercise.id,
      subjectId: currentSubjectId,
      classId,
      reason: 'Maintain daily streak momentum by exploring the next curriculum milestone.',
      difficulty: 'Easy',
      estimatedMinutes: 20,
    },
  ];
}
