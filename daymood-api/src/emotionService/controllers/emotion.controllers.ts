import * as emotionService from '../services/emotion.services'
import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'

// GET /emotions — predeterminadas + personalizadas del usuario
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const emotions = await emotionService.emotionList(req.user!.uid)
        res.json({ success: true, data: emotions })
    } catch (error) {
        next(error)
    }
}

// GET /emotions/explore — personalizadas de otros usuarios
export const explore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const emotions = await emotionService.getExploreEmotions(req.user!.uid)
        res.json({ success: true, data: emotions })
    } catch (error) {
        next(error)
    }
}

// POST /emotions — crear emoción personalizada con imagen
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // req.file viene de multer (middleware en la ruta)
        const emotion = await emotionService.createEmotion(req.body, req.user!.uid, req.file)
        res.status(201).json({ success: true, data: emotion })
    } catch (error) {
        next(error)
    }
}

// DELETE /emotions/:id — eliminar emoción propia
export const deleteEmotion = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        await emotionService.deleteEmotion(id, req.user!.uid)
        res.json({ success: true, message: 'Emoción eliminada' })
    } catch (error) {
        next(error)
    }
}

// GET /emotions/favorites — listar mis favoritos
export const getFavorites = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const favorites = await emotionService.getFavorites(req.user!.uid)
        res.json({ success: true, data: favorites })
    } catch (error) {
        next(error)
    }
}

export const addFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string

        await emotionService.addFavorite(req.user!.uid, id)

        res.status(201).json({ success: true, message: 'Agregado a favoritos' })
    } catch (error) {
        next(error)
    }
}

export const removeFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string

        await emotionService.removeFavorite(req.user!.uid, id)

        res.json({ success: true, message: 'Eliminado de favoritos' })
    } catch (error) {
        next(error)
    }
}