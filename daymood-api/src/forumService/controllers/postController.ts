import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService';

// postController.ts
export const createNewPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        if (!user || !user.id) {
            console.error("DEBUG: req.user no llegó al postController");
            return res.status(401).json({ message: "Usuario no identificado" });
        }
        const { title, content, id_category, id_forum } = req.body;
        const newPost = await postService.createPost({
            title,
            content,
            id_category,
            id_forum,
            id_user: user.id // Aquí es donde tronaba
        });

        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(404).json({ message: "ID inválido, intente con uno existente." });
        }
        const post = await postService.getPostById(id);
        res.json(post);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updatedPost = await postService.updatePost(id, req.user.id, req.body);
        res.json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await postService.deletePost(id, req.user.id);
        res.json({ message: "La publicación se ha eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};