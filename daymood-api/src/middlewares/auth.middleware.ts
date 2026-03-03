import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import {prisma} from "../../prisma/prisma.client";

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const dbUser = await prisma.users.findUnique({
            where: { firebase_uid: decodedToken.uid }
        });

        if (!dbUser) {
            return res.status(404).json({ message: "Usuario no registrado en la base de datos" });
        }
        const today = new Date();
        const birthDate = new Date(dbUser.birth_day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        req.user = { ...dbUser, age };
        next();
    } catch (error: any) {
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: "El token ya expiró, genera uno nuevo" });
        }
        return res.status(401).json({ message: "Token inválido", detail: error.message });
    }
};