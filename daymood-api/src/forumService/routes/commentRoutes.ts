import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import {verifyToken} from "../../middlewares/auth.middleware";

const router = Router();

// POST /api/comments -> Crear comentario
router.post('/', verifyToken, commentController.createComment);

// DELETE /api/comments/:id -> Eliminar comentario (Solo autor)
router.delete('/:id', verifyToken, commentController.deleteComment);

export default router;