import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Share2,
  Printer,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ChapterItem, SubjectItem, ClassItem } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface NcertPdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter?: ChapterItem | null;
  subject: SubjectItem;
  currentClass: ClassItem;
  onOpenSolvedPdf?: () => void;
}

export const NcertPdfViewerModal: React.FC<NcertPdfViewerModalProps> = ({
  isOpen,
  onClose,
  chapter,
  subject,
  currentClass,
  onOpenSolvedPdf,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'download'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pdfUrl = chapter?.ncertPdfUrl || subject.officialPdfUrl || 'https://ncert.nic.in/textbook.php';
  const chapterNumber = chapter?.chapterNumber || 1;
  const chapterTitle = chapter?.title || subject.name;
  const bookTitle = subject.ncertBookTitle || `${subject.name} - Class ${currentClass.gradeNumber} NCERT Textbook`;

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard?.writeText(pdfUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl shadow-indigo-950/50 overflow-hidden text-left">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
              style={{ backgroundColor: subject.color }}
            >
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span>{currentClass.name}</span>
                <span aria-hidden="true">·</span>
                <span>{subject.name}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official NCERT Source
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {chapter ? `Chapter ${chapterNumber}: ${chapterTitle}` : bookTitle}
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

        {/* Tab Controls & Quick Actions */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Chapter Overview
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'syllabus'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              NCERT Syllabus & Topics
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'download'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              PDF Downloads & Portals
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSolvedPdf && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenSolvedPdf();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Solved Exercises PDF</span>
              </button>
            )}

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/30"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Official PDF</span>
            </a>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Textbook Metadata Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    NCERT Curriculum Publication
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {bookTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Published by the National Council of Educational Research and Training (NCERT), New Delhi. Approved for CBSE Board 2024–2026 academic syllabus.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied Link!' : 'Share PDF Link'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Summary</span>
                  </button>
                </div>
              </div>

              {/* Reader Simulation / Summary View */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-slate-200">
                      Digital Textbook Companion & Study Notes
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Official Code: {subject.code}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>
                    <strong className="text-white font-semibold">About this Chapter:</strong>{' '}
                    {chapter?.subtitle || `Comprehensive exploration of foundational topics in ${subject.name} for ${currentClass.name}. Contains textbook theory, in-text activities, solved examples, and end-of-chapter exercises.`}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Key Learning Objectives
                      </div>
                      <p className="text-xs text-slate-400">
                        Master the fundamental definitions, scientific principles, and formulas required for classroom quizzes and board examinations.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        CBSE Board Weightage
                      </div>
                      <p className="text-xs text-slate-400">
                        High-yield topic frequently tested in 3-mark and 5-mark subjective problem sets and competitive entrance foundations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
                Detailed unit structure and topic breakdown according to NCERT Guidelines for {currentClass.name}.
              </div>

              <div className="space-y-3">
                {[
                  {
                    num: '1',
                    title: 'Section 1.1: Core Concepts & Foundational Theory',
                    desc: 'Introduction, real-life observations, historical context, and formal scientific/mathematical definitions.',
                  },
                  {
                    num: '2',
                    title: 'Section 1.2: Activities & Demonstrative Experiments',
                    desc: 'Step-by-step laboratory and classroom activities to visualize concepts through hands-on practice.',
                  },
                  {
                    num: '3',
                    title: 'Section 1.3: In-Text Question Sets (Blue Box Problems)',
                    desc: 'Concept verification checks after every subtopic to test student retention.',
                  },
                  {
                    num: '4',
                    title: 'Section 1.4: NCERT End-of-Chapter Exercises',
                    desc: 'Comprehensive multiple-choice, short-answer, and numerical problem sets for board preparation.',
                  },
                ].map((sec) => (
                  <div
                    key={sec.num}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {sec.num}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{sec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Direct Chapter PDF</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Download the official NCERT high-resolution PDF for this specific chapter.
                    </p>
                  </div>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Chapter PDF</span>
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Complete Textbook Portal</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Access all chapters of {subject.name} on the National Council of Educational Research & Training portal.
                    </p>
                  </div>
                  <a
                    href="https://ncert.nic.in/textbook.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visit ncert.nic.in</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Digital NCERT resource synchronized for offline resilience</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
