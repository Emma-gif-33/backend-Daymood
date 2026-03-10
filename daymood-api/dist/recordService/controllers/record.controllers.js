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
exports.getMonthPreview = exports.getByDate = exports.getByMonth = exports.create = void 0;
const recordService = __importStar(require("../services/record.services"));
const handleError = (error, res) => {
    const businessErrors = [
        'La fecha es obligatoria',
        'La emoción es obligatoria',
        'Debes seleccionar al menos un hábito',
        'No puedes registrar una fecha futura',
        'Ya tienes un registro para esta fecha',
        'Emoción no encontrada',
        'Usuario no encontrado en la BD',
        'No puedes seleccionar dos hábitos de la misma categoría',
        'Hábito no encontrado',
        'obligatori',
        'inválid',
        'Fecha'
    ];
    if (businessErrors.some(e => error.message?.includes(e))) {
        return res.status(400).json({ success: false, message: error.message });
    }
    // Error de servidor
    console.error('Error interno:', error);
    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor. Intenta de nuevo más tarde.'
    });
};
const create = async (req, res, next) => {
    try {
        const record = await recordService.createRecord(req.user.uid, req.body);
        res.status(201).json({ success: true, data: record });
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.create = create;
const getByMonth = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);
        if (isNaN(year) || isNaN(month)) {
            return res.status(400).json({
                success: false,
                message: 'Año y mes deben ser números válidos'
            });
        }
        const records = await recordService.getRecordsByMonth(req.user.uid, year, month);
        res.json({ success: true, data: records });
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.getByMonth = getByMonth;
const getByDate = async (req, res, next) => {
    try {
        const date = req.query.date;
        const record = await recordService.getRecordByDate(req.user.uid, date);
        if (!record) {
            return res.json({
                success: true,
                data: null,
                message: 'No se ha registrado nada para este día'
            });
        }
        res.json({ success: true, data: record });
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.getByDate = getByDate;
// devuelve fecha + imagen de emoción para el calendario
const getMonthPreview = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year);
        const month = parseInt(req.query.month);
        if (isNaN(year) || isNaN(month)) {
            return res.status(400).json({
                success: false,
                message: 'Año y mes deben ser números válidos'
            });
        }
        const preview = await recordService.getMonthPreview(req.user.uid, year, month);
        res.json({ success: true, data: preview });
    }
    catch (error) {
        handleError(error, res);
    }
};
exports.getMonthPreview = getMonthPreview;
//# sourceMappingURL=record.controllers.js.map