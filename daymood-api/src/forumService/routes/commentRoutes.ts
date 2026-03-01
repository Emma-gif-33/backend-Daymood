import { Router } from 'express';
import * as commentController from '../controllers/commentController';

const router = Router();

// POST /api/comments -> Crear comentario
router.post('/', commentController.createComment);

// DELETE /api/comments/:id -> Eliminar comentario (Solo autor)
router.delete('/:id', commentController.deleteComment);

export default router;