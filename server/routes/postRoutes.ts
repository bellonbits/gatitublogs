import express from 'express';
import { 
  getPosts, 
  getPostBySlug, 
  createPost, 
  updatePost, 
  deletePost,
  getAllPostsAdmin 
} from '../controllers/postController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public Routes
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Admin Routes
router.get('/admin/all', authMiddleware, getAllPostsAdmin);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
