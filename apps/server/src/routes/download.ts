import { Router, Request, Response } from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';

const APK_PATH = '/tmp/zophiel.apk';
const GITHUB_RELEASE_URL = 'https://github.com/MarcoAR1/zophiel/releases/latest/download/app-debug.apk';

export const downloadRouter = Router();

/**
 * Downloads the APK from GitHub Releases and saves to /tmp/
 * Follows redirects (GitHub → CDN).
 */
function downloadFromRelease(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('[APK] Downloading from GitHub Release...');

    const follow = (url: string, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));

      const client = url.startsWith('https') ? https : http;
      client.get(url, { headers: { 'User-Agent': 'ZophielServer/1.0' } }, (resp) => {
        // Follow redirects
        if (resp.statusCode && resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location) {
          return follow(resp.headers.location, redirects + 1);
        }

        if (resp.statusCode !== 200) {
          return reject(new Error(`HTTP ${resp.statusCode}`));
        }

        const file = fs.createWriteStream(APK_PATH);
        resp.pipe(file);
        file.on('finish', () => {
          file.close();
          const size = fs.statSync(APK_PATH).size;
          console.log(`[APK] Downloaded ${(size / 1024 / 1024).toFixed(1)} MB`);
          resolve();
        });
        file.on('error', reject);
      }).on('error', reject);
    };

    follow(GITHUB_RELEASE_URL);
  });
}

/**
 * POST /api/download/apk — Upload APK (from CI)
 * Still supported as a fallback.
 */
downloadRouter.post('/apk', (req: Request, res: Response) => {
  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(APK_PATH, buffer);
    console.log(`[APK] Uploaded ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);
    res.json({ success: true, size: buffer.length });
  });
  req.on('error', (err) => {
    console.error('[APK] Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  });
});

/**
 * GET /api/download/apk — Download APK (public)
 * Always fetches the latest from GitHub Release to avoid stale cache.
 */
downloadRouter.get('/apk', async (_req: Request, res: Response) => {
  // Always re-fetch from GitHub Release to get the latest APK
  try {
    await downloadFromRelease();
  } catch (err: any) {
    // If download fails but we have a cached copy, use it
    if (!fs.existsSync(APK_PATH)) {
      console.error('[APK] Failed to fetch from release:', err.message);
      res.status(503).json({
        error: 'APK no disponible. Intentá de nuevo en unos minutos.',
      });
      return;
    }
    console.warn('[APK] Using cached APK (GitHub fetch failed:', err.message, ')');
  }

  const stat = fs.statSync(APK_PATH);
  const etag = `"apk-${stat.mtimeMs}"`;
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="zophiel.apk"');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('ETag', etag);

  const stream = fs.createReadStream(APK_PATH);
  stream.pipe(res);
});
