/**
 * @file api.js
 * Centralized API adapter for EDUPLAY (by EduTech Titans).
 *
 * Implements:
 *  - GET /api/curriculum/classes
 *  - GET /api/curriculum/subjects?classId=:id
 *  - GET /api/curriculum/chapters?subjectId=:id
 *  - GET /api/quiz/:chapterId
 *  - POST /api/quiz/submit
 *  - GET /api/user/profile
 */

import { api } from './api.ts';

export const getClasses = () => api.getClasses();
export const getSubjects = (classId) => api.getSubjects(classId);
export const getChapters = (subjectId) => api.getChapters(subjectId);
export const getExercises = (chapterId) => api.getExercises(chapterId);
export const getQuiz = (chapterId) => api.getQuiz(chapterId);
export const submitQuiz = (payload) => api.submitQuiz(payload);
export const getUserProfile = () => api.getUserProfile();
export const updateUserProfile = (partial) => api.updateUserProfile(partial);
export const syncPendingSubmissions = () => api.syncPendingSubmissions();
export const pingBackend = () => api.pingBackend();

export { api };
export default api;

