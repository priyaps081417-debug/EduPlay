import React, { useState, useEffect } from 'react';
import { Languages, Volume2, VolumeX, Mic, MicOff, Square, FastForward } from 'lucide-react';
import { languageService, SUPPORTED_LANGUAGES } from '../../services/languageService';
import { voiceService, VoiceState } from '../../services/voiceService';
import { SupportedLanguage } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface LanguageVoiceBarProps {
  onVoiceTranscript?: (text: string) => void;
}

export const LanguageVoiceBar: React.FC<LanguageVoiceBarProps> = ({ onVoiceTranscript }) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(languageService.getLanguage());
  const [voiceState, setVoiceState] = useState<VoiceState>(voiceService.getState());
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const unsubLang = languageService.subscribe((lang) => setCurrentLang(lang));
    const unsubVoice = voiceService.subscribe((v) => setVoiceState(v));
    return () => {
      unsubLang();
      unsubVoice();
    };
  }, []);

  const handleSelectLang = (lang: SupportedLanguage) => {
    sound.playClick();
    languageService.setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleToggleVoiceInput = () => {
    sound.playClick();
    if (voiceState.isListening) {
      voiceService.stopListening();
    } else {
      voiceService.startListening((transcript, isFinal) => {
        if (onVoiceTranscript) {
          onVoiceTranscript(transcript);
        }
      });
    }
  };

  const handleCycleRate = () => {
    sound.playClick();
    const nextRate = voiceState.speechRate === 1.0 ? 1.25 : voiceState.speechRate === 1.25 ? 0.8 : 1.0;
    voiceService.setSpeechRate(nextRate);
  };

  const activeLangOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="flex items-center gap-2 relative">
      {/* Voice Speaking Active Indicator Pill */}
      {voiceState.isSpeaking && (
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs animate-pulse">
          <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="hidden md:inline font-mono text-[11px] max-w-[120px] truncate">
            {voiceState.currentSpokenText || 'Speaking...'}
          </span>
          <button
            onClick={() => {
              sound.playClick();
              voiceService.stopSpeaking();
            }}
            className="p-0.5 hover:text-white rounded hover:bg-indigo-500/30"
            title="Stop Speech"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
          <button
            onClick={handleCycleRate}
            className="text-[10px] font-bold px-1 rounded bg-indigo-500/30 hover:bg-indigo-500/50"
            title="Change voice speed"
          >
            {voiceState.speechRate}x
          </button>
        </div>
      )}

      {/* Mic Input Button */}
      {voiceState.isSupportedSTT && (
        <button
          onClick={handleToggleVoiceInput}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
            voiceState.isListening
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/20 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
          title={voiceState.isListening ? 'Listening... click to stop' : 'Voice input (Speak doubt / answer)'}
        >
          {voiceState.isListening ? <Mic className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
        </button>
      )}

      {/* Language Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            sound.playClick();
            setShowLangMenu(!showLangMenu);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          title="Switch Language (Multilingual NCERT)"
        >
          <Languages className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">{activeLangOption.nativeLabel}</span>
          <span className="sm:hidden uppercase">{activeLangOption.code}</span>
        </button>

        {showLangMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Language
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLang(lang.code)}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                    currentLang === lang.code
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{lang.nativeLabel}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
