import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { SuggestedTopic } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface SuggestedTopicsCardProps {
  currentTopicTitle: string;
  suggestedTopics: SuggestedTopic[];
  onSelectSuggestedTopic: (topic: SuggestedTopic) => void;
  variant?: 'inline' | 'modal' | 'banner';
}

export const SuggestedTopicsCard: React.FC<SuggestedTopicsCardProps> = ({
  currentTopicTitle,
  suggestedTopics,
  onSelectSuggestedTopic,
  variant = 'inline',
}) => {
  if (!suggestedTopics || suggestedTopics.length === 0) return null;

  const handleSelect = (topic: SuggestedTopic) => {
    sound.playClick();
    onSelectSuggestedTopic(topic);
  };

  const getDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return <span className="text-[11px] font-bold text-emerald-400">Easy</span>;
      case 'Medium':
        return <span className="text-[11px] font-bold text-amber-400">Medium</span>;
      case 'Hard':
        return <span className="text-[11px] font-bold text-rose-400">Hard</span>;
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all ${
        variant === 'modal'
          ? 'bg-slate-900/90 border-indigo-500/30 p-5 text-left'
          : 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/30 p-6'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Curriculum Recommendations</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>Suggested Next Topics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Recommended follow-ups based on <span className="text-slate-200 font-semibold">"{currentTopicTitle}"</span>
          </p>
        </div>

        <div className="text-xs text-indigo-300 font-mono self-start sm:self-auto px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          {suggestedTopics.length} recommended
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {suggestedTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="truncate max-w-[160px] text-indigo-400 font-medium">
                  {topic.chapterTitle}
                </span>
                <div className="flex items-center gap-2">
                  {getDifficultyBadge(topic.difficulty)}
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    {topic.estimatedMinutes}m
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                {topic.title}
              </h4>

              <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p>{topic.reason}</p>
              </div>
            </div>

            <button
              onClick={() => handleSelect(topic)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <span>Study This Topic</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
