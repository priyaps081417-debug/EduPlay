/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudentThemeId = 'creative-studio' | 'midnight-scholar' | 'sunset-cafe' | 'mint-academy';

export interface StudentTheme {
  id: StudentThemeId;
  name: string;
  tagline: string;
  icon: string; // Emoji
  mode: 'light' | 'dark';
  primaryColor: string; // Hex for badge
  previewGradient: string;
  bgClass: string;
  cardClass: string;
  borderClass: string;
  textClass: string;
  textMutedClass: string;
  accentGlow: string;
  description: string;
}

export const STUDENT_THEMES: Record<StudentThemeId, StudentTheme> = {
  'creative-studio': {
    id: 'creative-studio',
    name: 'Creative Studio',
    tagline: 'Vibrant Campus & Notebook Canvas',
    icon: '🎨',
    mode: 'light',
    primaryColor: '#6366f1',
    previewGradient: 'from-amber-100 via-indigo-50 to-sky-100',
    bgClass: 'bg-[#f7f9fd]',
    cardClass: 'bg-white',
    borderClass: 'border-slate-200/90',
    textClass: 'text-slate-800',
    textMutedClass: 'text-slate-500',
    accentGlow: 'rgba(99, 102, 241, 0.25)',
    description: 'Clean, warm notebook canvas with colorful badges, creative doodle accents, and high readability.',
  },
  'midnight-scholar': {
    id: 'midnight-scholar',
    name: 'Midnight Scholar',
    tagline: 'Starry Academy & Cyber Notes',
    icon: '🌌',
    mode: 'dark',
    primaryColor: '#818cf8',
    previewGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    bgClass: 'bg-[#0b0f1e]',
    cardClass: 'bg-slate-900/90',
    borderClass: 'border-indigo-900/50',
    textClass: 'text-slate-100',
    textMutedClass: 'text-slate-400',
    accentGlow: 'rgba(129, 140, 248, 0.35)',
    description: 'Cosmic deep-space dark mode with neon streaks, glowing stars, and deep focus ambiance.',
  },
  'sunset-cafe': {
    id: 'sunset-cafe',
    name: 'Sunset Cafe',
    tagline: 'Warm Chai & Cozy Study Lounge',
    icon: '☕',
    mode: 'dark',
    primaryColor: '#f97316',
    previewGradient: 'from-[#1c1319] via-[#2a1721] to-[#1c1319]',
    bgClass: 'bg-[#181118]',
    cardClass: 'bg-[#231823]',
    borderClass: 'border-amber-900/40',
    textClass: 'text-amber-50',
    textMutedClass: 'text-amber-200/70',
    accentGlow: 'rgba(249, 115, 22, 0.3)',
    description: 'Warm terracotta, roasted caramel and sunset twilight for cozy evening problem solving.',
  },
  'mint-academy': {
    id: 'mint-academy',
    name: 'Mint Explorer',
    tagline: 'Fresh Discovery & Mindful Focus',
    icon: '🌿',
    mode: 'dark',
    primaryColor: '#10b981',
    previewGradient: 'from-[#0d1c16] via-[#10281e] to-[#0d1c16]',
    bgClass: 'bg-[#0a1712]',
    cardClass: 'bg-[#12221b]',
    borderClass: 'border-emerald-900/40',
    textClass: 'text-emerald-50',
    textMutedClass: 'text-emerald-200/70',
    accentGlow: 'rgba(16, 185, 129, 0.3)',
    description: 'Botanical emerald, fresh sage and crisp mint tones to keep your brain alert and inspired.',
  },
};

const THEME_STORAGE_KEY = 'eduplay_student_active_theme';
const STICKERS_STORAGE_KEY = 'eduplay_student_active_stickers';

export interface StudentSticker {
  id: string;
  label: string;
  emoji: string;
  badgeColor: string;
}

export const AVAILABLE_STICKERS: StudentSticker[] = [
  { id: 'stk-1', label: '100/100 Mission', emoji: '🚀', badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: 'stk-2', label: 'Curious Mind', emoji: '💡', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'stk-3', label: 'Formula Wizard', emoji: '⚡', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'stk-4', label: 'NCERT Topper', emoji: '🏆', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'stk-5', label: 'Chai & Notes', emoji: '☕', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { id: 'stk-6', label: 'Daily Streak', emoji: '🔥', badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
];

type ThemeListener = (theme: StudentTheme) => void;

class StudentThemeManager {
  private currentThemeId: StudentThemeId = 'creative-studio';
  private listeners: Set<ThemeListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as StudentThemeId | null;
        if (saved && STUDENT_THEMES[saved]) {
          this.currentThemeId = saved;
        } else {
          // Default to Creative Studio for student friendly and creative vibe
          this.currentThemeId = 'creative-studio';
        }
      } catch {
        this.currentThemeId = 'creative-studio';
      }
      this.applyThemeToDOM(this.currentThemeId);
    }
  }

  public getTheme(): StudentTheme {
    return STUDENT_THEMES[this.currentThemeId] || STUDENT_THEMES['creative-studio'];
  }

  public getThemeId(): StudentThemeId {
    return this.currentThemeId;
  }

  public setTheme(id: StudentThemeId): void {
    if (!STUDENT_THEMES[id]) return;
    this.currentThemeId = id;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch (e) {
      console.warn('Could not save theme:', e);
    }
    this.applyThemeToDOM(id);
    const theme = this.getTheme();
    this.listeners.forEach((listener) => listener(theme));
  }

  public subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener);
    listener(this.getTheme());
    return () => this.listeners.delete(listener);
  }

  private applyThemeToDOM(id: StudentThemeId): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', id);
    if (id === 'creative-studio') {
      root.classList.add('theme-creative-studio');
      root.classList.remove('dark');
      root.classList.remove('theme-midnight-scholar', 'theme-sunset-cafe', 'theme-mint-academy');
    } else {
      root.classList.add('dark');
      root.classList.remove('theme-creative-studio');
      root.classList.remove('theme-midnight-scholar', 'theme-sunset-cafe', 'theme-mint-academy');
      root.classList.add(`theme-${id}`);
    }
  }

  // Sticker management
  public getActiveStickers(): string[] {
    try {
      const saved = localStorage.getItem(STICKERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['stk-1', 'stk-2']; // Defaults
  }

  public setActiveStickers(stickers: string[]): void {
    try {
      localStorage.setItem(STICKERS_STORAGE_KEY, JSON.stringify(stickers));
    } catch {}
  }
}

export const themeManager = new StudentThemeManager();
