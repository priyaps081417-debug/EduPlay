/**
 * Centralized API adapter for EDUPLAY (by EduTech Titans).
 *
 * Configured Base URL points to http://localhost:5000/api
 * via VITE_API_URL or fallback.
 *
 * Implements:
 *  - GET /curriculum/classes
 *  - GET /curriculum/subjects?classId=:id
 *  - GET /curriculum/chapters?subjectId=:id
 *  - GET /exercises/:chapterId
 *  - POST /quiz/submit
 *  - GET /user/profile
 *
 * Features seamless offline fallback & queued submission synchronization.
 */

import {
  ClassItem,
  SubjectItem,
  ChapterItem,
  ExerciseItem,
  UserProfile,
  Badge,
  QuizSubmissionPayload,
  QuizSubmissionResult,
  ApiStatus,
} from '../types/curriculum';
import { StorageService } from './storage';

// Default configuration
const DEFAULT_API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';
const REQUEST_TIMEOUT_MS = 2000;

export interface NetworkListener {
  (status: ApiStatus): void;
}

class ApiService {
  private listeners: Set<NetworkListener> = new Set();
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isMockModeForced: boolean = false;
  private lastCheckedTimestamp: string = new Date().toISOString();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
      const override = StorageService.getMockModeOverride();
      if (override !== null) {
        this.isMockModeForced = override;
      }
    }
  }

  public getBaseUrl(): string {
    const override = StorageService.getBackendUrlOverride();
    return override || DEFAULT_API_BASE;
  }

  /**
   * Normalizes URL to avoid double slashes or duplicated /api prefixes.
   */
  private buildUrl(endpoint: string): string {
    const base = this.getBaseUrl().replace(/\/+$/, '');
    let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // If base ends with /api and path starts with /api/, strip one /api
    if (base.endsWith('/api') && path.startsWith('/api/')) {
      path = path.replace(/^\/api/, '');
    }

    return `${base}${path}`;
  }

  public setBaseUrl(url: string): void {
    StorageService.setBackendUrlOverride(url);
    this.notifyStatusChange();
  }

  public setMockMode(forceMock: boolean | null): void {
    StorageService.setMockModeOverride(forceMock);
    this.isMockModeForced = forceMock === true;
    this.notifyStatusChange();
  }

  public getStatus(): ApiStatus {
    return {
      isOnline: this.isOnlineStatus,
      isMockMode: this.isMockModeForced,
      backendUrl: this.getBaseUrl(),
      lastChecked: this.lastCheckedTimestamp,
      pendingSyncCount: StorageService.getOfflineQueue().length,
    };
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyStatusChange(): void {
    this.lastCheckedTimestamp = new Date().toISOString();
    const status = this.getStatus();
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error('Error in network listener:', err);
      }
    });
  }

  private handleNetworkChange(online: boolean): void {
    this.isOnlineStatus = online;
    this.notifyStatusChange();
    if (online) {
      // Auto-trigger sync when connection is restored
      this.syncPendingSubmissions().catch(() => {});
    }
  }

  /**
   * Internal resilient fetch helper with automatic timeout & mock fallback.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    fallbackFn: () => T
  ): Promise<{ data: T; isFallback: boolean; error?: string }> {
    // If mock mode is forced by user or offline detected
    if (this.isMockModeForced || !this.isOnlineStatus) {
      return { data: fallbackFn(), isFallback: true };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const url = this.buildUrl(endpoint);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(options.headers || {}),
        },
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      return { data: json, isFallback: false };
    } catch (err: unknown) {
      clearTimeout(timer);
      const message = err instanceof Error ? err.message : 'Network request failed';
      // Graceful fallback to mock data
      const cached = fallbackFn();
      return {
        data: cached,
        isFallback: true,
        error: message,
      };
    }
  }

  // --- Curriculum API Contract ---

  /**
   * GET /curriculum/classes
   */
  public async getClasses(): Promise<{ data: ClassItem[]; isFallback: boolean; error?: string }> {
    return this.request<ClassItem[]>(
      '/curriculum/classes',
      { method: 'GET' },
      () => StorageService.getClasses()
    );
  }

  /**
   * GET /curriculum/subjects?classId=:id
   */
  public async getSubjects(
    classId: string
  ): Promise<{ data: SubjectItem[]; isFallback: boolean; error?: string }> {
    return this.request<SubjectItem[]>(
      `/curriculum/subjects?classId=${encodeURIComponent(classId)}`,
      { method: 'GET' },
      () => StorageService.getSubjects(classId)
    );
  }

  /**
   * GET /curriculum/chapters?subjectId=:id
   */
  public async getChapters(
    subjectId: string
  ): Promise<{ data: ChapterItem[]; isFallback: boolean; error?: string }> {
    return this.request<ChapterItem[]>(
      `/curriculum/chapters?subjectId=${encodeURIComponent(subjectId)}`,
      { method: 'GET' },
      () => StorageService.getChapters(subjectId)
    );
  }

  /**
   * GET /exercises/:chapterId
   */
  public async getExercises(
    chapterId: string
  ): Promise<{ data: ExerciseItem[]; isFallback: boolean; error?: string }> {
    return this.request<ExerciseItem[]>(
      `/curriculum/exercises/${encodeURIComponent(chapterId)}`,
      { method: 'GET' },
      () => StorageService.getExercises(chapterId)
    );
  }

  /**
   * GET /quiz/:chapterId
   * Stubs the quiz payload for the requested chapter.
   */
  public async getQuiz(
    chapterId: string
  ): Promise<{ data: ExerciseItem['quiz']; isFallback: boolean; error?: string }> {
    return this.request<ExerciseItem['quiz']>(
      `/quiz/${encodeURIComponent(chapterId)}`,
      { method: 'GET' },
      () => {
        const exercises = StorageService.getExercises(chapterId);
        return exercises[0]?.quiz;
      }
    );
  }

  /**
   * GET /user/profile
   */
  public async getUserProfile(): Promise<{ data: UserProfile; isFallback: boolean; error?: string }> {
    return this.request<UserProfile>(
      '/user/profile',
      { method: 'GET' },
      () => StorageService.getUserProfile()
    );
  }

  /**
   * PATCH /user/profile
   * Updates student profile fields (stream, target career course, grade, etc.)
   */
  public async updateUserProfile(
    partial: Partial<UserProfile>
  ): Promise<{ data: UserProfile; isFallback: boolean }> {
    const updated = StorageService.updateUserProfile(partial);

    if (this.isMockModeForced || !this.isOnlineStatus) {
      return { data: updated, isFallback: true };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const url = this.buildUrl('/user/profile');

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.ok) {
        const json = await response.json();
        return { data: json, isFallback: false };
      }
      return { data: updated, isFallback: true };
    } catch {
      return { data: updated, isFallback: true };
    }
  }

  /**
   * POST /quiz/submit
   * Payload: { userId, exerciseId, score, answers }
   */
  public async submitQuiz(
    payload: QuizSubmissionPayload
  ): Promise<{ data: QuizSubmissionResult; isFallback: boolean }> {
    const starCount =
      payload.score >= 90 ? 3 : payload.score >= 60 ? 2 : payload.score >= 40 ? 1 : 0;
    const baseReward = 80;
    const bonusReward = starCount * 20;
    const totalXpEarned = baseReward + bonusReward;

    // First, update local state so UX is instant
    const updatedProfile = StorageService.recordLocalQuizCompletion(
      payload.exerciseId,
      starCount,
      totalXpEarned
    );

    const defaultResult: QuizSubmissionResult = {
      success: true,
      xpEarned: totalXpEarned,
      newTotalXp: updatedProfile.xp,
      newLevel: updatedProfile.level,
      leveledUp: updatedProfile.xpCurrentLevel === 0,
      unlockedBadges: updatedProfile.badges.filter((b: Badge) => b.isUnlocked),
      streakCount: updatedProfile.streak,
      starsEarned: starCount,
      syncedToBackend: false,
    };

    if (this.isMockModeForced || !this.isOnlineStatus) {
      // Save to offline queue
      StorageService.enqueueOfflineSubmission(payload);
      this.notifyStatusChange();
      return { data: defaultResult, isFallback: true };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const url = this.buildUrl('/quiz/submit');

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      return {
        data: {
          ...defaultResult,
          ...json,
          syncedToBackend: true,
        },
        isFallback: false,
      };
    } catch {
      // Failed to reach backend, queue submission offline!
      StorageService.enqueueOfflineSubmission(payload);
      this.notifyStatusChange();
      return {
        data: {
          ...defaultResult,
          syncedToBackend: false,
        },
        isFallback: true,
      };
    }
  }

  /**
   * Sync all pending submissions in offline queue to the backend.
   */
  public async syncPendingSubmissions(): Promise<{ syncedCount: number; remainingCount: number }> {
    const queue = StorageService.getOfflineQueue();
    if (queue.length === 0) {
      return { syncedCount: 0, remainingCount: 0 };
    }

    let syncedCount = 0;
    const url = this.buildUrl('/quiz/submit');

    for (const item of queue) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });

        if (response.ok) {
          StorageService.dequeueOfflineSubmission(item.id);
          syncedCount++;
        }
      } catch {
        // Can stop or continue
        break;
      }
    }

    this.notifyStatusChange();
    const remaining = StorageService.getOfflineQueue().length;
    return { syncedCount, remainingCount: remaining };
  }

  /**
   * Test current backend connection
   */
  public async pingBackend(): Promise<{ reachable: boolean; latencyMs: number; error?: string }> {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.getBaseUrl()}/curriculum/classes`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - startTime);
      return { reachable: res.ok, latencyMs };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        reachable: false,
        latencyMs,
        error: err instanceof Error ? err.message : 'Connection failed',
      };
    }
  }
}

export const api = new ApiService();
export default api;
