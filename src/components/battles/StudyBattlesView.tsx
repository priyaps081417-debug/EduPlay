import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Shield,
  Zap,
  Timer,
  Trophy,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  User,
  School,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BattleRival, BattleQuestion, BattleHistoryItem, UserProfile } from '../../types/curriculum';
import {
  studyBattlesService,
  BOT_RIVALS,
} from '../../services/studyBattlesService';
import { sound } from '../../services/audio';

interface StudyBattlesViewProps {
  userProfile: UserProfile;
  onXpEarned?: (xp: number) => void;
}

export const StudyBattlesView: React.FC<StudyBattlesViewProps> = ({ userProfile, onXpEarned }) => {
  const [gameState, setGameState] = useState<'lobby' | 'matchmaking' | 'battle' | 'results'>('lobby');
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');
  const [selectedRival, setSelectedRival] = useState<BattleRival>(BOT_RIVALS[0]);
  const [userElo, setUserElo] = useState<number>(studyBattlesService.getUserElo());

  // Battle session state
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [userScore, setUserScore] = useState<number>(0);
  const [rivalScore, setRivalScore] = useState<number>(0);
  const [userCombo, setUserCombo] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [rivalAnswered, setRivalAnswered] = useState<boolean>(false);
  const [rivalChoice, setRivalChoice] = useState<number | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [doubleXpActive, setDoubleXpActive] = useState<boolean>(false);

  // Power-ups inventory (usable once per match)
  const [powerUps, setPowerUps] = useState({
    freeze: true,
    fiftyFifty: true,
    doubleXp: true,
  });

  // History
  const [history, setHistory] = useState<BattleHistoryItem[]>(studyBattlesService.getHistory());
  const timerRef = useRef<any>(null);

  const currentQ = questions[currentRound];

  // Matchmaking animation
  const handleStartBattle = (rival?: BattleRival) => {
    sound.playClick();
    if (rival) setSelectedRival(rival);
    setGameState('matchmaking');

    setTimeout(() => {
      const qList = studyBattlesService.getQuestionsForSubject(selectedSubject);
      setQuestions(qList);
      setCurrentRound(0);
      setUserScore(0);
      setRivalScore(0);
      setUserCombo(0);
      setSelectedOption(null);
      setRivalAnswered(false);
      setRivalChoice(null);
      setEliminatedOptions([]);
      setDoubleXpActive(false);
      setPowerUps({ freeze: true, fiftyFifty: true, doubleXp: true });
      setTimeLeft(qList[0]?.timeLimitSeconds || 12);
      setGameState('battle');
      sound.playHint();
    }, 1800);
  };

  // Timer tick during battle
  useEffect(() => {
    if (gameState === 'battle') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulate Rival answering after delay
      const rivalDelayMs = Math.max(2000, Math.min(8000, selectedRival.avgSpeedSeconds * 1000 + (Math.random() * 2000 - 1000)));
      const rivalTimer = setTimeout(() => {
        if (gameState === 'battle' && !rivalAnswered && currentQ) {
          const isCorrect = Math.random() * 100 <= selectedRival.accuracy;
          const choice = isCorrect
            ? currentQ.correctIndex
            : (currentQ.correctIndex + 1) % currentQ.options.length;

          setRivalChoice(choice);
          setRivalAnswered(true);
          if (isCorrect) {
            setRivalScore((s) => s + currentQ.points);
          }
        }
      }, rivalDelayMs);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        clearTimeout(rivalTimer);
      };
    }
  }, [gameState, currentRound, rivalAnswered]);

  const handleTimeExpired = () => {
    if (selectedOption === null) {
      sound.playWrong();
      setUserCombo(0);
    }
    advanceRound();
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null || !currentQ) return;
    sound.playClick();
    setSelectedOption(idx);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      const points = (currentQ.points * (doubleXpActive ? 2 : 1)) + (userCombo * 20);
      setUserScore((s) => s + points);
      setUserCombo((c) => c + 1);
    } else {
      sound.playWrong();
      setUserCombo(0);
    }

    setTimeout(() => {
      advanceRound();
    }, 1400);
  };

  const advanceRound = () => {
    if (currentRound < questions.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setSelectedOption(null);
      setRivalAnswered(false);
      setRivalChoice(null);
      setEliminatedOptions([]);
      setDoubleXpActive(false);
      setTimeLeft(questions[currentRound + 1]?.timeLimitSeconds || 12);
    } else {
      finishBattle();
    }
  };

  const finishBattle = () => {
    setGameState('results');
    const won = userScore >= rivalScore;
    const eloChange = studyBattlesService.calculateElo(userElo, selectedRival.rating, won);
    const newElo = Math.max(800, userElo + eloChange);
    setUserElo(newElo);
    studyBattlesService.setUserElo(newElo);

    const xpEarned = won ? 150 : 50;
    if (onXpEarned) onXpEarned(xpEarned);

    if (won) {
      sound.playCelebration();
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        // ignore
      }
    } else {
      sound.playWrong();
    }

    const battleRecord: BattleHistoryItem = {
      id: `bh-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      rivalName: selectedRival.name,
      rivalTier: selectedRival.tier,
      userScore,
      rivalScore,
      result: won ? (userScore === rivalScore ? 'draw' : 'victory') : 'defeat',
      eloChange,
      xpEarned,
      subject: selectedSubject,
    };

    studyBattlesService.recordBattle(battleRecord);
    setHistory((prev) => [battleRecord, ...prev]);
  };

  // Power-up triggers
  const handleUseFreeze = () => {
    if (!powerUps.freeze) return;
    sound.playHint();
    setTimeLeft((t) => t + 6);
    setPowerUps((p) => ({ ...p, freeze: false }));
  };

  const handleUseFiftyFifty = () => {
    if (!powerUps.fiftyFifty || !currentQ) return;
    sound.playHint();
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setEliminatedOptions(shuffled);
    setPowerUps((p) => ({ ...p, fiftyFifty: false }));
  };

  const handleUseDoubleXp = () => {
    if (!powerUps.doubleXp) return;
    sound.playHint();
    setDoubleXpActive(true);
    setPowerUps((p) => ({ ...p, doubleXp: false }));
  };

  const getTierFromElo = (elo: number) => {
    if (elo >= 1800) return 'Grandmaster';
    if (elo >= 1600) return 'Diamond';
    if (elo >= 1400) return 'Gold';
    if (elo >= 1200) return 'Silver';
    return 'Bronze';
  };

  return (
    <div className="space-y-6">
      {/* 1. Lobby View */}
      {gameState === 'lobby' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <Swords className="w-4 h-4" />
                <span>1v1 Live Peer Arena</span>
                <span aria-hidden="true">·</span>
                <span>Real-Time Rapid NCERT Duels</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">Study Battles</h2>
              <p className="text-sm text-slate-400 mt-1">
                Challenge academic rivals across India in 5-round speed duels. Earn Elo rating, XP bonuses, and unlock battle badges.
              </p>
            </div>

            {/* User Elo Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Battle Rating</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">{userElo}</span>
                  <span className="text-xs font-bold text-amber-400 uppercase">{getTierFromElo(userElo)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Switcher & Quick Battle */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Arena Subject:</span>
              <div className="flex gap-1.5">
                {['Science', 'Mathematics'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSubject(sub);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedSubject === sub
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartBattle()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-rose-600/25 transition-transform active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>Quick Match with Peer</span>
            </button>
          </div>

          {/* Available Rivals Roster */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Choose Your Academic Opponent</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOT_RIVALS.map((rival) => (
                <div
                  key={rival.id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all group"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={rival.avatar}
                      alt={rival.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                        {rival.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{rival.school}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-bold">
                          {rival.rating} Elo
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 uppercase">{rival.tier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Specialty</span>
                    <span className="text-slate-300 font-medium">{rival.specialty}</span>
                  </div>

                  <button
                    onClick={() => handleStartBattle(rival)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs transition-colors"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Challenge in {selectedSubject}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Past Battle History */}
          {history.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Battle Record</h3>
              <div className="space-y-2">
                {history.slice(0, 5).map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-[10px] ${
                          h.result === 'victory'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : h.result === 'defeat'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {h.result === 'victory' ? 'W' : h.result === 'defeat' ? 'L' : 'D'}
                      </span>
                      <div>
                        <span className="font-bold text-white">vs {h.rivalName}</span>
                        <span className="text-slate-500 ml-2">({h.subject})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-slate-300">
                        {h.userScore} - {h.rivalScore}
                      </span>
                      <span
                        className={`font-bold ${
                          h.eloChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {h.eloChange >= 0 ? `+${h.eloChange}` : h.eloChange} Elo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Matchmaking Screen */}
      {gameState === 'matchmaking' && (
        <div className="min-h-[460px] flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Swords className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Matching Opponent...</h3>
            <p className="text-xs text-slate-400 mt-1">
              Synchronizing NCERT {selectedSubject} syllabus duel with {selectedRival.name}
            </p>
          </div>
        </div>
      )}

      {/* 3. Live 1v1 Battle Arena */}
      {gameState === 'battle' && currentQ && (
        <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
          {/* Split-Screen Header HUD */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden">
            {/* Center Countdown Clock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-black text-xl shadow-xl border-2 transition-colors ${
                  timeLeft <= 4
                    ? 'bg-rose-600 text-white border-rose-400 animate-ping'
                    : 'bg-slate-950 text-sky-300 border-indigo-500/50'
                }`}
              >
                {timeLeft}s
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Round {currentRound + 1}/5
              </span>
            </div>

            {/* Left: Player HUD */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {userProfile.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{userProfile.name} (You)</span>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">{userScore} PTS</span>
                </div>
              </div>
              {/* HP/Score Progress */}
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (userScore / 600) * 100)}%` }}
                />
              </div>
              {/* Combo Streak */}
              {userCombo > 1 && (
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{userCombo}x STREAK COMBO!</span>
                </div>
              )}
            </div>

            {/* Right: Rival HUD */}
            <div className="space-y-2 pl-8 text-right">
              <div className="flex items-center justify-end gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">{selectedRival.name}</span>
                  <span className="text-[10px] text-rose-400 font-mono font-bold">{rivalScore} PTS</span>
                </div>
                <img
                  src={selectedRival.avatar}
                  alt={selectedRival.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                />
              </div>
              {/* HP/Score Progress */}
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all ml-auto"
                  style={{ width: `${Math.min(100, (rivalScore / 600) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {rivalAnswered ? '⚡ Rival Answered!' : 'Thinking...'}
              </span>
            </div>
          </div>

          {/* Tactical Power-Ups Bar */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleUseFreeze}
              disabled={!powerUps.freeze}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 text-sky-400 hover:text-white text-xs font-bold transition-all"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Time Freeze (+6s)</span>
            </button>

            <button
              onClick={handleUseFiftyFifty}
              disabled={!powerUps.fiftyFifty}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 text-amber-400 hover:text-white text-xs font-bold transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>50:50 Lifeline</span>
            </button>

            <button
              onClick={handleUseDoubleXp}
              disabled={!powerUps.doubleXp || doubleXpActive}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 text-purple-400 hover:text-white text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{doubleXpActive ? '2x Active!' : 'Double XP'}</span>
            </button>
          </div>

          {/* Question Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
              <span>Chapter: {currentQ.chapter}</span>
              <span className="font-mono text-emerald-400 font-bold">+{currentQ.points} PTS</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isEliminated = eliminatedOptions.includes(idx);
                const isCorrect = idx === currentQ.correctIndex;
                const isAnswered = selectedOption !== null;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered || isEliminated}
                    onClick={() => handleOptionSelect(idx)}
                    className={`p-4 rounded-2xl text-left border text-xs sm:text-sm font-medium transition-all ${
                      isEliminated
                        ? 'opacity-25 border-slate-800 bg-slate-950 pointer-events-none line-through'
                        : isAnswered
                        ? isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                          : isSelected
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                        : 'bg-slate-950 border-slate-800 hover:border-indigo-500 hover:bg-slate-900 text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Results Screen */}
      {gameState === 'results' && (
        <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
            {userScore >= rivalScore ? (
              <Trophy className="w-10 h-10 text-amber-300" />
            ) : (
              <Shield className="w-10 h-10 text-slate-200" />
            )}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Battle Finished</span>
            <h2 className="text-2xl font-black text-white mt-1">
              {userScore > rivalScore ? 'VICTORY!' : userScore === rivalScore ? 'TIED MATCH' : 'DEFEAT'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Final Score: {userScore} PTS (You) vs {rivalScore} PTS ({selectedRival.name})
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">New Elo Rating</span>
              <p className="text-xl font-black text-white font-mono mt-0.5">{userElo}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">XP Awarded</span>
              <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                +{userScore >= rivalScore ? 150 : 50} XP
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleStartBattle(selectedRival)}
              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              Rematch
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setGameState('lobby');
              }}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Back to Arena Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
