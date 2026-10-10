import React, { useState, useEffect, useRef } from 'react';
import {
  Youtube,
  Sparkles,
  Play,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Brain,
  Volume2,
  VolumeX,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  Layers,
  Flame,
  HelpCircle,
  FileText,
  Search,
} from 'lucide-react';
import {
  VideoSummaryResult,
  SummaryMode,
  VideoTimelinePoint,
} from '../../types/curriculum';
import { YouTubeSummarizerService } from '../../services/youtubeSummarizerService';
import { voiceService } from '../../services/voiceService';
import { sound } from '../../services/audio';

interface VideoSummarizerViewProps {
  onAddedToRevision?: (count: number) => void;
  onOpenDoubtSolver?: (topic: string) => void;
}

const SAMPLE_VIDEOS = [
  {
    title: 'Class 10 Chemical Reactions & Equations (NCERT One-Shot)',
    url: 'https://www.youtube.com/watch?v=X1fX_N9K9-E',
    tag: 'Chemistry · Class 10',
  },
  {
    title: 'Class 12 Integration by Parts & Definite Integrals',
    url: 'https://www.youtube.com/watch?v=2rQ6Yv0nB-g',
    tag: 'Maths · Class 12',
  },
  {
    title: 'Class 11 Newton’s Laws of Motion & Friction Mechanics',
    url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    tag: 'Physics · Class 11',
  },
  {
    title: 'How DNA Replicates & Transcribes (Molecular Genetics)',
    url: 'https://www.youtube.com/watch?v=TNKWgcFPHqw',
    tag: 'Biology · Class 12',
  },
];

export const VideoSummarizerView: React.FC<VideoSummarizerViewProps> = ({
  onAddedToRevision,
  onOpenDoubtSolver,
}) => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('concise');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSummary, setCurrentSummary] = useState<VideoSummaryResult | null>(null);
  const [recentSummaries, setRecentSummaries] = useState<VideoSummaryResult[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSeekTime, setCurrentSeekTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'points' | 'timeline' | 'formulas' | 'traps' | 'flashcards'>('points');

  const playerIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Load recent summaries on mount
  useEffect(() => {
    const saved = YouTubeSummarizerService.getSavedSummaries();
    setRecentSummaries(saved);
    if (saved.length > 0 && !currentSummary) {
      setCurrentSummary(saved[0]);
    }
  }, []);

  const handleSummarize = async (targetUrl?: string) => {
    const urlToUse = targetUrl || inputUrl;
    if (!urlToUse.trim()) {
      setError('Please paste a valid YouTube video URL to begin.');
      return;
    }

    sound.playClick();
    setIsLoading(true);
    setError(null);
    voiceService.stopSpeaking();
    setIsSpeaking(false);

    try {
      const result = await YouTubeSummarizerService.summarizeVideo(
        urlToUse.trim(),
        summaryMode
      );
      setCurrentSummary(result);
      setRecentSummaries(YouTubeSummarizerService.getSavedSummaries());
      setCurrentSeekTime(0);
      sound.playSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to summarize video. Please check the URL and try again.');
      sound.playWrong();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeek = (seconds: number) => {
    sound.playClick();
    setCurrentSeekTime(seconds);
    if (playerIframeRef.current && currentSummary) {
      playerIframeRef.current.src = `https://www.youtube.com/embed/${currentSummary.videoId}?start=${seconds}&autoplay=1`;
    }
  };

  const handleCopyMarkdown = () => {
    if (!currentSummary) return;
    sound.playClick();

    let md = `# Video Summary: ${currentSummary.title}\n`;
    md += `Channel: ${currentSummary.channelTitle}\n`;
    md += `URL: ${currentSummary.url}\n\n`;

    md += `## Key Takeaways (In Points)\n`;
    currentSummary.executivePoints.forEach((pt, i) => {
      md += `${i + 1}. ${pt}\n`;
    });

    md += `\n## Chronological Breakdown (In Points)\n`;
    currentSummary.timelineBreakdown.forEach((t) => {
      md += `### [${t.timestamp}] ${t.topic}\n`;
      t.points.forEach((p) => {
        md += `- ${p}\n`;
      });
    });

    if (currentSummary.formulasAndDefinitions.length > 0) {
      md += `\n## Core Formulas & Definitions\n`;
      currentSummary.formulasAndDefinitions.forEach((f) => {
        md += `- ${f}\n`;
      });
    }

    if (currentSummary.trapsAndExamPitfalls.length > 0) {
      md += `\n## Common Pitfalls & Exam Traps\n`;
      currentSummary.trapsAndExamPitfalls.forEach((tr) => {
        md += `- ⚠️ ${tr}\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNotes = () => {
    if (!currentSummary) return;
    sound.playClick();
    let text = `=========================================\n`;
    text += `EDUPLAY AI STUDY NOTES: YOUTUBE SUMMARY\n`;
    text += `Video: ${currentSummary.title}\n`;
    text += `Channel: ${currentSummary.channelTitle}\n`;
    text += `Source: ${currentSummary.url}\n`;
    text += `=========================================\n\n`;

    text += `KEY TAKEAWAYS IN POINTS:\n`;
    currentSummary.executivePoints.forEach((p, i) => {
      text += `[${i + 1}] ${p}\n`;
    });

    text += `\nTIMELINE BREAKDOWN:\n`;
    currentSummary.timelineBreakdown.forEach((t) => {
      text += `\n--- [${t.timestamp}] ${t.topic} ---\n`;
      t.points.forEach((p) => {
        text += ` • ${p}\n`;
      });
    });

    text += `\nFORMULAS & DEFINITIONS:\n`;
    currentSummary.formulasAndDefinitions.forEach((f) => {
      text += ` • ${f}\n`;
    });

    text += `\nEXAM PITFALLS & WARNINGS:\n`;
    currentSummary.trapsAndExamPitfalls.forEach((tr) => {
      text += ` ! ${tr}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${currentSummary.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_Notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleToggleVoice = () => {
    if (!currentSummary) return;
    sound.playClick();

    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const speechText = [
        `Summary of ${currentSummary.title}.`,
        'Here are the key takeaways in points.',
        ...currentSummary.executivePoints,
        'Key formulas and definitions include:',
        ...currentSummary.formulasAndDefinitions,
      ].join('. ');

      setIsSpeaking(true);
      voiceService.speak(speechText, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleExportToRevision = () => {
    if (!currentSummary) return;
    sound.playSuccess();
    const count = YouTubeSummarizerService.exportToRevisionQueue(currentSummary);
    if (onAddedToRevision) {
      onAddedToRevision(count);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-indigo-950/40 to-slate-900 border border-rose-500/20 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                AI YouTube Video Summarizer
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                Precision Grounded in Points
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Paste Any Video URL. Get High-Yield Points.
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Turn any YouTube lecture or NCERT one-shot into precise, verified study notes formatted strictly in points. Includes timestamped breakdowns, formulas, traps, and spaced repetition cards.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Points-Only Synthesis</span>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSummarize();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Youtube className="w-5 h-5 text-rose-400" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste any YouTube URL (e.g., https://www.youtube.com/watch?v=... or shorts / youtu.be)"
                className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner"
              />
              {inputUrl && (
                <button
                  type="button"
                  onClick={() => setInputUrl('')}
                  className="absolute inset-y-0 right-3 my-auto h-7 px-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Mode Selector */}
            <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-2xl p-1 shrink-0">
              <button
                type="button"
                onClick={() => setSummaryMode('concise')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  summaryMode === 'concise'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Concise Points
              </button>
              <button
                type="button"
                onClick={() => setSummaryMode('in_depth')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  summaryMode === 'in_depth'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In-Depth Breakdown
              </button>
              <button
                type="button"
                onClick={() => setSummaryMode('cheat_sheet')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  summaryMode === 'cheat_sheet'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cheat Sheet
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Video Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Summarize in Points</span>
                </>
              )}
            </button>
          </form>

          {/* Error Notice */}
          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Sample Video Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Try sample lecture:
            </span>
            {SAMPLE_VIDEOS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputUrl(item.url);
                  handleSummarize(item.url);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/20 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-left"
              >
                <Youtube className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate max-w-[200px]">{item.title}</span>
                <span className="text-[10px] text-slate-400">({item.tag})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {currentSummary && (
        <div className="space-y-6 animate-in fade-in">
          {/* Metadata & Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center shrink-0">
                <Youtube className="w-6 h-6 text-rose-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white truncate max-w-xl">
                    {currentSummary.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shrink-0">
                    {currentSummary.accuracyScore}% Grounded
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="text-slate-300 font-medium">{currentSummary.channelTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {currentSummary.duration || 'Full Length'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <a
                    href={currentSummary.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    Watch on YouTube
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Voice Read Aloud */}
              <button
                onClick={handleToggleVoice}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSpeaking
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title="Read points aloud using text-to-speech voice"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Reading</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Points Aloud</span>
                  </>
                )}
              </button>

              {/* Add to Spaced Repetition Queue */}
              <button
                onClick={handleExportToRevision}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Send summary flashcard points directly to your daily Spaced Repetition deck"
              >
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span>Add to Revision Queue</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-extrabold">
                  +{currentSummary.flashcards.length}
                </span>
              </button>

              {/* Copy Markdown */}
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Copy points as formatted Markdown"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Points</span>
                  </>
                )}
              </button>

              {/* Download Notes */}
              <button
                onClick={handleDownloadNotes}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Download formatted text notes"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Notes</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Video Player + Points Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Embedded Player & Quick Jumps */}
            <div className="lg:col-span-5 space-y-4">
              {/* Responsive Video Player */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl relative">
                <iframe
                  ref={playerIframeRef}
                  src={`https://www.youtube.com/embed/${currentSummary.videoId}?start=${currentSeekTime}&rel=0&enablejsapi=1`}
                  title={currentSummary.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Click-to-Jump Timeline Index */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-rose-400" />
                    Interactive Video Timestamps
                  </h3>
                  <span className="text-[10px] text-slate-400">Click to seek video</span>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {currentSummary.timelineBreakdown.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSeek(t.timeSeconds)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        currentSeekTime === t.timeSeconds
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 text-rose-400 border border-slate-700 shrink-0">
                        {t.timestamp}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">{t.topic}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {t.points[0]}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Structured Points Tabs */}
            <div className="lg:col-span-7 space-y-4">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                <button
                  onClick={() => setActiveTab('points')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'points'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Key Points ({currentSummary.executivePoints.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'timeline'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Timeline Breakdown ({currentSummary.timelineBreakdown.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('formulas')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'formulas'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Formulas & Laws ({currentSummary.formulasAndDefinitions.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('traps')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'traps'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Pitfalls & Traps ({currentSummary.trapsAndExamPitfalls.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'flashcards'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Flashcards ({currentSummary.flashcards.length})</span>
                </button>
              </div>

              {/* Tab 1: Executive Key Points */}
              {activeTab === 'points' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
                    💡 <strong>Precise Video Takeaways:</strong> Every point below is strictly grounded in the concepts demonstrated in this lecture.
                  </div>

                  {currentSummary.executivePoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3.5 shadow-sm"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                          {point}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* High Yield Exam Cheat Sheet Highlights */}
                  {currentSummary.highYieldExamPoints.length > 0 && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 to-slate-900 border border-amber-500/25 space-y-3 mt-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                        <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>High-Yield CBSE / Board Exam Highlights</span>
                      </div>
                      <div className="space-y-2">
                        {currentSummary.highYieldExamPoints.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-amber-400 font-bold">✓</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Chronological Timeline Breakdown */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  {currentSummary.timelineBreakdown.map((block, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSeek(block.timeSeconds)}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all flex items-center gap-1.5"
                            title="Click to jump video to this point"
                          >
                            <Play className="w-3 h-3 fill-rose-400" />
                            {block.timestamp}
                          </button>
                          <h4 className="text-sm font-bold text-white">{block.topic}</h4>
                        </div>
                      </div>

                      <div className="space-y-2 pl-2 border-l-2 border-slate-800">
                        {block.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                            <span className="text-sky-400 font-bold">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Formulas & Laws */}
              {activeTab === 'formulas' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300">
                    📐 <strong>Governing Equations & Laws:</strong> Exact mathematical relations, chemical equations, and theorems established in the video.
                  </div>

                  {currentSummary.formulasAndDefinitions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          Equation #{idx + 1}
                        </span>
                        <button
                          onClick={() => {
                            sound.playClick();
                            navigator.clipboard.writeText(item);
                          }}
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-300 overflow-x-auto">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Traps & Common Exam Pitfalls */}
              {activeTab === 'traps' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300">
                    ⚠️ <strong>Common Mistakes & Traps:</strong> The educator warned about these frequent errors that cost marks in board examinations.
                  </div>

                  {currentSummary.trapsAndExamPitfalls.map((trap, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-rose-950/15 border border-rose-500/30 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {trap}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Spaced Repetition Flashcards */}
              {activeTab === 'flashcards' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
                    <div className="text-xs text-purple-300">
                      🧠 <strong>Spaced Repetition Ready:</strong> Flashcard points extracted from this lecture for SuperMemo SM-2 daily revision.
                    </div>
                    <button
                      onClick={handleExportToRevision}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shrink-0"
                    >
                      Export to Queue
                    </button>
                  </div>

                  {currentSummary.flashcards.map((fc, idx) => (
                    <div
                      key={fc.id || idx}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {fc.category || 'Lecture Flashcard'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-100">
                        Q: {fc.question}
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <span className="text-emerald-400 font-semibold">Answer: </span>
                        {fc.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recents Shelf */}
      {recentSummaries.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Recently Summarized Lectures ({recentSummaries.length})
            </h3>
            <span className="text-xs text-slate-500">Stored locally</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSummaries.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentSummary(item);
                  setCurrentSeekTime(0);
                  setInputUrl(item.url);
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                  currentSummary?.videoId === item.videoId
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-700/40">
                  <span className="truncate max-w-[120px]">{item.channelTitle}</span>
                  <span className="text-emerald-400 font-bold">{item.executivePoints.length} Points</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
