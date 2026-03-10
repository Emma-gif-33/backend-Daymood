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
exports.postForm = exports.getByWeek = exports.getById = exports.getAll = void 0;
const formService = __importStar(require("../service/form.service"));
const getAll = async (req, res, next) => {
    try {
        const forms = await formService.getAllForms();
        res.json(forms);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(404).json({ message: "ID inválido, intente con uno existente." });
        }
        const form = await formService.getFormById(id);
        res.json(form);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const getByWeek = async (req, res, next) => {
    try {
        const { date } = req.query;
        if (!date || typeof date !== 'string') {
            return res.status(400).json({ message: "Se solicita un formato de fecha válido (?date=YYYY-MM-DD)" });
        }
        const forms = await formService.getFormsByWeek(date);
        res.json(forms);
    }
    catch (error) {
        next(error);
    }
};
exports.getByWeek = getByWeek;
const postForm = async (req, res) => {
    try {
        const { answers } = req.body;
        const userId = req.user.id;
        const savedForm = await formService.saveWeeklyForm(userId, answers);
        return res.status(201).json({
            success: true,
            message: "Cuestionario semanal guardado correctamente",
            data: savedForm
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.postForm = postForm;
//# sourceMappingURL=form.controller.js.map