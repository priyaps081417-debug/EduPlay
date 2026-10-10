/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, Sun, Moon } from 'lucide-react';
import { STUDENT_THEMES, StudentThemeId, themeManager, StudentTheme } from '../../services/themeService';
import { sound } from '../../services/audio';

interface ThemeSelectorProps {
  currentThemeId: StudentThemeId;
  onThemeSelect: (id: StudentThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onThemeSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTheme = STUDENT_THEMES[currentThemeId] || STUDENT_THEMES['creative-studio'];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: StudentThemeId) => {
    sound.playHint();
    themeManager.setTheme(id);
    onThemeSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-rose-500/10 border border-indigo-400/30 hover:border-indigo-400/60 transition-all text-xs font-semibold group shadow-sm"
        title="Change Student Theme (Creative Studio, Midnight, Sunset, Mint)"
        aria-label="Student Theme Picker"
      >
        <span className="text-sm group-hover:scale-125 transition-transform">
          {activeTheme.icon}
        </span>
        <span className="hidden xl:inline text-indigo-400 font-bold group-hover:text-indigo-300">
          {activeTheme.name}
        </span>
        <Palette className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Theme Selection Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                Student Theme Studio
              </span>
            </div>
            <span className="text-[10px] text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Personalize
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pick a creative vibe that sparks your motivation for today's study session:
          </p>

          <div className="space-y-2">
            {(Object.values(STUDENT_THEMES) as StudentTheme[]).map((theme) => {
              const isSelected = theme.id === currentThemeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all group ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-slate-800/80 border border-slate-700/60 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                      {theme.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {theme.name}
                        </span>
                        {theme.mode === 'light' ? (
                          <Sun className="w-3 h-3 text-amber-400 shrink-0" />
                        ) : (
                          <Moon className="w-3 h-3 text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {theme.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Color Swatch Dot */}
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-400 font-bold" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>✨ Creative & Student-Friendly</span>
            <span className="text-indigo-400">Auto-saved</span>
          </div>
        </div>
      )}
    </div>
  );
};
