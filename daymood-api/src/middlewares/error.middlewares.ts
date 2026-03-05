import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode;
        this.name = 'App Error';
    }
}

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', error.message);

    //errores controlados
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    //prisma
    if (error.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Registro no encontrado'
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
}