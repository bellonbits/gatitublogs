import { Request, Response } from 'express';
import db from '../db';
import slugify from 'slugify';

export const getPosts = async (req: Request, res: Response) => {
  const { category, tag } = req.query;
  let sql = 'SELECT * FROM posts WHERE published = TRUE';
  const args: any[] = [];

  if (category) {
    sql += ' AND category = ?';
    args.push(category);
  }

  if (tag) {
    sql += ' AND tags LIKE ?';
    args.push(`%${tag}%`);
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const result = await db.execute({ sql, args });
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM posts WHERE slug = ?',
      args: [slug]
    });

    const post = result.rows[0];

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    await db.execute({
      sql: 'UPDATE posts SET views = views + 1 WHERE slug = ?',
      args: [slug]
    });

    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, excerpt, cover_image, category, tags, published } = req.body;
  const slug = slugify(title, { lower: true, strict: true });

  try {
    const result = await db.execute({
      sql: 'INSERT INTO posts (title, slug, content, excerpt, cover_image, category, tags, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [title, slug, content, excerpt, cover_image, category, tags, !!published]
    });

    res.status(201).json({ id: (result.rows[0] as any)?.id, slug });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE')) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, excerpt, cover_image, category, tags, published } = req.body;

  try {
    await db.execute({
      sql: 'UPDATE posts SET title = ?, content = ?, excerpt = ?, cover_image = ?, category = ?, tags = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [title, content, excerpt, cover_image, category, tags, !!published, id]
    });

    res.json({ message: 'Post updated' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.execute({
      sql: 'DELETE FROM posts WHERE id = ?',
      args: [id]
    });
    res.json({ message: 'Post deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

export const getAllPostsAdmin = async (req: Request, res: Response) => {
  try {
    const result = await db.execute('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch admin posts', error: error.message });
  }
};
