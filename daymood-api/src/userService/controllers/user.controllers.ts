import * as userService from '../services/user.services'
import { Request, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'

const calculateAge = (birthday: string | Date): number => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const register = async (req: Request, res: Response) => {
    try {
        const { firebase_uid, username, email, birth_day } = req.body

        if (!firebase_uid || !username || !email || !birth_day) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos los campos son obligatorios' 
            })
        }

        const age = calculateAge(birth_day);
        if (age < 18) {
            return res.status(403).json({ 
                success: false, 
                message: 'Debes ser mayor de 18 años para registrarte' 
            });
        }

        const user = await userService.registerUser({ firebase_uid, username, email, birth_day })
        res.status(201).json({ success: true, data: user })

    } catch (error: any) {
        if (error.message === 'El usuario ya existe') {
            return res.status(409).json({ success: false, message: error.message })
        }
        console.error('Error en register:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { firebase_uid } = req.body

        if (!firebase_uid) {
            return res.status(400).json({ 
                success: false, 
                message: 'firebase_uid es obligatorio' 
            })
        }

        const user = await userService.loginUser(firebase_uid)
        res.json({ success: true, data: user })

    } catch (error: any) {
        if (error.message === 'Usuario no encontrado en la BD') {
            return res.status(404).json({ success: false, message: error.message })
        }
        console.error('Error en login:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        })
    }
}

// devuelve los datos del usuario autenticado
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        res.json({ success: true, data: req.user })
    } catch (error: any) {
        console.error('Error en getMe:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        })
    }
}