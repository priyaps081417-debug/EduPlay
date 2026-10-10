import React, { useState } from 'react';
import {
  Atom,
  Calculator,
  Globe,
  BookOpen,
  Terminal,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Sparkles,
  Dna,
  Binary,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { SubjectItem, ClassItem } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface SubjectListProps {
  currentClass: ClassItem;
  subjects: SubjectItem[];
  selectedSubjectId: string;
  onSelectSubject: (subject: SubjectItem) => void;
  onBackToClasses: () => void;
  onOpenNcertPdf?: (subject: SubjectItem) => void;
  onOpenSolvedPdf?: (subject: SubjectItem) => void;
  onSetProfileStream?: (stream: string) => void;
}

type StreamFilter = 'all' | 'mathematics' | 'biology' | 'commerce' | 'humanities';

export const SubjectList: React.FC<SubjectListProps> = ({
  currentClass,
  subjects,
  selectedSubjectId,
  onSelectSubject,
  onBackToClasses,
  onOpenNcertPdf,
  onOpenSolvedPdf,
  onSetProfileStream,
}) => {
  const isSeniorSecondary = currentClass.gradeNumber >= 11;
  const [streamFilter, setStreamFilter] = useState<StreamFilter>('all');

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'Globe':
        return <Globe className="w-6 h-6" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6" />;
      case 'Dna':
        return <Dna className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  const handleSelect = (sub: SubjectItem) => {
    sound.playClick();
    onSelectSubject(sub);
  };

  // Filter subjects based on stream selection for Class 11 and 12
  const filteredSubjects = subjects.filter((sub) => {
    if (!isSeniorSecondary || streamFilter === 'all') return true;

    if (streamFilter === 'mathematics') {
      return sub.streamTrack === 'mathematics' || sub.streamTrack === 'both';
    }
    if (streamFilter === 'biology') {
      return sub.streamTrack === 'biology' || sub.streamTrack === 'both';
    }
    if (streamFilter === 'commerce') {
      return sub.streamTrack === 'commerce';
    }
    if (streamFilter === 'humanities') {
      return sub.streamTrack === 'humanities';
    }
    return true;
  });

  const getStreamBadge = (track?: string) => {
    if (!track || track === 'general') return null;
    switch (track) {
      case 'biology':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
            <Dna className="w-3 h-3" /> Biology Track (PCB)
          </span>
        );
      case 'mathematics':
        return (
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-[10px] flex items-center gap-1">
            <Binary className="w-3 h-3" /> Maths Track (PCM)
          </span>
        );
      case 'both':
        return (
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-[10px]">
            Common Science Core
          </span>
        );
      case 'commerce':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Commerce Track
          </span>
        );
      case 'humanities':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px] flex items-center gap-1">
            <Landmark className="w-3 h-3" /> Humanities Track
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToClasses();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Back to Grade Selection"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <span>{currentClass.name} Syllabus</span>
              <span aria-hidden="true">·</span>
              <span>{currentClass.stageLabel}</span>
              {isSeniorSecondary && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-bold">Stream Selection Active</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Select Subject
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSolvedPdf && (
            <button
              onClick={() => {
                sound.playClick();
                // Open with first math subject if available
                const mathSub = subjects.find((s) => s.name.toLowerCase().includes('math')) || subjects[0];
                onOpenSolvedPdf(mathSub);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-bold transition-all"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>Maths Solved Exercises PDF (Class 1–12)</span>
            </button>
          )}

          <div className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-200">{filteredSubjects.length} Subjects</span>
          </div>
        </div>
      </div>

      {/* Class 11 & 12 Separation Option: Biology vs Mathematics Tracks */}
      {isSeniorSecondary && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Class {currentClass.gradeNumber} Stream Separation Option</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Separate Syllabus by Academic Stream
              </h3>
              <p className="text-xs text-slate-400">
                Switch between Biology (Medical / NEET) and Mathematics (Engineering / IIT-JEE) tracks, or view Commerce and Humanities.
              </p>
            </div>

            {onSetProfileStream && streamFilter !== 'all' && (
              <button
                onClick={() => {
                  sound.playClick();
                  onSetProfileStream(streamFilter === 'mathematics' ? 'pcm' : streamFilter === 'biology' ? 'pcb' : streamFilter);
                }}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700 shrink-0"
              >
                Set as My Profile Stream
              </button>
            )}
          </div>

          {/* Interactive Stream Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setStreamFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                streamFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>All Subjects</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/10 text-[10px]">
                {subjects.length}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setStreamFilter('mathematics');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                streamFilter === 'mathematics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Binary className="w-3.5 h-3.5 text-indigo-300" />
              <span>📐 Mathematics Track (PCM / Engineering)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setStreamFilter('biology');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                streamFilter === 'biology'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-emerald-300" />
              <span>🧬 Biology Track (PCB / Medical)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setStreamFilter('commerce');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                streamFilter === 'commerce'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
              <span>📊 Commerce Stream</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setStreamFilter('humanities');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                streamFilter === 'humanities'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-rose-300" />
              <span>🏛️ Humanities / Arts</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          const isMaths = sub.name.toLowerCase().includes('math');

          return (
            <div
              key={sub.id}
              className={`group text-left p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500 ring-1 ring-indigo-500/50 shadow-xl shadow-indigo-500/10'
                  : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Subtle accent color top stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: sub.color }}
              />

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => handleSelect(sub)}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: sub.accentBg,
                      color: sub.color,
                    }}
                  >
                    {getSubjectIcon(sub.icon)}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {sub.code}
                    </span>
                    {getStreamBadge(sub.streamTrack)}
                  </div>
                </div>

                <div className="mt-4 cursor-pointer" onClick={() => handleSelect(sub)}>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="font-bold text-slate-200">{sub.progressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sub.progressPct}%`,
                        backgroundColor: sub.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons & PDF Quick Links */}
              <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {sub.completedCount} of {sub.chapterCount} Chapters
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelect(sub)}
                    className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Chapters</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* PDF Resource Links for Subject */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {onOpenNcertPdf && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onOpenNcertPdf(sub);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                      title="View Official NCERT Textbook PDF"
                    >
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span>NCERT PDF</span>
                    </button>
                  )}

                  {isMaths && onOpenSolvedPdf && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onOpenSolvedPdf(sub);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-colors"
                      title="View Solved Maths Exercises PDF"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Solved PDF</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
