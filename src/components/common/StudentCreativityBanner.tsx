/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Dices,
  CheckCircle2,
  Circle,
  Headphones,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Smile,
  Zap,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import { UserProfile } from '../../types/curriculum';
import { AVAILABLE_STICKERS, themeManager, StudentSticker } from '../../services/themeService';
import { sound } from '../../services/audio';
import confetti from 'canvas-confetti';

interface StudentCreativityBannerProps {
  userProfile: UserProfile;
  dueRevisionCount: number;
  onNavigateToTab?: (tab: string) => void;
}

const MOTIVATIONAL_THOUGHTS = [
  { quote: 'Curiosity is the engine of achievement. Ask questions without hesitation!', author: 'Sir Ken Robinson' },
  { quote: 'Small, daily 15-minute concept mastery beats 8 hours of exam cramming.', author: 'Cognitive Science' },
  { quote: 'Creativity is intelligence having fun. See science as an adventure.', author: 'Albert Einstein' },
  { quote: 'Every formula was invented by someone trying to solve a real human problem.', author: 'NCERT Philosophy' },
  { quote: 'Mistakes in practice are proof that your brain is building new neural paths.', author: 'Growth Mindset' },
  { quote: 'Explain a concept to someone else simply — that is true mastery.', author: 'Richard Feynman' },
];

export const StudentCreativityBanner: React.FC<StudentCreativityBannerProps> = ({
  userProfile,
  dueRevisionCount,
  onNavigateToTab,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeStickerIds, setActiveStickerIds] = useState<string[]>(themeManager.getActiveStickers());
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientAudioNode, setAmbientAudioNode] = useState<{ osc?: OscillatorNode; gain?: GainNode; ctx?: AudioContext } | null>(null);

  // Daily Student Quests state (Stored in localStorage)
  const [questDoubt, setQuestDoubt] = useState(() => {
    return localStorage.getItem('eduplay_quest_doubt') === 'true';
  });
  const [questFlashcards, setQuestFlashcards] = useState(() => {
    return localStorage.getItem('eduplay_quest_flashcards') === 'true';
  });
  const [questBattle, setQuestBattle] = useState(() => {
    return localStorage.getItem('eduplay_quest_battle') === 'true';
  });

  const completedQuestsCount = [questDoubt, questFlashcards, questBattle].filter(Boolean).length;

  const handleNextQuote = () => {
    sound.playClick();
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_THOUGHTS.length);
  };

  const toggleSticker = (id: string) => {
    sound.playClick();
    let updated: string[];
    if (activeStickerIds.includes(id)) {
      updated = activeStickerIds.filter((item) => item !== id);
    } else {
      updated = [...activeStickerIds, id];
    }
    setActiveStickerIds(updated);
    themeManager.setActiveStickers(updated);
  };

  const handleToggleQuest = (type: 'doubt' | 'flashcards' | 'battle') => {
    sound.playClick();
    if (type === 'doubt') {
      const next = !questDoubt;
      setQuestDoubt(next);
      localStorage.setItem('eduplay_quest_doubt', String(next));
      if (next) triggerCelebration();
    } else if (type === 'flashcards') {
      const next = !questFlashcards;
      setQuestFlashcards(next);
      localStorage.setItem('eduplay_quest_flashcards', String(next));
      if (next) triggerCelebration();
    } else {
      const next = !questBattle;
      setQuestBattle(next);
      localStorage.setItem('eduplay_quest_battle', String(next));
      if (next) triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    sound.playCorrect();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3 },
      });
    } catch {}
  };

  // Focus Ambient Sound Synthesizer (Gentle theta waves & rain wash)
  const toggleAmbientSound = () => {
    sound.playClick();
    if (isAmbientPlaying) {
      if (ambientAudioNode?.gain && ambientAudioNode?.ctx) {
        ambientAudioNode.gain.gain.exponentialRampToValueAtTime(0.001, ambientAudioNode.ctx.currentTime + 0.5);
        setTimeout(() => {
          try {
            ambientAudioNode.osc?.stop();
            ambientAudioNode.ctx?.close();
          } catch {}
          setAmbientAudioNode(null);
          setIsAmbientPlaying(false);
        }, 500);
      } else {
        setIsAmbientPlaying(false);
      }
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(144, ctx.currentTime); // 144Hz grounding study tone

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.8); // soft gentle volume

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setAmbientAudioNode({ osc, gain, ctx });
        setIsAmbientPlaying(true);
      } catch {
        setIsAmbientPlaying(false);
      }
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (ambientAudioNode?.ctx) {
        try {
          ambientAudioNode.osc?.stop();
          ambientAudioNode.ctx?.close();
        } catch {}
      }
    };
  }, [ambientAudioNode]);

  const activeStickerObjects = AVAILABLE_STICKERS.filter((s) => activeStickerIds.includes(s.id));
  const currentQuote = MOTIVATIONAL_THOUGHTS[quoteIndex];

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border-b border-indigo-500/20 py-2.5 px-4 sm:px-6 lg:px-8 transition-all">
      <div className="max-w-7xl mx-auto">
        {/* Top bar: Greeting, Stickers, Expand/Collapse */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl creative-float">🎒</span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
                <span>Hey <strong className="text-indigo-300">{userProfile.name}</strong>!</span>
                <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {userProfile.streamLabel || 'Class 10 Champ'}
                </span>
              </span>
            </div>

            {/* Pinned Stickers in Header */}
            <div className="hidden md:flex items-center gap-1.5">
              {activeStickerObjects.map((stk) => (
                <span
                  key={stk.id}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${stk.badgeColor}`}
                >
                  <span>{stk.emoji}</span>
                  <span>{stk.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions: Quests, Focus Sound, Stickers Drawer */}
          <div className="flex items-center gap-2">
            {/* Quick Link to Primary Recognition Games */}
            {onNavigateToTab && (
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateToTab('primary_games');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:scale-105 transition-all shadow-xs"
                title="Open Primary Student Recognition Games"
              >
                <span>🎮</span>
                <span className="hidden sm:inline">Junior Play</span>
              </button>
            )}

            {/* Daily Quests progress pill */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold hover:bg-indigo-600/25 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Quests: {completedQuestsCount}/3</span>
              {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Sticker Drawer Toggle */}
            <button
              onClick={() => setShowStickerDrawer(!showStickerDrawer)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
              title="Customize your student badge stickers"
            >
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Stickers</span>
            </button>

            {/* Focus Audio Synthesizer */}
            <button
              onClick={toggleAmbientSound}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                isAmbientPlaying
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
              title={isAmbientPlaying ? 'Stop Focus Study Tone' : 'Play Grounding Focus Ambient Tone'}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAmbientPlaying ? 'Focus: ON' : 'Focus Audio'}</span>
            </button>
          </div>
        </div>

        {/* Expanded Student Creativity Tray */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-indigo-500/15 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Daily Creative Inspiration Quote */}
            <div className="md:col-span-7 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-200 font-medium italic line-clamp-1">
                  "{currentQuote.quote}"
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-indigo-400 font-semibold">— {currentQuote.author}</span>
                  <button
                    onClick={handleNextQuote}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
                    title="Next Creative Thought"
                  >
                    <Dices className="w-3 h-3 text-amber-400" />
                    <span>New Spark</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Daily 3 Student Quests */}
            <div className="md:col-span-5 flex items-center justify-end gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Today:
              </span>

              {/* Quest 1: Ask Doubt */}
              <button
                onClick={() => handleToggleQuest('doubt')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] transition-all ${
                  questDoubt
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {questDoubt ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Circle className="w-3 h-3 text-slate-500" />}
                <span>1 Doubt</span>
              </button>

              {/* Quest 2: Flashcards */}
              <button
                onClick={() => handleToggleQuest('flashcards')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] transition-all ${
                  questFlashcards
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {questFlashcards ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Circle className="w-3 h-3 text-slate-500" />}
                <span>5 Cards</span>
              </button>

              {/* Quest 3: Battle */}
              <button
                onClick={() => handleToggleQuest('battle')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] transition-all ${
                  questBattle
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {questBattle ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Circle className="w-3 h-3 text-slate-500" />}
                <span>1 Battle</span>
              </button>
            </div>
          </div>
        )}

        {/* Sticker Drawer Drawer */}
        {showStickerDrawer && (
          <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-400" />
                Pick Your Student Badges & Stickers
              </span>
              <span className="text-[10px] text-slate-400">Click to toggle on banner</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STICKERS.map((stk) => {
                const isActive = activeStickerIds.includes(stk.id);
                return (
                  <button
                    key={stk.id}
                    onClick={() => toggleSticker(stk.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isActive
                        ? `${stk.badgeColor} ring-2 ring-indigo-500/40 shadow-sm scale-105`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{stk.emoji}</span>
                    <span>{stk.label}</span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
