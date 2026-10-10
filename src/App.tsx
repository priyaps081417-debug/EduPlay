/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ClassItem,
  SubjectItem,
  ChapterItem,
  ExerciseItem,
  UserProfile,
  ApiStatus,
  WeakTopic,
  QuizSubmissionPayload,
  QuizSubmissionResult,
  SuggestedTopic,
  FutureTopicRoadmap,
} from './types/curriculum';
import { api } from './services/api';
import { StorageService } from './services/storage';
import { getSuggestedTopics } from './services/recommender';
import { sound } from './services/audio';

import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { ClassSelector } from './components/curriculum/ClassSelector';
import { SubjectList } from './components/curriculum/SubjectList';
import { ChapterList } from './components/curriculum/ChapterList';
import { Workspace } from './components/workspace/Workspace';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { DoubtSolverView } from './components/doubt/DoubtSolverView';
import { VideoSummarizerView } from './components/video_summarizer/VideoSummarizerView';
import { KnowledgeGraphView } from './components/graph/KnowledgeGraphView';
import { RevisionQueueView } from './components/spaced_repetition/RevisionQueueView';
import { StudyBattlesView } from './components/battles/StudyBattlesView';
import { BackendInspectorModal } from './components/modals/BackendInspectorModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { NcertPdfViewerModal } from './components/modals/NcertPdfViewerModal';
import { SolvedPdfModal } from './components/modals/SolvedPdfModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { NavTabType, Navbar } from './components/layout/Navbar';
import { GraphNode } from './types/curriculum';
import { spacedRepetitionService } from './services/spacedRepetitionService';
import { StudentCreativityBanner } from './components/common/StudentCreativityBanner';
import { themeManager, StudentThemeId } from './services/themeService';
import { PrimaryRecognitionGamesView } from './components/primary_games/PrimaryRecognitionGamesView';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavTabType>('curriculum');
  const [curriculumLevel, setCurriculumLevel] = useState<'classes' | 'subjects' | 'chapters'>('subjects');
  const [dueRevisionCount, setDueRevisionCount] = useState<number>(spacedRepetitionService.getDueCount());

  // Curriculum Hierarchical Selection State
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);

  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterItem | null>(null);

  const [exercisesByChapter, setExercisesByChapter] = useState<Record<string, ExerciseItem[]>>({});
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

  // User Profile & System Status
  const [userProfile, setUserProfile] = useState<UserProfile>(StorageService.getUserProfile());
  const [apiStatus, setApiStatus] = useState<ApiStatus>(api.getStatus());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(StorageService.isSoundEnabled());
  const [currentThemeId, setCurrentThemeId] = useState<StudentThemeId>(themeManager.getThemeId());

  // Listen to theme changes
  useEffect(() => {
    const unsub = themeManager.subscribe((theme) => {
      setCurrentThemeId(theme.id);
    });
    return unsub;
  }, []);

  // Modals State
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isNcertPdfModalOpen, setIsNcertPdfModalOpen] = useState(false);
  const [isSolvedPdfModalOpen, setIsSolvedPdfModalOpen] = useState(false);
  const [activePdfSubject, setActivePdfSubject] = useState<SubjectItem | null>(null);
  const [activePdfChapter, setActivePdfChapter] = useState<ChapterItem | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Subscribe to API status changes
  useEffect(() => {
    const unsubscribe = api.subscribe((newStatus) => {
      setApiStatus(newStatus);
      if (newStatus.isMockMode || !newStatus.isOnline) {
        addToast({
          type: 'offline',
          title: 'Offline Resilience Active',
          message: 'Running in offline mode. Bite-sized exercises load from cache and quizzes will sync automatically.',
          actionText: 'View Sync Queue',
          onAction: () => setIsBackendModalOpen(true),
        });
      }
    });

    return () => unsubscribe();
  }, [addToast]);

  // Initial Data Bootstrap
  useEffect(() => {
    const initializeData = async () => {
      // 1. Fetch Classes
      const { data: classesData } = await api.getClasses();
      setClasses(classesData);

      // Default to Class 10 (NCERT Core flagship)
      const defaultClass = classesData.find((c) => c.gradeNumber === 10) || classesData[0];
      setSelectedClass(defaultClass);

      if (defaultClass) {
        // 2. Fetch Subjects for Class 10
        const { data: subjectsData } = await api.getSubjects(defaultClass.id);
        setSubjects(subjectsData);

        // Default to Science
        const defaultSubject = subjectsData.find((s) => s.code.includes('SCI')) || subjectsData[0];
        setSelectedSubject(defaultSubject);

        if (defaultSubject) {
          // 3. Fetch Chapters for Science
          const { data: chaptersData } = await api.getChapters(defaultSubject.id);
          setChapters(chaptersData);

          // Default to Chapter 1 (Chemical Reactions)
          const defaultChapter = chaptersData[0];
          setSelectedChapter(defaultChapter);

          if (defaultChapter) {
            // 4. Fetch Exercises for Chapter 1
            const { data: exercisesData } = await api.getExercises(defaultChapter.id);
            setExercisesByChapter((prev) => ({ ...prev, [defaultChapter.id]: exercisesData }));
            setSelectedExercise(exercisesData[0] || null);
          }
        }
      }

      // Fetch User Profile
      const { data: profileData } = await api.getUserProfile();
      setUserProfile(profileData);
    };

    initializeData().catch((err) => {
      console.warn('Initial data load error:', err);
    });
  }, []);

  // Class Selection Handler
  const handleSelectClass = async (cls: ClassItem) => {
    setSelectedClass(cls);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedExercise(null);
    setCurriculumLevel('subjects');

    const { data: subjectsData } = await api.getSubjects(cls.id);
    setSubjects(subjectsData);
  };

  // Subject Selection Handler
  const handleSelectSubject = async (sub: SubjectItem) => {
    setSelectedSubject(sub);
    setSelectedChapter(null);
    setSelectedExercise(null);
    setCurriculumLevel('chapters');

    const { data: chaptersData } = await api.getChapters(sub.id);
    setChapters(chaptersData);

    // Fetch exercises for the chapters in background
    for (const chap of chaptersData.slice(0, 3)) {
      if (!exercisesByChapter[chap.id]) {
        api.getExercises(chap.id).then(({ data: exData }) => {
          setExercisesByChapter((prev) => ({ ...prev, [chap.id]: exData }));
        });
      }
    }
  };

  // Launch Exercise into Active Learning Workspace
  const handleSelectExercise = (chapter: ChapterItem, exercise: ExerciseItem) => {
    setSelectedChapter(chapter);
    setSelectedExercise(exercise);
    setCurrentTab('workspace');
  };

  // Breadcrumbs Navigation Handler
  const handleBreadcrumbNavigate = (level: 'classes' | 'subjects' | 'chapters' | 'exercises') => {
    sound.playClick();
    setCurrentTab('curriculum');
    if (level === 'classes') {
      setCurriculumLevel('classes');
    } else if (level === 'subjects') {
      setCurriculumLevel('subjects');
    } else if (level === 'chapters' || level === 'exercises') {
      setCurriculumLevel('chapters');
    }
  };

  // Quiz Submission Handler
  const handleSubmitQuiz = async (payload: QuizSubmissionPayload): Promise<QuizSubmissionResult> => {
    const res = await api.submitQuiz(payload);

    // Refresh profile in memory
    const updated = StorageService.getUserProfile();
    setUserProfile(updated);

    if (res.isFallback) {
      addToast({
        type: 'offline',
        title: 'Quiz Saved Locally (+XP Recorded)',
        message: 'Your progress is stored in browser cache and will automatically sync to backend.',
        actionText: 'Inspect Queue',
        onAction: () => setIsBackendModalOpen(true),
      });
    } else {
      addToast({
        type: 'success',
        title: 'Quiz Synced Successfully!',
        message: `+${res.data.xpEarned} XP added to your EduTech Titans leaderboard score.`,
      });
    }

    return res.data;
  };

  // Weak Topic Practice Handler from Dashboard
  const handlePracticeWeakTopic = async (weakTopic: WeakTopic) => {
    const foundClass = classes.find((c) => c.id === weakTopic.classId) || classes[0];
    if (foundClass) setSelectedClass(foundClass);

    const { data: subs } = await api.getSubjects(weakTopic.classId);
    setSubjects(subs);
    const foundSub = subs.find((s) => s.id === weakTopic.subjectId) || subs[0];
    if (foundSub) setSelectedSubject(foundSub);

    const { data: chaps } = await api.getChapters(weakTopic.subjectId);
    setChapters(chaps);
    const foundChap = chaps.find((c) => c.id === weakTopic.recommendedChapterId) || chaps[0];
    if (foundChap) setSelectedChapter(foundChap);

    const { data: exs } = await api.getExercises(weakTopic.recommendedChapterId);
    setExercisesByChapter((prev) => ({ ...prev, [foundChap.id]: exs }));
    const foundEx = exs.find((e) => e.id === weakTopic.recommendedExerciseId) || exs[0];
    if (foundEx) setSelectedExercise(foundEx);

    setCurrentTab('workspace');
  };

  // Handler for Suggested Topics on every/each topic studied or learned
  const handleSelectSuggestedTopic = async (topic: SuggestedTopic) => {
    // 1. Resolve Class
    const foundClass = classes.find((c) => c.id === topic.classId) || classes[0];
    if (foundClass) setSelectedClass(foundClass);

    // 2. Resolve Subject
    const { data: subs } = await api.getSubjects(topic.classId);
    setSubjects(subs);
    const foundSub = subs.find((s) => s.id === topic.subjectId) || subs[0];
    if (foundSub) setSelectedSubject(foundSub);

    // 3. Resolve Chapter
    const { data: chaps } = await api.getChapters(topic.subjectId);
    setChapters(chaps);
    const foundChap = chaps.find((c) => c.id === topic.chapterId) || chaps[0];
    if (foundChap) setSelectedChapter(foundChap);

    // 4. Resolve Exercise
    const { data: exs } = await api.getExercises(foundChap.id);
    setExercisesByChapter((prev) => ({ ...prev, [foundChap.id]: exs }));
    const foundEx = exs.find((e) => e.id === topic.exerciseId) || exs[0];
    if (foundEx) setSelectedExercise(foundEx);

    // 5. Transition to Active Learning Workspace
    setCurrentTab('workspace');
    sound.playCorrect();

    addToast({
      type: 'success',
      title: `Launched Suggested Topic: ${topic.title}`,
      message: topic.reason,
    });
  };

  // Profile and stream customization handler
  const handleSaveProfile = async (updated: Partial<UserProfile>) => {
    const res = await api.updateUserProfile(updated);
    setUserProfile(res.data);
    addToast({
      type: 'success',
      title: 'Academic Profile & Stream Updated!',
      message: `Stream set to ${res.data.streamLabel}. Future course goal: ${res.data.targetCareerCourse}.`,
    });
  };

  // Future milestone roadmap topic selection handler
  const handleSelectRoadmapTopic = async (topic: FutureTopicRoadmap) => {
    sound.playClick();
    if (topic.classId && topic.subjectId && topic.chapterId) {
      const foundClass = classes.find((c) => c.id === topic.classId) || classes[0];
      if (foundClass) setSelectedClass(foundClass);

      const { data: subs } = await api.getSubjects(topic.classId);
      setSubjects(subs);
      const foundSub = subs.find((s) => s.id === topic.subjectId) || subs[0];
      if (foundSub) setSelectedSubject(foundSub);

      const { data: chaps } = await api.getChapters(topic.subjectId);
      setChapters(chaps);
      const foundChap = chaps.find((c) => c.id === topic.chapterId) || chaps[0];
      if (foundChap) setSelectedChapter(foundChap);

      const { data: exs } = await api.getExercises(foundChap.id);
      setExercisesByChapter((prev) => ({ ...prev, [foundChap.id]: exs }));
      const foundEx = exs.find((e) => e.id === topic.exerciseId) || exs[0];
      if (foundEx) setSelectedExercise(foundEx);

      setCurrentTab('workspace');
    }

    addToast({
      type: 'info',
      title: `Future Milestone: ${topic.title}`,
      message: `${topic.importance} topic for ${topic.targetCourse}. Starting foundational prerequisite: ${topic.prerequisiteTopic}.`,
    });
  };

  // Trigger NCERT PDF Modal
  const handleOpenNcertPdf = (subjectParam?: SubjectItem, chapterParam?: ChapterItem) => {
    sound.playClick();
    const sub = subjectParam || selectedSubject || subjects[0];
    const chap = chapterParam || selectedChapter || null;
    setActivePdfSubject(sub);
    setActivePdfChapter(chap);
    setIsNcertPdfModalOpen(true);
  };

  // Trigger Solved PDF Modal
  const handleOpenSolvedPdf = (subjectParam?: SubjectItem, chapterParam?: ChapterItem) => {
    sound.playClick();
    const sub = subjectParam || selectedSubject || subjects[0];
    const chap = chapterParam || selectedChapter || null;
    setActivePdfSubject(sub);
    setActivePdfChapter(chap);
    setIsSolvedPdfModalOpen(true);
  };

  // Handler for practicing topic from Knowledge Graph
  const handlePracticeGraphTopic = async (node: GraphNode) => {
    sound.playClick();
    const foundClass = classes.find((c) => c.gradeNumber === node.classGrade) || classes[0];
    if (foundClass) setSelectedClass(foundClass);

    const { data: subs } = await api.getSubjects(foundClass.id);
    setSubjects(subs);
    const foundSub = subs.find((s) => s.name.toLowerCase().includes(node.subject.toLowerCase())) || subs[0];
    if (foundSub) setSelectedSubject(foundSub);

    const { data: chaps } = await api.getChapters(foundSub.id);
    setChapters(chaps);
    const foundChap = chaps.find((c) => c.id === node.chapterId) || chaps[0];
    if (foundChap) setSelectedChapter(foundChap);

    const { data: exs } = await api.getExercises(foundChap.id);
    setExercisesByChapter((prev) => ({ ...prev, [foundChap.id]: exs }));
    const foundEx = (node.exerciseId ? exs.find((e) => e.id === node.exerciseId) : null) || exs[0];
    if (foundEx) setSelectedExercise(foundEx);

    setCurrentTab('workspace');
    addToast({
      type: 'info',
      title: `Practicing: ${node.label}`,
      message: node.isWeak ? 'Targeted weak topic intervention loaded.' : 'Concept playground loaded.',
    });
  };

  // Handler for asking doubt from Knowledge Graph
  const handleAskDoubtAboutTopic = async (node: GraphNode) => {
    sound.playClick();
    const foundClass = classes.find((c) => c.gradeNumber === node.classGrade) || classes[0];
    if (foundClass) setSelectedClass(foundClass);

    const { data: subs } = await api.getSubjects(foundClass.id);
    setSubjects(subs);
    const foundSub = subs.find((s) => s.name.toLowerCase().includes(node.subject.toLowerCase())) || subs[0];
    if (foundSub) setSelectedSubject(foundSub);

    const { data: chaps } = await api.getChapters(foundSub.id);
    setChapters(chaps);
    const foundChap = chaps.find((c) => c.id === node.chapterId) || chaps[0];
    if (foundChap) setSelectedChapter(foundChap);

    setCurrentTab('doubt_solver');
  };

  // XP Earned from Battles or Revision
  const handleXpEarned = (xp: number) => {
    const updated = StorageService.recordLocalQuizCompletion('bonus', 3, xp);
    setUserProfile(updated);
    setDueRevisionCount(spacedRepetitionService.getDueCount());
    addToast({
      type: 'success',
      title: `+${xp} XP Earned!`,
      message: 'Points added to your academic level progress.',
    });
  };

  const activeSuggestedTopics = selectedExercise
    ? getSuggestedTopics(selectedExercise, selectedChapter || undefined, selectedSubject || undefined)
    : [];

  const activeTheme = themeManager.getTheme();
  const patternClass =
    currentThemeId === 'creative-studio'
      ? 'student-notebook-dots'
      : currentThemeId === 'midnight-scholar'
      ? 'student-cosmic-stars'
      : 'student-grid-paper';

  return (
    <div
      data-theme={currentThemeId}
      className={`min-h-screen ${activeTheme.bgClass} ${activeTheme.textClass} ${patternClass} flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-300`}
    >
      {/* Top Application Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userProfile={userProfile}
        apiStatus={apiStatus}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(StorageService.isSoundEnabled())}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
        dueRevisionCount={dueRevisionCount}
        currentThemeId={currentThemeId}
        onThemeSelect={(id) => setCurrentThemeId(id)}
      />

      {/* Interactive Breadcrumbs */}
      <Breadcrumbs
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        selectedChapter={selectedChapter}
        selectedExercise={currentTab === 'workspace' ? selectedExercise : null}
        onNavigate={handleBreadcrumbNavigate}
      />

      {/* Student Creativity Hub: Quests, Daily Inspiration & Ambient Focus */}
      <StudentCreativityBanner
        userProfile={userProfile}
        dueRevisionCount={dueRevisionCount}
        onNavigateToTab={(tab) => setCurrentTab(tab as any)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Curriculum Explorer */}
        {currentTab === 'curriculum' && (
          <div className="space-y-6 animate-in fade-in">
            {curriculumLevel === 'classes' && (
              <ClassSelector
                classes={classes}
                selectedClassId={selectedClass?.id || ''}
                onSelectClass={handleSelectClass}
                onOpenPrimaryGames={() => setCurrentTab('primary_games')}
              />
            )}

            {curriculumLevel === 'subjects' && selectedClass && (
              <SubjectList
                currentClass={selectedClass}
                subjects={subjects}
                selectedSubjectId={selectedSubject?.id || ''}
                onSelectSubject={handleSelectSubject}
                onBackToClasses={() => setCurriculumLevel('classes')}
                onOpenNcertPdf={(sub) => handleOpenNcertPdf(sub)}
                onOpenSolvedPdf={(sub) => handleOpenSolvedPdf(sub)}
                onSetProfileStream={(stream) => {
                  handleSaveProfile({ stream: stream as any });
                }}
              />
            )}

            {curriculumLevel === 'chapters' && selectedClass && selectedSubject && (
              <ChapterList
                currentClass={selectedClass}
                currentSubject={selectedSubject}
                chapters={chapters}
                exercisesByChapter={exercisesByChapter}
                onSelectExercise={handleSelectExercise}
                onBackToSubjects={() => setCurriculumLevel('subjects')}
                onOpenNcertPdf={(chap) => handleOpenNcertPdf(selectedSubject, chap)}
                onOpenSolvedPdf={(chap) => handleOpenSolvedPdf(selectedSubject, chap)}
                onSelectSuggestedTopic={handleSelectSuggestedTopic}
              />
            )}
          </div>
        )}

        {/* Tab 2: Active Learning Workspace */}
        {currentTab === 'workspace' && (
          <div className="animate-in fade-in">
            {selectedExercise && selectedChapter && selectedSubject ? (
              <Workspace
                exercise={selectedExercise}
                chapter={selectedChapter}
                subject={selectedSubject}
                userId={userProfile.id}
                onSubmitQuiz={handleSubmitQuiz}
                onBackToChapter={() => {
                  setCurrentTab('curriculum');
                  setCurriculumLevel('chapters');
                }}
                onSelectSuggestedTopic={handleSelectSuggestedTopic}
                onOpenNcertPdf={() => handleOpenNcertPdf(selectedSubject, selectedChapter)}
                onOpenSolvedPdf={() => handleOpenSolvedPdf(selectedSubject, selectedChapter)}
              />
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <p className="text-slate-400 text-sm">
                  No active exercise selected. Please select a chapter exercise from the Curriculum Explorer.
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentTab('curriculum');
                    setCurriculumLevel('chapters');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Browse Curriculum
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: AI Doubt Solver Studio */}
        {currentTab === 'doubt_solver' && (
          <div className="animate-in fade-in">
            <DoubtSolverView
              currentClass={selectedClass || classes[9] || classes[0] || {
                id: 'class-10',
                grade: 10,
                name: 'Class 10',
                description: 'Secondary Board Examination Year',
                totalSubjects: 4,
                completedSubjects: 2,
                themeColor: 'from-amber-600 to-amber-700',
              }}
              currentSubject={selectedSubject || subjects[0] || {
                id: 'sub-c10-sci',
                classId: 'class-10',
                name: 'Science',
                code: 'SCI10',
                icon: 'FlaskConical',
                color: 'from-amber-500 to-orange-600',
                totalChapters: 13,
                completedChapters: 4,
                progressPct: 40,
                category: 'core',
              }}
              currentChapter={selectedChapter || chapters[0] || {
                id: 'chap-c10-sci-1',
                subjectId: selectedSubject?.id || 'sub-c10-sci',
                chapterNumber: 1,
                title: 'Chemical Reactions and Equations',
                subtitle: 'Types of reactions, oxidation, reduction & balancing',
                totalExercises: 4,
                completedExercises: 2,
                earnedStars: 6,
                maxStars: 12,
                difficulty: 'Medium',
                estimatedMinutes: 30,
                ncertUnit: 'Unit 1: Chemical Substances',
              }}
              allChapters={chapters}
              onSelectChapter={(chap) => setSelectedChapter(chap)}
              onAddedToRevision={() => {
                setDueRevisionCount(spacedRepetitionService.getDueCount());
                addToast({
                  type: 'success',
                  title: 'Added to Revision Queue',
                  message: 'This concept will appear in your daily SuperMemo SM-2 spaced repetition deck.',
                });
              }}
            />
          </div>
        )}

        {/* Tab 4: AI YouTube Video Summarizer (Precise, Points-Based) */}
        {currentTab === 'video_summarizer' && (
          <div className="animate-in fade-in">
            <VideoSummarizerView
              onAddedToRevision={(count) => {
                setDueRevisionCount(spacedRepetitionService.getDueCount());
                addToast({
                  type: 'success',
                  title: 'Flashcard Points Queued',
                  message: `Successfully added ${count} lecture flashcards to your Spaced Repetition Revision deck!`,
                });
              }}
              onOpenDoubtSolver={(topic) => {
                setCurrentTab('doubt_solver');
                addToast({
                  type: 'info',
                  title: 'AI Doubt Solver',
                  message: `Ask grounded questions about "${topic}".`,
                });
              }}
            />
          </div>
        )}

        {/* Tab 5: Knowledge Graph with Weak-Topic Highlighting */}
        {currentTab === 'knowledge_graph' && (
          <div className="animate-in fade-in">
            <KnowledgeGraphView
              onPracticeTopic={handlePracticeGraphTopic}
              onAskDoubtAboutTopic={handleAskDoubtAboutTopic}
              onAddedToRevision={() => {
                setDueRevisionCount(spacedRepetitionService.getDueCount());
                addToast({
                  type: 'success',
                  title: 'Added to Revision Queue',
                  message: 'Concept queued for spaced interval revision.',
                });
              }}
            />
          </div>
        )}

        {/* Tab 5: Spaced Repetition Revision Queue */}
        {currentTab === 'revision_queue' && (
          <div className="animate-in fade-in">
            <RevisionQueueView onXpEarned={handleXpEarned} />
          </div>
        )}

        {/* Tab 6: Study Battles 1v1 Live Arena */}
        {currentTab === 'study_battles' && (
          <div className="animate-in fade-in">
            <StudyBattlesView userProfile={userProfile} onXpEarned={handleXpEarned} />
          </div>
        )}

        {/* Tab 7: Primary Student Recognition Games (NCERT Classes 1-5) */}
        {currentTab === 'primary_games' && (
          <div className="animate-in fade-in">
            <PrimaryRecognitionGamesView
              onXpEarned={handleXpEarned}
              initialGrade={selectedClass && selectedClass.gradeNumber <= 5 ? 'primary' : 'senior'}
            />
          </div>
        )}

        {/* Tab 8: Rewards & Student Dashboard */}
        {currentTab === 'dashboard' && (
          <div className="animate-in fade-in">
            <StudentDashboard
              profile={userProfile}
              suggestedTopics={activeSuggestedTopics}
              onSelectSuggestedTopic={handleSelectSuggestedTopic}
              onSelectRoadmapTopic={handleSelectRoadmapTopic}
              onPracticeTopic={handlePracticeWeakTopic}
              onOpenBackendModal={() => setIsBackendModalOpen(true)}
              onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/70 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">EDUPLAY</span>
            <span aria-hidden="true">·</span>
            <span>EdTech Hackathon 2026</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400 font-medium">EduTech Titans</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>NCERT & CBSE Aligned (Class 1–12)</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleOpenSolvedPdf()}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Maths Solved Exercises PDF
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="text-slate-400 hover:text-indigo-400 transition-colors underline underline-offset-2"
            >
              Backend API & Offline Status
            </button>
          </div>
        </div>
      </footer>

      {/* Edit Profile & Stream Customization Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Backend & Offline Inspector Modal */}
      <BackendInspectorModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        status={apiStatus}
        onSyncTriggered={() => {
          setApiStatus(api.getStatus());
          setUserProfile(StorageService.getUserProfile());
        }}
      />

      {/* Official NCERT Textbook PDF Viewer Modal */}
      {selectedClass && (
        <NcertPdfViewerModal
          isOpen={isNcertPdfModalOpen}
          onClose={() => setIsNcertPdfModalOpen(false)}
          chapter={activePdfChapter}
          subject={activePdfSubject || selectedSubject || subjects[0]}
          currentClass={selectedClass}
          onOpenSolvedPdf={() => {
            setIsNcertPdfModalOpen(false);
            setIsSolvedPdfModalOpen(true);
          }}
        />
      )}

      {/* Solved Maths Exercises PDF Modal (Class 1 to 12) */}
      {selectedClass && (
        <SolvedPdfModal
          isOpen={isSolvedPdfModalOpen}
          onClose={() => setIsSolvedPdfModalOpen(false)}
          chapter={activePdfChapter}
          currentClass={selectedClass}
          classes={classes}
        />
      )}

      {/* Floating Notification Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
