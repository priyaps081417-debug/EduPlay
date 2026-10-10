/**
 * Core type definitions for EDUPLAY curriculum, gamification, and API contracts.
 */

export type EducationStage = 'primary' | 'middle' | 'secondary' | 'senior_secondary';

export interface ClassItem {
  id: string;
  name: string;
  gradeNumber: number;
  stage: EducationStage;
  stageLabel: string;
  description: string;
  subjectCount: number;
  totalChapters: number;
}

export interface SubjectItem {
  id: string;
  classId: string;
  name: string;
  code: string;
  color: string;
  accentBg: string;
  icon: string;
  description: string;
  chapterCount: number;
  completedCount: number;
  progressPct: number;
  streamTrack?: 'mathematics' | 'biology' | 'both' | 'commerce' | 'humanities' | 'general';
  ncertBookTitle?: string;
  officialPdfUrl?: string;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface SolvedProblem {
  id: string;
  exerciseNumber: string;
  question: string;
  solutionSteps: string[];
  formulaUsed?: string;
  finalAnswer: string;
  ncertPage?: number;
  difficulty: DifficultyLevel;
}

export interface ChapterItem {
  id: string;
  subjectId: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  totalExercises: number;
  completedExercises: number;
  earnedStars: number;
  maxStars: number;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  ncertUnit: string;
  ncertPdfUrl?: string;
  solvedPdfUrl?: string;
  solvedExerciseCount?: number;
  solvedSolutions?: SolvedProblem[];
}

export interface KeyTakeaway {
  id: string;
  title: string;
  detail: string;
  formula?: string;
}

export interface SuggestedTopic {
  id: string;
  title: string;
  chapterTitle: string;
  chapterId: string;
  exerciseId: string;
  subjectId: string;
  classId: string;
  reason: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
}

export interface ConceptCardData {
  title: string;
  tagline: string;
  ncertReference: string;
  summary: string;
  bulletPoints: string[];
  takeaways: KeyTakeaway[];
  funFact: string;
  realWorldApplication: string;
  suggestedTopics?: SuggestedTopic[];
}

export type PlaygroundType = 'chemical_balancer' | 'fraction_visualizer' | 'circuit_tester' | 'physics_motion';

export interface ChemicalBalancerState {
  type: 'chemical_balancer';
  equation: string;
  reactants: { name: string; formula: string; defaultCoeff: number; targetCoeff: number }[];
  products: { name: string; formula: string; defaultCoeff: number; targetCoeff: number }[];
  hint: string;
  explanation: string;
}

export interface FractionVisualizerState {
  type: 'fraction_visualizer';
  title: string;
  targetFraction: { numerator: number; denominator: number };
  explanation: string;
}

export interface MotionSimulatorState {
  type: 'physics_motion';
  title: string;
  defaultMass: number;
  defaultForce: number;
  explanation: string;
}

export type PlaygroundData = ChemicalBalancerState | FractionVisualizerState | MotionSimulatorState;

export interface QuizOption {
  id: number;
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionIndex: number;
  hint: string;
  ncertSourceNote: string;
  points: number;
}

export interface QuizData {
  exerciseId: string;
  title: string;
  timeLimitSeconds?: number;
  passingScorePct: number;
  xpReward: number;
  questions: QuizQuestion[];
}

export interface ExerciseItem {
  id: string;
  chapterId: string;
  title: string;
  exerciseNumber: number;
  ncertReference: string;
  status: 'locked' | 'available' | 'completed';
  starsEarned: number;
  concept: ConceptCardData;
  playground: PlaygroundData;
  quiz: QuizData;
  ncertPdfUrl?: string;
  solvedPdfUrl?: string;
  solvedProblems?: SolvedProblem[];
}

export interface QuizSubmissionAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

export interface QuizSubmissionPayload {
  userId: string;
  exerciseId: string;
  score: number; // e.g. 100% or 3 out of 3
  totalQuestions: number;
  correctCount: number;
  answers: QuizSubmissionAnswer[];
  submittedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
  isUnlocked: boolean;
  category: 'accuracy' | 'streak' | 'exploration' | 'mastery';
}

export interface WeakTopic {
  id: string;
  topic: string;
  subject: string;
  accuracyRate: number; // e.g. 45%
  recommendedExerciseId: string;
  recommendedChapterId: string;
  subjectId: string;
  classId: string;
  actionText: string;
}

export interface UserStats {
  totalQuizzesTaken: number;
  perfectScores: number;
  totalStudyMinutes: number;
  accuracyRatePct: number;
  daysActiveThisMonth: number;
  chaptersCompleted: number;
}

export type AcademicStream =
  | 'pcm'
  | 'pcb'
  | 'pcmb'
  | 'commerce_maths'
  | 'commerce'
  | 'humanities'
  | 'foundation';

export interface FutureTopicRoadmap {
  id: string;
  title: string;
  gradeLevel: string;
  stream: AcademicStream;
  targetCourse: string;
  importance: 'Critical High-Yield' | 'Core Fundamental' | 'Competitive Advantage';
  description: string;
  prerequisiteTopic: string;
  chapterId?: string;
  exerciseId?: string;
  subjectId?: string;
  classId?: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  classGrade: number;
  stream: AcademicStream;
  streamLabel: string;
  targetCareerCourse: string;
  learningPace: 'fast' | 'balanced' | 'deep';
  xp: number;
  level: number;
  levelTitle: string;
  xpCurrentLevel: number;
  xpForNextLevel: number;
  levelProgressPct: number;
  streak: number;
  lastActiveDate: string;
  badges: Badge[];
  weakTopics: WeakTopic[];
  stats: UserStats;
  futureRoadmap?: FutureTopicRoadmap[];
}

export interface QuizSubmissionResult {
  success: boolean;
  xpEarned: number;
  newTotalXp: number;
  newLevel: number;
  leveledUp: boolean;
  unlockedBadges: Badge[];
  streakCount: number;
  starsEarned: number;
  syncedToBackend: boolean;
}

export interface OfflineSubmission {
  id: string;
  payload: QuizSubmissionPayload;
  queuedAt: string;
  retryCount: number;
}

export interface ApiStatus {
  isOnline: boolean;
  isMockMode: boolean;
  backendUrl: string;
  lastChecked: string;
  pendingSyncCount: number;
}

// -------------------------------------------------------------
// 1. Multilingual Support Types
// -------------------------------------------------------------
export type SupportedLanguage = 'en' | 'hi' | 'hinglish' | 'mr' | 'ta' | 'te' | 'bn' | 'gu';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  speechCode: string; // e.g. en-IN or hi-IN
}

// -------------------------------------------------------------
// 2. AI Doubt Solver Types (Chapter-Grounded)
// -------------------------------------------------------------
export interface DoubtExplanationData {
  summary: string;
  ncertReference: string;
  stepByStep: string[];
  formulas?: string[];
  commonTrap: string;
  memoryTrick: string;
  practiceCheck?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface DoubtMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chapterGrounded?: {
    classGrade: number;
    subjectName: string;
    chapterTitle: string;
    ncertPage?: number;
  };
  explanation?: DoubtExplanationData;
}

// -------------------------------------------------------------
// 3. Knowledge Graph Types (with Weak-Topic Highlighting)
// -------------------------------------------------------------
export interface GraphNode {
  id: string;
  label: string;
  classGrade: number;
  subject: string;
  chapterId: string;
  exerciseId?: string;
  masteryScore: number; // 0 - 100
  isWeak: boolean;
  weakReason?: string;
  category: 'foundation' | 'core' | 'advanced';
  stream?: 'pcm' | 'pcb' | 'both' | 'commerce' | 'general';
  tags: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'prerequisite' | 'builds_upon' | 'applies';
  label?: string;
}

// -------------------------------------------------------------
// 4. Spaced Repetition Types (SuperMemo SM-2)
// -------------------------------------------------------------
export interface RevisionCard {
  id: string;
  classGrade: number;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  topic: string;
  front: string;
  back: string;
  formula?: string;
  difficulty: DifficultyLevel;
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  lastReviewedAt?: string;
  nextDueDate: string; // ISO date string YYYY-MM-DD
  masteryScore: number; // 0 - 100
}

export type RevisionRating = 'again' | 'hard' | 'good' | 'easy';

// -------------------------------------------------------------
// 5. Step-by-Step Solution Replay Types
// -------------------------------------------------------------
export interface ReplayStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  keyInsight: string;
  commonTrap?: string;
  highlightTokens?: string[];
}

export interface ReplayProblem {
  id: string;
  title: string;
  subject: string;
  chapterTitle: string;
  classGrade: number;
  problemStatement: string;
  givenData: string[];
  toFind: string;
  steps: ReplayStep[];
  finalResult: string;
  ncertPage?: number;
}

// -------------------------------------------------------------
// 6. Study Battles Types (1v1 Live Academic Arena)
// -------------------------------------------------------------
export interface BattleRival {
  id: string;
  name: string;
  avatar: string;
  school: string;
  rating: number; // Elo
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Grandmaster';
  accuracy: number; // 0 - 100
  avgSpeedSeconds: number;
  specialty: string;
}

export interface BattleQuestion {
  id: string;
  subject: string;
  chapter: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
  timeLimitSeconds: number;
}

export interface BattleHistoryItem {
  id: string;
  date: string;
  rivalName: string;
  rivalTier: string;
  userScore: number;
  rivalScore: number;
  result: 'victory' | 'defeat' | 'draw';
  eloChange: number;
  xpEarned: number;
  subject: string;
}

// -------------------------------------------------------------
// 7. YouTube Video Summarizer Types (Accurate, Points-Based)
// -------------------------------------------------------------
export type SummaryMode = 'concise' | 'in_depth' | 'cheat_sheet';

export interface VideoTimelinePoint {
  timestamp: string; // e.g. "02:15"
  timeSeconds: number; // e.g. 135
  topic: string;
  points: string[];
}

export interface VideoFlashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface VideoSummaryResult {
  id: string;
  url: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration?: string;
  summaryMode: SummaryMode;
  executivePoints: string[];
  timelineBreakdown: VideoTimelinePoint[];
  formulasAndDefinitions: string[];
  trapsAndExamPitfalls: string[];
  flashcards: VideoFlashcard[];
  highYieldExamPoints: string[];
  createdAt: string;
  accuracyScore: number; // e.g. 98%
}

