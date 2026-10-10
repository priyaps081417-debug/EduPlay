import React, { useState, useEffect } from 'react';
import {
  Brain,
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
  Volume2,
  Calendar,
  Layers,
  ChevronRight,
  Award,
  Zap,
  HelpCircle,
  Search,
} from 'lucide-react';
import { RevisionCard, RevisionRating } from '../../types/curriculum';
import { spacedRepetitionService } from '../../services/spacedRepetitionService';
import { voiceService } from '../../services/voiceService';
import { sound } from '../../services/audio';

interface RevisionQueueViewProps {
  onXpEarned?: (xp: number) => void;
}

export const RevisionQueueView: React.FC<RevisionQueueViewProps> = ({ onXpEarned }) => {
  const [deck, setDeck] = useState<RevisionCard[]>([]);
  const [dueCards, setDueCards] = useState<RevisionCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [totalReviewedThisSession, setTotalReviewedThisSession] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshDeck = () => {
    const all = spacedRepetitionService.getAllCards();
    const due = spacedRepetitionService.getDueCards();
    setDeck(all);
    setDueCards(due);
    if (due.length === 0) {
      setSessionCompleted(true);
    } else {
      setSessionCompleted(false);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    refreshDeck();
  }, []);

  const stats = spacedRepetitionService.getStats();
  const currentCard = dueCards[currentCardIndex];

  const handleFlip = () => {
    sound.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleGrade = (rating: RevisionRating) => {
    if (!currentCard) return;
    sound.playClick();

    const { updatedCard, xpEarned } = spacedRepetitionService.gradeCard(currentCard.id, rating);
    if (rating === 'again') {
      sound.playWrong();
    } else if (rating === 'easy') {
      sound.playCelebration();
    } else {
      sound.playCorrect();
    }

    if (onXpEarned) onXpEarned(xpEarned);
    setTotalReviewedThisSession((prev) => prev + 1);

    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionCompleted(true);
      sound.playCelebration();
    }
  };

  const handleReadAloud = (text: string) => {
    sound.playClick();
    voiceService.speak(text);
  };

  const filteredAllCards = deck.filter(
    (c) =>
      c.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.front.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Spaced Repetition Engine (SM-2)</span>
            <span aria-hidden="true">·</span>
            <span>Optimized Long-Term Memory</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Daily Revision Queue</h2>
          <p className="text-sm text-slate-400 mt-1">
            Science-backed spaced intervals optimize your neural retention before NCERT exams.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Due Today</span>
            <p className="text-2xl font-black text-indigo-400 mt-0.5">{stats.dueCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Mastered</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{stats.masteredCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Cards</span>
            <p className="text-2xl font-black text-sky-400 mt-0.5">{stats.totalCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Avg Retention</span>
            <p className="text-2xl font-black text-amber-400 mt-0.5">{stats.averageMastery}%</p>
          </div>
        </div>
      </div>

      {/* Main Flashcard Practice Area */}
      {!sessionCompleted && currentCard ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Card {currentCardIndex + 1} of {dueCards.length} due today
            </span>
            <span className="text-indigo-400 font-bold uppercase">
              Class {currentCard.classGrade} · {currentCard.subjectName}
            </span>
          </div>

          {/* Flashcard Frame */}
          <div
            onClick={handleFlip}
            className="cursor-pointer bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-indigo-500/30 hover:border-indigo-500/60 rounded-3xl p-8 min-h-[360px] shadow-2xl flex flex-col justify-between transition-all group relative overflow-hidden"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {currentCard.topic}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadAloud(isFlipped ? currentCard.back : currentCard.front);
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  title="Read Aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {isFlipped ? 'SOLUTION (BACK)' : 'PROMPT (FRONT)'}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="py-6 space-y-4 text-center">
              {!isFlipped ? (
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                    {currentCard.front}
                  </h3>
                  <p className="text-xs text-slate-500">Click anywhere to flip and reveal NCERT solution</p>
                </div>
              ) : (
                <div className="space-y-4 text-left animate-in fade-in">
                  <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                    {currentCard.back}
                  </div>
                  {currentCard.formula && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
                      {currentCard.formula}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Flip Callout */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-3">
              <span>Chapter: {currentCard.chapterTitle}</span>
              <span className="text-indigo-400 group-hover:underline">Click card to flip ↺</span>
            </div>
          </div>

          {/* SM-2 Rating Buttons (visible when flipped) */}
          {isFlipped ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 animate-in fade-in">
              <button
                onClick={() => handleGrade('again')}
                className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <span>❌ Again</span>
                <span className="text-[10px] text-rose-400 font-mono font-normal">Review in 1d</span>
              </button>

              <button
                onClick={() => handleGrade('hard')}
                className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <span>⚠️ Hard</span>
                <span className="text-[10px] text-amber-400 font-mono font-normal">Review in 2d</span>
              </button>

              <button
                onClick={() => handleGrade('good')}
                className="p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <span>👍 Good</span>
                <span className="text-[10px] text-indigo-400 font-mono font-normal">Review in 6d</span>
              </button>

              <button
                onClick={() => handleGrade('easy')}
                className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex flex-col items-center gap-1 transition-all shadow-md shadow-emerald-500/10"
              >
                <span>🌟 Easy</span>
                <span className="text-[10px] text-emerald-400 font-mono font-normal">Review in 14d</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleFlip}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
            >
              Show Answer & Derivation
            </button>
          )}
        </div>
      ) : (
        /* Session Completed Screen */
        <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">Daily Revision Queue Clear!</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You reviewed {totalReviewedThisSession} cards today. All due concepts are rescheduled according to the SuperMemo SM-2 interval algorithm.
          </p>
          <button
            onClick={refreshDeck}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Check Again
          </button>
        </div>
      )}

      {/* Deck Overview Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">All Concept Flashcards ({deck.length})</h3>
            <p className="text-xs text-slate-400">Browse your full NCERT spaced memory deck</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts or subjects..."
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Topic & Class</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Interval</th>
                <th className="py-2.5 px-3">Next Due</th>
                <th className="py-2.5 px-3 text-right">Mastery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAllCards.map((card) => (
                <tr key={card.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-white block">{card.topic}</span>
                    <span className="text-[10px] text-slate-500">Class {card.classGrade} · {card.chapterTitle}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{card.subjectName}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{card.intervalDays} days</td>
                  <td className="py-2.5 px-3 text-indigo-400 font-mono">{card.nextDueDate}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`font-mono font-bold ${
                        card.masteryScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {card.masteryScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
