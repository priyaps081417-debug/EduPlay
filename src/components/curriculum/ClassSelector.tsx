import React, { useState } from 'react';
import { Sparkles, BookOpen, GraduationCap, ChevronRight, Compass, Gamepad2 } from 'lucide-react';
import { ClassItem, EducationStage } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface ClassSelectorProps {
  classes: ClassItem[];
  selectedClassId: string;
  onSelectClass: (cls: ClassItem) => void;
  onOpenPrimaryGames?: () => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  onOpenPrimaryGames,
}) => {
  const [filterStage, setFilterStage] = useState<'all' | EducationStage>('all');

  const filtered = filterStage === 'all'
    ? classes
    : classes.filter((c) => c.stage === filterStage);

  const handleSelect = (cls: ClassItem) => {
    sound.playClick();
    onSelectClass(cls);
  };

  return (
    <div className="space-y-6">
      {/* Header section with clean typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>National Curriculum (NCERT / CBSE)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose Your Grade
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Select a class from Grade 1 through 12 to explore bite-sized concepts, gamified simulations, and diagnostic quizzes.
          </p>
        </div>

        {/* Stage Filter Buttons (Functional segmented control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterStage('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterStage === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Classes (1–12)
          </button>
          <button
            onClick={() => setFilterStage('primary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterStage === 'primary'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Primary (1–5)
          </button>
          <button
            onClick={() => setFilterStage('middle')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterStage === 'middle'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Middle (6–8)
          </button>
          <button
            onClick={() => setFilterStage('secondary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterStage === 'secondary'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Secondary (9–10)
          </button>
          <button
            onClick={() => setFilterStage('senior_secondary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterStage === 'senior_secondary'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Senior (11–12)
          </button>
        </div>
      </div>

      {/* Primary Recognition Games Callout for Young Learners */}
      {onOpenPrimaryGames && (filterStage === 'all' || filterStage === 'primary') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 border-2 border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0">
              🦁
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase text-amber-300">
                  Special Feature for Primary Students (Classes 1–5)
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  Audio & Voice Enabled
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                Play Visual Recognition Games: Joyful Counting, Shape Detective & EVS!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Practice identifying numbers, 2D/3D shapes, animals, and phonics through cheerful, gamified challenges.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenPrimaryGames();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Play Recognition Games 🎮</span>
          </button>
        </div>
      )}

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          const isFlagship = cls.gradeNumber === 10;

          return (
            <div
              key={cls.id}
              onClick={() => handleSelect(cls)}
              className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
              }`}
            >
              {/* Highlight badge for flagship demo classes */}
              {isFlagship && (
                <div className="absolute top-0 right-0 bg-indigo-600/90 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-bl-xl border-l border-b border-indigo-400/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Popular
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 border border-slate-700/60 flex items-center justify-center font-black text-xl text-white transition-colors">
                  {cls.gradeNumber}
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-indigo-400 block">
                    {cls.stageLabel}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {cls.subjectCount} Subjects
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {cls.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cls.description}
                </p>
              </div>

              {/* Card Footer: Metadata with dots, no pill clutter */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>{cls.totalChapters} Chapters</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
