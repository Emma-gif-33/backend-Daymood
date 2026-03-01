import { Router } from 'express';
import * as postController from '../controllers/postController';

const router = Router();

// POST /api/posts
router.post('/', postController.createNewPost);

// GET /api/posts/:id -> Obtener un post específico
router.get('/:id', postController.getById);

// PATCH /api/posts/:id
router.patch('/:id', postController.update);

// DELETE /api/posts/:id
router.delete('/:id', postController.deletePost);

export default router;