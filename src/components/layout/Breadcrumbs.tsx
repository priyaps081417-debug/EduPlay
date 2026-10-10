import React from 'react';
import { ChevronRight, Home, BookOpen, Layers } from 'lucide-react';
import { ClassItem, SubjectItem, ChapterItem, ExerciseItem } from '../../types/curriculum';

interface BreadcrumbsProps {
  selectedClass?: ClassItem | null;
  selectedSubject?: SubjectItem | null;
  selectedChapter?: ChapterItem | null;
  selectedExercise?: ExerciseItem | null;
  onNavigate: (level: 'classes' | 'subjects' | 'chapters' | 'exercises') => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  selectedClass,
  selectedSubject,
  selectedChapter,
  selectedExercise,
  onNavigate,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="w-full py-3 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5 text-xs text-slate-400">
        {/* Root: Classes */}
        <button
          onClick={() => onNavigate('classes')}
          className="flex items-center gap-1 hover:text-slate-200 transition-colors py-1"
        >
          <Home className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">Curriculum</span>
        </button>

        {selectedClass && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => onNavigate('subjects')}
              className={`hover:text-slate-200 transition-colors py-1 ${
                !selectedSubject ? 'font-bold text-white' : 'text-slate-400'
              }`}
            >
              {selectedClass.name}
            </button>
          </>
        )}

        {selectedSubject && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => onNavigate('chapters')}
              className={`hover:text-slate-200 transition-colors py-1 ${
                !selectedChapter ? 'font-bold text-white' : 'text-slate-400'
              }`}
            >
              {selectedSubject.name}
            </button>
          </>
        )}

        {selectedChapter && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => onNavigate('exercises')}
              className={`hover:text-slate-200 transition-colors py-1 truncate max-w-xs ${
                !selectedExercise ? 'font-bold text-white' : 'text-slate-400'
              }`}
              title={selectedChapter.title}
            >
              Ch {selectedChapter.chapterNumber}: {selectedChapter.title}
            </button>
          </>
        )}

        {selectedExercise && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-bold text-emerald-400 truncate max-w-xs" title={selectedExercise.title}>
              Ex {selectedExercise.exerciseNumber}: {selectedExercise.title}
            </span>
          </>
        )}
      </div>
    </nav>
  );
};
