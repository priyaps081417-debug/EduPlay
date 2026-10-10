import React, { useState } from 'react';
import {
  BookOpen,
  FlaskConical,
  Award,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Compass,
  FileText,
  Calculator,
  PlayCircle,
  HelpCircle,
  PlusCircle,
  Check,
} from 'lucide-react';
import {
  ExerciseItem,
  ChapterItem,
  SubjectItem,
  QuizSubmissionPayload,
  QuizSubmissionResult,
  SuggestedTopic,
  ClassItem,
} from '../../types/curriculum';
import { ConceptCard } from './ConceptCard';
import { InteractivePlayground } from './InteractivePlayground';
import { QuizMode } from './QuizMode';
import { StepSolutionReplay } from '../replay/StepSolutionReplay';
import { DoubtSolverView } from '../doubt/DoubtSolverView';
import { SuggestedTopicsCard } from '../common/SuggestedTopicsCard';
import { getSuggestedTopics } from '../../services/recommender';
import { spacedRepetitionService } from '../../services/spacedRepetitionService';
import { sound } from '../../services/audio';

interface WorkspaceProps {
  exercise: ExerciseItem;
  chapter: ChapterItem;
  subject: SubjectItem;
  userId: string;
  onSubmitQuiz: (payload: QuizSubmissionPayload) => Promise<QuizSubmissionResult>;
  onBackToChapter: () => void;
  onSelectSuggestedTopic?: (topic: SuggestedTopic) => void;
  onOpenNcertPdf?: () => void;
  onOpenSolvedPdf?: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  exercise,
  chapter,
  subject,
  userId,
  onSubmitQuiz,
  onBackToChapter,
  onSelectSuggestedTopic,
  onOpenNcertPdf,
  onOpenSolvedPdf,
}) => {
  const [activeStep, setActiveStep] = useState<'concept' | 'replay' | 'playground' | 'quiz' | 'doubt'>('concept');
  const [quizRetakeKey, setQuizRetakeKey] = useState(0);
  const [isAddedToRevision, setIsAddedToRevision] = useState(false);

  const suggestedTopics = getSuggestedTopics(exercise, chapter, subject);

  const steps = [
    { id: 'concept', label: '1. Concept Card', icon: BookOpen },
    { id: 'replay', label: '2. Solution Replay', icon: PlayCircle },
    { id: 'playground', label: '3. Playground', icon: FlaskConical },
    { id: 'quiz', label: '4. Diagnostic Quiz', icon: Award },
    { id: 'doubt', label: '5. AI Doubts', icon: HelpCircle },
  ] as const;

  const handleStepChange = (step: 'concept' | 'replay' | 'playground' | 'quiz' | 'doubt') => {
    sound.playClick();
    setActiveStep(step);
  };

  const handleAddCurrentToRevision = () => {
    sound.playClick();
    spacedRepetitionService.addCard({
      classGrade: 10,
      subjectId: subject.id,
      subjectName: subject.name,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      topic: exercise.title,
      front: `[NCERT Exercise Concept] ${exercise.title}: State the core definition and principles established in Chapter ${chapter.chapterNumber}.`,
      back: `${exercise.concept.summary}\n\nKey Takeaways:\n${exercise.concept.takeaways.map((t) => `• ${t.title}: ${t.detail}`).join('\n')}`,
      formula: exercise.concept.takeaways.find((t) => t.formula)?.formula,
      difficulty: 'Medium',
    });
    setIsAddedToRevision(true);
    sound.playCelebration();
  };

  const isMaths = subject.name.toLowerCase().includes('math');

  const mockClass: ClassItem = {
    id: 'class-current',
    name: `Class 10`,
    gradeNumber: 10,
    stage: 'secondary',
    stageLabel: 'Secondary',
    description: '',
    subjectCount: 6,
    totalChapters: 15,
  };

  return (
    <div className="space-y-6">
      {/* Top Bar for Workspace: Back button & Stepper & PDF quick tools */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToChapter();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Back to Chapter Exercises"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <span>{subject.name}</span>
              <span aria-hidden="true">·</span>
              <span>Chapter {chapter.chapterNumber}</span>
              <span aria-hidden="true">·</span>
              <span>Exercise {exercise.exerciseNumber}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {exercise.title}
            </h2>
          </div>
        </div>

        {/* Right side: Tools & Stepper Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Add to Revision Queue Quick Action */}
          <button
            onClick={handleAddCurrentToRevision}
            disabled={isAddedToRevision}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isAddedToRevision
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
            }`}
            title="Add this concept to Spaced Repetition Queue"
          >
            {isAddedToRevision ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAddedToRevision ? 'In Revision Deck' : 'Add to Revision'}</span>
          </button>

          {onOpenNcertPdf && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenNcertPdf();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-colors"
              title="Open Official NCERT Textbook PDF"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">NCERT PDF</span>
            </button>
          )}

          {onOpenSolvedPdf && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenSolvedPdf();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
              title="View Solved Exercise Problems"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">{isMaths ? 'Maths Solved PDF' : 'Solved Solutions'}</span>
            </button>
          )}

          {/* Stepper Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = activeStep === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => handleStepChange(st.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{st.label}</span>
                  <span className="sm:hidden">{st.id.charAt(0).toUpperCase() + st.id.slice(1)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Body based on active step */}
      <div className="transition-all duration-300">
        {activeStep === 'concept' && (
          <ConceptCard
            concept={exercise.concept}
            suggestedTopics={suggestedTopics}
            onSelectSuggestedTopic={onSelectSuggestedTopic}
            onProceedToPlayground={() => setActiveStep('replay')}
          />
        )}

        {activeStep === 'replay' && (
          <div className="space-y-6">
            <StepSolutionReplay />
            <div className="flex justify-end">
              <button
                onClick={() => setActiveStep('playground')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Proceed to Interactive Playground →
              </button>
            </div>
          </div>
        )}

        {activeStep === 'playground' && (
          <div className="space-y-6">
            <InteractivePlayground
              playground={exercise.playground}
              onProceedToQuiz={() => setActiveStep('quiz')}
            />

            {/* Suggested topics on Interactive Playground step */}
            {suggestedTopics.length > 0 && onSelectSuggestedTopic && (
              <SuggestedTopicsCard
                currentTopicTitle={exercise.title}
                suggestedTopics={suggestedTopics}
                onSelectSuggestedTopic={onSelectSuggestedTopic}
                variant="banner"
              />
            )}
          </div>
        )}

        {activeStep === 'quiz' && (
          <QuizMode
            key={quizRetakeKey}
            quiz={exercise.quiz}
            concept={exercise.concept}
            suggestedTopics={suggestedTopics}
            onSelectSuggestedTopic={onSelectSuggestedTopic}
            userId={userId}
            onSubmitQuiz={onSubmitQuiz}
            onCompleteExercise={onBackToChapter}
            onRetakeQuiz={() => setQuizRetakeKey((k) => k + 1)}
          />
        )}

        {activeStep === 'doubt' && (
          <DoubtSolverView
            currentClass={mockClass}
            currentSubject={subject}
            currentChapter={chapter}
          />
        )}
      </div>
    </div>
  );
};

