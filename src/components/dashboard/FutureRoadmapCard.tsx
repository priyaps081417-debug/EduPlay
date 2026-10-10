import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { AcademicStream, FutureTopicRoadmap, UserProfile } from '../../types/curriculum';
import { getFutureStreamRoadmap } from '../../services/recommender';
import { sound } from '../../services/audio';

interface FutureRoadmapCardProps {
  profile: UserProfile;
  onSelectRoadmapTopic: (topic: FutureTopicRoadmap) => void;
  onOpenEditProfile: () => void;
}

const STREAM_TABS: Array<{ id: AcademicStream; label: string; icon: string }> = [
  { id: 'pcm', label: 'PCM (Engineering)', icon: '⚡' },
  { id: 'pcb', label: 'PCB (Medical/NEET)', icon: '🧬' },
  { id: 'pcmb', label: 'PCMB (Biotech/AI)', icon: '🔬' },
  { id: 'commerce_maths', label: 'Commerce + Maths (CA)', icon: '📈' },
  { id: 'commerce', label: 'Commerce Core (BBA)', icon: '📊' },
  { id: 'humanities', label: 'Humanities (Law/UPSC)', icon: '⚖️' },
  { id: 'foundation', label: 'Foundation Core', icon: '🌱' },
];

export const FutureRoadmapCard: React.FC<FutureRoadmapCardProps> = ({
  profile,
  onSelectRoadmapTopic,
  onOpenEditProfile,
}) => {
  const [selectedStreamTab, setSelectedStreamTab] = useState<AcademicStream>(
    profile.stream || 'pcm'
  );

  const futureTopics = getFutureStreamRoadmap(
    selectedStreamTab,
    selectedStreamTab === profile.stream ? profile.targetCareerCourse : undefined
  );

  const handleSelectTopic = (topic: FutureTopicRoadmap) => {
    sound.playClick();
    onSelectRoadmapTopic(topic);
  };

  const getImportanceBadge = (importance: FutureTopicRoadmap['importance']) => {
    switch (importance) {
      case 'Critical High-Yield':
        return (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            Critical High-Yield
          </span>
        );
      case 'Core Fundamental':
        return (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
            Core Fundamental
          </span>
        );
      case 'Competitive Advantage':
        return (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            Competitive Edge
          </span>
        );
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl space-y-6">
      {/* Header with Career Aspiration Spotlight */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Future Curriculum Roadmap Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Next-Level Topics for Your Stream & Career</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Personalized syllabus foresight based on your target course:{' '}
            <span className="text-emerald-400 font-bold">{profile.targetCareerCourse}</span>{' '}
            in <span className="text-indigo-300 font-bold">{profile.streamLabel}</span>.
          </p>
        </div>

        <button
          onClick={onOpenEditProfile}
          className="self-start lg:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition-all shrink-0 active:scale-95 shadow-sm"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Change Stream / Career Goal</span>
        </button>
      </div>

      {/* Stream Tabs switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 overflow-x-auto">
        {STREAM_TABS.map((tab) => {
          const isActive = selectedStreamTab === tab.id;
          const isUserDefault = profile.stream === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setSelectedStreamTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isUserDefault && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Your Current Stream" />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid of Future Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {futureTopics.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950/90 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-400">{item.gradeLevel}</span>
                {getImportanceBadge(item.importance)}
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                {item.title}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                <Target className="w-3.5 h-3.5" />
                <span>Target: {item.targetCourse}</span>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {item.description}
              </p>

              {/* Prerequisite Linkage */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 leading-snug">
                <span className="text-slate-300 font-bold block mb-0.5">Foundational Prerequisite:</span>
                <span>{item.prerequisiteTopic}</span>
              </div>

              {/* Tags */}
              <div className="flex items-center flex-wrap gap-1 mt-3">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectTopic(item)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <span>Explore Prerequisite / Practice Lesson</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
