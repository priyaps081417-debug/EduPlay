import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Sparkles,
  Compass,
  Target,
  Zap,
  Check,
  Save,
} from 'lucide-react';
import { UserProfile, AcademicStream } from '../../types/curriculum';
import { sound } from '../../services/audio';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

const STREAM_OPTIONS: Array<{ id: AcademicStream; label: string; desc: string; icon: string }> = [
  { id: 'pcm', label: 'Science (PCM)', desc: 'Physics, Chemistry, Maths — Engineering & IIT-JEE focus', icon: '⚡' },
  { id: 'pcb', label: 'Science (PCB)', desc: 'Physics, Chemistry, Biology — Medicine & NEET focus', icon: '🧬' },
  { id: 'pcmb', label: 'Science (PCMB)', desc: 'Dual PCM + Biology — Biomedical & Bio-Tech focus', icon: '🔬' },
  { id: 'commerce_maths', label: 'Commerce + Maths', desc: 'Accounts, Economics, Applied Maths — CA & Quant Finance', icon: '📈' },
  { id: 'commerce', label: 'Commerce (Core)', desc: 'Accounts, Business Studies, Economics — Management & BBA', icon: '📊' },
  { id: 'humanities', label: 'Humanities / Arts', desc: 'History, Political Science, Economics — Law & Civil Services', icon: '⚖️' },
  { id: 'foundation', label: 'Foundation Core', desc: 'General STEM & Social Foundations (Classes 1–10)', icon: '🌱' },
];

const CAREER_PRESETS: Record<AcademicStream, string[]> = {
  pcm: [
    'B.Tech Computer Science (IIT JEE)',
    'Aerospace / Mechanical Engineering',
    'Data Science & Artificial Intelligence',
    'Pure Physics & Mathematics Research',
  ],
  pcb: [
    'MBBS / Clinical Medicine (NEET)',
    'Biotechnology & Genomic Sciences',
    'Neuroscience & Cognitive Science',
    'BDS / Dental Surgery & Pharmacology',
  ],
  pcmb: [
    'Biomedical Engineering (IIT/AIIMS)',
    'Computational Biology & Genomics',
    'Biochemistry & Neural Interfaces',
  ],
  commerce_maths: [
    'Chartered Accountancy (CA Foundation)',
    'Quantitative Finance & Investment Banking',
    'B.Com (Hons) / Financial Modeling',
    'Actuarial Science & Risk Analytics',
  ],
  commerce: [
    'BBA / Entrepreneurship & Startups',
    'Corporate Management & Marketing',
    'Company Secretary (CS Executive)',
  ],
  humanities: [
    'BA LLB / Corporate Law (CLAT)',
    'UPSC Civil Services / Public Policy',
    'International Relations & Diplomacy',
    'Journalism & Media Communications',
  ],
  foundation: [
    'National Science Olympiad (NSO)',
    'NTSE & Early STEM Foundations',
    'Holistic CBSE Board Excellence',
  ],
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [classGrade, setClassGrade] = useState<number>(profile.classGrade);
  const [stream, setStream] = useState<AcademicStream>(profile.stream || 'pcm');
  const [targetCareerCourse, setTargetCareerCourse] = useState(
    profile.targetCareerCourse || CAREER_PRESETS[profile.stream || 'pcm'][0]
  );
  const [learningPace, setLearningPace] = useState<'fast' | 'balanced' | 'deep'>(
    profile.learningPace || 'balanced'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleStreamChange = (newStream: AcademicStream) => {
    sound.playClick();
    setStream(newStream);
    // Auto-update career suggestion preset if custom text not entered
    const defaultCareer = CAREER_PRESETS[newStream][0];
    setTargetCareerCourse(defaultCareer);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsSaving(true);

    const streamObj = STREAM_OPTIONS.find((s) => s.id === stream);

    try {
      await onSaveProfile({
        name: name.trim() || profile.name,
        classGrade,
        stream,
        streamLabel: streamObj ? streamObj.label : 'Science (PCM)',
        targetCareerCourse: targetCareerCourse.trim() || 'General Learning',
        learningPace,
        avatar: selectedAvatar,
      });
      sound.playCorrect();
      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Customize Academic Profile & Stream
              </h2>
              <p className="text-xs text-slate-400">
                Personalize your stream to receive tailored future curriculum and career roadmap suggestions
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

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Choose Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {AVATAR_OPTIONS.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setSelectedAvatar(av);
                  }}
                  className={`relative rounded-2xl overflow-hidden shrink-0 transition-transform active:scale-95 ${
                    selectedAvatar === av
                      ? 'ring-4 ring-indigo-500 scale-105 shadow-lg shadow-indigo-500/30'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt={`Avatar ${idx + 1}`} className="w-14 h-14 object-cover" />
                  {selectedAvatar === av && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Class Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Current Grade</label>
              <select
                value={classGrade}
                onChange={(e) => setClassGrade(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <option key={grade} value={grade}>
                    Class {grade} {grade >= 11 ? '(Senior Secondary)' : grade >= 9 ? '(Secondary)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Stream Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Academic Stream / Pathway
              </label>
              <span className="text-[11px] text-indigo-400 font-semibold">
                Powers your future topic engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STREAM_OPTIONS.map((st) => {
                const isSelected = stream === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => handleStreamChange(st.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{st.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{st.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Future Course / Career Aspiration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Future Course & Career Goal
              </label>
              <span className="text-[11px] text-slate-500">Pick preset or type custom</span>
            </div>

            <input
              type="text"
              value={targetCareerCourse}
              onChange={(e) => setTargetCareerCourse(e.target.value)}
              placeholder="e.g. B.Tech Computer Science / IIT JEE"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />

            {/* Quick Presets for current stream */}
            <div className="flex items-center flex-wrap gap-1.5 pt-1">
              {CAREER_PRESETS[stream].map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setTargetCareerCourse(preset);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    targetCareerCourse === preset
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Pace */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Learning Pace</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'fast', label: 'Fast-Track', desc: 'Focus on high-yield quiz speed' },
                { id: 'balanced', label: 'Balanced', desc: 'Concept + Playground + Quiz' },
                { id: 'deep', label: 'Deep Mastery', desc: 'Exhaustive notes & formulas' },
              ].map((pace) => (
                <div
                  key={pace.id}
                  onClick={() => {
                    sound.playClick();
                    setLearningPace(pace.id as 'fast' | 'balanced' | 'deep');
                  }}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    learningPace === pace.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{pace.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{pace.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Profile...' : 'Save & Update Stream'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
