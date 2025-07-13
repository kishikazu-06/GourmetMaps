import express from "express";
import { createServer } from "vite";
import { registerRoutes } from "./routes";
import http from "http";

async function startServer() {
  const app = express();
  app.use(express.json());

  // API routes
  registerRoutes(app);

  if (process.env.NODE_ENV === "development") {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: "client",
    });
    app.use(vite.middlewares);
  } else {
    // Vercel will serve static files automatically
  }

  const server = http.createServer(app);
  const port = process.env.PORT || 5000;

  if (process.env.NODE_ENV === "development") {
    server.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  }

  return app;
}

const app = startServer();

export default app;