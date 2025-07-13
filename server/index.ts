import express from 'express';
import { registerRoutes } from './routes';
import { setupVite } from './vite';

const app = express();
app.use(express.json());

// API routes
registerRoutes(app);

// Vite middleware for development
if (process.env.NODE_ENV === 'development') {
  setupVite(app);
} else {
  // In production, Vercel handles serving static files.
  // We might need a placeholder for the root route.
  app.get('/', (req, res) => {
    res.send('Server is running.');
  });
}

export default app;
