import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Star,
  Zap,
  ArrowRight,
  RotateCcw,
  BookOpen,
  WifiOff,
  Flame,
  Award,
  Divide,
  X,
  FileText,
} from 'lucide-react';
import {
  QuizData,
  QuizSubmissionPayload,
  QuizSubmissionResult,
  ConceptCardData,
  SuggestedTopic,
} from '../../types/curriculum';
import { SuggestedTopicsCard } from '../common/SuggestedTopicsCard';
import { sound } from '../../services/audio';

interface QuizModeProps {
  quiz: QuizData;
  userId: string;
  concept?: ConceptCardData;
  suggestedTopics?: SuggestedTopic[];
  onSelectSuggestedTopic?: (topic: SuggestedTopic) => void;
  onSubmitQuiz: (payload: QuizSubmissionPayload) => Promise<QuizSubmissionResult>;
  onCompleteExercise: () => void;
  onRetakeQuiz: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  quiz,
  userId,
  concept,
  suggestedTopics = [],
  onSelectSuggestedTopic,
  onSubmitQuiz,
  onCompleteExercise,
  onRetakeQuiz,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showConceptReference, setShowConceptReference] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<number>>(new Set());
  const [used5050ForCurrentQ, setUsed5050ForCurrentQ] = useState(false);

  const [answersRecord, setAnswersRecord] = useState<
    Array<{ questionId: string; selectedOption: number; isCorrect: boolean }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);

  const currentQ = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (isAnswered || eliminatedOptions.has(index)) return;
    sound.playClick();
    setSelectedOption(index);
  };

  // 50/50 Lifeline
  const handleUse5050 = () => {
    if (used5050ForCurrentQ || isAnswered) return;
    sound.playHint();

    const incorrectIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctOptionIndex);

    // Shuffle and pick 2 incorrect to eliminate
    const shuffled = [...incorrectIndices].sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);

    setEliminatedOptions(new Set(toEliminate));
    setUsed5050ForCurrentQ(true);

    // If current selection was eliminated, reset selection
    if (selectedOption !== null && toEliminate.includes(selectedOption)) {
      setSelectedOption(null);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    const isCorrect = selectedOption === currentQ.correctOptionIndex;
    setIsAnswered(true);

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    setAnswersRecord((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedOption,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = async () => {
    sound.playClick();
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
      setEliminatedOptions(new Set());
      setUsed5050ForCurrentQ(false);
    } else {
      // Final question answered, submit quiz
      setIsSubmitting(true);
      const totalCorrect = answersRecord.filter((a) => a.isCorrect).length;
      const scorePct = Math.round((totalCorrect / quiz.questions.length) * 100);

      const payload: QuizSubmissionPayload = {
        userId,
        exerciseId: quiz.exerciseId,
        score: scorePct,
        totalQuestions: quiz.questions.length,
        correctCount: totalCorrect,
        answers: answersRecord,
        submittedAt: new Date().toISOString(),
      };

      try {
        const result = await onSubmitQuiz(payload);
        setSubmissionResult(result);

        // Fire celebratory confetti!
        sound.playCelebration();
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#f59e0b', '#38bdf8'],
        });
      } catch (err) {
        console.error('Submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleHint = () => {
    sound.playHint();
    setShowHint((prev) => !prev);
  };

  // Completed Victory Modal Screen
  if (submissionResult) {
    const totalCorrect = answersRecord.filter((a) => a.isCorrect).length;
    const scorePct = Math.round((totalCorrect / quiz.questions.length) * 100);

    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden animate-in fade-in">
        {/* Confetti aura */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 mb-6 animate-bounce">
          <Award className="w-10 h-10 text-white" />
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
          Mastery Accomplished
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Quiz Completed!
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          {scorePct >= 70
            ? 'Outstanding performance! You have grasped this NCERT concept thoroughly.'
            : 'Good effort! Review the concept reference and re-attempt to earn all 3 stars.'}
        </p>

        {/* Stars Earned */}
        <div className="flex items-center justify-center gap-2 my-6">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-10 h-10 transition-all transform ${
                starIdx <= submissionResult.starsEarned
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-8">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              XP Earned
            </div>
            <div className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1 mt-1">
              <Zap className="w-5 h-5 fill-emerald-400" />
              <span>+{submissionResult.xpEarned} XP</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Accuracy
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {totalCorrect} / {quiz.questions.length}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Daily Streak
            </div>
            <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1 mt-1">
              <Flame className="w-5 h-5 fill-amber-400" />
              <span>{submissionResult.streakCount} Days</span>
            </div>
          </div>
        </div>

        {/* Offline sync status notice */}
        {!submissionResult.syncedToBackend && (
          <div className="mb-6 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span>
              Saved locally in offline queue! Will sync to backend upon connection.
            </span>
          </div>
        )}

        {/* Suggested Next Topics based on what we just studied and learned */}
        {suggestedTopics.length > 0 && onSelectSuggestedTopic && (
          <div className="my-6 text-left">
            <SuggestedTopicsCard
              currentTopicTitle={concept?.title || quiz.title}
              suggestedTopics={suggestedTopics}
              onSelectSuggestedTopic={onSelectSuggestedTopic}
              variant="modal"
            />
          </div>
        )}

        {/* Next Steps CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onRetakeQuiz();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onCompleteExercise();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Back to Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header & Gamified Lifelines */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>NCERT Gamified Practice Quiz</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {quiz.title}
          </h2>
        </div>

        {/* Lifeline Buttons: 50/50 & Concept Reference */}
        <div className="flex items-center flex-wrap gap-2">
          {/* 50/50 Lifeline Button */}
          <button
            onClick={handleUse5050}
            disabled={used5050ForCurrentQ || isAnswered}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              used5050ForCurrentQ
                ? 'bg-slate-800/50 text-slate-500 border-slate-700/50 cursor-not-allowed'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 active:scale-95'
            }`}
            title="Eliminate two incorrect options"
          >
            <Divide className="w-3.5 h-3.5 text-amber-400" />
            <span>50/50 Lifeline</span>
          </button>

          {/* Concept Reference Button */}
          {concept && (
            <button
              onClick={() => {
                sound.playClick();
                setShowConceptReference(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all"
              title="Open Concept Reference"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Concept Reference</span>
            </button>
          )}

          {/* Hint button */}
          <button
            onClick={toggleHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showHint
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
          </button>

          <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Q {currentQuestionIndex + 1}/{quiz.questions.length}
          </div>
        </div>
      </div>

      {/* Question Progress bar */}
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Hint Alert */}
      {showHint && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-3 animate-in fade-in">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">NCERT Hint: </span>
            <span>{currentQ.hint}</span>
          </div>
        </div>
      )}

      {/* Question Text Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Options Grid */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isEliminated = eliminatedOptions.has(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctOptionIndex;

            let cardStyle =
              'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900/90';

            if (isEliminated) {
              cardStyle =
                'bg-slate-950/30 border-slate-800/40 text-slate-600 line-through opacity-40 cursor-not-allowed';
            } else if (isAnswered) {
              if (isCorrect) {
                // Instant Visual Feedback: Emerald green for correct
                cardStyle =
                  'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrect) {
                // Instant Visual Feedback: Red for incorrect
                cardStyle =
                  'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
              } else {
                cardStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              cardStyle =
                'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/15 ring-1 ring-indigo-500';
            }

            return (
              <div
                key={option.id}
                onClick={() => !isEliminated && handleSelectOption(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isEliminated
                        ? 'bg-slate-900 text-slate-700'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium leading-normal">
                    {option.text}
                  </span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detailed Explanation upon answering (Red/Green feedback) */}
        {isAnswered && (
          <div className={`mt-6 p-4 rounded-xl border space-y-2 animate-in fade-in ${
            selectedOption === currentQ.correctOptionIndex
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-rose-950/20 border-rose-500/40'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {selectedOption === currentQ.correctOptionIndex ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Solution & Explanation
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentQ.options[currentQ.correctOptionIndex].explanation}
            </p>
            <p className="text-[11px] text-slate-500 font-mono pt-1">
              NCERT Reference: {currentQ.ncertSourceNote}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          +{currentQ.points} XP on correct answer
        </span>

        {!isAnswered ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedOption === null}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
              selectedOption !== null
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <span>{isLastQuestion ? 'Complete Quiz' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Concept Reference Modal / Drawer */}
      {showConceptReference && concept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>NCERT Concept Reference</span>
              </div>
              <button
                onClick={() => setShowConceptReference(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{concept.title}</h3>
              <p className="text-xs text-emerald-400 mt-0.5">{concept.tagline}</p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{concept.summary}</p>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Takeaways & Formulas:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {concept.takeaways.map((tk) => (
                  <div key={tk.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="font-bold text-white block">{tk.title}</span>
                    <span className="text-slate-400">{tk.detail}</span>
                    {tk.formula && (
                      <code className="mt-1 block font-mono text-emerald-400 text-[11px]">
                        {tk.formula}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowConceptReference(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Back to Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
