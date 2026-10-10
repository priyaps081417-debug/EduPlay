import React, { useState } from 'react';
import {
  X,
  Server,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Database,
  Code2,
  Trash2,
} from 'lucide-react';
import { ApiStatus, OfflineSubmission } from '../../types/curriculum';
import { StorageService } from '../../services/storage';
import { api } from '../../services/api';
import { sound } from '../../services/audio';

interface BackendInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ApiStatus;
  onSyncTriggered: () => void;
}

export const BackendInspectorModal: React.FC<BackendInspectorModalProps> = ({
  isOpen,
  onClose,
  status,
  onSyncTriggered,
}) => {
  const [activeTab, setActiveTab] = useState<'connection' | 'queue' | 'contract'>('connection');
  const [pingState, setPingState] = useState<{
    tested: boolean;
    loading: boolean;
    reachable: boolean;
    latencyMs?: number;
    error?: string;
  }>({
    tested: false,
    loading: false,
    reachable: false,
  });
  const [customUrl, setCustomUrl] = useState(status.backendUrl);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handlePing = async () => {
    sound.playClick();
    setPingState({ tested: false, loading: true, reachable: false });
    const res = await api.pingBackend();
    setPingState({
      tested: true,
      loading: false,
      reachable: res.reachable,
      latencyMs: res.latencyMs,
      error: res.error,
    });
    if (res.reachable) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handleSaveUrl = () => {
    sound.playClick();
    api.setBaseUrl(customUrl.trim());
    handlePing();
  };

  const handleToggleMock = (forceMock: boolean) => {
    sound.playClick();
    api.setMockMode(forceMock);
  };

  const handleSyncQueue = async () => {
    sound.playClick();
    setIsSyncing(true);
    await api.syncPendingSubmissions();
    setIsSyncing(false);
    onSyncTriggered();
    sound.playCorrect();
  };

  const handleClearQueue = () => {
    sound.playClick();
    StorageService.clearOfflineQueue();
    onSyncTriggered();
  };

  const copyToClipboard = (text: string, index: number) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const offlineQueue = StorageService.getOfflineQueue();

  const apiContracts = [
    {
      method: 'GET',
      path: '/api/curriculum/classes',
      desc: 'Retrieves all standard curriculum grades (Class 1 to 12).',
      sampleCurl: `curl -X GET "${status.backendUrl}/curriculum/classes"`,
      sampleResponse: `[
  {
    "id": "class-10",
    "name": "Class 10",
    "gradeNumber": 10,
    "stage": "secondary",
    "stageLabel": "Secondary",
    "description": "CBSE board core: Chemical reactions, electricity...",
    "subjectCount": 5,
    "totalChapters": 46
  }
]`,
    },
    {
      method: 'GET',
      path: '/api/curriculum/subjects?classId=:id',
      desc: 'Retrieves subjects registered for the given class identifier.',
      sampleCurl: `curl -X GET "${status.backendUrl}/curriculum/subjects?classId=class-10"`,
      sampleResponse: `[
  {
    "id": "sub-c10-sci",
    "classId": "class-10",
    "name": "Science",
    "code": "SCI-086",
    "color": "#10b981",
    "chapterCount": 13,
    "completedCount": 6,
    "progressPct": 46
  }
]`,
    },
    {
      method: 'GET',
      path: '/api/curriculum/chapters?subjectId=:id',
      desc: 'Retrieves syllabus chapters with star counts and completion data.',
      sampleCurl: `curl -X GET "${status.backendUrl}/curriculum/chapters?subjectId=sub-c10-sci"`,
      sampleResponse: `[
  {
    "id": "chap-c10-s1",
    "subjectId": "sub-c10-sci",
    "chapterNumber": 1,
    "title": "Chemical Reactions and Equations",
    "totalExercises": 4,
    "completedExercises": 3,
    "earnedStars": 8,
    "maxStars": 12,
    "difficulty": "Medium"
  }
]`,
    },
    {
      method: 'GET',
      path: '/api/quiz/:chapterId',
      desc: 'Retrieves diagnostic practice quiz questions and answer schema for the chapter.',
      sampleCurl: `curl -X GET "${status.backendUrl}/quiz/chap-c10-s1"`,
      sampleResponse: `{
  "exerciseId": "ex-c10-s1-1",
  "title": "Quiz: Balancing Chemical Equations",
  "timeLimitSeconds": 180,
  "passingScorePct": 70,
  "xpReward": 120,
  "questions": [...]
}`,
    },
    {
      method: 'POST',
      path: '/api/quiz/submit',
      desc: 'Submits user answers, calculates XP, updates level, and returns unlock result.',
      sampleCurl: `curl -X POST "${status.backendUrl}/quiz/submit" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "usr-titans-007",
    "exerciseId": "ex-c10-s1-1",
    "score": 100,
    "answers": [
      { "questionId": "q1", "selectedOption": 1, "isCorrect": true }
    ]
  }'`,
      sampleResponse: `{
  "success": true,
  "xpEarned": 140,
  "newTotalXp": 1590,
  "newLevel": 4,
  "leveledUp": false,
  "streakCount": 7,
  "starsEarned": 3
}`,
    },
    {
      method: 'GET',
      path: '/api/user/profile',
      desc: 'Retrieves learner profile, badges, weak-topic tags, and streak counter.',
      sampleCurl: `curl -X GET "${status.backendUrl}/user/profile"`,
      sampleResponse: `{
  "id": "usr-titans-007",
  "name": "Aarav Sharma",
  "xp": 1450,
  "level": 4,
  "streak": 7,
  "badges": [...],
  "weakTopics": [...]
}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Backend Adapter & Offline Inspector
              </h2>
              <p className="text-xs text-slate-400">
                Plug-and-play local Node.js / Express backend console with offline fallback
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('connection');
            }}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'connection'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Connection & Controls</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('queue');
            }}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'queue'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Offline Sync Queue ({offlineQueue.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('contract');
            }}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'contract'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>REST API Contract</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Connection Tab */}
          {activeTab === 'connection' && (
            <div className="space-y-6">
              {/* Endpoint configuration card */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Backend Endpoint
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="http://localhost:5000/api"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0"
                  >
                    Update URL
                  </button>
                </div>

                <div className="text-[11px] text-slate-500">
                  Configured via <code className="text-indigo-400 font-mono">VITE_API_URL</code> in <code className="text-indigo-400 font-mono">.env</code>. Default: <code className="font-mono text-slate-400">http://localhost:5000/api</code>
                </div>
              </div>

              {/* Status and ping test card */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Health Status
                  </div>
                  <button
                    onClick={handlePing}
                    disabled={pingState.loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${pingState.loading ? 'animate-spin' : ''}`} />
                    <span>Test Ping Now</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  {status.isMockMode ? (
                    <WifiOff className="w-6 h-6 text-amber-400 shrink-0" />
                  ) : pingState.tested ? (
                    pingState.reachable ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                    )
                  ) : (
                    <Server className="w-6 h-6 text-indigo-400 shrink-0" />
                  )}

                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">
                      {status.isMockMode
                        ? 'Simulated Offline Mode Active'
                        : pingState.tested
                        ? pingState.reachable
                          ? `Local Backend Connected (${pingState.latencyMs} ms)`
                          : `Local Backend Unreachable — Using Mock Data Fallback`
                        : 'Automatic Fallback Mode Active'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {status.isMockMode
                        ? 'Requests are served from LocalStorage mock cache.'
                        : pingState.tested && !pingState.reachable
                        ? 'Start your Node.js/Express server on port 5000 to seamlessly switch to live database.'
                        : 'If your backend is stopped, all pages work seamlessly with rich NCERT mock curriculum.'}
                    </div>
                  </div>
                </div>

                {/* Simulated Mode Toggle buttons */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">
                    Simulate offline network for testing?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleMock(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        !status.isMockMode
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Auto / Online
                    </button>
                    <button
                      onClick={() => handleToggleMock(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        status.isMockMode
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Force Offline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Offline Queue Tab */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Queued Quiz Submissions ({offlineQueue.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Submissions completed while offline will automatically sync once connected.
                  </p>
                </div>

                {offlineQueue.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearQueue}
                      className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Clear offline queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSyncQueue}
                      disabled={isSyncing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                )}
              </div>

              {offlineQueue.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
                  All submissions are synced! No pending queue items.
                </div>
              ) : (
                <div className="space-y-3">
                  {offlineQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 font-mono"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-indigo-400 font-bold">{item.id}</span>
                        <span>{new Date(item.queuedAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-300">
                        Exercise: <span className="text-emerald-400">{item.payload.exerciseId}</span> · Score: {item.payload.score}% · Questions: {item.payload.totalQuestions}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. API Contract Documentation */}
          {activeTab === 'contract' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Your backend (Express / Fastify / Flask) should implement these routes matching the specification:
              </p>

              <div className="space-y-4">
                {apiContracts.map((contract, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            contract.method === 'GET'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {contract.method}
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {contract.path}
                        </span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(contract.sampleCurl, i)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy cURL</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-slate-400">{contract.desc}</p>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <div className="text-slate-500 mb-1">// Sample JSON response:</div>
                      <pre className="text-emerald-400">{contract.sampleResponse}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
