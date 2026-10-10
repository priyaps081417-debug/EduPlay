import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Check,
  Unlock,
  FileText,
  Calculator,
  Compass,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SubjectItem, ChapterItem, ExerciseItem, ClassItem, SuggestedTopic } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface ChapterListProps {
  currentClass: ClassItem;
  currentSubject: SubjectItem;
  chapters: ChapterItem[];
  exercisesByChapter: Record<string, ExerciseItem[]>;
  onSelectExercise: (chapter: ChapterItem, exercise: ExerciseItem) => void;
  onBackToSubjects: () => void;
  onOpenNcertPdf?: (chapter?: ChapterItem) => void;
  onOpenSolvedPdf?: (chapter?: ChapterItem) => void;
  onSelectSuggestedTopic?: (topic: SuggestedTopic) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  currentClass,
  currentSubject,
  chapters,
  exercisesByChapter,
  onSelectExercise,
  onBackToSubjects,
  onOpenNcertPdf,
  onOpenSolvedPdf,
  onSelectSuggestedTopic,
}) => {
  const [expandedChapterId, setExpandedChapterId] = useState<string>(
    chapters.length > 0 ? chapters[0].id : ''
  );

  const toggleExpand = (chapterId: string) => {
    sound.playClick();
    setExpandedChapterId((prev) => (prev === chapterId ? '' : chapterId));
  };

  const handleLaunchExercise = (chapter: ChapterItem, exercise: ExerciseItem) => {
    sound.playClick();
    onSelectExercise(chapter, exercise);
  };

  const getDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return <span className="text-emerald-400 font-semibold text-xs">Easy</span>;
      case 'Medium':
        return <span className="text-amber-400 font-semibold text-xs">Medium</span>;
      case 'Hard':
        return <span className="text-rose-400 font-semibold text-xs">Hard</span>;
    }
  };

  const isMaths = currentSubject.name.toLowerCase().includes('math');

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToSubjects();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Back to Subjects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <span>{currentClass.name}</span>
              <span aria-hidden="true">·</span>
              <span>{currentSubject.name}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Chapters & Topic Progression
            </h2>
          </div>
        </div>

        {/* Action buttons & Aggregate metrics */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {onOpenNcertPdf && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenNcertPdf();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Official NCERT PDF</span>
            </button>
          )}

          {onOpenSolvedPdf && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenSolvedPdf();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMaths ? 'Maths Solved Exercises PDF' : 'Solved Solutions PDF'}</span>
            </button>
          )}

          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-xs font-bold">
                {chapters.reduce((acc, c) => acc + c.earnedStars, 0)} /{' '}
                {chapters.reduce((acc, c) => acc + c.maxStars, 0)} Stars
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-xs text-slate-400 font-medium">
              {chapters.length} Chapters
            </span>
          </div>
        </div>
      </div>

      {/* Chapters list */}
      <div className="space-y-4">
        {chapters.map((chapter, idx) => {
          const isExpanded = expandedChapterId === chapter.id;
          const exercises = exercisesByChapter[chapter.id] || [];
          const completionPct =
            chapter.totalExercises > 0
              ? Math.round((chapter.completedExercises / chapter.totalExercises) * 100)
              : 0;
          const isChapterComplete = completionPct === 100;
          const isLockedStage = idx > 5 && completionPct === 0;

          return (
            <div
              key={chapter.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isLockedStage
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                  : isExpanded
                  ? 'bg-slate-900/90 border-slate-700 shadow-lg'
                  : 'bg-slate-900/50 hover:bg-slate-900/75 border-slate-800'
              }`}
            >
              {/* Chapter Header row */}
              <div
                onClick={() => !isLockedStage && toggleExpand(chapter.id)}
                className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none ${
                  isLockedStage ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center font-extrabold text-base shrink-0 transition-colors ${
                      isChapterComplete
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isLockedStage
                        ? 'bg-slate-900 text-slate-600 border-slate-800'
                        : 'bg-slate-800 border-slate-700/80 text-white'
                    }`}
                  >
                    {isChapterComplete ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : isLockedStage ? (
                      <Lock className="w-4 h-4 text-slate-600" />
                    ) : (
                      chapter.chapterNumber
                    )}
                  </div>

                  <div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 mb-1">
                      <span className="text-indigo-400 font-medium">{chapter.ncertUnit}</span>
                      <span aria-hidden="true">·</span>
                      {getDifficultyBadge(chapter.difficulty)}
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {chapter.estimatedMinutes} mins
                      </span>
                      <span aria-hidden="true">·</span>
                      {isLockedStage ? (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked Stage
                        </span>
                      ) : isChapterComplete ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </span>
                      ) : (
                        <span className="text-sky-400 flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> Stage Unlocked
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Chapter {chapter.chapterNumber}: {chapter.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>

                {/* Progress & Quick PDF Access */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/80">
                  <div className="text-left md:text-right">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs justify-start md:justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>
                        {chapter.earnedStars} / {chapter.maxStars} Stars
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {chapter.completedExercises} of {chapter.totalExercises} Exercises ({completionPct}%)
                    </div>
                  </div>

                  {/* Chapter-specific PDF quick triggers */}
                  <div className="flex items-center gap-1.5">
                    {onOpenNcertPdf && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick();
                          onOpenNcertPdf(chapter);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Open NCERT Chapter PDF"
                      >
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </button>
                    )}

                    {onOpenSolvedPdf && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick();
                          onOpenSolvedPdf(chapter);
                        }}
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                        title="View Solved Exercise Solutions PDF"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    )}

                    {!isLockedStage && (
                      <button
                        type="button"
                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        aria-label={isExpanded ? 'Collapse exercises' : 'Expand exercises'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar inside chapter */}
              <div className="w-full h-1 bg-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              {/* Expanded Exercises drawer */}
              {isExpanded && !isLockedStage && (
                <div className="bg-slate-950/60 p-5 border-t border-slate-800/80 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-1">
                    <span className="uppercase tracking-wider">Bite-Sized Exercises & Playgrounds</span>
                    <span>{exercises.length} available</span>
                  </div>

                  {exercises.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Loading exercises for Chapter {chapter.chapterNumber}...
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {exercises.map((ex) => {
                        const isLocked = ex.status === 'locked';

                        return (
                          <div
                            key={ex.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-lg bg-indigo-950/70 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                {ex.exerciseNumber}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                  <span>{ex.title}</span>
                                  {ex.starsEarned > 0 && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  )}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {ex.ncertReference}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                              {/* 3-Star indicator */}
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3].map((starIdx) => (
                                  <Star
                                    key={starIdx}
                                    className={`w-3.5 h-3.5 ${
                                      starIdx <= ex.starsEarned
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-700'
                                    }`}
                                  />
                                ))}
                              </div>

                              {isLocked ? (
                                <button
                                  disabled
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
                                >
                                  <Lock className="w-3 h-3" />
                                  Locked Stage
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleLaunchExercise(chapter, ex)}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/30"
                                >
                                  <Play className="w-3 h-3 fill-white" />
                                  <span>{ex.starsEarned > 0 ? 'Practice Again' : 'Start Lesson'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggest Topic recommendation banner for this Chapter */}
                  {onSelectSuggestedTopic && (
                    <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-indigo-200">
                          Recommended next focus after Chapter {chapter.chapterNumber}:{' '}
                          <strong className="text-white">
                            {chapter.chapterNumber < chapters.length
                              ? `Chapter ${chapter.chapterNumber + 1}: ${chapters[chapter.chapterNumber]?.title || 'Next NCERT Unit'}`
                              : 'Board Exam Revision & Solved Exercises'}
                          </strong>
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectSuggestedTopic({
                            id: `sug-chap-${chapter.id}`,
                            title: `Mastery in ${chapter.title}`,
                            chapterTitle: chapter.title,
                            chapterId: chapter.id,
                            exerciseId: exercises[0]?.id || `ex-${chapter.id}-1`,
                            subjectId: currentSubject.id,
                            classId: currentClass.id,
                            reason: 'Reinforces core concepts before moving ahead in the NCERT syllabus.',
                            difficulty: 'Medium',
                            estimatedMinutes: 20,
                          });
                        }}
                        className="flex items-center gap-1 text-indigo-400 font-bold hover:text-indigo-300 self-start sm:self-auto shrink-0"
                      >
                        <span>Explore Topic</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
