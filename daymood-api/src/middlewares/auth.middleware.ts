import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import {prisma} from "../../prisma/prisma.client";

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    /*
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Buscamos en la DB usando firebase_uid
        const dbUser = await prisma.users.findUnique({
            where: { firebase_uid: decodedToken.uid }
        });

        if (!dbUser) {
            return res.status(404).json({ message: "Usuario no encontrado en DB" });
        }

        const today = new Date();
        const birthDate = new Date(dbUser.birth_day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
     */
    req.user = {
        id: "7c3d8119-16d2-44c1-807f-77f981b3a11e",
        age: 22, // Asegúrate de que coincida con el rango del foro de tu SEED
        firebase_uid: "firebase_uid_test_1"
    };
        next();
        /*
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
         */
};