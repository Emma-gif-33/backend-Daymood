import { Request, Response, NextFunction } from 'express';
import * as forumService from '../services/forumService';

export const getAvailable = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        const user = (req as any).user;

        if (!req.user || req.user.age === undefined) {
            console.error("ERROR: El middleware no inyectó la edad. req.user es:", req.user);
            return res.status(401).json({ message: "No se pudo determinar la edad del usuario" });
        }

        const forums = await forumService.getForumsByCategory(Number(categoryId), user.age);
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