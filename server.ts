import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import authRoutes from './server/routes/authRoutes';
import postRoutes from './server/routes/postRoutes';
import uploadRoutes from './server/routes/uploadRoutes';
import db, { initDb } from './server/db';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// Diagnostics / Health Check
app.get('/api/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      env: {
        node: process.version,
        vercel: !!process.env.VERCEL
      }
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

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
  try {
    console.log('Initializing database...');
    await initDb();

    // Seed Admin
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
      console.log('Admin user created successfully');
    }
  } catch (err) {
    console.error('Critical Startup Error:', err);
    // Don't swallow error in local dev
    if (process.env.NODE_ENV !== 'production') throw err;
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

startServer().catch(err => console.error('Initialization failed:', err));

export default app;
