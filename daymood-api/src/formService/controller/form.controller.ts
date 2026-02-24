import * as formService from "../service/form.service";
import { Request, Response, NextFunction } from 'express';


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
            return res.status(400).json({ message: "ID inválido" });
        }
        const form = await formService.getFormById(id);
        res.json(form);
    } catch (error) {
        next(error);
    }
};