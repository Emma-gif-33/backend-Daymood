import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService';

export const createNewPost = async (req: any, res: Response, next: NextFunction) => {
    try {
        const newPost = await postService.createPost({
            ...req.body,
            id_user: req.user.id
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