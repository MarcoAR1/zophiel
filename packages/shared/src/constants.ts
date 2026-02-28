// ── Body regions (front/back for 360° coverage) ──
export const BODY_REGIONS_FRONT = [
  'head_front',
  'face',
  'neck_front',
  'chest_left',
  'chest_right',
  'abdomen_upper',
  'abdomen_lower',
  'left_shoulder_front',
  'right_shoulder_front',
  'left_upper_arm_front',
  'right_upper_arm_front',
  'left_forearm_front',
  'right_forearm_front',
  'left_hand',
  'right_hand',
  'left_hip_front',
  'right_hip_front',
  'left_thigh_front',
  'right_thigh_front',
  'left_knee_front',
  'right_knee_front',
  'left_shin',
  'right_shin',
  'left_foot',
  'right_foot',
  'groin',
] as const;

export const BODY_REGIONS_BACK = [
  'head_back',
  'neck_back',
  'upper_back_left',
  'upper_back_right',
  'mid_back_left',
  'mid_back_right',
  'lower_back_left',
  'lower_back_right',
  'left_shoulder_back',
  'right_shoulder_back',
  'left_upper_arm_back',
  'right_upper_arm_back',
  'left_forearm_back',
  'right_forearm_back',
  'left_glute',
  'right_glute',
  'left_thigh_back',
  'right_thigh_back',
  'left_calf',
  'right_calf',
  'left_heel',
  'right_heel',
] as const;

export const BODY_REGIONS = [...BODY_REGIONS_FRONT, ...BODY_REGIONS_BACK] as const;
export type BodyRegion = (typeof BODY_REGIONS)[number];

export const BODY_REGION_LABELS: Record<BodyRegion, string> = {
  // Front
  head_front: 'Cabeza (frente)',
  face: 'Rostro',
  neck_front: 'Cuello (frente)',
  chest_left: 'Pecho izq.',
  chest_right: 'Pecho der.',
  abdomen_upper: 'Abdomen superior',
  abdomen_lower: 'Abdomen inferior',
  left_shoulder_front: 'Hombro izq.',
  right_shoulder_front: 'Hombro der.',
  left_upper_arm_front: 'Brazo sup. izq.',
  right_upper_arm_front: 'Brazo sup. der.',
  left_forearm_front: 'Antebrazo izq.',
  right_forearm_front: 'Antebrazo der.',
  left_hand: 'Mano izq.',
  right_hand: 'Mano der.',
  left_hip_front: 'Cadera izq.',
  right_hip_front: 'Cadera der.',
  left_thigh_front: 'Muslo izq.',
  right_thigh_front: 'Muslo der.',
  left_knee_front: 'Rodilla izq.',
  right_knee_front: 'Rodilla der.',
  left_shin: 'Espinilla izq.',
  right_shin: 'Espinilla der.',
  left_foot: 'Pie izq.',
  right_foot: 'Pie der.',
  groin: 'Ingle',
  // Back
  head_back: 'Cabeza (atrás)',
  neck_back: 'Cuello (atrás)',
  upper_back_left: 'Espalda alta izq.',
  upper_back_right: 'Espalda alta der.',
  mid_back_left: 'Espalda media izq.',
  mid_back_right: 'Espalda media der.',
  lower_back_left: 'Lumbar izq.',
  lower_back_right: 'Lumbar der.',
  left_shoulder_back: 'Hombro izq. (atrás)',
  right_shoulder_back: 'Hombro der. (atrás)',
  left_upper_arm_back: 'Brazo sup. izq. (atrás)',
  right_upper_arm_back: 'Brazo sup. der. (atrás)',
  left_forearm_back: 'Antebrazo izq. (atrás)',
  right_forearm_back: 'Antebrazo der. (atrás)',
  left_glute: 'Glúteo izq.',
  right_glute: 'Glúteo der.',
  left_thigh_back: 'Muslo izq. (atrás)',
  right_thigh_back: 'Muslo der. (atrás)',
  left_calf: 'Pantorrilla izq.',
  right_calf: 'Pantorrilla der.',
  left_heel: 'Talón izq.',
  right_heel: 'Talón der.',
};

// ── Pain sensation (what it feels like) ──
export const PAIN_SENSATIONS = [
  'sharp',
  'burning',
  'throbbing',
  'dull',
  'stabbing',
  'aching',
  'cramping',
  'tingling',
  'shooting',
  'pressure',
] as const;
export type PainSensation = (typeof PAIN_SENSATIONS)[number];

export const PAIN_SENSATION_LABELS: Record<PainSensation, string> = {
  sharp: 'Agudo',
  burning: 'Ardor',
  throbbing: 'Pulsante',
  dull: 'Sordo',
  stabbing: 'Punzante',
  aching: 'Dolorido',
  cramping: 'Calambres',
  tingling: 'Hormigueo',
  shooting: 'Lancinante',
  pressure: 'Presión',
};

// ── Pain intensity level (category) ──
export const PAIN_INTENSITY_LEVELS = ['mild', 'moderate', 'severe', 'very_severe'] as const;
export type PainIntensityLevel = (typeof PAIN_INTENSITY_LEVELS)[number];

export const PAIN_INTENSITY_LABELS: Record<PainIntensityLevel, string> = {
  mild: 'Leve',
  moderate: 'Moderado',
  severe: 'Severo',
  very_severe: 'Muy severo',
};

export const PAIN_INTENSITY_COLORS: Record<PainIntensityLevel, string> = {
  mild: '#22c55e',
  moderate: '#f59e0b',
  severe: '#f97316',
  very_severe: '#ef4444',
};

export const PAIN_LEVEL_RANGES: Record<PainIntensityLevel, string> = {
  mild: '1-3',
  moderate: '4-5',
  severe: '6-7',
  very_severe: '8-10',
};

// ── Pain temporality ──
export const PAIN_TEMPORALITIES = [
  'constant',
  'intermittent',
  'acute',
  'episodic',
  'progressive',
  'at_rest',
  'with_movement',
] as const;
export type PainTemporality = (typeof PAIN_TEMPORALITIES)[number];

export const PAIN_TEMPORALITY_LABELS: Record<PainTemporality, string> = {
  constant: 'Constante',
  intermittent: 'Intermitente',
  acute: 'Agudo (repentino)',
  episodic: 'Episódico',
  progressive: 'Progresivo',
  at_rest: 'En reposo',
  with_movement: 'Al movimiento',
};

// ── Mood / physical-emotional states (multi-select) ──
export const MOOD_STATES = [
  'nausea',
  'fatigue',
  'anxiety',
  'depression',
  'irritability',
  'confusion',
  'drowsiness',
  'insomnia',
  'loss_of_appetite',
  'crying',
  'frustration',
  'hopelessness',
  'dizziness',
  'brain_fog',
  'restlessness',
] as const;
export type MoodState = (typeof MOOD_STATES)[number];

export const MOOD_STATE_LABELS: Record<MoodState, string> = {
  nausea: 'Náuseas',
  fatigue: 'Fatiga',
  anxiety: 'Ansiedad',
  depression: 'Depresión',
  irritability: 'Irritabilidad',
  confusion: 'Confusión',
  drowsiness: 'Somnolencia',
  insomnia: 'Insomnio',
  loss_of_appetite: 'Falta de apetito',
  crying: 'Llanto',
  frustration: 'Frustración',
  hopelessness: 'Desesperanza',
  dizziness: 'Mareos',
  brain_fog: 'Niebla mental',
  restlessness: 'Inquietud',
};

export const MOOD_STATE_ICONS: Record<MoodState, string> = {
  nausea: '🤢',
  fatigue: '😴',
  anxiety: '😰',
  depression: '😞',
  irritability: '😤',
  confusion: '😵‍💫',
  drowsiness: '🥱',
  insomnia: '🌙',
  loss_of_appetite: '🍽️',
  crying: '😢',
  frustration: '😣',
  hopelessness: '💔',
  dizziness: '🌀',
  brain_fog: '🌫️',
  restlessness: '⚡',
};

// ── Legacy: keep PAIN_TYPES for backward compatibility ──
export const PAIN_TYPES = PAIN_SENSATIONS;
export type PainType = PainSensation;
export const PAIN_TYPE_LABELS = PAIN_SENSATION_LABELS;

// ── Common symptoms ──
export const SYMPTOMS = [
  'fatigue',
  'nausea',
  'stiffness',
  'insomnia',
  'anxiety',
  'dizziness',
  'numbness',
  'swelling',
  'weakness',
  'brain_fog',
] as const;
export type Symptom = (typeof SYMPTOMS)[number];

export const SYMPTOM_LABELS: Record<Symptom, string> = {
  fatigue: 'Fatiga',
  nausea: 'Náuseas',
  stiffness: 'Rigidez',
  insomnia: 'Insomnio',
  anxiety: 'Ansiedad',
  dizziness: 'Mareos',
  numbness: 'Entumecimiento',
  swelling: 'Hinchazón',
  weakness: 'Debilidad',
  brain_fog: 'Niebla mental',
};

// ── Notification levels ──
export const NOTIFICATION_LEVELS = ['low', 'medium', 'high'] as const;
export type NotificationLevel = (typeof NOTIFICATION_LEVELS)[number];

export const NOTIFICATION_SCHEDULES: Record<NotificationLevel, string[]> = {
  low: ['09:00', '20:00'],
  medium: ['08:00', '12:00', '17:00', '21:00'],
  high: ['07:00', '10:00', '13:00', '16:00', '19:00', '22:00'],
};

// ── Question categories ──
export const QUESTION_CATEGORIES = ['pain', 'mood', 'activity', 'sleep'] as const;
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

// ── QoL weights ──
export const QOL_WEIGHTS = {
  pain: 0.4,
  mood: 0.25,
  activity: 0.2,
  sleep: 0.15,
} as const;

// ── Scales ──
export const PAIN_SCALE = { min: 0, max: 10 } as const;
export const MOOD_SCALE = { min: 1, max: 5 } as const;
export const SEVERITY_SCALE = { min: 1, max: 5 } as const;
