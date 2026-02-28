import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { authRouter } from './routes/auth.js';
import { painRouter } from './routes/pain.js';
import { symptomsRouter } from './routes/symptoms.js';
import { questionsRouter } from './routes/questions.js';
import { analyticsRouter } from './routes/analytics.js';
import { onboardingRouter } from './routes/onboarding.js';
import { settingsRouter } from './routes/settings.js';
import { pushRouter } from './routes/push.js';
import { startNotificationCron } from './services/notificationCron.js';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ── Routes ──
app.use('/api/auth', authRouter);
app.use('/api/pain', painRouter);
app.use('/api/symptoms', symptomsRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/push', pushRouter);

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🩺 Zophiel API running on http://localhost:${PORT}`);
  startNotificationCron();
});
