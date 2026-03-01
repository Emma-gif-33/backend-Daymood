import { Request, Response, NextFunction } from 'express';
import * as forumService from '../services/forumService';

export const getAvailable = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        // La edad ses upone que vanga del middleware
        const forums = await forumService.getForumsByCategory(Number(categoryId), req.user.age);
        res.json(forums);
    } catch (error) {
        next(error);
    }
};

export const getDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(404).json({ message: "ID inválido, intente con uno existente." });
        }
        const forum = await forumService.getFullForumContent(id);
        res.json(forum);
    } catch (error) {
        next(error);
    }
};