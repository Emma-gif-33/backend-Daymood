import { Request, Response, NextFunction } from 'express';

const SENSITIVE_FIELDS = ['password', 'contrasena', 'token', 'secret', 'authorization', 'credit_card'];

function sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    for (const key of Object.keys(sanitized)) {
        if (SENSITIVE_FIELDS.some(f => key.toLowerCase().includes(f))) {
            sanitized[key] = '[REDACTED]';
        }
    }
    return sanitized;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const sanitizedBody = sanitizeBody(req.body);
    console.log(`${req.method} ${req.path}`,
        Object.keys(sanitizedBody).length > 0 ? `Body: ${JSON.stringify(sanitizedBody)}` : ''
    );
    next();
};