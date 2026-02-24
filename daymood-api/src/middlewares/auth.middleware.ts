import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // { uid, email, ... }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};