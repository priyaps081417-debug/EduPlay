import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Server,
  Layers,
  Sparkles,
  Award,
  Trophy,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Network,
  Brain,
  Swords,
  HelpCircle,
  Youtube,
  Gamepad2,
} from 'lucide-react';
import { UserProfile, ApiStatus } from '../../types/curriculum';
import { StorageService } from '../../services/storage';
import { spacedRepetitionService } from '../../services/spacedRepetitionService';
import { sound } from '../../services/audio';
import { LanguageVoiceBar } from '../common/LanguageVoiceBar';
import { PwaInstallPrompt } from '../pwa/PwaInstallPrompt';
import { ThemeSelector } from '../common/ThemeSelector';
import { StudentThemeId } from '../../services/themeService';

export type NavTabType =
  | 'curriculum'
  | 'workspace'
  | 'doubt_solver'
  | 'video_summarizer'
  | 'knowledge_graph'
  | 'revision_queue'
  | 'study_battles'
  | 'primary_games'
  | 'dashboard';

interface NavbarProps {
  currentTab: NavTabType;
  onSelectTab: (tab: NavTabType) => void;
  userProfile: UserProfile;
  apiStatus: ApiStatus;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenBackendModal: () => void;
  onOpenEditProfile?: () => void;
  dueRevisionCount?: number;
  currentThemeId?: StudentThemeId;
  onThemeSelect?: (id: StudentThemeId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userProfile,
  apiStatus,
  soundEnabled,
  onToggleSound,
  onOpenBackendModal,
  onOpenEditProfile,
  dueRevisionCount = spacedRepetitionService.getDueCount(),
  currentThemeId = 'creative-studio',
  onThemeSelect,
}) => {
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);

  const handleTabClick = (tab: NavTabType) => {
    sound.playClick();
    onSelectTab(tab);
    setShowBadgeMenu(false);
  };

  const handleSoundClick = () => {
    const next = !soundEnabled;
    StorageService.setSoundEnabled(next);
    onToggleSound();
    if (next) {
      sound.playHint();
    }
  };

  const unlockedBadges = userProfile.badges.filter((b) => b.isUnlocked);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Hackathon Brand */}
          <div className="flex items-center gap-4 xl:gap-6">
            <button
              onClick={() => handleTabClick('curriculum')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white">EDUPLAY</span>
                  <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    NCERT
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">by EduTech Titans</p>
              </div>
            </button>

            {/* Main Navigation Segmented Switcher (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              <button
                onClick={() => handleTabClick('curriculum')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'curriculum'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Curriculum</span>
              </button>

              <button
                onClick={() => handleTabClick('workspace')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'workspace'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </button>

              <button
                onClick={() => handleTabClick('doubt_solver')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'doubt_solver'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>AI Doubts</span>
              </button>

              <button
                onClick={() => handleTabClick('video_summarizer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'video_summarizer'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Youtube className="w-3.5 h-3.5 text-rose-400" />
                <span>Video Notes</span>
              </button>

              <button
                onClick={() => handleTabClick('knowledge_graph')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'knowledge_graph'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-rose-400" />
                <span>Graph</span>
              </button>

              <button
                onClick={() => handleTabClick('revision_queue')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  currentTab === 'revision_queue'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span>Revision</span>
                {dueRevisionCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {dueRevisionCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('study_battles')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'study_battles'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Swords className="w-3.5 h-3.5 text-rose-400" />
                <span>Battles</span>
              </button>

              <button
                onClick={() => handleTabClick('primary_games')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'primary_games'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm font-bold'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
                }`}
                title="Primary Student Recognition Games (Class 1-5 Math, EVS & Shapes)"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Junior Play</span>
              </button>

              <button
                onClick={() => handleTabClick('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Progress</span>
              </button>
            </nav>
          </div>

          {/* Gamification Stats, Language & Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Student Theme Studio Switcher */}
            <ThemeSelector
              currentThemeId={currentThemeId}
              onThemeSelect={(id) => onThemeSelect?.(id)}
            />

            {/* Language & Voice Controller */}
            <LanguageVoiceBar />

            {/* PWA Install Button */}
            <PwaInstallPrompt />

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 cursor-pointer hover:bg-amber-500/15 transition-all"
              title={`${userProfile.streak}-day streak! Keep studying daily to maintain momentum.`}
              onClick={() => handleTabClick('dashboard')}
            >
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
              <span className="text-xs font-bold">{userProfile.streak}d</span>
            </div>

            {/* XP Badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 cursor-pointer hover:bg-emerald-500/15 transition-all"
              title={`Total XP: ${userProfile.xp.toLocaleString()}`}
              onClick={() => handleTabClick('dashboard')}
            >
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span className="text-xs font-extrabold">{userProfile.xp.toLocaleString()} XP</span>
            </div>

            {/* Earned Badges Showcase Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowBadgeMenu(!showBadgeMenu);
                }}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/15 transition-all"
                title="Earned Badges Showcase"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">{unlockedBadges.length}</span>
                <ChevronDown className="w-3 h-3 text-indigo-400" />
              </button>

              {/* Badges Mini Dropdown */}
              {showBadgeMenu && (
                <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 animate-in fade-in space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Earned Badges
                    </span>
                    <button
                      onClick={() => handleTabClick('dashboard')}
                      className="text-indigo-400 hover:underline text-[11px]"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {unlockedBadges.map((b) => (
                      <div key={b.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate">{b.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{b.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Academic Stream Pill */}
            {userProfile.streamLabel && (
              <button
                onClick={() => {
                  sound.playClick();
                  if (onOpenEditProfile) onOpenEditProfile();
                  else handleTabClick('dashboard');
                }}
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition-all"
                title={`Academic Stream: ${userProfile.streamLabel} · Goal: ${userProfile.targetCareerCourse}. Click to customize.`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate max-w-[120px]">{userProfile.streamLabel}</span>
              </button>
            )}

            {/* Network Connectivity Indicator */}
            <button
              onClick={onOpenBackendModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                apiStatus.isMockMode || !apiStatus.isOnline
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/30'
              }`}
              title="Click to inspect Backend Connection & Offline Queue"
            >
              {apiStatus.isMockMode || !apiStatus.isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline (Cached)</span>
                  {apiStatus.pendingSyncCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {apiStatus.pendingSyncCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleSoundClick}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label="Toggle sound effects"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Backend Inspector Modal Trigger */}
            <button
              onClick={onOpenBackendModal}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              title="EdTech Backend Inspector & API Contract"
              aria-label="Backend inspector"
            >
              <Server className="w-4 h-4" />
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2 pl-1 group"
              title="Open Student Dashboard"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50 group-hover:ring-indigo-400 transition-all"
              />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-900 text-xs overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => handleTabClick('curriculum')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'curriculum' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum</span>
          </button>
          <button
            onClick={() => handleTabClick('workspace')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'workspace' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
          <button
            onClick={() => handleTabClick('doubt_solver')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'doubt_solver' ? 'text-sky-400 font-bold' : 'text-slate-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>AI Doubts</span>
          </button>
          <button
            onClick={() => handleTabClick('video_summarizer')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'video_summarizer' ? 'text-rose-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>
          <button
            onClick={() => handleTabClick('knowledge_graph')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'knowledge_graph' ? 'text-rose-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Graph</span>
          </button>
          <button
            onClick={() => handleTabClick('revision_queue')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'revision_queue' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Revision ({dueRevisionCount})</span>
          </button>
          <button
            onClick={() => handleTabClick('study_battles')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'study_battles' ? 'text-rose-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Battles</span>
          </button>
          <button
            onClick={() => handleTabClick('primary_games')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'primary_games' ? 'text-amber-400 font-black' : 'text-slate-400'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Junior Play</span>
          </button>
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center gap-1 py-1 px-2 font-medium shrink-0 ${
              currentTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Rewards</span>
          </button>
        </div>
      </div>
    </header>
  );
};

