# EDUPLAY — Gamified NCERT EdTech Platform

> **EduTech Titans** | Built for EdTech Hackathon 2026  
> A modern, gamified, distraction-free NCERT learning platform for Indian school education spanning **Classes 1 through 12**, equipped with official NCERT textbook PDFs, chapter-wise solved Mathematics exercises, Class 11–12 stream separation (Mathematics PCM/PCMB vs. Biology PCB vs. Commerce vs. Humanities), personalized career roadmaps, and contextual next-topic recommendations.

---

## 🌟 Overview & Key Highlights

**EDUPLAY** bridges standard NCERT curriculum textbooks with interactive simulations, gamified progress loops, and offline resilience. Students transition seamlessly from foundational primary concepts (Classes 1–5) through middle school curiosity modules (Classes 6–8) and secondary boards preparation (Classes 9–10) to senior secondary competitive streams (Classes 11–12).

---

## 🚀 Key Features

### 1. 📚 Complete NCERT Curriculum (Classes 1 to 12)
- **Full K–12 Coverage**: Pre-configured with official NCERT curricula for all grades:
  - **Primary (Classes 1–5)**: *Joyful Mathematics*, *Math-Magic*, *Looking Around (EVS)*, *Mridang*, *Marigold*, *Rimjhim*.
  - **Middle School (Classes 6–8)**: *Mathematics*, *Curiosity / General Science*, *Our Pasts / Social Science*, *Honeysuckle / Honeycomb*.
  - **Secondary (Classes 9–10)**: *NCERT Mathematics*, *Science (Physics/Chem/Bio integrated)*, *Contemporary India*, *Democratic Politics*, *First Flight / Beehive*.
  - **Senior Secondary (Classes 11–12)**: *Physics Parts 1 & 2*, *Chemistry Parts 1 & 2*, *Mathematics Parts 1 & 2*, *Biology*, *Computer Science (Python)*, *Accountancy*, *Business Studies*, *Economics*, and *Humanities*.

### 2. 🔀 Class 11 & 12 Academic Stream Separation
- Dedicated filtering and organization for senior secondary students:
  - **📐 Mathematics Track (PCM / PCMB)**: Focused on Engineering, JEE Main/Advanced, Applied Math, Physics, and Chemistry.
  - **🧬 Biology Track (PCB)**: Tailored for Medical aspirants (NEET-UG), Zoology, Botany, and Clinical Sciences.
  - **💼 Commerce Track**: Accountancy, Business Studies, Micro/Macroeconomics, and Applied Math.
  - **🏛️ Humanities & Arts**: History, Political Science, Psychology, and Sociology.
- Real-time stream switcher tab bar with badge indicators and instant sync to user profiles.

### 3. 📄 Official NCERT Textbooks & Solved Maths Exercises PDFs
- **Official NCERT PDF Viewer Modal**:
  - Direct links to official NCERT textbooks hosted on `ncert.nic.in`.
  - Built-in syllabus overview, chapter summary, key learning objectives, and download / print capabilities.
- **Solved Maths Exercises Modal**:
  - Detailed step-by-step solutions for exercises across all classes (Classes 1 to 12).
  - Highlights formula references, step-by-step calculations, verified answers, and difficulty levels.
  - Direct quick-switcher to toggle between grades from 1 to 12 anytime.

### 4. 🧭 Contextual "Suggest Next Topic" Engine
- **Per-Topic Suggestions**: Every studied topic and completed learning module provides intelligent recommendations for:
  - Prerequisite review for weaker concepts.
  - Logical next-step chapters and advanced extension topics.
  - Real-world practical applications and competitive exam links (Olympiads, NTSE, JEE, NEET, CUET).
- Available inside:
  - **Interactive Workspace / Playground**
  - **Chapter List view**
  - **Post-Quiz completion summary**
  - **Concept study cards**

### 5. 👤 Stream & Course Profile Customization with Future Roadmaps
- **Profile Modal (`EditProfileModal.tsx`)**:
  - Edit Student Name, Avatar, Grade (1–12), Academic Stream, Target Career Goal, and Study Pace.
  - Select target goals: *B.Tech Computer Science (IIT JEE)*, *MBBS / Clinical Medicine (NEET)*, *CA Foundation*, *UPSC / Civil Services*, *Data Science & AI*, etc.
- **Future Stream Roadmap Card**:
  - Dynamically displays recommended future milestones, upcoming topics, and career path skills according to the student's selected stream and ambition.

### 6. 🎮 Gamification & Engagement
- **XP, Levels, and Streaks**: Earn XP for reading concept cards, testing interactive simulations, and completing quizzes.
- **Milestone Badges**: Unlockable achievements such as *First Step*, *Streak Master*, *Quiz Ace*, and *Math Wizard*.
- **Sound Effects (Web Audio API)**: Harmonic chime sound synthesizer with toggle mute controls.

### 7. 🤖 Chapter-Grounded AI Doubt Solver
- **Context-Aware Grounding**: Binds doubt responses strictly to the active NCERT Class, Subject, and Chapter syllabus.
- **Structured Explanations**:
  - 📘 **NCERT Source Citation & Theorem**
  - 🔢 **Step-by-Step Derivation Breakdown** with formulas
  - ⚠️ **Board Exam Pitfalls & Traps**
  - 💡 **Mnemonic / Memory Tricks**
  - 🎯 **Interactive Quick Mastery Check** with real-time feedback
- **Voice-Enabled**: Speak doubts via microphone or listen to audio explanations read aloud.
- **Save to Spaced Repetition**: 1-click addition of any answered doubt into the student's daily revision deck.

### 8. 🕸️ Knowledge Graph with Weak-Topic Highlighting
- **Visual Concept Interconnections**: Maps foundational topics (Classes 1–8), secondary core (Classes 9–10), and advanced senior secondary (Classes 11–12 PCM/PCB/Commerce).
- **Weak-Topic Halo Spotlighting**: Pulsing red/amber halo rings visually flag topics with low accuracy (&lt;60%).
- **Interactive Topic Inspector**:
  - Detailed diagnostic error analysis (e.g. sign mistakes, formula traps).
  - Direct "Practice Topic Now" launch button into Workspace.
  - Quick "Ask AI Doubt Solver" and "Add to Revision Deck" actions.

### 9. 🌐 Multilingual & 🎙️ Voice Mode
- **8 Supported Indian Languages**: English, हिन्दी (Hindi), Hinglish, मराठी (Marathi), தமிழ் (Tamil), తెలుగు (Telugu), বাংলা (Bengali), and ગુજરાતી (Gujarati).
- **Speech-to-Text (STT)**: Microphone speech recognition allows students to ask doubts verbally.
- **Text-to-Speech (TTS)**: Web Speech API voice narration reads concepts, formulas, and solutions aloud with speed control (0.8x, 1.0x, 1.25x).

### 10. 🧠 Spaced Repetition Revision Queue (SuperMemo SM-2)
- **Scientific Interval Calculation**: Uses the SuperMemo SM-2 algorithm (`intervalDays`, `easeFactor`, `repetitionCount`).
- **Interactive Flip-Cards**: Question/Prompt front → Verified NCERT solution & derivation back.
- **4-Grade Rating**: *Again (1d)*, *Hard (2d)*, *Good (6d)*, *Easy (14d)*.
- **Retention Analytics**: Tracks daily due cards, total deck size, mastered count, and average retention rate.

### 11. ⏯️ Step-by-Step Solution Replay
- **Interactive Math & Science Solution Player**:
  - Automated playback timer with speed adjustment (0.5x, 1x, 1.5x, 2x).
  - Step progression timeline scrubber with clickable dots.
  - "Why this step?" pedagogical insight callouts.
  - "Common Trap to Avoid" alert boxes.
  - Synced voice narration speaks step derivations as playback advances.

### 12. 📱 Progressive Web App (PWA) Support
- **Full PWA Compliance**: Web App Manifest (`manifest.json`), service worker (`sw.js`), and scalable vector icons.
- **In-App Install Prompt**: Custom "Install App" button handling `beforeinstallprompt` event.
- **Zero-Distraction Standalone Mode**: Fullscreen native experience with offline caching.

### 13. ⚔️ Study Battles (1v1 Live Peer Arena)
- **Competitive Rapid-Fire Duels**: 5-round 10–12 second timed duels against peer AI rivals (Rohan, Ananya, Kabir, etc.).
- **Live Split-Screen HUD**: Avatar, health/score bars, rival response status, and combo multipliers.
- **Tactical Power-Ups**:
  - ⏱️ *Time Freeze* (+6s)
  - 🎯 *50:50 Lifeline* (eliminates 2 incorrect choices)
  - ⚡ *Double XP Boost* (2x round multiplier)
- **Elo Rating & Battle Tiers**: Bronze, Silver, Gold, Diamond, and Grandmaster ranking with match history log.

### 14. 📺 AI YouTube Video Summarizer (Accurate, Points-Based)
- **Paste Any YouTube URL**: Compatible with standard watch URLs, `youtu.be` short links, YouTube Shorts, mobile links, and timestamped URLs.
- **Strictly Points-Based Analysis**:
  - 📌 **Executive Key Takeaways (In Points)**: Core concepts, boundary definitions, and proven conclusions formatted strictly in structured points.
  - ⏱️ **Timestamped Chronological Breakdown**: Sequential section-by-section points with clickable timestamps (e.g. `00:00`, `04:15`, `09:40`) that seek the built-in video player.
  - 📐 **Formulas, Laws & Chemical Reactions**: Mathematical identities, reaction equations, and physics laws grounded in curriculum data.
  - ⚠️ **Common Pitfalls & Board Exam Traps**: Caveats, sign errors, and tricky misconceptions warned by the educator.
  - ⚡ **High-Yield Exam Cheat-Sheet**: Bullet-point digest for rapid pre-exam revision.
  - 🧠 **1-Click Spaced Repetition Export**: Converts video key points into flashcards and sends them straight to the SuperMemo SM-2 queue.
- **Split-Screen Interactive Player**: Watch the video side-by-side with points notes without context switching.
- **Voice TTS & Export Tools**: Read points aloud with speech synthesis, copy formatted Markdown, or download `.txt` study notes.

### 15. 📡 Offline Resilience & State Sync
- Full offline support with LocalStorage fallback.
- Pending submissions queue when network is unavailable and automatically sync upon reconnection.
- Built-in Mock Mode toggle for offline environments or automated testing.

### 16. 🎨 Student-Friendly & Creative Theme Studio
- **4 Distinct Creative Student Themes**:
  - 🎨 **Creative Studio (Canvas & Notebook)**: Vibrant, warm campus light theme with crisp notebook paper texture, colorful subject badges, and playful doodle accents.
  - 🌌 **Midnight Scholar (Starry Academy)**: Deep cosmic space dark mode with neon streaks, glowing star dust, and cyber-notebook vibes.
  - ☕ **Sunset Cafe (Warm Study Lounge)**: Cozy roasted terracotta, apricot, and sunset twilight for calming evening study sessions.
  - 🌿 **Mint Explorer (Fresh Discovery)**: Botanical emerald, sage, and mint tones to keep your brain alert, relaxed, and focused.
- **Interactive Student Inspiration Banner**:
  - **Daily Motivational Eureka Quotes**: Rotating quotes with a "🎲 New Spark" inspiration generator.
  - **Daily 3-Step Student Quests**: Interactive checkboxes (`1 Doubt Solved`, `5 Cards Revised`, `1 Battle Won`) with celebration confetti!
  - **Student Sticker Locker**: Collectible student stickers (`🚀 100/100 Mission`, `💡 Curious Mind`, `⚡ Formula Wizard`, `🏆 NCERT Topper`, `🔥 Daily Streak`, `☕ Chai & Notes`) to customize headers.
  - **🎧 Focus Audio Generator**: Grounding Web Audio ambient study tone for deep concentration.

### 17. 🧩 Primary Student Recognition Games (NCERT Classes 1 to 5)
- **Foundational Visual & Spatial Challenges**: Designed specifically for young learners in Classes 1–5 (Joyful Mathematics, Math-Magic, Looking Around / EVS, English Mridang/Marigold, and Phonics).
- **5 Recognition Game Categories**:
  - 🔢 **Joyful Counting & Subitizing**: Count interactive animated fruits 🍎, butterflies 🦋, and pencil bundles with tap-to-count audio assistance.
  - 🔺 **Shape Detective (2D & 3D Solids)**: Spot Cylinders 🥫, Spheres ⚽, Triangles 🥪, Cubes 🧊, and spatial geometric properties in everyday items.
  - 🌿 **Nature, Animals & EVS Quest**: Identify Living vs. Non-Living things, plant root/stem/leaf anatomy, and India's national fauna (e.g. Indian Peacock 🦚).
  - 🔤 **Phonics & Sight Word Safari**: Letter sound recognition (e.g., initial sound `/M/` for Monkey 🐒), rhyming pairs (`CAT 🐱` ⇄ `HAT 🎩`), and vowel completion.
  - 🎨 **Patterns & Growing Logic**: Alternating geometric sequences (🔴 🔷 🔴 🔷 __?) and skip-counting sequences.
- **🃏 Visual Memory Flip & Pair Arena**:
  - Interactive 8-card flip matching game (Animals, Geometric Shapes, Math Sums `2+2 ⇄ 4`).
  - Tracks flips, moves, and celebrates with star ratings.
- **🔊 Text-to-Speech (TTS) Voice Support**:
  - Large "Read to Me 🔊" button reads questions aloud in clear audio for young kids developing early reading fluency.
- **⭐ Gamified Primary Rewards**:
  - Star badges ⭐, XP gains (+25 XP per challenge), cheerful sound chimes, and celebration confetti.
  - Grade selector: **🧸 Class 1–2 (Junior Explorers)** vs. **🚀 Class 3–5 (Senior Detectives)**.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations & Effects**: [Motion](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend / Server**: Node.js + Express (serving API proxies and dev middleware)
- **Persistence**: Hybrid Storage Service (LocalStorage cache with offline action queue)

---

## 📁 Project Directory Structure

```text
├── metadata.json              # Applet metadata, capabilities, and branding
├── package.json               # Scripts and dependency specifications
├── index.html                 # HTML entry point with responsive viewport
├── vite.config.ts             # Vite configuration with React & Tailwind plugins
├── server.ts                  # Optional Express server runtime
├── src/
│   ├── main.tsx               # Client entry point
│   ├── App.tsx                # Main application state, views, and modal coordinator
│   ├── index.css              # Global styling & Tailwind CSS directives
│   ├── types/
│   │   └── curriculum.ts      # TypeScript interfaces for classes, subjects, chapters,
│   │                          # exercises, streams, user profiles, and roadmaps
│   ├── services/
│   │   ├── api.ts             # API client with offline retry handling
│   │   ├── mockData.ts        # Comprehensive NCERT dataset for Classes 1 to 12
│   │   ├── solvedMathsData.ts # Solved NCERT Mathematics exercises across all classes
│   │   ├── recommender.ts     # Topic recommendation engine & career roadmaps
│   │   ├── storage.ts         # LocalStorage persistence & offline queue manager
│   │   └── sound.ts           # Web Audio API sound effects synthesizer
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx     # Navigation, profile quick-info, and mode toggles
│       │   └── Footer.tsx     # Quick links, NCERT PDF launcher, and copyright info
│       ├── dashboard/
│       │   ├── StudentDashboard.tsx # Stats overview, weak topics, and stream roadmap
│       │   ├── StatsOverview.tsx    # XP, level progress bar, and badge count
│       │   ├── StreaksCard.tsx      # Daily study streak tracker
│       │   ├── WeakTopicsList.tsx   # Actionable revision list
│       │   └── FutureRoadmapCard.tsx# Personalized stream-based topic roadmap
│       ├── curriculum/
│       │   ├── ClassSelector.tsx    # Class 1 to 12 selection drawer / pills
│       │   ├── SubjectList.tsx      # Subject cards with Class 11-12 stream filters
│       │   └── ChapterList.tsx      # Chapters list, PDF triggers & topic suggestions
│       ├── workspace/
│       │   ├── Workspace.tsx        # Exercise workspace with tabbed modules
│       │   ├── ConceptCard.tsx      # Bite-sized NCERT concept breakdown
│       │   ├── InteractivePlayground.tsx # Hands-on formula simulations & experiments
│       │   └── QuizMode.tsx         # Gamified practice quiz with XP rewards
│       ├── common/
│       │   ├── SuggestedTopicsCard.tsx # Reusable topic recommendation banner
│       │   └── OfflineBadge.tsx     # Network status and pending sync indicator
│       └── modals/
│           ├── EditProfileModal.tsx # Profile, stream, career, and pace customization
│           ├── NcertPdfViewerModal.tsx # Official NCERT book previewer & download link
│           └── SolvedPdfModal.tsx   # Solved Mathematics exercise step-by-step viewer
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone or navigate to the repository:**
   ```bash
   cd react-example
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000` (or `http://0.0.0.0:3000`).

4. **Lint and Type-Check:**
   ```bash
   npm run lint
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🎯 Target Audience & Use Cases

- **CBSE & State Board Students (Classes 1–12)**: Free access to structured NCERT chapters, official books, and verified math solutions.
- **Class 11 & 12 Aspirants**: Seamless division between Science (PCM / PCB), Commerce, and Humanities with targeted entrance examination roadmaps (JEE, NEET, CA, CUET).
- **Teachers & Tutors**: Easy access to in-class chapter summaries, solved exercise demonstrations, and interactive visual simulations.
- **Self-Paced Learners**: Distraction-free, gamified experience reinforcing continuous daily study streaks.

---

## 📜 License & Acknowledgments

- **License**: Apache-2.0
- **Educational Content**: Based on the National Council of Educational Research and Training ([NCERT](https://ncert.nic.in/)) curriculum guidelines.
- **Built by**: *EduTech Titans* for EdTech Hackathon 2026.
