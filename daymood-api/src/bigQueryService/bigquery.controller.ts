import { Request, Response } from 'express';
import { insertSnapshot } from './bigquery.service';

export const testBigQuery = async (req: Request, res: Response): Promise<void> => {
    try {
        await insertSnapshot();
        res.status(200).json({
            success: true,
            message: 'Snapshot enviado a BigQuery correctamente',
            data: null
        });
    } catch (error: any) {
        console.error('BigQuery error:', error?.message);
        res.status(500).json({
            success: false,
            message: error?.message || 'Error al enviar snapshot a BigQuery',
            data: null
        });
    }
};