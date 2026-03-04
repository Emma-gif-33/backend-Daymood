import * as emotionService from '../services/emotion.services'
import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'

// categoriass
const EMOTION_CATEGORIES = [8, 9, 10, 11, 12, 13, 14, 15]
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif']

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const emotions = await emotionService.emotionList(req.user!.uid)
        res.json({ success: true, data: emotions })
    } catch (error) {
        next(error)
    }
}

export const explore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const emotions = await emotionService.getExploreEmotions(req.user!.uid)
        res.json({ success: true, data: emotions })
    } catch (error) {
        next(error)
    }
}

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, id_category, save_to_favorites } = req.body

        // Validar campos obligatorios
        if (!name || !id_category) {
            return res.status(400).json({ 
                success: false, 
                message: 'El nombre y la categoría son obligatorios' 
            })
        }

        // Validar que haya imagen
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'La imagen es obligatoria' 
            })
        }

        // Validar formato de imagen
        if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Formato de imagen no válido. Solo se permiten: JPG, PNG, WEBP, GIF' 
            })
        }

        // Validar longitud del nombre
        if (name.trim().length < 2) {
            return res.status(400).json({ 
                success: false, 
                message: 'El nombre debe tener al menos 2 caracteres' 
            })
        }
        if (name.trim().length > 30) {
            return res.status(400).json({ 
                success: false, 
                message: 'El nombre no puede tener más de 30 caracteres' 
            })
        }

        // Validar que la categoría sea de emociones (8-15)
        const categoryId = parseInt(id_category)
        if (isNaN(categoryId) || !EMOTION_CATEGORIES.includes(categoryId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'La categoría debe ser una categoría de emoción válida (Alegría, Tristeza, Ira, Miedo, Amor, Desagrado, Vergüenza o Culpa)' 
            })
        }

        const emotion = await emotionService.createEmotion(req.body, req.user!.uid, req.file)
        res.status(201).json({ success: true, data: emotion })

    } catch (error) {
        next(error)
    }
}

export const deleteEmotion = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID de emoción requerido' })
        }

        await emotionService.deleteEmotion(id, req.user!.uid)
        res.json({ success: true, message: 'Emoción eliminada' })

    } catch (error: any) {
        if (error.message === 'Emoción no encontrada') {
            return res.status(404).json({ success: false, message: error.message })
        }
        if (error.message === 'No tienes permiso para eliminar esta emoción') {
            return res.status(403).json({ success: false, message: error.message })
        }
        next(error)
    }
}

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
        const id = (req.params.id as string)?.trim();

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID de emoción requerido' })
        }

        await emotionService.addFavorite(req.user!.uid, id)
        res.status(201).json({ success: true, message: 'Agregado a favoritos' })

    } catch (error: any) {
        if (error.message === 'Emoción no encontrada') {
            return res.status(404).json({ success: false, message: error.message })
        }
        next(error)
    }
}

export const removeFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = (req.params.id as string)?.trim();

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID de emoción requerido' })
        }

        await emotionService.removeFavorite(req.user!.uid, id)
        res.json({ success: true, message: 'Eliminado de favoritos' })

    } catch (error: any) {
        if (error.code === 'P2025') { // Código Prisma de "record not found"
            return res.status(404).json({ 
                success: false, 
                message: 'Este favorito no existe o ya fue eliminado' 
            })
        }
        next(error)
    }
}