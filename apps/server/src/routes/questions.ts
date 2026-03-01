import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { createQuestionResponseSchema } from '@zophiel/shared';

export const questionsRouter = Router();
questionsRouter.use(authMiddleware);

// GET /api/questions/pending — questions for the current time of day
questionsRouter.get('/pending', async (req: AuthRequest, res) => {
  try {
    const hour = new Date().getHours();
    let timeOfDay: string;
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 18) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    const questions = await prisma.question.findMany({
      where: {
        active: true,
        OR: [{ frequency: 'daily' }, { frequency: timeOfDay }],
      },
    });

    // Filter out already-answered questions today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const answered = await prisma.questionResponse.findMany({
      where: {
        userId: req.userId,
        timestamp: { gte: todayStart },
      },
      select: { questionId: true },
    });

    const answeredIds = new Set(answered.map((a) => a.questionId));
    const pending = questions.filter((q) => !answeredIds.has(q.id));

    res.json({ success: true, data: pending });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/questions/:id/respond
questionsRouter.post('/:id/respond', async (req: AuthRequest, res) => {
  try {
    const data = createQuestionResponseSchema.parse(req.body);
    const question = await prisma.question.findUnique({ where: { id: req.params.id as string } });
    if (!question) {
      res.status(404).json({ success: false, error: 'Pregunta no encontrada' });
      return;
    }

    const response = await prisma.questionResponse.create({
      data: {
        userId: req.userId!,
        questionId: req.params.id as string,
        value: data.value,
      },
    });

    res.status(201).json({ success: true, data: response });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/questions/history
questionsRouter.get('/history', async (req: AuthRequest, res) => {
  try {
    const { days = '30' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const responses = await prisma.questionResponse.findMany({
      where: { userId: req.userId, timestamp: { gte: since } },
      include: { question: true },
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    res.json({ success: true, data: responses });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
