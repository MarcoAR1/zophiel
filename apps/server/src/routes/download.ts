import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const APK_PATH = '/tmp/zophiel.apk';

export const downloadRouter = Router();

/**
 * POST /api/download/apk — Upload APK (CI only, protected by secret)
 * Called by GitHub Actions after building the APK.
 */
downloadRouter.post('/apk', (req: Request, res: Response) => {
  const secret = req.headers['x-upload-secret'];
  if (!secret || secret !== process.env.APK_UPLOAD_SECRET) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(APK_PATH, buffer);
    console.log(`[APK] Saved ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);
    res.json({ success: true, size: buffer.length });
  });
  req.on('error', (err) => {
    console.error('[APK] Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  });
});

/**
 * GET /api/download/apk — Download APK (public)
 */
downloadRouter.get('/apk', (_req: Request, res: Response) => {
  if (!fs.existsSync(APK_PATH)) {
    res.status(404).json({ error: 'APK not available yet. Build in progress.' });
    return;
  }

  const stat = fs.statSync(APK_PATH);
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="zophiel.apk"');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const stream = fs.createReadStream(APK_PATH);
  stream.pipe(res);
});
