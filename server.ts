import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import serverless from 'serverless-http';
import authRoutes from './server/routes/authRoutes.ts';
import postRoutes from './server/routes/postRoutes.ts';
import uploadRoutes from './server/routes/uploadRoutes.ts';
import db, { initDb } from './server/db.ts';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// Static serving for local production testing
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    }
  });
}

const startServer = async () => {
  await initDb();

  // Seed Admin
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: ['admin']
    });

    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.execute({
        sql: 'INSERT INTO users (username, password) VALUES (?, ?)',
        args: ['admin', hashedPassword]
      });
      console.log('Admin user created: admin / admin123');
    }
  } catch (err) {
    console.error('Failed to seed admin:', err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Development server running on http://localhost:${PORT}`);
    });
  }
};

startServer();

export const handler = serverless(app);
export default app;
