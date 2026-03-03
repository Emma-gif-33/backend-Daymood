import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import { prisma } from "../../prisma/prisma.client"; // Ajusta esta ruta a tu proyecto

export interface AuthRequest extends Request {
  user?: any; // Usamos any para que acepte tanto los campos de DB como los de Firebase
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Validamos con Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. Buscamos en la DB (Tu lógica necesaria para Foros)
    const dbUser = await prisma.users.findUnique({
      where: { firebase_uid: decodedToken.uid }
    });

    if (!dbUser) {
      return res.status(404).json({ success: false, message: "Usuario no registrado en la base de datos" });
    }

    // 3. Calculamos la edad (Tu lógica)
    const today = new Date();
    const birthDate = new Date(dbUser.birth_day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // 4. EL MERGE: Combinamos los datos de Firebase (decodedToken) con los de la DB + la edad
    req.user = { 
        ...decodedToken, // Trae email, uid, etc. (Lo que ella ocupa)
        ...dbUser,       // Trae id de DB, username, etc. (Lo que tú ocupas)
        age              // Tu campo especial
    };

    next();
  } catch (error: any) {
    console.error('❌ ERROR VERIFICANDO TOKEN:', error.message);
    const message = error.code === 'auth/id-token-expired' ? 'El token expiró' : 'Token inválido';
    return res.status(401).json({ success: false, message });
  }
};