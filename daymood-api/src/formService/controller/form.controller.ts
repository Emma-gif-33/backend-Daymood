import * as formService from "../service/form.service";
import { Request, Response, NextFunction } from 'express';
import {AuthRequest} from "../../middlewares/auth.middleware";


export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const forms = await formService.getAllForms();
        res.json(forms);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(404).json({ message: "ID inválido, intente con uno existente." });
        }
        const form = await formService.getFormById(id);
        res.json(form);
    } catch (error) {
        next(error);
    }
};

export const getByWeek = async (req: any, res: any, next: any) => {
    try {
        const { date } = req.query;

        if (!date || typeof date !== 'string') {
            return res.status(400).json({ message: "Se solicita un formato de fecha válido (?date=YYYY-MM-DD)" });
        }
        const forms = await formService.getFormsByWeek(date);
        res.json(forms);
    } catch (error) {
        next(error);
    }
};

export const postForm = async (req: AuthRequest, res: Response) => {
    try {
        const { answers } = req.body;
        const userId = req.user.id;

        const savedForm = await formService.saveWeeklyForm(userId, answers);

        return res.status(201).json({
            success: true,
            message: "Cuestionario semanal guardado correctamente",
            data: savedForm
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};