import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { ReplayProblem, ReplayStep } from '../../types/curriculum';
import { voiceService } from '../../services/voiceService';
import { sound } from '../../services/audio';

const SAMPLE_REPLAY_PROBLEMS: ReplayProblem[] = [
  {
    id: 'replay-quad-1',
    title: 'Solve Quadratic Equation by Factorization & Formula',
    subject: 'Mathematics',
    chapterTitle: 'Quadratic Equations',
    classGrade: 10,
    problemStatement: 'Find the roots of the quadratic equation: 2x² - 5x + 3 = 0 using the standard quadratic formula.',
    givenData: ['Equation: 2x² - 5x + 3 = 0', 'Standard form: ax² + bx + c = 0'],
    toFind: 'Values of x (roots)',
    finalResult: 'x = 1  or  x = 3/2',
    ncertPage: 78,
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Coefficients from Standard Form',
        explanation: 'Compare 2x² - 5x + 3 = 0 with ax² + bx + c = 0 to extract the values of a, b, and c.',
        formula: 'a = 2,  b = -5,  c = 3',
        keyInsight: 'Always preserve the negative sign associated with b = -5.',
        commonTrap: 'Omitting the minus sign and writing b = 5 leads to an inverted root symmetry.',
      },
      {
        stepNumber: 2,
        title: 'Calculate the Discriminant (D)',
        explanation: 'Compute the discriminant D = b² - 4ac to check the existence and nature of real roots.',
        formula: 'D = (-5)² - 4(2)(3) = 25 - 24 = 1',
        keyInsight: 'Since D = 1 > 0, the equation is guaranteed to yield two distinct real roots.',
        commonTrap: 'Squaring -5: remember (-5)² is +25, never -25!',
      },
      {
        stepNumber: 3,
        title: 'Apply the Quadratic Formula',
        explanation: 'Substitute a = 2, b = -5, and D = 1 into x = (-b ± √D) / (2a).',
        formula: 'x = (-(-5) ± √1) / (2 × 2) = (5 ± 1) / 4',
        keyInsight: 'The double negative -(-5) transforms into positive +5.',
        commonTrap: 'Dividing only the radical by 2a instead of the whole numerator (5 ± 1).',
      },
      {
        stepNumber: 4,
        title: 'Separate into Two Distinct Roots',
        explanation: 'Evaluate both the positive (+) and negative (-) branches to obtain the exact values of x.',
        formula: 'Branch 1: x = (5 + 1)/4 = 6/4 = 3/2\nBranch 2: x = (5 - 1)/4 = 4/4 = 1',
        keyInsight: 'Simplify fractions to their lowest irreducible terms: 6/4 becomes 3/2.',
        commonTrap: 'Forgetting to write both roots in the final board examination answer sheet.',
      },
    ],
  },
  {
    id: 'replay-chem-1',
    title: 'Balancing Combustion of Hydrocarbon (Propane)',
    subject: 'Science',
    chapterTitle: 'Chemical Reactions and Equations',
    classGrade: 10,
    problemStatement: 'Balance the chemical reaction for complete combustion of propane gas: C₃H₈(g) + O₂(g) → CO₂(g) + H₂O(g)',
    givenData: ['Reactants: C₃H₈, O₂', 'Products: CO₂, H₂O'],
    toFind: 'Stoichiometric coefficients satisfying Law of Conservation of Mass',
    finalResult: 'C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(g)',
    ncertPage: 6,
    steps: [
      {
        stepNumber: 1,
        title: 'Tally Skeletal Atom Inventory',
        explanation: 'Count carbon, hydrogen, and oxygen atoms on the Left Hand Side (LHS) vs Right Hand Side (RHS).',
        formula: 'LHS: C=3, H=8, O=2   |   RHS: C=1, H=2, O=3 (2 in CO₂ + 1 in H₂O)',
        keyInsight: 'Notice oxygen appears in multiple product species, so balance it last!',
        commonTrap: 'Counting oxygen in only CO₂ and missing the oxygen in H₂O.',
      },
      {
        stepNumber: 2,
        title: 'Balance Carbon Atoms First',
        explanation: 'Since LHS has 3 carbon atoms in C₃H₈, place coefficient 3 in front of CO₂ on RHS.',
        formula: 'C₃H₈ + O₂ → 3CO₂ + H₂O',
        keyInsight: 'Now Carbon count is balanced: LHS = 3, RHS = 3.',
        commonTrap: 'Writing C₃O₆ instead of changing coefficient 3CO₂.',
      },
      {
        stepNumber: 3,
        title: 'Balance Hydrogen Atoms Next',
        explanation: 'LHS has 8 hydrogen atoms. H₂O has 2 hydrogens per molecule, so multiply H₂O by 4 (4 × 2 = 8).',
        formula: 'C₃H₈ + O₂ → 3CO₂ + 4H₂O',
        keyInsight: 'Hydrogen is now balanced with 8 atoms on each side.',
        commonTrap: 'Altering subscript to H₈O instead of 4H₂O.',
      },
      {
        stepNumber: 4,
        title: 'Balance Oxygen Atoms Last',
        explanation: 'Total RHS oxygen = (3 × 2 in CO₂) + (4 × 1 in H₂O) = 6 + 4 = 10 oxygen atoms. LHS needs 10/2 = 5 O₂ molecules.',
        formula: 'C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(g)',
        keyInsight: 'Both sides now have: C=3, H=8, O=10. Mass is perfectly conserved.',
        commonTrap: 'Leaving off physical state symbols in final CBSE answer sheet.',
      },
    ],
  },
];

interface StepSolutionReplayProps {
  initialProblem?: ReplayProblem;
  onClose?: () => void;
}

export const StepSolutionReplay: React.FC<StepSolutionReplayProps> = ({ initialProblem, onClose }) => {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const currentProblem = initialProblem || SAMPLE_REPLAY_PROBLEMS[selectedProblemIndex];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [voiceNarration, setVoiceNarration] = useState(true);

  const timerRef = useRef<any>(null);

  const currentStep = currentProblem.steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = 4500 / speedMultiplier;
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < currentProblem.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
          sound.playHint();
        } else {
          setIsPlaying(false);
          sound.playCelebration();
        }
      }, stepDuration);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, currentProblem.steps.length, speedMultiplier]);

  // Voice narration on step change
  useEffect(() => {
    if (voiceNarration && currentStep) {
      const textToSpeak = `Step ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.explanation}. Key formula: ${currentStep.formula || ''}.`;
      voiceService.speak(textToSpeak);
    }
  }, [currentStepIndex, voiceNarration]);

  const handleNextStep = () => {
    sound.playClick();
    if (currentStepIndex < currentProblem.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    sound.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleTogglePlay = () => {
    sound.playClick();
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    sound.playClick();
    const speeds = [0.5, 1, 1.5, 2];
    const nextIdx = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
    setSpeedMultiplier(speeds[nextIdx]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Header & Problem Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Solution Replay</span>
            <span aria-hidden="true">·</span>
            <span>Class {currentProblem.classGrade} {currentProblem.subject}</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">{currentProblem.title}</h3>
        </div>

        {/* Problem Switcher if not locked to single problem */}
        {!initialProblem && (
          <div className="flex items-center gap-2">
            {SAMPLE_REPLAY_PROBLEMS.map((prob, idx) => (
              <button
                key={prob.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedProblemIndex(idx);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProblemIndex === idx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {prob.subject} Example
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Problem Statement Box */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Problem Statement
          </span>
          {currentProblem.ncertPage && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              NCERT Page {currentProblem.ncertPage}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-200">{currentProblem.problemStatement}</p>
        <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
          <div>
            <strong className="text-slate-300">Given:</strong> {currentProblem.givenData.join(', ')}
          </div>
          <div>
            <strong className="text-slate-300">To Find:</strong> {currentProblem.toFind}
          </div>
        </div>
      </div>

      {/* Step Progress Timeline Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>
            Step {currentStepIndex + 1} of {currentProblem.steps.length}
          </span>
          <span className="text-indigo-400 font-mono">{Math.round(((currentStepIndex + 1) / currentProblem.steps.length) * 100)}% Complete</span>
        </div>

        <div className="flex items-center gap-2">
          {currentProblem.steps.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => {
                sound.playClick();
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`flex-1 h-2 rounded-full transition-all ${
                idx < currentStepIndex
                  ? 'bg-indigo-600'
                  : idx === currentStepIndex
                  ? 'bg-sky-400 ring-2 ring-sky-400/30 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Jump to Step ${step.stepNumber}: ${step.title}`}
            />
          ))}
        </div>
      </div>

      {/* Active Step Derivation Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20 border border-indigo-500/20 shadow-xl space-y-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
              {currentStep.stepNumber}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white">{currentStep.title}</h4>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              voiceService.speak(
                `Step ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.explanation}. Formula: ${currentStep.formula || ''}`
              );
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Read Step Aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{currentStep.explanation}</p>

        {/* Math Formula / Transformation Block */}
        {currentStep.formula && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-300 whitespace-pre-wrap shadow-inner">
            {currentStep.formula}
          </div>
        )}

        {/* Pedagogical Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Why This Step? */}
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-indigo-300 font-bold mb-0.5">Why This Step?</strong>
              {currentStep.keyInsight}
            </div>
          </div>

          {/* Common Trap to Avoid */}
          {currentStep.commonTrap && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-bold mb-0.5">Common Trap to Avoid</strong>
                {currentStep.commonTrap}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Final Answer Banner if on last step */}
      {currentStepIndex === currentProblem.steps.length - 1 && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Final Verified Solution:</span>{' '}
              <span className="font-mono text-white font-bold ml-1">{currentProblem.finalResult}</span>
            </div>
          </div>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">NCERT Solution Verified</span>
        </div>
      )}

      {/* Player Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Auto Play</span>
              </>
            )}
          </button>
          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === currentProblem.steps.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Voice Narration Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleSpeed}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold"
            title="Playback Speed"
          >
            {speedMultiplier}x Speed
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setVoiceNarration(!voiceNarration);
              if (voiceNarration) voiceService.stopSpeaking();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              voiceNarration
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Voice Narration on Step Advance"
          >
            {voiceNarration ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voice Narration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
