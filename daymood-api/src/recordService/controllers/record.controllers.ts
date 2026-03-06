import * as recordService from '../services/record.services'
import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'

export const getHabits = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const habits = await recordService.getHabitsByCategory()
        res.json({ success: true, data: habits })
    } catch (error) {
        next(error)
    }
}

const handleError = (error: any, res: Response) => {
    const businessErrors = [
        'La fecha es obligatoria',
        'La emoción es obligatoria',
        'Debes seleccionar al menos un hábito',
        'No puedes registrar una fecha futura',
        'Ya tienes un registro para esta fecha',
        'Emoción no encontrada',
        'Usuario no encontrado en la BD',
        'No puedes seleccionar dos hábitos de la misma categoría',
        'Hábito no encontrado',
        'obligatori',
        'inválid',
        'Fecha'
    ]

    if (businessErrors.some(e => error.message?.includes(e))) {
        return res.status(400).json({ success: false, message: error.message })
    }

    // Error de servidor
    console.error('Error interno:', error)
    return res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor. Intenta de nuevo más tarde.' 
    })
}

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const record = await recordService.createRecord(req.user!.uid, req.body)
        res.status(201).json({ success: true, data: record })
    } catch (error: any) {
        handleError(error, res)
    }
}

export const getByMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year as string)
        const month = parseInt(req.query.month as string)

        if (isNaN(year) || isNaN(month)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Año y mes deben ser números válidos' 
            })
        }

        const records = await recordService.getRecordsByMonth(req.user!.uid, year, month)
        res.json({ success: true, data: records })
    } catch (error: any) {
        handleError(error, res)
    }
}

export const getByDate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const date = req.query.date as string
        const record = await recordService.getRecordByDate(req.user!.uid, date)

        if (!record) {
            return res.json({ 
                success: true, 
                data: null, 
                message: 'No se ha registrado nada para este día' 
            })
        }

        res.json({ success: true, data: record })
    } catch (error: any) {
        handleError(error, res)
    }
}

// devuelve fecha + imagen de emoción para el calendario
export const getMonthPreview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year as string)
        const month = parseInt(req.query.month as string)

        if (isNaN(year) || isNaN(month)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Año y mes deben ser números válidos' 
            })
        }

        const preview = await recordService.getMonthPreview(req.user!.uid, year, month)
        res.json({ success: true, data: preview })
    } catch (error: any) {
        handleError(error, res)
    }
}


