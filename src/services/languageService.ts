import { SupportedLanguage, LanguageOption } from '../types/curriculum';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', speechCode: 'en-IN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'hinglish', label: 'Hinglish', nativeLabel: 'Hinglish (Colloquial)', speechCode: 'hi-IN' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', speechCode: 'mr-IN' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', speechCode: 'gu-IN' },
];

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    curriculumExplorer: 'Curriculum Explorer',
    learningWorkspace: 'Active Workspace',
    studentDashboard: 'Progress & Streaks',
    doubtSolver: 'AI Doubt Solver',
    knowledgeGraph: 'Knowledge Graph',
    revisionQueue: 'Revision Queue',
    studyBattles: 'Study Battles',
    voiceMode: 'Voice Mode',
    askDoubt: 'Ask NCERT Doubt',
    solveStepByStep: 'Solution Replay',
    installApp: 'Install App',
    weakTopics: 'Weak Topics',
    cardsDueToday: 'Cards Due Today',
    startBattle: 'Start 1v1 Battle',
    groundedInNcert: 'Grounded in NCERT Syllabus',
    listenAloud: 'Read Aloud',
    stopListening: 'Stop Voice',
    speakDoubt: 'Speak Your Doubt...',
    typeDoubtPlaceholder: 'Ask any question or problem from this chapter...',
    practiceNow: 'Practice Now',
    streakCombo: 'Streak Multiplier',
  },
  hi: {
    curriculumExplorer: 'पाठ्यक्रम एक्सप्लोरर',
    learningWorkspace: 'सक्रिय अभ्यास कक्ष',
    studentDashboard: 'प्रगति एवं स्ट्रीक',
    doubtSolver: 'AI संदेह निवारक (Doubt Solver)',
    knowledgeGraph: 'ज्ञान आरेख (Knowledge Graph)',
    revisionQueue: 'पुनरावृत्ति कतार (Revision Queue)',
    studyBattles: 'अध्ययन युद्ध (Study Battles)',
    voiceMode: 'ध्वनि मोड',
    askDoubt: 'NCERT प्रश्न पूछें',
    solveStepByStep: 'चरण-दर-चरण समाधान',
    installApp: 'ऐप इंस्टॉल करें',
    weakTopics: 'कमजोर विषय',
    cardsDueToday: 'आज के पुनरावृत्ति कार्ड',
    startBattle: '1v1 मुकाबला शुरू करें',
    groundedInNcert: 'NCERT पाठ्यक्रम पर आधारित',
    listenAloud: 'सुनें (Read Aloud)',
    stopListening: 'आवाज़ बंद करें',
    speakDoubt: 'अपना प्रश्न बोलें...',
    typeDoubtPlaceholder: 'इस अध्याय से कोई भी प्रश्न या समस्या पूछें...',
    practiceNow: 'अभी अभ्यास करें',
    streakCombo: 'लगातार सही उत्तर बोनस',
  },
  hinglish: {
    curriculumExplorer: 'Syllabus Explorer',
    learningWorkspace: 'Study Workspace',
    studentDashboard: 'Progress & Streaks',
    doubtSolver: 'AI Doubt Solver (NCERT)',
    knowledgeGraph: 'Concept Map & Weak Topics',
    revisionQueue: 'Revision Queue (Spaced Memory)',
    studyBattles: '1v1 Study Battles',
    voiceMode: 'Voice Mode ON',
    askDoubt: 'Apna NCERT Doubt Poocho',
    solveStepByStep: 'Step-by-Step Solution Dekho',
    installApp: 'App Install Karo',
    weakTopics: 'Weak Topics (Dhayan De)',
    cardsDueToday: 'Aaj Ke Revision Cards',
    startBattle: '1v1 Match Shuru Karo',
    groundedInNcert: 'Directly NCERT Chapter Se Grounded',
    listenAloud: 'Audio Suno',
    stopListening: 'Audio Roko',
    speakDoubt: 'Bol kar doubt poocho...',
    typeDoubtPlaceholder: 'Chapter se related koi bhi concept ya formula poocho...',
    practiceNow: 'Abhi Practice Karo',
    streakCombo: 'Streak Multiplier Active',
  },
  mr: {
    curriculumExplorer: 'अभ्यासक्रम शोधक',
    learningWorkspace: 'अभ्यास कक्ष',
    studentDashboard: 'प्रगती व गुण',
    doubtSolver: 'AI शंका निवारक',
    knowledgeGraph: 'संकल्पना आलेख (Knowledge Graph)',
    revisionQueue: 'उजळणी रांग',
    studyBattles: 'अभ्यास स्पर्धा (Study Battles)',
    voiceMode: 'आवाज मोड',
    askDoubt: 'NCERT शंका विचारा',
    solveStepByStep: 'टप्प्याटप्प्याने स्पष्टीकरण',
    installApp: 'अॅप इन्स्टॉल करा',
    weakTopics: 'कमकुवत विषय',
    cardsDueToday: 'आजच्या उजळणी पत्रिका',
    startBattle: '1v1 सामना सुरू करा',
    groundedInNcert: 'NCERT अभ्यासक्रमावर आधारित',
    listenAloud: 'मोठ्याने ऐका',
    stopListening: 'आवाज थांबवा',
    speakDoubt: 'तुमची शंका बोला...',
    typeDoubtPlaceholder: 'या प्रकरणातील कोणताही प्रश्न विचारा...',
    practiceNow: 'आता सराव करा',
    streakCombo: 'सलग उत्तर बोनस',
  },
  ta: {
    curriculumExplorer: 'பாடத்திட்ட ஆய்வாளர்',
    learningWorkspace: 'பயிற்சி கூடம்',
    studentDashboard: 'முன்னேற்றம் & ஸ்ட்ரீக்',
    doubtSolver: 'AI சந்தேக தீர்வு',
    knowledgeGraph: 'அறிவு வரைபடம் (Knowledge Graph)',
    revisionQueue: 'மீள்பார்வை வரிசை',
    studyBattles: 'படிப்பு போர்கள் (1v1 Battles)',
    voiceMode: 'குரல் பயன்முறை',
    askDoubt: 'NCERT சந்தேகம் கேட்கவும்',
    solveStepByStep: 'படி படியான தீர்வு',
    installApp: 'பயன்பாட்டை நிறுவுக',
    weakTopics: 'பலகீனமான பகுதிகள்',
    cardsDueToday: 'இன்றைய மீள்பார்வை அட்டை',
    startBattle: '1v1 போர் தொடங்குக',
    groundedInNcert: 'NCERT பாடத்திட்டத்தை அடிப்படையாகக் கொண்டது',
    listenAloud: 'சத்தமாகக் கேட்கவும்',
    stopListening: 'குரலை நிறுத்து',
    speakDoubt: 'உங்கள் சந்தேகத்தை பேசுங்கள்...',
    typeDoubtPlaceholder: 'இந்த அத்தியாயத்தில் இருந்து எந்த கேள்வியையும் கேளுங்கள்...',
    practiceNow: 'இப்போது பயிற்சி செய்க',
    streakCombo: 'தொடர் போனஸ்',
  },
  te: {
    curriculumExplorer: 'సిలబస్ ఎక్స్‌ప్లోరర్',
    learningWorkspace: 'అభ్యాస గది',
    studentDashboard: 'పురోగతి & స్ట్రీక్',
    doubtSolver: 'AI సందేహ నివారణ',
    knowledgeGraph: 'జ్ఞాన గ్రాఫ్ (Knowledge Graph)',
    revisionQueue: 'పునర్విమర్శ క్యూ',
    studyBattles: 'స్టడీ బాటిల్స్ (1v1 Battles)',
    voiceMode: 'వాయిస్ మోడ్',
    askDoubt: 'NCERT సందేహం అడగండి',
    solveStepByStep: 'దశలవారీ పరిష్కారం',
    installApp: 'యాప్ ఇన్‌స్టాల్ చేయండి',
    weakTopics: 'బలహీన అంశాలు',
    cardsDueToday: 'ఈ రోజు పునర్విమర్శ కార్డులు',
    startBattle: '1v1 యుద్ధం ప్రారంభించండి',
    groundedInNcert: 'NCERT సిలబస్ ఆధారంగా',
    listenAloud: 'వినండి',
    stopListening: 'వాయిస్ ఆపండి',
    speakDoubt: 'మీ సందేహాన్ని మాట్లాడండి...',
    typeDoubtPlaceholder: 'ఈ అధ్యాయం నుండి ఏదైనా ప్రశ్న అడగండి...',
    practiceNow: 'ఇప్పుడే సాధన చేయండి',
    streakCombo: 'వరుస బోనస్',
  },
  bn: {
    curriculumExplorer: 'পাঠ্যক্রম এক্সপ্লোরার',
    learningWorkspace: 'অধ্যয়ন কর্মক্ষেত্র',
    studentDashboard: 'অগ্রগতি ও স্ট্রিক',
    doubtSolver: 'AI সন্দেহ নিরসনকারী',
    knowledgeGraph: 'জ্ঞান চিত্র (Knowledge Graph)',
    revisionQueue: 'পুনর্বিবেচনা সারি',
    studyBattles: 'স্টাডি ব্যাটেল (Study Battles)',
    voiceMode: 'ভয়েস মোড',
    askDoubt: 'NCERT সন্দেহ জিজ্ঞাসা করুন',
    solveStepByStep: 'ধাপে ধাপে সমাধান',
    installApp: 'অ্যাপ ইনস্টল করুন',
    weakTopics: 'দুর্বল বিষয়সমূহ',
    cardsDueToday: 'আজকের রিভিশন কার্ড',
    startBattle: '1v1 যুদ্ধ শুরু করুন',
    groundedInNcert: 'NCERT পাঠ্যক্রম ভিত্তিক',
    listenAloud: 'উচ্চস্বরে শুনুন',
    stopListening: 'ভয়েস বন্ধ করুন',
    speakDoubt: 'আপনার সন্দেহ বলুন...',
    typeDoubtPlaceholder: 'এই অধ্যায় থেকে যেকোনো প্রশ্ন জিজ্ঞাসা করুন...',
    practiceNow: 'এখনই অনুশীলন করুন',
    streakCombo: 'ধারাবাহিক বোনাস',
  },
  gu: {
    curriculumExplorer: 'અભ્યાસક્રમ એક્સપ્લોરર',
    learningWorkspace: 'અભ્યાસ ખંડ',
    studentDashboard: 'પ્રગતિ અને સ્ટ્રીક',
    doubtSolver: 'AI શંકા નિવારક',
    knowledgeGraph: 'જ્ઞાન આલેખ (Knowledge Graph)',
    revisionQueue: 'પુનરાવર્તન કતાર',
    studyBattles: 'સ્ટડી બેટલ્સ (1v1 Battles)',
    voiceMode: 'વોઇસ મોડ',
    askDoubt: 'NCERT શંકા પૂછો',
    solveStepByStep: 'પગલાવાર ઉકેલ',
    installApp: 'એપ ઇન્સ્ટોલ કરો',
    weakTopics: 'નબળા વિષયો',
    cardsDueToday: 'આજના પુનરાવર્તન કાર્ડ્સ',
    startBattle: '1v1 મુકાબલો શરૂ કરો',
    groundedInNcert: 'NCERT અભ્યાસક્રમ પર આધારિત',
    listenAloud: 'મોટેથી સાંભળો',
    stopListening: 'અવાજ બંધ કરો',
    speakDoubt: 'તમારી શંકા બોલો...',
    typeDoubtPlaceholder: 'આ પ્રકરણમાંથી કોઈપણ પ્રશ્ન પૂછો...',
    practiceNow: 'હવે અભ્યાસ કરો',
    streakCombo: 'સતત સાચા જવાબ બોનસ',
  },
};

const LANG_STORAGE_KEY = 'eduplay_selected_language';

class LanguageService {
  private currentLanguage: SupportedLanguage = 'en';
  private listeners: Set<(lang: SupportedLanguage) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage | null;
        if (saved && TRANSLATIONS[saved]) {
          this.currentLanguage = saved;
        }
      } catch (e) {
        console.warn('Could not read saved language', e);
      }
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage = lang;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      } catch (e) {
        console.warn('Could not save language', e);
      }
    }
    this.listeners.forEach((listener) => listener(lang));
  }

  public subscribe(listener: (lang: SupportedLanguage) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentLanguage);
    return () => this.listeners.delete(listener);
  }

  public t(key: string, fallback?: string): string {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || fallback || key;
  }

  public getSpeechCode(): string {
    const option = SUPPORTED_LANGUAGES.find((l) => l.code === this.currentLanguage);
    return option ? option.speechCode : 'en-IN';
  }
}

export const languageService = new LanguageService();
