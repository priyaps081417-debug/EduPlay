import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  PlusCircle,
  Copy,
  Check,
  RotateCcw,
  BookMarked,
} from 'lucide-react';
import { ChapterItem, SubjectItem, ClassItem, DoubtMessage } from '../../types/curriculum';
import { GeminiDoubtSolverService } from '../../services/geminiDoubtSolver';
import { spacedRepetitionService } from '../../services/spacedRepetitionService';
import { voiceService } from '../../services/voiceService';
import { sound } from '../../services/audio';

interface DoubtSolverViewProps {
  currentClass: ClassItem;
  currentSubject: SubjectItem;
  currentChapter: ChapterItem;
  allChapters?: ChapterItem[];
  onSelectChapter?: (chap: ChapterItem) => void;
  onAddedToRevision?: () => void;
}

export const DoubtSolverView: React.FC<DoubtSolverViewProps> = ({
  currentClass,
  currentSubject,
  currentChapter,
  allChapters = [],
  onSelectChapter,
  onAddedToRevision,
}) => {
  const [messages, setMessages] = useState<DoubtMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [addedCards, setAddedCards] = useState<Record<string, boolean>>({});

  // Quick prompt chips grounded in NCERT syllabus
  const quickPrompts = [
    `Explain the most important formula in ${currentChapter.title} simply`,
    `What is the most common board exam mistake in this chapter?`,
    `Give a step-by-step example problem solved from NCERT`,
    `What is a memorable trick or mnemonic for ${currentChapter.title}?`,
    `Which concepts from this chapter are asked most in exams?`,
  ];

  useEffect(() => {
    // Load recent history or set welcome message
    const saved = GeminiDoubtSolverService.getHistory();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      const welcome: DoubtMessage = {
        id: 'welcome-msg',
        sender: 'assistant',
        text: `Hello! I am your Chapter-Grounded AI Doubt Solver. Ask me any question, derivation, or formula from NCERT Class ${currentClass.gradeNumber} ${currentSubject.name}: "${currentChapter.title}". You can also use voice mode to speak your question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chapterGrounded: {
          classGrade: currentClass.gradeNumber,
          subjectName: currentSubject.name,
          chapterTitle: currentChapter.title,
        },
      };
      setMessages([welcome]);
    }
  }, [currentClass, currentSubject, currentChapter]);

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    sound.playClick();
    setInputQuery('');
    setIsLoading(true);

    const userMsg: DoubtMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    try {
      const ansMsg = await GeminiDoubtSolverService.solveDoubt(textToSend, {
        classGrade: currentClass.gradeNumber,
        subjectName: currentSubject.name,
        chapterTitle: currentChapter.title,
      });

      const updated = [...newMessages, ansMsg];
      setMessages(updated);
      GeminiDoubtSolverService.saveHistory(updated);
      sound.playCorrect();

      // Read summary aloud if voice is enabled
      if (ansMsg.explanation) {
        voiceService.speak(`${ansMsg.explanation.summary}. Here are the key steps: ${ansMsg.explanation.stepByStep[0]}`);
      }
    } catch (err) {
      console.warn('Error solving doubt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    sound.playClick();
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.startListening(
        (transcript, isFinal) => {
          setInputQuery(transcript);
          if (isFinal) {
            setIsListening(false);
            handleSendQuery(transcript);
          }
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleAddToRevisionQueue = (msg: DoubtMessage) => {
    if (!msg.explanation) return;
    sound.playClick();

    spacedRepetitionService.addCard({
      classGrade: currentClass.gradeNumber,
      subjectId: currentSubject.id,
      subjectName: currentSubject.name,
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      topic: msg.explanation.summary.substring(0, 45) + '...',
      front: `[NCERT Doubt]: ${msg.text.replace('Here is the chapter-grounded NCERT solution for your doubt: ', '').replace(/"/g, '')}`,
      back: `${msg.explanation.summary}\n\nCore Steps:\n${msg.explanation.stepByStep.join('\n')}\n\nKey Rule: ${msg.explanation.commonTrap}`,
      formula: msg.explanation.formulas?.[0],
      difficulty: 'Medium',
    });

    setAddedCards((prev) => ({ ...prev, [msg.id]: true }));
    sound.playCelebration();
    if (onAddedToRevision) onAddedToRevision();
  };

  const handleCopy = (id: string, text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col h-[780px]">
      {/* Grounding Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Chapter-Grounded AI Doubt Solver
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
              NCERT Syllabus Grounded
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
            Class {currentClass.gradeNumber} · {currentSubject.name} · {currentChapter.title}
          </h3>
        </div>

        {/* Chapter Switcher Dropdown */}
        {allChapters.length > 0 && onSelectChapter && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden lg:inline">Switch Chapter:</span>
            <select
              value={currentChapter.id}
              onChange={(e) => {
                const found = allChapters.find((c) => c.id === e.target.value);
                if (found) onSelectChapter(found);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {allChapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  Ch {chap.chapterNumber}: {chap.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="py-3 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Quick Prompts:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 text-xs whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Conversation Messages Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* User message */}
            {msg.sender === 'user' ? (
              <div className="max-w-xl bg-gradient-to-r from-indigo-600 to-sky-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-md">
                <p className="font-medium">{msg.text}</p>
                <span className="text-[10px] text-indigo-200 mt-1 block text-right">{msg.timestamp}</span>
              </div>
            ) : (
              /* Assistant message */
              <div className="max-w-2xl bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-2xl rounded-tl-none p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white">EDUPLAY NCERT Tutor</span>
                    {msg.chapterGrounded && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {msg.chapterGrounded.chapterTitle}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{msg.text}</p>

                {/* Grounded Breakdown Details */}
                {msg.explanation && (
                  <div className="space-y-3 pt-1">
                    {/* NCERT Reference Citation */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>
                        <strong>NCERT Source Citation:</strong> {msg.explanation.ncertReference}
                      </span>
                    </div>

                    {/* Step-by-Step Breakdown */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Step-by-Step Derivation & Explanation:
                      </span>
                      {msg.explanation.stepByStep.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800/60 text-xs text-slate-300"
                        >
                          <span className="w-5 h-5 rounded bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {sIdx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Formulas Block */}
                    {msg.explanation.formulas && msg.explanation.formulas.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Core Formula(s):
                        </span>
                        {msg.explanation.formulas.map((f, fIdx) => (
                          <div key={fIdx}>{f}</div>
                        ))}
                      </div>
                    )}

                    {/* Common Pitfall & Mnemonic */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Board Exam Trap:</span>
                        </div>
                        <p>{msg.explanation.commonTrap}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Memory Trick (Mnemonic):</span>
                        </div>
                        <p>{msg.explanation.memoryTrick}</p>
                      </div>
                    </div>

                    {/* Interactive Practice Check Question */}
                    {msg.explanation.practiceCheck && (
                      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                            Quick Concept Mastery Check
                          </span>
                        </div>
                        <p className="text-xs font-medium text-white">
                          {msg.explanation.practiceCheck.question}
                        </p>
                        <div className="space-y-1.5">
                          {msg.explanation.practiceCheck.options.map((opt, oIdx) => {
                            const isAnswered = quizAnswers[msg.id] !== undefined;
                            const isSelected = quizAnswers[msg.id] === oIdx;
                            const isCorrect = msg.explanation?.practiceCheck?.correctIndex === oIdx;

                            return (
                              <button
                                key={oIdx}
                                disabled={isAnswered}
                                onClick={() => {
                                  sound.playClick();
                                  setQuizAnswers((prev) => ({ ...prev, [msg.id]: oIdx }));
                                  if (isCorrect) sound.playCorrect();
                                  else sound.playWrong();
                                }}
                                className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                                  isAnswered
                                    ? isCorrect
                                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200'
                                      : isSelected
                                      ? 'bg-rose-500/20 border border-rose-500/50 text-rose-200'
                                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                                    : 'bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300'
                                }`}
                              >
                                <span>{opt}</span>
                                {isAnswered && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>
                        {quizAnswers[msg.id] !== undefined && (
                          <p className="text-[11px] text-slate-300 pt-1">
                            <strong>Explanation:</strong> {msg.explanation.practiceCheck.explanation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            sound.playClick();
                            voiceService.speak(
                              `${msg.explanation?.summary}. Derivation steps: ${msg.explanation?.stepByStep.join('. ')}`
                            );
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold"
                          title="Read Explanation Aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Read Aloud</span>
                        </button>

                        <button
                          onClick={() =>
                            handleCopy(
                              msg.id,
                              `${msg.text}\n\n${msg.explanation?.summary}\n\nSteps:\n${msg.explanation?.stepByStep.join('\n')}`
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToRevisionQueue(msg)}
                        disabled={addedCards[msg.id]}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          addedCards[msg.id]
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        }`}
                      >
                        {addedCards[msg.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Revision Queue</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Add to Revision Queue</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span>Consulting NCERT textbook for chapter grounding...</span>
          </div>
        )}
      </div>

      {/* Input Box with Voice Mic and Send */}
      <div className="pt-3 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title={isListening ? 'Listening... click to send' : 'Speak your doubt (Voice Mode)'}
          >
            {isListening ? <Mic className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask any doubt from "${currentChapter.title}" or speak...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
            title="Send Doubt Query"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
