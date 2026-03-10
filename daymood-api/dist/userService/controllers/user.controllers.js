"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const userService = __importStar(require("../services/user.services"));
const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
const register = async (req, res) => {
    try {
        const { firebase_uid, username, email, birth_day } = req.body;
        if (!firebase_uid || !username || !email || !birth_day) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }
        const age = calculateAge(birth_day);
        if (age < 18) {
            return res.status(403).json({
                success: false,
                message: 'Debes ser mayor de 18 años para registrarte'
            });
        }
        const user = await userService.registerUser({ firebase_uid, username, email, birth_day });
        res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        if (error.message === 'El usuario ya existe') {
            return res.status(409).json({ success: false, message: error.message });
        }
        console.error('Error en register:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { firebase_uid } = req.body;
        if (!firebase_uid) {
            return res.status(400).json({
                success: false,
                message: 'firebase_uid es obligatorio'
            });
        }
        const user = await userService.loginUser(firebase_uid);
        res.json({ success: true, data: user });
    }
    catch (error) {
        if (error.message === 'Usuario no encontrado en la BD') {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.login = login;
// devuelve los datos del usuario autenticado
const getMe = async (req, res) => {
    try {
        res.json({ success: true, data: req.user });
    }
    catch (error) {
        console.error('Error en getMe:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=user.controllers.js.map