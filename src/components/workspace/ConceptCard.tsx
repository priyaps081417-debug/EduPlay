import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  Lightbulb,
  Globe,
  ArrowRight,
  Bookmark,
  CheckCircle,
  Cpu,
  Layers,
  FileText,
  Compass,
} from 'lucide-react';
import { ConceptCardData, SuggestedTopic } from '../../types/curriculum';
import { SuggestedTopicsCard } from '../common/SuggestedTopicsCard';
import { sound } from '../../services/audio';

interface ConceptCardProps {
  concept: ConceptCardData;
  onProceedToPlayground: () => void;
  suggestedTopics?: SuggestedTopic[];
  onSelectSuggestedTopic?: (topic: SuggestedTopic) => void;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  concept,
  onProceedToPlayground,
  suggestedTopics = [],
  onSelectSuggestedTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'principles' | 'takeaways' | 'curiosities' | 'suggestions'>('summary');
  const [isReading, setIsReading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasUnderstood, setHasUnderstood] = useState(false);
  const [checkedPrinciples, setCheckedPrinciples] = useState<Set<number>>(new Set());

  // Web Speech API for reading aloud NCERT concepts
  const toggleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${concept.title}. ${concept.tagline}. ${concept.summary}. Key points: ${concept.bulletPoints.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    setIsReading(true);
    sound.playHint();
    window.speechSynthesis.speak(utterance);
  };

  const toggleBookmark = () => {
    sound.playClick();
    setIsBookmarked(!isBookmarked);
  };

  const handleUnderstood = () => {
    sound.playCorrect();
    setHasUnderstood(true);
  };

  const togglePrinciple = (index: number) => {
    sound.playClick();
    setCheckedPrinciples((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const tabs = [
    { id: 'summary', label: 'AI-Simplified Notes', icon: Cpu },
    { id: 'principles', label: 'Core Principles', icon: Layers },
    { id: 'takeaways', label: 'High-Yield Takeaways', icon: Sparkles },
    { id: 'curiosities', label: 'Real-World Context', icon: Lightbulb },
    { id: 'suggestions', label: `Suggested Topics (${suggestedTopics.length})`, icon: Compass },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Concept Hero Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>NCERT Concept Breakdown</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400 font-normal">{concept.ncertReference}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {concept.title}
              </h2>
              <p className="text-sm font-medium text-emerald-400 mt-1">
                {concept.tagline}
              </p>
            </div>

            {/* Quick Actions: Audio Reader & Bookmark */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                onClick={toggleReadAloud}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isReading
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md animate-pulse'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
                }`}
                title={isReading ? 'Stop read aloud' : 'Listen to NCERT explanation'}
              >
                {isReading ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isReading ? 'Pause Audio' : 'Listen Aloud'}</span>
              </button>

              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title={isBookmarked ? 'Bookmarked for quick revision' : 'Bookmark concept'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bite-Sized Concept Tabs */}
          <div className="mt-5 flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: AI-Simplified Notes */}
          {activeTab === 'summary' && (
            <div className="mt-6 space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">
                  <Cpu className="w-4 h-4" />
                  <span>Bite-Sized Digest</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {concept.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">Target Outcome</span>
                  <p className="text-xs text-slate-300">
                    Understand reactants versus products, conservation laws, and stoichiometric coefficients.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                  <span className="text-xs font-bold text-amber-400 block mb-1">NCERT Exam Weightage</span>
                  <p className="text-xs text-slate-300">
                    High-probability board exam unit with direct balancing and identification questions (3–5 marks).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Core Principles */}
          {activeTab === 'principles' && (
            <div className="mt-6 space-y-3 animate-in fade-in">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Click each principle as you master it:
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {concept.bulletPoints.map((pt, i) => {
                  const isChecked = checkedPrinciples.has(i);
                  return (
                    <li
                      key={i}
                      onClick={() => togglePrinciple(i)}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {isChecked ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className="text-xs sm:text-sm leading-normal">{pt}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Tab 3: High-Yield Takeaways */}
          {activeTab === 'takeaways' && (
            <div className="mt-6 space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {concept.takeaways.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                    {item.formula && (
                      <div className="mt-3 p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <code className="text-xs font-mono font-bold text-emerald-400">
                          {item.formula}
                        </code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Real-World Context */}
          {activeTab === 'curiosities' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
              <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>NCERT Curiosity · Did You Know?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {concept.funFact}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  <span>Real-World Engineering Application</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {concept.realWorldApplication}
                </p>
              </div>
            </div>
          )}

          {/* Tab 5: Suggested Topics Tab */}
          {activeTab === 'suggestions' && onSelectSuggestedTopic && (
            <div className="mt-6 animate-in fade-in">
              <SuggestedTopicsCard
                currentTopicTitle={concept.title}
                suggestedTopics={suggestedTopics}
                onSelectSuggestedTopic={onSelectSuggestedTopic}
                variant="modal"
              />
            </div>
          )}
        </div>
      </div>

      {/* Suggested Topics Card inline below Concept Hero */}
      {suggestedTopics.length > 0 && onSelectSuggestedTopic && activeTab !== 'suggestions' && (
        <SuggestedTopicsCard
          currentTopicTitle={concept.title}
          suggestedTopics={suggestedTopics}
          onSelectSuggestedTopic={onSelectSuggestedTopic}
          variant="inline"
        />
      )}

      {/* Footer Navigation CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <button
          onClick={handleUnderstood}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            hasUnderstood
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <CheckCircle className={`w-4 h-4 ${hasUnderstood ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>{hasUnderstood ? 'Concept Mastered (+20 XP)' : 'Mark Concept as Understood'}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onProceedToPlayground();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <span>Try Interactive Playground</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
