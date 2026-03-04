import { Router } from 'express';
import * as postController from '../controllers/postController';
import {verifyToken} from "../../middlewares/auth.middleware";

const router = Router();

// POST /api/posts
router.post('/', verifyToken, postController.createNewPost);

// GET /api/posts/:id -> Obtener un post específico
router.get('/:id', verifyToken,postController.getById);

// PATCH /api/posts/:id
router.patch('/:id', verifyToken,postController.update);

// DELETE /api/posts/:id
router.delete('/:id', verifyToken,postController.deletePost);

export default router;