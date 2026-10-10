/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Trophy,
  RotateCcw,
  CheckCircle2,
  Star,
  ChevronRight,
  HelpCircle,
  Shapes,
  Trees,
  Hash,
  Type,
  Grid,
  Zap,
  Flame,
  Award,
  Smile,
  Heart,
  ArrowRight,
} from 'lucide-react';
import {
  RECOGNITION_QUESTIONS,
  RecognitionQuestion,
  GameCategory,
  PrimaryGradeLevel,
  MEMORY_SETS,
} from '../../services/primaryGamesData';
import { sound } from '../../services/audio';
import { voiceService } from '../../services/voiceService';
import confetti from 'canvas-confetti';

interface PrimaryRecognitionGamesViewProps {
  onXpEarned?: (amount: number) => void;
  initialGrade?: 'primary' | string;
}

export const PrimaryRecognitionGamesView: React.FC<PrimaryRecognitionGamesViewProps> = ({
  onXpEarned,
}) => {
  // Mode selection: 'recognition_quiz' or 'memory_pairs'
  const [activeGameMode, setActiveGameMode] = useState<'recognition_quiz' | 'memory_pairs'>('recognition_quiz');
  const [selectedGrade, setSelectedGrade] = useState<PrimaryGradeLevel>('junior');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>('all');

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [countedIndices, setCountedIndices] = useState<number[]>([]);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  // Memory card game state
  const [memoryCards, setMemoryCards] = useState<{ id: string; pairId: string; content: string; subtext?: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryMatchesFound, setMemoryMatchesFound] = useState(0);
  const [memoryTheme, setMemoryTheme] = useState<'animals' | 'shapes' | 'math_sums'>('animals');

  // Filtered recognition questions
  const filteredQuestions = useMemo(() => {
    return RECOGNITION_QUESTIONS.filter((q) => {
      const matchGrade = q.gradeLevel === selectedGrade;
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      return matchGrade && matchCat;
    });
  }, [selectedGrade, selectedCategory]);

  const currentQuestion: RecognitionQuestion | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Reset quiz when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCountedIndices([]);
  }, [selectedGrade, selectedCategory]);

  // Read question prompt aloud for primary students
  const handleSpeakQuestion = () => {
    if (!currentQuestion) return;
    sound.playClick();
    setIsSpeakingQuestion(true);
    voiceService.speak(currentQuestion.spokenPrompt, () => {
      setIsSpeakingQuestion(false);
    });
  };

  // Handle option selection
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 10);
      setStarsEarned((prev) => prev + 1);
      if (onXpEarned) onXpEarned(25);

      try {
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.6 },
        });
      } catch {}

      // Friendly voice praise
      setTimeout(() => {
        voiceService.speak('Brilliant! You found the correct answer!');
      }, 400);
    } else {
      sound.playWrong();
      voiceService.speak('Good try! Look closely and try again on the next one!');
    }
  };

  // Advance to next question
  const handleNextQuestion = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCountedIndices([]);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or restart
      setCurrentIndex(0);
    }
  };

  // Interactive counting helper for little kids
  const handleTapCountObject = (idx: number) => {
    sound.playClick();
    if (!countedIndices.includes(idx)) {
      setCountedIndices([...countedIndices, idx]);
      voiceService.speak(`${countedIndices.length + 1}`);
    }
  };

  // --- MEMORY GAME LOGIC ---
  const initializeMemoryGame = (theme: 'animals' | 'shapes' | 'math_sums') => {
    const rawSet = MEMORY_SETS[theme];
    let cards: { id: string; pairId: string; content: string; subtext?: string; isFlipped: boolean; isMatched: boolean }[] = [];

    rawSet.forEach((item, idx) => {
      // Create pair
      cards.push({
        id: `card-${item.pairId}-a-${idx}`,
        pairId: item.pairId,
        content: item.content,
        subtext: item.subtext,
        isFlipped: false,
        isMatched: false,
      });
      cards.push({
        id: `card-${item.pairId}-b-${idx}`,
        pairId: item.pairId,
        content: item.content,
        subtext: item.subtext,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    cards = cards.sort(() => Math.random() - 0.5);
    setMemoryCards(cards);
    setFlippedCardIds([]);
    setMemoryMoves(0);
    setMemoryMatchesFound(0);
  };

  useEffect(() => {
    if (activeGameMode === 'memory_pairs') {
      initializeMemoryGame(memoryTheme);
    }
  }, [activeGameMode, memoryTheme]);

  const handleCardClick = (cardId: string) => {
    if (flippedCardIds.length >= 2) return;
    const clickedCard = memoryCards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    sound.playClick();
    const newFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlipped);

    // Flip card visually
    setMemoryCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = memoryCards.find((c) => c.id === firstId);
      const second = memoryCards.find((c) => c.id === secondId);

      if (first && second && first.pairId === second.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playCorrect();
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCardIds([]);
          setMemoryMatchesFound((m) => m + 1);
          setStarsEarned((s) => s + 2);
          if (onXpEarned) onXpEarned(30);

          try {
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.7 },
            });
          } catch {}
        }, 500);
      } else {
        // Not a match, flip back
        setTimeout(() => {
          sound.playWrong();
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCardIds([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Playful Primary Student Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 border-2 border-amber-400/30 shadow-xl relative overflow-hidden">
        {/* Background playful floating shapes */}
        <div className="absolute top-2 right-4 text-4xl opacity-20 pointer-events-none animate-bounce">
          🎈
        </div>
        <div className="absolute bottom-2 right-20 text-3xl opacity-20 pointer-events-none">
          ⭐
        </div>
        <div className="absolute top-6 left-1/3 text-3xl opacity-15 pointer-events-none">
          🧩
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 flex items-center justify-center text-3xl sm:text-4xl shadow-lg ring-4 ring-white/20 shrink-0">
              🦁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  NCERT Classes 1 to 5
                </span>
                <span className="text-xs text-rose-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Primary Playground
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Visual Recognition & Curiosity Games
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Learn Joyful Math, Looking Around (EVS), Shapes, and Phonics through bite-sized, interactive recognition challenges!
              </p>
            </div>
          </div>

          {/* Gamified Star Counter & Score */}
          <div className="flex items-center gap-3 self-end md:self-auto bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-md">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
              <span className="text-base font-black">{starsEarned}</span>
              <span className="text-[10px] font-bold uppercase ml-0.5">Stars</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-extrabold">{score} XP</span>
            </div>
          </div>
        </div>

        {/* Game Mode Segmented Switcher */}
        <div className="mt-6 pt-4 border-t border-amber-400/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setActiveGameMode('recognition_quiz');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGameMode === 'recognition_quiz'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Recognition Quizzes</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveGameMode('memory_pairs');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGameMode === 'memory_pairs'
                  ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Memory Flip & Pair</span>
            </button>
          </div>

          {/* Grade Level Selector */}
          {activeGameMode === 'recognition_quiz' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedGrade('junior');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGrade === 'junior'
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400'
                    : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                🧸 Class 1–2 (Junior)
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedGrade('senior');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGrade === 'senior'
                    ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-400'
                    : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                🚀 Class 3–5 (Senior)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MODE 1: RECOGNITION QUIZ ARENA --- */}
      {activeGameMode === 'recognition_quiz' && (
        <div className="space-y-5">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('all');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>All Games</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('counting');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'counting'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-rose-400" />
              <span>Counting & Numbers</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('shapes');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'shapes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shapes className="w-3.5 h-3.5 text-amber-400" />
              <span>Shape Detective</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('nature_evs');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'nature_evs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trees className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nature & EVS</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('phonics');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'phonics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-sky-400" />
              <span>Phonics Safari</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('patterns');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === 'patterns'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-purple-400" />
              <span>Patterns & Logic</span>
            </button>
          </div>

          {/* Active Question Playground Card */}
          {currentQuestion ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/30 shadow-2xl space-y-6 relative">
              {/* Question Top Metas & Voice Reader */}
              <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {currentQuestion.ncertSubject}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Question {currentIndex + 1} of {filteredQuestions.length}
                  </span>
                </div>

                {/* Big Voice Button for primary learners */}
                <button
                  onClick={handleSpeakQuestion}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                    isSpeakingQuestion
                      ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 animate-pulse'
                      : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30'
                  }`}
                  title="Read question out loud with friendly speech"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeakingQuestion ? 'Reading Aloud...' : 'Read to Me 🔊'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {currentQuestion.prompt}
                </h2>
              </div>

              {/* Visual Interactive Context (e.g. Countable Apples, Sequences) */}
              {currentQuestion.visualContext && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-indigo-500/20 flex flex-col items-center justify-center space-y-3">
                  {currentQuestion.visualContext.type === 'emoji_cluster' && (
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
                      {currentQuestion.visualContext.emojis?.map((item, idx) => {
                        const isCounted = countedIndices.includes(idx);
                        return (
                          <button
                            key={idx}
                            onClick={() => handleTapCountObject(idx)}
                            className={`text-4xl sm:text-5xl transition-all transform hover:scale-125 active:scale-95 cursor-pointer relative p-1 rounded-xl ${
                              isCounted ? 'scale-110 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : ''
                            }`}
                            title="Tap to count!"
                          >
                            <span>{item}</span>
                            {isCounted && (
                              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shadow-md animate-bounce">
                                {countedIndices.indexOf(idx) + 1}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion.visualContext.type === 'sequence' && (
                    <div className="flex items-center justify-center gap-3 sm:gap-4 py-3 flex-wrap">
                      {currentQuestion.visualContext.emojis?.map((item, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl sm:text-3xl shadow-inner font-black"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-amber-300/80 font-medium text-center">
                    💡 Tip: Tap objects above to count along!
                  </p>
                </div>
              )}

              {/* Large Touch-Friendly Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  let cardStyle = 'bg-slate-950/60 border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80 text-white';

                  if (isAnswered) {
                    if (option.isCorrect) {
                      cardStyle = 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500 text-emerald-200 shadow-lg';
                    } else if (isSelected) {
                      cardStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                    } else {
                      cardStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id, option.isCorrect)}
                      disabled={isAnswered}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 group active:scale-98 ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3.5">
                        {option.emoji && (
                          <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                            {option.emoji}
                          </div>
                        )}
                        <div>
                          <span className="text-base sm:text-lg font-black block">
                            {option.label}
                          </span>
                          {option.subtext && (
                            <span className="text-xs text-slate-400 block mt-0.5 font-medium">
                              {option.subtext}
                            </span>
                          )}
                        </div>
                      </div>

                      {isAnswered && option.isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Fun Fact Banner (shows after answer) */}
              {isAnswered && (
                <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Why is this correct?
                    </span>
                    {currentQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect && (
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                        +25 XP ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {currentQuestion.explanation}
                  </p>
                  {currentQuestion.funFact && (
                    <div className="mt-2 pt-2 border-t border-indigo-500/20 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                      <span>💡 <strong>Curious Fact:</strong> {currentQuestion.funFact}</span>
                    </div>
                  )}

                  {/* Next Question Button */}
                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <p className="text-slate-400 text-sm">No questions in this category yet.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Show All Categories
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- MODE 2: VISUAL MEMORY FLIP & PAIR ARENA --- */}
      {activeGameMode === 'memory_pairs' && (
        <div className="space-y-6">
          {/* Theme Selector for Memory Pairs */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Choose Card Deck:</span>
              <button
                onClick={() => setMemoryTheme('animals')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  memoryTheme === 'animals'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🦁 Jungle Animals
              </button>
              <button
                onClick={() => setMemoryTheme('shapes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  memoryTheme === 'shapes'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                🔺 Geometric Shapes
              </button>
              <button
                onClick={() => setMemoryTheme('math_sums')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  memoryTheme === 'math_sums'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                ➕ Math Sums (2+2 ⇄ 4)
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
              <span>Moves: <strong className="text-amber-400">{memoryMoves}</strong></span>
              <span>Matches: <strong className="text-emerald-400">{memoryMatchesFound}/4</strong></span>
              <button
                onClick={() => initializeMemoryGame(memoryTheme)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Restart Memory Deck"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {/* 8-Card Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {memoryCards.map((card) => {
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`h-36 sm:h-44 rounded-3xl border-2 cursor-pointer transition-all duration-300 transform flex flex-col items-center justify-center p-4 text-center select-none ${
                    isRevealed
                      ? card.isMatched
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-100 ring-2 ring-emerald-400'
                        : 'bg-slate-800 border-indigo-400 scale-105 shadow-xl'
                      : 'bg-gradient-to-tr from-slate-900 to-indigo-950/80 border-slate-700 hover:border-amber-400 hover:scale-102 shadow-md'
                  }`}
                >
                  {isRevealed ? (
                    <div className="animate-in zoom-in-75 space-y-1">
                      <span className="text-4xl sm:text-5xl block">{card.content}</span>
                      {card.subtext && (
                        <span className="text-xs font-black text-slate-300 block">
                          {card.subtext}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-70">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl font-black text-indigo-300">
                        ❓
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tap to Flip
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Victory Card when all 4 matched */}
          {memoryMatchesFound === 4 && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500 text-center space-y-3 animate-in zoom-in-95">
              <div className="text-4xl">🎉 🏆 ⭐</div>
              <h3 className="text-xl font-black text-white">
                Memory Master! All Pairs Discovered!
              </h3>
              <p className="text-xs text-emerald-300">
                You matched all pairs in only {memoryMoves} moves! +30 XP added to your student profile!
              </p>
              <button
                onClick={() => initializeMemoryGame(memoryTheme)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Play Another Round
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
