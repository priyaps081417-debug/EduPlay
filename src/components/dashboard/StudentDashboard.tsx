import React from 'react';
import {
  Flame,
  Zap,
  Award,
  Sparkles,
  Trophy,
  BookOpen,
  Target,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  WifiOff,
  Calendar,
  GraduationCap,
  Compass,
  Edit3,
} from 'lucide-react';
import { UserProfile, WeakTopic, Badge, SuggestedTopic, FutureTopicRoadmap } from '../../types/curriculum';
import { SuggestedTopicsCard } from '../common/SuggestedTopicsCard';
import { FutureRoadmapCard } from './FutureRoadmapCard';
import { sound } from '../../services/audio';

interface StudentDashboardProps {
  profile: UserProfile;
  suggestedTopics?: SuggestedTopic[];
  onSelectSuggestedTopic?: (topic: SuggestedTopic) => void;
  onSelectRoadmapTopic: (topic: FutureTopicRoadmap) => void;
  onPracticeTopic: (weakTopic: WeakTopic) => void;
  onOpenBackendModal: () => void;
  onOpenEditProfile: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  suggestedTopics = [],
  onSelectSuggestedTopic,
  onSelectRoadmapTopic,
  onPracticeTopic,
  onOpenBackendModal,
  onOpenEditProfile,
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getRarityBadge = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Common':
        return <span className="text-[10px] font-bold text-slate-400">Common</span>;
      case 'Rare':
        return <span className="text-[10px] font-bold text-sky-400">Rare</span>;
      case 'Epic':
        return <span className="text-[10px] font-bold text-indigo-400">Epic</span>;
      case 'Legendary':
        return <span className="text-[10px] font-bold text-amber-400">Legendary</span>;
    }
  };

  const weekDays = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: true, isToday: true },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-indigo-600 text-[11px] font-black text-white shadow-md">
                Lvl {profile.level}
              </div>
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-indigo-400">
                <span>Class {profile.classGrade} Scholar</span>
                <span aria-hidden="true">·</span>
                <span>{profile.levelTitle}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-bold">{profile.streamLabel}</span>
              </div>

              <div className="flex items-center gap-3 mt-0.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenEditProfile();
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Edit Profile & Stream"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Career Goal Pill */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target Goal: <strong className="text-white">{profile.targetCareerCourse}</strong></span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenEditProfile();
                  }}
                  className="text-[11px] text-slate-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  Change Stream
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>Streak</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {profile.streak} Days
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-left">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-emerald-400" />
                <span>Total XP</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {profile.xp.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Level {profile.level} Mastery Progress
            </span>
            <span className="font-mono text-indigo-300 font-bold">
              {profile.xpCurrentLevel} / {profile.xpForNextLevel} XP ({profile.levelProgressPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${profile.levelProgressPct}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            Earn {profile.xpForNextLevel - profile.xpCurrentLevel} more XP to reach Level {profile.level + 1}!
          </div>
        </div>
      </div>

      {/* Future Roadmap & Stream-Based Recommendations (Core Requirement) */}
      <FutureRoadmapCard
        profile={profile}
        onSelectRoadmapTopic={onSelectRoadmapTopic}
        onOpenEditProfile={onOpenEditProfile}
      />

      {/* Suggested Topics to Study Next (Based on Current Lessons) */}
      {suggestedTopics.length > 0 && onSelectSuggestedTopic && (
        <SuggestedTopicsCard
          currentTopicTitle="Recent Curriculum Lessons"
          suggestedTopics={suggestedTopics}
          onSelectSuggestedTopic={onSelectSuggestedTopic}
          variant="banner"
        />
      )}

      {/* Grid: 7-Day Streak & Study Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Streak Calendar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>7-Day Study Streak</span>
            </h3>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> Active
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center pt-2">
            {weekDays.map((wd, i) => (
              <div key={i} className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {wd.day}
                </span>
                <div
                  className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all ${
                    wd.completed
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-600 border border-slate-700/60'
                  } ${wd.isToday ? 'ring-2 ring-amber-400' : ''}`}
                >
                  <Flame className={`w-4 h-4 ${wd.completed ? 'fill-amber-400' : ''}`} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 pt-2 leading-relaxed">
            Consistent 15-minute daily practice builds lasting neural retention and unlocks streak badges.
          </p>
        </div>

        {/* Learning Statistics */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Learning Accuracy & Habits</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Quizzes Solved</div>
              <div className="text-xl font-black text-white mt-1">
                {profile.stats.totalQuizzesTaken}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Perfect 3-Stars</div>
              <div className="text-xl font-black text-amber-400 mt-1">
                {profile.stats.perfectScores}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Accuracy Rate</div>
              <div className="text-xl font-black text-emerald-400 mt-1">
                {profile.stats.accuracyRatePct}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium">Time Invested</div>
              <div className="text-xl font-black text-sky-400 mt-1">
                {profile.stats.totalStudyMinutes}m
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weak-Topic Analysis Tags & Targeted Practice */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Targeted Remediation Engine</span>
            </div>
            <h3 className="text-xl font-black text-white">
              Weak-Topic Analysis & Recommendations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Based on recent quiz error patterns. Tackle these bite-sized concepts to boost chapter mastery!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {profile.weakTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{topic.subject}</span>
                  <span className="font-bold text-rose-400">
                    {topic.accuracyRate}% Accuracy
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 leading-snug">
                  {topic.topic}
                </h4>

                {/* Progress bar of current accuracy */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${topic.accuracyRate}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onPracticeTopic(topic);
                }}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white text-xs font-bold transition-all"
              >
                <span>{topic.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Badges Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Achievements & Badges</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Unlock prestigious badges by demonstrating mastery, speed, and consistency.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-300 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            {profile.badges.filter((b) => b.isUnlocked).length} / {profile.badges.length} Unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  badge.isUnlocked
                    ? 'bg-slate-950/80 border-slate-700/80 shadow-md'
                    : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {badge.isUnlocked ? getBadgeIcon(badge.icon) : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white truncate">
                      {badge.name}
                    </h4>
                    {getRarityBadge(badge.rarity)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                  {badge.unlockedAt && (
                    <div className="text-[10px] text-emerald-400 font-medium mt-2">
                      Unlocked on {badge.unlockedAt}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
