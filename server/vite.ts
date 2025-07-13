import { Express } from 'express';
import { createServer } from 'vite';

export async function setupVite(app: Express) {
  if (process.env.NODE_ENV === 'development') {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: 'client',
    });
    app.use(vite.middlewares);
  }
}