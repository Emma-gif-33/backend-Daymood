import { Request, Response, NextFunction } from 'express';
import { insertTestRow } from './bigquery.service';
export const testBigQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await insertTestRow();

    res.status(200).json({
      success: true,
      message: 'Insertado en BigQuery',
      data: null
    });
        } catch (error: any) {
        console.error('BigQuery FULL Error:', error);
        console.error('Error message:', error?.message);
        console.error('Error details:', error?.errors);

        res.status(500).json({
            success: false,
            message: error?.message || 'Error al insertar en BigQuery',
            data: null
        });
    }
};