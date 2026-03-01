import type {
  BodyRegion,
  PainSensation,
  PainIntensityLevel,
  PainTemporality,
  MoodState,
  Symptom,
  NotificationLevel,
  QuestionCategory,
} from './constants.js';

// ── User ──
export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: string;
  diagnosis?: string;
  notificationLevel: NotificationLevel;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  createdAt: string;
}

// ── Pain Entry ──
export interface PainEntry {
  id: string;
  userId: string;
  intensity: number; // 0-10
  bodyRegion: BodyRegion;
  painSensation?: PainSensation;
  painIntensityLevel?: PainIntensityLevel;
  painTemporality?: PainTemporality;
  moodStates: MoodState[];
  musclePainLevels?: Partial<Record<BodyRegion, PainIntensityLevel>>;
  notes?: string;
  timestamp: string;
}

export interface CreatePainEntryDTO {
  intensity: number;
  bodyRegion?: BodyRegion;
  painSensation?: PainSensation;
  painIntensityLevel?: PainIntensityLevel;
  painTemporality?: PainTemporality;
  moodStates?: MoodState[];
  musclePainLevels?: Partial<Record<BodyRegion, PainIntensityLevel>>;
  notes?: string;
}

// ── Symptom Log ──
export interface SymptomLog {
  id: string;
  userId: string;
  symptom: Symptom;
  severity: number; // 1-5
  timestamp: string;
}

export interface CreateSymptomDTO {
  symptom: Symptom;
  severity: number;
}

// ── Questions ──
export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  scaleMin: number;
  scaleMax: number;
  frequency: string;
  active: boolean;
}

export interface QuestionResponse {
  id: string;
  userId: string;
  questionId: string;
  value: number;
  timestamp: string;
}

export interface CreateQuestionResponseDTO {
  value: number;
}

// ── Analytics ──
export interface PainStats {
  average: number;
  min: number;
  max: number;
  count: number;
  byRegion: Record<string, { average: number; count: number }>;
}

export interface PainTrend {
  date: string;
  average: number;
  count: number;
}

export interface QualityOfLife {
  date: string;
  score: number; // 0-100
  breakdown: {
    pain: number;
    mood: number;
    activity: number;
    sleep: number;
  };
}

// ── Settings ──
export interface NotificationSettingsDTO {
  notificationLevel: NotificationLevel;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface ProfileUpdateDTO {
  name?: string;
  dateOfBirth?: string;
  diagnosis?: string;
}

// ── Auth ──
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ── API Response Wrapper ──
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
