import { Request, Response, NextFunction } from 'express';

export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key requerida'
        });
    }

    if (apiKey !== process.env.BIGQUERY_API_KEY) {
        return res.status(403).json({
            success: false,
            message: 'API key inválida'
        });
    }

    next();
};