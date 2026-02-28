import { z } from 'zod';
import {
  BODY_REGIONS,
  PAIN_SENSATIONS,
  PAIN_INTENSITY_LEVELS,
  PAIN_TEMPORALITIES,
  MOOD_STATES,
  SYMPTOMS,
  NOTIFICATION_LEVELS,
} from './constants';

// ── Auth ──
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
});

// ── Pain Entry ──
export const createPainEntrySchema = z.object({
  intensity: z.number().int().min(0).max(10),
  bodyRegion: z.enum(BODY_REGIONS),
  painSensation: z.enum(PAIN_SENSATIONS).optional(),
  painIntensityLevel: z.enum(PAIN_INTENSITY_LEVELS).optional(),
  painTemporality: z.enum(PAIN_TEMPORALITIES).optional(),
  moodStates: z.array(z.enum(MOOD_STATES)).optional(),
  notes: z.string().max(500).optional(),
});

// ── Symptom ──
export const createSymptomSchema = z.object({
  symptom: z.enum(SYMPTOMS),
  severity: z.number().int().min(1).max(5),
});

// ── Question Response ──
export const createQuestionResponseSchema = z.object({
  value: z.number().int().min(0).max(10),
});

// ── Settings ──
export const notificationSettingsSchema = z.object({
  notificationLevel: z.enum(NOTIFICATION_LEVELS),
  quietHoursStart: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM')
    .optional(),
  quietHoursEnd: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM')
    .optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  dateOfBirth: z.string().datetime().optional(),
  diagnosis: z.string().max(200).optional(),
});
