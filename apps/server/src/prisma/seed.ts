import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_QUESTIONS = [
  { text: '¿Cuál es tu nivel de dolor en este momento?', category: 'pain', frequency: 'daily', scaleMin: 0, scaleMax: 10 },
  { text: '¿Cómo describirías tu estado de ánimo hoy?', category: 'mood', frequency: 'daily', scaleMin: 0, scaleMax: 10 },
  { text: '¿Cuánta actividad física realizaste hoy?', category: 'activity', frequency: 'evening', scaleMin: 0, scaleMax: 10 },
  { text: '¿Cómo fue la calidad de tu sueño anoche?', category: 'sleep', frequency: 'morning', scaleMin: 0, scaleMax: 10 },
  { text: '¿El dolor te impidió realizar actividades cotidianas?', category: 'activity', frequency: 'evening', scaleMin: 0, scaleMax: 10 },
  { text: '¿Sentís rigidez al levantarte?', category: 'pain', frequency: 'morning', scaleMin: 0, scaleMax: 10 },
  { text: '¿El dolor afectó tu concentración hoy?', category: 'mood', frequency: 'afternoon', scaleMin: 0, scaleMax: 10 },
  { text: '¿Pudiste descansar adecuadamente durante el día?', category: 'sleep', frequency: 'evening', scaleMin: 0, scaleMax: 10 },
];

async function seed() {
  console.log('🌱 Seeding questions...');

  // Delete existing questions to avoid duplicates
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
