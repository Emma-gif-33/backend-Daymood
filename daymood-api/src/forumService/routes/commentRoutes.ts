import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import {verifyToken} from "../../middlewares/auth.middleware";
import { validate } from '../../middlewares/validate.middleware';
import {createCommentSchema} from '../../schemas/record.schemas'

const router = Router();

// POST /api/comments -> Crear comentario
router.post('/', verifyToken, validate(createCommentSchema),commentController.createComment);

// DELETE /api/comments/:id -> Eliminar comentario (Solo autor)
router.delete('/:id', verifyToken, commentController.deleteComment);

export default router;