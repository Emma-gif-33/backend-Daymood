"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'App Error';
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
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
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middlewares.js.map