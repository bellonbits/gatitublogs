import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const isRemote = !!process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper for consistency in queries
const db = {
  execute: async (options: { sql: string; args?: any[] } | string) => {
    const sql = typeof options === 'string' ? options : options.sql;
    const args = typeof options === 'string' ? [] : options.args || [];

    // Replace ? with $1, $2, etc. for PostgreSQL
    let count = 1;
    const pgSql = sql.replace(/\?/g, () => `$${count++}`);

    const result = await pool.query(pgSql, args);
    return {
      rows: result.rows,
      lastInsertRowid: (result.rows[0] as any)?.id // PostgreSQL doesn't have lastInsertRowid like SQLite
    };
  }
};

export const initDb = async () => {
  if (!isRemote) return; // Only init if remote for now, or we'd need local postgres

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      cover_image TEXT,
      category TEXT NOT NULL,
      tags TEXT,
      published BOOLEAN DEFAULT FALSE,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );
  `);
};

export default db;
