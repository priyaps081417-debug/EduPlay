import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  FlaskConical,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PlaygroundData, ChemicalBalancerState } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface InteractivePlaygroundProps {
  playground: PlaygroundData;
  onProceedToQuiz: () => void;
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  playground,
  onProceedToQuiz,
}) => {
  if (playground.type === 'chemical_balancer') {
    return (
      <ChemicalBalancerWidget
        data={playground}
        onProceedToQuiz={onProceedToQuiz}
      />
    );
  }

  if (playground.type === 'physics_motion') {
    return (
      <PhysicsMotionWidget
        data={playground}
        onProceedToQuiz={onProceedToQuiz}
      />
    );
  }

  return (
    <FractionVisualizerWidget
      data={playground}
      onProceedToQuiz={onProceedToQuiz}
    />
  );
};

// 1. Chemical Equation Balancer Widget
const ChemicalBalancerWidget: React.FC<{
  data: ChemicalBalancerState;
  onProceedToQuiz: () => void;
}> = ({ data, onProceedToQuiz }) => {
  const [reactantCoeffs, setReactantCoeffs] = useState<number[]>(
    data.reactants.map((r) => r.defaultCoeff)
  );
  const [productCoeffs, setProductCoeffs] = useState<number[]>(
    data.products.map((p) => p.defaultCoeff)
  );
  const [showHint, setShowHint] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'pending' | 'correct' | 'incorrect'>('pending');

  const updateReactant = (index: number, delta: number) => {
    sound.playClick();
    setReactantCoeffs((prev) => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(6, next[index] + delta));
      return next;
    });
    setVerificationResult('pending');
  };

  const updateProduct = (index: number, delta: number) => {
    sound.playClick();
    setProductCoeffs((prev) => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(6, next[index] + delta));
      return next;
    });
    setVerificationResult('pending');
  };

  const resetCoeffs = () => {
    sound.playClick();
    setReactantCoeffs(data.reactants.map((r) => r.defaultCoeff));
    setProductCoeffs(data.products.map((p) => p.defaultCoeff));
    setVerificationResult('pending');
    setShowHint(false);
  };

  const checkBalance = () => {
    const isReactantsMatch = reactantCoeffs.every(
      (coeff, i) => coeff === data.reactants[i].targetCoeff
    );
    const isProductsMatch = productCoeffs.every(
      (coeff, i) => coeff === data.products[i].targetCoeff
    );

    if (isReactantsMatch && isProductsMatch) {
      sound.playCorrect();
      setVerificationResult('correct');
    } else {
      sound.playWrong();
      setVerificationResult('incorrect');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Interactive Chemistry Playground</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Stoichiometric Reaction Balancer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {data.equation}. Adjust integer coefficients on both sides to satisfy Conservation of Mass.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              sound.playHint();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Hide Hint' : 'Need Hint?'}</span>
          </button>

          <button
            onClick={resetCoeffs}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset equation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showHint && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-3 animate-in fade-in">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>{data.hint}</p>
        </div>
      )}

      {/* Main Interactive Balancer Board */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 text-center">
          {/* Reactants (LHS) */}
          <div className="flex items-center flex-wrap justify-center gap-4">
            {data.reactants.map((reactant, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {idx > 0 && <span className="text-xl font-bold text-slate-500">+</span>}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md">
                  <div className="text-[11px] text-slate-400 font-medium mb-1">
                    {reactant.name}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Stepper */}
                    <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5">
                      <button
                        onClick={() => updateReactant(idx, -1)}
                        className="w-7 h-7 rounded text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-extrabold text-emerald-400 text-base">
                        {reactantCoeffs[idx]}
                      </span>
                      <button
                        onClick={() => updateReactant(idx, 1)}
                        className="w-7 h-7 rounded text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    {/* Chemical Formula */}
                    <span className="text-xl font-black text-white tracking-wide">
                      {reactant.formula}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reaction Arrow */}
          <div className="flex flex-col items-center justify-center px-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              yields
            </div>
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full relative">
              <div className="absolute right-0 -top-1 w-3 h-3 border-t-2 border-r-2 border-indigo-400 rotate-45" />
            </div>
          </div>

          {/* Products (RHS) */}
          <div className="flex items-center flex-wrap justify-center gap-4">
            {data.products.map((product, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {idx > 0 && <span className="text-xl font-bold text-slate-500">+</span>}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 shadow-md">
                  <div className="text-[11px] text-slate-400 font-medium mb-1">
                    {product.name}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Stepper */}
                    <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5">
                      <button
                        onClick={() => updateProduct(idx, -1)}
                        className="w-7 h-7 rounded text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-extrabold text-sky-400 text-base">
                        {productCoeffs[idx]}
                      </span>
                      <button
                        onClick={() => updateProduct(idx, 1)}
                        className="w-7 h-7 rounded text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    {/* Chemical Formula */}
                    <span className="text-xl font-black text-white tracking-wide">
                      {product.formula}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button & Status Output */}
        <div className="pt-4 flex flex-col items-center justify-center gap-4">
          <button
            onClick={checkBalance}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Scale className="w-4 h-4" />
            <span>Verify Balanced Equation</span>
          </button>

          {verificationResult === 'correct' && (
            <div className="w-full max-w-xl p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 flex items-start gap-3 text-emerald-200 text-xs sm:text-sm animate-in fade-in glow-emerald">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300">Perfect! Chemical Equation Balanced!</p>
                <p className="mt-1 text-slate-300">{data.explanation}</p>
              </div>
            </div>
          )}

          {verificationResult === 'incorrect' && (
            <div className="w-full max-w-xl p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 flex items-start gap-3 text-rose-200 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-300">Not quite balanced yet</p>
                <p className="mt-1 text-slate-300">
                  Count the number of atoms of each element on the left versus the right. Remember, subscripts multiply by the coefficient!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-end border-t border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            onProceedToQuiz();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <span>Ready for Quiz Mode</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 2. Fraction Visualizer Widget
const FractionVisualizerWidget: React.FC<{
  data: PlaygroundData;
  onProceedToQuiz: () => void;
}> = ({ data, onProceedToQuiz }) => {
  const [numerator, setNumerator] = useState<number>(3);
  const [denominator, setDenominator] = useState<number>(5);

  const percentage = Math.round((numerator / denominator) * 100);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          <span>Interactive Mathematics Sandbox</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Visual Fraction Slicer & Ratio Balancer
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manipulate parts of the whole to witness fractional partitioning in real time.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Numerator (Parts Taken)</span>
              <span className="font-bold text-indigo-400 text-base">{numerator}</span>
            </div>
            <input
              type="range"
              min={1}
              max={denominator}
              value={numerator}
              onChange={(e) => {
                sound.playClick();
                setNumerator(parseInt(e.target.value));
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Denominator (Total Parts)</span>
              <span className="font-bold text-emerald-400 text-base">{denominator}</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              value={denominator}
              onChange={(e) => {
                sound.playClick();
                const newDenom = parseInt(e.target.value);
                setDenominator(newDenom);
                if (numerator > newDenom) setNumerator(newDenom);
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Visual Bar representation */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Visual Partitioning ({numerator} / {denominator})</span>
            <span className="font-bold text-slate-200">{percentage}% of the whole</span>
          </div>

          <div className="grid gap-1.5 h-14" style={{ gridTemplateColumns: `repeat(${denominator}, 1fr)` }}>
            {Array.from({ length: denominator }).map((_, i) => (
              <div
                key={i}
                className={`rounded-lg border transition-all duration-300 flex items-center justify-center text-xs font-bold ${
                  i < numerator
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-500'
                }`}
              >
                1/{denominator}
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <span className="text-2xl font-black text-white">{numerator}</span>
            <span className="text-xl font-bold text-slate-500 mx-2">/</span>
            <span className="text-2xl font-black text-emerald-400">{denominator}</span>
            <span className="text-slate-400 text-sm ml-3">
              = {(numerator / denominator).toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end border-t border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            onProceedToQuiz();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <span>Ready for Quiz Mode</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 3. Physics Motion Simulator Widget
const PhysicsMotionWidget: React.FC<{
  data: PlaygroundData;
  onProceedToQuiz: () => void;
}> = ({ data, onProceedToQuiz }) => {
  const [mass, setMass] = useState<number>(5);
  const [force, setForce] = useState<number>(25);

  const acceleration = (force / mass).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
          <Zap className="w-4 h-4" />
          <span>Newtonian Physics Sandbox</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Second Law of Motion: F = m · a
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Adjust applied force and object mass to calculate instantaneous acceleration.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Applied Force (F)</span>
              <span className="font-bold text-sky-400 text-base">{force} N</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={force}
              onChange={(e) => {
                sound.playClick();
                setForce(parseInt(e.target.value));
              }}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Object Mass (m)</span>
              <span className="font-bold text-amber-400 text-base">{mass} kg</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={mass}
              onChange={(e) => {
                sound.playClick();
                setMass(parseInt(e.target.value));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Acceleration Gauge Box */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Resulting Acceleration (a = F / m)
          </div>
          <div className="text-4xl font-black text-emerald-400 font-mono">
            {acceleration} <span className="text-lg text-slate-400">m/s²</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Doubling the mass halves the acceleration, while doubling the force doubles the acceleration!
          </p>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end border-t border-slate-800">
        <button
          onClick={() => {
            sound.playClick();
            onProceedToQuiz();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <span>Ready for Quiz Mode</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
