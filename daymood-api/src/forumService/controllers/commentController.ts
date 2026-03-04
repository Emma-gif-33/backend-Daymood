import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';

export const createComment = async (req: any, res: Response, next: NextFunction) => {
    try {
        const newComment = await commentService.createComment({
            ...req.body,
            id_user: req.user.id
        });
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await commentService.deleteComment(id, req.user.id);
        res.json({ message: "Comentario eliminado con éxito" });
    } catch (error) {
        next(error);
    }
};