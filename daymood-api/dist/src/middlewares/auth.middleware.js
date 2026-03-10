"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const prisma_client_1 = require("../../prisma/prisma.client");
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await firebase_1.default.auth().verifyIdToken(token);
        const dbUser = await prisma_client_1.prisma.users.findUnique({
            where: { firebase_uid: decodedToken.uid }
        });
        if (!dbUser) {
            return res.status(404).json({ success: false, message: "Usuario no registrado en la base de datos" });
        }
        const today = new Date();
        const birthDate = new Date(dbUser.birth_day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        req.user = {
            ...decodedToken,
            ...dbUser,
            age
        };
        next();
    }
    catch (error) {
        console.error('ERROR VERIFICANDO TOKEN:', error.message);
        const message = error.code === 'auth/id-token-expired' ? 'El token expiró' : 'Token inválido';
        return res.status(401).json({ success: false, message });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.middleware.js.map