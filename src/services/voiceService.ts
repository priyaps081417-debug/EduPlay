import { languageService } from './languageService';

export interface VoiceState {
  isSpeaking: boolean;
  isListening: boolean;
  isSupportedTTS: boolean;
  isSupportedSTT: boolean;
  speechRate: number; // 0.8, 1.0, 1.25
  currentSpokenText?: string;
}

type VoiceStateListener = (state: VoiceState) => void;

class VoiceService {
  private isSpeaking: boolean = false;
  private isListening: boolean = false;
  private speechRate: number = 1.0;
  private recognition: any = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<VoiceStateListener> = new Set();
  private currentSpokenText?: string;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        console.warn('Speech recognition init failed:', e);
      }
    }
  }

  public getState(): VoiceState {
    const isSupportedTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const isSupportedSTT =
      typeof window !== 'undefined' &&
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    return {
      isSpeaking: this.isSpeaking,
      isListening: this.isListening,
      isSupportedTTS,
      isSupportedSTT,
      speechRate: this.speechRate,
      currentSpokenText: this.currentSpokenText,
    };
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public setSpeechRate(rate: number): void {
    this.speechRate = Math.max(0.5, Math.min(2.0, rate));
    this.notify();
  }

  // --- Text-to-Speech (TTS) ---
  public speak(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    this.stopSpeaking();

    // Clean text of markdown stars and hashes for pleasant voice reading
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;
      utterance.rate = this.speechRate;
      utterance.pitch = 1.0;

      const langCode = languageService.getSpeechCode();
      utterance.lang = langCode;

      // Try selecting an appropriate voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoice =
          voices.find((v) => v.lang.startsWith(langCode)) ||
          voices.find((v) => v.lang.includes('IN') || v.lang.includes('hi')) ||
          voices[0];
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentSpokenText = cleanText.substring(0, 80) + '...';
        this.notify();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentSpokenText = undefined;
        this.currentUtterance = null;
        this.notify();
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentSpokenText = undefined;
        this.currentUtterance = null;
        this.notify();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.notify();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentSpokenText = undefined;
      this.currentUtterance = null;
      this.notify();
    }
  }

  // --- Speech-to-Text (STT) Voice Input ---
  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      this.initSpeechRecognition();
      if (!this.recognition) {
        if (onError) onError('Speech Recognition not supported in this browser.');
        return false;
      }
    }

    try {
      this.stopSpeaking();
      this.recognition.lang = languageService.getSpeechCode();

      this.recognition.onstart = () => {
        this.isListening = true;
        this.notify();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript.trim(), true);
        } else if (interimTranscript) {
          onResult(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.notify();
        if (onError) onError(event.error || 'Speech input error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.notify();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn('Failed to start speech recognition:', e);
      this.isListening = false;
      this.notify();
      if (onError) onError(e?.message || 'Failed to start microphone');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
      this.notify();
    }
  }
}

export const voiceService = new VoiceService();
