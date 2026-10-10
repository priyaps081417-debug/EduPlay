import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle2,
  Printer,
  Download,
  BookOpen,
  Sparkles,
  Calculator,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { SolvedProblem, ChapterItem, ClassItem } from '../../types/curriculum';
import { getSolvedMathsData, SOLVED_MATHS_DATASET } from '../../services/solvedMathsData';
import { sound } from '../../services/audio';

interface SolvedPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter?: ChapterItem | null;
  currentClass: ClassItem;
  classes: ClassItem[];
  onSelectExerciseToPractice?: (exerciseId: string) => void;
}

export const SolvedPdfModal: React.FC<SolvedPdfModalProps> = ({
  isOpen,
  onClose,
  chapter,
  currentClass,
  classes,
  onSelectExerciseToPractice,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(currentClass.gradeNumber);
  const [activeProblemIndex, setActiveProblemIndex] = useState<number>(0);

  if (!isOpen) return null;

  // Retrieve dataset matching current chapter or selected grade
  const dataset = chapter?.id && SOLVED_MATHS_DATASET[chapter.id]
    ? SOLVED_MATHS_DATASET[chapter.id]
    : getSolvedMathsData(chapter?.id || `chap-c${selectedGrade}-m1`, chapter?.title, selectedGrade);

  const problems = dataset.problems || [];
  const currentProblem = problems[activeProblemIndex] || problems[0];

  const handleGradeChange = (grade: number) => {
    sound.playClick();
    setSelectedGrade(grade);
    setActiveProblemIndex(0);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl shadow-indigo-950/60 overflow-hidden text-left">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span>Class {selectedGrade} NCERT Mathematics</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Step-by-Step Solved Exercises
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {dataset.solvedPdfTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Class Grade Selector Bar (Class 1 to 12) */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">
              Select Grade:
            </span>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
              <button
                key={grade}
                onClick={() => handleGradeChange(grade)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedGrade === grade
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 ring-1 ring-indigo-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Class {grade}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <a
              href={dataset.ncertTextbookChapterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Official NCERT Chapter</span>
            </a>
          </div>
        </div>

        {/* Main Content Area: Sidebar of Questions + Main Solution Canvas */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Question List Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 p-4 overflow-y-auto space-y-2 shrink-0 max-h-48 md:max-h-none">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
              Solved Question Set ({problems.length})
            </div>

            {problems.map((prob, idx) => {
              const isSelected = activeProblemIndex === idx;

              return (
                <div
                  key={prob.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveProblemIndex(idx);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/60 text-white shadow-sm'
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-indigo-400">{prob.exerciseNumber}</span>
                    <span className="text-[10px] text-slate-500">Page {prob.ncertPage}</span>
                  </div>
                  <p className="text-xs font-medium line-clamp-2 leading-snug">
                    {prob.question}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Solution Reader Canvas */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/90">
            {currentProblem ? (
              <div className="space-y-6 animate-in fade-in">
                
                {/* Problem Header */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                      {currentProblem.exerciseNumber}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>NCERT Page {currentProblem.ncertPage}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-emerald-400">
                        {currentProblem.difficulty} Difficulty
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {currentProblem.question}
                  </h3>
                </div>

                {/* Formula / Identity Box */}
                {currentProblem.formulaUsed && (
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-left">
                    <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Governing NCERT Formula / Theorem</span>
                    </div>
                    <code className="text-xs sm:text-sm font-mono text-indigo-200 block py-1 font-semibold">
                      {currentProblem.formulaUsed}
                    </code>
                  </div>
                )}

                {/* Step-by-Step Solution Breakdown */}
                <div className="space-y-3 text-left">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Step-by-Step Solution Working</span>
                  </div>

                  <div className="space-y-2.5">
                    {currentProblem.solutionSteps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Answer Box */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start sm:items-center justify-between gap-3 text-left">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Final Verified Answer
                    </span>
                    <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 font-mono">
                      {currentProblem.finalAnswer}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>NCERT Verified</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                No solved problems available for this chapter selection.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Covers complete NCERT curriculum exercises from Class 1 through Class 12 with full marking-scheme solutions.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Close Solutions
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
