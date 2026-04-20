import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production' || error.statusCode >= 500) {
        console.error('Error:', error.message);
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    // Errores de validación de Zod
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Datos de entrada inválidos',
            errors: error.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    // Prisma - registro no encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Registro no encontrado'
        });
    }

    // Prisma - violación de restricción única
    if (error.code === 'P2002') {
        return res.status(409).json({
            success: false,
            message: 'Ya existe un registro con esos datos'
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
};