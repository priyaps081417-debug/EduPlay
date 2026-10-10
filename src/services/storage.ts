import {
  ClassItem,
  SubjectItem,
  ChapterItem,
  ExerciseItem,
  UserProfile,
  OfflineSubmission,
  QuizSubmissionPayload,
  AcademicStream,
} from '../types/curriculum';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_EXERCISES,
  INITIAL_USER_PROFILE,
} from './mockData';
import { FUTURE_STREAM_ROADMAPS } from './recommender';

const KEYS = {
  CLASSES: 'eduplay_curriculum_classes',
  SUBJECTS: 'eduplay_curriculum_subjects',
  CHAPTERS: 'eduplay_curriculum_chapters',
  EXERCISES: 'eduplay_curriculum_exercises',
  USER_PROFILE: 'eduplay_user_profile',
  OFFLINE_QUEUE: 'eduplay_offline_submissions',
  SOUND_ENABLED: 'eduplay_sound_enabled',
  MOCK_MODE_OVERRIDE: 'eduplay_mock_mode_override',
  BACKEND_URL_OVERRIDE: 'eduplay_backend_url_override',
};

// Safe storage access
function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[EDUPLAY Storage] Failed to read ${key}:`, err);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[EDUPLAY Storage] Failed to write ${key}:`, err);
  }
}

export const StorageService = {
  getClasses(): ClassItem[] {
    return getStorage<ClassItem[]>(KEYS.CLASSES, INITIAL_CLASSES);
  },

  setClasses(classes: ClassItem[]): void {
    setStorage(KEYS.CLASSES, classes);
  },

  getSubjects(classId: string): SubjectItem[] {
    const stored = getStorage<Record<string, SubjectItem[]>>(KEYS.SUBJECTS, {});
    const merged = { ...INITIAL_SUBJECTS, ...stored };
    if (merged[classId] && merged[classId].length > 0) return merged[classId];

    // Fallback if an unexpected classId is passed
    const foundClass = INITIAL_CLASSES.find((c) => c.id === classId);
    const className = foundClass ? foundClass.name : 'Selected Grade';
    return [
      {
        id: `sub-${classId}-math`,
        classId,
        name: 'Mathematics',
        code: `MATH-${classId}`,
        color: '#6366f1',
        accentBg: 'rgba(99, 102, 241, 0.1)',
        icon: 'Calculator',
        description: `Mathematical thinking and problem solving for ${className}.`,
        chapterCount: 10,
        completedCount: 3,
        progressPct: 30,
        streamTrack: 'general',
        ncertBookTitle: `${className} Mathematics`,
        officialPdfUrl: 'https://ncert.nic.in/textbook.php',
      },
      {
        id: `sub-${classId}-sci`,
        classId,
        name: 'Science & Discovery',
        code: `SCI-${classId}`,
        color: '#10b981',
        accentBg: 'rgba(16, 185, 129, 0.1)',
        icon: 'Atom',
        description: `NCERT syllabus foundational concepts for ${className}.`,
        chapterCount: 12,
        completedCount: 2,
        progressPct: 16,
        streamTrack: 'general',
        ncertBookTitle: `${className} Science`,
        officialPdfUrl: 'https://ncert.nic.in/textbook.php',
      },
    ];
  },

  setSubjects(classId: string, subjects: SubjectItem[]): void {
    const stored = getStorage<Record<string, SubjectItem[]>>(KEYS.SUBJECTS, {});
    stored[classId] = subjects;
    setStorage(KEYS.SUBJECTS, stored);
  },

  getChapters(subjectId: string): ChapterItem[] {
    const stored = getStorage<Record<string, ChapterItem[]>>(KEYS.CHAPTERS, {});
    const merged = { ...INITIAL_CHAPTERS, ...stored };
    if (merged[subjectId] && merged[subjectId].length > 0) return merged[subjectId];

    // Dynamic authentic fallback chapters for any selected subject
    const isMath = subjectId.includes('math');
    return [
      {
        id: `chap-${subjectId}-1`,
        subjectId,
        chapterNumber: 1,
        title: isMath ? 'Numbers & Arithmetic Foundations' : 'Core Principles & Basic Phenomena',
        subtitle: 'NCERT Chapter 1: Definitions, fundamental properties, formulas and concepts',
        totalExercises: 3,
        completedExercises: 1,
        earnedStars: 3,
        maxStars: 9,
        difficulty: 'Easy',
        estimatedMinutes: 20,
        ncertUnit: 'Unit I: Foundations',
        ncertPdfUrl: 'https://ncert.nic.in/textbook.php',
        solvedPdfUrl: 'https://ncert.nic.in/textbook.php',
        solvedExerciseCount: 3,
      },
      {
        id: `chap-${subjectId}-2`,
        subjectId,
        chapterNumber: 2,
        title: isMath ? 'Operations, Geometry & Patterns' : 'Systems & Natural Laws',
        subtitle: 'NCERT Chapter 2: Real-world problems, theorems, and activities',
        totalExercises: 3,
        completedExercises: 0,
        earnedStars: 0,
        maxStars: 9,
        difficulty: 'Medium',
        estimatedMinutes: 30,
        ncertUnit: 'Unit II: Exploration',
        ncertPdfUrl: 'https://ncert.nic.in/textbook.php',
        solvedPdfUrl: 'https://ncert.nic.in/textbook.php',
        solvedExerciseCount: 3,
      },
      {
        id: `chap-${subjectId}-3`,
        subjectId,
        chapterNumber: 3,
        title: isMath ? 'Advanced Applications & Mensuration' : 'Interactions & Practical Experiments',
        subtitle: 'NCERT Chapter 3: End-of-unit review questions and board pattern problems',
        totalExercises: 3,
        completedExercises: 0,
        earnedStars: 0,
        maxStars: 9,
        difficulty: 'Hard',
        estimatedMinutes: 35,
        ncertUnit: 'Unit III: Mastery',
        ncertPdfUrl: 'https://ncert.nic.in/textbook.php',
        solvedPdfUrl: 'https://ncert.nic.in/textbook.php',
        solvedExerciseCount: 3,
      },
    ];
  },

  setChapters(subjectId: string, chapters: ChapterItem[]): void {
    const stored = getStorage<Record<string, ChapterItem[]>>(KEYS.CHAPTERS, {});
    stored[subjectId] = chapters;
    setStorage(KEYS.CHAPTERS, stored);
  },

  getExercises(chapterId: string): ExerciseItem[] {
    const stored = getStorage<Record<string, ExerciseItem[]>>(KEYS.EXERCISES, {});
    const merged = { ...INITIAL_EXERCISES, ...stored };
    if (merged[chapterId] && merged[chapterId].length > 0) return merged[chapterId];

    // If matches known chapter fallback
    if (chapterId.includes('m4') || chapterId.includes('math')) {
      return INITIAL_EXERCISES['chap-c10-m4'];
    }
    if (chapterId.includes('m7') || chapterId.includes('frac')) {
      return INITIAL_EXERCISES['chap-c6-m7'];
    }

    // Default to Chapter 1 Science
    return INITIAL_EXERCISES['chap-c10-s1'];
  },

  setExercises(chapterId: string, exercises: ExerciseItem[]): void {
    const stored = getStorage<Record<string, ExerciseItem[]>>(KEYS.EXERCISES, {});
    stored[chapterId] = exercises;
    setStorage(KEYS.EXERCISES, stored);
  },

  getUserProfile(): UserProfile {
    const profile = getStorage<UserProfile>(KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
    // Ensure stream, career, and future roadmap exist
    if (!profile.stream) {
      profile.stream = INITIAL_USER_PROFILE.stream;
      profile.streamLabel = INITIAL_USER_PROFILE.streamLabel;
      profile.targetCareerCourse = INITIAL_USER_PROFILE.targetCareerCourse;
      profile.learningPace = INITIAL_USER_PROFILE.learningPace;
    }
    if (!profile.futureRoadmap || profile.futureRoadmap.length === 0) {
      profile.futureRoadmap = FUTURE_STREAM_ROADMAPS[profile.stream || 'pcm'] || [];
    }
    return profile;
  },

  setUserProfile(profile: UserProfile): void {
    // Automatically keep future roadmap aligned with user stream
    if (profile.stream && (!profile.futureRoadmap || profile.futureRoadmap.length === 0)) {
      profile.futureRoadmap = FUTURE_STREAM_ROADMAPS[profile.stream] || [];
    }
    setStorage(KEYS.USER_PROFILE, profile);
  },

  updateUserProfile(partial: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...partial };
    // If stream changed, update streamLabel and future roadmap
    if (partial.stream && partial.stream !== current.stream) {
      updated.futureRoadmap = FUTURE_STREAM_ROADMAPS[partial.stream] || [];
    }
    this.setUserProfile(updated);
    return updated;
  },

  recordLocalQuizCompletion(exerciseId: string, starsEarned: number, xpEarned: number): UserProfile {
    const profile = this.getUserProfile();
    profile.xp += xpEarned;
    profile.xpCurrentLevel += xpEarned;
    if (profile.xpCurrentLevel >= profile.xpForNextLevel) {
      profile.level += 1;
      profile.xpCurrentLevel = profile.xpCurrentLevel - profile.xpForNextLevel;
      profile.xpForNextLevel = Math.round(profile.xpForNextLevel * 1.5);
    }
    profile.levelProgressPct = Math.min(100, Math.round((profile.xpCurrentLevel / profile.xpForNextLevel) * 100));
    profile.stats.totalQuizzesTaken += 1;
    if (starsEarned === 3) profile.stats.perfectScores += 1;
    profile.stats.totalStudyMinutes += 15;
    this.setUserProfile(profile);
    return profile;
  },

  // Offline submission queue
  getOfflineQueue(): OfflineSubmission[] {
    return getStorage<OfflineSubmission[]>(KEYS.OFFLINE_QUEUE, []);
  },

  queueOfflineSubmission(payload: QuizSubmissionPayload): OfflineSubmission {
    const queue = this.getOfflineQueue();
    const item: OfflineSubmission = {
      id: `off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      payload: { ...payload, submittedAt: new Date().toISOString() },
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(item);
    setStorage(KEYS.OFFLINE_QUEUE, queue);
    return item;
  },

  enqueueOfflineSubmission(payload: QuizSubmissionPayload): OfflineSubmission {
    return this.queueOfflineSubmission(payload);
  },

  removeOfflineSubmission(id: string): void {
    const queue = this.getOfflineQueue().filter((item) => item.id !== id);
    setStorage(KEYS.OFFLINE_QUEUE, queue);
  },

  dequeueOfflineSubmission(id: string): void {
    this.removeOfflineSubmission(id);
  },

  clearOfflineQueue(): void {
    setStorage(KEYS.OFFLINE_QUEUE, []);
  },

  // Sound settings
  isSoundEnabled(): boolean {
    return getStorage<boolean>(KEYS.SOUND_ENABLED, true);
  },

  setSoundEnabled(enabled: boolean): void {
    setStorage(KEYS.SOUND_ENABLED, enabled);
  },

  // Mock mode override
  isMockModeOverride(): boolean | null {
    return getStorage<boolean | null>(KEYS.MOCK_MODE_OVERRIDE, null);
  },

  getMockModeOverride(): boolean | null {
    return this.isMockModeOverride();
  },

  setMockModeOverride(override: boolean | null): void {
    if (override === null) {
      localStorage.removeItem(KEYS.MOCK_MODE_OVERRIDE);
    } else {
      setStorage(KEYS.MOCK_MODE_OVERRIDE, override);
    }
  },

  getBackendUrlOverride(): string | null {
    return getStorage<string | null>(KEYS.BACKEND_URL_OVERRIDE, null);
  },

  setBackendUrlOverride(url: string | null): void {
    if (!url) {
      localStorage.removeItem(KEYS.BACKEND_URL_OVERRIDE);
    } else {
      setStorage(KEYS.BACKEND_URL_OVERRIDE, url);
    }
  },
};
