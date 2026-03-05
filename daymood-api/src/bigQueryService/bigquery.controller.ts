import { Request, Response } from 'express';
import { dailyCutoff } from './bigquery.service';

export const dailyCutoffController = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await dailyCutoff();
        res.status(200).json({
            success: true,
            message: `Corte del día ejecutado correctamente. ${result.rowsSent} filas enviadas a BigQuery.`,
            data: {
                rowsSent: result.rowsSent,
                csvFile: result.csvFile,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error: any) {
        console.error('Error en corte del día:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al ejecutar el corte del día',
            data: null
        });
    }
};

export const testBigQuery = dailyCutoffController;