import * as recordService from '../services/record.services'
import { Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const record = await recordService.createRecord(req.user!.uid, req.body)
        res.status(201).json({ success: true, data: record })
    } catch (error: any) {
        // Errores de validación de negocio van como 400
        const businessErrors = [
            'La fecha es obligatoria',
            'La emoción es obligatoria',
            'Debes seleccionar al menos un hábito',
            'No puedes registrar una fecha futura',
            'Ya tienes un registro para esta fecha',
            'Emoción no encontrada',
            'Usuario no encontrado en la BD'
        ]
        if (businessErrors.some(e => error.message?.includes(e))) {
            return res.status(400).json({ success: false, message: error.message })
        }
        next(error)
    }
}

export const getByMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const year = parseInt(req.query.year as string)
        const month = parseInt(req.query.month as string)
        const records = await recordService.getRecordsByMonth(req.user!.uid, year, month)
        res.json({ success: true, data: records })
    } catch (error: any) {
        if (error.message?.includes('obligatori') || error.message?.includes('inválido')) {
            return res.status(400).json({ success: false, message: error.message })
        }
        next(error)
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
        if (error.message?.includes('obligatori') || error.message?.includes('inválid')) {
            return res.status(400).json({ success: false, message: error.message })
        }
        next(error)
    }
}