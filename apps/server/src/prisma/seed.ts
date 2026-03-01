import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_QUESTIONS = [
  // ── Dolor ──
  {
    text: '¿Cuál es tu nivel de dolor ahora? (0 = sin dolor, 10 = insoportable)',
    category: 'pain',
    frequency: 'daily',
    scaleMin: 0,
    scaleMax: 10,
  },
  {
    text: '¿Sentís rigidez al levantarte? (0 = nada, 10 = no me puedo mover)',
    category: 'pain',
    frequency: 'morning',
    scaleMin: 0,
    scaleMax: 10,
  },

  // ── Ánimo ──
  {
    text: '¿Cómo te sentís emocionalmente hoy? (0 = muy mal, 10 = excelente)',
    category: 'mood',
    frequency: 'daily',
    scaleMin: 0,
    scaleMax: 10,
  },
  {
    text: '¿El dolor afectó tu concentración? (0 = para nada, 10 = no me pude concentrar)',
    category: 'mood',
    frequency: 'afternoon',
    scaleMin: 0,
    scaleMax: 10,
  },

  // ── Sueño ──
  {
    text: '¿Cómo sentiste que dormiste anoche? (0 = pésimo, 10 = dormí perfecto)',
    category: 'sleep',
    frequency: 'morning',
    scaleMin: 0,
    scaleMax: 10,
  },
  {
    text: '¿Pudiste descansar durante el día? (0 = nada, 10 = descansé muy bien)',
    category: 'sleep',
    frequency: 'evening',
    scaleMin: 0,
    scaleMax: 10,
  },

  // ── Actividad ──
  {
    text: '¿Cuánta actividad física hiciste hoy? (0 = nada, 10 = muy activo/a)',
    category: 'activity',
    frequency: 'evening',
    scaleMin: 0,
    scaleMax: 10,
  },
  {
    text: '¿El dolor te impidió hacer actividades? (0 = para nada, 10 = no pude hacer nada)',
    category: 'activity',
    frequency: 'evening',
    scaleMin: 0,
    scaleMax: 10,
  },
];

async function seed() {
  console.log('🌱 Seeding questions...');

  // Upsert: delete existing and recreate
  await prisma.questionResponse.deleteMany({});
  await prisma.question.deleteMany({});

  for (const q of SEED_QUESTIONS) {
    await prisma.question.create({
      data: {
        text: q.text,
        category: q.category,
        frequency: q.frequency,
        scaleMin: q.scaleMin,
        scaleMax: q.scaleMax,
        active: true,
      },
    });
  }

  console.log(`✅ Seeded ${SEED_QUESTIONS.length} questions`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
