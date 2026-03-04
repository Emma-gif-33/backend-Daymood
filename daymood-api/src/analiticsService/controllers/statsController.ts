import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as statsService from '../services/statsServices';

export const getMyWeeklyStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;

        const stats = await statsService.getWeeklyStats(userId);

        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        console.error('Error interno (controller)', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las estadísticas semanales.'
        });
    }
};